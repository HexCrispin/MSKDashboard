import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { SuggestionModal } from '@/components/suggestions/SuggestionModal'
import { Suggestion } from '@/data/suggestions/suggestions'
import { mskService } from '@/data/suggestions/suggestions'

jest.mock('@/data/suggestions/suggestions', () => ({
  mskService: {
    createSuggestion: jest.fn(),
    updateSuggestion: jest.fn(),
  },
}))

jest.mock('@/lib/useEmployees', () => ({
  useEmployees: () => ({
    employees: [
      { id: 'emp1', name: 'John Doe', department: 'Engineering', riskLevel: 'high' },
      { id: 'emp2', name: 'Jane Smith', department: 'Finance', riskLevel: 'medium' },
    ],
    loading: false,
  }),
}))

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
  dueDate: '2024-12-31T00:00:00.000Z',
}

const mockOnClose = jest.fn()

describe('SuggestionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders create modal when no suggestion provided', () => {
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )

      expect(screen.getByText('Create New Suggestion')).toBeInTheDocument()
      expect(screen.getByText('Create Suggestion')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Brief title for the suggestion...')).toBeInTheDocument()
    })

    it('renders edit modal when suggestion provided', () => {
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose}
          suggestion={mockSuggestion}
        />
      )

      expect(screen.getByText('Edit Suggestion')).toBeInTheDocument()
      expect(screen.getByText('Update Suggestion')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Suggestion')).toBeInTheDocument()
    })

    it('does not render when closed', () => {
      render(
        <SuggestionModal 
          isOpen={false} 
          onClose={mockOnClose} 
        />
      )

      expect(screen.queryByText('Create New Suggestion')).not.toBeInTheDocument()
    })

    it('pre-fills form when editing existing suggestion', () => {
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose}
          suggestion={mockSuggestion}
        />
      )

      expect(screen.getByDisplayValue('Test Suggestion')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test notes')).toBeInTheDocument()
    })
  })

  describe('Form Interactions', () => {
    it('calls onClose when cancel button clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )

      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('handles form submission for new suggestion', async () => {
      const user = userEvent.setup();
      (mskService.createSuggestion as jest.Mock).mockResolvedValue({})
      
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )

      // Fill out form
      await user.type(screen.getByPlaceholderText('Brief title for the suggestion...'), 'Test Title')
      await user.selectOptions(screen.getByDisplayValue('Select an employee...'), 'emp1')
      await user.selectOptions(screen.getByDisplayValue('Select type...'), 'equipment')
      await user.type(screen.getByPlaceholderText('Describe the suggestion...'), 'Test description')

      const submitButton = screen.getByText('Create Suggestion')
      await user.click(submitButton)

      expect(mskService.createSuggestion).toHaveBeenCalledWith({
        employeeId: 'emp1',
        title: 'Test Title',
        type: 'equipment',
        description: 'Test description',
        priority: 'medium',
        notes: '',
        status: 'pending',
        source: 'admin'
      })
    })

    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      
      let resolveCreate: (value: unknown) => void
      const createPromise = new Promise(resolve => {
        resolveCreate = resolve
      });
      (mskService.createSuggestion as jest.Mock).mockReturnValue(createPromise)
      
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )

      await user.type(screen.getByPlaceholderText('Brief title for the suggestion...'), 'Test Title')
      await user.selectOptions(screen.getByDisplayValue('Select an employee...'), 'emp1')
      await user.selectOptions(screen.getByDisplayValue('Select type...'), 'equipment')
      await user.type(screen.getByPlaceholderText('Describe the suggestion...'), 'Test description')

      const submitButton = screen.getByText('Create Suggestion')
      await user.click(submitButton)

      expect(screen.getByText('Creating...')).toBeInTheDocument()
      expect(submitButton).toHaveAttribute('disabled')

      resolveCreate!({})

      await waitFor(() => {
        expect(screen.queryByText('Creating...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Validation', () => {
    it('shows validation errors for all required fields when empty', async () => {
      const user = userEvent.setup()
      
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )
      
      const submitButton = screen.getByText('Create Suggestion')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please select an employee')).toBeInTheDocument()
        expect(screen.getByText('Please enter a title')).toBeInTheDocument()
        expect(screen.getByText('Please select a type')).toBeInTheDocument()
        expect(screen.getByText('Please enter a description')).toBeInTheDocument()
      })
      
      expect(mskService.createSuggestion).not.toHaveBeenCalled()
    })

    it('shows validation error for specific missing fields', async () => {
      const user = userEvent.setup()
      
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )
      
      await user.type(screen.getByPlaceholderText('Brief title for the suggestion...'), 'Test Title')
      await user.selectOptions(screen.getByDisplayValue('Select type...'), 'equipment')
      await user.type(screen.getByPlaceholderText('Describe the suggestion...'), 'Test description')
      
      const submitButton = screen.getByText('Create Suggestion')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please select an employee')).toBeInTheDocument()
        expect(screen.queryByText('Please enter a title')).not.toBeInTheDocument()
      })
    })

    it('adds red border styling to invalid fields', async () => {
      const user = userEvent.setup()
      
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )
      
      const submitButton = screen.getByText('Create Suggestion')
      await user.click(submitButton)
      
      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText('Brief title for the suggestion...')
        const employeeSelect = screen.getByDisplayValue('Select an employee...')
        const typeSelect = screen.getByDisplayValue('Select type...')
        const descriptionTextarea = screen.getByPlaceholderText('Describe the suggestion...')
        
        expect(titleInput).toHaveClass('border-red-500')
        expect(employeeSelect).toHaveClass('border-red-500')
        expect(typeSelect).toHaveClass('border-red-500')
        expect(descriptionTextarea).toHaveClass('border-red-500')
      })
    })

    it('clears validation errors when form is filled correctly', async () => {
      const user = userEvent.setup();
      (mskService.createSuggestion as jest.Mock).mockResolvedValue({})
      
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )
      
      const submitButton = screen.getByText('Create Suggestion')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please select an employee')).toBeInTheDocument()
      })
      
      await user.type(screen.getByPlaceholderText('Brief title for the suggestion...'), 'Test Title')
      await user.selectOptions(screen.getByDisplayValue('Select an employee...'), 'emp1')
      await user.selectOptions(screen.getByDisplayValue('Select type...'), 'equipment')
      await user.type(screen.getByPlaceholderText('Describe the suggestion...'), 'Test description')
      
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.queryByText('Please select an employee')).not.toBeInTheDocument()
      })
    })

    it('clears errors when modal reopens', async () => {
      const user = userEvent.setup()
      
      const { rerender } = render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )
      
      const submitButton = screen.getByText('Create Suggestion')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please select an employee')).toBeInTheDocument()
      })
      
      rerender(<SuggestionModal isOpen={false} onClose={mockOnClose} />)
      rerender(<SuggestionModal isOpen={true} onClose={mockOnClose} />)
      
      expect(screen.queryByText('Please select an employee')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('shows submit error when creation fails', async () => {
      const user = userEvent.setup()
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (mskService.createSuggestion as jest.Mock).mockRejectedValue(new Error('Server error'))
      
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )
      
      await user.type(screen.getByPlaceholderText('Brief title for the suggestion...'), 'Test Title')
      await user.selectOptions(screen.getByDisplayValue('Select an employee...'), 'emp1')
      await user.selectOptions(screen.getByDisplayValue('Select type...'), 'equipment')
      await user.type(screen.getByPlaceholderText('Describe the suggestion...'), 'Test description')
      
      const submitButton = screen.getByText('Create Suggestion')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Failed to create suggestion. Please try again.')).toBeInTheDocument()
      })
      
      consoleSpy.mockRestore()
    })

    it('shows different error message for edit mode', async () => {
      const user = userEvent.setup()
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (mskService.updateSuggestion as jest.Mock).mockRejectedValue(new Error('Server error'))
      
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose}
          suggestion={mockSuggestion}
        />
      )
      
      const submitButton = screen.getByText('Update Suggestion')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Failed to update suggestion. Please try again.')).toBeInTheDocument()
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('Keyboard Navigation', () => {
    it('closes modal when Escape key is pressed', async () => {
      const user = userEvent.setup()
      
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )

      await user.keyboard('{Escape}')
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('focuses first input when modal opens', async () => {
      render(
        <SuggestionModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      )

      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText('Brief title for the suggestion...')
        expect(titleInput).toHaveFocus()
      }, { timeout: 200 })
    })
  })
})