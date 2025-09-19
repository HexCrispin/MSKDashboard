import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface FilterOption {
  value: string | null;
  label: string;
  separator?: boolean;
}

interface FilterDropdownProps {
  label: string;
  value: string | null;
  options: readonly FilterOption[];
  onChange: (value: string | null) => void;
  className?: string;
  badgeColor?: string;
}

export function FilterDropdown({ 
  label, 
  value, 
  options, 
  onChange, 
  className = "",
  badgeColor = "bg-blue-100 text-blue-800"
}: FilterDropdownProps) {
  const dropdownTriggerClasses = "px-3 py-2 text-sm border rounded-md hover:bg-muted flex items-center gap-2";
  
  const selectedOption = options.find(option => option.value === value);
  const displayLabel = selectedOption?.label || value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        className={`${className} ${dropdownTriggerClasses}`}
        aria-label={`Filter by ${label.toLowerCase()}${value ? `, currently ${displayLabel}` : ''}`}
      >
        {label} {value && (
          <span className={`px-2 py-1 rounded text-xs ${badgeColor}`}>
            {displayLabel}
          </span>
        )}
        <ChevronDown size={16} className="ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <div key={option.value || 'all'}>
            <DropdownMenuItem onClick={() => onChange(option.value)}>
              {option.label}
            </DropdownMenuItem>
            {option.separator && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
