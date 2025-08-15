'use client';

import React, { useEffect, useState } from 'react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { AppErrorHandler } from '@/lib/error-handler';
import { ErrorType } from '@/lib/types';

interface BrowserCompatibilityCheckerProps {
  children: React.ReactNode;
}

export function BrowserCompatibilityChecker({ children }: BrowserCompatibilityCheckerProps) {
  const [compatibilityCheck, setCompatibilityCheck] = useState<{
    supported: boolean;
    issues: string[];
    checked: boolean;
  }>({
    supported: true,
    issues: [],
    checked: false
  });

  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check browser compatibility on mount
    const checkCompatibility = () => {
      try {
        const result = AppErrorHandler.checkBrowserCompatibility();
        setCompatibilityCheck({
          ...result,
          checked: true
        });

        // Log compatibility issues
        if (!result.supported) {
          AppErrorHandler.logError({
            type: ErrorType.BROWSER_COMPATIBILITY,
            message: `Browser compatibility issues: ${result.issues.join(', ')}`,
            recoverable: false
          }, {
            component: 'BrowserCompatibilityChecker',
            userAgent: navigator.userAgent
          });
        }
      } catch (error) {
        console.error('Error checking browser compatibility:', error);
        setCompatibilityCheck({
          supported: true, // Assume supported if check fails
          issues: [],
          checked: true
        });
      }
    };

    checkCompatibility();
  }, []);

  // Don't render anything until check is complete
  if (!compatibilityCheck.checked) {
    return <>{children}</>;
  }

  // If browser is supported or user dismissed warnings, render normally
  if (compatibilityCheck.supported || dismissed) {
    return <>{children}</>;
  }

  // Show compatibility warnings
  return (
    <div className="min-h-screen bg-apple-background">
      <div className="container-apple py-8">
        <div className="max-w-2xl mx-auto">
          <ErrorMessage
            message="Browser Compatibility Issues Detected"
            type={ErrorType.BROWSER_COMPATIBILITY}
            onDismiss={() => setDismissed(true)}
          />
          
          <div className="card p-6 mt-6">
            <h2 className="text-apple-title2 font-semibold text-apple-text mb-4">
              Compatibility Issues Found
            </h2>
            
            <div className="space-y-3 mb-6">
              {compatibilityCheck.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-apple-body text-apple-gray">{issue}</p>
                </div>
              ))}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-apple p-4 mb-6">
              <h3 className="text-apple-callout font-medium text-orange-800 mb-2">
                Recommended Browsers
              </h3>
              <ul className="text-apple-callout text-orange-700 space-y-1">
                <li>• Google Chrome (version 80 or later)</li>
                <li>• Mozilla Firefox (version 75 or later)</li>
                <li>• Safari (version 13 or later)</li>
                <li>• Microsoft Edge (version 80 or later)</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setDismissed(true)}
                className="btn-primary flex-1 sm:flex-none"
              >
                Continue Anyway
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="btn-outline flex-1 sm:flex-none"
              >
                Refresh Page
              </button>
            </div>

            <p className="text-apple-caption1 text-apple-gray mt-4">
              Some features may not work properly with your current browser. 
              For the best experience, please update to a supported browser version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}