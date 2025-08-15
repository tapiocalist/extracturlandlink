import { ErrorType, AppError } from './types';

/**
 * Clipboard management utilities with modern Clipboard API and fallback support
 */

/**
 * Copy text to clipboard using modern Clipboard API with fallback
 * @param text - Text to copy to clipboard
 * @returns Promise<boolean> - Success status
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Check if modern Clipboard API is available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers or non-secure contexts
    return copyToClipboardFallback(text);
  } catch (error) {
    console.warn('Clipboard copy failed:', error);
    // Try fallback method
    return copyToClipboardFallback(text);
  }
}

/**
 * Paste text from clipboard using modern Clipboard API with permission handling
 * @returns Promise<string> - Pasted text content
 */
export async function pasteFromClipboard(): Promise<string> {
  try {
    // Check if modern Clipboard API is available
    if (navigator.clipboard && window.isSecureContext) {
      // Check permissions first
      const hasPermission = await handleClipboardPermissions();
      if (!hasPermission) {
        throw new Error('Clipboard read permission denied');
      }
      
      const text = await navigator.clipboard.readText();
      return text;
    }
    
    // Fallback for older browsers
    return pasteFromClipboardFallback();
  } catch (error) {
    console.warn('Clipboard paste failed:', error);
    throw createClipboardError('Failed to paste from clipboard', true);
  }
}

/**
 * Handle clipboard permissions for read operations
 * @returns Promise<boolean> - Permission granted status
 */
export async function handleClipboardPermissions(): Promise<boolean> {
  try {
    // Check if permissions API is available
    if (!navigator.permissions) {
      // Assume permission is granted if API is not available
      return true;
    }
    
    const permission = await navigator.permissions.query({ 
      name: 'clipboard-read' as PermissionName 
    });
    
    return permission.state === 'granted' || permission.state === 'prompt';
  } catch (error) {
    console.warn('Clipboard permission check failed:', error);
    // If permission check fails, try to proceed anyway
    return true;
  }
}

/**
 * Fallback clipboard copy method for older browsers
 * @param text - Text to copy
 * @returns boolean - Success status
 */
function copyToClipboardFallback(text: string): boolean {
  try {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    // Use execCommand as fallback
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    return successful;
  } catch (error) {
    console.error('Fallback clipboard copy failed:', error);
    return false;
  }
}

/**
 * Fallback clipboard paste method for older browsers
 * @returns Promise<string> - Empty string as fallback cannot read clipboard
 */
function pasteFromClipboardFallback(): Promise<string> {
  // Fallback cannot read from clipboard for security reasons
  // Return empty string and let user know they need to paste manually
  throw createClipboardError(
    'Clipboard read not supported. Please paste content manually.',
    true
  );
}

/**
 * Check if clipboard operations are supported
 * @returns boolean - Clipboard support status
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard || document.execCommand);
}

/**
 * Check if clipboard read operations are supported
 * @returns boolean - Clipboard read support status
 */
export function isClipboardReadSupported(): boolean {
  return !!(navigator.clipboard && window.isSecureContext);
}

/**
 * Create a standardized clipboard error
 * @param message - Error message
 * @param recoverable - Whether the error is recoverable
 * @returns AppError - Standardized error object
 */
function createClipboardError(message: string, recoverable: boolean): AppError {
  return {
    type: ErrorType.CLIPBOARD_ERROR,
    message,
    recoverable
  };
}

/**
 * Copy multiple URLs to clipboard with formatting
 * @param urls - Array of URLs to copy
 * @param separator - Separator between URLs (default: newline)
 * @returns Promise<boolean> - Success status
 */
export async function copyUrlsToClipboard(
  urls: string[], 
  separator: string = '\n'
): Promise<boolean> {
  if (urls.length === 0) {
    return false;
  }
  
  const urlText = urls.join(separator);
  return copyToClipboard(urlText);
}

/**
 * Get clipboard capabilities for the current browser
 * @returns Object with capability flags
 */
export function getClipboardCapabilities() {
  return {
    canCopy: isClipboardSupported(),
    canRead: isClipboardReadSupported(),
    hasModernAPI: !!(navigator.clipboard && window.isSecureContext),
    hasFallback: !!document.execCommand,
    requiresUserGesture: !window.isSecureContext
  };
}