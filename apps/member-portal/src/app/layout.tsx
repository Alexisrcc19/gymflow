import './global.css';

import type { Metadata, Viewport } from 'next';

import { MemberAuth } from '../components/auth/portal-auth';

export const metadata: Metadata = {
  title: {
    default: 'Portal de Miembros | GymFlow',
    template: '%s | GymFlow',
  },
  description: 'Portal de GymFlow para membresías, asistencias y rutinas.',
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <MemberAuth>{children}</MemberAuth>
      </body>
    </html>
  );
}
