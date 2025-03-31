'use client';

import React from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { Shield, ChevronRight, Syringe, User, Brain, Star, AlertCircle } from 'lucide-react';
import { mockUserProfile } from '@/data/mock';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen text-white">
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-block bg-gradient-to-r from-green-500 to-blue-500 p-px rounded-lg mb-4">
            <div className="bg-gray-950 rounded-lg p-2">
              <Syringe className="h-8 w-8 mx-auto text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">Vaccine AI Companion</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Your intelligent solution for vaccination information and support
          </p>
        </header>

        {/* Project Status Banner */}
        <div className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-4 mb-8 flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
          <p className="text-blue-200 text-sm">
            This project is currently under development. We appreciate your feedback as we continue to improve.
          </p>
        </div>

        {/* About App Banner */}
        <div className="mb-10 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-lg border border-indigo-800/50 p-6">
          <h2 className="text-xl font-semibold mb-3 text-indigo-300">Designed for Pediatricians</h2>
          <p className="text-gray-300 leading-relaxed">
            Health Companion is built to help pediatricians easily follow NIS and IAP vaccination guidelines, 
            implement catch-up vaccination protocols, and manage vaccinations in special situations. 
            We leverage artificial intelligence to process vaccination data, providing accurate 
            and timely recommendations tailored to each child's specific needs.
          </p>
        </div>

        {/* Main Features */}
        <section className="space-y-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Key Features</h2>
        
          {/* Vaccine Dashboard Card */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-800 p-6 transition-all hover:border-green-800/70 hover:shadow-md hover:shadow-green-900/20">
            <div className="flex items-start mb-4">
              <div className="bg-green-900/30 p-3 rounded-lg mr-4">
                <Syringe className="h-7 w-7 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Child Vaccination Dashboard</h2>
                <p className="text-gray-400 mt-1">
                  Track your child's vaccines according to the National Immunization Schedule. 
                  Add children, manage their information, and see pending vaccinations.
                </p>
              </div>
            </div>
            <Link 
              href="/dashboard"
              className="flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-3 px-4 rounded-lg mt-2 transition-colors"
            >
              Go to Vaccination Dashboard
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* Explore Vaccines Card */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-800 p-6 transition-all hover:border-blue-800/70 hover:shadow-md hover:shadow-blue-900/20">
            <div className="flex items-start mb-4">
              <div className="bg-blue-900/30 p-3 rounded-lg mr-4">
                <Shield className="h-7 w-7 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Explore Vaccines</h2>
                <p className="text-gray-400 mt-1">
                  Learn about different vaccines, their recommended schedules, benefits,
                  and possible side effects based on medical guidelines.
                </p>
              </div>
            </div>
            <Link 
              href="/explore/vaccines"
              className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 px-4 rounded-lg mt-2 transition-colors"
            >
              Explore Vaccines
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* AI-Powered Features */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-800 p-6 transition-all hover:border-purple-800/70 hover:shadow-md hover:shadow-purple-900/20">
            <div className="flex items-start mb-4">
              <div className="bg-purple-900/30 p-3 rounded-lg mr-4">
                <Brain className="h-7 w-7 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI-Powered Vaccination Support</h2>
                <p className="text-gray-400 mt-1">
                  Our AI processes vaccination data to provide accurate recommendations for
                  catch-up schedules and special situations, ensuring every child stays protected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Medical Advisor Section */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Medical Advisor
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-28 h-28 md:w-32 md:h-32 overflow-hidden rounded-full border-2 border-indigo-500/30">
              <Image 
                src="/cm.png" 
                alt="Dr. Chandra Mohan Kumar" 
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h3 className="text-xl font-medium text-indigo-300 mb-1">Dr. Chandra Mohan Kumar</h3>
              <p className="text-gray-400 font-medium">
                Head of Department, Pediatrics<br />
                All India Institute of Medical Sciences (AIIMS), Patna
              </p>
              <p className="text-gray-400 mt-3 leading-relaxed">
                Expert guidance and medical oversight for our vaccination protocols and health recommendations.
                Dr. Kumar brings years of pediatric expertise to ensure our platform delivers the most accurate
                and up-to-date vaccination information based on NIS and IAP guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
} 