import { renderHook, act } from '@testing-library/react'
import { useFilteredSuggestions } from '@/lib/useFilteredSuggestions'
import { Suggestion } from '@/data/suggestions/suggestions'
import { Employee } from '@/data/employees/employees'

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    employeeId: 'emp1',
    title: 'Equipment Suggestion',
    type: 'equipment',
    description: 'Need better chair',
    status: 'pending',
    priority: 'high',
    source: 'admin',
    dateCreated: '2024-01-01T00:00:00.000Z',
    dateUpdated: '2024-01-01T00:00:00.000Z',
    notes: 'Urgent',
  },
  {
    id: '2',
    employeeId: 'emp2',
    title: 'Exercise Suggestion',
    type: 'exercise',
    description: 'Stretching routine',
    status: 'completed',
    priority: 'medium',
    source: 'admin',
    dateCreated: '2024-01-02T00:00:00.000Z',
    dateUpdated: '2024-01-02T00:00:00.000Z',
    notes: 'Done',
  }
]

const mockEmployees: Employee[] = [
  {
    id: 'emp1',
    name: 'John Doe',
    department: 'Engineering',
    riskLevel: 'high',
  },
  {
    id: 'emp2',
    name: 'Jane Smith',
    department: 'Finance',
    riskLevel: 'medium',
  }
]

const mockGetEmployeeById = jest.fn((id: string) => 
  mockEmployees.find(emp => emp.id === id)
)

describe('useFilteredSuggestions', () => {
  beforeEach(() => {
    mockGetEmployeeById.mockClear()
  })

  describe('Basic Filtering', () => {
    it('returns all suggestions when no filters applied', () => {
      const { result } = renderHook(() => 
        useFilteredSuggestions(mockSuggestions, mockGetEmployeeById)
      )

      expect(result.current.filteredSuggestions).toHaveLength(2)
      expect(result.current.totalCount).toBe(2)
      expect(result.current.filteredCount).toBe(2)
    })

    it('returns empty array when no matches', () => {
      const { result } = renderHook(() => 
        useFilteredSuggestions(mockSuggestions, mockGetEmployeeById)
      )

      act(() => {
        result.current.setFilters({
          status: 'overdue',
          priority: null,
          department: null,
          riskLevel: null,
          employeeSearch: ''
        })
      })

      expect(result.current.filteredSuggestions).toHaveLength(0)
      expect(result.current.filteredCount).toBe(0)
    })
  })

  describe('Individual Filters', () => {
    it('filters by status', () => {
      const { result } = renderHook(() => 
        useFilteredSuggestions(mockSuggestions, mockGetEmployeeById)
      )

      act(() => {
        result.current.setFilters({
          status: 'pending',
          priority: null,
          department: null,
          riskLevel: null,
          employeeSearch: ''
        })
      })

      expect(result.current.filteredSuggestions).toHaveLength(1)
      expect(result.current.filteredSuggestions[0].status).toBe('pending')
    })

    it('filters by priority', () => {
      const { result } = renderHook(() => 
        useFilteredSuggestions(mockSuggestions, mockGetEmployeeById)
      )

      act(() => {
        result.current.setFilters({
          status: null,
          priority: 'high',
          department: null,
          riskLevel: null,
          employeeSearch: ''
        })
      })

      expect(result.current.filteredSuggestions).toHaveLength(1)
      expect(result.current.filteredSuggestions[0].priority).toBe('high')
    })

    it('filters by employee name search', () => {
      const { result } = renderHook(() => 
        useFilteredSuggestions(mockSuggestions, mockGetEmployeeById)
      )

      act(() => {
        result.current.setFilters({
          status: null,
          priority: null,
          department: null,
          riskLevel: null,
          employeeSearch: 'John'
        })
      })

      expect(result.current.filteredSuggestions).toHaveLength(1)
      expect(result.current.filteredSuggestions[0].employeeId).toBe('emp1')
    })

    it('filters by department', () => {
      const { result } = renderHook(() => 
        useFilteredSuggestions(mockSuggestions, mockGetEmployeeById)
      )

      act(() => {
        result.current.setFilters({
          status: null,
          priority: null,
          department: 'Engineering',
          riskLevel: null,
          employeeSearch: ''
        })
      })

      expect(result.current.filteredSuggestions).toHaveLength(1)
      expect(mockGetEmployeeById).toHaveBeenCalledWith('emp1')
    })

    it('filters by risk level', () => {
      const { result } = renderHook(() => 
        useFilteredSuggestions(mockSuggestions, mockGetEmployeeById)
      )

      act(() => {
        result.current.setFilters({
          status: null,
          priority: null,
          department: null,
          riskLevel: 'high',
          employeeSearch: ''
        })
      })

      expect(result.current.filteredSuggestions).toHaveLength(1)
      expect(mockGetEmployeeById).toHaveBeenCalledWith('emp1')
    })

    it('handles open status filter correctly', () => {
      const { result } = renderHook(() => 
        useFilteredSuggestions(mockSuggestions, mockGetEmployeeById)
      )

      act(() => {
        result.current.setFilters({
          status: 'open',
          priority: null,
          department: null,
          riskLevel: null,
          employeeSearch: ''
        })
      })

      expect(result.current.filteredSuggestions).toHaveLength(1)
      expect(result.current.filteredSuggestions[0].status).toBe('pending')
    })
  })

  describe('Combined Filters', () => {
    it('combines multiple filters correctly', () => {
      const { result } = renderHook(() => 
        useFilteredSuggestions(mockSuggestions, mockGetEmployeeById)
      )

      act(() => {
        result.current.setFilters({
          status: 'pending',
          priority: 'high',
          department: null,
          riskLevel: null,
          employeeSearch: ''
        })
      })

      expect(result.current.filteredSuggestions).toHaveLength(1)
      expect(result.current.filteredSuggestions[0].id).toBe('1')
    })
  })
})