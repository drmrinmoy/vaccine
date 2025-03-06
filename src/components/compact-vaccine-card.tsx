'use client';

import React from 'react';
import { Child, Vaccine, VaccineDose } from '@/types';
import { CheckCircle, Clock, AlertTriangle, Shield, Calendar } from 'lucide-react';

interface CompactVaccineCardProps {
  child: Child;
  vaccine: Vaccine;
  dueDate?: string;
  status: 'completed' | 'due' | 'overdue' | 'upcoming';
  onClick?: () => void;
}

export function CompactVaccineCard({ 
  child, 
  vaccine, 
  dueDate, 
  status,
  onClick 
}: CompactVaccineCardProps) {
  // Get the administered doses for this vaccine
  const administeredDoses = child.vaccineHistory.filter(
    dose => dose.vaccineId === vaccine.id
  );
  
  // Calculate remaining doses
  const remainingDoses = vaccine.doseCount - administeredDoses.length;
  
  // Format the due date if provided
  const formattedDueDate = dueDate 
    ? new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : '';

  // Status colors and icons
  const statusConfig = {
    completed: {
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700',
      textColor: 'text-green-400',
      label: 'Done'
    },
    due: {
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700',
      textColor: 'text-yellow-400',
      label: 'Due'
    },
    overdue: {
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-700',
      textColor: 'text-red-400',
      label: 'Late'
    },
    upcoming: {
      icon: <Calendar className="w-4 h-4 text-blue-500" />,
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700',
      textColor: 'text-blue-400',
      label: 'Soon'
    }
  };

  const { icon, bgColor, borderColor, textColor, label } = statusConfig[status];

  // Create dose indicators
  const doseIndicators = [];
  for (let i = 0; i < vaccine.doseCount; i++) {
    const isDoseGiven = i < administeredDoses.length;
    doseIndicators.push(
      <div 
        key={i} 
        className={`w-2 h-2 rounded-full ${isDoseGiven ? 'bg-green-500' : 'bg-gray-700'}`}
      />
    );
  }

  return (
    <div 
      className={`rounded-lg overflow-hidden border ${borderColor} transition-colors cursor-pointer ${bgColor} hover:bg-opacity-30`}
      onClick={onClick}
    >
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <Shield className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-sm">{vaccine.name}</h3>
              <span className={`ml-1.5 text-xs ${textColor}`}>
                {label}
              </span>
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              {doseIndicators}
            </div>
          </div>
        </div>
        
        {dueDate && status !== 'completed' && (
          <div className="text-xs text-gray-400 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formattedDueDate}
          </div>
        )}
      </div>
    </div>
  );
} 