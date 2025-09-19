import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  describe('Basic Rendering', () => {
    it('renders with default variant and size', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('applies custom className and forwards props', () => {
      render(
        <Button 
          className="custom-class"
          disabled 
          data-testid="test-button"
          aria-label="Custom label"
        >
          Test
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('data-testid', 'test-button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
    })
  })

  describe('Variants', () => {
    it('renders all variants correctly', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
      
      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant}>{variant}</Button>)
        const button = screen.getByRole('button', { name: variant })
        expect(button).toBeInTheDocument()
        unmount()
      })
    })

    it('renders destructive variant with correct styling', () => {
      render(<Button variant="destructive">Delete</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive', 'text-white')
    })

    it('renders outline variant with correct styling', () => {
      render(<Button variant="outline">Outline</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'bg-background')
    })
  })

  describe('Sizes', () => {
    it('renders all sizes correctly', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const
      
      sizes.forEach(size => {
        const { unmount } = render(<Button size={size}>{size}</Button>)
        const button = screen.getByRole('button', { name: size })
        expect(button).toBeInTheDocument()
        unmount()
      })
    })

    it('renders icon size correctly', () => {
      render(<Button size="icon">🔍</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-9')
    })
  })

  describe('Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('supports asChild prop with Slot', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      
      const link = screen.getByRole('link', { name: 'Link Button' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })
  })
})