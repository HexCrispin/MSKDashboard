"use client";

import { useState } from "react";
import { SuggestionList, SuggestionModal } from "@/components/suggestions";
import { Suggestion } from "@/data/suggestions/suggestions";
import { useAppData } from "@/lib/useAppData";
import { LoadingState } from "@/components/states/LoadingState";
import { ErrorState } from "@/components/states/ErrorState";
import { AppHeader } from "@/components/layout/AppHeader";

export default function Home() {
  const {
    filteredSuggestions,
    filters,
    setFilters,
    totalCount,
    filteredCount,
    loading,
    error,
    retry,
    getEmployeeById
  } = useAppData();
  
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState<Suggestion | undefined>(undefined);

  const handleCreateSuggestion = () => {
    setEditingSuggestion(undefined);
    setIsModalOpen(true);
  };

  const handleEditSuggestion = (suggestion: Suggestion) => {
    setEditingSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSuggestion(undefined);
  };


  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={retry} isRetrying={loading} />;
  }

  return (
    <div className="font-sans min-h-screen">
      <AppHeader
        filters={filters}
        onFilterChange={setFilters}
        totalCount={totalCount}
        filteredCount={filteredCount}
        filtersExpanded={filtersExpanded}
        onToggleFilters={() => setFiltersExpanded(!filtersExpanded)}
        onCreateSuggestion={handleCreateSuggestion}
        suggestionCount={filteredSuggestions.length}
      />

      <main className="px-4 py-3 sm:p-20 sm:pt-6">
        <div className="w-full">
          <SuggestionList
            suggestions={filteredSuggestions}
            onEdit={handleEditSuggestion}
            getEmployeeById={getEmployeeById}
          />
        </div>
      </main>

      <SuggestionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        suggestion={editingSuggestion}
      />
    </div>
  );
}
