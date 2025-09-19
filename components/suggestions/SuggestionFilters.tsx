"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilterDropdown } from "./FilterDropdown";
import { Search, X } from "lucide-react";
import { 
  STATUS_FILTER_OPTIONS, 
  PRIORITY_FILTER_OPTIONS, 
  DEPARTMENT_FILTER_OPTIONS, 
  RISK_LEVEL_FILTER_OPTIONS 
} from "@/constants/dropdownOptions";

import { FilterStateSchema } from "@/types/suggestion";

export type FilterState = FilterStateSchema;

interface SuggestionFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export function SuggestionFilters({ filters, onFilterChange, totalCount, filteredCount }: SuggestionFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: string | null) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };


  const clearAllFilters = () => {
    onFilterChange({
      status: null,
      priority: null,
      department: null,
      riskLevel: null,
      employeeSearch: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== null && filter !== '');

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-foreground">Filter by:</span>
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Search employee..."
              value={filters.employeeSearch}
              onChange={(e) => updateFilter('employeeSearch', e.target.value)}
              className="employee-search pl-8 pr-8 w-48"
            />
            <Search 
              aria-hidden="true"
              className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" 
            />
            {filters.employeeSearch && (
              <button
                onClick={() => updateFilter('employeeSearch', '')}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear employee search"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <FilterDropdown
            label="Status"
            value={filters.status}
            options={STATUS_FILTER_OPTIONS}
            onChange={(value) => updateFilter('status', value)}
            className="status-filter"
            badgeColor="bg-blue-100 text-blue-800"
          />

          <FilterDropdown
            label="Priority"
            value={filters.priority}
            options={PRIORITY_FILTER_OPTIONS}
            onChange={(value) => updateFilter('priority', value)}
            className="priority-filter"
            badgeColor="bg-orange-100 text-orange-800"
          />

          <FilterDropdown
            label="Department"
            value={filters.department}
            options={DEPARTMENT_FILTER_OPTIONS}
            onChange={(value) => updateFilter('department', value)}
            className="department-filter"
            badgeColor="bg-green-100 text-green-800"
          />

          <FilterDropdown
            label="Risk Level"
            value={filters.riskLevel}
            options={RISK_LEVEL_FILTER_OPTIONS}
            onChange={(value) => updateFilter('riskLevel', value)}
            className="risk-level-filter"
            badgeColor="bg-red-100 text-red-800"
          />

            <button
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                hasActiveFilters 
                  ? "text-red-600 hover:text-red-700 hover:bg-red-50" 
                  : "text-muted-foreground cursor-not-allowed"
              }`}
            >
              Clear All
            </button>
          </div>

          <div className="text-sm text-muted-foreground flex-shrink-0">
            {filteredCount === totalCount 
              ? `${totalCount} suggestions` 
              : `${filteredCount} of ${totalCount} suggestions`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
