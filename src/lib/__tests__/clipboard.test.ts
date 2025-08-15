import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  copyToClipboard,
  pasteFromClipboard,
  handleClipboardPermissions,
  isClipboardSupported,
  isClipboardReadSupported,
  copyUrlsToClipboard,
  getClipboardCapabilities
} from '../clipboard';
import { ErrorType } from '../types';

// Mock the global objects
const mockClipboard = {
  writeText: vi.fn(),
  readText: vi.fn(),
};

const mockPermissions = {
  query: vi.fn(),
};

const mockDocument = {
  createElement: vi.fn(),
  execCommand: vi.fn(),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  },
};

// Setup global mocks
beforeEach(() => {
  // Reset all mocks
  vi.clearAllMocks();
  
  // Mock navigator.clipboard
  Object.defineProperty(navigator, 'clipboard', {
    value: mockClipboard,
    writable: true,
  });
  
  // Mock navigator.permissions
  Object.defineProperty(navigator, 'permissions', {
    value: mockPermissions,
    writable: true,
  });
  
  // Mock window.isSecureContext
  Object.defineProperty(window, 'isSecureContext', {
    value: true,
    writable: true,
  });
  
  // Mock document methods
  Object.defineProperty(document, 'createElement', {
    value: mockDocument.createElement,
    writable: true,
  });
  
  Object.defineProperty(document, 'execCommand', {
    value: mockDocument.execCommand,
    writable: true,
  });
  
  Object.defineProperty(document, 'body', {
    value: mockDocument.body,
    writable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('copyToClipboard', () => {
  it('should copy text using modern Clipboard API when available', async () => {
    const testText = 'https://example.com';
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    const result = await copyToClipboard(testText);
    
    expect(result).toBe(true);
    expect(mockClipboard.writeText).toHaveBeenCalledWith(testText);
  });
  
  it('should use fallback when Clipboard API fails', async () => {
    const testText = 'https://example.com';
    mockClipboard.writeText.mockRejectedValue(new Error('API failed'));
    
    // Mock fallback elements
    const mockTextarea = {
      value: '',
      style: {},
      focus: vi.fn(),
      select: vi.fn(),
    };
    
    mockDocument.createElement.mockReturnValue(mockTextarea);
    mockDocument.execCommand.mockReturnValue(true);
    
    const result = await copyToClipboard(testText);
    
    expect(result).toBe(true);
    expect(mockDocument.createElement).toHaveBeenCalledWith('textarea');
    expect(mockDocument.execCommand).toHaveBeenCalledWith('copy');
  });
  
  it('should use fallback when not in secure context', async () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      writable: true,
    });
    
    const testText = 'https://example.com';
    const mockTextarea = {
      value: '',
      style: {},
      focus: vi.fn(),
      select: vi.fn(),
    };
    
    mockDocument.createElement.mockReturnValue(mockTextarea);
    mockDocument.execCommand.mockReturnValue(true);
    
    const result = await copyToClipboard(testText);
    
    expect(result).toBe(true);
    expect(mockClipboard.writeText).not.toHaveBeenCalled();
  });
  
  it('should return false when both modern API and fallback fail', async () => {
    mockClipboard.writeText.mockRejectedValue(new Error('API failed'));
    mockDocument.createElement.mockImplementation(() => {
      throw new Error('createElement failed');
    });
    
    const result = await copyToClipboard('test');
    
    expect(result).toBe(false);
  });
});

describe('pasteFromClipboard', () => {
  it('should paste text using modern Clipboard API when available', async () => {
    const testText = 'pasted content';
    mockClipboard.readText.mockResolvedValue(testText);
    mockPermissions.query.mockResolvedValue({ state: 'granted' });
    
    const result = await pasteFromClipboard();
    
    expect(result).toBe(testText);
    expect(mockClipboard.readText).toHaveBeenCalled();
  });
  
  it('should handle permission denied gracefully', async () => {
    mockPermissions.query.mockResolvedValue({ state: 'denied' });
    
    await expect(pasteFromClipboard()).rejects.toMatchObject({
      type: ErrorType.CLIPBOARD_ERROR,
      message: 'Failed to paste from clipboard',
      recoverable: true,
    });
  });
  
  it('should throw error when not in secure context', async () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      writable: true,
    });
    
    await expect(pasteFromClipboard()).rejects.toMatchObject({
      type: ErrorType.CLIPBOARD_ERROR,
      recoverable: true,
    });
  });
  
  it('should handle Clipboard API read failure', async () => {
    mockPermissions.query.mockResolvedValue({ state: 'granted' });
    mockClipboard.readText.mockRejectedValue(new Error('Read failed'));
    
    await expect(pasteFromClipboard()).rejects.toMatchObject({
      type: ErrorType.CLIPBOARD_ERROR,
      recoverable: true,
    });
  });
});

describe('handleClipboardPermissions', () => {
  it('should return true when permission is granted', async () => {
    mockPermissions.query.mockResolvedValue({ state: 'granted' });
    
    const result = await handleClipboardPermissions();
    
    expect(result).toBe(true);
    expect(mockPermissions.query).toHaveBeenCalledWith({ 
      name: 'clipboard-read' 
    });
  });
  
  it('should return true when permission is prompt', async () => {
    mockPermissions.query.mockResolvedValue({ state: 'prompt' });
    
    const result = await handleClipboardPermissions();
    
    expect(result).toBe(true);
  });
  
  it('should return false when permission is denied', async () => {
    mockPermissions.query.mockResolvedValue({ state: 'denied' });
    
    const result = await handleClipboardPermissions();
    
    expect(result).toBe(false);
  });
  
  it('should return true when permissions API is not available', async () => {
    Object.defineProperty(navigator, 'permissions', {
      value: undefined,
      writable: true,
    });
    
    const result = await handleClipboardPermissions();
    
    expect(result).toBe(true);
  });
  
  it('should return true when permission query fails', async () => {
    mockPermissions.query.mockRejectedValue(new Error('Query failed'));
    
    const result = await handleClipboardPermissions();
    
    expect(result).toBe(true);
  });
});

describe('isClipboardSupported', () => {
  it('should return true when modern Clipboard API is available', () => {
    const result = isClipboardSupported();
    expect(result).toBe(true);
  });
  
  it('should return true when execCommand is available', () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });
    
    const result = isClipboardSupported();
    expect(result).toBe(true);
  });
  
  it('should return false when no clipboard support is available', () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });
    
    Object.defineProperty(document, 'execCommand', {
      value: undefined,
      writable: true,
    });
    
    const result = isClipboardSupported();
    expect(result).toBe(false);
  });
});

describe('isClipboardReadSupported', () => {
  it('should return true when modern API is available in secure context', () => {
    const result = isClipboardReadSupported();
    expect(result).toBe(true);
  });
  
  it('should return false when not in secure context', () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      writable: true,
    });
    
    const result = isClipboardReadSupported();
    expect(result).toBe(false);
  });
  
  it('should return false when Clipboard API is not available', () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });
    
    const result = isClipboardReadSupported();
    expect(result).toBe(false);
  });
});

describe('copyUrlsToClipboard', () => {
  it('should copy multiple URLs with default separator', async () => {
    const urls = ['https://example.com', 'https://test.com'];
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    const result = await copyUrlsToClipboard(urls);
    
    expect(result).toBe(true);
    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      'https://example.com\nhttps://test.com'
    );
  });
  
  it('should copy URLs with custom separator', async () => {
    const urls = ['https://example.com', 'https://test.com'];
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    const result = await copyUrlsToClipboard(urls, ', ');
    
    expect(result).toBe(true);
    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      'https://example.com, https://test.com'
    );
  });
  
  it('should return false for empty URL array', async () => {
    const result = await copyUrlsToClipboard([]);
    
    expect(result).toBe(false);
    expect(mockClipboard.writeText).not.toHaveBeenCalled();
  });
});

describe('getClipboardCapabilities', () => {
  it('should return correct capabilities in secure context with modern API', () => {
    const capabilities = getClipboardCapabilities();
    
    expect(capabilities).toEqual({
      canCopy: true,
      canRead: true,
      hasModernAPI: true,
      hasFallback: true,
      requiresUserGesture: false,
    });
  });
  
  it('should return correct capabilities in non-secure context', () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      writable: true,
    });
    
    const capabilities = getClipboardCapabilities();
    
    expect(capabilities).toEqual({
      canCopy: true,
      canRead: false,
      hasModernAPI: false,
      hasFallback: true,
      requiresUserGesture: true,
    });
  });
  
  it('should return correct capabilities without any clipboard support', () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });
    
    Object.defineProperty(document, 'execCommand', {
      value: undefined,
      writable: true,
    });
    
    const capabilities = getClipboardCapabilities();
    
    expect(capabilities).toEqual({
      canCopy: false,
      canRead: false,
      hasModernAPI: false,
      hasFallback: false,
      requiresUserGesture: false, // This should be false when isSecureContext is true
    });
  });
});