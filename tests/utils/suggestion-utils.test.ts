import { 
  getStatusColor, 
  getPriorityColor, 
  getHighMediumLowColor, 
  formatText 
} from '@/components/suggestions/suggestion-utils'

describe('suggestion-utils', () => {
  describe('Color Functions', () => {
    describe('getStatusColor', () => {
      it('returns correct colors for all status types', () => {
        expect(getStatusColor('pending')).toContain('bg-yellow-100 text-yellow-800')
        expect(getStatusColor('in_progress')).toContain('bg-blue-100 text-blue-800')
        expect(getStatusColor('completed')).toContain('bg-green-100 text-green-800')
        expect(getStatusColor('overdue')).toContain('bg-red-100 text-red-800')
        expect(getStatusColor('dismissed')).toContain('bg-gray-100 text-gray-800')
      })

      it('returns default gray for unknown status', () => {
        expect(getStatusColor('unknown')).toContain('bg-gray-100 text-gray-800')
      })
    })

    describe('getPriorityColor', () => {
      it('returns correct colors for all priority levels', () => {
        expect(getPriorityColor('low')).toContain('bg-green-100 text-green-800')
        expect(getPriorityColor('medium')).toContain('bg-orange-100 text-orange-800')
        expect(getPriorityColor('high')).toContain('bg-red-100 text-red-800')
      })

      it('returns default gray for unknown priority', () => {
        expect(getPriorityColor('unknown')).toContain('bg-gray-100 text-gray-800')
      })
    })

    describe('getHighMediumLowColor', () => {
      it('returns correct text colors for risk levels', () => {
        expect(getHighMediumLowColor('low')).toContain('text-green-600')
        expect(getHighMediumLowColor('medium')).toContain('text-orange-600')
        expect(getHighMediumLowColor('high')).toContain('text-red-600')
      })

      it('handles edge cases', () => {
        expect(getHighMediumLowColor(undefined)).toContain('text-red-600')
        expect(getHighMediumLowColor('unknown')).toContain('text-red-600')
      })
    })
  })

  describe('Text Formatting', () => {
    describe('formatText', () => {
      it('formats underscore-separated text correctly', () => {
        expect(formatText('in_progress')).toBe('In Progress')
        expect(formatText('workplace_modification')).toBe('Workplace Modification')
        expect(formatText('test_multiple_words')).toBe('Test Multiple Words')
      })

      it('handles single words', () => {
        expect(formatText('simple')).toBe('Simple')
        expect(formatText('UPPERCASE')).toBe('UPPERCASE')
      })

      it('handles edge cases', () => {
        expect(formatText(undefined)).toBe('')
        expect(formatText('')).toBe('')
      })

      it('capitalizes first letter of each word', () => {
        expect(formatText('high_priority')).toBe('High Priority')
        expect(formatText('low')).toBe('Low')
      })
    })
  })
})