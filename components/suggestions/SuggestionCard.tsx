import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Suggestion } from "@/data/suggestions/suggestions";
import { Employee } from "@/data/employees/employees";
import { getStatusColor, formatText, getHighMediumLowColor, getPriorityColor } from "./suggestion-utils";
import { mskService } from "@/data/suggestions/suggestions";
import { STATUSES, PRIORITIES } from "@/constants/dropdownOptions";
import { SuggestionPriority, SuggestionStatus } from "@/types/suggestion";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onEdit?: (suggestion: Suggestion) => void;
  getEmployeeById?: (id: string) => Employee | undefined;
}

export function SuggestionCard({ suggestion, onEdit, getEmployeeById }: SuggestionCardProps) {
  const employee = getEmployeeById ? getEmployeeById(suggestion.employeeId) : undefined;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: SuggestionStatus) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await mskService.updateSuggestion(suggestion.id, {
        status: newStatus,
        ...(newStatus === 'completed' && { dateCompleted: new Date().toISOString() })
      });
    } catch (error) {
      console.error('Failed to update suggestion status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriorityChange = async (newPriority: SuggestionPriority) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await mskService.updateSuggestion(suggestion.id, {
        priority: newPriority
      });
    } catch (error) {
      console.error('Failed to update suggestion priority:', error);
      setError('Failed to update priority. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isLoading) return;
    
    if (confirm('Are you sure you want to delete this suggestion?')) {
      try {
        setIsLoading(true);
        setError(null);
        await mskService.deleteSuggestion(suggestion.id);
      } catch (error) {
        console.error('Failed to delete suggestion:', error);
        setError('Failed to delete suggestion. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="capitalize">
            {suggestion.title}
          </CardTitle>
          <div className="flex gap-2">

            <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(suggestion.status)}`}>
              {formatText(suggestion.status)}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger 
                className="p-1 hover:bg-muted rounded disabled:opacity-50"
                disabled={isLoading}
              >
                <MoreVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {STATUSES.map(status => (
                      <DropdownMenuItem 
                        key={status.value} 
                        onClick={() => handleStatusChange(status.value)}
                      >
                        {status.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Change Priority</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {PRIORITIES.map(priority => (
                      <DropdownMenuItem 
                        key={priority.value} 
                        onClick={() => handlePriorityChange(priority.value)}
                      >
                        {priority.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(suggestion)}>
                    Edit Suggestion
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete Suggestion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>
          <div className="flex flex-col gap-1">
            <div className="font-medium">{employee?.name || 'Unknown Employee'}</div>
            <div className="text-xs">
              <p>
                Department: {employee?.department}
              </p>
              <p>
                Risk: <span className={`font-medium ${getHighMediumLowColor(employee?.riskLevel)}`}>{formatText(employee?.riskLevel)}</span>
              </p>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-blue-700 text-sm">Updating...</p>
            </div>
          </div>
        )}
        <div className="p-2 rounded ">
          <p className="mb-3 text-sm">
            {suggestion.description}
          </p>
          <div className="text-xs space-y-1">
          <p>
            Type: {<span>{formatText(suggestion.type)}</span>}
          </p>
          <p>
            Priority: {<span className={`px-1.5 py-0.5 text-xs rounded-full ${getPriorityColor(suggestion.priority)}`}>{formatText(suggestion.priority)}</span>}
          </p>
          </div>
        </div>
        {suggestion.notes && (
          <div className="bg-muted p-2 rounded text-xs">
            <strong>Notes:</strong> {suggestion.notes}
          </div>

        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex flex-col gap-1">
          <div>Created: {new Date(suggestion.dateCreated).toLocaleDateString()}</div>
          <div className="flex items-center gap-2">
            Updated: {new Date(suggestion.dateUpdated).toLocaleDateString()}
            {suggestion.dateCreated !== suggestion.dateUpdated && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                Edited
              </span>
            )}
          </div>
          {suggestion.dueDate && (
            <div>
              Due: {new Date(suggestion.dueDate).toLocaleDateString()}
            </div>
          )}
          <div>Source: {suggestion.source}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
