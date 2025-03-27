import React from 'react';
import { SurgicalSchedule, Procedure } from '@/types';
import { CheckCircle2, Clock, Info } from 'lucide-react';

interface CompactSurgicalScheduleProps {
  surgicalSchedule: SurgicalSchedule;
  procedures: Procedure[];
}

export function CompactSurgicalSchedule({ surgicalSchedule, procedures }: CompactSurgicalScheduleProps) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3">Standard Procedures by Category</h3>
        
        <div className="space-y-3">
          {/* Group procedures by category */}
          {Object.entries(
            procedures.reduce((acc, curr) => {
              acc[curr.category] = acc[curr.category] || [];
              acc[curr.category].push(curr);
              return acc;
            }, {} as Record<string, Procedure[]>)
          ).map(([category, categoryProcedures]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">{category}</h4>
              
              {categoryProcedures.map(procedure => {
                const scheduleItem = surgicalSchedule.procedures.find(
                  p => p.procedureId === procedure.id
                );
                
                return (
                  <div 
                    key={procedure.id} 
                    className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center">
                      {scheduleItem?.recommended ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                      )}
                      <span className="text-sm">{procedure.name}</span>
                    </div>
                    <button className="p-1 text-gray-500 hover:text-blue-400">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-blue-400 mr-1" />
            <span className="text-xs text-gray-300">Recommended</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-300">Optional</span>
          </div>
        </div>
      </div>
    </div>
  );
} 