# MSK Suggestion Dashboard

A modern web application for managing employee health and safety suggestions, built with Next.js, TypeScript, and IndexedDB.

## 🎯 Challenge Overview

This application addresses the need for admins to manage employee suggestions more effectively, helping drive workplace safety engagement. The solution provides a comprehensive dashboard for viewing, updating, and creating suggestions with a focus on user experience and scalability.

## ✨ Features

### Core Requirements ✅
- **📊 View Suggestions Dashboard** - Display all suggestions with filtering and search capabilities
- **🔄 Update Suggestion Status** - Mark suggestions as "pending," "in progress," "completed," or "dismissed"  
- **➕ Create Custom Suggestions** - Add new recommendations for specific employees with category selection
- **📱 Responsive Design** - Optimized for desktop and mobile viewports

### Enhanced Features
- **🔍 Advanced Filtering** - Filter by status, priority, department, risk level, and employee search
- **⚡ Real-time Updates** - Instant UI updates with IndexedDB persistence
- **♿ Accessibility** - ARIA labels, keyboard navigation, and semantic HTML
- **🌙 Theme Support** - Light/dark mode toggle
- **📈 Status Management** - Automatic overdue detection and status updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/HexCrispin/MSKDashboard.git
cd <your-project-folder>

# Install dependencies
npm install

# Build and start production server
npm run build
npm run start
```

2. **Open your browser to [http://localhost:3000](http://localhost:3000)**

**Alternative - Development Mode:**
```bash
npm run dev  # For development with hot reload
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
```

## 🏗️ Architecture & Technical Decisions

### Technology Stack

**Frontend Framework**: Next.js 15 with React 19
- **Rationale**: Latest stable versions providing

**Styling**: Tailwind CSS + Radix UI
- **Rationale**: Utility-first CSS for rapid development, Radix for accessible component primitives

**Database**: IndexedDB with custom abstraction layer
- **Rationale**: Client-side persistence without backend complexity, appropriate for the challenge scope

**Testing**: Jest + React Testing Library
- **Rationale**: Industry standard testing tools

**Type Safety**: TypeScript with strict configuration
- **Rationale**: Catch errors at compile-time and improve developer experience

### Architectural Patterns

#### 1. **Component Architecture**
```
app/                    # Next.js app router
├── page.tsx           # Main dashboard page
├── layout.tsx         # Root layout
└── globals.css        # Global styles

components/
├── suggestions/      # Feature-specific components
├── states/           # Reusable state components (Loading, Error)
├── layout/           # Layout components (AppHeader)
└── ui/               # Base UI components (shadcn/ui)

lib/                  # Business logic & hooks
├── useAppData.ts     # Combined app data hook
├── useEmployees.ts   # Employee management hook
├── useFilteredSuggestions.ts # Suggestion filtering hook
├── useSuggestions.ts # Suggestion data hook
├── suggestionService.ts # Data service layer
├── indexedDB.ts      # Database abstraction
└── utils.ts          # Utility functions

types/                # TypeScript type definitions
constants/            # Application constants
data/                 # Sample data & interfaces
```

#### 2. **Data Flow Pattern**
- **Custom Hooks**: Encapsulate data fetching and state management
- **Service Layer**: Abstract database operations behind clean interfaces  
- **Event System**: Real-time updates using custom event emitter
- **Type Safety**: Strict TypeScript types prevent runtime errors

#### 3. **State Management Strategy**
- **Local State**: React useState for component-specific state
- **Shared State**: Custom hooks for cross-component data
- **Persistence**: IndexedDB for data persistence
- **Real-time**: Event-driven updates for immediate UI feedback

### Key Design Decisions

#### **Database Choice: IndexedDB**
- ✅ **No Backend Required**: Meets challenge requirements
- ✅ **Production Scalable**: Can easily migrate to REST API
- ✅ **Offline Capable**: Works without internet connection
- ✅ **Performance**: Fast local queries and updates

#### **Component Structure**
- ✅ **Single Responsibility**: Each component has one clear purpose
- ✅ **Reusability**: Components designed for reuse across features
- ✅ **Composition**: Higher-order components compose smaller ones
- ✅ **Props Interface**: Clear, typed interfaces for all components

#### **Error Handling Strategy**
- ✅ **User-Friendly**: Inline validation with clear error messages
- ✅ **Graceful Degradation**: Fallback states for failed operations
- ✅ **Recovery Options**: Retry mechanisms for transient failures
- ✅ **Developer Experience**: Console logging for debugging

## 📊 Data Model

### Suggestion Schema
```typescript
interface SuggestionSchema {
  id: string;
  employeeId: string;
  title: string;                      // Added for clean card view
  type: 'equipment' | 'exercise' | 'workplace_modification' | 'behavioural' | 'lifestyle' | 'training';
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  source: 'admin' | 'system' | 'employee' | 'manager';
  dateCreated: string;
  dateUpdated: string;
  notes: string;
  dateCompleted?: string;
  dueDate?: string;                   // Added to support overdue functionality
  createdBy?: string;
}
```

### Employee Schema
```typescript
interface EmployeeSchema {
  id: string;
  name: string;
  department: 'Engineering' | 'Finance' | 'Marketing' | 'Operations' | 'HR';
  riskLevel: 'low' | 'medium' | 'high';
}
```

## 🎨 User Experience Considerations

### **Admin Workflow Optimization**
- **Quick Actions**: Status updates via dropdown without page navigation
- **Bulk Operations**: Filter and manage multiple suggestions efficiently
- **Search & Filter**: Find specific employees or suggestion types quickly
- **Visual Feedback**: Clear status indicators and loading states

### **Responsive Design**
- **Mobile-First**: Optimized for small screens with collapsible filters
- **Touch-Friendly**: Large tap targets and intuitive gestures
- **Progressive Enhancement**: Works on all devices and screen sizes

## 🧪 Testing Strategy

### **Test Coverage**: 145 tests across 18 test suites

**Component Tests**: UI behavior, user interactions, error states
```bash
tests/components/     # Component unit tests
tests/hooks/         # Custom hook tests  
tests/lib/           # Service layer tests
tests/utils/         # Utility function tests
```

**Testing Patterns**:
- **User-Centric**: Tests focus on user interactions rather than implementation
- **Error Scenarios**: Error handling and edge case coverage
- **Integration**: Components tested with their dependencies

### **Quality Assurance**
```bash
npm run test:coverage  # View detailed coverage report
npm run lint          # Code quality and consistency
npm run build         # Production build verification
```

## 🔧 Development Features

### **Developer Experience**
- **Hot Reload**: Instant feedback during development
- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Consistent code style and error prevention
- **Prettier**: Automatic code formatting
- **Jest**: Comprehensive testing with watch mode

### **Production Ready**
- **Build Optimization**: Next.js automatic optimizations
- **Bundle Analysis**: Built-in bundle analyzer
- **Performance Monitoring**: Web Vitals tracking ready
- **Error Boundaries**: Graceful error handling in production

## 🚀 Deployment

### **Build for Production**
```bash
npm run build        # Create optimized production build
npm run start        # Start production server
```

## 🔮 Future Enhancements

### **Potential Enhancements**
- **Backend Integration**: Easy migration to REST API or GraphQL
- **Database Migration**: IndexedDB → PostgreSQL/MongoDB
- **Authentication**: User roles and permissions
- **Real-time Collaboration**: WebSocket integration for multi-user scenarios
- **Bulk Operations**: Mass update functionality for multiple suggestions

## 🤝 Assumptions Made

1. **Single Admin User**: No authentication/authorization required for demo
2. **Client-Side Storage**: IndexedDB sufficient for data persistence needs
3. **Employee Management**: Employees are managed via JSON data files, not through the application UI
4. **English Only**: No internationalization requirements
5. **Modern Browsers**: ES2020+ support assumed
6. **Sample Data**: Data is seeded from JSON files on first load; changes require database reset

## 📝 Notes

- **Production Considerations**: While this is a demo, the architecture is designed to scale to production with minimal changes
- **Performance**: Optimized for managing dozens of employees as specified in requirements
- **Accessibility**: WCAG 2.1 AA compliance considerations implemented

---

For questions or clarifications, please feel free to reach out