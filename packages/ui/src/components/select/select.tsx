import { forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <select
      className={cn(
        'h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground shadow-rest outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-background disabled:opacity-60 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/15',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Select.displayName = 'Select';
