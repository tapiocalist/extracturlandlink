import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock different browser environments
const mockUserAgents = {
  chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
  ie11: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
};

describe('Browser Compatibility', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
  });

  describe('Clipboard API Support', () => {
    it('should detect modern Clipboard API support', () => {
      // Mock modern browser with Clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockResolvedValue(undefined),
          readText: vi.fn().mockResolvedValue('test'),
        },
        writable: true
      });

      expect(navigator.clipboard).toBeDefined();
      expect(typeof navigator.clipboard.writeText).toBe('function');
    });

    it('should handle browsers without Clipboard API', () => {
      // Mock older browser without Clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true
      });

      expect(navigator.clipboard).toBeUndefined();
    });

    it('should fallback to document.execCommand for older browsers', () => {
      // Mock document.execCommand
      const mockExecCommand = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', {
        value: mockExecCommand,
        writable: true
      });

      // Test fallback
      document.execCommand('copy');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
    });
  });

  describe('URL Constructor Support', () => {
    it('should support URL constructor in modern browsers', () => {
      expect(() => new URL('https://example.com')).not.toThrow();
    });

    it('should handle invalid URLs gracefully', () => {
      expect(() => new URL('invalid-url')).toThrow();
    });

    it('should validate URLs with different protocols', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'ftp://example.com',
        'mailto:test@example.com'
      ];

      validUrls.forEach(url => {
        expect(() => new URL(url)).not.toThrow();
      });
    });
  });

  describe('DOM Parser Support', () => {
    it('should support DOMParser in modern browsers', () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString('<div>test</div>', 'text/html');
      
      expect(doc).toBeInstanceOf(Document);
      expect(doc.querySelector('div')?.textContent).toBe('test');
    });

    it('should handle malformed HTML gracefully', () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString('<div><span>unclosed', 'text/html');
      
      expect(doc).toBeInstanceOf(Document);
    });
  });

  describe('Local Storage Support', () => {
    it('should support localStorage in modern browsers', () => {
      expect(typeof localStorage.setItem).toBe('function');
      expect(typeof localStorage.getItem).toBe('function');
      expect(typeof localStorage.removeItem).toBe('function');
    });

    it('should handle localStorage quota exceeded', () => {
      const mockSetItem = vi.fn().mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      Object.defineProperty(localStorage, 'setItem', {
        value: mockSetItem,
        writable: true
      });

      expect(() => localStorage.setItem('test', 'value')).toThrow('QuotaExceededError');
    });

    it('should handle localStorage being disabled', () => {
      Object.defineProperty(window, 'localStorage', {
        value: null,
        writable: true
      });

      expect(localStorage).toBeNull();
    });
  });

  describe('Event Listener Support', () => {
    it('should support modern event listeners', () => {
      const element = document.createElement('div');
      const handler = vi.fn();
      
      element.addEventListener('click', handler);
      element.click();
      
      expect(handler).toHaveBeenCalled();
    });

    it('should support passive event listeners', () => {
      const element = document.createElement('div');
      const handler = vi.fn();
      
      expect(() => {
        element.addEventListener('scroll', handler, { passive: true });
      }).not.toThrow();
    });
  });

  describe('CSS Support Detection', () => {
    it('should detect CSS Grid support', () => {
      const testElement = document.createElement('div');
      testElement.style.display = 'grid';
      
      expect(testElement.style.display).toBe('grid');
    });

    it('should detect CSS Flexbox support', () => {
      const testElement = document.createElement('div');
      testElement.style.display = 'flex';
      
      expect(testElement.style.display).toBe('flex');
    });

    it('should detect CSS Custom Properties support', () => {
      const testElement = document.createElement('div');
      testElement.style.setProperty('--test-var', 'test-value');
      
      expect(testElement.style.getPropertyValue('--test-var')).toBe('test-value');
    });
  });

  describe('Touch Events Support', () => {
    it('should detect touch event support', () => {
      // Mock touch support
      Object.defineProperty(window, 'ontouchstart', {
        value: null,
        writable: true
      });

      expect('ontouchstart' in window).toBe(true);
    });

    it('should handle touch events', () => {
      const element = document.createElement('div');
      const handler = vi.fn();
      
      element.addEventListener('touchstart', handler);
      
      const touchEvent = new Event('touchstart');
      element.dispatchEvent(touchEvent);
      
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Fetch API Support', () => {
    it('should support fetch API in modern browsers', () => {
      expect(typeof fetch).toBe('function');
    });

    it('should handle fetch errors gracefully', async () => {
      // Mock fetch to reject
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      try {
        await fetch('https://example.com');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Intersection Observer Support', () => {
    it('should detect Intersection Observer support', () => {
      // Mock IntersectionObserver
      global.IntersectionObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn()
      }));

      expect(typeof IntersectionObserver).toBe('function');
    });
  });

  describe('User Agent Detection', () => {
    it('should detect Chrome browser', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: mockUserAgents.chrome,
        writable: true
      });

      expect(navigator.userAgent.includes('Chrome')).toBe(true);
      expect(navigator.userAgent.includes('Safari')).toBe(true);
    });

    it('should detect Firefox browser', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: mockUserAgents.firefox,
        writable: true
      });

      expect(navigator.userAgent.includes('Firefox')).toBe(true);
    });

    it('should detect Safari browser', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: mockUserAgents.safari,
        writable: true
      });

      expect(navigator.userAgent.includes('Safari')).toBe(true);
      expect(navigator.userAgent.includes('Chrome')).toBe(false);
    });

    it('should detect Edge browser', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: mockUserAgents.edge,
        writable: true
      });

      expect(navigator.userAgent.includes('Edg')).toBe(true);
    });
  });

  describe('Performance API Support', () => {
    it('should support performance.now()', () => {
      expect(typeof performance.now).toBe('function');
      expect(typeof performance.now()).toBe('number');
    });

    it('should support performance.mark()', () => {
      if (typeof performance.mark === 'function') {
        expect(() => performance.mark('test-mark')).not.toThrow();
      }
    });
  });
});