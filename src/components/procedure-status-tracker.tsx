import React from 'react';
import { Patient, Procedure } from '@/types';
import { CheckCircle2, Clock, AlertCircle, Calendar, XCircle } from 'lucide-react';

interface ProcedureStatusTrackerProps {
  patient: Patient;
  procedures: Procedure[];
  onProcedureUpdate: (procedureId: string, status: 'Scheduled' | 'Completed' | 'Cancelled', date?: string) => void;
}

export function ProcedureStatusTracker({ 
  patient, 
  procedures,
  onProcedureUpdate
}: ProcedureStatusTrackerProps) {
  const procedureHistory = patient.procedureHistory;
  
  // Helper function to get procedure status
  const getProcedureStatus = (procedureId: string) => {
    const historyItem = procedureHistory.find(item => item.procedureId === procedureId);
    return historyItem ? historyItem.status : 'Not Started';
  };
  
  // Helper function to get procedure date
  const getProcedureDate = (procedureId: string) => {
    const historyItem = procedureHistory.find(item => item.procedureId === procedureId);
    return historyItem ? (historyItem.datePerformed || historyItem.dateScheduled) : undefined;
  };
  
  // Group procedures by category
  const proceduresByCategory = procedures.reduce((acc, curr) => {
    acc[curr.category] = acc[curr.category] || [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, Procedure[]>);
  
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3">Procedure Status</h3>
        
        <div className="space-y-4">
          {Object.entries(proceduresByCategory).map(([category, categoryProcedures]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">{category}</h4>
              
              {categoryProcedures.map(procedure => {
                const status = getProcedureStatus(procedure.id);
                const date = getProcedureDate(procedure.id);
                
                return (
                  <div 
                    key={procedure.id} 
                    className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center">
                      {status === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      ) : status === 'Scheduled' ? (
                        <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                      ) : status === 'Cancelled' ? (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                      )}
                      <span className="text-sm">{procedure.name}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {date && (
                        <span className="text-xs text-gray-500 mr-2">
                          {new Date(date).toLocaleDateString()}
                        </span>
                      )}
                      <div className="relative group">
                        <button className="p-1 text-gray-500 hover:text-blue-400">
                          <AlertCircle className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-2 z-10 hidden group-hover:block">
                          <div className="flex flex-col gap-1">
                            <button 
                              onClick={() => onProcedureUpdate(procedure.id, 'Scheduled', new Date().toISOString())}
                              className="text-xs text-left px-2 py-1 hover:bg-gray-800 rounded flex items-center"
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              Schedule
                            </button>
                            <button 
                              onClick={() => onProcedureUpdate(procedure.id, 'Completed', new Date().toISOString())}
                              className="text-xs text-left px-2 py-1 hover:bg-gray-800 rounded flex items-center"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Mark Completed
                            </button>
                            <button 
                              onClick={() => onProcedureUpdate(procedure.id, 'Cancelled')}
                              className="text-xs text-left px-2 py-1 hover:bg-gray-800 rounded flex items-center"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 bg-gray-800 border-t border-gray-700 flex justify-between">
        <div className="flex items-center">
          <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-xs text-gray-300">Completed</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-blue-500 mr-1" />
          <span className="text-xs text-gray-300">Scheduled</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-gray-500 mr-1" />
          <span className="text-xs text-gray-300">Not Started</span>
        </div>
        <div className="flex items-center">
          <XCircle className="w-4 h-4 text-red-500 mr-1" />
          <span className="text-xs text-gray-300">Cancelled</span>
        </div>
      </div>
    </div>
  );
} 