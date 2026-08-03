import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/cn';

const alertVariants = cva(
  'grid w-full grid-cols-[auto_1fr] gap-x-3 rounded-md border p-4 text-sm',
  {
    variants: {
      variant: {
        info: 'border-info/30 bg-info/10 text-info',
        success: 'border-success/30 bg-success/10 text-success',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        danger: 'border-danger/30 bg-danger/10 text-danger',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  icon?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ children, className, icon, variant, ...props }, ref) => (
    <div
      className={cn(
        alertVariants({ variant }),
        !icon && 'grid-cols-1',
        className,
      )}
      ref={ref}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="row-span-2 mt-0.5 flex size-5 items-center justify-center"
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 text-foreground">{children}</div>
    </div>
  ),
);

Alert.displayName = 'Alert';

export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      className={cn('font-semibold leading-5 text-current', className)}
      ref={ref}
      {...props}
    />
  ),
);

AlertTitle.displayName = 'AlertTitle';

export type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    className={cn('mt-0.5 leading-5 text-muted-foreground', className)}
    ref={ref}
    {...props}
  />
));

AlertDescription.displayName = 'AlertDescription';
