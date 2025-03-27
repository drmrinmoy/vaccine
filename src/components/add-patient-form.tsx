'use client';

import React, { useState } from 'react';

type AddPatientFormProps = {
  onSubmit: (data: {
    name: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female' | 'Other';
    weight?: number;
    height?: number;
    bloodPressure?: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    name: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female' | 'Other';
    weight?: number;
    height?: number;
    bloodPressure?: string;
  };
};

export function AddPatientForm({ onSubmit, onCancel, initialData }: AddPatientFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(initialData?.gender || 'Male');
  const [weight, setWeight] = useState(initialData?.weight !== undefined ? initialData.weight.toString() : '');
  const [height, setHeight] = useState(initialData?.height !== undefined ? initialData.height.toString() : '');
  const [bloodPressure, setBloodPressure] = useState(initialData?.bloodPressure || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name,
      dateOfBirth,
      gender,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      bloodPressure: bloodPressure || undefined,
    };
    
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Patient Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          required
        />
      </div>
      
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          id="dateOfBirth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          required
        />
      </div>
      
      <div>
        <label htmlFor="gender" className="block text-sm font-medium mb-1">
          Gender
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          required
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="weight" className="block text-sm font-medium mb-1">
          Weight (kg) - Optional
        </label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          step="0.1"
          min="0"
        />
      </div>
      
      <div>
        <label htmlFor="height" className="block text-sm font-medium mb-1">
          Height (cm) - Optional
        </label>
        <input
          type="number"
          id="height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          step="0.1"
          min="0"
        />
      </div>
      
      <div>
        <label htmlFor="bloodPressure" className="block text-sm font-medium mb-1">
          Blood Pressure (e.g., 120/80) - Optional
        </label>
        <input
          type="text"
          id="bloodPressure"
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          placeholder="120/80"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          {initialData ? 'Update Patient' : 'Add Patient'}
        </button>
      </div>
    </form>
  );
} 