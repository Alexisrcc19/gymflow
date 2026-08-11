import './global.css';

import type { Metadata, Viewport } from 'next';

import { AdminAuth } from '../components/auth/portal-auth';

export const metadata: Metadata = {
  title: {
    default: 'Panel de control | GymFlow',
    template: '%s | GymFlow',
  },
  description:
    'Portal administrativo de GymFlow para la operación diaria del gimnasio.',
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
        <AdminAuth>{children}</AdminAuth>
      </body>
    </html>
  );
}
