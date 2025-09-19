export const SUGGESTION_TYPES = [
  { value: 'equipment', label: 'Equipment' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'workplace_modification', label: 'Workplace Modification' },
  { value: 'behavioural', label: 'Behavioural' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'training', label: 'Training' },
] as const;

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;

export const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'dismissed', label: 'Dismissed' },
] as const;

export const DEPARTMENTS = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Operations', label: 'Operations' },
  { value: 'HR', label: 'HR' },
] as const;

export const RISK_LEVELS = [
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' },
] as const;

export const STATUS_FILTER_OPTIONS = [
  { value: null, label: 'All Statuses' },
  { value: 'open', label: 'Open', separator: true },
  ...STATUSES,
] as const;

export const PRIORITY_FILTER_OPTIONS = [
  { value: null, label: 'All Priorities', separator: true },
  ...PRIORITIES,
] as const;

export const DEPARTMENT_FILTER_OPTIONS = [
  { value: null, label: 'All Departments', separator: true },
  ...DEPARTMENTS,
] as const;

export const RISK_LEVEL_FILTER_OPTIONS = [
  { value: null, label: 'All Risk Levels', separator: true },
  ...RISK_LEVELS,
] as const;

export const DEFAULT_PRIORITY = 'medium';
export const DEFAULT_STATUS = 'pending';
export const DEFAULT_SOURCE = 'admin';

export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
export const FOCUS_DELAY_MS = 100;
