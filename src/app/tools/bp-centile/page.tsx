'use client';

import React, { useState, useEffect } from 'react';
import { bpCentileTable, findNearestIndex, calculateMAP, findHeightPercentile, getCentileValues } from '@/utils/bp-utils';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

export default function BPCentilePage() {
  const [sex, setSex] = useState('boys');
  const [age, setAge] = useState<number | string>(1);
  const [height, setHeight] = useState<number | string>(75);
  const [centileValues, setCentileValues] = useState<any>(null);

  useEffect(() => {
    // Convert string values to numbers and validate
    const numericAge = typeof age === 'string' ? parseInt(age) || 1 : age;
    const numericHeight = typeof height === 'string' ? parseInt(height) || 75 : height;
    
    if (sex && !isNaN(numericAge) && !isNaN(numericHeight)) {
      const values = getCentileValues(sex as 'boys' | 'girls', numericAge, numericHeight);
      setCentileValues(values);
    }
  }, [sex, age, height]);

  const handlePrint = () => {
    window.print();
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAge(value === '' ? '' : parseInt(value) || 1);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHeight(value === '' ? '' : parseInt(value) || 75);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            <span>Print</span>
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6">BP Centile Calculator</h1>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label htmlFor="sexInput" className="block text-sm font-medium text-gray-300 mb-1">
              Sex
            </label>
            <select
              id="sexInput"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
            </select>
          </div>

          <div>
            <label htmlFor="ageInput" className="block text-sm font-medium text-gray-300 mb-1">
              Age (years)
            </label>
            <input
              type="number"
              id="ageInput"
              value={age.toString()}
              onChange={handleAgeChange}
              min="1"
              max="16"
              step="1"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="heightInput" className="block text-sm font-medium text-gray-300 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              id="heightInput"
              value={height.toString()}
              onChange={handleHeightChange}
              min="50"
              step="0.1"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Results */}
        {centileValues && centileValues !== "Invalid age" && centileValues !== "Invalid height data" && (
          <div className="space-y-6">
            {/* Height Information */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h2 className="text-lg font-semibold mb-3">Height Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">50th Percentile Height for Age {typeof age === 'string' ? parseInt(age) || 1 : age}</p>
                  <p className="text-lg font-medium">{centileValues.height50thPercentile} cm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Height Percentile</p>
                  <p className="text-lg font-medium">{centileValues.heightPercentile}</p>
                </div>
              </div>
            </div>

            {/* BP Centile Table */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h2 className="text-lg font-semibold mb-3">Blood Pressure Centiles</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-2 px-4">Centile</th>
                      <th className="text-right py-2 px-4">SBP (mmHg)</th>
                      <th className="text-right py-2 px-4">DBP (mmHg)</th>
                      <th className="text-right py-2 px-4">MAP (mmHg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 px-4">5th</td>
                      <td className="text-right py-2 px-4">{centileValues.sbp5}</td>
                      <td className="text-right py-2 px-4">{centileValues.dbp5}</td>
                      <td className="text-right py-2 px-4">{centileValues.map5}</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 px-4">50th</td>
                      <td className="text-right py-2 px-4">{centileValues.sbp50}</td>
                      <td className="text-right py-2 px-4">{centileValues.dbp50}</td>
                      <td className="text-right py-2 px-4">{centileValues.map50}</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 px-4">90th</td>
                      <td className="text-right py-2 px-4">{centileValues.sbp90}</td>
                      <td className="text-right py-2 px-4">{centileValues.dbp90}</td>
                      <td className="text-right py-2 px-4">{centileValues.map90}</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 px-4">95th</td>
                      <td className="text-right py-2 px-4">{centileValues.sbp95}</td>
                      <td className="text-right py-2 px-4">{centileValues.dbp95}</td>
                      <td className="text-right py-2 px-4">{centileValues.map95}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">95th+12</td>
                      <td className="text-right py-2 px-4">{centileValues.sbp9512}</td>
                      <td className="text-right py-2 px-4">{centileValues.dbp9512}</td>
                      <td className="text-right py-2 px-4">{centileValues.map9512}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Source Citation */}
            <p className="text-sm text-gray-400">Source: AAP Guidelines</p>
          </div>
        )}
      </div>
    </div>
  );
} 