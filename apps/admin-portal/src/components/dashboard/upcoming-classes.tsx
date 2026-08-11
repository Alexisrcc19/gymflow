import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gymflow/ui';

import { upcomingClasses } from './dashboard-data';

export function UpcomingClasses() {
  return (
    <Card>
      <CardHeader className="flex grid-cols-none flex-row items-start justify-between gap-3 border-b border-border">
        <div>
          <CardTitle>Próximas clases</CardTitle>
          <CardDescription>Hoy</CardDescription>
        </div>
        <Button size="sm" variant="soft">
          Programar
        </Button>
      </CardHeader>
      <CardContent className="divide-y divide-border px-0 pb-0">
        {upcomingClasses.map((item) => {
          const percentage = Math.round((item.enrolled / item.capacity) * 100);
          return (
            <div
              className="grid grid-cols-[3.5rem_1fr] gap-3 px-5 py-4"
              key={`${item.time}-${item.name}`}
            >
              <time className="font-mono text-sm font-medium text-foreground">
                {item.time}
              </time>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {item.enrolled}/{item.capacity}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Entrenador: {item.trainer}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className={
                      percentage >= 100
                        ? 'h-full bg-warning'
                        : 'h-full bg-primary'
                    }
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
