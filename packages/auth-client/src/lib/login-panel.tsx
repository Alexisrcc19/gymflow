'use client';

import { useState, type FormEvent } from 'react';

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@gymflow/ui';

import { AuthApiError } from './auth-api';
import { useAuth } from './auth-context';

export interface LoginPanelProps {
  description: string;
  portalName: string;
}

export function LoginPanel({ description, portalName }: LoginPanelProps) {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const email = event.currentTarget.elements.namedItem('email');
    const password = event.currentTarget.elements.namedItem('password');
    if (
      !(email instanceof HTMLInputElement) ||
      !(password instanceof HTMLInputElement)
    ) {
      setError('No se pudo leer el formulario de inicio de sesión.');
      setSubmitting(false);
      return;
    }

    try {
      await login(email.value, password.value);
    } catch (caught) {
      setError(
        caught instanceof AuthApiError && caught.status === 401
          ? 'El correo electrónico o la contraseña son incorrectos.'
          : caught instanceof AuthApiError
            ? caught.message
            : 'No se pudo iniciar sesión. Inténtalo nuevamente.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.72fr)]">
      <section className="relative hidden overflow-hidden bg-[#1b2630] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(42,127,123,0.32),transparent_38%),linear-gradient(145deg,transparent_45%,rgba(255,255,255,0.035))]" />
        <div className="absolute -bottom-40 -right-40 size-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -right-24 size-64 rounded-full border border-primary/40" />
        <div className="relative flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold">
            GF
          </span>
          <div>
            <p className="font-display font-semibold">GymFlow</p>
            <p className="text-xs text-white/60">Gestión con claridad</p>
          </div>
        </div>
        <div className="relative max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-soft">
            Control para avanzar
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight xl:text-5xl">
            Cada entrenamiento comienza con un gimnasio bien gestionado.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
            Miembros, membresías, asistencias y operaciones de entrenamiento en
            un solo espacio de trabajo.
          </p>
        </div>
        <p className="relative text-xs text-white/45">
          Plataforma demo de GymFlow
        </p>
      </section>

      <section className="flex min-w-0 items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-white">
              GF
            </span>
            <div>
              <p className="font-display font-semibold text-foreground">
                GymFlow
              </p>
              <p className="text-xs text-muted-foreground">{portalName}</p>
            </div>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="space-y-2 p-6 pb-3 sm:p-8 sm:pb-4">
              <CardTitle className="font-display text-2xl">
                Te damos la bienvenida
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-3 sm:p-8 sm:pt-4">
              <form className="space-y-5" onSubmit={submit}>
                {error ? (
                  <Alert role="alert" variant="danger">
                    <AlertDescription className="mt-0 text-current">
                      {error}
                    </AlertDescription>
                  </Alert>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    autoComplete="email"
                    autoFocus
                    id="email"
                    inputMode="email"
                    inputSize="lg"
                    maxLength={254}
                    name="email"
                    placeholder="tu@ejemplo.com"
                    required
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    autoComplete="current-password"
                    id="password"
                    inputSize="lg"
                    maxLength={128}
                    minLength={8}
                    name="password"
                    required
                    type="password"
                  />
                </div>

                <Button
                  className="w-full"
                  loading={submitting}
                  size="lg"
                  type="submit"
                >
                  {submitting ? 'Iniciando sesión' : 'Iniciar sesión'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            El acceso está limitado a usuarios autorizados de GymFlow.
          </p>
        </div>
      </section>
    </main>
  );
}
