import { ChevronDown, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SuggestionFilters, FilterState } from "@/components/suggestions/SuggestionFilters";

interface AppHeaderProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
  filtersExpanded: boolean;
  onToggleFilters: () => void;
  onCreateSuggestion: () => void;
  suggestionCount: number;
}

export function AppHeader({
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
  filtersExpanded,
  onToggleFilters,
  onCreateSuggestion,
  suggestionCount
}: AppHeaderProps) {
  return (
    <div className="sticky top-0 bg-background z-10 border-b border-border px-4 py-3 sm:p-20 sm:pb-6">
      <div className="w-full">
        <header className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">MSK Suggestion Management Board</h1>
              <p className="text-sm sm:text-base">This is a management board for the MSK Suggestion system.</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={onToggleFilters}
                className="md:hidden p-2 hover:bg-muted rounded-md"
                aria-label="Toggle filters"
              >
                <ChevronDown
                  aria-hidden="true"
                  className={`w-5 h-5 transition-transform ${filtersExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>
        </header>

        <div className={`${filtersExpanded ? 'block' : 'hidden'} md:block`}>
          <SuggestionFilters
            filters={filters}
            onFilterChange={onFilterChange}
            totalCount={totalCount}
            filteredCount={filteredCount}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 sm:mt-4 gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold">
            Suggestions ({suggestionCount})
          </h2>
          <button
            onClick={onCreateSuggestion}
            className="px-3 py-2 sm:px-4 bg-primary text-primary-foreground text-xs sm:text-sm rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus
              aria-hidden="true"
              className="w-4 h-4"
            />
            <span className="sm:inline">Create Suggestion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
