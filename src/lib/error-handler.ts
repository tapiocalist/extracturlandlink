import { ErrorType, AppError } from './types';

/**
 * Enhanced error handling utilities with specific error categorization
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  contentLength?: number;
  urlCount?: number;
  userAgent?: string;
}

export class AppErrorHandler {
  /**
   * Categorize and create appropriate error messages based on error type and context
   */
  static handleError(error: unknown, context?: ErrorContext): AppError {
    console.error('Error occurred:', error, context);

    // Handle different error types
    if (error instanceof Error) {
      return this.categorizeError(error, context);
    }

    // Handle string errors
    if (typeof error === 'string') {
      return this.createError(ErrorType.PARSING_ERROR, error, true);
    }

    // Handle unknown errors
    return this.createError(
      ErrorType.PARSING_ERROR,
      'An unexpected error occurred. Please try again.',
      true
    );
  }

  /**
   * Categorize errors based on error message and context
   */
  private static categorizeError(error: Error, context?: ErrorContext): AppError {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Clipboard-related errors
    if (message.includes('clipboard') || message.includes('permission')) {
      return this.createClipboardError(error, context);
    }

    // Network-related errors
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return this.createNetworkError(error, context);
    }

    // Browser compatibility errors
    if (this.isBrowserCompatibilityError(error, context)) {
      return this.createBrowserCompatibilityError(error, context);
    }

    // Content parsing errors
    if (message.includes('parse') || message.includes('html') || message.includes('dom')) {
      return this.createParsingError(error, context);
    }

    // Memory or performance errors
    if (message.includes('memory') || message.includes('maximum') || context?.contentLength && context.contentLength > 100000) {
      return this.createPerformanceError(error, context);
    }

    // Default to parsing error
    return this.createParsingError(error, context);
  }

  /**
   * Create clipboard-specific error
   */
  private static createClipboardError(error: Error, context?: ErrorContext): AppError {
    let message = 'Clipboard access failed. ';
    
    if (error.message.includes('permission')) {
      message += 'Please allow clipboard permissions in your browser settings.';
    } else if (error.message.includes('secure')) {
      message += 'Clipboard access requires a secure connection (HTTPS).';
    } else {
      message += 'Your browser may not support clipboard operations. Try copying manually.';
    }

    return this.createError(ErrorType.CLIPBOARD_ERROR, message, true);
  }

  /**
   * Create network-specific error
   */
  private static createNetworkError(error: Error, context?: ErrorContext): AppError {
    const message = 'Network connection failed. Please check your internet connection and try again.';
    return this.createError(ErrorType.NETWORK_ERROR, message, true);
  }

  /**
   * Create browser compatibility error
   */
  private static createBrowserCompatibilityError(error: Error, context?: ErrorContext): AppError {
    const userAgent = context?.userAgent || navigator.userAgent;
    let message = 'Your browser version may not be fully supported. ';

    if (userAgent.includes('Internet Explorer')) {
      message += 'Please use a modern browser like Chrome, Firefox, or Safari.';
    } else {
      message += 'Please update your browser to the latest version.';
    }

    return this.createError(ErrorType.BROWSER_COMPATIBILITY, message, false);
  }

  /**
   * Create parsing-specific error
   */
  private static createParsingError(error: Error, context?: ErrorContext): AppError {
    let message = 'ERROR, PLEASE TRY AGAIN';

    // Provide more specific guidance based on context
    if (context?.contentLength && context.contentLength > 50000) {
      message = 'Content is too large to process. Please try with smaller content.';
    } else if (context?.urlCount && context.urlCount > 1000) {
      message = 'Too many URLs found. Please try with content containing fewer URLs.';
    } else if (error.message.includes('sanitize') || error.message.includes('xss')) {
      message = 'Content contains potentially unsafe elements. Please try with different content.';
    }

    return this.createError(ErrorType.PARSING_ERROR, message, true);
  }

  /**
   * Create performance-related error
   */
  private static createPerformanceError(error: Error, context?: ErrorContext): AppError {
    const message = 'Content is too large or complex to process. Please try with smaller content or fewer URLs.';
    return this.createError(ErrorType.PARSING_ERROR, message, true);
  }

  /**
   * Check if error is related to browser compatibility
   */
  private static isBrowserCompatibilityError(error: Error, context?: ErrorContext): boolean {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';
    const userAgent = context?.userAgent || navigator.userAgent;

    // Check for IE or very old browsers
    if (userAgent.includes('Internet Explorer') || userAgent.includes('MSIE')) {
      return true;
    }

    // Check for specific compatibility-related errors
    const compatibilityKeywords = [
      'not supported',
      'not defined',
      'contenteditable',
      'clipboard api',
      'modern browser',
      'unsupported'
    ];

    return compatibilityKeywords.some(keyword => 
      message.includes(keyword) || stack.includes(keyword)
    );
  }

  /**
   * Create standardized error object
   */
  private static createError(type: ErrorType, message: string, recoverable: boolean): AppError {
    return {
      type,
      message,
      recoverable
    };
  }

  /**
   * Get user-friendly error message with recovery suggestions
   */
  static getErrorMessage(error: AppError): string {
    let message = error.message;

    if (error.recoverable) {
      switch (error.type) {
        case ErrorType.PARSING_ERROR:
          message += ' Try refreshing the page or using different content.';
          break;
        case ErrorType.CLIPBOARD_ERROR:
          message += ' You can still copy URLs manually.';
          break;
        case ErrorType.NETWORK_ERROR:
          message += ' Check your connection and try again.';
          break;
        default:
          message += ' Please try again.';
      }
    }

    return message;
  }

  /**
   * Check if current browser is supported
   */
  static checkBrowserCompatibility(): { supported: boolean; issues: string[] } {
    const issues: string[] = [];
    const userAgent = navigator.userAgent;

    // Check for Internet Explorer
    if (userAgent.includes('Internet Explorer') || userAgent.includes('MSIE')) {
      issues.push('Internet Explorer is not supported. Please use Chrome, Firefox, or Safari.');
    }

    // Check for very old Chrome versions
    const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
    if (chromeMatch && parseInt(chromeMatch[1]) < 80) {
      issues.push('Your Chrome version is outdated. Please update to the latest version.');
    }

    // Check for very old Firefox versions
    const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
    if (firefoxMatch && parseInt(firefoxMatch[1]) < 75) {
      issues.push('Your Firefox version is outdated. Please update to the latest version.');
    }

    // Check for required APIs
    if (!window.navigator.clipboard) {
      issues.push('Clipboard API not available. Some copy features may not work.');
    }

    if (!document.execCommand) {
      issues.push('Legacy clipboard support not available.');
    }

    return {
      supported: issues.length === 0,
      issues
    };
  }

  /**
   * Log error for monitoring/analytics
   */
  static logError(error: AppError, context?: ErrorContext): void {
    const logData = {
      type: error.type,
      message: error.message,
      recoverable: error.recoverable,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', logData);
    }

    // In production, you would send this to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // errorTrackingService.log(logData);
      console.error('Production error logged:', logData);
    }
  }
}