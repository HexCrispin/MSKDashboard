import { MSKService } from '@/lib/suggestionService'
import { Suggestion } from '@/data/suggestions/suggestions'
import { mskDB } from '@/lib/indexedDB'
import { SuggestionStatus, RiskLevel, Department, SuggestionType, SuggestionPriority, SuggestionSource } from '@/types/suggestion'

jest.mock('@/lib/indexedDB', () => ({
  mskDB: {
    init: jest.fn().mockResolvedValue(undefined),
    getAllSuggestions: jest.fn().mockResolvedValue([]),
    getSuggestionById: jest.fn(),
    getEmployeeById: jest.fn(),
    addSuggestion: jest.fn(),
    updateSuggestion: jest.fn(),
    deleteSuggestion: jest.fn(),
    getAllEmployees: jest.fn().mockResolvedValue([]),
    seedDatabase: jest.fn(),
    seedEmployees: jest.fn(),
  },
}))

jest.mock('@/data/suggestions/suggestions.json', () => [])
jest.mock('@/data/employees/employees.json', () => [])

const mockedMskDB = jest.mocked(mskDB)

const mockSuggestion: Suggestion = {
  id: '1',
  employeeId: 'emp1',
  title: 'Test Suggestion',
  type: 'equipment',
  description: 'Test description',
  status: 'pending',
  priority: 'medium',
  source: 'admin',
  dateCreated: '2024-01-01T00:00:00.000Z',
  dateUpdated: '2024-01-01T00:00:00.000Z',
  notes: 'Test notes',
}

describe('MSKService', () => {
  let service: MSKService

  beforeEach(() => {
    service = MSKService.getInstance()
    jest.clearAllMocks()
  })

  describe('Suggestion CRUD Operations', () => {
    it('gets all suggestions from database', async () => {
      mockedMskDB.getAllSuggestions.mockResolvedValue([mockSuggestion])

      const result = await service.getAllSuggestions()

      expect(result).toEqual([mockSuggestion])
      expect(mockedMskDB.getAllSuggestions).toHaveBeenCalled()
    })

    it('gets suggestion by ID', async () => {
      mockedMskDB.getSuggestionById.mockResolvedValue(mockSuggestion)

      const result = await service.getSuggestionById('1')

      expect(result).toEqual(mockSuggestion)
      expect(mockedMskDB.getSuggestionById).toHaveBeenCalledWith('1')
    })

    it('creates new suggestion with generated ID and timestamps', async () => {
      const newSuggestionData = {
        employeeId: 'emp1',
        title: 'New Suggestion',
        type: 'equipment' as SuggestionType,
        description: 'New description',
        priority: 'medium' as SuggestionPriority,
        notes: 'New notes',
        status: 'pending' as SuggestionStatus,
        source: 'admin' as SuggestionSource,
      }

      const result = await service.createSuggestion(newSuggestionData)

      expect(result.id).toBeDefined()
      expect(result.dateCreated).toBeDefined()
      expect(result.dateUpdated).toBeDefined()
      expect(result.title).toBe('New Suggestion')
      expect(mockedMskDB.addSuggestion).toHaveBeenCalledWith(result)
    })

    it('updates existing suggestion', async () => {
      mockedMskDB.getSuggestionById.mockResolvedValue(mockSuggestion)

      const updates = { title: 'Updated Title' }
      const result = await service.updateSuggestion('1', updates)

      expect(result?.title).toBe('Updated Title')
      expect(result?.dateUpdated).toBeDefined()
      expect(mockedMskDB.updateSuggestion).toHaveBeenCalled()
    })

    it('returns null when updating non-existent suggestion', async () => {
      mockedMskDB.getSuggestionById.mockResolvedValue(null)

      const result = await service.updateSuggestion('nonexistent', { title: 'Updated' })

      expect(result).toBeNull()
      expect(mockedMskDB.updateSuggestion).not.toHaveBeenCalled()
    })

    it('deletes existing suggestion', async () => {
      mockedMskDB.getSuggestionById.mockResolvedValue(mockSuggestion)

      const result = await service.deleteSuggestion('1')

      expect(result).toBe(true)
      expect(mockedMskDB.deleteSuggestion).toHaveBeenCalledWith('1')
    })

    it('returns false when deleting non-existent suggestion', async () => {
      mockedMskDB.getSuggestionById.mockResolvedValue(null)

      const result = await service.deleteSuggestion('nonexistent')

      expect(result).toBe(false)
      expect(mockedMskDB.deleteSuggestion).not.toHaveBeenCalled()
    })
  })

  describe('Employee Operations', () => {
    it('gets all employees', async () => {
      const mockEmployees = [{ id: 'emp1', name: 'John', department: 'Engineering' as Department, riskLevel: 'high' as RiskLevel }]
      mockedMskDB.getAllEmployees.mockResolvedValue(mockEmployees)

      const result = await service.getAllEmployees()

      expect(result).toEqual(mockEmployees)
      expect(mockedMskDB.getAllEmployees).toHaveBeenCalled()
    })

    it('gets employee by ID', async () => {
      const mockEmployee = { id: 'emp1', name: 'John', department: 'Engineering' as Department, riskLevel: 'high' as RiskLevel }
      mockedMskDB.getEmployeeById.mockResolvedValue(mockEmployee)

      const result = await service.getEmployeeById('emp1')

      expect(result).toEqual(mockEmployee)
      expect(mockedMskDB.getEmployeeById).toHaveBeenCalledWith('emp1')
    })
  })

  describe('Initialization', () => {
    it('initializes database successfully', async () => {
      expect(service).toBeDefined()
      expect(typeof service.getAllSuggestions).toBe('function')
      expect(typeof service.createSuggestion).toBe('function')
      expect(typeof service.updateSuggestion).toBe('function')
      expect(typeof service.deleteSuggestion).toBe('function')
    })
  })

  describe('Overdue Suggestions', () => {
    it('marks overdue suggestions correctly', async () => {
      const overdueDate = new Date()
      overdueDate.setDate(overdueDate.getDate() - 1)

      const overdueSuggestion = {
        ...mockSuggestion,
        dueDate: overdueDate.toISOString(),
        status: 'in_progress' as SuggestionStatus
      }

      mockedMskDB.getAllSuggestions.mockResolvedValue([overdueSuggestion])
      const updateSpy = jest.spyOn(service, 'updateSuggestionInternal').mockResolvedValue(null)

      const result = await service.markOverdueSuggestions()

      expect(result).toBe(1)
      expect(updateSpy).toHaveBeenCalledWith('1', { status: 'overdue' })
      
      updateSpy.mockRestore()
    })

    it('skips suggestions that are already completed or dismissed', async () => {
      const oneDayInMs = 86400000
      const yesterday = new Date(Date.now() - oneDayInMs).toISOString()
      const completedSuggestion = {
        ...mockSuggestion,
        dueDate: yesterday,
        status: 'completed' as SuggestionStatus
      }

      mockedMskDB.getAllSuggestions.mockResolvedValue([completedSuggestion])
      const updateSpy = jest.spyOn(service, 'updateSuggestionInternal').mockResolvedValue(null)

      const result = await service.markOverdueSuggestions()

      expect(result).toBe(0)
      expect(updateSpy).not.toHaveBeenCalled()
      
      updateSpy.mockRestore()
    })
  })
})