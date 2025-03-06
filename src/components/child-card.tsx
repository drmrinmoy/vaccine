'use client';

import React from 'react';
import { Child } from '@/types';
import { Calendar, Weight, Ruler, User } from 'lucide-react';

interface ChildCardProps {
  child: Child;
  onClick?: () => void;
}

export function ChildCard({ child, onClick }: ChildCardProps) {
  // Calculate age in years, months, and days
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  };

  const age = calculateAge(child.dateOfBirth);
  const formattedDOB = new Date(child.dateOfBirth).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div 
      className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-green-500 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center">
              <User className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <h3 className="font-semibold">{child.name}</h3>
              <p className="text-xs text-gray-400">{age} old</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            child.gender === 'male' ? 'bg-blue-900/50 text-blue-300' : 
            child.gender === 'female' ? 'bg-pink-900/50 text-pink-300' : 
            'bg-purple-900/50 text-purple-300'
          }`}>
            {child.gender}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-2">
            <Calendar className="w-4 h-4 text-gray-400 mb-1" />
            <span className="text-xs text-gray-300">{formattedDOB}</span>
          </div>
          
          {child.weight && (
            <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-2">
              <Weight className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-xs text-gray-300">{child.weight} kg</span>
            </div>
          )}
          
          {child.height && (
            <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-2">
              <Ruler className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-xs text-gray-300">{child.height} cm</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
          <div>
            <span>Blood Group: {child.bloodGroup || 'Unknown'}</span>
          </div>
          <div>
            <span>{child.vaccineHistory.length} vaccines recorded</span>
          </div>
        </div>
      </div>
    </div>
  );
} 