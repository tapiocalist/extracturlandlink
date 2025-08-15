// Core data interfaces
export interface ExtractedURL {
  id: string;
  url: string;
  displayText: string;
  isValid: boolean;
  originalIndex: number;
}

export interface ApplicationState {
  inputContent: string;
  extractedUrls: ExtractedURL[];
  isProcessing: boolean;
  error: string | null;
  clipboardSupported: boolean;
}

export interface AppConfig {
  maxContentLength: number;
  maxUrlCount: number;
  supportedBrowsers: string[];
  analytics: {
    enabled: boolean;
    trackingId: string;
  };
}

// Error handling types
export enum ErrorType {
  PARSING_ERROR = 'PARSING_ERROR',
  CLIPBOARD_ERROR = 'CLIPBOARD_ERROR',
  BROWSER_COMPATIBILITY = 'BROWSER_COMPATIBILITY',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  recoverable: boolean;
}

// Component prop interfaces
export interface URLExtractorProps {
  onURLsExtracted: (urls: ExtractedURL[]) => void;
}

export interface URLListProps {
  urls: ExtractedURL[];
  onUrlsChange: (urls: ExtractedURL[]) => void;
  onCopyAll: () => void;
  onOpenAll: () => void;
}

export interface NavigationProps {
  currentPath: string;
}

// Utility function type definitions
export interface ParsedContent {
  originalHtml: string;
  extractedUrls: ExtractedURL[];
}

// URL parser function types
export type ParseHyperlinkedContentFn = (content: string) => ParsedContent;
export type ValidateUrlFn = (url: string) => boolean;
export type SanitizeHtmlFn = (html: string) => string;

// Clipboard function types
export type CopyToClipboardFn = (text: string) => Promise<boolean>;
export type PasteFromClipboardFn = () => Promise<string>;
export type HandleClipboardPermissionsFn = () => Promise<boolean>;

// Component state interfaces
export interface URLExtractorState {
  inputContent: string;
  isLoading: boolean;
  error: string | null;
  extractedUrls: ExtractedURL[];
}