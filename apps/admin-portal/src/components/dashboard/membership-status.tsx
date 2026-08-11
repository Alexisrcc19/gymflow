import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gymflow/ui';

import { membershipStatuses } from './dashboard-data';

export function MembershipStatus() {
  const total = membershipStatuses.reduce(
    (sum, status) => sum + status.value,
    0,
  );
  let offset = 0;
  const segments = membershipStatuses.map((status) => {
    const start = (offset / total) * 360;
    offset += status.value;
    const end = (offset / total) * 360;
    return `${status.color} ${start}deg ${end}deg`;
  });

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Estado de membresías</CardTitle>
        <CardDescription>
          Distribución entre {total.toLocaleString('es-EC')} miembros
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 pt-6 sm:grid-cols-2 sm:items-center xl:grid-cols-1 2xl:grid-cols-2">
        <div
          aria-label={`${membershipStatuses.map((status) => `${status.label}: ${status.value}`).join(', ')}`}
          className="mx-auto grid size-40 place-items-center rounded-full"
          role="img"
          style={{ background: `conic-gradient(${segments.join(', ')})` }}
        >
          <div className="size-24 rounded-full bg-surface" />
        </div>
        <ul className="space-y-3">
          {membershipStatuses.map((status) => (
            <li className="flex items-center gap-2 text-sm" key={status.label}>
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              <span className="flex-1 text-muted-foreground">
                {status.label}
              </span>
              <strong className="font-semibold tabular-nums text-foreground">
                {status.value}
              </strong>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
