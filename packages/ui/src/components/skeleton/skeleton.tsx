import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/cn';

const skeletonVariants = cva('animate-pulse bg-border/70', {
  variants: {
    shape: {
      rectangle: 'rounded-md',
      text: 'h-3 rounded-sm',
      circle: 'rounded-full',
    },
  },
  defaultVariants: { shape: 'rectangle' },
});

export interface SkeletonProps
  extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 'aria-hidden': ariaHidden = true, className, shape, ...props }, ref) => (
    <div
      aria-hidden={ariaHidden}
      className={cn(skeletonVariants({ shape }), className)}
      ref={ref}
      {...props}
    />
  ),
);

Skeleton.displayName = 'Skeleton';
