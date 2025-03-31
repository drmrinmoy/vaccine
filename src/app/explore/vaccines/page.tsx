'use client';

import React, { useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { Shield, Search, ChevronRight, Info, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Define types
interface Vaccine {
  id: string;
  name: string;
  fullName: string;
  scheduledAt: string;
  description: string;
  benefits: string[];
  sideEffects: string[];
  commonAge: string;
}

// Mock data for vaccines
const vaccineData: Vaccine[] = [
  {
    id: 'bcg',
    name: 'BCG',
    fullName: 'Bacillus Calmette-Guérin',
    scheduledAt: 'At birth',
    description: 'BCG vaccine is primarily used against tuberculosis (TB). In countries where TB is common, the World Health Organization (WHO) recommends that healthy infants receive a dose of BCG vaccine as soon as possible after birth.',
    benefits: [
      'Protects against tuberculosis (TB), especially severe forms in children',
      'Provides protection against tuberculous meningitis and miliary TB',
      'May provide some cross-protection against leprosy',
      'Long-lasting protection that may extend into adulthood'
    ],
    sideEffects: [
      'Small, red sore at the injection site',
      'Mild swelling of lymph nodes',
      'Low-grade fever (rare)',
      'Formation of a small scar at the injection site'
    ],
    commonAge: 'Given at birth or as early as possible'
  },
  {
    id: 'hepb',
    name: 'Hepatitis B',
    fullName: 'Hepatitis B Vaccine',
    scheduledAt: 'At birth, 6 weeks, 10 weeks, 14 weeks',
    description: 'Hepatitis B vaccine prevents hepatitis B, a serious liver infection. The first dose is given at birth to prevent mother-to-child transmission, followed by additional doses to complete the series.',
    benefits: [
      'Prevents acute and chronic hepatitis B infection',
      'Reduces risk of liver cirrhosis and liver cancer',
      'Provides long-lasting immunity',
      'Prevents transmission from mother to child'
    ],
    sideEffects: [
      'Pain or redness at injection site',
      'Low-grade fever',
      'Fatigue or headache (rare)',
      'Severe allergic reactions (extremely rare)'
    ],
    commonAge: 'First dose at birth, then at 6, 10, and 14 weeks'
  },
  {
    id: 'opv',
    name: 'OPV',
    fullName: 'Oral Polio Vaccine',
    scheduledAt: 'At birth, 6 weeks, 10 weeks, 14 weeks',
    description: 'Oral Polio Vaccine (OPV) is used to prevent poliomyelitis (polio), a highly infectious viral disease that can cause irreversible paralysis. It is given orally (by mouth).',
    benefits: [
      'Prevents polio infection and paralysis',
      'Easy to administer (oral drops)',
      'Induces intestinal immunity',
      'Helps in global polio eradication efforts'
    ],
    sideEffects: [
      'Very few side effects',
      'Vaccine-associated paralytic polio (extremely rare)',
      'Mild fever (uncommon)',
      'Vomiting or diarrhea (rare)'
    ],
    commonAge: 'First dose at birth, then at 6, 10, and 14 weeks'
  },
  {
    id: 'penta',
    name: 'Pentavalent',
    fullName: 'Diphtheria, Pertussis, Tetanus, Hepatitis B and Haemophilus influenzae type b',
    scheduledAt: '6 weeks, 10 weeks, 14 weeks',
    description: 'The pentavalent vaccine provides protection against five life-threatening diseases: diphtheria, pertussis, tetanus, hepatitis B and Haemophilus influenzae type b (Hib) infections.',
    benefits: [
      'Single injection protects against five diseases',
      'Reduces number of injections needed',
      'Prevents serious bacterial infections',
      'Cost-effective vaccination approach'
    ],
    sideEffects: [
      'Pain, redness or swelling at injection site',
      'Mild fever',
      'Irritability or fussiness',
      'Reduced appetite (temporary)'
    ],
    commonAge: 'Given at 6, 10, and 14 weeks of age'
  },
  {
    id: 'rotavirus',
    name: 'Rotavirus',
    fullName: 'Rotavirus Vaccine',
    scheduledAt: '6 weeks, 10 weeks, 14 weeks',
    description: 'Rotavirus vaccine protects against rotavirus infections, which are the leading cause of severe diarrhea in infants and young children worldwide. The vaccine is given orally.',
    benefits: [
      'Prevents rotavirus gastroenteritis',
      'Reduces severity of diarrheal illness',
      'Prevents hospitalization due to rotavirus',
      'Reduces mortality from diarrheal disease'
    ],
    sideEffects: [
      'Mild, temporary diarrhea or vomiting',
      'Irritability',
      'Fever',
      'Intussusception (extremely rare)'
    ],
    commonAge: 'Given at 6, 10, and 14 weeks of age'
  },
  {
    id: 'pcv',
    name: 'PCV',
    fullName: 'Pneumococcal Conjugate Vaccine',
    scheduledAt: '6 weeks, 10 weeks, 14 weeks',
    description: 'PCV (Pneumococcal Conjugate Vaccine) protects against Streptococcus pneumoniae bacteria, which can cause serious infections including pneumonia, meningitis, and sepsis.',
    benefits: [
      'Prevents pneumococcal pneumonia and invasive disease',
      'Prevents pneumococcal meningitis',
      'Reduces antibiotic resistance by preventing infections',
      'May provide some protection against ear infections'
    ],
    sideEffects: [
      'Pain, redness or swelling at injection site',
      'Mild fever',
      'Decreased appetite',
      'Irritability or drowsiness'
    ],
    commonAge: 'Given at 6, 10, and 14 weeks of age'
  },
  {
    id: 'ipv',
    name: 'IPV',
    fullName: 'Inactivated Polio Vaccine',
    scheduledAt: '14 weeks',
    description: 'IPV (Inactivated Polio Vaccine) is an injectable vaccine that protects against poliovirus. It is used in conjunction with OPV as part of the global polio eradication strategy.',
    benefits: [
      'Prevents paralytic poliomyelitis',
      'No risk of vaccine-associated paralytic polio',
      'Boosts immunity against all three poliovirus types',
      'Part of global polio eradication strategy'
    ],
    sideEffects: [
      'Pain or redness at injection site',
      'Low-grade fever (uncommon)',
      'Irritability',
      'Severe allergic reactions (extremely rare)'
    ],
    commonAge: 'Given at 14 weeks of age'
  },
  {
    id: 'mr',
    name: 'MR',
    fullName: 'Measles and Rubella Vaccine',
    scheduledAt: '9 months, 16-24 months',
    description: 'MR vaccine provides protection against measles and rubella, two highly contagious viral diseases. Measles can cause severe complications, while rubella infection during pregnancy can lead to birth defects.',
    benefits: [
      'Prevents measles infection and complications',
      'Prevents rubella (German measles)',
      'Prevents congenital rubella syndrome in newborns',
      'Helps eliminate measles and rubella globally'
    ],
    sideEffects: [
      'Mild fever',
      'Rash (uncommon)',
      'Temporary joint pain (mainly in adults)',
      'Swollen lymph nodes (rare)'
    ],
    commonAge: 'First dose at 9 months, second dose at 16-24 months'
  },
  {
    id: 'je',
    name: 'JE',
    fullName: 'Japanese Encephalitis Vaccine',
    scheduledAt: '9 months, 16-24 months',
    description: 'Japanese Encephalitis (JE) vaccine protects against JE virus, which is spread through mosquito bites. JE can cause brain inflammation and is common in parts of Asia.',
    benefits: [
      'Prevents Japanese encephalitis infection',
      'Reduces risk of brain inflammation and permanent disability',
      'Prevents death from JE',
      'Protects in areas where JE is endemic'
    ],
    sideEffects: [
      'Pain, redness or swelling at injection site',
      'Low-grade fever',
      'Headache',
      'Severe allergic reactions (extremely rare)'
    ],
    commonAge: 'First dose at 9 months, second dose at 16-24 months'
  },
  {
    id: 'dpt',
    name: 'DPT Booster',
    fullName: 'Diphtheria, Pertussis, Tetanus Booster',
    scheduledAt: '16-24 months',
    description: 'DPT booster provides additional protection against diphtheria, pertussis (whooping cough), and tetanus after the primary series of pentavalent vaccine.',
    benefits: [
      'Reinforces immunity against diphtheria, pertussis, and tetanus',
      'Extends duration of protection',
      'Prevents breakthrough infections',
      'Particularly important for maintaining pertussis immunity'
    ],
    sideEffects: [
      'Pain, redness or swelling at injection site',
      'Mild fever',
      'Fatigue',
      'Severe allergic reactions (extremely rare)'
    ],
    commonAge: 'Given at 16-24 months of age'
  }
];

export default function VaccinesExplore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeVaccine, setActiveVaccine] = useState<Vaccine | null>(null);
  
  // Filter vaccines based on search term
  const filteredVaccines = vaccineData.filter(vaccine => 
    vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vaccine.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <main className="bg-gray-950 min-h-screen text-white">
      <div className="px-4 py-6 pb-24 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-500" />
            Explore Vaccines
          </h1>
          <p className="text-gray-400 mt-1">
            Learn about vaccines in the National Immunization Schedule
          </p>
        </header>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-800 w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search vaccines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {activeVaccine ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{activeVaccine.name}</h2>
              <button
                onClick={() => setActiveVaccine(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="mb-4 pb-4 border-b border-gray-800">
              <p className="text-gray-300 font-medium">{activeVaccine.fullName}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/30 text-blue-400">
                {activeVaccine.scheduledAt}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  <h3 className="text-lg font-medium">About this Vaccine</h3>
                </div>
                <p className="text-gray-300">{activeVaccine.description}</p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <h3 className="text-lg font-medium">Benefits</h3>
                </div>
                <ul className="space-y-2">
                  {activeVaccine.benefits.map((benefit, index) => (
                    <li key={index} className="flex">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                  <h3 className="text-lg font-medium">Possible Side Effects</h3>
                </div>
                <ul className="space-y-2">
                  {activeVaccine.sideEffects.map((effect, index) => (
                    <li key={index} className="flex">
                      <span className="text-yellow-500 mr-2">•</span>
                      <span className="text-gray-300">{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-900/40">
                <p className="text-sm text-blue-300">
                  <strong>When is it given:</strong> {activeVaccine.commonAge}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVaccines.map((vaccine) => (
              <button
                key={vaccine.id}
                className="w-full text-left bg-gray-900 rounded-lg border border-gray-800 p-4 hover:border-blue-500 transition-colors"
                onClick={() => setActiveVaccine(vaccine)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold">{vaccine.name}</h2>
                    <p className="text-sm text-gray-400">{vaccine.fullName}</p>
                    <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                      {vaccine.scheduledAt}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            ))}
            
            {filteredVaccines.length === 0 && (
              <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-800">
                <Search className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                <h3 className="text-lg font-medium mb-1">No vaccines found</h3>
                <p className="text-gray-400">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
} 