import React from 'react';
import { cn } from '@/lib/utils';
import { ErrorType } from '@/lib/types';

export interface ErrorMessageProps {
  message: string;
  type?: ErrorType;
  className?: string;
  showIcon?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = ErrorType.PARSING_ERROR,
  className,
  showIcon = true,
  onRetry,
  onDismiss
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case ErrorType.CLIPBOARD_ERROR:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
          </svg>
        );
      case ErrorType.BROWSER_COMPATIBILITY:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case ErrorType.NETWORK_ERROR:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L4.414 9H17a1 1 0 100-2H4.414l1.879-1.879z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getErrorColor = () => {
    switch (type) {
      case ErrorType.CLIPBOARD_ERROR:
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case ErrorType.BROWSER_COMPATIBILITY:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case ErrorType.NETWORK_ERROR:
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  return (
    <div
      className={cn(
        'flex items-start p-4 border rounded-apple',
        getErrorColor(),
        className
      )}
      role="alert"
    >
      {showIcon && (
        <div className="flex-shrink-0 mr-3">
          {getErrorIcon()}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {message}
        </p>
      </div>

      <div className="flex-shrink-0 ml-4 flex space-x-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-sm font-medium hover:underline focus:outline-none focus:underline"
          >
            Try Again
          </button>
        )}
        
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-sm font-medium hover:underline focus:outline-none focus:underline ml-2"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export { ErrorMessage };