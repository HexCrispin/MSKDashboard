import { useSuggestions } from "./useSuggestions";
import { useEmployees } from "./useEmployees";
import { useFilteredSuggestions } from "./useFilteredSuggestions";

export function useAppData() {
  const { 
    suggestions, 
    loading: suggestionsLoading, 
    error: suggestionsError, 
    retry: retrySuggestions 
  } = useSuggestions();

  const { 
    loading: employeesLoading, 
    error: employeesError, 
    getEmployeeById,
    retry: retryEmployees 
  } = useEmployees();

  const { 
    filteredSuggestions, 
    filters, 
    setFilters, 
    totalCount, 
    filteredCount 
  } = useFilteredSuggestions(suggestions, getEmployeeById);

  const loading = suggestionsLoading || employeesLoading;
  const error = suggestionsError || employeesError;
  
  const retry = () => {
    retrySuggestions();
    retryEmployees();
  };

  return {
    // Data
    suggestions,
    filteredSuggestions,
    getEmployeeById,
    
    // Filtering
    filters,
    setFilters,
    totalCount,
    filteredCount,
    
    // State
    loading,
    error,
    retry,
  };
}
