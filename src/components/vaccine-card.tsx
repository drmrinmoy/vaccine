'use client';

import React from 'react';
import { Vaccine } from '@/types';
import { Shield, AlertCircle, Info } from 'lucide-react';

interface VaccineCardProps {
  vaccine: Vaccine;
  onClick?: () => void;
}

export function VaccineCard({ vaccine, onClick }: VaccineCardProps) {
  return (
    <div 
      className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-green-500 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">{vaccine.name}</h3>
          </div>
          <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full">
            {vaccine.doseCount > 1 ? `${vaccine.doseCount} doses` : '1 dose'}
          </span>
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2">{vaccine.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {vaccine.diseases.map((disease, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full"
            >
              {disease}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
          <div className="flex items-center space-x-1">
            <Info className="w-3 h-3" />
            <span>Ages: {vaccine.recommendedAges.join(', ')}</span>
          </div>
          {vaccine.sideEffects && (
            <div className="flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>{vaccine.sideEffects.length} side effects</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 