'use client';

import React, { useState } from 'react';
import { Child, Vaccine, VaccineDose } from '@/types';
import { Check, Shield, Calendar, Clock, Search, Download, Filter, ChevronDown } from 'lucide-react';

interface VaccineRecordTableProps {
  child: Child;
  vaccines: Vaccine[];
  onDeleteDose?: (doseId: string) => void;
}

export function VaccineRecordTable({ child, vaccines, onDeleteDose }: VaccineRecordTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Get all administered vaccines
  const administeredVaccines = new Map<string, number>();
  child.vaccineHistory.forEach(dose => {
    const count = administeredVaccines.get(dose.vaccineId) || 0;
    administeredVaccines.set(dose.vaccineId, count + 1);
  });
  
  // Create a record of all vaccines whether administered or not
  const vaccineRecords = vaccines.map(vaccine => {
    const administeredDoses = child.vaccineHistory.filter(dose => dose.vaccineId === vaccine.id);
    const administered = administeredDoses.length;
    const isComplete = administered >= vaccine.doseCount;
    
    return {
      vaccine,
      administered,
      total: vaccine.doseCount,
      isComplete,
      doses: administeredDoses.map(dose => ({
        ...dose,
        vaccineName: vaccine.name
      })),
      status: isComplete ? 'completed' : administered > 0 ? 'partial' : 'pending'
    };
  });
  
  // Combine all doses for display in chronological order
  const allDoses = vaccineRecords
    .flatMap(record => record.doses)
    .sort((a, b) => {
      // Sort by date if available, otherwise keep original order
      if (!a.dateAdministered && !b.dateAdministered) return 0;
      if (!a.dateAdministered) return 1;
      if (!b.dateAdministered) return -1;
      return new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime();
    });
  
  // Apply search filter
  const filteredDoses = allDoses.filter(dose => {
    const matchesSearch = searchQuery === '' || 
      dose.vaccineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dose.administeredBy && dose.administeredBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dose.notes && dose.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });
  
  // Filter by completeness
  const displayVaccineRecords = vaccineRecords.filter(record => {
    if (filterBy === 'all') return true;
    if (filterBy === 'completed') return record.isComplete;
    if (filterBy === 'pending') return !record.isComplete;
    return true;
  });
  
  // Sort vaccine records
  const sortedVaccineRecords = [...displayVaccineRecords].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.vaccine.name.localeCompare(b.vaccine.name)
        : b.vaccine.name.localeCompare(a.vaccine.name);
    } else if (sortBy === 'status') {
      // Status order: pending -> partial -> completed
      const statusOrder = { 'pending': 0, 'partial': 1, 'completed': 2 };
      const orderA = statusOrder[a.status as keyof typeof statusOrder];
      const orderB = statusOrder[b.status as keyof typeof statusOrder];
      return sortOrder === 'asc' ? orderA - orderB : orderB - orderA;
    }
    
    // Default: sort by most recent dose date
    const lastDoseA = a.doses.length > 0 
      ? a.doses.reduce((latest, dose) => 
          !latest.dateAdministered ? dose :
          !dose.dateAdministered ? latest :
          new Date(dose.dateAdministered) > new Date(latest.dateAdministered) ? dose : latest, 
        a.doses[0])
      : null;
      
    const lastDoseB = b.doses.length > 0 
      ? b.doses.reduce((latest, dose) => 
          !latest.dateAdministered ? dose :
          !dose.dateAdministered ? latest :
          new Date(dose.dateAdministered) > new Date(latest.dateAdministered) ? dose : latest, 
        b.doses[0])
      : null;
    
    if (!lastDoseA && !lastDoseB) return 0;
    if (!lastDoseA) return 1;
    if (!lastDoseB) return -1;
    if (!lastDoseA.dateAdministered) return 1;
    if (!lastDoseB.dateAdministered) return -1;
    
    const dateCompare = new Date(lastDoseB.dateAdministered).getTime() - 
                         new Date(lastDoseA.dateAdministered).getTime();
    return sortOrder === 'asc' ? -dateCompare : dateCompare;
  });
  
  // Function to handle sort column click
  const handleSortClick = (column: 'date' | 'name' | 'status') => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column with default desc order
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  // Function to format date in a readable way
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Generate CSV data for export
  const generateCSV = () => {
    const headers = ['Vaccine', 'Dose #', 'Date Administered', 'Administered By', 'Notes'];
    const rows = child.vaccineHistory.map(dose => {
      const vaccine = vaccines.find(v => v.id === dose.vaccineId);
      return [
        vaccine?.name || 'Unknown Vaccine',
        dose.doseNumber.toString(),
        dose.dateAdministered || 'Unknown date',
        dose.administeredBy || '',
        dose.notes || ''
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create a Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${child.name}_vaccine_record.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        {/* Search and filter */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vaccines..."
              className="pl-9 pr-3 py-2 bg-gray-800 rounded-md text-sm border border-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          
          <div className="relative">
            <button
              className="px-3 py-2 bg-gray-800 rounded-md text-sm border border-gray-700 flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              <span>
                {filterBy === 'all' && 'All'}
                {filterBy === 'completed' && 'Completed'}
                {filterBy === 'pending' && 'Pending'}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 hidden">
              <button
                className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-700"
                onClick={() => setFilterBy('all')}
              >
                All
              </button>
              <button
                className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-700"
                onClick={() => setFilterBy('completed')}
              >
                Completed
              </button>
              <button
                className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-700"
                onClick={() => setFilterBy('pending')}
              >
                Pending
              </button>
            </div>
          </div>
        </div>
        
        {/* Export button */}
        <button
          onClick={generateCSV}
          className="px-3 py-2 bg-green-700 text-white rounded-md text-sm flex items-center gap-1 hover:bg-green-600"
        >
          <Download className="w-4 h-4" />
          <span>Export Record</span>
        </button>
      </div>
      
      {/* Vaccine Summary */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <h3 className="text-md font-semibold mb-3">Vaccination Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Total Vaccines</p>
            <p className="text-2xl font-semibold">{vaccines.length}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Completed</p>
            <p className="text-2xl font-semibold text-green-400">
              {vaccineRecords.filter(r => r.isComplete).length}
            </p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Pending</p>
            <p className="text-2xl font-semibold text-yellow-400">
              {vaccineRecords.filter(r => !r.isComplete).length}
            </p>
          </div>
        </div>
        
        <div className="mt-3 bg-gray-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-gray-400">Overall Completion</p>
            <p className="text-xs font-medium">
              {vaccineRecords.reduce((acc, record) => acc + record.administered, 0)}/
              {vaccineRecords.reduce((acc, record) => acc + record.total, 0)} doses
            </p>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ 
                width: `${(vaccineRecords.reduce((acc, record) => acc + record.administered, 0) / 
                  vaccineRecords.reduce((acc, record) => acc + record.total, 0)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Vaccine Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th 
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSortClick('name')}
              >
                <div className="flex items-center gap-1">
                  <span>Vaccine</span>
                  {sortBy === 'name' && (
                    <ChevronDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium">Doses</th>
              <th 
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSortClick('date')}
              >
                <div className="flex items-center gap-1">
                  <span>Last Dose</span>
                  {sortBy === 'date' && (
                    <ChevronDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSortClick('status')}
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  {sortBy === 'status' && (
                    <ChevronDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedVaccineRecords.map((record, index) => {
              // Get the last dose date for display
              const lastDose = record.doses.length > 0 
                ? record.doses.reduce((latest, dose) => 
                    !latest.dateAdministered ? dose :
                    !dose.dateAdministered ? latest :
                    new Date(dose.dateAdministered) > new Date(latest.dateAdministered) ? dose : latest, 
                  record.doses[0])
                : null;
              
              return (
                <tr key={index} className="hover:bg-gray-900/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{record.vaccine.name}</div>
                    <div className="text-xs text-gray-400">{record.vaccine.diseases.join(', ')}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className={record.isComplete ? 'text-green-400' : 'text-gray-300'}>
                        {record.administered}/{record.total}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {lastDose?.dateAdministered ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(lastDose.dateAdministered)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Not administered</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {record.isComplete ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900 text-green-300">
                        <Check className="w-3 h-3 mr-1" />
                        Complete
                      </span>
                    ) : record.administered > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900 text-yellow-300">
                        <Clock className="w-3 h-3 mr-1" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-300">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Detailed Dose History */}
      {filteredDoses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-3">Detailed Dose History</h3>
          <div className="space-y-3">
            {filteredDoses.map((dose, index) => (
              <div key={index} className="bg-gray-900 p-3 rounded-lg border border-gray-800 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{dose.vaccineName}</span>
                    <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full">
                      Dose {dose.doseNumber}
                    </span>
                  </div>
                  
                  <div className="mt-1 text-sm flex flex-col sm:flex-row gap-2 sm:items-center">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-gray-400">
                        {dose.dateAdministered ? formatDate(dose.dateAdministered) : 'Unknown date'}
                      </span>
                    </div>
                    
                    {dose.administeredBy && (
                      <div className="flex items-center">
                        <span className="text-gray-400 mx-2 hidden sm:block">•</span>
                        <span className="text-gray-400">By: {dose.administeredBy}</span>
                      </div>
                    )}
                  </div>
                  
                  {dose.notes && (
                    <div className="mt-1 text-sm text-gray-400">
                      Notes: {dose.notes}
                    </div>
                  )}
                </div>
                
                {onDeleteDose && (
                  <button
                    onClick={() => onDeleteDose(dose.id)}
                    className="text-red-400 text-sm hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {filteredDoses.length === 0 && (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400">No vaccination records found</p>
        </div>
      )}
    </div>
  );
} 