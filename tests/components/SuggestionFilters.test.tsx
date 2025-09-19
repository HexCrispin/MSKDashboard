import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SuggestionFilters, FilterState } from '@/components/suggestions/SuggestionFilters'

const mockFilters: FilterState = {
  status: null,
  priority: null,
  department: null,
  riskLevel: null,
  employeeSearch: '',
}

const mockOnFilterChange = jest.fn()

describe('SuggestionFilters', () => {
  beforeEach(() => {
    mockOnFilterChange.mockClear()
  })

  describe('Basic Rendering', () => {
    it('renders all filter controls', () => {
      render(
        <SuggestionFilters
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          totalCount={10}
          filteredCount={8}
        />
      )

      expect(screen.getByText('Filter by:')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Search employee...')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Priority')).toBeInTheDocument()
      expect(screen.getByText('Department')).toBeInTheDocument()
      expect(screen.getByText('Risk Level')).toBeInTheDocument()
    })

    it('displays suggestion count correctly', () => {
      render(
        <SuggestionFilters
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          totalCount={10}
          filteredCount={8}
        />
      )

      expect(screen.getByText('8 of 10 suggestions')).toBeInTheDocument()
    })

    it('shows total count when no filters applied', () => {
      render(
        <SuggestionFilters
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          totalCount={10}
          filteredCount={10}
        />
      )

      expect(screen.getByText('10 suggestions')).toBeInTheDocument()
    })
  })

  describe('Employee Search', () => {
    it('handles employee search input', () => {
      render(
        <SuggestionFilters
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          totalCount={10}
          filteredCount={8}
        />
      )

      const searchInput = screen.getByPlaceholderText('Search employee...')
      fireEvent.change(searchInput, { target: { value: 'John' } })

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        ...mockFilters,
        employeeSearch: 'John',
      })
    })

    it('shows clear button when search has value', () => {
      const filtersWithSearch = {
        ...mockFilters,
        employeeSearch: 'John',
      }

      render(
        <SuggestionFilters
          filters={filtersWithSearch}
          onFilterChange={mockOnFilterChange}
          totalCount={10}
          filteredCount={8}
        />
      )

      const clearButton = screen.getByLabelText('Clear employee search')
      expect(clearButton).toBeInTheDocument()

      fireEvent.click(clearButton)
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        ...filtersWithSearch,
        employeeSearch: '',
      })
    })
  })

  describe('Clear All Functionality', () => {
    it('enables clear all button when filters are active', () => {
      const filtersWithValues = {
        ...mockFilters,
        status: 'pending',
        employeeSearch: 'John',
      }

      render(
        <SuggestionFilters
          filters={filtersWithValues}
          onFilterChange={mockOnFilterChange}
          totalCount={10}
          filteredCount={5}
        />
      )

      const clearAllButton = screen.getByText('Clear All')
      expect(clearAllButton).toBeEnabled()

      fireEvent.click(clearAllButton)
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: null,
        priority: null,
        department: null,
        riskLevel: null,
        employeeSearch: '',
      })
    })

    it('disables clear all button when no filters are active', () => {
      render(
        <SuggestionFilters
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          totalCount={10}
          filteredCount={10}
        />
      )

      const clearAllButton = screen.getByText('Clear All')
      expect(clearAllButton).toBeDisabled()
    })
  })
})