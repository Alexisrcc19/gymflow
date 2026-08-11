import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { EnvironmentVariables } from '../config/environment';
import { UserRole, UserStatus } from '../generated/prisma/enums';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';

describe('AuthService', () => {
  const user = {
    id: '4c92d4cb-4c07-4e48-99be-3b144a3cac47',
    gymId: 'e88a318d-6865-42d7-adbf-75a0d24ee665',
    email: 'admin@gymflow.local',
    passwordHash: 'stored-password-hash' as string | null,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  };

  function createService(
    passwordMatches: boolean,
    foundUser: typeof user | null = user,
  ) {
    const prisma = {
      user: { findUnique: jest.fn().mockResolvedValue(foundUser) },
      refreshSession: {
        create: jest.fn().mockResolvedValue({ id: 'session-id' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const jwt = { signAsync: jest.fn().mockResolvedValue('access-token') };
    const configValues: Partial<EnvironmentVariables> = {
      JWT_ACCESS_TTL_SECONDS: 900,
      REFRESH_SESSION_TTL_DAYS: 30,
    };
    const config = {
      get: jest.fn((key: keyof EnvironmentVariables) => configValues[key]),
    };
    const passwords = {
      hash: jest.fn().mockResolvedValue('dummy-password-hash'),
      verify: jest.fn().mockResolvedValue(passwordMatches),
    };

    return {
      prisma,
      service: new AuthService(
        prisma as unknown as PrismaService,
        jwt as unknown as JwtService,
        config as unknown as ConfigService<EnvironmentVariables, true>,
        passwords as unknown as PasswordService,
      ),
    };
  }

  it('creates a renewable session after valid credentials', async () => {
    const { prisma, service } = createService(true);

    const result = await service.login(
      ' ADMIN@GYMFLOW.LOCAL ',
      'valid-password',
      {},
    );

    expect(result).toMatchObject({
      accessToken: 'access-token',
      expiresIn: 900,
      user: {
        id: user.id,
        email: user.email,
        gymId: user.gymId,
        role: UserRole.ADMIN,
      },
    });
    expect(result.refreshToken).toHaveLength(64);
    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: user.email } }),
    );
    expect(prisma.refreshSession.create).toHaveBeenCalledTimes(1);
  });

  it('returns the same generic error when credentials are invalid', async () => {
    const { service } = createService(false, null);

    await expect(
      service.login('missing@gymflow.local', 'invalid-password', {}),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('does not authenticate an invited user before a password is created', async () => {
    const { service } = createService(true, { ...user, passwordHash: null });

    await expect(
      service.login('member@gymflow.local', 'any-password', {}),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('makes logout idempotent when no refresh token is present', async () => {
    const { prisma, service } = createService(true);

    await expect(service.logout(undefined)).resolves.toBeUndefined();
    expect(prisma.refreshSession.updateMany).not.toHaveBeenCalled();
  });
});
