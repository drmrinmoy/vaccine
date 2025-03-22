'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, TrendingUp, Edit, User, Info } from 'lucide-react';
import { mockChildren } from '@/data/mock';
import { formatAge } from '@/utils/vaccine-utils';
import { Child } from '@/types';
import { BottomNav } from '@/components/bottom-nav';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type GrowthChartType = 'height' | 'weight' | 'head' | 'bmi';

// Main component with Suspense boundary
const GrowthPage = () => {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading growth charts...</div>}>
      <GrowthContent />
    </Suspense>
  );
};

// Content component that uses useSearchParams
const GrowthContent = () => {
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  
  // Get child ID from URL (we'll use the first child for now as example)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [activeChart, setActiveChart] = useState<GrowthChartType>('height');
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | '2y' | 'all'>('1y');

  // Load the selected child
  useEffect(() => {
    // Get child from URL parameter
    if (childId) {
      const child = mockChildren.find(c => c.id === childId);
      if (child) {
        setSelectedChild(child);
        return;
      }
    }
    
    // Fallback to first child if no valid child ID provided
    if (mockChildren.length > 0) {
      setSelectedChild(mockChildren[0]);
    }
  }, [childId]);

  // Generate mock growth data based on the child's current metrics
  const generateMockGrowthData = (
    child: Child,
    type: GrowthChartType,
    months: number
  ): { dates: string[]; values: number[]; percentile50: number[]; percentile75: number[]; percentile25: number[] } => {
    if (!child) {
      return { dates: [], values: [], percentile50: [], percentile75: [], percentile25: [] };
    }

    const dates: string[] = [];
    const values: number[] = [];
    const percentile50: number[] = [];
    const percentile75: number[] = [];
    const percentile25: number[] = [];

    // Calculate child's age in months
    const birthDate = new Date(child.dateOfBirth);
    const now = new Date();
    const ageInMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + now.getMonth() - birthDate.getMonth();
    
    // Get current value based on type
    let currentValue = 0;
    let growthRate = 0;
    
    switch (type) {
      case 'height':
        currentValue = child.height || 85;
        growthRate = 0.8; // cm per month
        break;
      case 'weight':
        currentValue = child.weight || 12.5;
        growthRate = 0.25; // kg per month
        break;
      case 'head':
        currentValue = child.headCircumference || 48.2;
        growthRate = 0.15; // cm per month
        break;
      case 'bmi':
        currentValue = child.weight && child.height 
          ? child.weight / Math.pow(child.height / 100, 2) 
          : 17.3;
        growthRate = 0.05; // BMI points per month
        break;
    }

    // Generate data points, working backwards from current value
    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      dates.unshift(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      
      // Add some randomness to make the chart look more realistic
      const randomVariation = (Math.random() - 0.5) * growthRate * 0.5;
      const value = currentValue - (growthRate * i) + randomVariation;
      values.unshift(parseFloat(value.toFixed(1)));
      
      // Add percentile lines
      percentile50.unshift(parseFloat((value * 1.0).toFixed(1)));
      percentile75.unshift(parseFloat((value * 1.08).toFixed(1)));
      percentile25.unshift(parseFloat((value * 0.92).toFixed(1)));
    }

    return { dates, values, percentile50, percentile75, percentile25 };
  };

  // Prepare chart data
  const prepareChartData = (child: Child | null, type: GrowthChartType, range: '6m' | '1y' | '2y' | 'all'): ChartData<'line'> => {
    if (!child) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Determine how many months of data to show based on range
    let months = 12;
    switch (range) {
      case '6m': months = 6; break;
      case '1y': months = 12; break;
      case '2y': months = 24; break;
      case 'all': 
        // Calculate child's age in months
        const birthDate = new Date(child.dateOfBirth);
        const now = new Date();
        months = (now.getFullYear() - birthDate.getFullYear()) * 12 + now.getMonth() - birthDate.getMonth();
        break;
    }

    const { dates, values, percentile50, percentile75, percentile25 } = generateMockGrowthData(child, type, months);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Child\'s Growth',
          data: values,
          borderColor: 'rgb(74, 222, 128)',
          backgroundColor: 'rgba(74, 222, 128, 0.5)',
          tension: 0.3,
          borderWidth: 3,
        },
        {
          label: '75th Percentile',
          data: percentile75,
          borderColor: 'rgba(148, 163, 184, 0.7)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          tension: 0.1,
          borderDash: [5, 5],
        },
        {
          label: '50th Percentile',
          data: percentile50,
          borderColor: 'rgba(148, 163, 184, 0.7)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          tension: 0.1,
          borderDash: [5, 5],
        },
        {
          label: '25th Percentile',
          data: percentile25,
          borderColor: 'rgba(148, 163, 184, 0.7)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          tension: 0.1,
          borderDash: [5, 5],
        }
      ]
    };
  };

  // Chart options
  const getChartOptions = (type: GrowthChartType) => {
    let title = '';
    let unit = '';
    
    switch (type) {
      case 'height':
        title = 'Height Growth Chart';
        unit = 'cm';
        break;
      case 'weight':
        title = 'Weight Growth Chart';
        unit = 'kg';
        break;
      case 'head':
        title = 'Head Circumference Growth Chart';
        unit = 'cm';
        break;
      case 'bmi':
        title = 'BMI Growth Chart';
        unit = '';
        break;
    }
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            color: '#e5e7eb',
            boxWidth: 12,
            padding: 15
          }
        },
        title: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#ffffff',
          bodyColor: '#e5e7eb',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 10,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${context.parsed.y} ${unit}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(75, 85, 99, 0.2)'
          },
          ticks: {
            color: '#9ca3af'
          }
        },
        y: {
          grid: {
            color: 'rgba(75, 85, 99, 0.2)'
          },
          ticks: {
            color: '#9ca3af',
            callback: (value: any) => `${value} ${unit}`
          }
        }
      }
    };
  };

  // Get chart data based on active chart and time range
  const chartData = prepareChartData(selectedChild, activeChart, timeRange);
  const chartOptions = getChartOptions(activeChart);

  // Get title and current value for the selected chart
  const getChartTitle = (type: GrowthChartType): string => {
    switch (type) {
      case 'height':
        return 'Height';
      case 'weight':
        return 'Weight';
      case 'head':
        return 'Head Circumference';
      case 'bmi':
        return 'BMI';
    }
  };

  const getCurrentValue = (child: Child | null, type: GrowthChartType): string => {
    if (!child) return '—';
    
    switch (type) {
      case 'height':
        return child.height ? `${child.height} cm` : '—';
      case 'weight':
        return child.weight ? `${child.weight} kg` : '—';
      case 'head':
        return child.headCircumference ? `${child.headCircumference} cm` : '—';
      case 'bmi':
        return child.weight && child.height 
          ? `${(child.weight / Math.pow(child.height / 100, 2)).toFixed(1)}` 
          : '—';
    }
  };

  return (
    <div className="pb-16">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <h1 className="text-xl font-semibold">Growth Charts</h1>
            
            {/* Child Selector Dropdown */}
            {mockChildren.length > 1 && (
              <div className="ml-auto relative">
                <select
                  className="bg-gray-800 border border-gray-700 rounded-lg py-1 pl-3 pr-8 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={selectedChild?.id || ''}
                  onChange={(e) => {
                    const childId = e.target.value;
                    const child = mockChildren.find(c => c.id === childId);
                    setSelectedChild(child || null);
                  }}
                >
                  {mockChildren.map(child => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Child Information */}
        {selectedChild && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 mb-6">
            <div className="flex items-center p-4">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedChild.name}</h2>
                <p className="text-sm text-gray-400">
                  {formatAge(selectedChild.dateOfBirth)} • {selectedChild.gender}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chart Type Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2 mb-4">
          {(['height', 'weight', 'head', 'bmi'] as GrowthChartType[]).map(chartType => (
            <button
              key={chartType}
              onClick={() => setActiveChart(chartType)}
              className={`px-3 py-2 rounded-lg whitespace-nowrap ${
                activeChart === chartType
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {getChartTitle(chartType)}
            </button>
          ))}
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            {getChartTitle(activeChart)} Growth
            <span className="ml-2 text-xl font-bold text-green-500">
              {getCurrentValue(selectedChild, activeChart)}
            </span>
          </div>
          
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {(['6m', '1y', '2y', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 py-1 text-xs rounded ${
                  timeRange === range
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range === 'all' ? 'All' : range}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6">
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Growth Insights */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6">
          <div className="flex items-center mb-3">
            <Info className="w-5 h-5 mr-2 text-green-500" />
            <h3 className="text-lg font-semibold">Growth Insights</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></div>
              <p className="text-sm text-gray-300">
                Your child&apos;s {activeChart === 'bmi' ? 'BMI' : activeChart} is currently at the {activeChart === 'height' ? '75th' : activeChart === 'weight' ? '65th' : activeChart === 'head' ? '55th' : '60th'} percentile, which is within the normal range.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></div>
              <p className="text-sm text-gray-300">
                {activeChart === 'height' && "Over the past 3 months, your child has grown 2.5 cm in height, which is consistent with expected growth patterns."}
                {activeChart === 'weight' && "Over the past 3 months, your child has gained 1.2 kg, which is appropriate for their age and height."}
                {activeChart === 'head' && "Head circumference has increased 0.5 cm in the last 3 months, which is normal for their age."}
                {activeChart === 'bmi' && "Their BMI has remained stable and within the healthy range over the past 6 months."}
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></div>
              <p className="text-sm text-gray-300">
                {activeChart === 'height' && "Expected growth rate for a child this age is approximately 7-9 cm per year."}
                {activeChart === 'weight' && "Expected weight gain for a child this age is approximately 2-3 kg per year."}
                {activeChart === 'head' && "Head circumference growth slows down after age 2, with about 1-2 cm growth per year."}
                {activeChart === 'bmi' && "A healthy BMI for a child this age typically ranges from 14 to 17, with your child's BMI being well within this range."}
              </p>
            </div>
          </div>
        </div>

        {/* Growth History Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <h3 className="text-lg font-semibold mb-3">Recent Measurements</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Age</th>
                  <th className="py-2 px-2">Height</th>
                  <th className="py-2 px-2">Weight</th>
                  <th className="py-2 px-2">Head</th>
                  <th className="py-2 px-2">BMI</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-2">Jun 15, 2023</td>
                  <td className="py-3 px-2">2 years</td>
                  <td className="py-3 px-2">85 cm</td>
                  <td className="py-3 px-2">12.5 kg</td>
                  <td className="py-3 px-2">48.2 cm</td>
                  <td className="py-3 px-2">17.3</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-2">Mar 10, 2023</td>
                  <td className="py-3 px-2">1 year 9 months</td>
                  <td className="py-3 px-2">82.5 cm</td>
                  <td className="py-3 px-2">11.3 kg</td>
                  <td className="py-3 px-2">47.7 cm</td>
                  <td className="py-3 px-2">16.6</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-2">Dec 05, 2022</td>
                  <td className="py-3 px-2">1 year 6 months</td>
                  <td className="py-3 px-2">80.1 cm</td>
                  <td className="py-3 px-2">10.8 kg</td>
                  <td className="py-3 px-2">47.2 cm</td>
                  <td className="py-3 px-2">16.8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default GrowthPage; 