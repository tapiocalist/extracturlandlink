'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { copyToClipboard, copyUrlsToClipboard } from '@/lib/clipboard';
import { URLListProps, ExtractedURL } from '@/lib/types';
import { AppErrorHandler } from '@/lib/error-handler';
import { trackURLCopy, trackURLOpen, trackURLEdit, trackURLDelete, trackError } from '@/lib/analytics';

export function URLList({ urls, onUrlsChange, onCopyAll, onOpenAll }: URLListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleEditStart = (url: ExtractedURL) => {
    setEditingId(url.id);
    setEditingText(url.displayText);
  };

  const handleEditSave = (urlId: string) => {
    const updatedUrls = urls.map(url => 
      url.id === urlId 
        ? { ...url, displayText: editingText.trim() || url.url }
        : url
    );
    onUrlsChange(updatedUrls);
    setEditingId(null);
    setEditingText('');
    
    // Track URL edit
    trackURLEdit();
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleDelete = (urlId: string) => {
    const updatedUrls = urls.filter(url => url.id !== urlId);
    onUrlsChange(updatedUrls);
    
    // Track URL deletion
    trackURLDelete();
  };

  const handleCopyUrl = async (url: string) => {
    try {
      const success = await copyToClipboard(url);
      if (success) {
        setCopyFeedback('Copied!');
        setTimeout(() => setCopyFeedback(null), 2000);
        
        // Track successful copy
        trackURLCopy(1, 'single');
      } else {
        setCopyFeedback('Copy failed');
        setTimeout(() => setCopyFeedback(null), 2000);
      }
    } catch (error) {
      const appError = AppErrorHandler.handleError(error, {
        component: 'URLList',
        action: 'copyUrl'
      });
      
      AppErrorHandler.logError(appError);
      setCopyFeedback('Copy failed');
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  const handleCopyAllUrls = async () => {
    try {
      const urlStrings = urls.map(url => url.url);
      const success = await copyUrlsToClipboard(urlStrings);
      if (success) {
        setCopyFeedback('All URLs copied!');
        setTimeout(() => setCopyFeedback(null), 2000);
        onCopyAll();
        
        // Track successful copy all
        trackURLCopy(urlStrings.length, 'all');
      } else {
        setCopyFeedback('Copy failed');
        setTimeout(() => setCopyFeedback(null), 2000);
      }
    } catch (error) {
      const appError = AppErrorHandler.handleError(error, {
        component: 'URLList',
        action: 'copyAllUrls',
        urlCount: urls.length
      });
      
      AppErrorHandler.logError(appError);
      setCopyFeedback('Copy failed');
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  const handleOpenAllUrls = () => {
    // Check if we have URLs to open
    if (urls.length === 0) return;

    const validUrls = urls.filter(url => url.isValid);
    
    if (validUrls.length === 1) {
      // Just open the single URL without switching focus
      const newWindow = window.open(validUrls[0].url, '_blank', 'noopener,noreferrer');
      
      // Multiple approaches to keep focus on current window
      setTimeout(() => {
        if (newWindow) {
          newWindow.blur(); // Remove focus from new window
        }
        window.focus();   // Keep focus on current window
        document.body.focus(); // Additional focus on body
      }, 10);
      
      onOpenAll();
      
      // Track URL opening
      trackURLOpen(1, 'single');
      return;
    }

    // For multiple URLs, show options to user
    const message = `You have ${validUrls.length} URLs to open. Choose an option:\n\n` +
      `OK - Open first URL now, then show popup blocker instructions\n` +
      `Cancel - Copy all URLs to clipboard instead`;
    
    const confirmed = window.confirm(message);
    
    if (confirmed) {
      // Open first URL without switching focus
      const newWindow = window.open(validUrls[0].url, '_blank', 'noopener,noreferrer');
      
      // Multiple approaches to keep focus on current window
      setTimeout(() => {
        if (newWindow) {
          newWindow.blur(); // Remove focus from new window
        }
        window.focus();   // Keep focus on current window
        document.body.focus(); // Additional focus on body
      }, 10);
      
      // Show instructions for remaining URLs
      setCopyFeedback(`Opened first URL. Click individual URLs below to open the rest, or use "Copy All URLs" to copy them.`);
      setTimeout(() => setCopyFeedback(null), 6000);
      
      onOpenAll();
      
      // Track URL opening
      trackURLOpen(validUrls.length, 'all');
    } else {
      // User chose to copy instead
      handleCopyAllUrls();
    }
  };

  if (urls.length === 0) {
    return null;
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-apple-title3 font-semibold text-apple-text">
          Extracted URLs ({urls.length})
        </h3>
        
        {copyFeedback && (
          <span className="bg-apple-yellow text-black px-3 py-1 rounded-full text-apple-callout font-medium">
            {copyFeedback}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          variant="primary"
          size="md"
          onClick={handleCopyAllUrls}
          className="flex-1 sm:flex-none"
        >
          Copy All URLs
        </Button>
        
        <Button
          variant="outline"
          size="md"
          onClick={handleOpenAllUrls}
          className="flex-1 sm:flex-none"
          title={urls.filter(url => url.isValid).length > 1 
            ? "Note: Browser may block multiple popups. Allow popups for this site if needed." 
            : "Open URL in new tab"
          }
        >
          {urls.filter(url => url.isValid).length === 1 
            ? 'Open URL' 
            : `Open URLs (${urls.filter(url => url.isValid).length})`
          }
        </Button>
      </div>

      {/* URL List */}
      <div className="space-y-3">
        {urls.map((urlData) => (
          <div 
            key={urlData.id}
            className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 bg-apple-background rounded-apple border border-apple-gray border-opacity-20"
          >
            {/* URL Info */}
            <div className="flex-1 min-w-0">
              {/* Display Text - Editable */}
              {editingId === urlData.id ? (
                <div className="mb-2">
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    placeholder="Display text"
                    className="text-apple-body font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditSave(urlData.id);
                      } else if (e.key === 'Escape') {
                        handleEditCancel();
                      }
                    }}
                    autoFocus
                  />
                </div>
              ) : (
                <p 
                  className="text-apple-body font-medium text-apple-text mb-2 cursor-pointer hover:text-black transition-colors"
                  onClick={() => handleEditStart(urlData)}
                  title="Click to edit display text"
                >
                  {urlData.displayText}
                </p>
              )}

              {/* URL */}
              <div className="flex items-center gap-2 mb-2">
                <a
                  href={urlData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline text-apple-callout break-all flex-1"
                >
                  {urlData.url}
                </a>
                
                {/* Copy URL Button - Simplified to Yellow + Black */}
                <button
                  onClick={() => handleCopyUrl(urlData.url)}
                  className="bg-apple-yellow text-black hover:bg-opacity-80 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-lg"
                  title="Copy URL"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Status Badge - Simplified to Yellow Number */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-apple-yellow text-black">
                  {urlData.originalIndex + 1}
                </span>
                
                {!urlData.isValid && (
                  <span className="text-apple-caption2 text-apple-gray">
                    (Invalid URL)
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 justify-end sm:justify-start">
              {editingId === urlData.id ? (
                <>
                  <button
                    onClick={() => handleEditSave(urlData.id)}
                    className="bg-apple-yellow text-black hover:bg-opacity-80 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-lg"
                    title="Save changes"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="text-black hover:bg-black hover:bg-opacity-10 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-lg"
                    title="Cancel editing"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditStart(urlData)}
                    className="text-black hover:bg-black hover:bg-opacity-10 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-lg"
                    title="Edit display text"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(urlData.id)}
                    className="text-black hover:bg-black hover:bg-opacity-10 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-lg"
                    title="Delete URL"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 text-apple-caption1 text-apple-gray">
        <p>
          Found {urls.length} URL{urls.length !== 1 ? 's' : ''} in your content.
          {urls.some(url => !url.isValid) && ` ${urls.filter(url => !url.isValid).length} may be invalid.`}
          {' '}Click on display text to edit, or use the action buttons to copy or delete URLs.
        </p>
      </div>
    </div>
  );
}