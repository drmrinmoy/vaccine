'use client';

import React, { useState, useEffect } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { 
  User, 
  Plus, 
  X, 
  Edit, 
  Trash2, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { format, addMonths, addYears, isAfter, isBefore, parseISO } from 'date-fns';

// Define types
interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  vaccinations: Vaccination[];
}

interface Vaccination {
  id: string;
  name: string;
  dueDate: string;
  status: 'Completed' | 'Due' | 'Overdue' | 'Upcoming';
  completedDate?: string;
  scheduledAt?: string; // Added to track the age category
}

// Mock data for vaccines based on National Immunization Schedule
const vaccineSchedule = [
  { name: 'BCG', scheduledAt: 'birth' },
  { name: 'Hepatitis B - Birth dose', scheduledAt: 'birth' },
  { name: 'OPV - Birth dose', scheduledAt: 'birth' },
  { name: 'OPV 1', scheduledAt: '6 weeks' },
  { name: 'Pentavalent 1', scheduledAt: '6 weeks' },
  { name: 'Rotavirus 1', scheduledAt: '6 weeks' },
  { name: 'PCV 1', scheduledAt: '6 weeks' },
  { name: 'OPV 2', scheduledAt: '10 weeks' },
  { name: 'Pentavalent 2', scheduledAt: '10 weeks' },
  { name: 'Rotavirus 2', scheduledAt: '10 weeks' },
  { name: 'PCV 2', scheduledAt: '10 weeks' },
  { name: 'OPV 3', scheduledAt: '14 weeks' },
  { name: 'Pentavalent 3', scheduledAt: '14 weeks' },
  { name: 'Rotavirus 3', scheduledAt: '14 weeks' },
  { name: 'PCV 3', scheduledAt: '14 weeks' },
  { name: 'IPV', scheduledAt: '14 weeks' },
  { name: 'MR 1', scheduledAt: '9 months' },
  { name: 'JE 1', scheduledAt: '9 months' },
  { name: 'Vitamin A', scheduledAt: '9 months' },
  { name: 'DPT Booster 1', scheduledAt: '16-24 months' },
  { name: 'MR 2', scheduledAt: '16-24 months' },
  { name: 'OPV Booster', scheduledAt: '16-24 months' },
  { name: 'JE 2', scheduledAt: '16-24 months' },
  { name: 'Typhoid Conjugate Vaccine', scheduledAt: '9-12 years' },
  { name: 'Td', scheduledAt: '10 years & 16 years' },
];

// Calculate vaccination due dates based on date of birth
const calculateVaccinationDueDates = (dateOfBirth: string): Vaccination[] => {
  const dob = parseISO(dateOfBirth);
  const today = new Date();
  
  const vaccinations: Vaccination[] = vaccineSchedule.map((vaccine, index) => {
    let dueDate = dob;
    
    if (vaccine.scheduledAt === 'birth') {
      dueDate = dob;
    } else if (vaccine.scheduledAt === '6 weeks') {
      dueDate = addMonths(dob, 1.5);
    } else if (vaccine.scheduledAt === '10 weeks') {
      dueDate = addMonths(dob, 2.5);
    } else if (vaccine.scheduledAt === '14 weeks') {
      dueDate = addMonths(dob, 3.5);
    } else if (vaccine.scheduledAt === '9 months') {
      dueDate = addMonths(dob, 9);
    } else if (vaccine.scheduledAt === '16-24 months') {
      dueDate = addMonths(dob, 16);
    } else if (vaccine.scheduledAt === '9-12 years') {
      dueDate = addYears(dob, 9);
    } else if (vaccine.scheduledAt === '10 years & 16 years') {
      dueDate = addYears(dob, 10);
    }
    
    // Determine status
    let status: 'Completed' | 'Due' | 'Overdue' | 'Upcoming' = 'Upcoming';
    
    if (isAfter(today, dueDate)) {
      if (isAfter(today, addMonths(dueDate, 1))) {
        status = 'Overdue';
      } else {
        status = 'Due';
      }
    } else {
      status = 'Upcoming';
    }
    
    return {
      id: `v${index}`,
      name: vaccine.name,
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      status: status,
      scheduledAt: vaccine.scheduledAt, // Store the age category
    };
  });
  
  return vaccinations;
};

export default function Dashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [childToEdit, setChildToEdit] = useState<Child | null>(null);
  const [activeAgeGroups, setActiveAgeGroups] = useState<string[]>(['birth', '6 weeks', '10 weeks', '14 weeks']); // Default open groups
  const [activeVaccineFilter, setActiveVaccineFilter] = useState('all');
  const [activeSchedule, setActiveSchedule] = useState<'nis' | 'iap'>('nis'); // State for active schedule
  
  // Form state
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  
  // Load children from localStorage on component mount
  useEffect(() => {
    const savedChildren = localStorage.getItem('children');
    if (savedChildren) {
      const parsedChildren: Child[] = JSON.parse(savedChildren);
      setChildren(parsedChildren);
      
      if (parsedChildren.length > 0 && !selectedChild) {
        setSelectedChild(parsedChildren[0]);
      }
    }
  }, []);
  
  // Save children to localStorage whenever it changes
  useEffect(() => {
    if (children.length > 0) {
      localStorage.setItem('children', JSON.stringify(children));
    }
  }, [children]);
  
  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !dateOfBirth) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (isEditMode && childToEdit) {
      // Update existing child
      const updatedChildren = children.map(child => {
        if (child.id === childToEdit.id) {
          const updatedChild = {
            ...child,
            name,
            dateOfBirth,
            gender,
            vaccinations: calculateVaccinationDueDates(dateOfBirth),
          };
          return updatedChild;
        }
        return child;
      });
      
      setChildren(updatedChildren);
      setSelectedChild(updatedChildren.find(child => child.id === childToEdit.id) || null);
    } else {
      // Add new child
      const newChild: Child = {
        id: `child_${Date.now()}`,
        name,
        dateOfBirth,
        gender,
        vaccinations: calculateVaccinationDueDates(dateOfBirth),
      };
      
      const updatedChildren = [...children, newChild];
      setChildren(updatedChildren);
      setSelectedChild(newChild);
    }
    
    // Reset form and state
    setName('');
    setDateOfBirth('');
    setGender('Male');
    setShowAddChildForm(false);
    setIsEditMode(false);
    setChildToEdit(null);
  };
  
  const handleEditChild = (child: Child) => {
    setName(child.name);
    setDateOfBirth(child.dateOfBirth);
    setGender(child.gender);
    setChildToEdit(child);
    setIsEditMode(true);
    setShowAddChildForm(true);
  };
  
  const handleDeleteChild = (childId: string) => {
    if (confirm('Are you sure you want to delete this child?')) {
      const updatedChildren = children.filter(child => child.id !== childId);
      setChildren(updatedChildren);
      
      if (selectedChild && selectedChild.id === childId) {
        setSelectedChild(updatedChildren.length > 0 ? updatedChildren[0] : null);
      }
    }
  };
  
  const handleVaccinationStatusUpdate = (childId: string, vaccinationId: string) => {
    const updatedChildren = children.map(child => {
      if (child.id === childId) {
        const updatedVaccinations = child.vaccinations.map(vaccine => {
          if (vaccine.id === vaccinationId) {
            return {
              ...vaccine,
              status: 'Completed' as const,
              completedDate: format(new Date(), 'yyyy-MM-dd'),
            };
          }
          return vaccine;
        });
        
        return {
          ...child,
          vaccinations: updatedVaccinations,
        };
      }
      return child;
    });
    
    setChildren(updatedChildren);
    setSelectedChild(updatedChildren.find(child => child.id === childId) || null);
  };
  
  // Cancel add/edit form
  const handleCancelForm = () => {
    setName('');
    setDateOfBirth('');
    setGender('Male');
    setShowAddChildForm(false);
    setIsEditMode(false);
    setChildToEdit(null);
  };
  
  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    try {
      const birthDate = parseISO(dob);
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      
      if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months += 12;
      }
      
      if (years === 0) {
        if (months === 0) {
          const days = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
          return `${days} days`;
        }
        return `${months} months`;
      }
      
      return `${years} years, ${months} months`;
    } catch (error) {
      return 'Unknown';
    }
  };
  
  // Count vaccines by status
  const countVaccinesByStatus = (vaccinations: Vaccination[]) => {
    return {
      completed: vaccinations.filter(v => v.status === 'Completed').length,
      due: vaccinations.filter(v => v.status === 'Due').length,
      overdue: vaccinations.filter(v => v.status === 'Overdue').length,
      upcoming: vaccinations.filter(v => v.status === 'Upcoming').length,
      total: vaccinations.length
    };
  };
  
  // Group vaccinations by age category
  const groupVaccinationsByAge = (vaccinations: Vaccination[]) => {
    const ageGroups: { [key: string]: Vaccination[] } = {};
    
    // Define the order of age groups for consistent display
    const ageGroupOrder = [
      'birth',
      '6 weeks',
      '10 weeks',
      '14 weeks',
      '9 months',
      '16-24 months',
      '9-12 years',
      '10 years & 16 years'
    ];
    
    // Initialize age groups with empty arrays
    ageGroupOrder.forEach(group => {
      ageGroups[group] = [];
    });
    
    // Populate age groups with vaccinations
    vaccinations.forEach(vaccine => {
      if (vaccine.scheduledAt && ageGroups[vaccine.scheduledAt]) {
        ageGroups[vaccine.scheduledAt].push(vaccine);
      }
    });
    
    return { ageGroups, ageGroupOrder };
  };
  
  // Toggle age group expansion
  const toggleAgeGroup = (ageGroup: string) => {
    if (activeAgeGroups.includes(ageGroup)) {
      setActiveAgeGroups(activeAgeGroups.filter(group => group !== ageGroup));
    } else {
      setActiveAgeGroups([...activeAgeGroups, ageGroup]);
    }
  };
  
  // Filter vaccinations based on active filter
  const filterVaccinations = (vaccinations: Vaccination[]) => {
    if (activeVaccineFilter === 'all') {
      return vaccinations;
    }
    if (activeVaccineFilter === 'due-overdue') {
      return vaccinations.filter(v => v.status === 'Due' || v.status === 'Overdue');
    }
    if (activeVaccineFilter === 'completed') {
      return vaccinations.filter(v => v.status === 'Completed');
    }
    return vaccinations;
  };
  
  return (
    <main className="bg-gray-950 min-h-screen text-white">
      <div className="px-4 py-6 pb-24 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Vaccination Dashboard</h1>
          {!showAddChildForm && (
            <button
              onClick={() => setShowAddChildForm(true)}
              className="bg-green-600 hover:bg-green-500 p-2 rounded-full text-white"
              aria-label="Add child"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </header>
        
        {showAddChildForm ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditMode ? 'Edit Child' : 'Add New Child'}
              </h2>
              <button
                onClick={handleCancelForm}
                className="text-gray-400 hover:text-white"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddChild}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Child's Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter child's name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-300 mb-1">
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    id="dob"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Gender
                  </label>
                  <div className="flex space-x-4">
                    {['Male', 'Female', 'Other'].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={gender === option}
                          onChange={() => setGender(option as 'Male' | 'Female' | 'Other')}
                          className="mr-2"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-4 py-2 mr-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
                  >
                    {isEditMode ? 'Update Child' : 'Add Child'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <>
            {children.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                <User className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Children Added Yet</h2>
                <p className="text-gray-400 mb-6">Add your first child to track their vaccinations</p>
                <button
                  onClick={() => setShowAddChildForm(true)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg inline-flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Child
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Child Selection Area */}
                <div className="flex overflow-x-auto pb-2 space-x-2">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                        selectedChild?.id === child.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span>{child.name}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setShowAddChildForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Child</span>
                  </button>
                </div>
                
                {/* Selected Child Information */}
                {selectedChild && (
                  <div className="space-y-6">
                    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold">{selectedChild.name}</h2>
                          <p className="text-gray-400 mt-1">
                            {formatDateForDisplay(selectedChild.dateOfBirth)} • {selectedChild.gender} • Age: {calculateAge(selectedChild.dateOfBirth)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditChild(selectedChild)}
                            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                            aria-label="Edit child"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChild(selectedChild.id)}
                            className="p-2 bg-gray-800 rounded-full hover:bg-red-900"
                            aria-label="Delete child"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Vaccination Stats */}
                      <div className="grid grid-cols-4 gap-3 mt-6">
                        {Object.entries(countVaccinesByStatus(selectedChild.vaccinations)).map(([key, count]) => {
                          if (key === 'total') return null;
                          
                          let bgColor = 'bg-gray-800';
                          let textColor = 'text-gray-300';
                          let icon = <Clock className="h-5 w-5" />;
                          
                          if (key === 'completed') {
                            bgColor = 'bg-green-900/30';
                            textColor = 'text-green-400';
                            icon = <CheckCircle className="h-5 w-5" />;
                          } else if (key === 'due') {
                            bgColor = 'bg-blue-900/30';
                            textColor = 'text-blue-400';
                            icon = <Calendar className="h-5 w-5" />;
                          } else if (key === 'overdue') {
                            bgColor = 'bg-red-900/30';
                            textColor = 'text-red-400';
                            icon = <AlertCircle className="h-5 w-5" />;
                          }
                          
                          return (
                            <div key={key} className={`${bgColor} p-3 rounded-lg`}>
                              <div className="flex items-center">
                                <div className={`mr-3 ${textColor}`}>
                                  {icon}
                                </div>
                                <div>
                                  <p className="text-sm text-gray-400">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </p>
                                  <p className={`text-lg font-semibold ${textColor}`}>
                                    {count}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Vaccination Tracker */}
                    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                      <h3 className="text-lg font-semibold mb-4">Vaccination Tracker</h3>
                      
                      {/* Schedule Type Toggle - Replace tabs with toggle */}
                      <div className="flex items-center mb-4 p-3 bg-gray-800 rounded-lg">
                        <span className="text-gray-300 mr-3">Schedule Type:</span>
                        <div className="flex bg-gray-900 p-1 rounded-full">
                          <button 
                            className={`px-4 py-2 rounded-full transition-colors ${
                              activeSchedule === 'nis' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-transparent text-gray-400 hover:text-white'
                            }`}
                            onClick={() => setActiveSchedule('nis')}
                          >
                            NIS
                          </button>
                          <button 
                            className={`px-4 py-2 rounded-full transition-colors ${
                              activeSchedule === 'iap' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-transparent text-gray-400 hover:text-white'
                            }`}
                            onClick={() => setActiveSchedule('iap')}
                          >
                            IAP
                          </button>
                        </div>
                      </div>
                      
                      {/* Filter tabs */}
                      <div className="flex mb-4 border-b border-gray-800">
                        <button 
                          className={`px-4 py-2 ${activeVaccineFilter === 'all' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400'}`}
                          onClick={() => setActiveVaccineFilter('all')}
                        >
                          All Vaccines
                        </button>
                        <button 
                          className={`px-4 py-2 ${activeVaccineFilter === 'due-overdue' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400'}`}
                          onClick={() => setActiveVaccineFilter('due-overdue')}
                        >
                          Due/Overdue
                        </button>
                        <button 
                          className={`px-4 py-2 ${activeVaccineFilter === 'completed' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400'}`}
                          onClick={() => setActiveVaccineFilter('completed')}
                        >
                          Completed
                        </button>
                      </div>
                      
                      {/* Description for the selected schedule */}
                      <div className="mb-4 p-3 bg-gray-800 rounded-lg text-sm">
                        {activeSchedule === 'nis' ? (
                          <p className="text-gray-300">
                            National Immunization Schedule (NIS) is the standard vaccination schedule recommended by the Government of India for all children.
                          </p>
                        ) : (
                          <p className="text-gray-300">
                            Indian Academy of Pediatrics (IAP) schedule includes additional recommended vaccines beyond the national program for comprehensive protection.
                          </p>
                        )}
                      </div>
                      
                      {/* Age-grouped vaccines list */}
                      <div className="space-y-4">
                        {selectedChild && (() => {
                          const filteredVaccinations = filterVaccinations(selectedChild.vaccinations);
                          const { ageGroups, ageGroupOrder } = groupVaccinationsByAge(filteredVaccinations);
                          
                          // Display a note about IAP schedule if selected
                          if (activeSchedule === 'iap' && filteredVaccinations.length > 0) {
                            return (
                              <>
                                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3 mb-4">
                                  <p className="text-sm text-blue-300">
                                    <AlertCircle className="inline-block w-4 h-4 mr-1 mb-1" />
                                    The IAP schedule includes additional recommended vaccines that may not be part of your current vaccination record.
                                    Consult with your pediatrician about following the IAP schedule.
                                  </p>
                                </div>
                                
                                {ageGroupOrder.map((ageGroup) => {
                                  const vaccines = ageGroups[ageGroup];
                                  
                                  if (vaccines.length === 0) return null;
                                  
                                  return (
                                    <div key={ageGroup} className="border border-gray-800 rounded-lg overflow-hidden">
                                      <button
                                        onClick={() => toggleAgeGroup(ageGroup)}
                                        className="w-full flex justify-between items-center bg-gray-800 p-4 hover:bg-gray-700 transition-colors"
                                      >
                                        <div className="flex items-center">
                                          <span className="font-medium">
                                            {ageGroup === 'birth' ? 'At Birth' : `Age: ${ageGroup}`}
                                          </span>
                                          <span className="ml-2 text-sm bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                                            {vaccines.length}
                                          </span>
                                        </div>
                                        <ChevronRight className={`h-5 w-5 transition-transform ${activeAgeGroups.includes(ageGroup) ? 'rotate-90' : ''}`} />
                                      </button>
                                      
                                      {activeAgeGroups.includes(ageGroup) && (
                                        <div className="space-y-1 p-2">
                                          {vaccines.map((vaccine) => {
                                            let statusBg = 'bg-gray-800';
                                            let statusText = 'text-gray-400';
                                            let statusIcon = <Clock className="h-4 w-4" />;
                                            
                                            if (vaccine.status === 'Completed') {
                                              statusBg = 'bg-green-900/30';
                                              statusText = 'text-green-400';
                                              statusIcon = <CheckCircle className="h-4 w-4" />;
                                            } else if (vaccine.status === 'Due') {
                                              statusBg = 'bg-blue-900/30';
                                              statusText = 'text-blue-400';
                                              statusIcon = <Calendar className="h-4 w-4" />;
                                            } else if (vaccine.status === 'Overdue') {
                                              statusBg = 'bg-red-900/30';
                                              statusText = 'text-red-400';
                                              statusIcon = <AlertCircle className="h-4 w-4" />;
                                            }
                                            
                                            return (
                                              <div key={vaccine.id} className="bg-gray-800 rounded-lg p-4">
                                                <div className="flex justify-between items-center">
                                                  <div>
                                                    <h4 className="font-medium">{vaccine.name}</h4>
                                                    <p className="text-sm text-gray-400">
                                                      Due: {formatDateForDisplay(vaccine.dueDate)}
                                                    </p>
                                                    {vaccine.completedDate && (
                                                      <p className="text-sm text-green-400">
                                                        Completed: {formatDateForDisplay(vaccine.completedDate)}
                                                      </p>
                                                    )}
                                                  </div>
                                                  
                                                  <div className="flex items-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBg} ${statusText} mr-3`}>
                                                      {statusIcon}
                                                      <span className="ml-1">{vaccine.status}</span>
                                                    </span>
                                                    
                                                    {vaccine.status !== 'Completed' && (
                                                      <button
                                                        onClick={() => handleVaccinationStatusUpdate(selectedChild.id, vaccine.id)}
                                                        className="p-1.5 bg-green-600 hover:bg-green-500 rounded-full"
                                                        aria-label="Mark as completed"
                                                      >
                                                        <CheckCircle className="h-4 w-4" />
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </>
                            );
                          } else {
                            return ageGroupOrder.map((ageGroup) => {
                              const vaccines = ageGroups[ageGroup];
                              
                              if (vaccines.length === 0) return null;
                              
                              return (
                                <div key={ageGroup} className="border border-gray-800 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => toggleAgeGroup(ageGroup)}
                                    className="w-full flex justify-between items-center bg-gray-800 p-4 hover:bg-gray-700 transition-colors"
                                  >
                                    <div className="flex items-center">
                                      <span className="font-medium">
                                        {ageGroup === 'birth' ? 'At Birth' : `Age: ${ageGroup}`}
                                      </span>
                                      <span className="ml-2 text-sm bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                                        {vaccines.length}
                                      </span>
                                    </div>
                                    <ChevronRight className={`h-5 w-5 transition-transform ${activeAgeGroups.includes(ageGroup) ? 'rotate-90' : ''}`} />
                                  </button>
                                  
                                  {activeAgeGroups.includes(ageGroup) && (
                                    <div className="space-y-1 p-2">
                                      {vaccines.map((vaccine) => {
                                        let statusBg = 'bg-gray-800';
                                        let statusText = 'text-gray-400';
                                        let statusIcon = <Clock className="h-4 w-4" />;
                                        
                                        if (vaccine.status === 'Completed') {
                                          statusBg = 'bg-green-900/30';
                                          statusText = 'text-green-400';
                                          statusIcon = <CheckCircle className="h-4 w-4" />;
                                        } else if (vaccine.status === 'Due') {
                                          statusBg = 'bg-blue-900/30';
                                          statusText = 'text-blue-400';
                                          statusIcon = <Calendar className="h-4 w-4" />;
                                        } else if (vaccine.status === 'Overdue') {
                                          statusBg = 'bg-red-900/30';
                                          statusText = 'text-red-400';
                                          statusIcon = <AlertCircle className="h-4 w-4" />;
                                        }
                                        
                                        return (
                                          <div key={vaccine.id} className="bg-gray-800 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                              <div>
                                                <h4 className="font-medium">{vaccine.name}</h4>
                                                <p className="text-sm text-gray-400">
                                                  Due: {formatDateForDisplay(vaccine.dueDate)}
                                                </p>
                                                {vaccine.completedDate && (
                                                  <p className="text-sm text-green-400">
                                                    Completed: {formatDateForDisplay(vaccine.completedDate)}
                                                  </p>
                                                )}
                                              </div>
                                              
                                              <div className="flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBg} ${statusText} mr-3`}>
                                                  {statusIcon}
                                                  <span className="ml-1">{vaccine.status}</span>
                                                </span>
                                                
                                                {vaccine.status !== 'Completed' && (
                                                  <button
                                                    onClick={() => handleVaccinationStatusUpdate(selectedChild.id, vaccine.id)}
                                                    className="p-1.5 bg-green-600 hover:bg-green-500 rounded-full"
                                                    aria-label="Mark as completed"
                                                  >
                                                    <CheckCircle className="h-4 w-4" />
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            });
                          }
                        })()}
                      </div>
                      
                      {/* Additional Vaccination Resources - Add new section */}
                      <div className="mt-8 space-y-4">
                        <h3 className="text-lg font-semibold">Additional Vaccination Resources</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          {/* Catchup Vaccination */}
                          <Link href="/catchup-vaccination" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-white mb-1">Catchup Vaccination</h4>
                                <p className="text-sm text-gray-400">
                                  Guidelines for missed or delayed vaccinations to ensure proper immunization coverage.
                                </p>
                              </div>
                              <ExternalLink className="h-5 w-5 text-gray-400" />
                            </div>
                          </Link>
                          
                          {/* Vaccination in Special Situations */}
                          <Link href="/special-vaccination" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-white mb-1">Special Situations</h4>
                                <p className="text-sm text-gray-400">
                                  Specific vaccination protocols for immunocompromised children, travel, or other special circumstances.
                                </p>
                              </div>
                              <ExternalLink className="h-5 w-5 text-gray-400" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </main>
  );
} 