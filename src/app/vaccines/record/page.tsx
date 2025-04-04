'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { mockChildren, mockVaccines, mockVaccineSchedule } from '@/data/mock';
import { BottomNav } from '@/components/bottom-nav';
import { VaccineRecordTable } from '@/components/vaccine-record-table';
import { VaccineStatusTracker } from '@/components/vaccine-status-tracker';
import { QuickVaccineEntry } from '@/components/quick-vaccine-entry';
import { Child, VaccineDose } from '@/types';
import { ChevronLeft, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Separate component that uses useSearchParams
function VaccineRecord() {
  const [children, setChildren] = useState(mockChildren);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [activeTab, setActiveTab] = useState<'all-records' | 'age-groups' | 'quick-entry'>('quick-entry');
  
  const searchParams = useSearchParams();
  const childIdParam = searchParams.get('childId');
  
  // Set selected child based on URL parameter or default to first child
  useEffect(() => {
    if (childIdParam) {
      const child = children.find(c => c.id === childIdParam);
      if (child) {
        setSelectedChild(child);
      } else if (children.length > 0) {
        setSelectedChild(children[0]);
      }
    } else if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
    }
  }, [childIdParam, children, selectedChild]);
  
  // Handle child selection
  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
  };
  
  // Handle deleting a vaccine dose
  const handleDeleteDose = (doseId: string) => {
    if (!selectedChild) return;
    
    // Filter out the dose to delete
    const updatedVaccineHistory = selectedChild.vaccineHistory.filter(
      dose => dose.id !== doseId
    );
    
    // Update the child's vaccine history
    const updatedChild = {
      ...selectedChild,
      vaccineHistory: updatedVaccineHistory
    };
    
    // Update children array
    setChildren(children.map(child => 
      child.id === selectedChild.id ? updatedChild : child
    ));
    
    // Update selected child
    setSelectedChild(updatedChild);
  };
  
  // Handle updating vaccine status
  const handleVaccineStatusUpdate = (vaccineDoses: Array<Omit<VaccineDose, 'id'> | VaccineDose>) => {
    if (!selectedChild) return;
    
    // Filter out any doses that might already exist (same vaccine ID and dose number)
    const existingDoses = new Set(
      selectedChild.vaccineHistory.map(dose => `${dose.vaccineId}-${dose.doseNumber}`)
    );
    
    const newDoses = vaccineDoses.filter(
      dose => !existingDoses.has(`${dose.vaccineId}-${dose.doseNumber}`)
    );
    
    // Generate real IDs for new doses
    const dosesWithIds = newDoses.map((dose, index) => ({
      ...dose,
      id: 'id' in dose ? dose.id : `vd${selectedChild.vaccineHistory.length + index + 1}`
    }));
    
    // Update the child's vaccine history
    const updatedChild = {
      ...selectedChild,
      vaccineHistory: [...selectedChild.vaccineHistory, ...dosesWithIds]
    };
    
    // Update children array
    setChildren(children.map(child => 
      child.id === selectedChild.id ? updatedChild : child
    ));
    
    // Update selected child
    setSelectedChild(updatedChild);
  };
  
  return (
    <div className="pb-16">
      {/* Header */}
      <header className="bg-green-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center text-white">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-xl font-bold text-white">Vaccination Record</h1>
          <div className="w-16"></div> {/* Empty div for flex spacing */}
        </div>
        
        {/* Child Selection */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => handleSelectChild(child)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap ${
                selectedChild?.id === child.id 
                  ? 'bg-white text-green-700' 
                  : 'bg-green-600 text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      </header>
      
      <div className="p-4">
        {selectedChild ? (
          <div className="space-y-6">
            {/* Child Info */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedChild.name}</h2>
                  <p className="text-sm text-gray-400">
                    {new Date(selectedChild.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} • {selectedChild.gender}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-800 mb-4">
              <div className="flex space-x-4 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('quick-entry')}
                  className={`pb-2 px-1 whitespace-nowrap ${
                    activeTab === 'quick-entry' 
                      ? 'border-b-2 border-green-500 text-green-500' 
                      : 'text-gray-400'
                  }`}
                >
                  Quick Entry
                </button>
                <button
                  onClick={() => setActiveTab('all-records')}
                  className={`pb-2 px-1 whitespace-nowrap ${
                    activeTab === 'all-records' 
                      ? 'border-b-2 border-green-500 text-green-500' 
                      : 'text-gray-400'
                  }`}
                >
                  All Records
                </button>
                <button
                  onClick={() => setActiveTab('age-groups')}
                  className={`pb-2 px-1 whitespace-nowrap ${
                    activeTab === 'age-groups' 
                      ? 'border-b-2 border-green-500 text-green-500' 
                      : 'text-gray-400'
                  }`}
                >
                  By Age Groups
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'all-records' ? (
              <VaccineRecordTable 
                child={selectedChild}
                vaccines={mockVaccines}
                onDeleteDose={handleDeleteDose}
              />
            ) : activeTab === 'age-groups' ? (
              <VaccineStatusTracker
                child={selectedChild}
                vaccines={mockVaccines}
                vaccineSchedule={mockVaccineSchedule}
                onUpdateVaccineStatus={handleVaccineStatusUpdate}
              />
            ) : (
              <QuickVaccineEntry
                child={selectedChild}
                vaccines={mockVaccines}
                vaccineSchedule={mockVaccineSchedule}
                onAddVaccineDoses={handleVaccineStatusUpdate}
              />
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-400">
            <p>No child selected or no children added.</p>
            <Link href="/add-child" className="mt-4 inline-flex items-center text-green-500">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Child</span>
            </Link>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

// Loading fallback
function VaccineRecordLoading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading vaccination records...</p>
      </div>
    </div>
  );
}

export default function VaccineRecordPage() {
  return (
    <Suspense fallback={<VaccineRecordLoading />}>
      <VaccineRecord />
    </Suspense>
  );
} 