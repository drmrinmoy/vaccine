'use client';

import React, { useState, useEffect } from 'react';
import { Child, Vaccine, VaccineDose } from '@/types';
import { Calendar, Check, Clock, Shield, X, ChevronDown } from 'lucide-react';
import { calculateAgeInMonths, isInAgeRange, getEstimatedDueDate } from '@/utils/vaccine-utils';

interface QuickVaccineEntryProps {
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
  onAddVaccineDoses: (doses: Omit<VaccineDose, 'id'>[]) => void;
}

export function QuickVaccineEntry({
  child,
  vaccines,
  vaccineSchedule,
  onAddVaccineDoses
}: QuickVaccineEntryProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedVaccines, setSelectedVaccines] = useState<Set<string>>(new Set());
  const [administeredBy, setAdministeredBy] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [view, setView] = useState<'due' | 'all'>('due');
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  
  // Get child's age in months for filtering
  const childAgeInMonths = calculateAgeInMonths(child.dateOfBirth);
  
  // Calculate eligible vaccines for the child's age
  const eligibleVaccines = vaccines.filter(vaccine => {
    const isEligibleByAge = vaccine.recommendedAges.some(
      ageRange => isInAgeRange(childAgeInMonths, ageRange)
    );
    
    // Check if eligible by catch-up ages
    const isEligibleByCatchup = vaccine.catchupAges?.some(
      ageRange => {
        // Parse age ranges like "Up to X years"
        if (ageRange.toLowerCase().includes('up to')) {
          const maxYears = parseInt(ageRange.match(/\d+/)?.[0] || '0');
          return childAgeInMonths < maxYears * 12;
        }
        return isInAgeRange(childAgeInMonths, ageRange);
      }
    );
    
    return isEligibleByAge || isEligibleByCatchup;
  });
  
  // Map all vaccines with due status for display
  const vaccinesWithStatus = vaccines.map(vaccine => {
    // Check administered doses for this vaccine
    const administeredDoses = child.vaccineHistory.filter(
      dose => dose.vaccineId === vaccine.id
    );
    
    // Calculate remaining doses
    const remainingDoses = Math.max(0, vaccine.doseCount - administeredDoses.length);
    
    // Calculate next dose number
    const nextDoseNumber = administeredDoses.length + 1;
    
    // Check if the vaccine is eligible for the child's age
    const isEligible = eligibleVaccines.some(v => v.id === vaccine.id);
    
    // Calculate status
    let status: 'completed' | 'due' | 'upcoming' | 'overdue' = 'upcoming';
    
    if (remainingDoses === 0) {
      status = 'completed';
    } else if (isEligible) {
      // If eligible by age and not completed, mark as due
      status = 'due';
      
      // If overdue for their age, mark as overdue
      const scheduleItem = vaccineSchedule.recommendedVaccines.find(
        item => item.vaccines.includes(vaccine.id) && 
          isInAgeRange(childAgeInMonths - 3, item.ageRange) && // Give a 3-month grace period
          !isInAgeRange(childAgeInMonths, item.ageRange)
      );
      
      if (scheduleItem) {
        status = 'overdue';
      }
    }
    
    // Calculate probable date
    let probableDate = new Date().toISOString().split('T')[0]; // Today's date by default
    
    // If upcoming, find the recommended age range
    if (status === 'upcoming') {
      const upcomingScheduleItem = vaccineSchedule.recommendedVaccines.find(
        item => item.vaccines.includes(vaccine.id) && 
          !isInAgeRange(childAgeInMonths, item.ageRange)
      );
      
      if (upcomingScheduleItem) {
        probableDate = getEstimatedDueDate(child.dateOfBirth, upcomingScheduleItem.ageRange);
      }
    }
    
    return {
      vaccine,
      status,
      remainingDoses,
      nextDoseNumber,
      isEligible,
      probableDate
    };
  });
  
  // Filter vaccines based on search term and view mode
  const filteredVaccines = vaccinesWithStatus.filter(item => {
    // Match search term
    const matchesSearch = 
      searchTerm === '' ||
      item.vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vaccine.diseases.some(disease => 
        disease.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Filter by view mode
    const matchesView = 
      view === 'all' || 
      (view === 'due' && (item.status === 'due' || item.status === 'overdue'));
    
    return matchesSearch && matchesView;
  });
  
  // Handle vaccine selection toggle
  const toggleVaccineSelection = (vaccineId: string) => {
    const newSelection = new Set(selectedVaccines);
    if (newSelection.has(vaccineId)) {
      newSelection.delete(vaccineId);
    } else {
      newSelection.add(vaccineId);
    }
    setSelectedVaccines(newSelection);
  };
  
  // Handle saving multiple vaccines at once
  const handleSaveSelected = () => {
    if (selectedVaccines.size === 0) return;
    
    const newDoses: Omit<VaccineDose, 'id'>[] = [];
    
    selectedVaccines.forEach(vaccineId => {
      const vaccineInfo = vaccinesWithStatus.find(v => v.vaccine.id === vaccineId);
      if (!vaccineInfo) return;
      
      // Only add if not completed and eligible
      if (vaccineInfo.remainingDoses > 0 && vaccineInfo.isEligible) {
        newDoses.push({
          vaccineId,
          doseNumber: vaccineInfo.nextDoseNumber,
          dateAdministered: selectedDate,
          administeredBy: administeredBy || 'Quick Entry',
          notes: 'Added via quick entry'
        });
      }
    });
    
    if (newDoses.length > 0) {
      onAddVaccineDoses(newDoses);
      setSelectedVaccines(new Set()); // Clear selection after saving
    }
  };
  
  // Format a date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Status indicator component
  const StatusIndicator = ({ status }: { status: 'completed' | 'due' | 'upcoming' | 'overdue' }) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900 text-green-300">
            <Check className="w-3 h-3 mr-1" />
            Complete
          </span>
        );
      case 'due':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-300">
            <Clock className="w-3 h-3 mr-1" />
            Due Now
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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-300">
            <Calendar className="w-3 h-3 mr-1" />
            Upcoming
          </span>
        );
      default:
        return null;
    }
  };
  
  // Group recommended vaccines by age for quick marking
  const ageGroups = vaccineSchedule.recommendedVaccines.map(scheduleItem => {
    const minAgeMonths = getMinAgeInMonths(scheduleItem.ageRange);
    return {
      ageRange: scheduleItem.ageRange,
      minAgeMonths,
      isEligible: childAgeInMonths >= minAgeMonths,
      vaccineIds: scheduleItem.vaccines
    };
  }).sort((a, b) => a.minAgeMonths - b.minAgeMonths);
  
  // Function to mark all vaccines up to a certain age as completed
  const markVaccinesUpToAge = (selectedAgeGroup: string) => {
    // Find the index of the selected age group
    const selectedGroupIndex = ageGroups.findIndex(group => group.ageRange === selectedAgeGroup);
    if (selectedGroupIndex === -1) return;
    
    // Get all eligible vaccine IDs up to and including the selected age group
    const eligibleVaccineIds = new Set<string>();
    
    for (let i = 0; i <= selectedGroupIndex; i++) {
      if (ageGroups[i].isEligible) {
        ageGroups[i].vaccineIds.forEach(id => eligibleVaccineIds.add(id));
      }
    }
    
    // Get the doses that need to be added
    const newDoses: Omit<VaccineDose, 'id'>[] = [];
    
    eligibleVaccineIds.forEach(vaccineId => {
      const vaccine = vaccines.find(v => v.id === vaccineId);
      if (!vaccine) return;
      
      // Get already administered doses for this vaccine
      const administeredDoses = child.vaccineHistory.filter(
        dose => dose.vaccineId === vaccineId
      );
      
      // Calculate remaining doses
      const remainingDoses = Math.max(0, vaccine.doseCount - administeredDoses.length);
      
      // Only add if there are remaining doses
      if (remainingDoses > 0) {
        // Add all remaining doses
        for (let i = administeredDoses.length + 1; i <= vaccine.doseCount; i++) {
          newDoses.push({
            vaccineId,
            doseNumber: i,
            dateAdministered: selectedDate,
            administeredBy: administeredBy || 'Quick Entry',
            notes: `Added via quick age-based entry (${selectedAgeGroup})`
          });
        }
      }
    });
    
    // Save the new doses
    if (newDoses.length > 0) {
      onAddVaccineDoses(newDoses);
      setShowAgeDropdown(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Quick Vaccine Entry</h3>
      
      {/* Common Information */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Administration Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Administered By
            </label>
            <input
              type="text"
              value={administeredBy}
              onChange={(e) => setAdministeredBy(e.target.value)}
              placeholder="Doctor or Clinic Name"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        
        {/* Quick Age-Based Entry */}
        <div className="mt-4">
          <div className="relative">
            <button
              onClick={() => setShowAgeDropdown(!showAgeDropdown)}
              className="w-full flex justify-between items-center px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md"
            >
              <span>Mark All Vaccines Complete Up To Age</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAgeDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showAgeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                <div className="p-2 text-xs text-gray-400">
                  Select an age group to mark all vaccines up to that age as completed:
                </div>
                {ageGroups.map((group, index) => (
                  <button
                    key={index}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                      !group.isEligible ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => group.isEligible && markVaccinesUpToAge(group.ageRange)}
                    disabled={!group.isEligible}
                  >
                    {group.ageRange}
                    {!group.isEligible && ' (Child not yet eligible)'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            This will mark all doses as complete for vaccines recommended up to the selected age.
          </div>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vaccines..."
            className="w-full bg-gray-800 border border-gray-700 rounded-md pl-9 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex">
          <button
            onClick={() => setView('due')}
            className={`px-3 py-2 text-sm rounded-l-md ${
              view === 'due' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Due/Overdue
          </button>
          <button
            onClick={() => setView('all')}
            className={`px-3 py-2 text-sm rounded-r-md ${
              view === 'all' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Vaccines
          </button>
        </div>
      </div>
      
      {/* Vaccine Selection List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filteredVaccines.length > 0 ? (
          filteredVaccines.map((item, index) => (
            <div 
              key={index}
              className={`border border-gray-800 rounded-lg p-3 ${
                item.status === 'overdue' 
                  ? 'bg-red-900/10' 
                  : item.status === 'due' 
                    ? 'bg-blue-900/10' 
                    : item.status === 'completed' 
                      ? 'bg-green-900/10'
                      : 'bg-gray-900'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    <h4 className="font-medium">{item.vaccine.name}</h4>
                    <div className="ml-2">
                      <StatusIndicator status={item.status} />
                    </div>
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-400">
                    {item.vaccine.diseases.join(', ')}
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Doses:</span>
                      <span className={item.remainingDoses === 0 ? 'text-green-400' : ''}> 
                        {item.vaccine.doseCount - item.remainingDoses}/{item.vaccine.doseCount}
                      </span>
                    </div>
                    
                    {item.status === 'upcoming' && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">Probable date:</span>
                        <span>{formatDate(item.probableDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-3 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedVaccines.has(item.vaccine.id)}
                    onChange={() => toggleVaccineSelection(item.vaccine.id)}
                    disabled={item.status === 'completed' || !item.isEligible}
                    className="w-5 h-5 rounded accent-green-600 bg-gray-800 border-gray-700 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No matching vaccines found</p>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setSelectedVaccines(new Set())}
          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
          disabled={selectedVaccines.size === 0}
        >
          Clear Selection
        </button>
        <button
          onClick={handleSaveSelected}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600"
          disabled={selectedVaccines.size === 0}
        >
          Save {selectedVaccines.size} Vaccine{selectedVaccines.size !== 1 ? 's' : ''}
        </button>
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