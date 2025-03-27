'use client';

import React from 'react';
import { mockVaccines, mockVaccineSchedule } from '@/data/mock';
import { BottomNav } from '@/components/bottom-nav';
import { VaccineScheduleByAge } from '@/components/vaccine-schedule-by-age';
import { ChevronLeft, Download, Printer } from 'lucide-react';
import Link from 'next/link';

export default function VaccineSchedulePage() {
  // Function to handle schedule printing
  const handlePrint = () => {
    window.print();
  };
  
  // Function to handle schedule download as PDF
  // This is a placeholder - in a real app, you'd use a PDF generation library
  const handleDownload = () => {
    alert('Download functionality would be implemented with a PDF generation library');
  };
  
  return (
    <div className="pb-16">
      {/* Header */}
      <header className="bg-green-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center text-white">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-xl font-bold text-white">Vaccine Schedule</h1>
          <div className="w-16"></div> {/* Empty div for flex spacing */}
        </div>
      </header>
      
      <div className="p-4">
        <div className="space-y-6">
          {/* Introduction */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="text-lg font-semibold mb-2">National Immunization Schedule</h2>
            <p className="text-sm text-gray-300">
              The National Immunization Schedule (NIS) is a series of vaccines recommended for children and administered at specific ages to protect against serious diseases. Following this schedule is important for your child's health.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 bg-gray-800 rounded-lg text-white hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              <span>Print Schedule</span>
            </button>
            
            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-4 bg-gray-800 rounded-lg text-white hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
          
          {/* Vaccine Schedule */}
          <VaccineScheduleByAge
            vaccines={mockVaccines}
            vaccineSchedule={mockVaccineSchedule}
          />
          
          {/* Additional Information */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h3 className="text-md font-semibold mb-2">Important Information</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                • Always consult with your healthcare provider for personalized vaccination advice.
              </p>
              <p>
                • Vaccines may be delayed or adjusted based on your child's specific health conditions.
              </p>
              <p>
                • Some vaccines may cause mild side effects which typically resolve within a few days.
              </p>
              <p>
                • Keeping track of your child's vaccination record is important for school enrollment and healthcare visits.
              </p>
              <p>
                • If your child misses a scheduled vaccine, talk to your healthcare provider about catch-up vaccinations.
              </p>
            </div>
          </div>
          
          {/* Resources */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h3 className="text-md font-semibold mb-2">Additional Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.who.int/immunization/en/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                  World Health Organization (WHO) - Immunization
                </a>
              </li>
              <li>
                <a href="https://www.unicef.org/immunization" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                  UNICEF - Immunization Programme
                </a>
              </li>
              <li>
                <a href="https://www.cdc.gov/vaccines/schedules/index.html" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                  CDC - Immunization Schedules
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
} 