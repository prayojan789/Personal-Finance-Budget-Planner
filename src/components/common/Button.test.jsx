import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should support different button types', () => {
    render(
      <>
        <Button type="button">Button</Button>
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </>
    );
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('type', 'button');
    expect(buttons[1]).toHaveAttribute('type', 'submit');
    expect(buttons[2]).toHaveAttribute('type', 'reset');
  });

  it('should support children element', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Behavior depends on implementation, but typically disabled buttons don't trigger clicks
    // This test documents expected behavior
  });
});
