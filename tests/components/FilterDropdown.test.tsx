import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { FilterDropdown } from '@/components/suggestions/FilterDropdown'

const mockOptions = [
  { value: null, label: 'All Items' },
  { value: 'option1', label: 'Option 1', separator: true },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]

const mockOnChange = jest.fn()

describe('FilterDropdown', () => {
  beforeEach(() => {
    mockOnChange.mockClear()
  })

  describe('Basic Rendering', () => {
    it('renders with label and no selection', () => {
      render(
        <FilterDropdown
          label="Test Filter"
          value={null}
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('Test Filter')).toBeInTheDocument()
    })

    it('shows selected value with badge', () => {
      render(
        <FilterDropdown
          label="Test Filter"
          value="option1"
          options={mockOptions}
          onChange={mockOnChange}
          badgeColor="bg-blue-100 text-blue-800"
        />
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 1')).toHaveClass('bg-blue-100', 'text-blue-800')
    })

    it('uses default badge color when not specified', () => {
      render(
        <FilterDropdown
          label="Test Filter"
          value="option1"
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      const badge = screen.getByText('Option 1')
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
    })
  })

  describe('Dropdown Interactions', () => {
    it('opens dropdown menu when clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <FilterDropdown
          label="Test Filter"
          value={null}
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      const trigger = screen.getByRole('button')
      await user.click(trigger)

      expect(screen.getByText('All Items')).toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    it('calls onChange when option is selected', async () => {
      const user = userEvent.setup()
      
      render(
        <FilterDropdown
          label="Test Filter"
          value={null}
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      const trigger = screen.getByRole('button')
      await user.click(trigger)

      const option = screen.getByText('Option 1')
      await user.click(option)

      expect(mockOnChange).toHaveBeenCalledWith('option1')
    })

    it('handles null value selection correctly', async () => {
      const user = userEvent.setup()
      
      render(
        <FilterDropdown
          label="Test Filter"
          value="option1"
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      const trigger = screen.getByRole('button')
      await user.click(trigger)

      const allItemsOption = screen.getByText('All Items')
      await user.click(allItemsOption)

      expect(mockOnChange).toHaveBeenCalledWith(null)
    })
  })

  describe('Accessibility', () => {
    it('shows correct aria-label with selected value', () => {
      render(
        <FilterDropdown
          label="Status"
          value="option1"
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-label', 'Filter by status, currently Option 1')
    })

    it('shows correct aria-label without selected value', () => {
      render(
        <FilterDropdown
          label="Status"
          value={null}
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-label', 'Filter by status')
    })
  })

  describe('Customization', () => {
    it('applies custom className', () => {
      const { container } = render(
        <FilterDropdown
          label="Test Filter"
          value={null}
          options={mockOptions}
          onChange={mockOnChange}
          className="custom-class"
        />
      )

      const trigger = container.querySelector('.custom-class')
      expect(trigger).toBeInTheDocument()
    })

    it('renders separators for options with separator flag', async () => {
      const user = userEvent.setup()
      
      render(
        <FilterDropdown
          label="Test Filter"
          value={null}
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      const trigger = screen.getByRole('button')
      await user.click(trigger)

      const separators = document.querySelectorAll('[role="separator"]')
      expect(separators.length).toBeGreaterThan(0)
    })
  })
})