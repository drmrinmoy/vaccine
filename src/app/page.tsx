'use client';

import React from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { Shield, ChevronRight, Syringe, User } from 'lucide-react';
import { mockUserProfile } from '@/data/mock';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-gray-950 min-h-screen text-white">
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome to Health Companion</h1>
          <p className="text-gray-400">Your all-in-one solution for child health tracking</p>
        </header>

        {/* Main Features */}
        <section className="space-y-6">
          {/* Vaccine Dashboard Card */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
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
              className="flex items-center justify-center w-full bg-green-600 hover:bg-green-500 text-white py-3 px-4 rounded-lg mt-2"
            >
              Go to Vaccination Dashboard
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* Explore Vaccines Card */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
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
              className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg mt-2"
            >
              Explore Vaccines
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* About Section */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-start mb-4">
              <div className="bg-purple-900/30 p-3 rounded-lg mr-4">
                <User className="h-7 w-7 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Your Health Companion</h2>
                <p className="text-gray-400 mt-1">
                  This app helps parents track their children's vaccination schedules and learn
                  about important health information. Stay on top of your child's health journey.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <BottomNav />
    </main>
  );
} 