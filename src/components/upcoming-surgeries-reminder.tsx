import React from 'react';
import { Patient } from '@/types';
import { Calendar, Clock, User, MapPin } from 'lucide-react';

interface UpcomingSurgeriesReminderProps {
  patients: Patient[];
}

export function UpcomingSurgeriesReminder({ patients }: UpcomingSurgeriesReminderProps) {
  // Filter to get only scheduled procedures
  const upcomingProcedures = patients.flatMap(patient => 
    patient.procedureHistory
      .filter(proc => proc.status === 'Scheduled' && proc.dateScheduled)
      .map(proc => ({
        ...proc,
        patientName: patient.name,
        patientId: patient.id
      }))
  );
  
  // Sort by date
  upcomingProcedures.sort((a, b) => {
    if (!a.dateScheduled || !b.dateScheduled) return 0;
    return new Date(a.dateScheduled).getTime() - new Date(b.dateScheduled).getTime();
  });
  
  // Take only the next 5
  const nextProcedures = upcomingProcedures.slice(0, 5);
  
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3">Upcoming Procedures</h3>
        
        {nextProcedures.length > 0 ? (
          <div className="space-y-3">
            {nextProcedures.map((procedure) => (
              <div 
                key={procedure.id} 
                className="p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{procedure.notes?.split(',')[0] || 'Scheduled Procedure'}</h4>
                  <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded-full">
                    {procedure.status}
                  </span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-gray-400">
                    <User className="w-3.5 h-3.5 mr-2 text-gray-500" />
                    <span>{procedure.patientName}</span>
                  </div>
                  
                  {procedure.dateScheduled && (
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-gray-500" />
                      <span>{new Date(procedure.dateScheduled).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {procedure.surgeon && (
                    <div className="flex items-center text-sm text-gray-400">
                      <User className="w-3.5 h-3.5 mr-2 text-gray-500" />
                      <span>{procedure.surgeon}</span>
                    </div>
                  )}
                  
                  {procedure.location && (
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-gray-500" />
                      <span>{procedure.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No upcoming procedures scheduled</p>
        )}
      </div>
      
      {nextProcedures.length > 0 && (
        <div className="p-3 bg-gray-800 border-t border-gray-700">
          <button className="text-sm text-blue-400 w-full text-center">
            View All Scheduled Procedures
          </button>
        </div>
      )}
    </div>
  );
} 