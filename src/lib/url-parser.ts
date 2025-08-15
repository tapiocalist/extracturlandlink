import { ExtractedURL, ParsedContent } from './types';

/**
 * Validates if a given string is a valid URL
 * @param url - The URL string to validate
 * @returns boolean indicating if the URL is valid
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Remove leading/trailing whitespace
  const trimmedUrl = url.trim();
  
  if (trimmedUrl.length === 0) {
    return false;
  }

  try {
    // Use URL constructor for validation
    const urlObj = new URL(trimmedUrl);
    
    // Check for valid protocols
    const validProtocols = ['http:', 'https:', 'ftp:', 'ftps:', 'mailto:'];
    if (!validProtocols.includes(urlObj.protocol)) {
      return false;
    }

    // Additional validation for http/https URLs
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      // Must have a hostname
      if (!urlObj.hostname || urlObj.hostname.length === 0) {
        return false;
      }
      
      // Reject hostnames that are just dots
      if (urlObj.hostname === '.' || urlObj.hostname === '..' || urlObj.hostname.startsWith('./')) {
        return false;
      }
      
      // Hostname should contain at least one dot (basic domain validation)
      if (!urlObj.hostname.includes('.') && urlObj.hostname !== 'localhost') {
        return false;
      }
    }

    // Check for spaces in the URL (should be encoded)
    if (trimmedUrl.includes(' ')) {
      return false;
    }

    return true;
  } catch (error) {
    // If URL constructor throws, it's not a valid URL
    return false;
  }
}

/**
 * Sanitizes HTML content to prevent XSS attacks while preserving links
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Function to recursively sanitize nodes
  function sanitizeNode(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      // Text nodes are safe, return as-is
      return node.cloneNode(true);
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      
      // Only allow specific safe tags
      const allowedTags = ['a', 'p', 'br', 'div', 'span', 'strong', 'em', 'b', 'i', 'section', 'article', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot'];
      
      if (!allowedTags.includes(tagName)) {
        // For disallowed tags, return their text content
        const textNode = document.createTextNode(element.textContent || '');
        return textNode;
      }
      
      // Create new element
      const newElement = document.createElement(tagName);
      
      // Handle attributes for allowed tags
      if (tagName === 'a') {
        const href = element.getAttribute('href');
        console.log('Processing anchor tag with href:', href);
        if (href && validateUrl(href)) {
          console.log('URL is valid:', href);
          newElement.setAttribute('href', href);
          // Add security attributes for external links
          newElement.setAttribute('target', '_blank');
          newElement.setAttribute('rel', 'noopener noreferrer');
        } else {
          console.log('URL is invalid or missing:', href);
          // If href is invalid, return just the text content without the anchor tag
          const textNode = document.createTextNode(element.textContent || '');
          return textNode;
        }
      }
      
      // Recursively sanitize child nodes
      for (let i = 0; i < node.childNodes.length; i++) {
        const sanitizedChild = sanitizeNode(node.childNodes[i]);
        if (sanitizedChild) {
          newElement.appendChild(sanitizedChild);
        }
      }
      
      return newElement;
    }
    
    // Skip other node types (comments, etc.)
    return null;
  }

  // Sanitize all child nodes
  const sanitizedDiv = document.createElement('div');
  for (let i = 0; i < tempDiv.childNodes.length; i++) {
    const sanitizedNode = sanitizeNode(tempDiv.childNodes[i]);
    if (sanitizedNode) {
      sanitizedDiv.appendChild(sanitizedNode);
    }
  }

  return sanitizedDiv.innerHTML;
}

/**
 * Generates a unique ID for extracted URLs
 * @returns A unique string ID
 */
function generateUrlId(): string {
  return `url-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parses hyperlinked content and extracts URLs
 * @param content - The content string (can be HTML or plain text)
 * @returns ParsedContent object with original HTML and extracted URLs
 */
export function parseHyperlinkedContent(content: string): ParsedContent {
  if (!content || typeof content !== 'string') {
    return {
      originalHtml: '',
      extractedUrls: []
    };
  }

  // Check if this is Google Sheets content
  const isGoogleSheetsContent = content.includes('google-sheets-html-origin') || content.includes('data-sheets-root');
  
  // For Google Sheets, use a more permissive approach
  let sanitizedHtml: string;
  if (isGoogleSheetsContent) {
    console.log('Detected Google Sheets content, using permissive parsing');
    sanitizedHtml = content; // Skip sanitization for Google Sheets content initially
  } else {
    sanitizedHtml = sanitizeHtml(content);
  }
  
  // Create a temporary DOM element to parse the content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = sanitizedHtml;
  
  const extractedUrls: ExtractedURL[] = [];
  let urlIndex = 0;

  // Find all anchor tags
  const anchorElements = tempDiv.querySelectorAll('a[href]');
  console.log('Found anchor elements:', anchorElements.length);
  
  // If no anchors found after sanitization, try direct regex extraction from original content
  if (anchorElements.length === 0 && isGoogleSheetsContent) {
    console.log('No anchors found after sanitization, trying direct extraction');
    return extractUrlsDirectly(content);
  }
  
  // Create a map to deduplicate URLs and prefer meaningful display text
  const urlMap = new Map<string, ExtractedURL>();
  
  anchorElements.forEach((anchor, index) => {
    const href = anchor.getAttribute('href');
    const displayText = anchor.textContent || (anchor as HTMLElement).innerText || href || '';
    
    console.log(`Anchor ${index + 1}:`, { href, displayText });
    
    if (href && validateUrl(href)) {
      const trimmedDisplayText = displayText.trim();
      
      // Check if we already have this URL
      const existingUrl = urlMap.get(href);
      
      if (!existingUrl) {
        // First time seeing this URL
        urlMap.set(href, {
          id: generateUrlId(),
          url: href,
          displayText: trimmedDisplayText,
          isValid: true,
          originalIndex: urlIndex++
        });
        console.log('Adding new URL:', href);
      } else {
        // We've seen this URL before, check if this has better display text
        const isCurrentTextBetter = trimmedDisplayText !== href && 
                                   trimmedDisplayText.length > 0 && 
                                   (existingUrl.displayText === href || existingUrl.displayText.length === 0);
        
        if (isCurrentTextBetter) {
          // Update with better display text
          existingUrl.displayText = trimmedDisplayText;
          console.log('Updated display text for URL:', href, 'to:', trimmedDisplayText);
        } else {
          console.log('Skipping duplicate URL:', href);
        }
      }
    } else {
      console.log('Skipping invalid URL:', href);
    }
  });
  
  // Convert map values to array
  extractedUrls.push(...urlMap.values());

  // Also check for plain text URLs in the content
  const plainTextUrls = extractPlainTextUrls(tempDiv.textContent || '');
  plainTextUrls.forEach((url) => {
    // Only add if not already extracted from anchor tags
    const alreadyExtracted = extractedUrls.some(extracted => extracted.url === url);
    if (!alreadyExtracted) {
      extractedUrls.push({
        id: generateUrlId(),
        url: url,
        displayText: url,
        isValid: validateUrl(url),
        originalIndex: urlIndex++
      });
    }
  });

  return {
    originalHtml: sanitizedHtml,
    extractedUrls: extractedUrls
  };
}

/**
 * Extracts URLs directly from HTML content using regex (for Google Sheets)
 * @param htmlContent - Raw HTML content
 * @returns ParsedContent with extracted URLs
 */
function extractUrlsDirectly(htmlContent: string): ParsedContent {
  console.log('Using direct URL extraction for Google Sheets content');
  
  const extractedUrls: ExtractedURL[] = [];
  let urlIndex = 0;

  // Regex to find href attributes in anchor tags
  const hrefRegex = /href="([^"]+)"/gi;
  const urlMatches = [...htmlContent.matchAll(hrefRegex)];
  
  console.log('Found href matches:', urlMatches.length);

  // Also extract display text for each URL
  const anchorRegex = /<a[^>]*href="([^"]+)"[^>]*>([^<]*)</gi;
  const anchorMatches = [...htmlContent.matchAll(anchorRegex)];
  
  console.log('Found anchor matches with text:', anchorMatches.length);

  // Create a map of URLs to display text
  const urlToDisplayText = new Map<string, string>();
  anchorMatches.forEach(match => {
    const url = match[1];
    const displayText = match[2].trim();
    if (displayText) {
      urlToDisplayText.set(url, displayText);
    }
  });

  // Process all unique URLs
  const uniqueUrls = [...new Set(urlMatches.map(match => match[1]))];
  
  uniqueUrls.forEach(url => {
    console.log('Processing URL:', url);
    if (validateUrl(url)) {
      const displayText = urlToDisplayText.get(url) || url;
      extractedUrls.push({
        id: generateUrlId(),
        url: url,
        displayText: displayText,
        isValid: true,
        originalIndex: urlIndex++
      });
      console.log('Added URL:', { url, displayText });
    } else {
      console.log('Invalid URL:', url);
    }
  });

  return {
    originalHtml: htmlContent,
    extractedUrls: extractedUrls
  };
}

/**
 * Extracts URLs from plain text content using regex
 * @param text - Plain text content
 * @returns Array of URL strings found in the text
 */
function extractPlainTextUrls(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Regex pattern to match URLs in plain text
  const urlRegex = /https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?/gi;
  
  const matches = text.match(urlRegex);
  if (!matches) {
    return [];
  }

  // Filter out duplicates and validate URLs
  const uniqueUrls = [...new Set(matches)];
  return uniqueUrls.filter(url => validateUrl(url));
}