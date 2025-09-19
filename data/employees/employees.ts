import { mskService } from '@/lib/suggestionService';
import { EmployeeSchema } from '@/types/suggestion';

export type Employee = EmployeeSchema;

export async function getAllEmployees(): Promise<Employee[]> {
  try {
    return await mskService.getAllEmployees();
  } catch (error) {
    console.error('Failed to load employees from database:', error);
    return [];
  }
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    return await mskService.getEmployeeById(id);
  } catch (error) {
    console.error('Failed to load employee from database:', error);
    return null;
  }
}

export async function getEmployeesByDepartment(department: string): Promise<Employee[]> {
  try {
    return await mskService.getEmployeesByDepartment(department);
  } catch (error) {
    console.error('Failed to load employees by department from database:', error);
    return [];
  }
}

export async function getEmployeesByRiskLevel(riskLevel: 'high' | 'medium' | 'low'): Promise<Employee[]> {
  try {
    return await mskService.getEmployeesByRiskLevel(riskLevel);
  } catch (error) {
    console.error('Failed to load employees by risk level from database:', error);
    return [];
  }
}

export { mskService };
