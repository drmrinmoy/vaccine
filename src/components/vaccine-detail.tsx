'use client';

import React from 'react';
import { Vaccine } from '@/types';
import { Shield, AlertCircle, Info, X } from 'lucide-react';

interface VaccineDetailProps {
  vaccine: Vaccine;
  onClose: () => void;
}

export function VaccineDetail({ vaccine, onClose }: VaccineDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold">{vaccine.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">About</h3>
            <p className="text-gray-300">{vaccine.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Protects Against</h3>
            <div className="flex flex-wrap gap-2">
              {vaccine.diseases.map((disease, index) => (
                <span 
                  key={index} 
                  className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm"
                >
                  {disease}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Recommended Ages</h3>
            <ul className="space-y-2">
              {vaccine.recommendedAges.map((age, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                  <span>{age}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Dosage</h3>
            <p className="text-gray-300">
              {vaccine.doseCount} dose{vaccine.doseCount > 1 ? 's' : ''} required
            </p>
          </div>
          
          {vaccine.catchupAges && vaccine.catchupAges.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Catch-up Vaccination</h3>
              <ul className="space-y-2">
                {vaccine.catchupAges.map((age, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <span>{age}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {vaccine.sideEffects && vaccine.sideEffects.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Possible Side Effects</h3>
              <ul className="space-y-2">
                {vaccine.sideEffects.map((effect, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <span>{effect}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {vaccine.contraindications && vaccine.contraindications.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Contraindications</h3>
              <ul className="space-y-2">
                {vaccine.contraindications.map((contraindication, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                    <span>{contraindication}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 