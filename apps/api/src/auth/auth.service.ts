import { createHash, randomBytes } from 'node:crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { EnvironmentVariables } from '../config/environment';
import { Prisma, UserStatus } from '../generated/prisma/client';
import { PrismaService } from '../infrastructure/database/prisma.service';
import {
  ACCESS_TOKEN_AUDIENCE,
  ACCESS_TOKEN_ISSUER,
  AUTH_MESSAGES,
} from './auth.constants';
import {
  AccessTokenPayload,
  AuthenticatedUser,
} from './domain/authenticated-user';
import { PasswordService } from './password.service';

interface SessionContext {
  ipAddress?: string;
  userAgent?: string;
}

export interface SafeUser extends AuthenticatedUser {
  email: string;
}

export interface AuthResult {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  user: SafeUser;
}

const publicUserSelect = {
  id: true,
  gymId: true,
  email: true,
  role: true,
  status: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class AuthService {
  private readonly dummyHash: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
    private readonly passwords: PasswordService,
  ) {
    this.dummyHash = this.passwords.hash(randomBytes(32).toString('base64url'));
  }

  async login(
    email: string,
    password: string,
    context: SessionContext,
  ): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { ...publicUserSelect, passwordHash: true },
    });
    const passwordHash = user?.passwordHash || (await this.dummyHash);
    const passwordMatches = await this.passwords.verify(passwordHash, password);

    if (
      !user ||
      !user.passwordHash ||
      !passwordMatches ||
      user.status !== UserStatus.ACTIVE
    ) {
      throw new UnauthorizedException(AUTH_MESSAGES.invalidCredentials);
    }

    return this.createAuthenticatedSession(user, context);
  }

  async refresh(
    refreshToken: string | undefined,
    context: SessionContext,
  ): Promise<AuthResult> {
    if (!refreshToken) this.invalidSession();

    const tokenHash = this.hashRefreshToken(refreshToken);
    const replacementToken = this.generateRefreshToken();
    const replacementHash = this.hashRefreshToken(replacementToken);
    const expiresAt = this.refreshExpirationDate();

    const user = await this.prisma.$transaction(
      async (transaction) => {
        const session = await transaction.refreshSession.findUnique({
          where: { tokenHash },
          include: { user: { select: publicUserSelect } },
        });

        if (
          !session ||
          session.revokedAt ||
          session.expiresAt <= new Date() ||
          session.user.status !== UserStatus.ACTIVE
        ) {
          this.invalidSession();
        }

        const replacement = await transaction.refreshSession.create({
          data: {
            userId: session.userId,
            tokenHash: replacementHash,
            expiresAt,
            ...context,
          },
          select: { id: true },
        });
        const revoked = await transaction.refreshSession.updateMany({
          where: { id: session.id, revokedAt: null },
          data: {
            revokedAt: new Date(),
            replacedBySessionId: replacement.id,
          },
        });

        if (revoked.count !== 1) this.invalidSession();

        return session.user;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return {
      ...(await this.createAccessToken(user)),
      refreshToken: replacementToken,
      user: this.toSafeUser(user),
    };
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    await this.prisma.refreshSession.updateMany({
      where: {
        tokenHash: this.hashRefreshToken(refreshToken),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  async getCurrentUser(identity: AuthenticatedUser): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: identity.id },
      select: publicUserSelect,
    });

    if (
      !user ||
      user.status !== UserStatus.ACTIVE ||
      user.gymId !== identity.gymId
    ) {
      this.invalidSession();
    }

    return this.toSafeUser(user);
  }

  private async createAuthenticatedSession(
    user: SafeUser & { status: UserStatus },
    context: SessionContext,
  ): Promise<AuthResult> {
    const refreshToken = this.generateRefreshToken();

    await this.prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: this.hashRefreshToken(refreshToken),
        expiresAt: this.refreshExpirationDate(),
        ...context,
      },
    });

    return {
      ...(await this.createAccessToken(user)),
      refreshToken,
      user: this.toSafeUser(user),
    };
  }

  private async createAccessToken(user: AuthenticatedUser) {
    const expiresIn = this.config.get('JWT_ACCESS_TTL_SECONDS', {
      infer: true,
    });
    const payload: AccessTokenPayload = {
      sub: user.id,
      gymId: user.gymId,
      role: user.role,
    };

    return {
      accessToken: await this.jwt.signAsync(payload, {
        algorithm: 'HS256',
        audience: ACCESS_TOKEN_AUDIENCE,
        issuer: ACCESS_TOKEN_ISSUER,
        expiresIn,
      }),
      expiresIn,
    };
  }

  private toSafeUser(user: SafeUser & { status: UserStatus }): SafeUser {
    return {
      id: user.id,
      gymId: user.gymId,
      email: user.email,
      role: user.role,
    };
  }

  private generateRefreshToken(): string {
    return randomBytes(48).toString('base64url');
  }

  private hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private refreshExpirationDate(): Date {
    const days = this.config.get('REFRESH_SESSION_TTL_DAYS', { infer: true });
    return new Date(Date.now() + days * 24 * 60 * 60 * 1_000);
  }

  private invalidSession(): never {
    throw new UnauthorizedException(AUTH_MESSAGES.invalidSession);
  }
}
