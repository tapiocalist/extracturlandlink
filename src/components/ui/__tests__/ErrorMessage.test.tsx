import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from '../ErrorMessage';
import { ErrorType } from '@/lib/types';

describe('ErrorMessage', () => {
  it('renders error message with default type', () => {
    render(<ErrorMessage message="Something went wrong" />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders with different error types', () => {
    const { rerender } = render(
      <ErrorMessage message="Parsing error" type={ErrorType.PARSING_ERROR} />
    );
    expect(screen.getByText('Parsing error')).toBeInTheDocument();

    rerender(<ErrorMessage message="Network error" type={ErrorType.NETWORK_ERROR} />);
    expect(screen.getByText('Network error')).toBeInTheDocument();

    rerender(<ErrorMessage message="Validation error" type={ErrorType.VALIDATION_ERROR} />);
    expect(screen.getByText('Validation error')).toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    const handleRetry = vi.fn();
    render(
      <ErrorMessage 
        message="Something went wrong" 
        onRetry={handleRetry}
      />
    );
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('shows dismiss button when onDismiss is provided', () => {
    const handleDismiss = vi.fn();
    render(
      <ErrorMessage 
        message="Something went wrong" 
        onDismiss={handleDismiss}
      />
    );
    
    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    expect(dismissButton).toBeInTheDocument();
    
    fireEvent.click(dismissButton);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('shows both retry and dismiss buttons when both handlers are provided', () => {
    const handleRetry = vi.fn();
    const handleDismiss = vi.fn();
    render(
      <ErrorMessage 
        message="Something went wrong" 
        onRetry={handleRetry}
        onDismiss={handleDismiss}
      />
    );
    
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ErrorMessage message="Error message" />);
    
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toHaveClass('bg-red-50', 'border-red-200', 'rounded-apple');
    
    const errorText = screen.getByText('Error message');
    expect(errorText).toHaveClass('text-sm', 'font-medium');
  });

  it('has proper accessibility attributes', () => {
    render(<ErrorMessage message="Error message" />);
    
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveAttribute('role', 'alert');
  });

  it('displays error icon', () => {
    render(<ErrorMessage message="Error message" />);
    
    // Check for SVG icon
    const container = screen.getByRole('alert');
    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  it('handles long error messages', () => {
    const longMessage = 'This is a very long error message that should wrap properly and maintain good readability even when it spans multiple lines in the error display component.';
    
    render(<ErrorMessage message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('prevents XSS attacks by escaping HTML', () => {
    const maliciousMessage = '<script>alert("xss")</script>Malicious content';
    
    render(<ErrorMessage message={maliciousMessage} />);
    
    // The script tag should be rendered as text, not executed
    expect(screen.getByText(maliciousMessage)).toBeInTheDocument();
    expect(document.querySelector('script')).toBeNull();
  });

  it('supports custom className', () => {
    render(<ErrorMessage message="Error" className="custom-error-class" />);
    
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toHaveClass('custom-error-class');
  });

  it('maintains focus management for accessibility', () => {
    const handleRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={handleRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    retryButton.focus();
    
    expect(document.activeElement).toBe(retryButton);
  });
});