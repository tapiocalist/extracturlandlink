import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppErrorHandler } from '../error-handler';
import { ErrorType } from '../types';

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    clipboard: {
      writeText: vi.fn(),
      readText: vi.fn()
    }
  },
  writable: true
});

describe('AppErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  describe('handleError', () => {
    it('should categorize clipboard errors correctly', () => {
      const error = new Error('Clipboard permission denied');
      const result = AppErrorHandler.handleError(error);
      
      expect(result.type).toBe(ErrorType.CLIPBOARD_ERROR);
      expect(result.message).toContain('Clipboard access failed');
      expect(result.recoverable).toBe(true);
    });

    it('should categorize network errors correctly', () => {
      const error = new Error('Network request failed');
      const result = AppErrorHandler.handleError(error);
      
      expect(result.type).toBe(ErrorType.NETWORK_ERROR);
      expect(result.message).toContain('Network connection failed');
      expect(result.recoverable).toBe(true);
    });

    it('should categorize parsing errors correctly', () => {
      const error = new Error('Failed to parse HTML content');
      const result = AppErrorHandler.handleError(error);
      
      expect(result.type).toBe(ErrorType.PARSING_ERROR);
      expect(result.message).toBe('ERROR, PLEASE TRY AGAIN');
      expect(result.recoverable).toBe(true);
    });

    it('should handle large content parsing errors', () => {
      const error = new Error('Parsing failed');
      const result = AppErrorHandler.handleError(error, {
        contentLength: 100000
      });
      
      expect(result.type).toBe(ErrorType.PARSING_ERROR);
      expect(result.message).toContain('too large to process');
      expect(result.recoverable).toBe(true);
    });

    it('should handle too many URLs error', () => {
      const error = new Error('Processing failed');
      const result = AppErrorHandler.handleError(error, {
        urlCount: 1500
      });
      
      expect(result.type).toBe(ErrorType.PARSING_ERROR);
      expect(result.message).toContain('Too many URLs found');
      expect(result.recoverable).toBe(true);
    });

    it('should handle string errors', () => {
      const result = AppErrorHandler.handleError('Something went wrong');
      
      expect(result.type).toBe(ErrorType.PARSING_ERROR);
      expect(result.message).toBe('Something went wrong');
      expect(result.recoverable).toBe(true);
    });

    it('should handle unknown errors', () => {
      const result = AppErrorHandler.handleError(null);
      
      expect(result.type).toBe(ErrorType.PARSING_ERROR);
      expect(result.message).toBe('An unexpected error occurred. Please try again.');
      expect(result.recoverable).toBe(true);
    });
  });

  describe('checkBrowserCompatibility', () => {
    it('should detect supported modern browser', () => {
      const result = AppErrorHandler.checkBrowserCompatibility();
      
      expect(result.supported).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect Internet Explorer', () => {
      Object.defineProperty(window, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
        },
        writable: true
      });

      const result = AppErrorHandler.checkBrowserCompatibility();
      
      expect(result.supported).toBe(false);
      expect(result.issues.some(issue => issue.includes('Internet Explorer'))).toBe(true);
    });

    it('should detect old Chrome version', () => {
      Object.defineProperty(window, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
        },
        writable: true
      });

      const result = AppErrorHandler.checkBrowserCompatibility();
      
      expect(result.supported).toBe(false);
      expect(result.issues.some(issue => issue.includes('Chrome version is outdated'))).toBe(true);
    });

    it('should detect missing clipboard API', () => {
      Object.defineProperty(window, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          // No clipboard property
        },
        writable: true
      });

      const result = AppErrorHandler.checkBrowserCompatibility();
      
      expect(result.supported).toBe(false);
      expect(result.issues.some(issue => issue.includes('Clipboard API not available'))).toBe(true);
    });
  });

  describe('getErrorMessage', () => {
    it('should add recovery suggestions for recoverable errors', () => {
      const error = {
        type: ErrorType.PARSING_ERROR,
        message: 'Parsing failed',
        recoverable: true
      };

      const result = AppErrorHandler.getErrorMessage(error);
      
      expect(result).toContain('Parsing failed');
      expect(result).toContain('Try refreshing the page');
    });

    it('should not add suggestions for non-recoverable errors', () => {
      const error = {
        type: ErrorType.BROWSER_COMPATIBILITY,
        message: 'Browser not supported',
        recoverable: false
      };

      const result = AppErrorHandler.getErrorMessage(error);
      
      expect(result).toBe('Browser not supported');
    });

    it('should add clipboard-specific recovery suggestions', () => {
      const error = {
        type: ErrorType.CLIPBOARD_ERROR,
        message: 'Clipboard failed',
        recoverable: true
      };

      const result = AppErrorHandler.getErrorMessage(error);
      
      expect(result).toContain('You can still copy URLs manually');
    });
  });

  describe('logError', () => {
    it('should log error with context in development', () => {
      const error = {
        type: ErrorType.PARSING_ERROR,
        message: 'Test error',
        recoverable: true
      };

      const context = {
        component: 'TestComponent',
        action: 'testAction'
      };

      AppErrorHandler.logError(error, context);
      
      expect(console.error).toHaveBeenCalledWith(
        'App Error:',
        expect.objectContaining({
          type: ErrorType.PARSING_ERROR,
          message: 'Test error',
          context
        })
      );
    });
  });
});