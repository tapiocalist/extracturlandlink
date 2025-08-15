/**
 * Deployment configuration utilities
 * Handles environment-specific settings and validation
 */

export interface DeploymentConfig {
  appName: string;
  appVersion: string;
  appUrl: string;
  environment: 'development' | 'production' | 'preview';
  analytics: {
    enabled: boolean;
    measurementId: string | null;
  };
  performance: {
    maxContentLength: number;
    maxUrlCount: number;
  };
  security: {
    cspEnabled: boolean;
  };
  vercel: {
    url: string | null;
    env: string | null;
    commitSha: string | null;
  };
}

/**
 * Get deployment configuration based on environment variables
 */
export function getDeploymentConfig(): DeploymentConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  const isPreview = process.env.VERCEL_ENV === 'preview';
  
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'URL Extractor',
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 
            process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
            'http://localhost:3000',
    environment: isProduction ? 'production' : isPreview ? 'preview' : 'development',
    analytics: {
      enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && isProduction,
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null,
    },
    performance: {
      maxContentLength: parseInt(process.env.NEXT_PUBLIC_MAX_CONTENT_LENGTH || '50000', 10),
      maxUrlCount: parseInt(process.env.NEXT_PUBLIC_MAX_URL_COUNT || '100', 10),
    },
    security: {
      cspEnabled: process.env.NEXT_PUBLIC_ENABLE_CSP === 'true',
    },
    vercel: {
      url: process.env.VERCEL_URL || null,
      env: process.env.VERCEL_ENV || null,
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
    },
  };
}

/**
 * Validate deployment configuration
 */
export function validateDeploymentConfig(config: DeploymentConfig): string[] {
  const errors: string[] = [];

  if (config.environment === 'production') {
    if (config.analytics.enabled && !config.analytics.measurementId) {
      errors.push('Google Analytics measurement ID is required for production');
    }

    if (!config.appUrl || config.appUrl.includes('localhost')) {
      errors.push('Production app URL must be configured');
    }
  }

  if (config.performance.maxContentLength <= 0) {
    errors.push('Max content length must be greater than 0');
  }

  if (config.performance.maxUrlCount <= 0) {
    errors.push('Max URL count must be greater than 0');
  }

  return errors;
}

/**
 * Get build information for display
 */
export function getBuildInfo(): {
  version: string;
  environment: string;
  buildTime: string;
  commitSha?: string;
} {
  const config = getDeploymentConfig();
  
  return {
    version: config.appVersion,
    environment: config.environment,
    buildTime: new Date().toISOString(),
    commitSha: config.vercel.commitSha || undefined,
  };
}

/**
 * Check if running in Vercel environment
 */
export function isVercelEnvironment(): boolean {
  return Boolean(process.env.VERCEL_URL);
}

/**
 * Get canonical URL for the application
 */
export function getCanonicalUrl(path: string = ''): string {
  const config = getDeploymentConfig();
  const baseUrl = config.appUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
}