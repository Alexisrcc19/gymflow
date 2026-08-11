'use client';

import {
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  UserPlus,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';

import { useAuth } from '@gymflow/auth-client';
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  Label,
  Select,
  Skeleton,
} from '@gymflow/ui';

interface Member {
  id: string;
  memberCode: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  joinedAt: string;
  user: { email: string };
}

interface MembersResponse {
  items: Member[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const initialResponse: MembersResponse = {
  items: [],
  pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
};

export default function MembersPage() {
  const { authenticatedFetch, user } = useAuth();
  const [data, setData] = useState(initialResponse);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createdMessage, setCreatedMessage] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), pageSize: '20' });
    if (appliedSearch) params.set('search', appliedSearch);
    if (status) params.set('status', status);

    try {
      const response = await authenticatedFetch(`/members?${params}`);
      if (!response.ok) throw new Error(await responseMessage(response));
      setData((await response.json()) as MembersResponse);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'No se pudo cargar la lista de miembros.',
      );
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, authenticatedFetch, page, status]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(search.trim());
  }

  async function createMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError(null);
    setCreatedMessage(null);
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = Object.fromEntries(
      [...values.entries()].filter(([, value]) => value !== ''),
    );

    try {
      const response = await authenticatedFetch('/members', {
        body: JSON.stringify(payload),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      });
      if (!response.ok) throw new Error(await responseMessage(response));
      const member = (await response.json()) as Member;
      form.reset();
      setCreatedMessage(
        `${member.firstName} ${member.lastName} fue registrado con el código ${member.memberCode}.`,
      );
      setPage(1);
      await loadMembers();
      return true;
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'No se pudo registrar el miembro.',
      );
      return false;
    } finally {
      setCreating(false);
    }
  }

  const canCreate = user?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">Operaciones</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Gestión de miembros
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulta y administra los perfiles registrados en el gimnasio.
        </p>
      </header>

      {error ? (
        <Alert role="alert" variant="danger">
          <AlertDescription className="mt-0 text-current">
            {error}
          </AlertDescription>
        </Alert>
      ) : null}
      {createdMessage ? (
        <Alert role="status" variant="success">
          <AlertDescription className="mt-0 text-current">
            {createdMessage}
          </AlertDescription>
        </Alert>
      ) : null}

      <div
        className={
          canCreate
            ? 'grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]'
            : 'min-w-0'
        }
      >
        <Card className="min-w-0">
          <CardHeader className="border-b border-border">
            <CardTitle>Miembros</CardTitle>
            <CardDescription>
              {data.pagination.total} perfiles encontrados
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form
              className="grid gap-3 border-b border-border p-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto]"
              onSubmit={applyFilters}
            >
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={17}
                />
                <Input
                  aria-label="Buscar miembros"
                  className="pl-9"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nombre, código o correo"
                  type="search"
                  value={search}
                />
              </div>
              <Select
                aria-label="Filtrar por estado"
                onChange={(event) => {
                  setPage(1);
                  setStatus(event.target.value);
                }}
                value={status}
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVE">Activos</option>
                <option value="INACTIVE">Inactivos</option>
              </Select>
              <Button type="submit" variant="secondary">
                Buscar
              </Button>
            </form>

            {loading ? (
              <MembersSkeleton />
            ) : data.items.length === 0 ? (
              <EmptyState
                className="m-4 border-0 py-16"
                description="Prueba con otros filtros o registra el primer miembro."
                icon={<Users size={20} />}
                title="No hay miembros para mostrar"
              />
            ) : (
              <MembersList members={data.items} />
            )}

            <footer className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Página {data.pagination.page} de{' '}
                {Math.max(1, data.pagination.totalPages)}
              </span>
              <div className="flex gap-2">
                <Button
                  aria-label="Página anterior"
                  disabled={loading || page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  size="sm"
                  variant="secondary"
                >
                  <ChevronLeft aria-hidden="true" size={16} />
                  Anterior
                </Button>
                <Button
                  aria-label="Página siguiente"
                  disabled={
                    loading || page >= Math.max(1, data.pagination.totalPages)
                  }
                  onClick={() => setPage((current) => current + 1)}
                  size="sm"
                  variant="secondary"
                >
                  Siguiente
                  <ChevronRight aria-hidden="true" size={16} />
                </Button>
              </div>
            </footer>
          </CardContent>
        </Card>

        {canCreate ? (
          <CreateMemberCard creating={creating} onSubmit={createMember} />
        ) : null}
      </div>
    </div>
  );
}

function MembersList({ members }: { members: Member[] }) {
  return (
    <>
      <ul className="divide-y divide-border md:hidden">
        {members.map((member) => (
          <li className="space-y-2 p-4" key={member.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {member.memberCode} · {member.user.email}
                </p>
              </div>
              <MemberStatus status={member.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              Ingreso: {formatDate(member.joinedAt)}
            </p>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Miembro</th>
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Ingreso</th>
              <th className="px-5 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                className="border-b border-border last:border-0"
                key={member.id}
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.memberCode}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-foreground">{member.user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.phone ?? 'Sin teléfono'}
                  </p>
                </td>
                <td className="px-4 py-4 text-muted-foreground">
                  {formatDate(member.joinedAt)}
                </td>
                <td className="px-5 py-4">
                  <MemberStatus status={member.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MemberStatus({ status }: { status: Member['status'] }) {
  return (
    <Badge showDot variant={status === 'ACTIVE' ? 'success' : 'neutral'}>
      {status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
    </Badge>
  );
}

function CreateMemberCard({
  creating,
  onSubmit,
}: {
  creating: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean>;
}) {
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  function generatePassword() {
    setTemporaryPassword(createTemporaryPassword());
    setShowPassword(true);
    setCopied(false);
  }

  async function copyPassword() {
    if (!temporaryPassword) return;
    await navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    const created = await onSubmit(event);
    if (created) {
      setTemporaryPassword('');
      setShowPassword(false);
      setCopied(false);
    }
  }

  return (
    <Card className="h-fit xl:sticky xl:top-22">
      <CardHeader className="border-b border-border">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary-soft text-primary">
            <UserPlus aria-hidden="true" size={18} />
          </span>
          <div>
            <CardTitle>Registrar miembro</CardTitle>
            <CardDescription>Crea su perfil y acceso inicial.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <form className="space-y-4" onSubmit={(event) => void submit(event)}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <FormField label="Nombres" name="firstName" />
            <FormField label="Apellidos" name="lastName" />
          </div>
          <FormField label="Correo electrónico" name="email" type="email" />
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Contraseña temporal</Label>
              <Button
                className="h-auto px-1 py-0 text-xs"
                onClick={generatePassword}
                type="button"
                variant="ghost"
              >
                <RefreshCw aria-hidden="true" size={13} />
                Generar
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                autoComplete="new-password"
                id="password"
                minLength={12}
                name="password"
                onChange={(event) => {
                  setTemporaryPassword(event.target.value);
                  setCopied(false);
                }}
                required
                type={showPassword ? 'text' : 'password'}
                value={temporaryPassword}
              />
              <Button
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                onClick={() => setShowPassword((visible) => !visible)}
                size="icon"
                type="button"
                variant="secondary"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" size={17} />
                ) : (
                  <Eye aria-hidden="true" size={17} />
                )}
              </Button>
              <Button
                aria-label="Copiar contraseña"
                disabled={!temporaryPassword}
                onClick={() => void copyPassword()}
                size="icon"
                type="button"
                variant="secondary"
              >
                {copied ? (
                  <Check aria-hidden="true" size={17} />
                ) : (
                  <Copy aria-hidden="true" size={17} />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Genérala y compártela con el miembro por un canal seguro.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <FormField
              label="Teléfono (opcional)"
              name="phone"
              required={false}
            />
            <FormField
              label="Fecha de nacimiento"
              name="birthDate"
              required={false}
              type="date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joinedAt">Fecha de ingreso</Label>
            <Input id="joinedAt" name="joinedAt" type="date" />
          </div>
          <Button className="w-full" loading={creating} type="submit">
            <CalendarPlus aria-hidden="true" size={17} />
            {creating ? 'Registrando' : 'Registrar miembro'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function FormField({
  label,
  name,
  required = true,
  ...inputProps
}: {
  label: string;
  name: string;
  required?: boolean;
} & Omit<React.ComponentProps<typeof Input>, 'id' | 'name' | 'required'>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} required={required} {...inputProps} />
    </div>
  );
}

function MembersSkeleton() {
  return (
    <div className="space-y-3 p-5" role="status">
      <span className="sr-only">Cargando miembros</span>
      {Array.from({ length: 5 }, (_, index) => (
        <div className="flex items-center gap-4" key={index}>
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value));
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

function createTemporaryPassword(): string {
  const characterGroups = [
    'ABCDEFGHJKLMNPQRSTUVWXYZ',
    'abcdefghijkmnopqrstuvwxyz',
    '23456789',
    '!@#$%&*?',
  ];
  const characters = characterGroups.join('');
  const password = characterGroups.map((group) => randomCharacter(group));

  while (password.length < 16) password.push(randomCharacter(characters));

  for (let index = password.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomIndex(index + 1);
    [password[index], password[swapIndex]] = [
      password[swapIndex],
      password[index],
    ];
  }

  return password.join('');
}

function randomCharacter(characters: string): string {
  return characters[secureRandomIndex(characters.length)];
}

function secureRandomIndex(limit: number): number {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % limit;
}
