import { renderHook, act } from '@testing-library/react';
import { useAppData } from '@/lib/useAppData';
import { useSuggestions } from '@/lib/useSuggestions';
import { useEmployees } from '@/lib/useEmployees';
import { useFilteredSuggestions } from '@/lib/useFilteredSuggestions';

jest.mock('@/lib/useSuggestions');
jest.mock('@/lib/useEmployees');
jest.mock('@/lib/useFilteredSuggestions');

const mockedUseSuggestions = jest.mocked(useSuggestions);
const mockedUseEmployees = jest.mocked(useEmployees);
const mockedUseFilteredSuggestions = jest.mocked(useFilteredSuggestions);

describe('useAppData', () => {
  const mockSuggestions = [
    {
      id: '1',
      employeeId: 'emp1',
      title: 'Test Suggestion',
      type: 'equipment' as const,
      description: 'Test description',
      status: 'pending' as const,
      priority: 'medium' as const,
      source: 'admin' as const,
      dateCreated: '2024-01-01T00:00:00.000Z',
      dateUpdated: '2024-01-01T00:00:00.000Z',
      notes: 'Test notes',
    }
  ];

  const mockEmployees = [
    {
      id: 'emp1',
      name: 'John Doe',
      department: 'Engineering' as const,
      riskLevel: 'high' as const
    }
  ];

  const mockFilters = {
    status: null,
    priority: null,
    department: null,
    riskLevel: null,
    employeeSearch: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockedUseSuggestions.mockReturnValue({
      suggestions: mockSuggestions,
      loading: false,
      error: null,
      retry: jest.fn()
    });

    mockedUseEmployees.mockReturnValue({
      employees: mockEmployees,
      loading: false,
      error: null,
      getEmployeeById: jest.fn((id: string) => mockEmployees.find(emp => emp.id === id)),
      retry: jest.fn()
    });

    mockedUseFilteredSuggestions.mockReturnValue({
      filteredSuggestions: mockSuggestions,
      filters: mockFilters,
      setFilters: jest.fn(),
      totalCount: mockSuggestions.length,
      filteredCount: mockSuggestions.length
    });
  });

  it('returns combined data from all hooks', () => {
    const { result } = renderHook(() => useAppData());

    expect(result.current.filteredSuggestions).toEqual(mockSuggestions);
    expect(result.current.filters).toEqual(mockFilters);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.filteredCount).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.setFilters).toBe('function');
    expect(typeof result.current.retry).toBe('function');
    expect(typeof result.current.getEmployeeById).toBe('function');
  });

  it('returns loading state when suggestions are loading', () => {
    mockedUseSuggestions.mockReturnValue({
      suggestions: [],
      loading: true,
      error: null,
      retry: jest.fn()
    });

    const { result } = renderHook(() => useAppData());

    expect(result.current.loading).toBe(true);
  });

  it('returns loading state when employees are loading', () => {
    mockedUseEmployees.mockReturnValue({
      employees: [],
      loading: true,
      error: null,
      getEmployeeById: jest.fn(),
      retry: jest.fn()
    });

    const { result } = renderHook(() => useAppData());

    expect(result.current.loading).toBe(true);
  });

  it('returns error from suggestions hook', () => {
    const mockError = 'Failed to load suggestions';
    mockedUseSuggestions.mockReturnValue({
      suggestions: [],
      loading: false,
      error: mockError,
      retry: jest.fn()
    });

    const { result } = renderHook(() => useAppData());

    expect(result.current.error).toBe(mockError);
  });

  it('returns error from employees hook', () => {
    const mockError = 'Failed to load employees';
    mockedUseEmployees.mockReturnValue({
      employees: [],
      loading: false,
      error: mockError,
      getEmployeeById: jest.fn(),
      retry: jest.fn()
    });

    const { result } = renderHook(() => useAppData());

    expect(result.current.error).toBe(mockError);
  });

  it('prioritizes suggestions error over employees error', () => {
    const suggestionsError = 'Suggestions error';
    const employeesError = 'Employees error';
    
    mockedUseSuggestions.mockReturnValue({
      suggestions: [],
      loading: false,
      error: suggestionsError,
      retry: jest.fn()
    });

    mockedUseEmployees.mockReturnValue({
      employees: [],
      loading: false,
      error: employeesError,
      getEmployeeById: jest.fn(),
      retry: jest.fn()
    });

    const { result } = renderHook(() => useAppData());

    expect(result.current.error).toBe(suggestionsError);
  });

  it('calls suggestions and employees retry when retry is called', () => {
    const mockSuggestionsRetry = jest.fn();
    const mockEmployeesRetry = jest.fn();
    
    mockedUseSuggestions.mockReturnValue({
      suggestions: mockSuggestions,
      loading: false,
      error: null,
      retry: mockSuggestionsRetry
    });

    mockedUseEmployees.mockReturnValue({
      employees: mockEmployees,
      loading: false,
      error: null,
      getEmployeeById: jest.fn(),
      retry: mockEmployeesRetry
    });

    const { result } = renderHook(() => useAppData());

    act(() => {
      result.current.retry();
    });

    expect(mockSuggestionsRetry).toHaveBeenCalledTimes(1);
    expect(mockEmployeesRetry).toHaveBeenCalledTimes(1);
  });

  it('forwards setFilters call to useFilteredSuggestions', () => {
    const mockSetFilters = jest.fn();
    mockedUseFilteredSuggestions.mockReturnValue({
      filteredSuggestions: mockSuggestions,
      filters: mockFilters,
      setFilters: mockSetFilters,
      totalCount: mockSuggestions.length,
      filteredCount: mockSuggestions.length
    });

    const { result } = renderHook(() => useAppData());

    const newFilters = { ...mockFilters, status: 'pending' as const };
    act(() => {
      result.current.setFilters(newFilters);
    });

    expect(mockSetFilters).toHaveBeenCalledWith(newFilters);
  });

  it('forwards getEmployeeById call to useEmployees', () => {
    const mockGetEmployeeById = jest.fn();
    mockedUseEmployees.mockReturnValue({
      employees: mockEmployees,
      loading: false,
      error: null,
      getEmployeeById: mockGetEmployeeById,
      retry: jest.fn()
    });

    const { result } = renderHook(() => useAppData());

    act(() => {
      result.current.getEmployeeById('emp1');
    });

    expect(mockGetEmployeeById).toHaveBeenCalledWith('emp1');
  });
});
