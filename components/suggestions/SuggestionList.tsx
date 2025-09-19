import { Suggestion } from "@/data/suggestions/suggestions";
import { Employee } from "@/data/employees/employees";
import { SuggestionCard } from "./SuggestionCard";

interface SuggestionListProps {
  suggestions: Suggestion[];
  onEdit?: (suggestion: Suggestion) => void;
  getEmployeeById?: (id: string) => Employee | undefined;
}

export function SuggestionList({ suggestions, onEdit, getEmployeeById }: SuggestionListProps) {
  return (
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))' }}>
      {suggestions.map((suggestion) => (
        <SuggestionCard key={suggestion.id} suggestion={suggestion} onEdit={onEdit} getEmployeeById={getEmployeeById} />
      ))}
    </div>
  );
}
