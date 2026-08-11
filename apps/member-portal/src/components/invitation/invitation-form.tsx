'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';

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
  Spinner,
} from '@gymflow/ui';

interface InvitationDetails {
  email: string;
  expiresAt: string;
  firstName: string;
}

const apiUrl =
  process.env.NEXT_PUBLIC_GYMFLOW_API_URL ?? 'http://localhost:3333/api/v1';

export function InvitationForm({ token }: { token: string }) {
  const [details, setDetails] = useState<InvitationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('El enlace de invitación está incompleto.');
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/invitations/${encodeURIComponent(token)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseMessage(response));
        return response.json() as Promise<InvitationDetails>;
      })
      .then(setDetails)
      .catch((caught: unknown) =>
        setError(
          caught instanceof Error
            ? caught.message
            : 'No se pudo validar la invitación.',
        ),
      )
      .finally(() => setLoading(false));
  }, [token]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') ?? '');
    const confirmation = String(form.get('confirmation') ?? '');
    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/invitations/accept`, {
        body: JSON.stringify({ token, password }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      });
      if (!response.ok) throw new Error(await responseMessage(response));
      setCompleted(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'No se pudo crear la contraseña.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-7 flex items-center justify-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-white">
            GF
          </span>
          <p className="font-display font-semibold text-foreground">GymFlow</p>
        </div>

        <Card>
          {completed ? (
            <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
                <span aria-hidden="true" className="text-xl font-bold">
                  ✓
                </span>
              </span>
              <CardTitle className="mt-5">Contraseña creada</CardTitle>
              <CardDescription className="mt-2">
                Tu acceso está listo. Ya puedes iniciar sesión en GymFlow.
              </CardDescription>
              <Link
                className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                href="/login"
              >
                Ir al inicio de sesión
              </Link>
            </CardContent>
          ) : (
            <>
              <CardHeader className="space-y-2 border-b border-border">
                <span className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <span
                    aria-hidden="true"
                    className="font-display text-xs font-bold"
                  >
                    GF
                  </span>
                </span>
                <CardTitle className="pt-2">Crea tu contraseña</CardTitle>
                <CardDescription>
                  {details
                    ? `Hola, ${details.firstName}. Configura el acceso para ${details.email}.`
                    : 'Estamos validando tu invitación de acceso.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <div
                    className="flex items-center justify-center gap-3 py-8"
                    role="status"
                  >
                    <Spinner label="Validando invitación" size="sm" />
                    <span className="text-sm text-muted-foreground">
                      Validando invitación
                    </span>
                  </div>
                ) : null}

                {error ? (
                  <Alert role="alert" variant="danger">
                    <AlertDescription className="mt-0 text-current">
                      {error}
                    </AlertDescription>
                  </Alert>
                ) : null}

                {details ? (
                  <form className="space-y-5" onSubmit={submit}>
                    <div className="space-y-2">
                      <Label htmlFor="password">Nueva contraseña</Label>
                      <Input
                        autoComplete="new-password"
                        id="password"
                        minLength={12}
                        name="password"
                        required
                        type="password"
                      />
                      <p className="text-xs text-muted-foreground">
                        Utiliza al menos 12 caracteres.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmation">Confirmar contraseña</Label>
                      <Input
                        autoComplete="new-password"
                        id="confirmation"
                        minLength={12}
                        name="confirmation"
                        required
                        type="password"
                      />
                    </div>
                    <Button
                      className="w-full"
                      loading={submitting}
                      type="submit"
                    >
                      {submitting ? 'Creando contraseña' : 'Crear contraseña'}
                    </Button>
                  </form>
                ) : null}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}

async function responseMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join('. ');
    if (body.message) return body.message;
  } catch {
    // La respuesta puede no contener JSON.
  }
  return 'No se pudo completar la solicitud.';
}
