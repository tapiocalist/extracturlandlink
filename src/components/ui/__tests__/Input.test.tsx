import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('w-full', 'px-4', 'py-3', 'border', 'rounded-apple');
  });

  it('renders with label', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('shows error state and message', () => {
    render(<Input error="This field is required" placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveClass('border-red-500');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text when no error', () => {
    render(<Input helperText="This is helpful information" placeholder="Enter text" />);
    
    expect(screen.getByText('This is helpful information')).toBeInTheDocument();
  });

  it('prioritizes error message over helper text', () => {
    render(
      <Input 
        error="Error message" 
        helperText="Helper text" 
        placeholder="Enter text" 
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('handles input changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test value');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" placeholder="Enter password" />);
    expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'password');

    rerender(<Input type="tel" placeholder="Enter phone" />);
    expect(screen.getByPlaceholderText('Enter phone')).toHaveAttribute('type', 'tel');
  });

  it('generates unique IDs for accessibility', () => {
    render(
      <div>
        <Input label="First Input" />
        <Input label="Second Input" />
      </div>
    );
    
    const firstInput = screen.getByLabelText('First Input');
    const secondInput = screen.getByLabelText('Second Input');
    
    expect(firstInput.id).toBeTruthy();
    expect(secondInput.id).toBeTruthy();
    expect(firstInput.id).not.toBe(secondInput.id);
  });

  it('uses provided ID when given', () => {
    render(<Input id="custom-id" label="Custom Input" />);
    
    const input = screen.getByLabelText('Custom Input');
    expect(input.id).toBe('custom-id');
  });

  it('has proper focus styles', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-apple-yellow');
  });

  it('has minimum height for touch targets', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveClass('min-h-[44px]');
  });

  it('has touch manipulation optimization', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveClass('touch-manipulation');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Enter text" />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.placeholder).toBe('Enter text');
  });
});