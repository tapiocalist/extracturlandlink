'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { hasAnalyticsConsent, setAnalyticsConsent, initGA } from '@/lib/analytics';

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already made a consent decision
    const hasConsent = hasAnalyticsConsent();
    const hasDecision = localStorage.getItem('analytics_consent') !== null;
    
    // Show banner only if no decision has been made
    if (!hasDecision) {
      setShowBanner(true);
    } else if (hasConsent) {
      // If consent was previously granted, initialize GA
      initGA();
    }
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);
    setAnalyticsConsent(true);
    initGA();
    setShowBanner(false);
    setIsLoading(false);
  };

  const handleDecline = () => {
    setAnalyticsConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-apple-gray border-opacity-20 shadow-apple-lg">
      <div className="container-apple py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-apple-headline font-semibold text-apple-text mb-2">
              Privacy & Analytics
            </h3>
            <p className="text-apple-callout text-apple-gray">
              We use Google Analytics to understand how you use our tool and improve your experience. 
              All data is anonymized and we don't track personal information. You can change your preference anytime.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="order-2 sm:order-1"
            >
              Decline
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAccept}
              isLoading={isLoading}
              className="order-1 sm:order-2"
            >
              {isLoading ? 'Accepting...' : 'Accept Analytics'}
            </Button>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-apple-gray border-opacity-10">
          <p className="text-apple-caption1 text-apple-gray">
            By accepting, you agree to our use of Google Analytics with privacy-first settings: 
            IP anonymization, no ad personalization, and secure cookies.
          </p>
        </div>
      </div>
    </div>
  );
}