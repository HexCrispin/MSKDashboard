import { Suggestion } from '@/data/suggestions/suggestions';
import { Employee } from '@/data/employees/employees';

const DB_NAME = 'MSKSuggestionsDB';
const DB_VERSION = 2; 
const SUGGESTIONS_STORE = 'suggestions';
const EMPLOYEES_STORE = 'employees';

type SuggestionDB = IDBDatabase;

type DatabaseChangeEvent = 'add' | 'update' | 'delete' | 'clear' | 'seed';

interface DatabaseChangeListener {
  (event: DatabaseChangeEvent, data?: Suggestion | Suggestion[]): void;
}

class DatabaseEventEmitter {
  private listeners: DatabaseChangeListener[] = [];

  subscribe(listener: DatabaseChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  emit(event: DatabaseChangeEvent, data?: Suggestion | Suggestion[]): void {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in database change listener:', error);
      }
    });
  }
}

export const dbEvents = new DatabaseEventEmitter();

class MSKDatabase {
  private db: SuggestionDB | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(SUGGESTIONS_STORE)) {
          const suggestionsStore = db.createObjectStore(SUGGESTIONS_STORE, { keyPath: 'id' });
          
          
          suggestionsStore.createIndex('employeeId', 'employeeId', { unique: false });
          suggestionsStore.createIndex('status', 'status', { unique: false });
          suggestionsStore.createIndex('priority', 'priority', { unique: false });
          suggestionsStore.createIndex('type', 'type', { unique: false });
          suggestionsStore.createIndex('dateCreated', 'dateCreated', { unique: false });
        }

        if (!db.objectStoreNames.contains(EMPLOYEES_STORE)) {
          const employeesStore = db.createObjectStore(EMPLOYEES_STORE, { keyPath: 'id' });
          
          employeesStore.createIndex('department', 'department', { unique: false });
          employeesStore.createIndex('riskLevel', 'riskLevel', { unique: false });
          employeesStore.createIndex('name', 'name', { unique: false });
        }
      };
    });
  }

  async getAllSuggestions(): Promise<Suggestion[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SUGGESTIONS_STORE], 'readonly');
      const store = transaction.objectStore(SUGGESTIONS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get suggestions'));
      };
    });
  }

  async getSuggestionById(id: string): Promise<Suggestion | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SUGGESTIONS_STORE], 'readonly');
      const store = transaction.objectStore(SUGGESTIONS_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to get suggestion'));
      };
    });
  }

  async addSuggestion(suggestion: Suggestion): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SUGGESTIONS_STORE], 'readwrite');
      const store = transaction.objectStore(SUGGESTIONS_STORE);
      const request = store.add(suggestion);

      request.onsuccess = () => {
        dbEvents.emit('add', suggestion);
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to add suggestion'));
      };
    });
  }

  async updateSuggestion(suggestion: Suggestion): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SUGGESTIONS_STORE], 'readwrite');
      const store = transaction.objectStore(SUGGESTIONS_STORE);
      const request = store.put(suggestion);

      request.onsuccess = () => {
        dbEvents.emit('update', suggestion);
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to update suggestion'));
      };
    });
  }

  async deleteSuggestion(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SUGGESTIONS_STORE], 'readwrite');
      const store = transaction.objectStore(SUGGESTIONS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        dbEvents.emit('delete');
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to delete suggestion'));
      };
    });
  }

  async seedDatabase(suggestions: Suggestion[]): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SUGGESTIONS_STORE], 'readwrite');
      const store = transaction.objectStore(SUGGESTIONS_STORE);

      let completed = 0;
      const total = suggestions.length;

      if (total === 0) {
        resolve();
        return;
      }

      suggestions.forEach((suggestion) => {
        const request = store.put(suggestion);
        
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            dbEvents.emit('seed', suggestions);
            resolve();
          }
        };

        request.onerror = () => {
          reject(new Error(`Failed to seed suggestion ${suggestion.id}`));
        };
      });
    });
  }

  async clearAllSuggestions(): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SUGGESTIONS_STORE], 'readwrite');
      const store = transaction.objectStore(SUGGESTIONS_STORE);
      const request = store.clear();

      request.onsuccess = () => {
        dbEvents.emit('clear');
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear suggestions'));
      };
    });
  }

  async getSuggestionsByEmployee(employeeId: string): Promise<Suggestion[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SUGGESTIONS_STORE], 'readonly');
      const store = transaction.objectStore(SUGGESTIONS_STORE);
      const index = store.index('employeeId');
      const request = index.getAll(employeeId);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get suggestions by employee'));
      };
    });
  }

  async getSuggestionsByStatus(status: string): Promise<Suggestion[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SUGGESTIONS_STORE], 'readonly');
      const store = transaction.objectStore(SUGGESTIONS_STORE);
      const index = store.index('status');
      const request = index.getAll(status);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get suggestions by status'));
      };
    });
  }

  async getAllEmployees(): Promise<Employee[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([EMPLOYEES_STORE], 'readonly');
      const store = transaction.objectStore(EMPLOYEES_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get employees'));
      };
    });
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([EMPLOYEES_STORE], 'readonly');
      const store = transaction.objectStore(EMPLOYEES_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to get employee'));
      };
    });
  }

  async seedEmployees(employees: Employee[]): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([EMPLOYEES_STORE], 'readwrite');
      const store = transaction.objectStore(EMPLOYEES_STORE);

      let completed = 0;
      const total = employees.length;

      if (total === 0) {
        resolve();
        return;
      }

      employees.forEach((employee) => {
        const request = store.put(employee);
        
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };

        request.onerror = () => {
          reject(new Error(`Failed to seed employee ${employee.id}`));
        };
      });
    });
  }
}


export const mskDB = new MSKDatabase();
