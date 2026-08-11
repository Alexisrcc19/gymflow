import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

import type { EnvironmentVariables } from '../../config/environment';

interface MemberInvitationEmail {
  email: string;
  expiresAt: Date;
  firstName: string;
  invitationUrl: string;
}

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {
    const user = config.get('SMTP_USER', { infer: true });
    const password = config.get('SMTP_PASSWORD', { infer: true });
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST', { infer: true }),
      port: config.get('SMTP_PORT', { infer: true }),
      secure: config.get('SMTP_SECURE', { infer: true }),
      auth: user && password ? { user, pass: password } : undefined,
    });
  }

  async sendMemberInvitation(input: MemberInvitationEmail): Promise<void> {
    const expiration = new Intl.DateTimeFormat('es-EC', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'America/Guayaquil',
    }).format(input.expiresAt);
    const safeName = escapeHtml(input.firstName);
    const safeUrl = escapeHtml(input.invitationUrl);

    await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM', { infer: true }),
      to: input.email,
      subject: 'Completa tu acceso a GymFlow',
      text: [
        `Hola ${input.firstName},`,
        '',
        'Tu perfil de GymFlow está listo. Crea tu contraseña desde este enlace:',
        input.invitationUrl,
        '',
        `El enlace estará disponible hasta ${expiration}.`,
        'Si no esperabas esta invitación, puedes ignorar este mensaje.',
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;color:#1f2933;line-height:1.6;max-width:560px;margin:0 auto">
          <h1 style="font-size:24px">Tu acceso a GymFlow está listo</h1>
          <p>Hola ${safeName},</p>
          <p>El gimnasio creó tu perfil. Usa el siguiente botón para establecer tu contraseña:</p>
          <p style="margin:28px 0">
            <a href="${safeUrl}" style="background:#2a7f7b;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Crear mi contraseña</a>
          </p>
          <p>Este enlace estará disponible hasta <strong>${escapeHtml(expiration)}</strong> y solo puede utilizarse una vez.</p>
          <p style="color:#6b7580;font-size:13px">Si no esperabas esta invitación, puedes ignorar este mensaje.</p>
        </div>
      `,
    });
  }
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[character] ?? character,
  );
}
