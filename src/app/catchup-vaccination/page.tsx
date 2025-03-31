'use client';

import React, { useState, useEffect } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { 
  ArrowLeft, 
  AlertCircle, 
  Calendar, 
  CheckCircle, 
  ChevronDown, 
  Search,
  Plus,
  X,
  Shield,
  Check,
  CalendarClock
} from 'lucide-react';
import Link from 'next/link';
import { Child, Vaccine, VaccineDose } from '@/types';
import { mockChildren, mockVaccines } from '@/data/mock';
import { getCatchupVaccineRecommendations, calculateAgeInMonths, formatAge } from '@/utils/vaccine-utils';
import Image from 'next/image';

export default function CatchupVaccination() {
  // State for children and vaccines
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [catchupVaccines, setCatchupVaccines] = useState<Vaccine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddDoseForm, setShowAddDoseForm] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [doseDate, setDoseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [administeredBy, setAdministeredBy] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

  // Calculate catchup vaccines when child selection changes
  useEffect(() => {
    if (selectedChild) {
      const vaccines = getCatchupVaccineRecommendations(selectedChild, mockVaccines);
      setCatchupVaccines(vaccines);
    } else {
      setCatchupVaccines([]);
    }
  }, [selectedChild]);

  // Filter catchup vaccines based on search query
  const filteredVaccines = searchQuery 
    ? catchupVaccines.filter(vaccine => 
        vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        vaccine.diseases.some(disease => disease.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : catchupVaccines;

  // Add vaccine dose to child's history
  const handleAddVaccineDose = () => {
    if (!selectedChild || !selectedVaccine) return;

    const newDose: VaccineDose = {
      id: `vd${selectedChild.vaccineHistory.length + 1}`,
      vaccineId: selectedVaccine.id,
      doseNumber: (selectedChild.vaccineHistory.filter(dose => dose.vaccineId === selectedVaccine.id).length + 1),
      dateAdministered: doseDate,
      administeredBy: administeredBy,
      notes: notes
    };

    const updatedChild = {
      ...selectedChild,
      vaccineHistory: [...selectedChild.vaccineHistory, newDose]
    };

    setChildren(prevChildren => 
      prevChildren.map(child => child.id === selectedChild.id ? updatedChild : child)
    );
    setSelectedChild(updatedChild);
    resetForm();
  };

  // Reset the form after adding a dose
  const resetForm = () => {
    setShowAddDoseForm(false);
    setSelectedVaccine(null);
    setDoseDate(new Date().toISOString().split('T')[0]);
    setAdministeredBy('');
    setNotes('');
  };

  return (
    <main className="bg-gray-950 min-h-screen text-white">
      <div className="px-4 py-6 pb-24 max-w-7xl mx-auto">
        <header className="flex items-center mb-6">
          <Link href="/dashboard" className="mr-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="h-6 w-6 mr-2 text-green-500" />
            Catchup Vaccination (NIS & IAP)
          </h1>
        </header>
        
        {/* Child selection section */}
        <div className="mb-6">
          <div 
            className="relative w-full bg-gray-900 rounded-lg border border-gray-800 p-4 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {selectedChild ? (
                  <>
                    <div className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center text-white font-medium">
                      {selectedChild.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{selectedChild.name}</p>
                      <p className="text-sm text-gray-400">{formatAge(selectedChild.dateOfBirth)}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">Select a child</p>
                )}
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${showDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-10">
                {children.map(child => (
                  <div 
                    key={child.id}
                    className="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChild(child);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="h-8 w-8 rounded-full bg-green-800 flex items-center justify-center text-white font-medium">
                      {child.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{child.name}</p>
                      <p className="text-sm text-gray-400">{formatAge(child.dateOfBirth)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {!selectedChild ? (
          // Information about catchup vaccination when no child is selected
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4">About Catchup Vaccination</h2>
              <p className="text-gray-300 mb-4">
                Catchup vaccination is a strategy to vaccinate children who have missed one or more 
                recommended vaccines. It ensures that children receive the necessary protection 
                against preventable diseases even if they're behind schedule.
              </p>
              
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-300 text-sm">
                    To get personalized catchup vaccination recommendations, please select a child from the dropdown above.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4">General Principles</h2>
              
              <ul className="space-y-4">
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">Start where you left off</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Catchup schedules resume from the point vaccination was interrupted. There's no need to restart a vaccine series.
                    </p>
                  </div>
                </li>
                
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">Minimum intervals</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      When catching up, vaccines are given at the minimum acceptable intervals between doses to provide protection quickly.
                    </p>
                  </div>
                </li>
                
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">Combination vaccines</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Combination vaccines may be used to reduce the number of injections needed.
                    </p>
                  </div>
                </li>
                
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">Age-specific recommendations</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Some vaccines are recommended only for certain age groups, even in catchup schedules.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          // Dynamic catchup recommendations for selected child
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4">Personalized Catchup Recommendations</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vaccines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              {filteredVaccines.length > 0 ? (
                <div className="space-y-4">
                  {filteredVaccines.map(vaccine => {
                    // Count how many doses already administered
                    const administeredDoses = selectedChild.vaccineHistory.filter(
                      dose => dose.vaccineId === vaccine.id
                    ).length;
                    
                    // Calculate remaining doses
                    const remainingDoses = vaccine.doseCount - administeredDoses;
                    
                    return (
                      <div key={vaccine.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div 
                          className="p-4 flex justify-between items-center cursor-pointer"
                          onClick={() => setExpandedInfo(expandedInfo === vaccine.id ? null : vaccine.id)}
                        >
                          <div className="flex items-center space-x-3">
                            {vaccine.image ? (
                              <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                <Image 
                                  src={vaccine.image} 
                                  alt={vaccine.name}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-green-800 flex items-center justify-center text-white font-bold">
                                {vaccine.name.substring(0, 2)}
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">{vaccine.name}</h3>
                              <p className="text-sm text-gray-400">{vaccine.diseases.join(', ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium px-2 py-1 bg-blue-900/30 text-blue-300 rounded-md mr-3">
                              {remainingDoses} {remainingDoses === 1 ? 'dose' : 'doses'} needed
                            </span>
                            <ChevronDown className={`h-5 w-5 transition-transform ${expandedInfo === vaccine.id ? 'transform rotate-180' : ''}`} />
                          </div>
                        </div>
                        
                        {expandedInfo === vaccine.id && (
                          <div className="p-4 border-t border-gray-700 bg-gray-850">
                            <p className="text-gray-300 mb-3">{vaccine.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-400 mb-1">Recommended Ages</h4>
                                <p className="text-sm">{vaccine.recommendedAges.join(', ')}</p>
                              </div>
                              {vaccine.catchupAges && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-400 mb-1">Catchup Ages</h4>
                                  <p className="text-sm">{vaccine.catchupAges.join(', ')}</p>
                                </div>
                              )}
                              {vaccine.sideEffects && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-400 mb-1">Side Effects</h4>
                                  <p className="text-sm">{vaccine.sideEffects.join(', ')}</p>
                                </div>
                              )}
                              <div>
                                <h4 className="text-sm font-medium text-gray-400 mb-1">Total Doses</h4>
                                <p className="text-sm">{administeredDoses} of {vaccine.doseCount} administered</p>
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVaccine(vaccine);
                                setShowAddDoseForm(true);
                              }}
                              className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Record New Dose</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-800 rounded-lg">
                  <CalendarClock className="h-12 w-12 mx-auto text-gray-600 mb-2" />
                  <p className="text-gray-400">
                    {searchQuery 
                      ? "No vaccines match your search" 
                      : "No catchup vaccines needed for this child"}
                  </p>
                </div>
              )}
            </div>
            
            {showAddDoseForm && selectedVaccine && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4">
                <div className="bg-gray-900 rounded-lg w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Record {selectedVaccine.name} Dose</h3>
                    <button 
                      onClick={resetForm}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Date Administered
                      </label>
                      <input
                        type="date"
                        value={doseDate}
                        onChange={(e) => setDoseDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Administered By (Optional)
                      </label>
                      <input
                        type="text"
                        value={administeredBy}
                        onChange={(e) => setAdministeredBy(e.target.value)}
                        placeholder="Doctor/Clinic Name"
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional information"
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={resetForm}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddVaccineDose}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2"
                      >
                        <Check className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4">Planning for {selectedChild.name}</h2>
              
              <ol className="space-y-4 list-decimal pl-5">
                <li className="text-gray-300">
                  <span className="font-medium text-white">Assess vaccination history</span>: {selectedChild.name} has received {selectedChild.vaccineHistory.length} vaccine doses so far.
                </li>
                <li className="text-gray-300">
                  <span className="font-medium text-white">Identify missing vaccines</span>: We've found {catchupVaccines.length} vaccines that need to be caught up.
                </li>
                <li className="text-gray-300">
                  <span className="font-medium text-white">Create a timeline</span>: Work with your healthcare provider to schedule the remaining doses.
                </li>
                <li className="text-gray-300">
                  <span className="font-medium text-white">Monitor progress</span>: Record each vaccination as it's administered to track your progress.
                </li>
              </ol>
              
              <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4 mt-6">
                <div className="flex">
                  <Calendar className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-green-300 text-sm">
                    Set reminders for upcoming doses in the catchup schedule to ensure you stay on track.
                    Add them to your calendar or use our app's notification system for timely reminders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
} 