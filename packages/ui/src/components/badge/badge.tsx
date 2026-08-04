import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/cn';

const badgeVariants = cva(
  'inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-sm border font-medium',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-background text-muted-foreground',
        primary: 'border-primary/30 bg-primary-soft text-primary',
        success: 'border-success/30 bg-success/10 text-success',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        danger: 'border-danger/30 bg-danger/10 text-danger',
        info: 'border-info/30 bg-info/10 text-info',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[11px] leading-none',
        md: 'px-2 py-1 text-xs leading-none',
      },
    },
    defaultVariants: {
      size: 'sm',
      variant: 'neutral',
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  showDot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, showDot = false, size, variant, ...props }, ref) => (
    <span
      className={cn(badgeVariants({ size, variant }), className)}
      ref={ref}
      {...props}
    >
      {showDot ? (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      ) : null}
      {children}
    </span>
  ),
);

Badge.displayName = 'Badge';
