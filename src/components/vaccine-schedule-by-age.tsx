'use client';

import React, { useState } from 'react';
import { Vaccine, VaccineSchedule } from '@/types';
import { Shield, ChevronDown, Info } from 'lucide-react';

interface VaccineScheduleByAgeProps {
  vaccines: Vaccine[];
  vaccineSchedule: VaccineSchedule;
}

export function VaccineScheduleByAge({ vaccines, vaccineSchedule }: VaccineScheduleByAgeProps) {
  const [expandedAgeGroup, setExpandedAgeGroup] = useState<string | null>(null);
  const [expandedVaccine, setExpandedVaccine] = useState<string | null>(null);
  
  // Toggle age group expansion
  const toggleAgeGroup = (ageRange: string) => {
    setExpandedAgeGroup(expandedAgeGroup === ageRange ? null : ageRange);
    setExpandedVaccine(null); // Close any expanded vaccine when toggling age groups
  };
  
  // Toggle vaccine details expansion
  const toggleVaccineDetails = (vaccineId: string) => {
    setExpandedVaccine(expandedVaccine === vaccineId ? null : vaccineId);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">{vaccineSchedule.name}</h3>
      
      {/* Age group accordions */}
      <div className="space-y-3">
        {vaccineSchedule.recommendedVaccines.map((ageGroup, index) => (
          <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
            {/* Age group header */}
            <button
              className="w-full flex justify-between items-center p-3 text-left bg-gray-900"
              onClick={() => toggleAgeGroup(ageGroup.ageRange)}
            >
              <div className="flex items-center">
                <span className="font-medium">{ageGroup.ageRange}</span>
                <span className="ml-2 text-xs text-gray-400">
                  ({ageGroup.vaccines.length} vaccines)
                </span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 transition-transform ${
                  expandedAgeGroup === ageGroup.ageRange ? 'transform rotate-180' : ''
                }`} 
              />
            </button>
            
            {/* Age group content (vaccines) */}
            {expandedAgeGroup === ageGroup.ageRange && (
              <div className="p-3 bg-gray-900 border-t border-gray-800">
                <div className="space-y-3">
                  {ageGroup.vaccines.map((vaccineId, vIndex) => {
                    const vaccine = vaccines.find(v => v.id === vaccineId);
                    if (!vaccine) return null;
                    
                    return (
                      <div key={vIndex} className="bg-gray-800 rounded-lg overflow-hidden">
                        <button
                          className="w-full flex justify-between items-center p-3 text-left"
                          onClick={() => toggleVaccineDetails(vaccineId)}
                        >
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 text-green-500 mr-2" />
                            <span className="font-medium">{vaccine.name}</span>
                          </div>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${
                              expandedVaccine === vaccineId ? 'transform rotate-180' : ''
                            }`} 
                          />
                        </button>
                        
                        {/* Vaccine details */}
                        {expandedVaccine === vaccineId && (
                          <div className="p-3 bg-gray-800 border-t border-gray-700">
                            {/* Vaccine information */}
                            <div className="space-y-2 text-sm">
                              <p>{vaccine.description}</p>
                              
                              <div>
                                <span className="text-gray-400">Protects against: </span>
                                <span>{vaccine.diseases.join(', ')}</span>
                              </div>
                              
                              <div>
                                <span className="text-gray-400">Recommended ages: </span>
                                <span>{vaccine.recommendedAges.join(', ')}</span>
                              </div>
                              
                              <div>
                                <span className="text-gray-400">Number of doses: </span>
                                <span>{vaccine.doseCount}</span>
                              </div>
                              
                              {vaccine.catchupAges && (
                                <div>
                                  <span className="text-gray-400">Catch-up vaccination: </span>
                                  <span>{vaccine.catchupAges.join(', ')}</span>
                                </div>
                              )}
                              
                              {vaccine.sideEffects && vaccine.sideEffects.length > 0 && (
                                <div>
                                  <span className="text-gray-400">Possible side effects: </span>
                                  <span>{vaccine.sideEffects.join(', ')}</span>
                                </div>
                              )}
                              
                              {vaccine.contraindications && vaccine.contraindications.length > 0 && (
                                <div>
                                  <span className="text-gray-400">Contraindications: </span>
                                  <span>{vaccine.contraindications.join(', ')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend and information */}
      <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 mt-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <p>This schedule follows the {vaccineSchedule.name} of India. Always consult with your healthcare provider for personalized vaccination advice.</p>
            <p className="mt-2 text-xs text-gray-400">
              Note: Some vaccines may be combined into single shots (e.g., DPT). Catch-up vaccinations are available for children who miss their scheduled doses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 