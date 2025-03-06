'use client';

import React from 'react';
import { Child, Vaccine } from '@/types';
import { CompactVaccineCard } from './compact-vaccine-card';
import { Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CompactVaccineScheduleProps {
  child: Child;
  vaccineRecommendations: Array<{
    vaccine: Vaccine;
    status: 'completed' | 'due' | 'overdue' | 'upcoming';
    dueDate?: string;
  }>;
  maxDisplay?: number;
  showViewAll?: boolean;
}

export function CompactVaccineSchedule({
  child,
  vaccineRecommendations,
  maxDisplay = 6,
  showViewAll = true
}: CompactVaccineScheduleProps) {
  // Sort vaccines by status priority: overdue > due > upcoming > completed
  const sortedRecommendations = [...vaccineRecommendations].sort((a, b) => {
    const statusPriority = {
      'overdue': 0,
      'due': 1,
      'upcoming': 2,
      'completed': 3
    };
    
    return statusPriority[a.status] - statusPriority[b.status];
  });
  
  // Get vaccines to display based on maxDisplay
  const displayVaccines = sortedRecommendations.slice(0, maxDisplay);
  const hasMoreVaccines = sortedRecommendations.length > maxDisplay;
  
  // Count vaccines by status
  const statusCounts = sortedRecommendations.reduce((counts, rec) => {
    counts[rec.status] = (counts[rec.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  return (
    <div className="space-y-3">
      {/* Status summary */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-green-500 mr-2" />
          <h3 className="font-semibold text-sm">Vaccination Status</h3>
        </div>
        
        <div className="flex space-x-2 text-xs">
          {statusCounts.overdue && (
            <span className="px-2 py-0.5 bg-red-900/30 text-red-400 rounded-full">
              {statusCounts.overdue} Overdue
            </span>
          )}
          {statusCounts.due && (
            <span className="px-2 py-0.5 bg-yellow-900/30 text-yellow-400 rounded-full">
              {statusCounts.due} Due
            </span>
          )}
        </div>
      </div>
      
      {/* Vaccine grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayVaccines.map((recommendation) => (
          <CompactVaccineCard
            key={recommendation.vaccine.id}
            child={child}
            vaccine={recommendation.vaccine}
            status={recommendation.status}
            dueDate={recommendation.dueDate}
          />
        ))}
      </div>
      
      {/* View all link */}
      {showViewAll && hasMoreVaccines && (
        <Link 
          href="/vaccines" 
          className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-lg text-green-400 hover:bg-gray-700 text-sm mt-2"
        >
          <span>View all {sortedRecommendations.length} vaccines</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
} 