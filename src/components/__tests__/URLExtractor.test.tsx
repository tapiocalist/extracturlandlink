import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { URLExtractor } from '../URLExtractor';
import { ExtractedURL } from '@/lib/types';

// Mock the URL parser
vi.mock('@/lib/url-parser', () => ({
  parseHyperlinkedContent: vi.fn()
}));

import { parseHyperlinkedContent } from '@/lib/url-parser';
const mockParseHyperlinkedContent = parseHyperlinkedContent as ReturnType<typeof vi.fn>;

describe('URLExtractor', () => {
  const mockOnURLsExtracted = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with initial state', () => {
    render(<URLExtractor onURLsExtracted={mockOnURLsExtracted} />);
    
    expect(screen.getByText('Paste Your Content')).toBeInTheDocument();
    expect(screen.getByText('Content with Hyperlinks')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get url/i })).toBeInTheDocument();
  });

  it('disables the button when no content is provided', () => {
    render(<URLExtractor onURLsExtracted={mockOnURLsExtracted} />);
    
    const button = screen.getByRole('button', { name: /get url/i });
    expect(button).toBeDisabled();
  });

  it('enables the button when content is provided', () => {
    render(<URLExtractor onURLsExtracted={mockOnURLsExtracted} />);
    
    const contentArea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /get url/i });
    
    // Simulate input in contentEditable
    fireEvent.input(contentArea, { target: { textContent: 'Some content with links' } });
    
    expect(button).not.toBeDisabled();
  });

  it('shows loading state when extracting URLs', async () => {
    mockParseHyperlinkedContent.mockResolvedValue({
      originalHtml: '<p>Test content</p>',
      extractedUrls: []
    });

    render(<URLExtractor onURLsExtracted={mockOnURLsExtracted} />);
    
    const contentArea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /get url/i });
    
    fireEvent.input(contentArea, { target: { textContent: 'Some content' } });
    fireEvent.click(button);
    
    expect(screen.getByText('Extracting URLs...')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('displays extracted URLs when found', async () => {
    const mockUrls: ExtractedURL[] = [
      {
        id: '1',
        url: 'https://example.com',
        displayText: 'Example',
        isValid: true,
        originalIndex: 0
      }
    ];

    mockParseHyperlinkedContent.mockResolvedValue({
      originalHtml: '<p><a href="https://example.com">Example</a></p>',
      extractedUrls: mockUrls
    });

    render(<URLExtractor onURLsExtracted={mockOnURLsExtracted} />);
    
    const contentArea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /get url/i });
    
    fireEvent.input(contentArea, { target: { textContent: 'Example' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Extracted URLs (1)')).toBeInTheDocument();
      expect(screen.getByText('Example')).toBeInTheDocument();
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });

    expect(mockOnURLsExtracted).toHaveBeenCalledWith(mockUrls);
  });

  it('shows error message when no URLs are found', async () => {
    mockParseHyperlinkedContent.mockResolvedValue({
      originalHtml: '<p>No links here</p>',
      extractedUrls: []
    });

    render(<URLExtractor onURLsExtracted={mockOnURLsExtracted} />);
    
    const contentArea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /get url/i });
    
    fireEvent.input(contentArea, { target: { textContent: 'No links here' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('No URLs found in the provided content')).toBeInTheDocument();
    });
  });

  it('shows error message when extraction fails', async () => {
    mockParseHyperlinkedContent.mockRejectedValue(new Error('Parsing failed'));

    render(<URLExtractor onURLsExtracted={mockOnURLsExtracted} />);
    
    const contentArea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /get url/i });
    
    fireEvent.input(contentArea, { target: { textContent: 'Some content' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('ERROR, PLEASE TRY AGAIN')).toBeInTheDocument();
    });
  });

  it('clears previous results when content changes', () => {
    const mockUrls: ExtractedURL[] = [
      {
        id: '1',
        url: 'https://example.com',
        displayText: 'Example',
        isValid: true,
        originalIndex: 0
      }
    ];

    mockParseHyperlinkedContent.mockResolvedValue({
      originalHtml: '<p><a href="https://example.com">Example</a></p>',
      extractedUrls: mockUrls
    });

    render(<URLExtractor onURLsExtracted={mockOnURLsExtracted} />);
    
    const contentArea = screen.getByRole('textbox');
    
    // First, add some content
    fireEvent.input(contentArea, { target: { textContent: 'Example' } });
    
    // Then change the content
    fireEvent.input(contentArea, { target: { textContent: 'New content' } });
    
    // Previous results should be cleared
    expect(screen.queryByText('Extracted URLs')).not.toBeInTheDocument();
  });
});