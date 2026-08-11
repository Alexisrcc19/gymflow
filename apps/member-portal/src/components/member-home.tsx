'use client';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@gymflow/ui';
import { useAuth } from '@gymflow/auth-client';

export function MemberHome() {
  const { logout, user } = useAuth();

  return (
    <main className="min-h-dvh bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">GymFlow</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Portal de Miembros
            </h1>
          </div>
          <Button onClick={() => void logout()} variant="secondary">
            Cerrar sesión
          </Button>
        </header>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Te damos la bienvenida a GymFlow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sesión iniciada como{' '}
              <span className="font-medium text-foreground">{user?.email}</span>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
