import { render, screen } from '@testing-library/react';
import { LoadingState } from '@/components/states/LoadingState';

describe('LoadingState', () => {
  it('renders loading spinner and message', () => {
    render(<LoadingState />);
    
    expect(screen.getByText('Loading suggestions...')).toBeInTheDocument();
    expect(screen.getByText('MSK Suggestion Management Board')).toBeInTheDocument();
  });

  it('renders custom message when provided', () => {
    render(<LoadingState message="Loading data..." />);
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('shows loading spinner', () => {
    render(<LoadingState />);
    
    const spinner = screen.getByText('Loading suggestions...').previousElementSibling;
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-blue-600');
  });

  it('applies correct layout structure', () => {
    render(<LoadingState />);
    
    const mainContainer = screen.getByText('Loading suggestions...').closest('main');
    expect(mainContainer).toHaveClass('px-4', 'py-3', 'sm:p-20', 'sm:pt-6');
    
    const centerContainer = screen.getByText('Loading suggestions...').closest('div');
    expect(centerContainer).toHaveClass('text-center');
  });
});
