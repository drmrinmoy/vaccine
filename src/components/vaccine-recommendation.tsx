'use client';

import React from 'react';
import { Child, Vaccine, VaccineDose } from '@/types';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface VaccineRecommendationProps {
  child: Child;
  vaccine: Vaccine;
  dueDate?: string;
  status: 'completed' | 'due' | 'overdue' | 'upcoming';
  onClick?: () => void;
}

export function VaccineRecommendation({ 
  child, 
  vaccine, 
  dueDate, 
  status,
  onClick 
}: VaccineRecommendationProps) {
  // Get the administered doses for this vaccine
  const administeredDoses = child.vaccineHistory.filter(
    dose => dose.vaccineId === vaccine.id
  );
  
  // Calculate remaining doses
  const remainingDoses = vaccine.doseCount - administeredDoses.length;
  
  // Format the due date if provided
  const formattedDueDate = dueDate 
    ? new Date(dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  // Status colors and icons
  const statusConfig = {
    completed: {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      bgColor: 'bg-green-900/30',
      textColor: 'text-green-300',
      label: 'Completed'
    },
    due: {
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      bgColor: 'bg-yellow-900/30',
      textColor: 'text-yellow-300',
      label: 'Due Now'
    },
    overdue: {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      bgColor: 'bg-red-900/30',
      textColor: 'text-red-300',
      label: 'Overdue'
    },
    upcoming: {
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      bgColor: 'bg-blue-900/30',
      textColor: 'text-blue-300',
      label: 'Upcoming'
    }
  };

  const { icon, bgColor, textColor, label } = statusConfig[status];

  return (
    <div 
      className={`rounded-lg overflow-hidden border border-gray-800 transition-colors cursor-pointer ${bgColor}`}
      onClick={onClick}
    >
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <h3 className="font-semibold">{vaccine.name}</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
            {label}
          </span>
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2">{vaccine.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {vaccine.diseases.map((disease, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full"
            >
              {disease}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800">
          <div className={textColor}>
            {status === 'completed' 
              ? `All ${vaccine.doseCount} doses completed` 
              : `${remainingDoses} of ${vaccine.doseCount} doses remaining`}
          </div>
          {dueDate && status !== 'completed' && (
            <div className={textColor}>
              {status === 'overdue' ? 'Was due on: ' : 'Due on: '} {formattedDueDate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 