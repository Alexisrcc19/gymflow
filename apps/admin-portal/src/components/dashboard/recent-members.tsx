import { MoreHorizontal } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gymflow/ui';

import { recentMembers, type RecentMember } from './dashboard-data';

const variants: Record<
  RecentMember['status'],
  'success' | 'warning' | 'danger' | 'info'
> = {
  Activa: 'success',
  'Por vencer': 'warning',
  Vencida: 'danger',
  Pausada: 'info',
};

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
}

export function RecentMembers() {
  return (
    <Card className="min-w-0 xl:col-span-2">
      <CardHeader className="flex grid-cols-none flex-row items-start justify-between gap-4 border-b border-border">
        <div>
          <CardTitle>Miembros recientes</CardTitle>
          <CardDescription>Registros más recientes</CardDescription>
        </div>
        <Button size="sm" variant="secondary">
          Ver todos
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <ul className="divide-y divide-border md:hidden">
          {recentMembers.map((member) => (
            <li className="flex items-center gap-3 px-4 py-4" key={member.id}>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {initials(member.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {member.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {member.plan} · {member.joined}
                </p>
              </div>
              <Badge showDot variant={variants[member.status]}>
                {member.status}
              </Badge>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium" scope="col">
                  Miembro
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Plan
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Ingreso
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Estado
                </th>
                <th className="px-5 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.map((member) => (
                <tr
                  className="border-b border-border last:border-0 hover:bg-background"
                  key={member.id}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                        {initials(member.name)}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {member.plan}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {member.joined}
                  </td>
                  <td className="px-4 py-3">
                    <Badge showDot variant={variants[member.status]}>
                      {member.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      aria-label={`Acciones para ${member.name}`}
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal aria-hidden="true" size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
