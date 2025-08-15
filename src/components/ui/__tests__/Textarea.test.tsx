import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from '../Textarea';

describe('Textarea', () => {
  it('renders with default props', () => {
    render(<Textarea placeholder="Enter text" />);
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('w-full', 'px-4', 'py-3', 'border', 'rounded-apple');
  });

  it('renders with label', () => {
    render(<Textarea label="Description" placeholder="Enter description" />);
    
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('shows error state and message', () => {
    render(<Textarea error="This field is required" placeholder="Enter text" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveClass('border-red-500');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text when no error', () => {
    render(<Textarea helperText="This is helpful information" placeholder="Enter text" />);
    
    expect(screen.getByText('This is helpful information')).toBeInTheDocument();
  });

  it('prioritizes error message over helper text', () => {
    render(
      <Textarea 
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
    render(<Textarea onChange={handleChange} placeholder="Enter text" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    fireEvent.change(textarea, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue('test value');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled placeholder="Enter text" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('supports different resize options', () => {
    const { rerender } = render(<Textarea resize="none" placeholder="No resize" />);
    expect(screen.getByPlaceholderText('No resize')).toHaveClass('resize-none');

    rerender(<Textarea resize="horizontal" placeholder="Horizontal resize" />);
    expect(screen.getByPlaceholderText('Horizontal resize')).toHaveClass('resize-x');

    rerender(<Textarea resize="both" placeholder="Both resize" />);
    expect(screen.getByPlaceholderText('Both resize')).toHaveClass('resize');
  });

  it('has default vertical resize', () => {
    render(<Textarea placeholder="Default resize" />);
    expect(screen.getByPlaceholderText('Default resize')).toHaveClass('resize-y');
  });

  it('supports custom rows', () => {
    render(<Textarea rows={10} placeholder="Tall textarea" />);
    const textarea = screen.getByPlaceholderText('Tall textarea');
    expect(textarea).toHaveAttribute('rows', '10');
  });

  it('has minimum height', () => {
    render(<Textarea placeholder="Enter text" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveClass('min-h-[120px]');
  });

  it('generates unique IDs for accessibility', () => {
    render(
      <div>
        <Textarea label="First Textarea" />
        <Textarea label="Second Textarea" />
      </div>
    );
    
    const firstTextarea = screen.getByLabelText('First Textarea');
    const secondTextarea = screen.getByLabelText('Second Textarea');
    
    expect(firstTextarea.id).toBeTruthy();
    expect(secondTextarea.id).toBeTruthy();
    expect(firstTextarea.id).not.toBe(secondTextarea.id);
  });

  it('uses provided ID when given', () => {
    render(<Textarea id="custom-id" label="Custom Textarea" />);
    
    const textarea = screen.getByLabelText('Custom Textarea');
    expect(textarea.id).toBe('custom-id');
  });

  it('has proper focus styles', () => {
    render(<Textarea placeholder="Enter text" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-apple-yellow');
  });

  it('has touch manipulation optimization', () => {
    render(<Textarea placeholder="Enter text" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveClass('touch-manipulation');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} placeholder="Enter text" />);
    
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.placeholder).toBe('Enter text');
  });

  it('supports maxLength attribute', () => {
    render(<Textarea maxLength={100} placeholder="Limited text" />);
    const textarea = screen.getByPlaceholderText('Limited text');
    expect(textarea).toHaveAttribute('maxLength', '100');
  });

  it('supports required attribute', () => {
    render(<Textarea required placeholder="Required text" />);
    const textarea = screen.getByPlaceholderText('Required text');
    expect(textarea).toHaveAttribute('required');
  });
});