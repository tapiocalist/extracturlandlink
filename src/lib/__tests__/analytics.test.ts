import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  trackEvent, 
  trackURLExtraction, 
  trackURLCopy, 
  trackURLOpen,
  hasAnalyticsConsent,
  setAnalyticsConsent
} from '../analytics';

// Mock window.gtag
const mockGtag = vi.fn();
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('should call gtag with correct parameters', () => {
      trackEvent('test_action', 'test_category', 'test_label', 100);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'test_action', {
        event_category: 'test_category',
        event_label: 'test_label',
        value: 100
      });
    });

    it('should not call gtag if gtag is undefined', () => {
      // @ts-ignore
      window.gtag = undefined;
      
      trackEvent('test_action', 'test_category');
      
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('trackURLExtraction', () => {
    it('should track URL extraction with correct parameters', () => {
      window.gtag = mockGtag;
      
      trackURLExtraction(5, 1000);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'extract_urls', {
        event_category: 'url_extractor',
        event_label: '5_urls',
        value: 1000
      });
    });
  });

  describe('trackURLCopy', () => {
    it('should track single URL copy', () => {
      window.gtag = mockGtag;
      
      trackURLCopy(1, 'single');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'copy_urls', {
        event_category: 'url_management',
        event_label: 'single',
        value: 1
      });
    });

    it('should track multiple URL copy', () => {
      window.gtag = mockGtag;
      
      trackURLCopy(10, 'all');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'copy_urls', {
        event_category: 'url_management',
        event_label: 'all',
        value: 10
      });
    });
  });

  describe('trackURLOpen', () => {
    it('should track URL opening', () => {
      window.gtag = mockGtag;
      
      trackURLOpen(3, 'all');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'open_urls', {
        event_category: 'url_management',
        event_label: 'all',
        value: 3
      });
    });
  });

  describe('consent management', () => {
    it('should return false when no consent is stored', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const hasConsent = hasAnalyticsConsent();
      
      expect(hasConsent).toBe(false);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('analytics_consent');
    });

    it('should return true when consent is granted', () => {
      mockLocalStorage.getItem.mockReturnValue('granted');
      
      const hasConsent = hasAnalyticsConsent();
      
      expect(hasConsent).toBe(true);
    });

    it('should set consent and update gtag', () => {
      window.gtag = mockGtag;
      
      setAnalyticsConsent(true);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('analytics_consent', 'granted');
      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted'
      });
    });

    it('should deny consent and update gtag', () => {
      window.gtag = mockGtag;
      
      setAnalyticsConsent(false);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('analytics_consent', 'denied');
      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'denied'
      });
    });
  });
});