import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      className={cn(
        'size-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      type="checkbox"
      {...props}
    />
  ),
);

Checkbox.displayName = 'Checkbox';
