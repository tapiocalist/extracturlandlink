import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-apple-text mb-2"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full px-4 py-3 border rounded-apple transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'placeholder:text-apple-gray placeholder:text-opacity-60',
            'min-h-[44px] text-base', // Minimum touch target and prevent zoom on iOS
            'touch-manipulation', // Optimize for touch interactions
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-apple-gray border-opacity-30 focus:ring-apple-yellow focus:border-apple-yellow',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-apple-gray">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };