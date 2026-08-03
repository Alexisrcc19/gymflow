import { forwardRef, type LabelHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      className={cn(
        'text-sm font-semibold text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Label.displayName = 'Label';
