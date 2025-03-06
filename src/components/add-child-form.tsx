'use client';

import React, { useState, useEffect } from 'react';
import { Child } from '@/types';

interface AddChildFormProps {
  onSubmit: (child: Omit<Child, 'id' | 'vaccineHistory'>) => void;
  onCancel: () => void;
  initialData?: {
    name: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    weight?: number;
    height?: number;
    headCircumference?: number;
  };
}

export function AddChildForm({ onSubmit, onCancel, initialData }: AddChildFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialData?.gender || 'male');
  const [weight, setWeight] = useState(initialData?.weight ? initialData.weight.toString() : '');
  const [height, setHeight] = useState(initialData?.height ? initialData.height.toString() : '');
  const [headCircumference, setHeadCircumference] = useState(
    initialData?.headCircumference ? initialData.headCircumference.toString() : ''
  );
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDateOfBirth(initialData.dateOfBirth);
      setGender(initialData.gender);
      setWeight(initialData.weight ? initialData.weight.toString() : '');
      setHeight(initialData.height ? initialData.height.toString() : '');
      setHeadCircumference(initialData.headCircumference ? initialData.headCircumference.toString() : '');
    }
  }, [initialData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newChild: Omit<Child, 'id' | 'vaccineHistory'> = {
      name,
      dateOfBirth,
      gender,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      headCircumference: headCircumference ? parseFloat(headCircumference) : undefined,
      bloodGroup: undefined,
      allergies: [],
      medicalConditions: []
    };
    
    onSubmit(newChild);
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Add New Child</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">
            Gender *
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              min="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              step="0.1"
              min="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="headCircumference" className="block text-sm font-medium text-gray-300 mb-1">
              Head (cm)
            </label>
            <input
              type="number"
              id="headCircumference"
              value={headCircumference}
              onChange={(e) => setHeadCircumference(e.target.value)}
              step="0.1"
              min="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
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
            {initialData ? 'Update Child' : 'Add Child'}
          </button>
        </div>
      </form>
    </div>
  );
} 