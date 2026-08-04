import { Dumbbell } from 'lucide-react';

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-white">
        <Dumbbell aria-hidden="true" size={19} strokeWidth={2} />
      </span>
      {!compact ? (
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-foreground">
            GymFlow
          </p>
          <p className="text-xs text-muted-foreground">Admin Portal</p>
        </div>
      ) : null}
    </div>
  );
}
