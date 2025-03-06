'use client';

import React, { useState } from 'react';
import { Child, Vaccine, VaccineDose } from '@/types';

interface AddVaccineFormProps {
  child: Child;
  vaccines: Vaccine[];
  onSubmit: (vaccineDose: Omit<VaccineDose, 'id'>) => void;
  onCancel: () => void;
}

export function AddVaccineForm({ child, vaccines, onSubmit, onCancel }: AddVaccineFormProps) {
  const [vaccineId, setVaccineId] = useState('');
  const [doseNumber, setDoseNumber] = useState(1);
  const [dateAdministered, setDateAdministered] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [administeredBy, setAdministeredBy] = useState('');
  const [notes, setNotes] = useState('');
  
  // Get the selected vaccine
  const selectedVaccine = vaccines.find(v => v.id === vaccineId);
  
  // Get the administered doses for the selected vaccine
  const administeredDoses = child.vaccineHistory.filter(
    dose => dose.vaccineId === vaccineId
  );
  
  // Calculate the next dose number
  const nextDoseNumber = administeredDoses.length + 1;
  
  // Update dose number when vaccine changes
  React.useEffect(() => {
    if (vaccineId) {
      setDoseNumber(nextDoseNumber);
    }
  }, [vaccineId, nextDoseNumber]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVaccineDose: Omit<VaccineDose, 'id'> = {
      vaccineId,
      doseNumber,
      dateAdministered,
      administeredBy: administeredBy || undefined,
      notes: notes || undefined
    };
    
    onSubmit(newVaccineDose);
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Add Vaccine Dose for {child.name}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="vaccine" className="block text-sm font-medium text-gray-300 mb-1">
            Vaccine *
          </label>
          <select
            id="vaccine"
            value={vaccineId}
            onChange={(e) => setVaccineId(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select Vaccine</option>
            {vaccines.map(vaccine => (
              <option key={vaccine.id} value={vaccine.id}>
                {vaccine.name} - {vaccine.diseases.join(', ')}
              </option>
            ))}
          </select>
        </div>
        
        {selectedVaccine && (
          <div className="bg-gray-800 p-3 rounded-md text-sm">
            <p className="font-medium">{selectedVaccine.name}</p>
            <p className="text-gray-400 mt-1">{selectedVaccine.description}</p>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span>Total doses: {selectedVaccine.doseCount}</span>
              <span>Administered: {administeredDoses.length}</span>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="doseNumber" className="block text-sm font-medium text-gray-300 mb-1">
            Dose Number *
          </label>
          <input
            type="number"
            id="doseNumber"
            value={doseNumber}
            onChange={(e) => setDoseNumber(parseInt(e.target.value))}
            min="1"
            max={selectedVaccine?.doseCount || 1}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="dateAdministered" className="block text-sm font-medium text-gray-300 mb-1">
            Date Administered *
          </label>
          <input
            type="date"
            id="dateAdministered"
            value={dateAdministered}
            onChange={(e) => setDateAdministered(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="administeredBy" className="block text-sm font-medium text-gray-300 mb-1">
            Administered By
          </label>
          <input
            type="text"
            id="administeredBy"
            value={administeredBy}
            onChange={(e) => setAdministeredBy(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. Dr. Sharma"
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            placeholder="Any observations or side effects"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Vaccine Dose
          </button>
        </div>
      </form>
    </div>
  );
} 