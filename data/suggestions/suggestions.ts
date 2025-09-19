import { mskService } from '@/lib/suggestionService';
import { SuggestionSchema } from '@/types/suggestion';

export type Suggestion = SuggestionSchema;

export async function getSuggestions(): Promise<Suggestion[]> {
  try {
    return await mskService.getAllSuggestions();
  } catch (error) {
    console.error('Failed to load suggestions from database:', error);
    return [];
  }
}

export { mskService };
