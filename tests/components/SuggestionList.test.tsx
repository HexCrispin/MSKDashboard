import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SuggestionList } from '@/components/suggestions/SuggestionList'
import { Suggestion } from '@/data/suggestions/suggestions'
import { Employee } from '@/data/employees/employees'

jest.mock('@/components/suggestions/SuggestionCard', () => ({
  SuggestionCard: ({ suggestion }: { suggestion: Suggestion }) => (
    <div data-testid={`suggestion-${suggestion.id}`}>
      {suggestion.title}
    </div>
  )
}))

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    employeeId: 'emp1',
    title: 'First Suggestion',
    type: 'equipment',
    description: 'First description',
    status: 'pending',
    priority: 'medium',
    source: 'admin',
    dateCreated: '2024-01-01T00:00:00.000Z',
    dateUpdated: '2024-01-01T00:00:00.000Z',
    notes: 'First notes',
  },
  {
    id: '2',
    employeeId: 'emp2',
    title: 'Second Suggestion',
    type: 'exercise',
    description: 'Second description',
    status: 'in_progress',
    priority: 'high',
    source: 'admin',
    dateCreated: '2024-01-02T00:00:00.000Z',
    dateUpdated: '2024-01-02T00:00:00.000Z',
    notes: 'Second notes',
  }
]

const mockEmployee: Employee = {
  id: 'emp1',
  name: 'John Doe',
  department: 'Engineering',
  riskLevel: 'medium',
}

const mockGetEmployeeById = jest.fn(() => mockEmployee)
const mockOnEdit = jest.fn()

describe('SuggestionList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('List Rendering', () => {
    it('renders all suggestions', () => {
      render(
        <SuggestionList 
          suggestions={mockSuggestions}
          onEdit={mockOnEdit}
          getEmployeeById={mockGetEmployeeById}
        />
      )

      expect(screen.getByTestId('suggestion-1')).toBeInTheDocument()
      expect(screen.getByTestId('suggestion-2')).toBeInTheDocument()
      expect(screen.getByText('First Suggestion')).toBeInTheDocument()
      expect(screen.getByText('Second Suggestion')).toBeInTheDocument()
    })

    it('renders empty list when no suggestions', () => {
      render(
        <SuggestionList 
          suggestions={[]}
          onEdit={mockOnEdit}
          getEmployeeById={mockGetEmployeeById}
        />
      )

      expect(screen.queryByTestId(/suggestion-/)).not.toBeInTheDocument()
    })

    it('handles missing optional props gracefully', () => {
      render(
        <SuggestionList 
          suggestions={mockSuggestions}
        />
      )

      expect(screen.getByTestId('suggestion-1')).toBeInTheDocument()
      expect(screen.getByTestId('suggestion-2')).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('uses CSS Grid layout with correct configuration', () => {
      const { container } = render(
        <SuggestionList 
          suggestions={mockSuggestions}
          onEdit={mockOnEdit}
          getEmployeeById={mockGetEmployeeById}
        />
      )

      const gridContainer = container.firstChild as HTMLElement
      expect(gridContainer).toHaveClass('grid', 'gap-4')
      expect(gridContainer).toHaveStyle({
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))'
      })
    })
  })
})