import { createHash, randomBytes } from 'node:crypto';

import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PasswordService } from '../auth/password.service';
import type { EnvironmentVariables } from '../config/environment';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { MailService } from '../infrastructure/mail/mail.service';

interface InvitationRecipient {
  email: string;
  firstName: string;
  userId: string;
}

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly mail: MailService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  async issue(createdById: string, recipient: InvitationRecipient) {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = this.expirationDate();

    await this.prisma.$transaction(async (transaction) => {
      await transaction.accountInvitation.updateMany({
        where: {
          userId: recipient.userId,
          acceptedAt: null,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
      await transaction.accountInvitation.create({
        data: {
          userId: recipient.userId,
          createdById,
          tokenHash: hashToken(token),
          expiresAt,
        },
      });
    });

    const baseUrl = this.config
      .get('MEMBER_PORTAL_URL', { infer: true })
      .replace(/\/$/, '');
    await this.mail.sendMemberInvitation({
      email: recipient.email,
      firstName: recipient.firstName,
      expiresAt,
      invitationUrl: `${baseUrl}/invitation?token=${encodeURIComponent(token)}`,
    });

    return { expiresAt };
  }

  async details(token: string) {
    const invitation = await this.findAvailable(token);
    return {
      email: maskEmail(invitation.user.email),
      expiresAt: invitation.expiresAt,
      firstName: invitation.user.memberProfile?.firstName ?? 'miembro',
    };
  }

  async accept(token: string, password: string): Promise<void> {
    const invitation = await this.findAvailable(token);
    const passwordHash = await this.passwords.hash(password);
    const now = new Date();

    await this.prisma.$transaction(async (transaction) => {
      const accepted = await transaction.accountInvitation.updateMany({
        where: {
          id: invitation.id,
          acceptedAt: null,
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: { acceptedAt: now },
      });
      if (accepted.count !== 1) {
        throw new GoneException('La invitación ya no está disponible');
      }

      await transaction.user.update({
        where: { id: invitation.userId },
        data: { passwordHash, emailVerifiedAt: now },
      });
      await transaction.accountInvitation.updateMany({
        where: {
          userId: invitation.userId,
          id: { not: invitation.id },
          acceptedAt: null,
          revokedAt: null,
        },
        data: { revokedAt: now },
      });
    });
  }

  private async findAvailable(token: string) {
    const invitation = await this.prisma.accountInvitation.findUnique({
      where: { tokenHash: hashToken(token) },
      include: {
        user: {
          select: {
            email: true,
            memberProfile: { select: { firstName: true } },
          },
        },
      },
    });
    if (!invitation) throw new NotFoundException('Invitación no encontrada');
    if (
      invitation.acceptedAt ||
      invitation.revokedAt ||
      invitation.expiresAt <= new Date()
    ) {
      throw new GoneException('La invitación ya no está disponible');
    }
    return invitation;
  }

  private expirationDate(): Date {
    const hours = this.config.get('INVITATION_TTL_HOURS', { infer: true });
    return new Date(Date.now() + hours * 60 * 60 * 1_000);
  }
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}${'*'.repeat(Math.max(2, name.length - visible.length))}@${domain}`;
}
