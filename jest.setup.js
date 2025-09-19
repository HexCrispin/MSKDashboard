import '@testing-library/jest-dom'

const mockIDBRequest = {
  result: null,
  error: null,
  onsuccess: null,
  onerror: null,
}

const mockIDBOpenRequest = {
  ...mockIDBRequest,
  onupgradeneeded: null,
}

global.indexedDB = {
  open: jest.fn(() => mockIDBOpenRequest),
  deleteDatabase: jest.fn(() => mockIDBRequest),
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock
