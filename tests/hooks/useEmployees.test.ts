import { renderHook, waitFor } from '@testing-library/react'
import { useEmployees } from '@/lib/useEmployees'
import { Employee } from '@/data/employees/employees'
import { getAllEmployees } from '@/data/employees/employees'

jest.mock('@/data/employees/employees', () => ({
  getAllEmployees: jest.fn(),
}))

const mockGetAllEmployees = getAllEmployees as jest.MockedFunction<typeof getAllEmployees>

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

describe('useEmployees', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Data Loading', () => {
    it('loads employees on mount', async () => {
      mockGetAllEmployees.mockResolvedValue(mockEmployees)

      const { result } = renderHook(() => useEmployees())

      expect(result.current.loading).toBe(true)
      expect(result.current.employees).toEqual([])

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.employees).toEqual(mockEmployees)
      expect(result.current.error).toBe(null)
      expect(mockGetAllEmployees).toHaveBeenCalledTimes(1)
    })

    it('handles loading errors', async () => {
      const error = new Error('Database error')
      mockGetAllEmployees.mockRejectedValue(error)

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const { result } = renderHook(() => useEmployees())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Failed to load employees from the database.')
      expect(result.current.employees).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load employees:', error)

      consoleSpy.mockRestore()
    })
  })

  describe('Employee Lookup', () => {
    it('provides getEmployeeById function', async () => {
      mockGetAllEmployees.mockResolvedValue(mockEmployees)

      const { result } = renderHook(() => useEmployees())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const employee = result.current.getEmployeeById('emp1')
      expect(employee).toEqual(mockEmployees[0])
    })

    it('returns undefined for getEmployeeById when employees not loaded', () => {
      mockGetAllEmployees.mockResolvedValue([])

      const { result } = renderHook(() => useEmployees())

      const employee = result.current.getEmployeeById('emp1')
      expect(employee).toBeUndefined()
    })
  })
})