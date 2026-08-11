import type { Metadata } from 'next';

import { LoginPanel } from '@gymflow/auth-client';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
};

export default function LoginPage() {
  return (
    <LoginPanel
      description="Inicia sesión para gestionar las operaciones del gimnasio y la actividad de los miembros."
      portalName="Portal Administrativo"
    />
  );
}
