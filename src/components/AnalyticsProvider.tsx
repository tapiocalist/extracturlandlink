'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, initConsent, hasAnalyticsConsent, initGA } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize consent with default denied state
    initConsent();
    
    // If user has previously granted consent, initialize GA
    if (hasAnalyticsConsent()) {
      initGA();
    }
  }, []);

  useEffect(() => {
    // Track page views when pathname changes
    if (hasAnalyticsConsent() && typeof window !== 'undefined') {
      const url = window.location.origin + pathname;
      const title = document.title;
      trackPageView(url, title);
    }
  }, [pathname]);

  return <>{children}</>;
}