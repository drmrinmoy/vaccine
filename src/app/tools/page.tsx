'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';

const ToolsPage = () => {
  // List of all clinical tools
  const clinicalTools = [
    {
      id: 'bp-centile',
      name: 'BP Centile Calculator',
      description: 'Calculate blood pressure percentiles for pediatric patients',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-400">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      color: 'bg-blue-900/50'
    },
    {
      id: 'gir-calculator',
      name: 'GIR Calculator',
      description: 'Calculate glucose infusion rates for IV therapy',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-400">
          <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Z" />
          <path d="M9 10h6" />
          <path d="M12 7v6" />
          <path d="M9 17h6" />
        </svg>
      ),
      color: 'bg-red-900/50'
    },
    {
      id: 'pedigree',
      name: 'Pedigree Chart',
      description: 'Create and analyze family pedigrees for genetic counseling',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-indigo-400">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M12 3v18" />
          <path d="M7 7h5" />
          <path d="M7 12h5" />
          <path d="M7 17h5" />
          <path d="M17 7h.01" />
          <path d="M17 12h.01" />
          <path d="M17 17h.01" />
        </svg>
      ),
      color: 'bg-indigo-900/50'
    },
    {
      id: 'normal-values',
      name: 'Normal Values',
      description: 'Reference ranges for laboratory values by age',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-400">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
          <path d="M12 11h4" />
          <path d="M12 16h4" />
          <path d="M8 11h.01" />
          <path d="M8 16h.01" />
        </svg>
      ),
      color: 'bg-green-900/50'
    },
    {
      id: 'growth-calculator',
      name: 'Growth Calculator',
      description: 'Calculate growth velocity and percentiles',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-400">
          <path d="M12 2v20"></path>
          <path d="M2 12h20"></path>
          <path d="m4.93 4.93 14.14 14.14"></path>
          <path d="m19.07 4.93-14.14 14.14"></path>
        </svg>
      ),
      color: 'bg-yellow-900/50'
    },
    {
      id: 'fluid-calculator',
      name: 'Fluid Calculator',
      description: 'Calculate maintenance fluid requirements',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyan-400">
          <path d="M12 2v20"></path>
          <path d="M2 12h20"></path>
          <path d="M7 12a5 5 0 0 1 5-5"></path>
          <path d="M17 12a5 5 0 0 0-5-5"></path>
          <path d="M7 12a5 5 0 0 0 5 5"></path>
          <path d="M17 12a5 5 0 0 1-5 5"></path>
        </svg>
      ),
      color: 'bg-cyan-900/50'
    },
    {
      id: 'bmi-calculator',
      name: 'BMI Calculator',
      description: 'Calculate and interpret Body Mass Index',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-400">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
          <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
          <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      color: 'bg-purple-900/50'
    },
    {
      id: 'drug-dosage',
      name: 'Drug Dosage',
      description: 'Calculate pediatric medication dosages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-400">
          <path d="m19 5-7 7-7-7"></path>
          <path d="M12 12v7"></path>
        </svg>
      ),
      color: 'bg-orange-900/50'
    },
    {
      id: 'nutrition-calculator',
      name: 'Nutrition Calculator',
      description: 'Calculate nutritional requirements based on age and weight',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-lime-400">
          <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8"></path>
          <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path>
        </svg>
      ),
      color: 'bg-lime-900/50'
    }
  ];

  return (
    <div className="pb-16 bg-black text-white min-h-screen">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <h1 className="text-lg font-semibold">Clinical Tools</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <p className="text-gray-400">
            Access a range of clinical tools designed to assist with pediatric care and management.
          </p>
          
          {/* Tools Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {clinicalTools.map((tool) => (
              <Link 
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="bg-gray-900 rounded-lg p-5 border border-gray-800 hover:border-green-500 transition-colors"
              >
                <div className="flex items-start">
                  <div className={`w-12 h-12 rounded-full ${tool.color} flex items-center justify-center mr-4 flex-shrink-0`}>
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{tool.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Coming Soon Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Additional Tools</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    We&apos;re working on adding more clinical tools, including antibiotic dosing, 
                    resuscitation calculators, and developmental screening tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ToolsPage; 