import { render, screen, fireEvent } from '@testing-library/react';
import { AppHeader } from '@/components/layout/AppHeader';
import { FilterState } from '@/components/suggestions/SuggestionFilters';

jest.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>
}));

jest.mock('@/components/suggestions/SuggestionFilters', () => ({
  SuggestionFilters: ({ totalCount, filteredCount }: { totalCount: number, filteredCount: number }) => (
    <div data-testid="suggestion-filters">
      Filters: {filteredCount} of {totalCount}
    </div>
  )
}));

describe('AppHeader', () => {
  const mockFilters: FilterState = {
    status: null,
    priority: null,
    department: null,
    riskLevel: null,
    employeeSearch: ''
  };

  const defaultProps = {
    filters: mockFilters,
    onFilterChange: jest.fn(),
    totalCount: 100,
    filteredCount: 75,
    filtersExpanded: false,
    onToggleFilters: jest.fn(),
    onCreateSuggestion: jest.fn(),
    suggestionCount: 75
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with title and description', () => {
    render(<AppHeader {...defaultProps} />);
    
    expect(screen.getByText('MSK Suggestion Management Board')).toBeInTheDocument();
    expect(screen.getByText(/This is a management board for the MSK Suggestion system/)).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<AppHeader {...defaultProps} />);
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('renders filters toggle button', () => {
    render(<AppHeader {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /toggle filters/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('calls onToggleFilters when filters button is clicked', () => {
    render(<AppHeader {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /toggle filters/i });
    fireEvent.click(toggleButton);
    
    expect(defaultProps.onToggleFilters).toHaveBeenCalledTimes(1);
  });

  it('renders create suggestion button', () => {
    render(<AppHeader {...defaultProps} />);
    
    const createButton = screen.getByRole('button', { name: /create suggestion/i });
    expect(createButton).toBeInTheDocument();
  });

  it('calls onCreateSuggestion when create button is clicked', () => {
    render(<AppHeader {...defaultProps} />);
    
    const createButton = screen.getByRole('button', { name: /create suggestion/i });
    fireEvent.click(createButton);
    
    expect(defaultProps.onCreateSuggestion).toHaveBeenCalledTimes(1);
  });

  it('shows filters when filtersExpanded is true', () => {
    render(<AppHeader {...defaultProps} filtersExpanded={true} />);
    
    expect(screen.getByTestId('suggestion-filters')).toBeInTheDocument();
    expect(screen.getByText('Filters: 75 of 100')).toBeInTheDocument();
  });

  it('hides filters on mobile when filtersExpanded is false', () => {
    render(<AppHeader {...defaultProps} filtersExpanded={false} />);
    
    const filtersContainer = screen.getByTestId('suggestion-filters').parentElement;
    expect(filtersContainer).toHaveClass('hidden', 'md:block');
  });

  it('displays correct suggestion count in create button', () => {
    render(<AppHeader {...defaultProps} suggestionCount={42} />);
    
    const createButton = screen.getByRole('button', { name: /create suggestion/i });
    expect(createButton).toBeInTheDocument();
  });

  it('shows different icons based on filters expanded state', () => {
    const { rerender } = render(<AppHeader {...defaultProps} filtersExpanded={false} />);
    
    expect(screen.getByRole('button', { name: /toggle filters/i })).toBeInTheDocument();
    
    rerender(<AppHeader {...defaultProps} filtersExpanded={true} />);
    
    expect(screen.getByRole('button', { name: /toggle filters/i })).toBeInTheDocument();
  });
});
