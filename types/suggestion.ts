export type SuggestionStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'dismissed';

export type SuggestionPriority = 'low' | 'medium' | 'high';

export type SuggestionType = 
  | 'equipment' 
  | 'exercise' 
  | 'workplace_modification' 
  | 'behavioural' 
  | 'lifestyle' 
  | 'training';

export type Department = 'Engineering' | 'Finance' | 'Marketing' | 'Operations' | 'HR';

export type RiskLevel = 'low' | 'medium' | 'high';

export type SuggestionSource = 'admin' | 'system' | 'employee' | 'manager';

export interface SuggestionSchema {
  id: string;
  employeeId: string;
  title: string;
  type: SuggestionType;
  description: string;
  status: SuggestionStatus;
  priority: SuggestionPriority;
  source: SuggestionSource;
  dateCreated: string;
  dateUpdated: string;
  notes: string;
  dateCompleted?: string;
  createdBy?: string;
  dueDate?: string;
}

export interface EmployeeSchema {
  id: string;
  name: string;
  department: Department;
  riskLevel: RiskLevel;
}

export interface FilterStateSchema {
  status: SuggestionStatus | 'open' | null;
  priority: SuggestionPriority | null;
  department: Department | null;
  riskLevel: RiskLevel | null;
  employeeSearch: string;
}
