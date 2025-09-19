"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { mskService, Suggestion } from "@/data/suggestions/suggestions";
import { useEmployees } from "@/lib/useEmployees";
import { SUGGESTION_TYPES, PRIORITIES, DEFAULT_PRIORITY, DEFAULT_STATUS, DEFAULT_SOURCE, FOCUS_DELAY_MS } from "@/constants/dropdownOptions";
import { SuggestionType, SuggestionPriority } from "@/types/suggestion";

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion?: Suggestion; 
}

export function SuggestionModal({ isOpen, onClose, suggestion }: SuggestionModalProps) {
  const isEditing = !!suggestion;
  const { employees, loading: employeesLoading } = useEmployees();
  const [formData, setFormData] = useState({
    employeeId: suggestion?.employeeId || '',
    title: suggestion?.title || '',
    type: suggestion?.type || ('' as SuggestionType | ''),
    description: suggestion?.description || '',
    priority: suggestion?.priority || (DEFAULT_PRIORITY as SuggestionPriority),
    notes: suggestion?.notes || '',
    dueDate: suggestion?.dueDate || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, FOCUS_DELAY_MS);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        
        if (e.key === 'Tab') {
          const modal = modalRef.current;
          if (!modal) return;

          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);
  
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      
      if (suggestion) {
        setFormData({
          ...suggestion,
          title: suggestion.title || '',
          notes: suggestion.notes || '',
          dueDate: suggestion.dueDate || ''
        });
      } else {
        setFormData({
          employeeId: '',
          title: '',
          type: '' as SuggestionType | '',
          description: '',
          priority: DEFAULT_PRIORITY as SuggestionPriority,
          notes: '',
          dueDate: ''
        });
      }
    }
  }, [isOpen, suggestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrors({});
    
    const newErrors: Record<string, string> = {};
    if (!formData.employeeId) newErrors.employeeId = 'Please select an employee';
    if (!formData.title) newErrors.title = 'Please enter a title';
    if (!formData.type) newErrors.type = 'Please select a type';
    if (!formData.description) newErrors.description = 'Please enter a description';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const suggestionData = {
        employeeId: formData.employeeId,
        title: formData.title,
        type: formData.type as SuggestionType,
        description: formData.description,
        priority: formData.priority,
        notes: formData.notes,
        ...(formData.dueDate && { dueDate: formData.dueDate })
      };

      if (isEditing) {
        await mskService.updateSuggestion(suggestion!.id, {
          ...suggestionData,
          dateUpdated: new Date().toISOString()
        });
      } else {
        await mskService.createSuggestion({
          ...suggestionData,
          status: DEFAULT_STATUS,
          source: DEFAULT_SOURCE
        });
      }

      setFormData({
        employeeId: '',
        title: '',
        type: '',
        description: '',
        priority: DEFAULT_PRIORITY,
        notes: '',
        dueDate: ''
      });
      onClose();
    } catch (error) {
      console.error('Failed to save suggestion:', error);
      setErrors({ submit: `Failed to ${isEditing ? 'update' : 'create'} suggestion. Please try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <Card ref={modalRef} className="w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto">
         <CardHeader>
           <div className="flex justify-between items-center">
             <CardTitle>{isEditing ? 'Edit Suggestion' : 'Create New Suggestion'}</CardTitle>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded"
              aria-label="Close modal"
            >
               <X aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-2">Title *</label>
               <Input
                 ref={firstInputRef}
                 type="text"
                 value={formData.title}
                 onChange={(e) => handleInputChange('title', e.target.value)}
                 placeholder="Brief title for the suggestion..."
                 className={errors.title ? 'border-red-500' : ''}
               />
               {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
             </div>

             <div>
               <label className="block text-sm font-medium mb-2">Employee *</label>
               <select
                 value={formData.employeeId}
                 onChange={(e) => handleInputChange('employeeId', e.target.value)}
                 className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.employeeId ? 'border-red-500' : ''}`}
                 disabled={employeesLoading}
               >
                 <option value="">
                   {employeesLoading ? 'Loading employees...' : 'Select an employee...'}
                 </option>
                 {employees.map(employee => (
                   <option key={employee.id} value={employee.id}>
                     {employee.name} - {employee.department}
                   </option>
                 ))}
               </select>
               {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
             </div>

             <div>
               <label className="block text-sm font-medium mb-2">Type *</label>
               <select
                 value={formData.type}
                 onChange={(e) => handleInputChange('type', e.target.value)}
                 className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.type ? 'border-red-500' : ''}`}
               >
                 <option value="">Select type...</option>
                 {SUGGESTION_TYPES.map(type => (
                   <option key={type.value} value={type.value}>
                     {type.label}
                   </option>
                 ))}
               </select>
               {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
             </div>

             <div>
               <label className="block text-sm font-medium mb-2">Description *</label>
               <textarea
                 value={formData.description}
                 onChange={(e) => handleInputChange('description', e.target.value)}
                 className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] ${errors.description ? 'border-red-500' : ''}`}
                 placeholder="Describe the suggestion..."
               />
               {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
             </div>

             <div>
               <label className="block text-sm font-medium mb-2">Priority</label>
               <select
                 value={formData.priority}
                 onChange={(e) => handleInputChange('priority', e.target.value)}
                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 {PRIORITIES.map(priority => (
                   <option key={priority.value} value={priority.value}>
                     {priority.label}
                   </option>
                 ))}
               </select>
             </div>

            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Input
                type="text"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes (optional)"
              />
            </div>
          </CardContent>

          {errors.submit && (
            <div className="px-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            </div>
          )}

          <CardFooter className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-input text-foreground rounded-md hover:bg-muted transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
             <button
               type="submit"
               className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
               disabled={isSubmitting}
             >
               {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Suggestion' : 'Create Suggestion')}
             </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
