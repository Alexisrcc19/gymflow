import type { Metadata } from 'next';

import { InvitationForm } from '../../components/invitation/invitation-form';

export const metadata: Metadata = {
  title: 'Crear contraseña',
};

export default async function InvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = '' } = await searchParams;
  return <InvitationForm token={token} />;
}
