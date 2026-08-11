import './global.css';

import type { Metadata, Viewport } from 'next';

import { AdminShell } from '../components/app-shell/admin-shell';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard | GymFlow',
    template: '%s | GymFlow',
  },
  description: 'GymFlow administration portal for daily gym operations.',
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
    <html lang="en">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
