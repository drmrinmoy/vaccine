'use client';

import React, { useState, useMemo } from 'react';
import { Child, Vaccine, VaccineDose, VaccineSchedule } from '@/types';
import { Check, X, AlertCircle, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { calculateAgeInMonths, isInAgeRange, getEstimatedDueDate } from '@/utils/vaccine-utils';
import Link from 'next/link';

interface VaccineStatusTrackerProps {
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
  onUpdateVaccineStatus: (updates: VaccineDose[]) => void;
}

export function VaccineStatusTracker({ 
  child, 
  vaccines, 
  vaccineSchedule,
  onUpdateVaccineStatus 
}: VaccineStatusTrackerProps) {
  const [expandedAgeGroup, setExpandedAgeGroup] = useState<string | null>(null);
  const [vaccineUpdates, setVaccineUpdates] = useState<Record<string, VaccineDose[]>>({});
  const [activeAgeGroup, setActiveAgeGroup] = useState<string>('all');
  
  // Get child's age in months
  const childAgeInMonths = calculateAgeInMonths(child.dateOfBirth);
  
  // Group vaccines by age range from schedule
  const scheduleByAge = vaccineSchedule.recommendedVaccines.map(scheduleItem => {
    // Determine if this age group is appropriate for the child's current age
    const ageGroupMinMonths = getMinAgeInMonths(scheduleItem.ageRange);
    const ageGroupMaxMonths = getMaxAgeInMonths(scheduleItem.ageRange);
    const isAgeAppropriate = childAgeInMonths >= ageGroupMinMonths;
    const isPastAgeGroup = childAgeInMonths > ageGroupMaxMonths + 3; // Give a 3-month grace period
    
    const ageVaccines = scheduleItem.vaccines.map(vaccineId => {
      const vaccine = vaccines.find(v => v.id === vaccineId);
      if (!vaccine) return null;
      
      // Check if this vaccine has been administered to the child
      const administeredDoses = child.vaccineHistory.filter(
        dose => dose.vaccineId === vaccineId
      );
      
      // Calculate status
      let status: 'completed' | 'partially' | 'pending' | 'upcoming' = 'pending';
      if (administeredDoses.length >= vaccine.doseCount) {
        status = 'completed';
      } else if (administeredDoses.length > 0) {
        status = 'partially';
      } else if (!isAgeAppropriate) {
        status = 'upcoming';
      }
      
      // Calculate the probable date for the next dose
      const probableDate = getEstimatedDueDate(child.dateOfBirth, scheduleItem.ageRange);
      
      return {
        vaccine,
        status,
        administeredDoses: administeredDoses.length,
        totalDoses: vaccine.doseCount,
        isAgeAppropriate,
        isPastAgeGroup,
        probableDate
      };
    }).filter(Boolean);
    
    return {
      ageRange: scheduleItem.ageRange,
      vaccines: ageVaccines,
      isAgeAppropriate,
      isPastAgeGroup
    };
  });
  
  // Calculate completion status for each age group
  const getAgeGroupStatus = (ageGroup: any) => {
    const totalVaccines = ageGroup.vaccines.length;
    const completedVaccines = ageGroup.vaccines.filter((v: any) => v.status === 'completed').length;
    const partiallyVaccines = ageGroup.vaccines.filter((v: any) => v.status === 'partially').length;
    
    if (!ageGroup.isAgeAppropriate) {
      return 'upcoming';
    } else if (completedVaccines === totalVaccines) {
      return 'completed';
    } else if (completedVaccines > 0 || partiallyVaccines > 0) {
      return 'partially';
    } else if (ageGroup.isPastAgeGroup) {
      return 'overdue';
    } else {
      return 'pending';
    }
  };
  
  // Handle toggle for expanding an age group
  const toggleAgeGroup = (ageRange: string) => {
    setExpandedAgeGroup(expandedAgeGroup === ageRange ? null : ageRange);
    
    // Initialize vaccine updates for this age group if not already done
    if (!vaccineUpdates[ageRange]) {
      const updates: Record<string, VaccineDose[]> = { ...vaccineUpdates };
      updates[ageRange] = [];
      setVaccineUpdates(updates);
    }
  };
  
  // Mark all vaccines in an age group as completed at once
  const completeAgeGroup = (ageGroup: any) => {
    if (!ageGroup.isAgeAppropriate) return; // Don't allow for age groups not yet reached
    
    const today = new Date().toISOString().split('T')[0];
    const updates: VaccineDose[] = [];
    
    // Process each vaccine in the age group
    ageGroup.vaccines.forEach((vaccineItem: any) => {
      // Only add updates for vaccines not already completed
      if (vaccineItem.status !== 'completed' && vaccineItem.isAgeAppropriate) {
        const remainingDoses = vaccineItem.totalDoses - vaccineItem.administeredDoses;
        
        // Add all missing doses
        for (let i = vaccineItem.administeredDoses + 1; i <= vaccineItem.totalDoses; i++) {
          updates.push({
            id: `temp-${vaccineItem.vaccine.id}-${i}`,
            vaccineId: vaccineItem.vaccine.id,
            doseNumber: i,
            dateAdministered: today,
            administeredBy: 'Quick Entry',
            notes: `Completed via age group quick entry (${ageGroup.ageRange})`
          });
        }
      }
    });
    
    // Update state with new doses to be added
    if (updates.length > 0) {
      onUpdateVaccineStatus(updates);
    }
  };
  
  // Handle vaccine status change
  const handleVaccineStatusChange = (
    vaccineId: string, 
    currentDoses: number,
    totalDoses: number,
    newStatus: 'completed' | 'partially' | 'pending',
    isAgeAppropriate: boolean
  ) => {
    // Don't allow status changes for vaccines not age-appropriate
    if (!isAgeAppropriate && newStatus !== 'pending') {
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const updates: VaccineDose[] = [];
    
    if (newStatus === 'completed' && currentDoses < totalDoses) {
      // Add all missing doses
      for (let i = currentDoses + 1; i <= totalDoses; i++) {
        updates.push({
          id: `temp-${vaccineId}-${i}`,
          vaccineId,
          doseNumber: i,
          dateAdministered: today,
          administeredBy: 'Quick Entry'
        });
      }
    } else if (newStatus === 'partially' && currentDoses === 0) {
      // Add first dose
      updates.push({
        id: `temp-${vaccineId}-1`,
        vaccineId,
        doseNumber: 1,
        dateAdministered: today,
        administeredBy: 'Quick Entry'
      });
    }
    
    // If going from completed/partially to pending, we don't add any dose
    // This would require removing doses, which is handled separately
    
    // Update state with new doses to be added
    if (updates.length > 0) {
      onUpdateVaccineStatus(updates);
    }
  };
  
  // Format a date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Save all updates
  const saveAllUpdates = () => {
    const allUpdates: VaccineDose[] = [];
    
    // Collect all updates from all age groups
    Object.values(vaccineUpdates).forEach(ageGroupUpdates => {
      allUpdates.push(...ageGroupUpdates);
    });
    
    // Call the parent handler
    if (allUpdates.length > 0) {
      onUpdateVaccineStatus(allUpdates);
      setVaccineUpdates({});
    }
  };

  // Render a status indicator
  const renderStatusIndicator = (status: 'completed' | 'partially' | 'pending' | 'upcoming' | 'overdue') => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900 text-green-300">
            <Check className="w-3 h-3 mr-1" />
            Complete
          </span>
        );
      case 'partially':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900 text-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Partial
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300">
            <Clock className="w-3 h-3 mr-1" />
            Overdue
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-300">
            <Calendar className="w-3 h-3 mr-1" />
            Upcoming
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-300">
            <X className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden bg-gray-950 shadow-sm">
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Vaccine Status</h3>
            <p className="text-sm text-gray-400">Track and update vaccination status</p>
          </div>
          <Link 
            href={`/vaccines/quick-complete?childId=${child.id}`}
            className="flex items-center gap-1 text-sm px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Quick Complete</span>
          </Link>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Vaccine Status by Age Group</h3>
        
        {/* Age group accordions */}
        <div className="space-y-3">
          {scheduleByAge.map((ageGroup, index) => {
            const groupStatus = getAgeGroupStatus(ageGroup);
            
            return (
              <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
                {/* Age group header */}
                <div
                  className={`w-full flex justify-between items-center p-3 ${
                    groupStatus === 'completed' 
                      ? 'bg-green-900/20' 
                      : groupStatus === 'partially' 
                        ? 'bg-yellow-900/20' 
                        : groupStatus === 'overdue'
                          ? 'bg-red-900/20'
                          : groupStatus === 'upcoming'
                            ? 'bg-blue-900/20'
                            : 'bg-gray-900'
                  }`}
                >
                  <button
                    className="flex-1 flex items-center text-left"
                    onClick={() => toggleAgeGroup(ageGroup.ageRange)}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{ageGroup.ageRange}</span>
                      <span className="ml-2 text-xs text-gray-400">
                        ({ageGroup.vaccines.length} vaccines)
                      </span>
                    </div>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {/* Quick complete button for age-appropriate groups */}
                    {ageGroup.isAgeAppropriate && groupStatus !== 'completed' && (
                      <button
                        onClick={() => completeAgeGroup(ageGroup)}
                        className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs mr-2"
                        title="Mark all vaccines in this age group as completed"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Complete All</span>
                      </button>
                    )}
                    
                    {renderStatusIndicator(groupStatus)}
                    <svg 
                      className={`h-5 w-5 transform ${expandedAgeGroup === ageGroup.ageRange ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Age group content (vaccines) */}
                {expandedAgeGroup === ageGroup.ageRange && (
                  <div className="p-3 bg-gray-900">
                    {/* Action buttons for this age group */}
                    {ageGroup.isAgeAppropriate && (
                      <div className="mb-3 flex justify-end">
                        <button
                          onClick={() => completeAgeGroup(ageGroup)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded bg-green-600 hover:bg-green-500 text-white text-sm ${
                            groupStatus === 'completed' ? 'opacity-50' : ''
                          }`}
                          disabled={groupStatus === 'completed'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark All Vaccines as Complete</span>
                        </button>
                      </div>
                    )}
                    
                    {/* Vaccine list */}
                    <div className="space-y-3">
                      {ageGroup.vaccines.map((vaccineItem: any, vIndex: number) => (
                        <div 
                          key={vIndex} 
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            !vaccineItem.isAgeAppropriate 
                              ? 'bg-gray-850 opacity-70'
                              : 'bg-gray-800'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{vaccineItem.vaccine.name}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              Doses: {vaccineItem.administeredDoses}/{vaccineItem.totalDoses}
                            </div>
                            
                            {!vaccineItem.isAgeAppropriate && (
                              <div className="text-xs text-blue-400 mt-1 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Recommended date: {formatDate(vaccineItem.probableDate)}
                              </div>
                            )}
                            
                            {vaccineItem.isPastAgeGroup && vaccineItem.status !== 'completed' && (
                              <div className="text-xs text-red-400 mt-1">
                                Overdue! Recommended for {ageGroup.ageRange}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Quick status change buttons */}
                            <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                              <button
                                className={`px-2 py-1 text-xs ${
                                  vaccineItem.status === 'pending' 
                                    ? 'bg-gray-700 text-white' 
                                    : 'bg-gray-800 text-gray-400'
                                }`}
                                onClick={() => handleVaccineStatusChange(
                                  vaccineItem.vaccine.id, 
                                  vaccineItem.administeredDoses,
                                  vaccineItem.totalDoses,
                                  'pending',
                                  vaccineItem.isAgeAppropriate
                                )}
                                title="Mark as pending/not given"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              
                              <button
                                className={`px-2 py-1 text-xs ${
                                  vaccineItem.status === 'partially' 
                                    ? 'bg-yellow-700 text-white' 
                                    : 'bg-gray-800 text-gray-400'
                                }`}
                                onClick={() => handleVaccineStatusChange(
                                  vaccineItem.vaccine.id, 
                                  vaccineItem.administeredDoses,
                                  vaccineItem.totalDoses,
                                  'partially',
                                  vaccineItem.isAgeAppropriate
                                )}
                                title="Mark as partially complete"
                                disabled={vaccineItem.totalDoses === 1 || !vaccineItem.isAgeAppropriate}
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                              
                              <button
                                className={`px-2 py-1 text-xs ${
                                  vaccineItem.status === 'completed' 
                                    ? 'bg-green-700 text-white' 
                                    : 'bg-gray-800 text-gray-400'
                                }`}
                                onClick={() => handleVaccineStatusChange(
                                  vaccineItem.vaccine.id, 
                                  vaccineItem.administeredDoses,
                                  vaccineItem.totalDoses,
                                  'completed',
                                  vaccineItem.isAgeAppropriate
                                )}
                                title="Mark as complete"
                                disabled={!vaccineItem.isAgeAppropriate}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-start gap-3 text-xs text-gray-400 mt-4 p-3 bg-gray-900 rounded-lg">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-green-700 rounded-full mr-1"></span>
            Complete
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-yellow-700 rounded-full mr-1"></span>
            Partial
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-red-700 rounded-full mr-1"></span>
            Overdue
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-700 rounded-full mr-1"></span>
            Upcoming
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-gray-700 rounded-full mr-1"></span>
            Pending
          </div>
        </div>
        
        <div className="text-xs text-gray-400 mt-1">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Click on an age group to expand and quickly update vaccine status. Upcoming vaccines will be available when your child reaches the appropriate age.
        </div>
      </div>
    </div>
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

// Helper function to get maximum age in months from an age range
function getMaxAgeInMonths(ageRange: string): number {
  if (ageRange === 'At birth') {
    return 1; // 1 month
  }
  
  if (ageRange.includes('weeks')) {
    const weeks = parseInt(ageRange.split(' ')[0]);
    return weeks / 4.33; // Approximate weeks to months
  }
  
  if (ageRange.includes('-')) {
    const end = ageRange.split('-')[1].trim();
    
    if (end.includes('months')) {
      return parseInt(end);
    }
    
    if (end.includes('years') || !end.includes(' ')) {
      return parseInt(end) * 12;
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