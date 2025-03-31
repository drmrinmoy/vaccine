'use client';

import React from 'react';
import { Child, Vaccine } from '@/types';
import { Clock, AlertCircle } from 'lucide-react';
import { calculateAgeInMonths, getVaccineRecommendations } from '@/utils/vaccine-utils';

interface PendingVaccinesSummaryProps {
  child: Child;
  vaccines: Vaccine[];
  vaccineSchedule: {
    id: string;
    name: string;
    description: string;
    recommendedVaccines: {
      ageRange: string;
      vaccines: string[];
    }[];
  };
}

export function PendingVaccinesSummary({ child, vaccines, vaccineSchedule }: PendingVaccinesSummaryProps) {
  // Get vaccine recommendations
  const recommendations = getVaccineRecommendations(child, vaccines, vaccineSchedule);
  
  // Filter to get only due and overdue vaccines
  const pendingVaccines = recommendations.filter(
    rec => rec.status === 'due' || rec.status === 'overdue'
  );
  
  // Calculate the child's age in months
  const ageInMonths = calculateAgeInMonths(child.dateOfBirth);
  
  if (pendingVaccines.length === 0) {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-green-400 mb-2">
          <Clock className="h-5 w-5" />
          <h3 className="font-medium">Vaccinations Up-to-Date</h3>
        </div>
        <p className="text-sm text-gray-300">
          Great job! {child.name} is up-to-date with all recommended vaccinations for their age.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 text-amber-400 mb-2">
        <AlertCircle className="h-5 w-5" />
        <h3 className="font-medium">Pending Vaccinations</h3>
      </div>
      
      <p className="text-sm text-gray-300 mb-3">
        {child.name} has {pendingVaccines.length} pending vaccination{pendingVaccines.length > 1 ? 's' : ''} based on their age ({Math.floor(ageInMonths)} months).
      </p>
      
      <ul className="space-y-2 text-sm">
        {pendingVaccines.map(vaccine => (
          <li key={vaccine.vaccine.id} className="flex items-start gap-2">
            <div className={`mt-0.5 h-2 w-2 rounded-full ${vaccine.status === 'overdue' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
            <div>
              <span className="font-medium">{vaccine.vaccine.name}</span>
              <span className="text-gray-400"> - {vaccine.vaccine.diseases.join(', ')}</span>
              {vaccine.status === 'overdue' && (
                <span className="text-red-400 block text-xs">Overdue</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 