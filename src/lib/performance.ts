// Performance monitoring and optimization utilities

// Content processing limits
export const PERFORMANCE_LIMITS = {
  MAX_CONTENT_LENGTH: 1000000, // 1MB of text content
  MAX_URL_COUNT: 10000, // Maximum URLs to extract
  MAX_PROCESSING_TIME: 30000, // 30 seconds timeout
  CHUNK_SIZE: 50000, // Process content in chunks
  DEBOUNCE_DELAY: 300, // Debounce user input
} as const;

// Performance metrics tracking
interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = typeof performance !== 'undefined' && typeof performance.now === 'function';
  }

  start(name: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata,
    });

    // Mark for performance timeline
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
  }

  end(name: string): number | null {
    if (!this.isEnabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Mark for performance timeline
    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`, metric.metadata);
    }

    return duration;
  }

  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  clear(): void {
    this.metrics.clear();
  }

  // Get memory usage if available
  getMemoryUsage(): any {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Content validation and limits
export function validateContentSize(content: string): { valid: boolean; error?: string } {
  if (!content) {
    return { valid: true };
  }

  const contentLength = content.length;
  
  if (contentLength > PERFORMANCE_LIMITS.MAX_CONTENT_LENGTH) {
    return {
      valid: false,
      error: `Content too large (${(contentLength / 1024 / 1024).toFixed(2)}MB). Maximum allowed is ${(PERFORMANCE_LIMITS.MAX_CONTENT_LENGTH / 1024 / 1024).toFixed(2)}MB.`
    };
  }

  return { valid: true };
}

export function validateUrlCount(urlCount: number): { valid: boolean; error?: string } {
  if (urlCount > PERFORMANCE_LIMITS.MAX_URL_COUNT) {
    return {
      valid: false,
      error: `Too many URLs found (${urlCount}). Maximum allowed is ${PERFORMANCE_LIMITS.MAX_URL_COUNT}.`
    };
  }

  return { valid: true };
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = PERFORMANCE_LIMITS.DEBOUNCE_DELAY
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Chunk processing for large content
export async function processInChunks<T, R>(
  items: T[],
  processor: (chunk: T[]) => Promise<R[]>,
  chunkSize: number = 100
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await processor(chunk);
    results.push(...chunkResults);
    
    // Allow other tasks to run
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
}

// Memory cleanup utilities
export function cleanupLargeObjects(...objects: any[]): void {
  objects.forEach(obj => {
    if (obj && typeof obj === 'object') {
      // Clear arrays
      if (Array.isArray(obj)) {
        obj.length = 0;
      }
      // Clear object properties
      else {
        Object.keys(obj).forEach(key => {
          delete obj[key];
        });
      }
    }
  });
}

// Web Worker support detection
export function supportsWebWorkers(): boolean {
  return typeof Worker !== 'undefined';
}

// Service Worker support detection
export function supportsServiceWorker(): boolean {
  return 'serviceWorker' in navigator;
}

// Performance observer for monitoring
export function observePerformance(): void {
  if (typeof PerformanceObserver === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // Log long tasks in development
        if (process.env.NODE_ENV === 'development' && entry.entryType === 'longtask') {
          console.warn('Long task detected:', entry);
        }
        
        // Log navigation timing
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', entry);
        }
      });
    });

    // Observe different types of performance entries
    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    // Observe long tasks if supported
    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task observer not supported
    }
  } catch (error) {
    console.warn('Performance observer not supported:', error);
  }
}

// Bundle size analysis helper
export function logBundleInfo(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available at build time with ANALYZE=true');
  }
}

// Critical resource hints
export function addResourceHints(): void {
  if (typeof document === 'undefined') return;

  // Preconnect to external domains
  const preconnectDomains = [
    'https://www.googletagmanager.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
}

// Initialize performance monitoring
export function initializePerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Start performance observation
  observePerformance();
  
  // Add resource hints
  addResourceHints();
  
  // Log initial performance metrics
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          console.log('Page load metrics:', {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalTime: navigation.loadEventEnd - navigation.fetchStart,
          });
        }
      }, 0);
    });
  }
}