'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Info, Calculator } from 'lucide-react';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';

const GIRCalculatorPage = () => {
  // Form state
  const [weight, setWeight] = useState<string>('');
  const [glucoseConcentration, setGlucoseConcentration] = useState<string>('10');
  const [flowRate, setFlowRate] = useState<string>('');
  const [totalFluid, setTotalFluid] = useState<string>('');
  
  // Results state
  const [girResult, setGirResult] = useState<number | null>(null);
  const [dailyDextrose, setDailyDextrose] = useState<number | null>(null);
  
  // Calculation method state
  const [calculationMethod, setCalculationMethod] = useState<'flow-rate' | 'total-fluid'>('flow-rate');
  
  // Calculator info state
  const [showInfo, setShowInfo] = useState(false);
  
  // GIR Calculation function
  const calculateGIR = useCallback(() => {
    // Reset results
    setGirResult(null);
    setDailyDextrose(null);
    
    // Validate inputs
    const weightValue = parseFloat(weight);
    const glucoseValue = parseFloat(glucoseConcentration);
    
    if (isNaN(weightValue) || weightValue <= 0 || isNaN(glucoseValue) || glucoseValue <= 0) {
      return;
    }
    
    if (calculationMethod === 'flow-rate') {
      const flowRateValue = parseFloat(flowRate);
      if (isNaN(flowRateValue) || flowRateValue <= 0) {
        return;
      }
      
      // Calculate GIR using flow rate method
      // GIR (mg/kg/min) = (% glucose × flow rate (mL/hr) × 1000) / (weight (kg) × 60)
      const girMgKgMin = (glucoseValue * flowRateValue * 1000) / (weightValue * 60);
      setGirResult(parseFloat(girMgKgMin.toFixed(2)));
      
      // Calculate daily dextrose amount (g)
      const dailyDextroseGrams = (flowRateValue * 24 * glucoseValue) / 100;
      setDailyDextrose(parseFloat(dailyDextroseGrams.toFixed(2)));
      
    } else if (calculationMethod === 'total-fluid') {
      const totalFluidValue = parseFloat(totalFluid);
      if (isNaN(totalFluidValue) || totalFluidValue <= 0) {
        return;
      }
      
      // Calculate GIR using total fluid method
      // GIR (mg/kg/min) = (% glucose × total fluid (mL/day) × 1000) / (weight (kg) × 1440)
      const girMgKgMin = (glucoseValue * totalFluidValue * 1000) / (weightValue * 1440);
      setGirResult(parseFloat(girMgKgMin.toFixed(2)));
      
      // Calculate daily dextrose amount (g)
      const dailyDextroseGrams = (totalFluidValue * glucoseValue) / 100;
      setDailyDextrose(parseFloat(dailyDextroseGrams.toFixed(2)));
    }
  }, [weight, glucoseConcentration, flowRate, totalFluid, calculationMethod]);
  
  // Effect for automatic calculation when inputs change
  useEffect(() => {
    calculateGIR();
  }, [calculateGIR]);
  
  // Interpretation of GIR result
  const getGIRInterpretation = () => {
    if (girResult === null) return null;
    
    if (girResult < 4) {
      return {
        status: 'Low',
        color: 'text-yellow-500',
        message: 'This GIR may be insufficient for many patients, especially neonates or patients with increased glucose requirements.'
      };
    } else if (girResult >= 4 && girResult < 6) {
      return {
        status: 'Baseline',
        color: 'text-green-500',
        message: 'This is a standard maintenance GIR for most pediatric patients.'
      };
    } else if (girResult >= 6 && girResult < 8) {
      return {
        status: 'Moderate',
        color: 'text-blue-500',
        message: 'Moderate GIR often used for hyperinsulinemic states or increased metabolic demands.'
      };
    } else if (girResult >= 8 && girResult < 12) {
      return {
        status: 'High',
        color: 'text-orange-500',
        message: 'High GIR commonly used for persistent hypoglycemia or severe hyperinsulinism.'
      };
    } else {
      return {
        status: 'Very High',
        color: 'text-red-500',
        message: 'This is a very high GIR. Monitor closely for hyperglycemia, fluid overload, and electrolyte disturbances.'
      };
    }
  };
  
  // Get interpretation result
  const interpretation = getGIRInterpretation();
  
  return (
    <div className="pb-16 bg-black text-white min-h-screen">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/tools" className="mr-4">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>
              <h1 className="text-lg font-semibold">GIR Calculator</h1>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              title="Information about GIR"
            >
              <Info className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Info Card */}
        {showInfo && (
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-2">About GIR</h2>
            <p className="text-sm text-gray-300 mb-2">
              The Glucose Infusion Rate (GIR) is a calculation of the rate at which glucose is being delivered to a patient, expressed in mg/kg/min.
            </p>
            <p className="text-sm text-gray-300 mb-2">
              GIR is particularly important in:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 mb-3">
              <li>Managing hypoglycemia in neonates and children</li>
              <li>Evaluating glucose needs in hyperinsulinemic states</li>
              <li>Adjusting parenteral nutrition</li>
              <li>Determining appropriate IV fluid therapy</li>
            </ul>
            <div className="bg-gray-800 p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">Calculation Formula:</p>
              <p className="text-sm font-mono">
                GIR (mg/kg/min) = (% glucose × flow rate (mL/hr) × 1000) / (weight (kg) × 60)
              </p>
              <p className="text-xs text-gray-400 mt-2 mb-1">Or using total daily fluid:</p>
              <p className="text-sm font-mono">
                GIR (mg/kg/min) = (% glucose × total fluid (mL/day) × 1000) / (weight (kg) × 1440)
              </p>
            </div>
          </div>
        )}

        {/* Calculator */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold">GIR Calculator</h2>
            <p className="text-sm text-gray-400">Calculate glucose infusion rate based on IV fluid parameters</p>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Weight input */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">
                Patient Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 text-white"
                placeholder="Enter weight"
                min="0"
                step="0.1"
              />
            </div>
            
            {/* Glucose concentration */}
            <div>
              <label htmlFor="concentration" className="block text-sm font-medium text-gray-300 mb-1">
                Glucose Concentration (%)
              </label>
              <select
                id="concentration"
                value={glucoseConcentration}
                onChange={(e) => setGlucoseConcentration(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 text-white"
              >
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="12.5">12.5%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
                <option value="50">50%</option>
              </select>
            </div>
            
            {/* Calculation method toggle */}
            <div className="border-t border-gray-800 pt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Calculation Method
              </label>
              <div className="flex rounded-md overflow-hidden border border-gray-700">
                <button
                  onClick={() => setCalculationMethod('flow-rate')}
                  className={`flex-1 py-2 text-sm font-medium ${
                    calculationMethod === 'flow-rate'
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Flow Rate
                </button>
                <button
                  onClick={() => setCalculationMethod('total-fluid')}
                  className={`flex-1 py-2 text-sm font-medium ${
                    calculationMethod === 'total-fluid'
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Total Fluid
                </button>
              </div>
            </div>
            
            {/* Flow rate or total fluid input based on method */}
            {calculationMethod === 'flow-rate' ? (
              <div>
                <label htmlFor="flow-rate" className="block text-sm font-medium text-gray-300 mb-1">
                  Flow Rate (mL/hr)
                </label>
                <input
                  type="number"
                  id="flow-rate"
                  value={flowRate}
                  onChange={(e) => setFlowRate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 text-white"
                  placeholder="Enter flow rate"
                  min="0"
                  step="0.1"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="total-fluid" className="block text-sm font-medium text-gray-300 mb-1">
                  Total Fluid (mL/day)
                </label>
                <input
                  type="number"
                  id="total-fluid"
                  value={totalFluid}
                  onChange={(e) => setTotalFluid(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 text-white"
                  placeholder="Enter total fluid"
                  min="0"
                  step="1"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Results Card */}
        {girResult !== null && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden animate-fadeIn">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-green-500" />
                Results
              </h2>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Main GIR result */}
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Glucose Infusion Rate</p>
                <div className="text-3xl font-bold mt-1">{girResult} mg/kg/min</div>
                {interpretation && (
                  <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${interpretation.color} bg-opacity-20 bg-gray-700`}>
                    {interpretation.status}
                  </div>
                )}
              </div>
              
              {/* Daily dextrose */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Total Daily Dextrose</p>
                  <p className="text-lg font-semibold">{dailyDextrose} g</p>
                </div>
              </div>
              
              {/* Interpretation */}
              {interpretation && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 font-medium mb-2">Clinical Interpretation</p>
                  <p className="text-sm text-gray-400">{interpretation.message}</p>
                </div>
              )}
              
              {/* Clinical notes */}
              <div className="border-t border-gray-800 pt-4">
                <p className="text-sm text-gray-300 font-medium mb-2">Clinical Notes</p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="block w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                    <span className="text-gray-400">Standard maintenance GIR for neonates: 4-6 mg/kg/min</span>
                  </li>
                  <li className="flex items-start">
                    <span className="block w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                    <span className="text-gray-400">Higher rates (8-15 mg/kg/min) may be needed for persistent hypoglycemia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="block w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                    <span className="text-gray-400">Monitor for hyperglycemia when GIR &gt; 12 mg/kg/min</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default GIRCalculatorPage; 