import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from '@/components/states/ErrorState';

describe('ErrorState', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message and retry button', () => {
    render(<ErrorState error="Test error" onRetry={mockOnRetry} isRetrying={false} />);
    
    expect(screen.getByText('Unable to Load Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByText('MSK Suggestion Management Board')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    render(<ErrorState error="Test error" onRetry={mockOnRetry} isRetrying={false} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when retrying', () => {
    render(<ErrorState error="Test error" onRetry={mockOnRetry} isRetrying={true} />);
    
    const retryButton = screen.getByRole('button', { name: /retrying/i });
    expect(retryButton).toBeDisabled();
    expect(screen.getByText('Retrying...')).toBeInTheDocument();
  });

  it('disables retry button when retrying', () => {
    render(<ErrorState error="Test error" onRetry={mockOnRetry} isRetrying={true} />);
    
    const retryButton = screen.getByRole('button', { name: /retrying/i });
    expect(retryButton).toBeDisabled();
  });

  it('applies correct error styling', () => {
    const { container } = render(<ErrorState error="Test error" onRetry={mockOnRetry} isRetrying={false} />);
    
    const errorContainer = container.querySelector('.bg-red-50');
    expect(errorContainer).toHaveClass('bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'p-6');
  });

  it('shows retry spinner when retrying', () => {
    render(<ErrorState error="Test error" onRetry={mockOnRetry} isRetrying={true} />);
    
    const retryButton = screen.getByRole('button', { name: /retrying/i });
    const spinner = retryButton.querySelector('div');
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'h-4', 'w-4', 'border-b-2', 'border-white');
  });
});
