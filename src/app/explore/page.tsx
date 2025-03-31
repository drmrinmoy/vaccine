'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, ChevronDown, ChevronRight, Users, Weight, Pill, Beaker, Database, Info, Check, ArrowLeft, Shield, Clock } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import Link from 'next/link';
import { mockDrugInformation, mockClinicalParameters, mockClinicalCategories, mockVaccines } from '@/data/mock';
import { DrugInformation, ClinicalParameter, Vaccine } from '@/types';

// Content type for the tabs
type ContentType = 'drugs' | 'parameters' | 'vaccines';

// Age groups for filtering
const ageGroups = [
  'All Ages',
  'Newborn',
  '0-3 months',
  '3-12 months',
  '1-3 years',
  '4-7 years', 
  '8-12 years',
  '12-18 years'
];

// Gender options
const genderOptions = [
  'All',
  'Male',
  'Female'
];

// Drug categories
const drugCategories = [
  'All',
  'Antibiotics',
  'Analgesics/Antipyretics',
  'Bronchodilators',
  'Antihistamines',
  'Antiepileptics'
];

// Clinical parameter categories based on mockClinicalCategories
const clinicalCategories = mockClinicalCategories.map(cat => cat.name);

export default function ExplorePage() {
  // State for type of content to display
  const [contentType, setContentType] = useState<ContentType>('drugs');
  
  // Filtering states
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('All Ages');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [weightInput, setWeightInput] = useState<string>('');
  
  // Selected item detail states
  const [selectedDrug, setSelectedDrug] = useState<DrugInformation | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<ClinicalParameter | null>(null);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [searchResults, setSearchResults] = useState<Vaccine[]>([]);
  
  // Reset selection when changing content type
  useEffect(() => {
    setSelectedDrug(null);
    setSelectedParameter(null);
    setSelectedCategory('All');
  }, [contentType]);
  
  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(mockVaccines);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = mockVaccines.filter(vaccine => 
      vaccine.name.toLowerCase().includes(query) || 
      vaccine.diseases.some(disease => disease.toLowerCase().includes(query)) ||
      vaccine.description.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
  }, [searchQuery]);
  
  // Initialize with all vaccines
  useEffect(() => {
    setSearchResults(mockVaccines);
  }, []);
  
  // Filter drugs based on current filters
  const filteredDrugs = mockDrugInformation.filter(drug => {
    // Search query filter
    const matchesSearch = drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || drug.category === selectedCategory;
    
    // Age filter (check if any dosage matches the selected age group)
    const matchesAge = selectedAgeGroup === 'All Ages' || 
      drug.dosages.some(dosage => dosageMatchesAgeGroup(dosage.ageRange, selectedAgeGroup));
    
    // Weight filter (if provided)
    const matchesWeight = !weightInput || weightMatchesDosage(drug);
    
    return matchesSearch && matchesCategory && matchesAge && matchesWeight;
  });
  
  // Filter clinical parameters based on current filters
  const filteredParameters = mockClinicalParameters.filter(param => {
    // Search query filter
    const matchesSearch = param.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      param.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || param.category === selectedCategory;
    
    // Age and gender filter
    const matchesAgeAndGender = selectedAgeGroup === 'All Ages' || 
      param.normalRanges.some(range => 
        rangeMatchesAgeGroup(range.ageRange, selectedAgeGroup) &&
        (selectedGender === 'All' || range.gender === 'all' || range.gender?.toLowerCase() === selectedGender.toLowerCase())
      );
    
    return matchesSearch && matchesCategory && matchesAgeAndGender;
  });
  
  // Helper function to check if a dosage age range matches the selected age group
  const dosageMatchesAgeGroup = (dosageRange: string, selectedRange: string): boolean => {
    if (selectedRange === 'All Ages') return true;
    
    // Simple matching for exact matches
    if (dosageRange === selectedRange) return true;
    
    // Handle ranges like "0-3 months" vs "<4 years"
    if (dosageRange.includes('<') && selectedRange.includes('-')) {
      const upperLimit = parseInt(dosageRange.replace(/[^0-9]/g, ''));
      const [lowerSelectedAge] = selectedRange.split('-');
      const lowerSelectedAgeNum = parseInt(lowerSelectedAge);
      
      if (isNaN(upperLimit) || isNaN(lowerSelectedAgeNum)) return false;
      
      return lowerSelectedAgeNum < upperLimit;
    }
    
    // Handle "4 months-18 years" type ranges
    if (dosageRange.includes('-')) {
      const [lowerDosageAge, upperDosageAge] = dosageRange.split('-');
      const [lowerSelectedAge, upperSelectedAge] = selectedRange.split('-');
      
      // Extract numbers for comparison, simple approach
      const lowerDosageNum = parseInt(lowerDosageAge.replace(/[^0-9]/g, ''));
      const lowerSelectedNum = parseInt(lowerSelectedAge.replace(/[^0-9]/g, ''));
      
      if (isNaN(lowerDosageNum) || isNaN(lowerSelectedNum)) return false;
      
      // If lower bound of selected age is within dosage range
      return lowerSelectedNum >= lowerDosageNum;
    }
    
    return false;
  };
  
  // Helper function to check if range matches age group
  const rangeMatchesAgeGroup = (rangeString: string, selectedRange: string): boolean => {
    if (selectedRange === 'All Ages') return true;
    if (rangeString === 'All pediatric ages') return true;
    
    // Simple matching for exact matches
    if (rangeString === selectedRange) return true;
    
    return false; // Simplified for demo
  };
  
  // Helper function to check if drug has dosages appropriate for the entered weight
  const weightMatchesDosage = (drug: DrugInformation): boolean => {
    if (!weightInput) return true;
    
    const weight = parseFloat(weightInput);
    if (isNaN(weight)) return true;
    
    // Check if any dosage has a weight range that includes the entered weight
    return drug.dosages.some(dosage => {
      if (!dosage.weightRange) return true; // If no weight range specified, include it
      
      // Simple handling of weight ranges like "<5kg"
      if (dosage.weightRange.includes('<')) {
        const upperLimit = parseFloat(dosage.weightRange.replace(/[^0-9.]/g, ''));
        return weight < upperLimit;
      }
      
      // Simple handling of weight ranges like ">10kg"
      if (dosage.weightRange.includes('>')) {
        const lowerLimit = parseFloat(dosage.weightRange.replace(/[^0-9.]/g, ''));
        return weight > lowerLimit;
      }
      
      // Weight ranges like "5-10kg"
      if (dosage.weightRange.includes('-')) {
        const [lower, upper] = dosage.weightRange.split('-');
        const lowerLimit = parseFloat(lower.replace(/[^0-9.]/g, ''));
        const upperLimit = parseFloat(upper.replace(/[^0-9.]/g, ''));
        
        return weight >= lowerLimit && weight <= upperLimit;
      }
      
      return true;
    });
  };
  
  // Handle selection of a drug for detailed view
  const handleDrugSelect = (drug: DrugInformation) => {
    setSelectedDrug(selectedDrug?.id === drug.id ? null : drug);
    setSelectedParameter(null);
  };
  
  // Handle selection of a parameter for detailed view
  const handleParameterSelect = (param: ClinicalParameter) => {
    setSelectedParameter(selectedParameter?.id === param.id ? null : param);
    setSelectedDrug(null);
  };
  
  // Handle selecting a vaccine to view details
  const handleSelectVaccine = (vaccine: Vaccine) => {
    setSelectedVaccine(vaccine);
  };
  
  // Go back to search results
  const handleBack = () => {
    setSelectedVaccine(null);
  };
  
  return (
    <div className="pb-16">
      {/* Search Header */}
      <header className="sticky top-0 z-30 bg-black p-4 border-b border-gray-800">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search drugs, lab values, and vaccines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-2 p-2 rounded-lg ${showFilters ? 'bg-green-600' : 'bg-gray-800'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      {/* Content type tabs */}
      <div className="p-4 border-b border-gray-800 flex overflow-x-auto">
        <button
          onClick={() => setContentType('drugs')}
          className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
            contentType === 'drugs' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
          }`}
        >
          <Pill className="w-4 h-4 inline-block mr-1" />
          Medications
        </button>
        <button
          onClick={() => setContentType('parameters')}
          className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
            contentType === 'parameters' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
          }`}
        >
          <Beaker className="w-4 h-4 inline-block mr-1" />
          Lab Values & Parameters
        </button>
        <button
          onClick={() => setContentType('vaccines')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            contentType === 'vaccines' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
          }`}
        >
          <Shield className="w-4 h-4 inline-block mr-1" />
          Vaccines
        </button>
      </div>

      {/* Filter section */}
      {showFilters && (
        <div className="bg-gray-900 p-4 space-y-4 animate-fadeIn">
          <div>
            <p className="text-sm text-gray-400 mb-2">Age Group:</p>
            <div className="flex flex-wrap gap-2">
              {ageGroups.map((age) => (
                <button
                  key={age}
                  onClick={() => setSelectedAgeGroup(age)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedAgeGroup === age
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-2">Gender:</p>
            <div className="flex gap-2">
              {genderOptions.map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedGender === gender
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-2">Weight (kg):</p>
            <input
              type="number"
              placeholder="Enter weight"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="p-4">
        {/* Drug content */}
        {contentType === 'drugs' && !selectedDrug && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Pill className="w-5 h-5 mr-2 text-green-500" />
              Drug Information & Dosages
            </h2>
            
            {filteredDrugs.length > 0 ? (
              <div className="space-y-4">
                {filteredDrugs.map((drug) => (
                  <div key={drug.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleDrugSelect(drug)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{drug.name}</h3>
                          <p className="text-sm text-gray-400">
                            {drug.genericName} · {drug.category}
                          </p>
                        </div>
                        <div className="bg-gray-800 p-1 rounded-full">
                          {selectedDrug?.id === drug.id ? (
                            <ChevronDown className="w-5 h-5 text-green-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                        {drug.description}
                      </p>
                    </div>
                    
                    {selectedDrug?.id === drug.id && (
                      <div className="border-t border-gray-800 p-4 animate-fadeIn">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm text-gray-400 mb-1">Indications</h4>
                            <ul className="text-sm space-y-1">
                              {drug.indications.map((indication, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="block w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                                  <span>{indication}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm text-gray-400 mb-1">Dosages</h4>
                            {drug.dosages.map((dosage, idx) => (
                              <div key={idx} className="bg-gray-800 rounded-md p-3 mb-2">
                                <div className="flex items-center mb-1">
                                  <Users className="w-4 h-4 text-blue-400 mr-1" />
                                  <span className="text-sm font-medium">{dosage.ageRange}</span>
                                  {dosage.weightRange && (
                                    <div className="flex items-center ml-3">
                                      <Weight className="w-4 h-4 text-yellow-400 mr-1" />
                                      <span className="text-sm font-medium">{dosage.weightRange}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                                  <div className="flex-grow">
                                    <span className="font-semibold">{dosage.dose}</span>
                                    <span className="text-gray-400"> {dosage.frequency}</span>
                                  </div>
                                  <div className="text-gray-400">
                                    <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                                      {dosage.route}
                                    </span>
                                  </div>
                                </div>
                                {dosage.maxDose && (
                                  <div className="text-xs text-yellow-400 mt-1">
                                    Max dose: {dosage.maxDose}
                                  </div>
                                )}
                                {dosage.notes && (
                                  <div className="text-xs text-gray-400 mt-1 flex items-start">
                                    <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                    {dosage.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {drug.contraindications && drug.contraindications.length > 0 && (
                            <div>
                              <h4 className="text-sm text-gray-400 mb-1">Contraindications</h4>
                              <ul className="text-sm space-y-1">
                                {drug.contraindications.map((contraindication, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="block w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                                    <span>{contraindication}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {drug.sideEffects && drug.sideEffects.length > 0 && (
                            <div>
                              <h4 className="text-sm text-gray-400 mb-1">Side Effects</h4>
                              <ul className="text-sm space-y-1">
                                {drug.sideEffects.map((sideEffect, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="block w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                                    <span>{sideEffect}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {drug.warnings && drug.warnings.length > 0 && (
                            <div>
                              <h4 className="text-sm text-gray-400 mb-1">Warnings</h4>
                              <ul className="text-sm space-y-1">
                                {drug.warnings.map((warning, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <AlertCircle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                                    <span>{warning}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-900 rounded-lg border border-gray-800">
                <Database className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400">No matching drugs found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </section>
        )}
        
        {/* Drug detail view */}
        {contentType === 'drugs' && selectedDrug && (
          <div className="border-t border-gray-800 p-4 animate-fadeIn">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Indications</h4>
                <ul className="text-sm space-y-1">
                  {selectedDrug.indications.map((indication, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="block w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                      <span>{indication}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Dosages</h4>
                {selectedDrug.dosages.map((dosage, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-md p-3 mb-2">
                    <div className="flex items-center mb-1">
                      <Users className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="text-sm font-medium">{dosage.ageRange}</span>
                      {dosage.weightRange && (
                        <div className="flex items-center ml-3">
                          <Weight className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{dosage.weightRange}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                      <div className="flex-grow">
                        <span className="font-semibold">{dosage.dose}</span>
                        <span className="text-gray-400"> {dosage.frequency}</span>
                      </div>
                      <div className="text-gray-400">
                        <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                          {dosage.route}
                        </span>
                      </div>
                    </div>
                    {dosage.maxDose && (
                      <div className="text-xs text-yellow-400 mt-1">
                        Max dose: {dosage.maxDose}
                      </div>
                    )}
                    {dosage.notes && (
                      <div className="text-xs text-gray-400 mt-1 flex items-start">
                        <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        {dosage.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {selectedDrug.contraindications && selectedDrug.contraindications.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Contraindications</h4>
                  <ul className="text-sm space-y-1">
                    {selectedDrug.contraindications.map((contraindication, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="block w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                        <span>{contraindication}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedDrug.sideEffects && selectedDrug.sideEffects.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Side Effects</h4>
                  <ul className="text-sm space-y-1">
                    {selectedDrug.sideEffects.map((sideEffect, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="block w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                        <span>{sideEffect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedDrug.warnings && selectedDrug.warnings.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Warnings</h4>
                  <ul className="text-sm space-y-1">
                    {selectedDrug.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Parameters content */}
        {contentType === 'parameters' && !selectedParameter && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Beaker className="w-5 h-5 mr-2 text-green-500" />
              Laboratory Values & Normal Ranges
            </h2>
            
            {filteredParameters.length > 0 ? (
              <div className="space-y-4">
                {filteredParameters.map((parameter) => (
                  <div key={parameter.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleParameterSelect(parameter)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{parameter.name}</h3>
                          <p className="text-sm text-gray-400">
                            {parameter.category} · {parameter.unit}
                          </p>
                        </div>
                        <div className="bg-gray-800 p-1 rounded-full">
                          {selectedParameter?.id === parameter.id ? (
                            <ChevronDown className="w-5 h-5 text-green-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                        {parameter.description}
                      </p>
                    </div>
                    
                    {selectedParameter?.id === parameter.id && (
                      <div className="border-t border-gray-800 p-4 animate-fadeIn">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">Normal Ranges</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="text-xs text-gray-400 border-b border-gray-800">
                                  <tr>
                                    <th className="py-2 px-3 text-left">Age</th>
                                    <th className="py-2 px-3 text-left">Gender</th>
                                    <th className="py-2 px-3 text-right">Min</th>
                                    <th className="py-2 px-3 text-right">Max</th>
                                    <th className="py-2 px-3 text-left">Notes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {parameter.normalRanges.map((range, idx) => (
                                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800">
                                      <td className="py-2 px-3">{range.ageRange}</td>
                                      <td className="py-2 px-3 capitalize">
                                        {range.gender === 'all' ? 'All' : range.gender}
                                      </td>
                                      <td className="py-2 px-3 text-right">{range.minValue}</td>
                                      <td className="py-2 px-3 text-right">{range.maxValue}</td>
                                      <td className="py-2 px-3 text-xs text-gray-400">{range.notes || '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          {parameter.interpretations && parameter.interpretations.length > 0 && (
                            <div>
                              <h4 className="text-sm text-gray-400 mb-2">Clinical Interpretation</h4>
                              {parameter.interpretations.map((interpretation, idx) => (
                                <div key={idx} className="bg-gray-800 rounded-md p-3 mb-2">
                                  <div className="flex flex-wrap gap-2 mb-1">
                                    <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                                      {interpretation.condition}
                                    </span>
                                    <span className="bg-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                                      {interpretation.range}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300">
                                    {interpretation.interpretation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-900 rounded-lg border border-gray-800">
                <Database className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400">No matching parameters found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </section>
        )}
        
        {/* Parameter detail view */}
        {contentType === 'parameters' && selectedParameter && (
          <div className="border-t border-gray-800 p-4 animate-fadeIn">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Normal Ranges</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-400 border-b border-gray-800">
                      <tr>
                        <th className="py-2 px-3 text-left">Age</th>
                        <th className="py-2 px-3 text-left">Gender</th>
                        <th className="py-2 px-3 text-right">Min</th>
                        <th className="py-2 px-3 text-right">Max</th>
                        <th className="py-2 px-3 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedParameter.normalRanges.map((range, idx) => (
                        <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800">
                          <td className="py-2 px-3">{range.ageRange}</td>
                          <td className="py-2 px-3 capitalize">
                            {range.gender === 'all' ? 'All' : range.gender}
                          </td>
                          <td className="py-2 px-3 text-right">{range.minValue}</td>
                          <td className="py-2 px-3 text-right">{range.maxValue}</td>
                          <td className="py-2 px-3 text-xs text-gray-400">{range.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {selectedParameter.interpretations && selectedParameter.interpretations.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Clinical Interpretation</h4>
                  {selectedParameter.interpretations.map((interpretation, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-md p-3 mb-2">
                      <div className="flex flex-wrap gap-2 mb-1">
                        <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                          {interpretation.condition}
                        </span>
                        <span className="bg-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                          {interpretation.range}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">
                        {interpretation.interpretation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Vaccine content */}
        {contentType === 'vaccines' && !selectedVaccine && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Available Vaccines</h2>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-8">
                <Info className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                <h3 className="text-xl font-medium mb-2">No vaccines found</h3>
                <p className="text-gray-400">Try a different search term</p>
              </div>
            ) : (
              searchResults.map(vaccine => (
                <div 
                  key={vaccine.id}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-green-700 transition-colors cursor-pointer"
                  onClick={() => handleSelectVaccine(vaccine)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-green-900/30 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{vaccine.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {vaccine.diseases.join(', ')}
                      </p>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {vaccine.description}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                          {vaccine.doseCount} {vaccine.doseCount === 1 ? 'dose' : 'doses'}
                        </span>
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full ml-2">
                          Ages: {vaccine.recommendedAges.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Vaccine detail view */}
        {contentType === 'vaccines' && selectedVaccine && (
          <div>
            <button 
              onClick={() => setSelectedVaccine(null)}
              className="flex items-center text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to vaccines
            </button>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="bg-green-900/20 p-5 border-b border-gray-800">
                <div className="flex items-start gap-4">
                  <div className="bg-green-900/30 p-3 rounded-lg">
                    <Shield className="h-8 w-8 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedVaccine.name}</h2>
                    <p className="text-gray-300 mt-1">
                      Protects against: {selectedVaccine.diseases.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">About this vaccine</h3>
                  <p className="text-gray-300 mb-4">{selectedVaccine.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Doses Required</h4>
                      <p className="text-xl font-semibold">{selectedVaccine.doseCount}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Type</h4>
                      <p className="text-xl font-semibold">
                        {selectedVaccine.name.includes('OPV') ? 'Oral' : 'Injectable'}
                      </p>
                    </div>
                  </div>
                </section>
                
                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Recommended Ages</h3>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <ul className="space-y-2">
                      {selectedVaccine.recommendedAges.map((age, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-green-400 mt-0.5" />
                          <span>{age}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
                
                {selectedVaccine.catchupAges && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Catch-up Schedule</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-300">{selectedVaccine.catchupAges}</p>
                    </div>
                  </section>
                )}
                
                {selectedVaccine.sideEffects && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Possible Side Effects</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedVaccine.sideEffects.map((effect, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-5 w-5 flex items-center justify-center">
                              <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                            </div>
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                )}
                
                {selectedVaccine.contraindications && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Contraindications</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedVaccine.contraindications.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-5 w-5 flex items-center justify-center">
                              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                )}
                
                <Link
                  href={`/dashboard`}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500"
                >
                  <Check className="h-5 w-5" />
                  Go to vaccination dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
} 