'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AuthProvider, useAuth } from '@gymflow/auth-client';

const allowedRoles = ['MEMBER'] as const;

export function MemberAuth({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      allowedRoles={allowedRoles}
      apiUrl={
        process.env.NEXT_PUBLIC_GYMFLOW_API_URL ??
        'http://localhost:3333/api/v1'
      }
    >
      <MemberAuthGate>{children}</MemberAuthGate>
    </AuthProvider>
  );
}

function MemberAuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useAuth();
  const loginRoute = pathname === '/login';

  useEffect(() => {
    if (status === 'unauthenticated' && !loginRoute) router.replace('/login');
    if (status === 'authenticated' && loginRoute) router.replace('/');
  }, [loginRoute, router, status]);

  if (status === 'loading') return <PortalLoading />;
  if (status === 'unauthenticated') {
    return loginRoute ? children : <PortalLoading />;
  }
  if (loginRoute) return <PortalLoading />;
  return children;
}

function PortalLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3" role="status">
        <span className="size-7 animate-spin rounded-full border-2 border-primary border-r-transparent" />
        <span className="text-sm text-muted-foreground">Cargando GymFlow</span>
      </div>
    </main>
  );
}
