import { ConfigService } from '@nestjs/config';

import { PasswordService } from '../auth/password.service';
import type { EnvironmentVariables } from '../config/environment';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { MailService } from '../infrastructure/mail/mail.service';
import { InvitationsService } from './invitations.service';

describe('InvitationsService', () => {
  const expiresAt = new Date(Date.now() + 60_000);
  const invitation = {
    id: 'invitation-id',
    userId: 'user-id',
    expiresAt,
    acceptedAt: null,
    revokedAt: null,
    user: {
      email: 'member@example.com',
      memberProfile: { firstName: 'Alex' },
    },
  };

  function setup() {
    const transaction = {
      accountInvitation: {
        create: jest.fn().mockResolvedValue({ id: invitation.id }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      user: { update: jest.fn().mockResolvedValue({ id: invitation.userId }) },
    };
    const prisma = {
      accountInvitation: {
        findUnique: jest.fn().mockResolvedValue(invitation),
      },
      $transaction: jest.fn(async (callback) => callback(transaction)),
    };
    const passwords = { hash: jest.fn().mockResolvedValue('password-hash') };
    const mail = {
      sendMemberInvitation: jest.fn().mockResolvedValue(undefined),
    };
    const values: Partial<EnvironmentVariables> = {
      INVITATION_TTL_HOURS: 48,
      MEMBER_PORTAL_URL: 'http://localhost:4201',
    };
    const config = {
      get: jest.fn((key: keyof EnvironmentVariables) => values[key]),
    };
    const service = new InvitationsService(
      prisma as unknown as PrismaService,
      passwords as unknown as PasswordService,
      mail as unknown as MailService,
      config as unknown as ConfigService<EnvironmentVariables, true>,
    );

    return { mail, passwords, prisma, service, transaction };
  }

  it('stores only a token hash and sends the raw token in the invitation link', async () => {
    const { mail, service, transaction } = setup();

    await service.issue('admin-id', {
      email: 'member@example.com',
      firstName: 'Alex',
      userId: 'user-id',
    });

    const storedHash = transaction.accountInvitation.create.mock.calls[0][0]
      .data.tokenHash as string;
    const sentUrl = mail.sendMemberInvitation.mock.calls[0][0]
      .invitationUrl as string;
    expect(storedHash).toMatch(/^[a-f0-9]{64}$/);
    expect(sentUrl).toMatch(/^http:\/\/localhost:4201\/invitation\?token=/);
    expect(sentUrl).not.toContain(storedHash);
  });

  it('returns masked invitation details', async () => {
    const { service } = setup();

    await expect(service.details('raw-token')).resolves.toMatchObject({
      email: 'me****@example.com',
      firstName: 'Alex',
    });
  });

  it('sets the password and consumes the invitation atomically', async () => {
    const { passwords, service, transaction } = setup();

    await service.accept('raw-token', 'a-secure-new-password');

    expect(passwords.hash).toHaveBeenCalledWith('a-secure-new-password');
    expect(transaction.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ passwordHash: 'password-hash' }),
      }),
    );
    expect(transaction.accountInvitation.updateMany).toHaveBeenCalledTimes(2);
  });
});
