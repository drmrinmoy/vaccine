'use client';

import React, { useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { 
  ArrowLeft, 
  PlaneTakeoff, 
  Heart, 
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Syringe,
  Home,
  Map
} from 'lucide-react';
import Link from 'next/link';

// Define types for the condition dropdown
interface Vaccine {
  name: string;
  description: string;
  schedule?: string;
}

interface ConditionCategory {
  id: string;
  title: string;
  conditions: Condition[];
}

interface Condition {
  id: string;
  name: string;
  vaccines: Vaccine[];
  description?: string;
}

// Define the vaccines data
const vaccineData: Record<string, Vaccine> = {
  meningococcal: {
    name: "Meningococcal Vaccine",
    description: "Protects against Neisseria meningitidis infections.",
    schedule: "Two doses: 2 years and 16-18 years for high-risk cases."
  },
  je: {
    name: "Japanese Encephalitis Vaccine",
    description: "Protects against JE virus that causes brain inflammation.",
    schedule: "Two doses given 28 days apart."
  },
  cholera: {
    name: "Oral Cholera Vaccine",
    description: "Protects against cholera infection.",
    schedule: "Two doses given 14 days apart."
  },
  rabies: {
    name: "Rabies Vaccine",
    description: "Protects against rabies virus infection.",
    schedule: "Pre-exposure: 3 doses on days 0, 7, and 21/28."
  },
  yellowFever: {
    name: "Yellow Fever Vaccine",
    description: "Protects against yellow fever virus.",
    schedule: "Single dose provides long-term protection."
  },
  ppsv23: {
    name: "Pneumococcal Polysaccharide Vaccine",
    description: "Protects against 23 types of pneumococcal bacteria.",
    schedule: "One or two doses based on risk factors."
  }
};

// Define the condition categories and associated vaccines
const conditionCategories: ConditionCategory[] = [
  {
    id: "immunodeficiency",
    title: "Immunodeficiency",
    conditions: [
      {
        id: "hiv",
        name: "HIV Infection",
        vaccines: [vaccineData.meningococcal, vaccineData.ppsv23]
      },
      {
        id: "immunosuppressive",
        name: "Immunosuppressive Therapy",
        vaccines: [vaccineData.ppsv23, vaccineData.meningococcal]
      }
    ]
  },
  {
    id: "chronic",
    title: "Chronic Conditions",
    conditions: [
      {
        id: "cardiac",
        name: "Cardiac Conditions",
        vaccines: [vaccineData.ppsv23]
      },
      {
        id: "pulmonary",
        name: "Pulmonary Conditions",
        vaccines: [vaccineData.ppsv23]
      },
      {
        id: "renal",
        name: "Renal Disease",
        vaccines: [vaccineData.ppsv23, vaccineData.meningococcal]
      },
      {
        id: "hepatic",
        name: "Hepatic Disease",
        vaccines: [vaccineData.ppsv23]
      },
      {
        id: "diabetes",
        name: "Diabetes Mellitus",
        vaccines: [vaccineData.ppsv23]
      }
    ]
  },
  {
    id: "anatomical",
    title: "Anatomical Risk Factors",
    conditions: [
      {
        id: "asplenia",
        name: "Asplenia/Hyposplenia",
        vaccines: [vaccineData.meningococcal, vaccineData.ppsv23]
      },
      {
        id: "csf",
        name: "CSF Leaks/Cochlear Implants",
        vaccines: [vaccineData.ppsv23]
      }
    ]
  },
  {
    id: "situational",
    title: "Situational Factors",
    conditions: [
      {
        id: "pets",
        name: "Pets at Home",
        vaccines: [vaccineData.rabies]
      },
      {
        id: "jeEndemic",
        name: "JE Endemic Areas",
        vaccines: [vaccineData.je]
      },
      {
        id: "outbreak",
        name: "Disease Outbreaks",
        vaccines: [vaccineData.cholera]
      },
      {
        id: "travelers",
        name: "International Travel",
        vaccines: [
          vaccineData.rabies, 
          vaccineData.meningococcal, 
          vaccineData.yellowFever,
          vaccineData.je,
          vaccineData.cholera
        ]
      }
    ]
  }
];

export default function SpecialVaccination() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("immunodeficiency");
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const selectCondition = (condition: Condition) => {
    setSelectedCondition(condition);
  };

  return (
    <main className="bg-gray-950 min-h-screen text-white">
      <div className="px-4 py-6 pb-24 max-w-7xl mx-auto">
        <header className="flex items-center mb-6">
          <Link href="/dashboard" className="mr-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Special Vaccinations</h1>
        </header>
        
        <div className="space-y-5">
          {/* Interactive Condition Vaccine Selector */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-lg">            
            <div className="grid md:grid-cols-3 gap-0">
              {/* Left column: Condition categories */}
              <div className="md:col-span-1 border-r border-gray-800">
                <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                  <h3 className="font-medium text-white">Select a Condition</h3>
                </div>
                <div className="divide-y divide-gray-800">
                  {conditionCategories.map((category) => (
                    <div key={category.id} className="overflow-hidden">
                      <button 
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <span className="font-medium text-sm">{category.title}</span>
                        <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {expandedCategory === category.id && (
                        <div className="bg-gray-800/30">
                          {category.conditions.map((condition) => (
                            <button
                              key={condition.id}
                              className={`w-full text-left py-3 px-4 flex items-center transition-colors border-l-2 ${
                                selectedCondition?.id === condition.id 
                                  ? 'border-l-green-500 bg-gray-800/80 text-green-400' 
                                  : 'border-l-transparent text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                              }`}
                              onClick={() => selectCondition(condition)}
                            >
                              <ChevronRight className={`h-3 w-3 mr-2 flex-shrink-0 ${selectedCondition?.id === condition.id ? 'text-green-400' : 'text-gray-500'}`} />
                              <span className="text-sm">{condition.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right column: Selected condition's vaccine recommendations */}
              <div className="md:col-span-2 bg-gray-900">
                {selectedCondition ? (
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-4">{selectedCondition.name}</h3>
                    
                    <h4 className="text-md font-medium text-white mb-3 flex items-center">
                      <Syringe className="h-4 w-4 mr-2 text-green-400" />
                      Recommended Vaccines
                    </h4>
                    
                    {selectedCondition.vaccines.length > 0 ? (
                      <div className="space-y-3">
                        {selectedCondition.vaccines.map((vaccine, index) => (
                          <div key={index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
                            <h5 className="font-medium text-white mb-1">{vaccine.name}</h5>
                            <p className="text-gray-400 text-xs mb-2">{vaccine.description}</p>
                            {vaccine.schedule && (
                              <div className="bg-gray-900/50 mt-2 p-2 rounded border border-gray-700">
                                <p className="text-xs">
                                  <span className="text-green-400 font-medium">Schedule: </span>
                                  <span className="text-gray-300">{vaccine.schedule}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No specific additional vaccines recommended.</p>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10">
                    <div className="bg-gray-800 p-3 rounded-full mb-4">
                      <ChevronLeft className="h-5 w-5 text-gray-400" />
                    </div>
                    <h3 className="text-md font-medium text-white mb-2">Select a Condition</h3>
                    <p className="text-gray-400 text-xs max-w-xs">
                      Choose a specific condition from the list to view recommended vaccines.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Key Considerations - Simplified with cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:bg-gray-900/80 transition-colors">
              <Heart className="h-5 w-5 text-red-400 mb-3" />
              <h3 className="font-medium text-sm mb-2">Immunocompromised</h3>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Live vaccines contraindicated</li>
                <li>• Additional doses recommended</li>
                <li>• Time around treatments</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:bg-gray-900/80 transition-colors">
              <PlaneTakeoff className="h-5 w-5 text-blue-400 mb-3" />
              <h3 className="font-medium text-sm mb-2">Travel</h3>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Yellow fever endemic areas</li>
                <li>• Meningococcal for high-risk</li>
                <li>• Plan 4-6 weeks in advance</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:bg-gray-900/80 transition-colors">
              <Home className="h-5 w-5 text-yellow-400 mb-3" />
              <h3 className="font-medium text-sm mb-2">Environment</h3>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Pets (rabies risk)</li>
                <li>• Rural vs. urban living</li>
                <li>• Endemic disease zones</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:bg-gray-900/80 transition-colors">
              <Map className="h-5 w-5 text-purple-400 mb-3" />
              <h3 className="font-medium text-sm mb-2">Outbreaks</h3>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Cholera outbreaks</li>
                <li>• Meningococcal clusters</li>
                <li>• Local health advisories</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
} 