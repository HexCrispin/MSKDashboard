import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card Components', () => {
  describe('Basic Rendering', () => {
    it('renders Card with correct classes and structure', () => {
      const { container } = render(
        <Card data-testid="card">
          <div>Card content</div>
        </Card>
      )
      
      const card = container.querySelector('[data-slot="card"]')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('bg-card', 'text-card-foreground')
    })

    it('renders complete card structure', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Complete Card</CardTitle>
            <CardDescription>This is a complete card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      )
      
      expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument()
      expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument()
      expect(container.querySelector('[data-slot="card-title"]')).toBeInTheDocument()
      expect(container.querySelector('[data-slot="card-description"]')).toBeInTheDocument()
      expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument()
      expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument()
    })
  })

  describe('Component Styling', () => {
    it('renders CardTitle with correct styling', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
          </CardHeader>
        </Card>
      )
      
      const title = container.querySelector('[data-slot="card-title"]')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Test Title')
      expect(title).toHaveClass('leading-none', 'font-semibold')
    })

    it('renders CardDescription with correct styling', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardDescription>Test description</CardDescription>
          </CardHeader>
        </Card>
      )
      
      const description = container.querySelector('[data-slot="card-description"]')
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent('Test description')
    })
  })

  describe('Customization', () => {
    it('applies custom className to all components', () => {
      const { container } = render(
        <Card className="custom-card">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Title</CardTitle>
            <CardDescription className="custom-desc">Description</CardDescription>
          </CardHeader>
          <CardContent className="custom-content">Content</CardContent>
          <CardFooter className="custom-footer">Footer</CardFooter>
        </Card>
      )
      
      expect(container.querySelector('.custom-card')).toBeInTheDocument()
      expect(container.querySelector('.custom-header')).toBeInTheDocument()
      expect(container.querySelector('.custom-title')).toBeInTheDocument()
      expect(container.querySelector('.custom-desc')).toBeInTheDocument()
      expect(container.querySelector('.custom-content')).toBeInTheDocument()
      expect(container.querySelector('.custom-footer')).toBeInTheDocument()
    })

    it('forwards all props correctly', () => {
      const { container } = render(
        <Card 
          id="test-card"
          role="region"
          aria-label="Test card"
          data-custom="value"
        >
          <div>Content</div>
        </Card>
      )
      
      const card = container.querySelector('[data-slot="card"]')
      expect(card).toHaveAttribute('id', 'test-card')
      expect(card).toHaveAttribute('role', 'region')
      expect(card).toHaveAttribute('aria-label', 'Test card')
      expect(card).toHaveAttribute('data-custom', 'value')
    })
  })
})