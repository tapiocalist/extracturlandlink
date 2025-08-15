import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { URLList } from '../URLList';
import { ExtractedURL } from '@/lib/types';

// Mock the clipboard utilities
vi.mock('@/lib/clipboard', () => ({
  copyToClipboard: vi.fn(),
  copyUrlsToClipboard: vi.fn()
}));

import { copyToClipboard, copyUrlsToClipboard } from '@/lib/clipboard';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';
const mockCopyToClipboard = copyToClipboard as ReturnType<typeof vi.fn>;
const mockCopyUrlsToClipboard = copyUrlsToClipboard as ReturnType<typeof vi.fn>;

describe('URLList', () => {
  const mockUrls: ExtractedURL[] = [
    {
      id: '1',
      url: 'https://example.com',
      displayText: 'Example Site',
      isValid: true,
      originalIndex: 0
    },
    {
      id: '2',
      url: 'https://github.com',
      displayText: 'GitHub',
      isValid: true,
      originalIndex: 1
    },
    {
      id: '3',
      url: 'invalid-url',
      displayText: 'Invalid URL',
      isValid: false,
      originalIndex: 2
    }
  ];

  const mockProps = {
    urls: mockUrls,
    onUrlsChange: vi.fn(),
    onCopyAll: vi.fn(),
    onOpenAll: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCopyToClipboard.mockResolvedValue(true);
    mockCopyUrlsToClipboard.mockResolvedValue(true);
  });

  it('renders nothing when no URLs are provided', () => {
    const { container } = render(
      <URLList {...mockProps} urls={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('displays all URLs with correct information', () => {
    render(<URLList {...mockProps} />);
    
    expect(screen.getByText('Extracted URLs (3)')).toBeInTheDocument();
    expect(screen.getByText('Example Site')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
    
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('https://github.com')).toBeInTheDocument();
    expect(screen.getByText('invalid-url')).toBeInTheDocument();
  });

  it('shows valid and invalid status badges', () => {
    render(<URLList {...mockProps} />);
    
    const validBadges = screen.getAllByText('Valid');
    const invalidBadges = screen.getAllByText('Invalid');
    
    expect(validBadges).toHaveLength(2);
    expect(invalidBadges).toHaveLength(1);
  });

  it('allows editing display text', async () => {
    render(<URLList {...mockProps} />);
    
    // Click on display text to start editing
    fireEvent.click(screen.getByText('Example Site'));
    
    // Should show input field
    const input = screen.getByDisplayValue('Example Site');
    expect(input).toBeInTheDocument();
    
    // Change the text
    fireEvent.change(input, { target: { value: 'New Display Text' } });
    
    // Save by pressing Enter
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockProps.onUrlsChange).toHaveBeenCalledWith([
      { ...mockUrls[0], displayText: 'New Display Text' },
      mockUrls[1],
      mockUrls[2]
    ]);
  });

  it('cancels editing when Escape is pressed', () => {
    render(<URLList {...mockProps} />);
    
    // Start editing
    fireEvent.click(screen.getByText('Example Site'));
    const input = screen.getByDisplayValue('Example Site');
    
    // Change text
    fireEvent.change(input, { target: { value: 'Changed Text' } });
    
    // Cancel with Escape
    fireEvent.keyDown(input, { key: 'Escape' });
    
    // Should not call onUrlsChange
    expect(mockProps.onUrlsChange).not.toHaveBeenCalled();
    
    // Should show original text
    expect(screen.getByText('Example Site')).toBeInTheDocument();
  });

  it('deletes URLs when delete button is clicked', () => {
    render(<URLList {...mockProps} />);
    
    // Find and click delete button for first URL
    const deleteButtons = screen.getAllByTitle('Delete URL');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockProps.onUrlsChange).toHaveBeenCalledWith([
      mockUrls[1],
      mockUrls[2]
    ]);
  });

  it('copies individual URLs when copy button is clicked', async () => {
    render(<URLList {...mockProps} />);
    
    // Find and click copy button for first URL
    const copyButtons = screen.getAllByTitle('Copy URL');
    fireEvent.click(copyButtons[0]);
    
    expect(mockCopyToClipboard).toHaveBeenCalledWith('https://example.com');
    
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('copies all URLs when Copy All button is clicked', async () => {
    render(<URLList {...mockProps} />);
    
    const copyAllButton = screen.getByText('Copy All URLs');
    fireEvent.click(copyAllButton);
    
    expect(mockCopyUrlsToClipboard).toHaveBeenCalledWith([
      'https://example.com',
      'https://github.com',
      'invalid-url'
    ]);
    
    await waitFor(() => {
      expect(screen.getByText('All URLs copied!')).toBeInTheDocument();
    });
    
    expect(mockProps.onCopyAll).toHaveBeenCalled();
  });

  it('opens all valid URLs when Open All button is clicked', async () => {
    // Mock window.open
    const mockOpen = vi.fn();
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true
    });

    // Mock window.confirm to return true
    const mockConfirm = vi.fn().mockReturnValue(true);
    Object.defineProperty(window, 'confirm', {
      value: mockConfirm,
      writable: true
    });

    render(<URLList {...mockProps} />);
    
    const openAllButton = screen.getByText('Open URLs (2)');
    fireEvent.click(openAllButton);
    
    // Should show confirmation dialog and then open first URL
    expect(mockConfirm).toHaveBeenCalled();
    expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
    expect(mockProps.onOpenAll).toHaveBeenCalled();
  });

  it('shows confirmation dialog for opening many URLs', () => {
    const manyUrls = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      url: `https://example${i}.com`,
      displayText: `Example ${i}`,
      isValid: true,
      originalIndex: i
    }));

    // Mock window.confirm
    const mockConfirm = vi.fn().mockReturnValue(false);
    Object.defineProperty(window, 'confirm', {
      value: mockConfirm,
      writable: true
    });

    render(<URLList {...mockProps} urls={manyUrls} />);
    
    const openAllButton = screen.getByText('Open URLs (10)');
    fireEvent.click(openAllButton);
    
    expect(mockConfirm).toHaveBeenCalledWith(
      expect.stringContaining('You have 10 URLs to open')
    );
  });

  it('displays correct summary information', () => {
    render(<URLList {...mockProps} />);
    
    expect(screen.getByText(/Found 3 URLs in your content/)).toBeInTheDocument();
    expect(screen.getByText(/1 may be invalid/)).toBeInTheDocument();
  });
});