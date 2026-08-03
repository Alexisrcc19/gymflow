import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/cn';

const cardVariants = cva('rounded-lg border border-border bg-surface', {
  variants: {
    elevation: {
      flat: 'shadow-none',
      rest: 'shadow-rest',
      raised: 'shadow-raised',
    },
  },
  defaultVariants: { elevation: 'rest' },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation, ...props }, ref) => (
    <div
      className={cn(cardVariants({ elevation }), className)}
      ref={ref}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div className={cn('grid gap-1.5 p-5', className)} ref={ref} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      className={cn(
        'font-display text-base font-semibold text-foreground',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    className={cn('text-sm text-muted-foreground', className)}
    ref={ref}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export type CardContentProps = HTMLAttributes<HTMLDivElement>;
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div className={cn('px-5 pb-5', className)} ref={ref} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        'flex items-center gap-3 border-t border-border px-5 py-4',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';
