// Production configuration and environment management

export interface AppConfig {
  // Environment
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  
  // API Configuration
  apiUrl: string;
  
  // Analytics
  googleAnalyticsId?: string;
  enableAnalytics: boolean;
  
  // Performance
  enablePerformanceMonitoring: boolean;
  maxContentLength: number;
  maxUrlCount: number;
  processingTimeout: number;
  
  // Features
  enableServiceWorker: boolean;
  enableOfflineMode: boolean;
  enableErrorReporting: boolean;
  
  // Security
  contentSecurityPolicy: boolean;
  enableHSTS: boolean;
  
  // Logging
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  enableConsoleLogging: boolean;
}

// Get environment-specific configuration
function getEnvironmentConfig(): Partial<AppConfig> {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        isDevelopment: false,
        isProduction: true,
        isTest: false,
        enableAnalytics: true,
        enablePerformanceMonitoring: true,
        enableServiceWorker: true,
        enableOfflineMode: true,
        enableErrorReporting: true,
        contentSecurityPolicy: true,
        enableHSTS: true,
        logLevel: 'error',
        enableConsoleLogging: false,
      };
      
    case 'test':
      return {
        isDevelopment: false,
        isProduction: false,
        isTest: true,
        enableAnalytics: false,
        enablePerformanceMonitoring: false,
        enableServiceWorker: false,
        enableOfflineMode: false,
        enableErrorReporting: false,
        contentSecurityPolicy: false,
        enableHSTS: false,
        logLevel: 'warn',
        enableConsoleLogging: true,
      };
      
    default: // development
      return {
        isDevelopment: true,
        isProduction: false,
        isTest: false,
        enableAnalytics: false,
        enablePerformanceMonitoring: true,
        enableServiceWorker: false,
        enableOfflineMode: false,
        enableErrorReporting: false,
        contentSecurityPolicy: false,
        enableHSTS: false,
        logLevel: 'debug',
        enableConsoleLogging: true,
      };
  }
}

// Create application configuration
export const appConfig: AppConfig = {
  // Environment defaults
  ...getEnvironmentConfig(),
  
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  
  // Analytics
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  
  // Performance limits
  maxContentLength: parseInt(process.env.NEXT_PUBLIC_MAX_CONTENT_LENGTH || '1000000'),
  maxUrlCount: parseInt(process.env.NEXT_PUBLIC_MAX_URL_COUNT || '10000'),
  processingTimeout: parseInt(process.env.NEXT_PUBLIC_PROCESSING_TIMEOUT || '30000'),
} as AppConfig;

// Configuration validation
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate required production settings
  if (appConfig.isProduction) {
    if (!appConfig.googleAnalyticsId && appConfig.enableAnalytics) {
      errors.push('Google Analytics ID is required in production when analytics is enabled');
    }
    
    if (appConfig.maxContentLength <= 0) {
      errors.push('Max content length must be greater than 0');
    }
    
    if (appConfig.maxUrlCount <= 0) {
      errors.push('Max URL count must be greater than 0');
    }
    
    if (appConfig.processingTimeout <= 0) {
      errors.push('Processing timeout must be greater than 0');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Feature flags
export const featureFlags = {
  // UI Features
  enableDarkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === 'true',
  enableAdvancedFiltering: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_FILTERING === 'true',
  enableBulkOperations: process.env.NEXT_PUBLIC_ENABLE_BULK_OPERATIONS !== 'false', // Default true
  
  // Performance Features
  enableVirtualization: process.env.NEXT_PUBLIC_ENABLE_VIRTUALIZATION === 'true',
  enableLazyLoading: process.env.NEXT_PUBLIC_ENABLE_LAZY_LOADING !== 'false', // Default true
  enableCodeSplitting: process.env.NEXT_PUBLIC_ENABLE_CODE_SPLITTING !== 'false', // Default true
  
  // Experimental Features
  enableWebWorkers: process.env.NEXT_PUBLIC_ENABLE_WEB_WORKERS === 'true',
  enableOfflineSync: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_SYNC === 'true',
  enablePWA: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
} as const;

// Runtime configuration checks
export function checkRuntimeSupport(): {
  webWorkers: boolean;
  serviceWorker: boolean;
  clipboardAPI: boolean;
  intersectionObserver: boolean;
  performanceObserver: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      webWorkers: false,
      serviceWorker: false,
      clipboardAPI: false,
      intersectionObserver: false,
      performanceObserver: false,
    };
  }
  
  return {
    webWorkers: typeof Worker !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    clipboardAPI: 'clipboard' in navigator,
    intersectionObserver: 'IntersectionObserver' in window,
    performanceObserver: 'PerformanceObserver' in window,
  };
}

// Security headers configuration
export const securityHeaders = {
  contentSecurityPolicy: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Next.js
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://analytics.google.com',
    ],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  },
  
  otherHeaders: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  } as Record<string, string>,
};

// Add HSTS header for production
if (appConfig.isProduction && appConfig.enableHSTS) {
  securityHeaders.otherHeaders['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
}

// Logging configuration
export class Logger {
  private static instance: Logger;
  private logLevel: AppConfig['logLevel'];
  private enableConsole: boolean;
  
  private constructor() {
    this.logLevel = appConfig.logLevel;
    this.enableConsole = appConfig.enableConsoleLogging;
  }
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  private shouldLog(level: AppConfig['logLevel']): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex <= currentLevelIndex;
  }
  
  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error') && this.enableConsole) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
  
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn') && this.enableConsole) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }
  
  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info') && this.enableConsole) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }
  
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug') && this.enableConsole) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}

export const logger = Logger.getInstance();

// Initialize configuration
export function initializeConfig(): void {
  const validation = validateConfig();
  
  if (!validation.valid) {
    logger.error('Configuration validation failed:', validation.errors);
    
    if (appConfig.isProduction) {
      throw new Error(`Invalid production configuration: ${validation.errors.join(', ')}`);
    }
  }
  
  logger.info('Application configuration initialized', {
    environment: appConfig.isProduction ? 'production' : appConfig.isDevelopment ? 'development' : 'test',
    features: featureFlags,
    runtime: checkRuntimeSupport(),
  });
}