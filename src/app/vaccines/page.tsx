'use client';

import React, { useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { ChildCard } from '@/components/child-card';
import { VaccineCard } from '@/components/vaccine-card';
import { VaccineDetail } from '@/components/vaccine-detail';
import { AddChildForm } from '@/components/add-child-form';
import { AddVaccineForm } from '@/components/add-vaccine-form';
import { VaccineRecommendation } from '@/components/vaccine-recommendation';
import { QuickVaccineEntry } from '@/components/quick-vaccine-entry';
import { getVaccineRecommendations, getCatchupVaccineRecommendations } from '@/utils/vaccine-utils';
import { mockVaccines, mockVaccineSchedule, mockChildren } from '@/data/mock';
import { Child, Vaccine, VaccineDose } from '@/types';
import { Plus, Search, ArrowLeft, Shield, FastForward } from 'lucide-react';

export default function VaccinesPage() {
  // State for children and vaccines
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [vaccines] = useState<Vaccine[]>(mockVaccines);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  
  // UI state
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [showAddVaccineForm, setShowAddVaccineForm] = useState(false);
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'due' | 'overdue' | 'upcoming' | 'completed'>('all');
  
  // Handle adding a new child
  const handleAddChild = (childData: Omit<Child, 'id' | 'vaccineHistory'>) => {
    const newChild: Child = {
      ...childData,
      id: `c${children.length + 1}`,
      vaccineHistory: []
    };
    
    setChildren([...children, newChild]);
    setShowAddChildForm(false);
  };
  
  // Handle adding a new vaccine dose
  const handleAddVaccineDose = (vaccineDose: Omit<VaccineDose, 'id'>) => {
    if (!selectedChild) return;
    
    const newDose: VaccineDose = {
      ...vaccineDose,
      id: `vd${selectedChild.vaccineHistory.length + 1}`
    };
    
    const updatedChild = {
      ...selectedChild,
      vaccineHistory: [...selectedChild.vaccineHistory, newDose]
    };
    
    setChildren(children.map(child => 
      child.id === selectedChild.id ? updatedChild : child
    ));
    
    setSelectedChild(updatedChild);
    setShowAddVaccineForm(false);
  };
  
  // Handle adding multiple vaccine doses at once
  const handleAddMultipleVaccineDoses = (doses: Omit<VaccineDose, 'id'>[]) => {
    if (!selectedChild) return;
    
    // Generate IDs for each new dose
    const newDoses: VaccineDose[] = doses.map((dose, index) => ({
      ...dose,
      id: `vd${selectedChild.vaccineHistory.length + index + 1}`
    }));
    
    const updatedChild = {
      ...selectedChild,
      vaccineHistory: [...selectedChild.vaccineHistory, ...newDoses]
    };
    
    setChildren(children.map(child => 
      child.id === selectedChild.id ? updatedChild : child
    ));
    
    setSelectedChild(updatedChild);
    setShowQuickEntry(false);
  };
  
  // Filter vaccines based on search query
  const filteredVaccines = vaccines.filter(vaccine => 
    vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vaccine.diseases.some(disease => 
      disease.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  // Get vaccine recommendations for the selected child
  const vaccineRecommendations = selectedChild 
    ? getVaccineRecommendations(selectedChild, vaccines, mockVaccineSchedule)
    : [];
  
  // Filter recommendations based on filter type
  const filteredRecommendations = filterType === 'all' 
    ? vaccineRecommendations 
    : vaccineRecommendations.filter(rec => rec.status === filterType);
  
  // Get catch-up vaccine recommendations
  const catchupVaccines = selectedChild 
    ? getCatchupVaccineRecommendations(selectedChild, vaccines)
    : [];
  
  return (
    <div className="pb-16">
      {/* Header */}
      <header className="bg-gradient-to-b from-green-600 to-green-700 p-6">
        <div className="flex items-center justify-between">
          {selectedChild ? (
            <button 
              onClick={() => setSelectedChild(null)}
              className="flex items-center text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Children</span>
            </button>
          ) : (
            <h1 className="text-2xl font-bold flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Vaccine Tracker
            </h1>
          )}
        </div>
      </header>
      
      <div className="px-4 py-6 space-y-6">
        {!selectedChild ? (
          // Children list view
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Children</h2>
              <button
                onClick={() => setShowAddChildForm(true)}
                className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Child</span>
              </button>
            </div>
            
            {showAddChildForm ? (
              <AddChildForm 
                onSubmit={handleAddChild}
                onCancel={() => setShowAddChildForm(false)}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {children.length > 0 ? (
                  children.map(child => (
                    <ChildCard 
                      key={child.id} 
                      child={child} 
                      onClick={() => setSelectedChild(child)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 bg-gray-900 rounded-lg">
                    <p className="text-gray-400">No children added yet</p>
                    <button
                      onClick={() => setShowAddChildForm(true)}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                      Add Your First Child
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Available Vaccines</h2>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search vaccines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredVaccines.map(vaccine => (
                  <VaccineCard 
                    key={vaccine.id} 
                    vaccine={vaccine} 
                    onClick={() => setSelectedVaccine(vaccine)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          // Child detail view
          <>
            <div className="space-y-4">
              <ChildCard child={selectedChild} />
              
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Vaccine Management</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowQuickEntry(true);
                      setShowAddVaccineForm(false);
                    }}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-md"
                  >
                    <FastForward className="w-4 h-4" />
                    <span>Quick Entry</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAddVaccineForm(true);
                      setShowQuickEntry(false);
                    }}
                    className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Vaccine</span>
                  </button>
                </div>
              </div>
              
              {showAddVaccineForm ? (
                <AddVaccineForm 
                  child={selectedChild}
                  vaccines={vaccines}
                  onSubmit={handleAddVaccineDose}
                  onCancel={() => setShowAddVaccineForm(false)}
                />
              ) : showQuickEntry ? (
                <QuickVaccineEntry
                  child={selectedChild}
                  vaccines={vaccines}
                  vaccineSchedule={mockVaccineSchedule}
                  onAddVaccineDoses={handleAddMultipleVaccineDoses}
                />
              ) : (
                <>
                  <div className="flex items-center space-x-2 overflow-x-auto py-2">
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                        filterType === 'all' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterType('due')}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                        filterType === 'due' 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      Due Now
                    </button>
                    <button
                      onClick={() => setFilterType('overdue')}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                        filterType === 'overdue' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      Overdue
                    </button>
                    <button
                      onClick={() => setFilterType('upcoming')}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                        filterType === 'upcoming' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      Upcoming
                    </button>
                    <button
                      onClick={() => setFilterType('completed')}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                        filterType === 'completed' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredRecommendations.length > 0 ? (
                      filteredRecommendations.map(recommendation => (
                        <VaccineRecommendation
                          key={recommendation.vaccine.id}
                          child={selectedChild}
                          vaccine={recommendation.vaccine}
                          status={recommendation.status}
                          dueDate={recommendation.dueDate}
                          onClick={() => setSelectedVaccine(recommendation.vaccine)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 bg-gray-900 rounded-lg">
                        <p className="text-gray-400">
                          {filterType === 'all' 
                            ? 'No vaccine recommendations available' 
                            : `No ${filterType} vaccines found`}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {catchupVaccines.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">Catch-up Vaccines</h3>
                      <div className="space-y-4">
                        {catchupVaccines.map(vaccine => (
                          <VaccineCard
                            key={vaccine.id}
                            vaccine={vaccine}
                            onClick={() => setSelectedVaccine(vaccine)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Vaccine detail modal */}
      {selectedVaccine && (
        <VaccineDetail 
          vaccine={selectedVaccine} 
          onClose={() => setSelectedVaccine(null)} 
        />
      )}
      
      <BottomNav />
    </div>
  );
} 