import { renderHook, waitFor, act } from '@testing-library/react'
import { useSuggestions } from '@/lib/useSuggestions'
import { Suggestion } from '@/data/suggestions/suggestions'
import { getSuggestions, mskService } from '@/data/suggestions/suggestions'
import { dbEvents } from '@/lib/indexedDB'

jest.mock('@/lib/indexedDB', () => ({
  dbEvents: {
    subscribe: jest.fn(() => jest.fn()),
  },
}))

jest.mock('@/data/suggestions/suggestions', () => ({
  getSuggestions: jest.fn(),
  mskService: {
    markOverdueSuggestions: jest.fn(),
  },
}))

const mockedGetSuggestions = jest.mocked(getSuggestions)
const mockedMskService = jest.mocked(mskService)

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    employeeId: 'emp1',
    title: 'Test Suggestion',
    type: 'equipment',
    description: 'Test description',
    status: 'pending',
    priority: 'medium',
    source: 'admin',
    dateCreated: '2024-01-01T00:00:00.000Z',
    dateUpdated: '2024-01-01T00:00:00.000Z',
    notes: 'Test notes',
  }
]

describe('useSuggestions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Data Loading', () => {
    it('loads suggestions on mount', async () => {
      mockedGetSuggestions.mockResolvedValue(mockSuggestions)
      mockedMskService.markOverdueSuggestions.mockResolvedValue(0)

      const { result } = renderHook(() => useSuggestions())

      expect(result.current.loading).toBe(true)
      expect(result.current.suggestions).toEqual([])

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.suggestions).toEqual(mockSuggestions)
      expect(result.current.error).toBe(null)
      expect(mockedMskService.markOverdueSuggestions).toHaveBeenCalled()
    })

    it('handles loading errors', async () => {
      const error = new Error('Database error')
      mockedGetSuggestions.mockRejectedValue(error)
      mockedMskService.markOverdueSuggestions.mockResolvedValue(0)

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const { result } = renderHook(() => useSuggestions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Failed to load suggestions from the database. This could be due to browser storage issues or corrupted data.')
      expect(result.current.suggestions).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load suggestions:', error)

      consoleSpy.mockRestore()
    })
  })

  describe('Event Handling', () => {
    it('subscribes to database events', () => {
      renderHook(() => useSuggestions())

      expect(dbEvents.subscribe).toHaveBeenCalled()
    })

    it('cleans up event subscription on unmount', () => {
      const mockUnsubscribe = jest.fn();
      (dbEvents.subscribe as jest.Mock).mockReturnValue(mockUnsubscribe)

      const { unmount } = renderHook(() => useSuggestions())

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })

  describe('Retry Functionality', () => {
    it('provides retry functionality', async () => {
      mockedGetSuggestions.mockResolvedValue(mockSuggestions)
      mockedMskService.markOverdueSuggestions.mockResolvedValue(0)

      const { result } = renderHook(() => useSuggestions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      mockedGetSuggestions.mockClear()
      mockedMskService.markOverdueSuggestions.mockClear()

      await act(async () => {
        await result.current.retry()
      })

      expect(mockedMskService.markOverdueSuggestions).toHaveBeenCalled()
      expect(mockedGetSuggestions).toHaveBeenCalled()
    })
  })
})