import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/cn';

const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-2 border-current border-r-transparent',
  {
    variants: {
      size: { sm: 'size-3.5', md: 'size-5', lg: 'size-8' },
      variant: {
        primary: 'text-primary',
        muted: 'text-muted-foreground',
        current: 'text-current',
      },
    },
    defaultVariants: { size: 'md', variant: 'primary' },
  },
);

export interface SpinnerProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, label = 'Loading', size, variant, ...props }, ref) => (
    <span aria-label={label} ref={ref} role="status" {...props}>
      <span
        aria-hidden="true"
        className={cn(spinnerVariants({ size, variant }), className)}
      />
    </span>
  ),
);

Spinner.displayName = 'Spinner';
