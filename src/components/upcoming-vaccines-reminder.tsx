'use client';

import React from 'react';
import { Child, Vaccine, VaccineSchedule } from '@/types';
import { Calendar, Bell, ArrowRight } from 'lucide-react';
import { calculateAgeInMonths, isInAgeRange, getEstimatedDueDate } from '@/utils/vaccine-utils';
import Link from 'next/link';

interface UpcomingVaccinesReminderProps {
  child: Child;
  vaccines: Vaccine[];
  vaccineSchedule: VaccineSchedule;
}

export function UpcomingVaccinesReminder({
  child,
  vaccines,
  vaccineSchedule
}: UpcomingVaccinesReminderProps) {
  // Get child's age in months
  const childAgeInMonths = calculateAgeInMonths(child.dateOfBirth);
  
  // Find upcoming vaccines (due in the next 3 months)
  const upcomingVaccines = getUpcomingVaccines(child, vaccines, vaccineSchedule, 3);
  
  // Format a date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate days until a date
  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const timeDiff = targetDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  
  if (upcomingVaccines.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-3">
        <Bell className="w-5 h-5 text-blue-400 mr-2" />
        <h3 className="font-medium">Upcoming Vaccine Reminders</h3>
      </div>
      
      <div className="space-y-2">
        {upcomingVaccines.slice(0, 3).map((item, index) => {
          const daysUntil = getDaysUntil(item.dueDate);
          const isOverdue = daysUntil < 0;
          
          return (
            <div key={index} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{item.vaccine.name}</div>
                <div className="text-xs flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                  <span className={isOverdue ? 'text-red-400' : 'text-gray-400'}>
                    {isOverdue ? 'Overdue since ' : 'Due '} 
                    {formatDate(item.dueDate)}
                  </span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                isOverdue ? 'bg-red-900/30 text-red-300' : 'bg-blue-900/30 text-blue-300'
              }`}>
                {isOverdue 
                  ? `${Math.abs(daysUntil)} days overdue` 
                  : daysUntil === 0
                    ? 'Due today!'
                    : `${daysUntil} days left`
                }
              </div>
            </div>
          );
        })}
      </div>
      
      {upcomingVaccines.length > 3 && (
        <div className="text-xs text-gray-400 mt-2">
          + {upcomingVaccines.length - 3} more upcoming vaccines
        </div>
      )}
      
      <Link 
        href={`/vaccines/record?childId=${child.id}`}
        className="flex items-center justify-center text-sm text-blue-400 mt-3 hover:text-blue-300"
      >
        <span>View all vaccine records</span>
        <ArrowRight className="w-3 h-3 ml-1" />
      </Link>
    </div>
  );
}

// Helper function to get upcoming vaccines within a time window
function getUpcomingVaccines(
  child: Child,
  vaccines: Vaccine[],
  vaccineSchedule: VaccineSchedule,
  monthsWindow: number
): Array<{
  vaccine: Vaccine;
  dueDate: string;
}> {
  const childAgeInMonths = calculateAgeInMonths(child.dateOfBirth);
  const targetAgeMonths = childAgeInMonths + monthsWindow;
  
  // Get all administered vaccines
  const administeredVaccines = new Map<string, number>();
  child.vaccineHistory.forEach(dose => {
    const count = administeredVaccines.get(dose.vaccineId) || 0;
    administeredVaccines.set(dose.vaccineId, count + 1);
  });
  
  const upcomingVaccines: Array<{
    vaccine: Vaccine;
    dueDate: string;
  }> = [];
  
  // Check each age group in the schedule
  vaccineSchedule.recommendedVaccines.forEach(scheduleItem => {
    // Parse the min age in months for this schedule item
    const minAgeMonths = getMinAgeInMonths(scheduleItem.ageRange);
    
    // Only include if it falls within our window
    if (minAgeMonths >= childAgeInMonths && minAgeMonths <= targetAgeMonths) {
      // Check each vaccine in this age group
      scheduleItem.vaccines.forEach(vaccineId => {
        const vaccine = vaccines.find(v => v.id === vaccineId);
        if (!vaccine) return;
        
        const administeredDoses = administeredVaccines.get(vaccineId) || 0;
        // If not fully vaccinated, add to upcoming
        if (administeredDoses < vaccine.doseCount) {
          upcomingVaccines.push({
            vaccine,
            dueDate: getEstimatedDueDate(child.dateOfBirth, scheduleItem.ageRange)
          });
        }
      });
    }
  });
  
  // Sort by due date (earliest first)
  return upcomingVaccines.sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}

// Helper function to get minimum age in months from an age range
function getMinAgeInMonths(ageRange: string): number {
  if (ageRange === 'At birth') {
    return 0;
  }
  
  if (ageRange.includes('weeks')) {
    const weeks = parseInt(ageRange.split(' ')[0]);
    return weeks / 4.33; // Approximate weeks to months
  }
  
  if (ageRange.includes('-')) {
    const start = ageRange.split('-')[0].trim();
    
    if (start.includes('months')) {
      return parseInt(start);
    }
    
    if (start.includes('years') || !start.includes(' ')) {
      return parseInt(start) * 12;
    }
  }
  
  if (ageRange.includes('months')) {
    return parseInt(ageRange.split(' ')[0]);
  }
  
  if (ageRange.includes('years')) {
    return parseInt(ageRange) * 12;
  }
  
  return 0;
} 