import { mskDB } from './indexedDB';
import { Suggestion } from '@/data/suggestions/suggestions';
import { Employee } from '@/data/employees/employees';
import suggestionsData from '@/data/suggestions/suggestions.json';
import employeesData from '@/data/employees/employees.json';

export class MSKService {
  private static instance: MSKService;
  private initialized = false;

  static getInstance(): MSKService {
    if (!MSKService.instance) {
      MSKService.instance = new MSKService();
    }
    return MSKService.instance;
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      await mskDB.init();
      
      const existingEmployees = await mskDB.getAllEmployees();
      if (existingEmployees.length === 0) {
        await this.seedEmployees();
      }
      const existingSuggestions = await mskDB.getAllSuggestions();
      if (existingSuggestions.length === 0) {
        await this.seedSuggestions();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize suggestion service:', error);
      throw error;
    }
  }

  async seedEmployees(): Promise<void> {
    try {
      await mskDB.seedEmployees(employeesData as Employee[]);
    } catch (error) {
      console.error('Failed to seed employees:', error);
      throw error;
    }
  }

  async seedSuggestions(): Promise<void> {
    try {
      await mskDB.seedDatabase(suggestionsData as Suggestion[]);
    } catch (error) {
      console.error('Failed to seed suggestions:', error);
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }

  async getAllSuggestions(): Promise<Suggestion[]> {
    await this.ensureInitialized();
    return mskDB.getAllSuggestions();
  }

  async getSuggestionById(id: string): Promise<Suggestion | null> {
    await this.ensureInitialized();
    return mskDB.getSuggestionById(id);
  }

  async createSuggestion(suggestion: Omit<Suggestion, 'id' | 'dateCreated' | 'dateUpdated'>): Promise<Suggestion> {
    await this.ensureInitialized();
    
    const newSuggestion: Suggestion = {
      ...suggestion,
      id: crypto.randomUUID(),
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    };

    await mskDB.addSuggestion(newSuggestion);
    return newSuggestion;
  }

  async updateSuggestion(id: string, updates: Partial<Suggestion>): Promise<Suggestion | null> {
    return this.updateSuggestionInternal(id, {
      ...updates,
      dateUpdated: new Date().toISOString(),
    });
  }

  async updateSuggestionInternal(id: string, updates: Partial<Suggestion>): Promise<Suggestion | null> {
    await this.ensureInitialized();
    
    const existingSuggestion = await mskDB.getSuggestionById(id);
    if (!existingSuggestion) {
      return null;
    }

    const updatedSuggestion: Suggestion = {
      ...existingSuggestion,
      ...updates,
      id,
    };

    await mskDB.updateSuggestion(updatedSuggestion);
    return updatedSuggestion;
  }

  async deleteSuggestion(id: string): Promise<boolean> {
    await this.ensureInitialized();
    
    const existingSuggestion = await mskDB.getSuggestionById(id);
    if (!existingSuggestion) {
      return false;
    }

    await mskDB.deleteSuggestion(id);
    return true;
  }

  async getSuggestionsByEmployee(employeeId: string): Promise<Suggestion[]> {
    await this.ensureInitialized();
    return mskDB.getSuggestionsByEmployee(employeeId);
  }

  async getSuggestionsByStatus(status: string): Promise<Suggestion[]> {
    await this.ensureInitialized();
    return mskDB.getSuggestionsByStatus(status);
  }

  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
  }> {
    await this.ensureInitialized();
    
    const suggestions = await mskDB.getAllSuggestions();
    
    const stats = {
      total: suggestions.length,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      byType: {} as Record<string, number>,
    };

    suggestions.forEach(suggestion => {
      stats.byStatus[suggestion.status] = (stats.byStatus[suggestion.status] || 0) + 1;
      
      stats.byPriority[suggestion.priority] = (stats.byPriority[suggestion.priority] || 0) + 1;
      
      stats.byType[suggestion.type] = (stats.byType[suggestion.type] || 0) + 1;
    });

    return stats;
  }

  async resetDatabase(): Promise<void> {
    await this.ensureInitialized();
    await mskDB.clearAllSuggestions();
    await this.seedSuggestions();
  }

  async getAllEmployees(): Promise<Employee[]> {
    await this.ensureInitialized();
    return mskDB.getAllEmployees();
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    await this.ensureInitialized();
    return mskDB.getEmployeeById(id);
  }

  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    return this.filterEmployees(employee => employee.department === department);
  }

  async getEmployeesByRiskLevel(riskLevel: 'high' | 'medium' | 'low'): Promise<Employee[]> {
    return this.filterEmployees(employee => employee.riskLevel === riskLevel);
  }

  private async filterEmployees(predicate: (employee: Employee) => boolean): Promise<Employee[]> {
    await this.ensureInitialized();
    const allEmployees = await mskDB.getAllEmployees();
    return allEmployees.filter(predicate);
  }

  async markOverdueSuggestions(): Promise<number> {
    await this.ensureInitialized();
    const suggestions = await mskDB.getAllSuggestions();
    const now = new Date();
    let updatedCount = 0;

    for (const suggestion of suggestions) {
      if (suggestion.dueDate && 
          suggestion.status !== 'completed' && 
          suggestion.status !== 'dismissed' &&
          suggestion.status !== 'pending' &&
          suggestion.status !== 'overdue') {
        const dueDate = new Date(suggestion.dueDate);
        if (dueDate < now) {
          await this.updateSuggestionInternal(suggestion.id, { status: 'overdue' });
          updatedCount++;
        }
      }
    }

    return updatedCount;
  }
}

export const mskService = MSKService.getInstance();
