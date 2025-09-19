import { dbEvents } from '@/lib/indexedDB'
import { Suggestion } from '@/data/suggestions/suggestions'

describe('Database Events', () => {
  describe('Event Subscription', () => {
    it('allows subscribing to database events', () => {
      const listener = jest.fn()
      const unsubscribe = dbEvents.subscribe(listener)

      expect(typeof unsubscribe).toBe('function')
    })

    it('calls listeners when events are emitted', () => {
      const listener1 = jest.fn()
      const listener2 = jest.fn()
      
      dbEvents.subscribe(listener1)
      dbEvents.subscribe(listener2)

      dbEvents.emit('add', { id: '1' } as Suggestion)

      expect(listener1).toHaveBeenCalledWith('add', { id: '1' })
      expect(listener2).toHaveBeenCalledWith('add', { id: '1' })
    })

    it('unsubscribes listeners correctly', () => {
      const listener = jest.fn()
      const unsubscribe = dbEvents.subscribe(listener)

      dbEvents.emit('add', { id: '1' } as Suggestion)
      expect(listener).toHaveBeenCalledTimes(1)

      unsubscribe()
      
      dbEvents.emit('add', { id: '2' } as Suggestion)
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('handles errors in listeners gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const errorListener = jest.fn(() => {
        throw new Error('Listener error')
      })
      const normalListener = jest.fn()

      dbEvents.subscribe(errorListener)
      dbEvents.subscribe(normalListener)

      dbEvents.emit('add', { id: '1' } as Suggestion)

      expect(consoleSpy).toHaveBeenCalledWith('Error in database change listener:', expect.any(Error))
      expect(normalListener).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Event Types', () => {
    it('supports all database event types', () => {
      const listener = jest.fn()
      dbEvents.subscribe(listener)

      const eventTypes = ['add', 'update', 'delete', 'clear', 'seed'] as const
      
      eventTypes.forEach(eventType => {
        dbEvents.emit(eventType, { id: '1' } as Suggestion)
        expect(listener).toHaveBeenCalledWith(eventType, { id: '1' })
      })

      expect(listener).toHaveBeenCalledTimes(eventTypes.length)
    })
  })
})
