// Google Analytics configuration and utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

import { getDeploymentConfig } from './deployment-config';

// Get deployment configuration
const deploymentConfig = getDeploymentConfig();

// Google Analytics Measurement ID from deployment config
export const GA_MEASUREMENT_ID = deploymentConfig.analytics.measurementId || 'G-XXXXXXXXXX';

// Check if analytics is enabled based on deployment config
export const isAnalyticsEnabled = deploymentConfig.analytics.enabled && Boolean(deploymentConfig.analytics.measurementId);

// Initialize Google Analytics
export const initGA = () => {
  // Only initialize if analytics is enabled in deployment config
  if (!isAnalyticsEnabled) {
    console.log('Google Analytics not initialized (disabled in deployment config or missing ID)');
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Configure Google Analytics
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    // Privacy-compliant settings
    anonymize_ip: true, // Anonymize IP addresses
    allow_google_signals: false, // Disable Google Signals
    allow_ad_personalization_signals: false, // Disable ad personalization
    cookie_expires: 63072000, // 2 years in seconds
    cookie_flags: 'SameSite=Strict;Secure', // Secure cookie settings
  });

  console.log('Google Analytics initialized with privacy settings');
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_location: url,
    page_title: title,
  });
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Specific tracking functions for URL Extractor events
export const trackURLExtraction = (urlCount: number, contentLength: number) => {
  trackEvent('extract_urls', 'url_extractor', `${urlCount}_urls`, contentLength);
};

export const trackURLCopy = (urlCount: number, copyType: 'single' | 'all') => {
  trackEvent('copy_urls', 'url_management', copyType, urlCount);
};

export const trackURLOpen = (urlCount: number, openType: 'single' | 'all') => {
  trackEvent('open_urls', 'url_management', openType, urlCount);
};

export const trackURLEdit = () => {
  trackEvent('edit_url', 'url_management', 'display_text');
};

export const trackURLDelete = () => {
  trackEvent('delete_url', 'url_management', 'remove');
};

export const trackError = (errorType: string, component: string) => {
  trackEvent('error', 'application', `${component}_${errorType}`);
};

export const trackPageNavigation = (page: string) => {
  trackEvent('navigate', 'navigation', page);
};

export const trackFormSubmission = (formType: string, success: boolean) => {
  trackEvent('form_submit', 'engagement', formType, success ? 1 : 0);
};

// Privacy-compliant consent management
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for consent cookie or localStorage
  const consent = localStorage.getItem('analytics_consent');
  return consent === 'granted';
};

export const setAnalyticsConsent = (granted: boolean) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('analytics_consent', granted ? 'granted' : 'denied');
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }
};

// Initialize consent with default denied state
export const initConsent = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    });
  }
};