import { useEffect, useState, useCallback } from 'react';
import { getAllEmployees, Employee } from '@/data/employees/employees';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load employees:', err);
      setError('Failed to load employees from the database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const getEmployeeById = useCallback((id: string): Employee | undefined => {
    return employees.find(employee => employee.id === id);
  }, [employees]);

  return {
    employees,
    loading,
    error,
    getEmployeeById,
    retry: loadEmployees
  };
}
