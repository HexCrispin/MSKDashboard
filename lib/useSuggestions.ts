import { useEffect, useState, useCallback } from 'react';
import { dbEvents } from './indexedDB';
import { getSuggestions, Suggestion } from '@/data/suggestions/suggestions';

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const { mskService } = await import('@/data/suggestions/suggestions');
      await mskService.markOverdueSuggestions();
      const data = await getSuggestions();
      setSuggestions(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
      setError('Failed to load suggestions from the database. This could be due to browser storage issues or corrupted data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuggestions();

    const unsubscribe = dbEvents.subscribe(() => {
      loadSuggestions();
    });
    
    return unsubscribe;
  }, [loadSuggestions]);

  return {
    suggestions,
    loading,
    error,
    retry: loadSuggestions
  };
}
