import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Home from '@/app/page';

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackURLExtraction: vi.fn(),
  trackURLCopy: vi.fn(),
  trackURLOpen: vi.fn(),
  trackURLEdit: vi.fn(),
  trackURLDelete: vi.fn(),
  trackError: vi.fn(),
}));

// Mock clipboard
vi.mock('@/lib/clipboard', () => ({
  copyToClipboard: vi.fn().mockResolvedValue(true),
  copyUrlsToClipboard: vi.fn().mockResolvedValue(true),
}));

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true
});

describe('URL Extraction Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes full URL extraction and management workflow', async () => {
    render(<Home />);

    // Step 1: Verify initial state
    expect(screen.getByText('URL Extractor')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/paste your hyperlinked content/i)).toBeInTheDocument();
    
    const extractButton = screen.getByRole('button', { name: /get url/i });
    expect(extractButton).toBeDisabled();

    // Step 2: Add content with URLs
    const contentArea = screen.getByPlaceholderText(/paste your hyperlinked content/i);
    const htmlContent = '<a href="https://example.com">Example Site</a> and <a href="https://github.com">GitHub</a>';
    
    // Simulate pasting HTML content
    fireEvent.paste(contentArea, {
      clipboardData: {
        getData: (type: string) => {
          if (type === 'text/html') return htmlContent;
          if (type === 'text/plain') return 'Example Site and GitHub';
          return '';
        }
      }
    });

    // Step 3: Extract URLs
    await waitFor(() => {
      expect(extractButton).not.toBeDisabled();
    });

    fireEvent.click(extractButton);

    // Step 4: Verify URLs are extracted and displayed
    await waitFor(() => {
      expect(screen.getByText('Extracted URLs (2)')).toBeInTheDocument();
      expect(screen.getByText('Example Site')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
      expect(screen.getByText('https://github.com')).toBeInTheDocument();
    });

    // Step 5: Test URL management features
    
    // Edit display text
    const displayText = screen.getByText('Example Site');
    fireEvent.click(displayText);
    
    const editInput = screen.getByDisplayValue('Example Site');
    fireEvent.change(editInput, { target: { value: 'Updated Example' } });
    fireEvent.keyDown(editInput, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('Updated Example')).toBeInTheDocument();
    });

    // Copy individual URL
    const copyButtons = screen.getAllByTitle('Copy URL');
    fireEvent.click(copyButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    // Copy all URLs
    const copyAllButton = screen.getByText('Copy All URLs');
    fireEvent.click(copyAllButton);
    
    await waitFor(() => {
      expect(screen.getByText('All URLs copied!')).toBeInTheDocument();
    });

    // Open URL
    const openButton = screen.getByText('Open URLs (2)');
    fireEvent.click(openButton);
    
    // Should show confirmation for multiple URLs
    expect(mockWindowOpen).toHaveBeenCalled();

    // Delete URL
    const deleteButtons = screen.getAllByTitle('Delete URL');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Extracted URLs (1)')).toBeInTheDocument();
      expect(screen.queryByText('Updated Example')).not.toBeInTheDocument();
    });
  });

  it('handles error scenarios gracefully', async () => {
    // Mock URL parser to throw error
    vi.doMock('@/lib/url-parser', () => ({
      parseHyperlinkedContent: vi.fn().mockRejectedValue(new Error('Parsing failed'))
    }));

    render(<Home />);

    const contentArea = screen.getByPlaceholderText(/paste your hyperlinked content/i);
    const extractButton = screen.getByRole('button', { name: /get url/i });

    // Add content
    fireEvent.input(contentArea, { target: { textContent: 'Some content' } });
    
    await waitFor(() => {
      expect(extractButton).not.toBeDisabled();
    });

    // Try to extract URLs
    fireEvent.click(extractButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('ERROR, PLEASE TRY AGAIN')).toBeInTheDocument();
    });

    // Should have retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('handles empty content appropriately', async () => {
    render(<Home />);

    const extractButton = screen.getByRole('button', { name: /get url/i });
    
    // Button should be disabled with no content
    expect(extractButton).toBeDisabled();

    // Add and then remove content
    const contentArea = screen.getByPlaceholderText(/paste your hyperlinked content/i);
    fireEvent.input(contentArea, { target: { textContent: 'Some content' } });
    
    await waitFor(() => {
      expect(extractButton).not.toBeDisabled();
    });

    fireEvent.input(contentArea, { target: { textContent: '' } });
    
    await waitFor(() => {
      expect(extractButton).toBeDisabled();
    });
  });

  it('handles content with no URLs', async () => {
    render(<Home />);

    const contentArea = screen.getByPlaceholderText(/paste your hyperlinked content/i);
    const extractButton = screen.getByRole('button', { name: /get url/i });

    // Add content without URLs
    fireEvent.input(contentArea, { target: { textContent: 'This is just plain text with no links' } });
    
    await waitFor(() => {
      expect(extractButton).not.toBeDisabled();
    });

    fireEvent.click(extractButton);

    // Should show "no URLs found" message
    await waitFor(() => {
      expect(screen.getByText('No URLs found in the provided content')).toBeInTheDocument();
    });
  });

  it('preserves URL order and indexing', async () => {
    render(<Home />);

    const contentArea = screen.getByPlaceholderText(/paste your hyperlinked content/i);
    const htmlContent = `
      <a href="https://first.com">First</a>
      <a href="https://second.com">Second</a>
      <a href="https://third.com">Third</a>
    `;
    
    fireEvent.paste(contentArea, {
      clipboardData: {
        getData: (type: string) => {
          if (type === 'text/html') return htmlContent;
          return '';
        }
      }
    });

    const extractButton = screen.getByRole('button', { name: /get url/i });
    fireEvent.click(extractButton);

    await waitFor(() => {
      expect(screen.getByText('Extracted URLs (3)')).toBeInTheDocument();
    });

    // Check that URLs maintain their order
    const urlElements = screen.getAllByText(/#\d+/);
    expect(urlElements[0]).toHaveTextContent('#1');
    expect(urlElements[1]).toHaveTextContent('#2');
    expect(urlElements[2]).toHaveTextContent('#3');
  });

  it('handles duplicate URLs correctly', async () => {
    render(<Home />);

    const contentArea = screen.getByPlaceholderText(/paste your hyperlinked content/i);
    const htmlContent = `
      <a href="https://example.com">First Link</a>
      <a href="https://example.com">Second Link</a>
      <a href="https://different.com">Different Link</a>
    `;
    
    fireEvent.paste(contentArea, {
      clipboardData: {
        getData: (type: string) => {
          if (type === 'text/html') return htmlContent;
          return '';
        }
      }
    });

    const extractButton = screen.getByRole('button', { name: /get url/i });
    fireEvent.click(extractButton);

    await waitFor(() => {
      // Should deduplicate URLs but keep the better display text
      expect(screen.getByText('Extracted URLs (2)')).toBeInTheDocument();
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
      expect(screen.getByText('https://different.com')).toBeInTheDocument();
    });
  });
});