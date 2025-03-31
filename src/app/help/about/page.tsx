'use client';

import React from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { Shield, ArrowLeft, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AboutNIS() {
  return (
    <main className="bg-gray-950 min-h-screen text-white">
      <div className="px-4 py-6 pb-24 max-w-7xl mx-auto">
        <header className="mb-8">
          <Link href="/profile" className="flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Profile
          </Link>
          
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-500" />
            National Immunization Schedule
          </h1>
          <p className="text-gray-400 mt-1">
            Understanding the vaccination schedule and its importance
          </p>
        </header>
        
        <div className="space-y-6">
          <section className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">What is the National Immunization Schedule?</h2>
            <p className="text-gray-300 mb-4">
              The National Immunization Schedule (NIS) is a comprehensive vaccination timetable designed to protect 
              children from vaccine-preventable diseases. It specifies which vaccines should be administered at what ages 
              to provide optimal protection against serious childhood illnesses.
            </p>
            <p className="text-gray-300">
              This schedule is developed by health experts based on scientific evidence, taking into account when children 
              are most vulnerable to diseases and when their immune systems will generate the best response to vaccines.
            </p>
          </section>
          
          <section className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Why Vaccination is Important</h2>
            <div className="space-y-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Prevents Serious Diseases</h3>
                  <p className="text-gray-300 text-sm">
                    Vaccines protect children from serious and potentially life-threatening diseases including polio, measles, 
                    diphtheria, pertussis (whooping cough), tetanus, and many others.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Protects the Community</h3>
                  <p className="text-gray-300 text-sm">
                    When a significant portion of the population is vaccinated, it helps to protect those who cannot be vaccinated, 
                    such as infants, the elderly, and immunocompromised individuals. This is known as "herd immunity."
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Cost-Effective Healthcare</h3>
                  <p className="text-gray-300 text-sm">
                    Preventing diseases through vaccination is more cost-effective than treating these diseases after they occur. 
                    Vaccines help reduce healthcare costs and the economic burden of disease.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Disease Eradication</h3>
                  <p className="text-gray-300 text-sm">
                    Widespread vaccination has led to the eradication of smallpox and the near-elimination of polio globally. 
                    Continued vaccination efforts can potentially eliminate other diseases as well.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Key Vaccination Milestones</h2>
            <div className="space-y-4">
              <div className="flex">
                <Calendar className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">At Birth</h3>
                  <p className="text-gray-300 text-sm">
                    BCG (for TB), Hepatitis B (first dose), and Oral Polio Vaccine (OPV) zero dose are administered.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <Calendar className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">6, 10, and 14 Weeks</h3>
                  <p className="text-gray-300 text-sm">
                    Primary series of vaccines including OPV, Pentavalent vaccine (for diphtheria, tetanus, pertussis, hepatitis B, and Hib), 
                    Rotavirus vaccine, and Pneumococcal Conjugate Vaccine (PCV).
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <Calendar className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">9 Months</h3>
                  <p className="text-gray-300 text-sm">
                    Measles-Rubella (MR) vaccine, Japanese Encephalitis (JE) vaccine in endemic areas, and the first dose of Vitamin A.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <Calendar className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">16-24 Months</h3>
                  <p className="text-gray-300 text-sm">
                    DPT booster, second dose of Measles-Rubella vaccine, OPV booster, and second dose of JE vaccine.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <Calendar className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Later Childhood and Adolescence</h3>
                  <p className="text-gray-300 text-sm">
                    Typhoid Conjugate Vaccine (TCV) at 9-12 years and Td (Tetanus and diphtheria) vaccine at 10 and 16 years.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="bg-blue-900/20 rounded-lg border border-blue-900/40 p-6">
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-blue-500 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold mb-2">Important Note</h2>
                <p className="text-gray-300 text-sm">
                  This app is designed to help you track your child's vaccinations according to the National Immunization Schedule. 
                  However, individual vaccination needs may vary based on health status, location, and other factors. 
                  Always consult with your healthcare provider for personalized vaccination advice for your child.
                </p>
              </div>
            </div>
          </section>
          
          <div className="flex justify-center">
            <Link 
              href="/explore/vaccines" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
            >
              <Shield className="h-5 w-5 mr-2" />
              Explore Vaccine Details
            </Link>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
} 