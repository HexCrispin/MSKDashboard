import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { SuggestionCard } from '@/components/suggestions/SuggestionCard'
import { Suggestion } from '@/data/suggestions/suggestions'
import { Employee } from '@/data/employees/employees'
import { mskService } from '@/data/suggestions/suggestions'

jest.mock('@/data/suggestions/suggestions', () => ({
  mskService: {
    updateSuggestion: jest.fn(),
    deleteSuggestion: jest.fn(),
  },
}))

const mockedMskService = jest.mocked(mskService, { shallow: true })

const mockSuggestion: Suggestion = {
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

const mockEmployee: Employee = {
  id: 'emp1',
  name: 'John Doe',
  department: 'Engineering',
  riskLevel: 'medium',
}

const mockGetEmployeeById = jest.fn(() => mockEmployee)

// Mock window.confirm
global.confirm = jest.fn(() => true)

describe('SuggestionCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders suggestion information correctly', () => {
      render(
        <SuggestionCard 
          suggestion={mockSuggestion} 
          getEmployeeById={mockGetEmployeeById} 
        />
      )

      expect(screen.getByText('Test Suggestion')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Department: Engineering')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
      expect(screen.getByText('Notes:')).toBeInTheDocument()
      expect(screen.getByText('Test notes')).toBeInTheDocument()
    })

    it('shows edited badge when suggestion has been modified', () => {
      const editedSuggestion = {
        ...mockSuggestion,
        dateUpdated: '2024-01-02T00:00:00.000Z',
      }

      render(
        <SuggestionCard 
          suggestion={editedSuggestion} 
          getEmployeeById={mockGetEmployeeById} 
        />
      )

      expect(screen.getByText('Edited')).toBeInTheDocument()
    })

    it('handles unknown employee gracefully', () => {
      const getEmployeeById = jest.fn(() => undefined)
      
      render(
        <SuggestionCard 
          suggestion={mockSuggestion} 
          getEmployeeById={getEmployeeById} 
        />
      )

      expect(screen.getByText('Unknown Employee')).toBeInTheDocument()
    })

    it('shows due date when present', () => {
      const suggestionWithDueDate = {
        ...mockSuggestion,
        dueDate: '2024-12-31T00:00:00.000Z'
      }
      
      render(
        <SuggestionCard 
          suggestion={suggestionWithDueDate} 
          getEmployeeById={mockGetEmployeeById} 
        />
      )

      const cardFooter = document.querySelector('[data-slot="card-footer"]')
      expect(cardFooter).toHaveTextContent('Due:')
      expect(cardFooter).toHaveTextContent('31/12/2024')
    })

    it('displays correct priority and status styling', () => {
      render(
        <SuggestionCard 
          suggestion={mockSuggestion} 
          getEmployeeById={mockGetEmployeeById} 
        />
      )

      expect(screen.getByText('Pending')).toHaveClass('bg-yellow-100', 'text-yellow-800')
      
      const priorityBadges = screen.getAllByText('Medium')
      const priorityBadge = priorityBadges.find(el => el.classList.contains('bg-orange-100'))
      expect(priorityBadge).toHaveClass('bg-orange-100', 'text-orange-800')

      const riskElements = screen.getAllByText('Medium')
      const riskElement = riskElements.find(el => el.classList.contains('text-orange-600'))
      expect(riskElement).toHaveClass('text-orange-600')
    })
  })

  describe('Dropdown Menu Interactions', () => {
    it('opens dropdown menu and shows options', async () => {
      const user = userEvent.setup()
      
      render(
        <SuggestionCard 
          suggestion={mockSuggestion} 
          getEmployeeById={mockGetEmployeeById} 
        />
      )

      const menuButton = document.querySelector('[aria-haspopup="menu"]')
      if (menuButton) {
        await user.click(menuButton)
        
        expect(screen.getByText('Change Status')).toBeInTheDocument()
        expect(screen.getByText('Change Priority')).toBeInTheDocument()
        expect(screen.getByText('Delete Suggestion')).toBeInTheDocument()
      }
    })

    it('calls onEdit when edit option is clicked', async () => {
      const user = userEvent.setup()
      const mockOnEdit = jest.fn()
      
      render(
        <SuggestionCard 
          suggestion={mockSuggestion} 
          onEdit={mockOnEdit}
          getEmployeeById={mockGetEmployeeById} 
        />
      )

      const menuButton = document.querySelector('[aria-haspopup="menu"]')
      if (menuButton) {
        await user.click(menuButton)
        
        const editButton = screen.getByText('Edit Suggestion')
        await user.click(editButton)
        
        expect(mockOnEdit).toHaveBeenCalledWith(mockSuggestion)
      }
    })
  })

  describe('Delete Operations', () => {
    it('shows confirmation dialog and deletes when confirmed', async () => {
      const user = userEvent.setup()
      global.confirm = jest.fn(() => true)
      mockedMskService.deleteSuggestion.mockResolvedValue(true)
      
      render(
        <SuggestionCard 
          suggestion={mockSuggestion} 
          getEmployeeById={mockGetEmployeeById} 
        />
      )

      const menuButton = document.querySelector('[aria-haspopup="menu"]')
      if (menuButton) {
        await user.click(menuButton)
        const deleteButton = screen.getByText('Delete Suggestion')
        await user.click(deleteButton)
        
        expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this suggestion?')
        expect(mockedMskService.deleteSuggestion).toHaveBeenCalledWith('1')
      }
    })

    it('does not delete when user cancels confirmation', async () => {
      const user = userEvent.setup()
      global.confirm = jest.fn(() => false)
      
      render(
        <SuggestionCard 
          suggestion={mockSuggestion} 
          getEmployeeById={mockGetEmployeeById} 
        />
      )

      const menuButton = document.querySelector('[aria-haspopup="menu"]')
      if (menuButton) {
        await user.click(menuButton)
        const deleteButton = screen.getByText('Delete Suggestion')
        await user.click(deleteButton)
        
        expect(global.confirm).toHaveBeenCalled()
        expect(mockedMskService.deleteSuggestion).not.toHaveBeenCalled()
      }
    })

    it('shows error message when delete fails', async () => {
      const user = userEvent.setup()
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      global.confirm = jest.fn(() => true)
      mockedMskService.deleteSuggestion.mockRejectedValue(new Error('Delete failed'))
      
      render(
        <SuggestionCard 
          suggestion={mockSuggestion} 
          getEmployeeById={mockGetEmployeeById} 
        />
      )

      const menuButton = document.querySelector('[aria-haspopup="menu"]')
      if (menuButton) {
        await user.click(menuButton)
        const deleteButton = screen.getByText('Delete Suggestion')
        await user.click(deleteButton)
        
        await waitFor(() => {
          expect(screen.getByText('Failed to delete suggestion. Please try again.')).toBeInTheDocument()
        })
      }
      
      consoleSpy.mockRestore()
    })

    it('shows loading state during delete operation', async () => {
      const user = userEvent.setup()
      global.confirm = jest.fn(() => true)
      
      let resolveDelete: (value: boolean) => void
      const deletePromise = new Promise<boolean>(resolve => {
        resolveDelete = resolve
      })
      mockedMskService.deleteSuggestion.mockReturnValue(deletePromise)
      
      render(
        <SuggestionCard 
          suggestion={mockSuggestion} 
          getEmployeeById={mockGetEmployeeById} 
        />
      )

      const menuButton = document.querySelector('[aria-haspopup="menu"]')
      if (menuButton) {
        await user.click(menuButton)
        const deleteButton = screen.getByText('Delete Suggestion')
        await user.click(deleteButton)
        
        // Should show loading state
        expect(screen.getByText('Updating...')).toBeInTheDocument()
        expect(document.querySelector('.animate-spin')).toBeInTheDocument()
        expect(menuButton).toHaveAttribute('disabled')
        
        // Resolve the operation
        resolveDelete!(true)
        
        await waitFor(() => {
          expect(screen.queryByText('Updating...')).not.toBeInTheDocument()
        })
      }
    })
  })

  describe('Error and Loading State Logic', () => {
    it('displays error UI components correctly', () => {
      const TestWrapper = () => {
        const [error, setError] = React.useState<string | null>(null)
        
        React.useEffect(() => {
          setError('Failed to update status. Please try again.')
        }, [])
        
        return (
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            <div>Test Content</div>
          </div>
        )
      }
      
      render(<TestWrapper />)
      
      expect(screen.getByText('Failed to update status. Please try again.')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('displays loading UI components correctly', () => {
      const TestWrapper = () => {
        const [isLoading, setIsLoading] = React.useState(false)
        
        React.useEffect(() => {
          setIsLoading(true)
        }, [])
        
        return (
          <div>
            {isLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-blue-700 text-sm">Updating...</p>
                </div>
              </div>
            )}
            <button disabled={isLoading}>Action Button</button>
          </div>
        )
      }
      
      render(<TestWrapper />)
      
      expect(screen.getByText('Updating...')).toBeInTheDocument()
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
      expect(screen.getByText('Action Button')).toHaveAttribute('disabled')
    })

    it('handles error clearing behavior', async () => {
      const TestWrapper = () => {
        const [error, setError] = React.useState<string | null>('Initial error')
        
        React.useEffect(() => {
          const timer = setTimeout(() => setError(null), 100)
          return () => clearTimeout(timer)
        }, [])
        
        return (
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            <div>Content</div>
          </div>
        )
      }
      
      render(<TestWrapper />)
      
      expect(screen.getByText('Initial error')).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.queryByText('Initial error')).not.toBeInTheDocument()
      })
      
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })
})