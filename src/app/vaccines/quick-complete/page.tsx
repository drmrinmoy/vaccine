'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { QuickVaccineEntry } from '@/components/quick-vaccine-entry';
import { mockChildren, mockVaccines, mockVaccineSchedule } from '@/data/mock';
import { ArrowLeft, Check, CheckCircle2, Clock, Shield } from 'lucide-react';
import { Child, VaccineDose } from '@/types';

export default function QuickCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childIdParam = searchParams.get('childId');
  
  const [children, setChildren] = useState(mockChildren);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Set selected child based on URL parameter
  useEffect(() => {
    if (childIdParam) {
      const child = children.find(c => c.id === childIdParam);
      if (child) {
        setSelectedChild(child);
      }
    } else if (children.length > 0) {
      // Default to first child if none specified
      setSelectedChild(children[0]);
    }
  }, [childIdParam, children]);
  
  // Handle child selection change
  const handleChildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const childId = e.target.value;
    const child = children.find(c => c.id === childId) || null;
    setSelectedChild(child);
    
    // Update URL with new child ID
    if (child) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('childId', child.id);
      router.push(`/vaccines/quick-complete?${params.toString()}`);
    }
  };
  
  // Handle adding vaccine doses
  const handleAddVaccineDoses = (doses: Omit<VaccineDose, 'id'>[]) => {
    if (!selectedChild) return;
    
    // Create new vaccine doses with IDs
    const newDoses = doses.map((dose, index) => ({
      ...dose,
      id: `vd-${Date.now()}-${index}`
    }));
    
    // Update the selected child's vaccine history
    const updatedChild = {
      ...selectedChild,
      vaccineHistory: [...selectedChild.vaccineHistory, ...newDoses]
    };
    
    // Update the children array
    const updatedChildren = children.map(child => 
      child.id === updatedChild.id ? updatedChild : child
    );
    
    setChildren(updatedChildren);
    setSelectedChild(updatedChild);
    
    // Show success message
    setSuccessMessage(`Successfully added ${doses.length} vaccine record${doses.length !== 1 ? 's' : ''}!`);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="mb-6">
        <Link 
          href="/vaccines" 
          className="flex items-center text-gray-400 hover:text-gray-300 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Vaccines</span>
        </Link>
        
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <CheckCircle2 className="w-6 h-6 mr-2 text-green-500" />
          Quick Complete Vaccination Records
        </h1>
        <p className="text-gray-400 mb-4">
          Quickly mark all vaccines as completed up to a certain age for your child.
          Perfect for catching up vaccination records in one go.
        </p>
      </div>
      
      {/* Child Selector */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
        <label htmlFor="child-selector" className="block text-sm font-medium text-gray-300 mb-1">
          Select Child
        </label>
        <select 
          id="child-selector"
          value={selectedChild?.id || ''}
          onChange={handleChildChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {children.map(child => (
            <option key={child.id} value={child.id}>
              {child.name} ({formatAge(child.dateOfBirth)})
            </option>
          ))}
        </select>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-3 bg-green-900/30 border border-green-800 rounded-md flex items-center">
          <Check className="w-5 h-5 text-green-500 mr-2" />
          <span>{successMessage}</span>
        </div>
      )}
      
      {/* Quick Vaccine Entry Component */}
      {selectedChild && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <QuickVaccineEntry
            child={selectedChild}
            vaccines={mockVaccines}
            vaccineSchedule={mockVaccineSchedule}
            onAddVaccineDoses={handleAddVaccineDoses}
          />
        </div>
      )}
      
      {/* Feature Highlights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="mb-2 flex items-center text-green-500">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Complete By Age</h3>
          </div>
          <p className="text-sm text-gray-400">
            Mark all vaccines as completed up to a particular age with just one click.
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="mb-2 flex items-center text-yellow-500">
            <Clock className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Overdue Tracking</h3>
          </div>
          <p className="text-sm text-gray-400">
            Easily identify and complete overdue vaccines based on your child's age.
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="mb-2 flex items-center text-blue-500">
            <Shield className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Age-Appropriate</h3>
          </div>
          <p className="text-sm text-gray-400">
            Only age-appropriate vaccines are made available for quick completion.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to format age
function formatAge(dateOfBirth: string): string {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years === 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`;
  }
} 