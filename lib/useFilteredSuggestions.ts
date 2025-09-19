import { useMemo, useState } from 'react';
import { Suggestion } from '@/data/suggestions/suggestions';
import { Employee } from '@/data/employees/employees';
import { FilterState } from '@/components/suggestions/SuggestionFilters';

export function useFilteredSuggestions(suggestions: Suggestion[], getEmployeeById: (id: string) => Employee | undefined) {
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    priority: null,
    department: null,
    riskLevel: null,
    employeeSearch: ''
  });

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(suggestion => {
      const employee = getEmployeeById(suggestion.employeeId);

      if (filters.employeeSearch) {
        if (!employee || !employee.name.toLowerCase().includes(filters.employeeSearch.toLowerCase())) {
          return false;
        }
      }

      if (filters.status) {
        if (filters.status === 'open') {
          if (suggestion.status === 'dismissed' || suggestion.status === 'completed') {
            return false;
          }
        } else if (suggestion.status !== filters.status) {
          return false;
        }
      }

      if (filters.priority && suggestion.priority !== filters.priority) {
        return false;
      }

      if (filters.department) {
        if (!employee || employee.department !== filters.department) {
          return false;
        }
      }

      if (filters.riskLevel) {
        if (!employee || employee.riskLevel !== filters.riskLevel) {
          return false;
        }
      }

      return true;
    });
  }, [suggestions, filters, getEmployeeById]);

  return {
    filteredSuggestions,
    filters,
    setFilters,
    totalCount: suggestions.length,
    filteredCount: filteredSuggestions.length
  };
}
