'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { URLList } from '@/components/URLList';
import { parseHyperlinkedContent } from '@/lib/url-parser';
import { URLExtractorProps, ExtractedURL, ErrorType } from '@/lib/types';
import { AppErrorHandler } from '@/lib/error-handler';
import { trackURLExtraction, trackError } from '@/lib/analytics';

export function URLExtractor({ onURLsExtracted }: URLExtractorProps) {
  const [inputContent, setInputContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedUrls, setExtractedUrls] = useState<ExtractedURL[]>([]);
  const [parsedHtml, setParsedHtml] = useState<string>('');
  const [hasHtmlContent, setHasHtmlContent] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const getCurrentEditorContent = () => {
    const editor = editorRef.current;
    return {
      html: editor?.innerHTML || inputContent,
      text: editor?.textContent || ''
    };
  };



  const handleExtractUrls = async () => {
    const { html: currentContent, text: textContent } = getCurrentEditorContent();
    
    console.log('Extracting URLs - HTML:', currentContent);
    console.log('Extracting URLs - Text:', textContent);
    
    if (!textContent.trim()) {
      setError('Please paste some content to extract URLs from');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Extracting URLs from content:', currentContent);
      const result = parseHyperlinkedContent(currentContent);
      
      setExtractedUrls(result.extractedUrls);
      setParsedHtml(result.originalHtml);
      
      // Notify parent component about extracted URLs
      onURLsExtracted(result.extractedUrls);
      
      // Track successful URL extraction
      trackURLExtraction(result.extractedUrls.length, currentContent.length);
      
      if (result.extractedUrls.length === 0) {
        setError('No URLs found in the provided content');
      }
    } catch (err) {
      console.error('Error extracting URLs:', err);
      
      // Use enhanced error handling
      const appError = AppErrorHandler.handleError(err, {
        component: 'URLExtractor',
        action: 'extractUrls',
        contentLength: currentContent.length,
        urlCount: extractedUrls.length
      });
      
      AppErrorHandler.logError(appError, {
        component: 'URLExtractor',
        action: 'extractUrls',
        contentLength: currentContent.length
      });
      
      // Track error
      trackError('extraction_failed', 'URLExtractor');
      
      setError(AppErrorHandler.getErrorMessage(appError));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleExtractUrls();
  };

  const handleClearError = () => {
    setError(null);
  };

  const handleConvertToHtml = () => {
    const editor = editorRef.current;
    if (!editor) return;
    
    // First try to detect hidden URLs
    const detectedContent = detectHiddenUrls(inputContent);
    
    if (detectedContent !== inputContent) {
      // Found hidden URLs
      editor.innerHTML = detectedContent;
      setInputContent(detectedContent);
      setHasHtmlContent(true);
    } else {
      // Fallback to plain text URL conversion
      const textContent = editor.textContent || '';
      const convertedHtml = convertPlainTextUrlsToHtml(textContent);
      
      editor.innerHTML = convertedHtml;
      setInputContent(convertedHtml);
      setHasHtmlContent(convertedHtml !== textContent);
    }
    
    // Clear previous results
    if (extractedUrls.length > 0) {
      setExtractedUrls([]);
      setParsedHtml('');
    }
  };

  const convertPlainTextUrlsToHtml = (text: string): string => {
    // Regex to match URLs in plain text
    const urlRegex = /(https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?)/gi;
    
    // Replace URLs with HTML anchor tags using black color
    const htmlContent = text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #000000; text-decoration: underline;">${url}</a>`;
    });
    
    // Wrap in paragraph tags and preserve line breaks
    return htmlContent.replace(/\n/g, '<br>');
  };

  // More aggressive URL detection for Google Sheets content
  const detectHiddenUrls = (content: string): string => {
    console.log('Trying to detect hidden URLs in content:', content);
    
    // For Google Sheets, sometimes the URLs are in the clipboard but not visible
    // Let's try to extract them from any hidden attributes or data
    const editor = editorRef.current;
    if (editor) {
      // Check if there are any hidden links in the DOM
      const links = editor.querySelectorAll('a[href]');
      console.log('Found links in editor:', links.length);
      
      if (links.length > 0) {
        // Convert existing links to visible format
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href) {
            link.textContent = href;
            (link as HTMLElement).style.color = '#000000';
          }
        });
        setHasHtmlContent(true);
        return editor.innerHTML;
      }
    }
    
    // If no links found, return original content
    return content;
  };

  const handleRichTextPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError(null);
    
    try {
      const clipboardData = e.clipboardData;
      const htmlContent = clipboardData.getData('text/html');
      const textContent = clipboardData.getData('text/plain');
      
      console.log('Pasting - HTML:', htmlContent);
      console.log('Pasting - Text:', textContent);
      
      const editor = editorRef.current;
      if (!editor) return;
      
      if (htmlContent && htmlContent.trim()) {
        // Insert HTML content directly using modern DOM methods
        editor.innerHTML = htmlContent;
        setHasHtmlContent(true);
        setInputContent(htmlContent);
        console.log('Detected HTML content with potential links');
      } else if (textContent) {
        // Convert plain text URLs to links
        const convertedHtml = convertPlainTextUrlsToHtml(textContent);
        editor.innerHTML = convertedHtml;
        setInputContent(convertedHtml);
        setHasHtmlContent(convertedHtml !== textContent);
        console.log('Converted plain text to HTML');
      }
      
      // Clear previous results
      if (extractedUrls.length > 0) {
        setExtractedUrls([]);
        setParsedHtml('');
      }
    } catch (error) {
      console.error('Error handling rich text paste:', error);
      
      const appError = AppErrorHandler.handleError(error, {
        component: 'URLExtractor',
        action: 'paste'
      });
      
      AppErrorHandler.logError(appError);
      setError(AppErrorHandler.getErrorMessage(appError));
    }
  };

  const handleRichTextInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setInputContent(content);
    setError(null);
    
    // Check if content has HTML tags (indicating rich content)
    const hasHtml = /<[^>]*>/g.test(content);
    setHasHtmlContent(hasHtml);
    
    // Clear previous results when content changes
    if (extractedUrls.length > 0) {
      setExtractedUrls([]);
      setParsedHtml('');
    }
  };

  // Set placeholder behavior
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const updatePlaceholder = () => {
      if (editor.textContent?.trim() === '') {
        editor.classList.add('empty');
      } else {
        editor.classList.remove('empty');
      }
    };

    updatePlaceholder();
    editor.addEventListener('input', updatePlaceholder);
    
    return () => {
      editor.removeEventListener('input', updatePlaceholder);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <div className="card p-6">
        <h2 className="text-apple-title2 font-semibold text-apple-text mb-4">
          Paste Your Content
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-apple-text mb-2">
            Content with Hyperlinks
          </label>
          
          {/* Rich Text Editor Area */}
          <div 
            ref={editorRef}
            contentEditable
            className="w-full min-h-[200px] sm:min-h-[160px] px-4 py-3 border border-apple-gray border-opacity-30 rounded-apple focus:outline-none focus:ring-2 focus:ring-apple-yellow focus:border-apple-yellow transition-all duration-200 bg-white prose prose-apple max-w-none touch-manipulation"
            style={{
              fontSize: '1rem', // Use 16px base to prevent zoom on iOS
              lineHeight: '1.47059',
              letterSpacing: '-0.022em'
            }}
            onPaste={handleRichTextPaste}
            onInput={handleRichTextInput}
            data-placeholder="Paste your hyperlinked content here (from Google Sheets, documents, emails, etc.)..."
            suppressContentEditableWarning={true}
          />
          
          <p className="mt-2 text-sm text-apple-gray">
            {hasHtmlContent 
              ? "✓ Hyperlinks detected" 
              : "Paste content with Ctrl+V to preserve hyperlink formatting."}
          </p>
        </div>



        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleExtractUrls}
            isLoading={isLoading}
            disabled={(!inputContent.trim() && !editorRef.current?.textContent?.trim()) || isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? 'Extracting URLs...' : 'GET URL'}
          </Button>
          
          {(inputContent.trim() || editorRef.current?.textContent?.trim()) && !hasHtmlContent && (inputContent.includes('http') || editorRef.current?.textContent?.includes('http')) && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleConvertToHtml}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Convert URLs to Links
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorMessage
          message={error}
          type={ErrorType.PARSING_ERROR}
          onRetry={error === 'ERROR, PLEASE TRY AGAIN' ? handleRetry : undefined}
          onDismiss={handleClearError}
        />
      )}



      {/* URL List Component */}
      <URLList 
        urls={extractedUrls}
        onUrlsChange={setExtractedUrls}
        onCopyAll={() => console.log('All URLs copied')}
        onOpenAll={() => console.log('All URLs opened')}
      />
    </div>
  );
}