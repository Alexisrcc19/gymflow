import { forwardRef, type InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/cn';

const inputVariants = cva(
  'peer w-full rounded-md border border-border bg-surface px-3 text-foreground shadow-rest outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-background disabled:opacity-60 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/15',
  {
    variants: {
      inputSize: {
        sm: 'h-8 text-xs',
        md: 'h-9 text-sm',
        lg: 'h-10 text-sm',
      },
    },
    defaultVariants: {
      inputSize: 'md',
    },
  },
);

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize, type = 'text', ...props }, ref) => (
    <input
      className={cn(inputVariants({ inputSize }), className)}
      ref={ref}
      type={type}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
