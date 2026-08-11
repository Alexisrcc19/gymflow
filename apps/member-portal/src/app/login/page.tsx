import type { Metadata } from 'next';

import { LoginPanel } from '@gymflow/auth-client';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
};

export default function LoginPage() {
  return (
    <LoginPanel
      description="Inicia sesión para consultar tu membresía, asistencias y rutinas."
      portalName="Portal de Miembros"
    />
  );
}
