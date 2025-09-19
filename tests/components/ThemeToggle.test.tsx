import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    document.documentElement.classList.remove('dark')
  })

  describe('Basic Rendering', () => {
    it('renders theme toggle button', () => {
      render(<ThemeToggle />)
      const button = screen.getByRole('button', { name: /switch to dark mode/i })
      expect(button).toBeInTheDocument()
    })

    it('shows moon icon in light mode', () => {
      mockLocalStorage.getItem.mockReturnValue('light')
      render(<ThemeToggle />)
      
      const button = screen.getByRole('button', { name: /switch to dark mode/i })
      expect(button).toBeInTheDocument()
    })
  })

  describe('Theme Switching', () => {
    it('toggles theme when clicked', () => {
      mockLocalStorage.getItem.mockReturnValue('light')
      render(<ThemeToggle />)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
    })

    it('respects system preference when no saved theme', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      render(<ThemeToggle />)
      
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('uses light theme as fallback', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      render(<ThemeToggle />)
      
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })
})