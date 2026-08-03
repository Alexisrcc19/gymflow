import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../lib/cn';

export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ action, className, description, icon, title, ...props }, ref) => (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 py-10 text-center',
        className,
      )}
      ref={ref}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="mb-4 flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground"
        >
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-sm font-semibold text-foreground">
        {title}
      </h3>
      {description ? (
        <div className="mt-1 max-w-md text-sm text-muted-foreground">
          {description}
        </div>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  ),
);

EmptyState.displayName = 'EmptyState';
