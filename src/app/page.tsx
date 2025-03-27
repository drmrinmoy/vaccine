'use client';

import React, { useState, useEffect } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { RecipeCard } from '@/components/recipe-card';
import { SurgicalGuidelineCard } from '@/components/surgical-guideline-card';
import { AddPatientForm } from '@/components/add-patient-form';
import { CompactSurgicalSchedule } from '@/components/compact-surgical-schedule';
import { UpcomingSurgeriesReminder } from '@/components/upcoming-surgeries-reminder';
import { mockSurgicalGuidelines, mockUserProfile, mockProcedures, mockSurgicalSchedule, mockPatients } from '@/data/mock';
import { TrendingUp, Shield, Plus, X, User, ChevronRight, Clipboard, Syringe, Utensils, Trash2, Edit, CheckCircle2, ChevronDown } from 'lucide-react';
import { getProcedureRecommendations } from '@/utils/procedure-utils';
import { formatAge } from '@/utils/procedure-utils';
import { Patient } from '@/types';
import Link from 'next/link';
import { ProcedureStatusTracker } from '@/components/procedure-status-tracker';

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'vitals' | 'surgical'>('vitals');
  const [editMode, setEditMode] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [showProcedureSection, setShowProcedureSection] = useState(false);
  
  // Vitals editing states
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [isEditingBP, setIsEditingBP] = useState(false);
  const [heightValue, setHeightValue] = useState('');
  const [weightValue, setWeightValue] = useState('');
  const [bpValue, setBpValue] = useState('');
  
  // Set the first patient as selected by default if available
  useEffect(() => {
    if (patients.length > 0 && !selectedPatient) {
      setSelectedPatient(patients[0]);
      // Set active tab to 'vitals' by default when a patient is selected
      setActiveTab('vitals');
    }
  }, [patients, selectedPatient]);
  
  // Function to select a patient and show their details
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('vitals'); // Switch to vitals tab when selecting a patient
  };
  
  // Get procedure recommendations for the selected patient
  const procedureRecommendations = selectedPatient 
    ? getProcedureRecommendations(selectedPatient, mockProcedures, mockSurgicalSchedule)
    : [];

  // Handle adding a new patient
  const handleAddPatient = (newPatient: Omit<Patient, 'id' | 'procedureHistory'>) => {
    if (editMode && patientToEdit) {
      // Update existing patient
      const updatedPatients = patients.map(patient => 
        patient.id === patientToEdit.id 
          ? { 
              ...patient, 
              name: newPatient.name,
              dateOfBirth: newPatient.dateOfBirth,
              gender: newPatient.gender,
              weight: newPatient.weight,
              height: newPatient.height,
              bloodPressure: newPatient.bloodPressure
            } 
          : patient
      );
      
      setPatients(updatedPatients);
      setSelectedPatient(updatedPatients.find(patient => patient.id === patientToEdit.id) || null);
      setActiveTab('vitals'); // Switch to vitals tab after updating a patient
      setEditMode(false);
      setPatientToEdit(null);
    } else {
      // Add new patient
      const newPatientWithId: Patient = {
        ...newPatient,
        id: `p${patients.length + 1}`,
        procedureHistory: []
      };
      
      setPatients([...patients, newPatientWithId]);
      setSelectedPatient(newPatientWithId);
      setActiveTab('vitals'); // Switch to vitals tab after adding a new patient
    }
    
    setShowAddPatientForm(false);
  };

  // Handle clearing selected patient
  const handleClearSelectedPatient = () => {
    setSelectedPatient(null);
  };
  
  // Handle deleting a patient
  const handleDeletePatient = (patientId: string) => {
    const updatedPatients = patients.filter(patient => patient.id !== patientId);
    setPatients(updatedPatients);
    
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient(updatedPatients.length > 0 ? updatedPatients[0] : null);
    }
  };
  
  // Handle editing a patient
  const handleEditPatient = (patient: Patient) => {
    setPatientToEdit(patient);
    setEditMode(true);
    setShowAddPatientForm(true);
  };
  
  // Handle canceling the form
  const handleCancelForm = () => {
    setShowAddPatientForm(false);
    setEditMode(false);
    setPatientToEdit(null);
  };

  // Handle updating vital parameters
  const handleVitalParamUpdate = (param: 'height' | 'weight' | 'bloodPressure', value: string) => {
    if (!selectedPatient) return;
    
    // Special handling for blood pressure
    if (param === 'bloodPressure') {
      // Basic validation for blood pressure format (e.g., "120/80")
      if (!/^\d+\/\d+$/.test(value)) return;
      
      const updatedPatients = patients.map(patient => 
        patient.id === selectedPatient.id 
          ? { ...patient, [param]: value } 
          : patient
      );
      
      setPatients(updatedPatients);
      setSelectedPatient(updatedPatients.find(patient => patient.id === selectedPatient.id) || null);
      setIsEditingBP(false);
      return;
    }
    
    // Validate input for height and weight
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;
    
    // Update the patient with the new parameter value
    const updatedPatients = patients.map(patient => 
      patient.id === selectedPatient.id 
        ? { ...patient, [param]: numValue } 
        : patient
    );
    
    setPatients(updatedPatients);
    setSelectedPatient(updatedPatients.find(patient => patient.id === selectedPatient.id) || null);
    
    // Reset editing states
    setIsEditingHeight(false);
    setIsEditingWeight(false);
  };
  
  // Handle updating procedure status
  const handleProcedureStatusUpdate = (procedureId: string, status: 'Scheduled' | 'Completed' | 'Cancelled', date?: string) => {
    if (!selectedPatient) return;
    
    // Check if the procedure exists in the patient's history
    const existingProcedureIndex = selectedPatient.procedureHistory.findIndex(
      proc => proc.procedureId === procedureId
    );
    
    let updatedHistory;
    
    if (existingProcedureIndex >= 0) {
      // Update existing procedure
      updatedHistory = [...selectedPatient.procedureHistory];
      updatedHistory[existingProcedureIndex] = {
        ...updatedHistory[existingProcedureIndex],
        status,
        ...(status === 'Scheduled' && date ? { dateScheduled: date } : {}),
        ...(status === 'Completed' && date ? { datePerformed: date } : {})
      };
    } else {
      // Add new procedure
      const newProcedure = {
        id: `proc${selectedPatient.procedureHistory.length + 1}`,
        procedureId,
        status,
        ...(status === 'Scheduled' && date ? { dateScheduled: date } : {}),
        ...(status === 'Completed' && date ? { datePerformed: date } : {})
      };
      updatedHistory = [...selectedPatient.procedureHistory, newProcedure];
    }
    
    // Update the patient's procedure history
    const updatedPatient = {
      ...selectedPatient,
      procedureHistory: updatedHistory
    };
    
    // Update patients array
    setPatients(patients.map(patient => 
      patient.id === selectedPatient.id ? updatedPatient : patient
    ));
    
    // Update selected patient
    setSelectedPatient(updatedPatient);
  };
  
  // Initialize editing values when the selected patient changes
  useEffect(() => {
    if (selectedPatient) {
      setHeightValue(selectedPatient.height?.toString() || '');
      setWeightValue(selectedPatient.weight?.toString() || '');
      setBpValue(selectedPatient.bloodPressure || '');
    }
  }, [selectedPatient]);
  
  // Reset editing state for a parameter
  const resetEditingState = (param: 'height' | 'weight' | 'bloodPressure') => {
    if (!selectedPatient) return;
    
    if (param === 'height') {
      setIsEditingHeight(false);
      setHeightValue(selectedPatient.height?.toString() || '');
    } else if (param === 'weight') {
      setIsEditingWeight(false);
      setWeightValue(selectedPatient.weight?.toString() || '');
    } else if (param === 'bloodPressure') {
      setIsEditingBP(false);
      setBpValue(selectedPatient.bloodPressure || '');
    }
  };

  // Calculate BMI
  const calculateBMI = (weight?: number, height?: number) => {
    if (!weight || !height || height === 0) return null;
    return (weight / Math.pow(height / 100, 2)).toFixed(1);
  };

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative h-72 bg-gradient-to-b from-blue-800 to-blue-900">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <p className="text-sm text-blue-100">Welcome back!</p>
          <h1 className="text-2xl font-bold">{mockUserProfile.name}&apos;s Surgical Dashboard</h1>
          
          {/* Quick Add Patient Button */}
          <button
            onClick={() => {
              setEditMode(false);
              setPatientToEdit(null);
              setShowAddPatientForm(true);
            }}
            className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Patient</span>
          </button>
          
          {/* Patient Selection Area */}
          {patients.length > 0 && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
              {patients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap ${
                    selectedPatient?.id === patient.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-black/20 text-blue-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{patient.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="px-4 py-6 space-y-8">
        {/* Add/Edit Patient Form */}
        {showAddPatientForm && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editMode ? 'Edit Patient' : 'Add New Patient'}
              </h2>
            </div>
            <AddPatientForm 
              onSubmit={handleAddPatient}
              onCancel={handleCancelForm}
              initialData={editMode && patientToEdit ? {
                name: patientToEdit.name,
                dateOfBirth: patientToEdit.dateOfBirth,
                gender: patientToEdit.gender,
                weight: patientToEdit.weight,
                height: patientToEdit.height,
                bloodPressure: patientToEdit.bloodPressure
              } : undefined}
            />
          </section>
        )}

        {!showAddPatientForm && patients.length > 0 && (
          <section>
            {/* Patient Tabs */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Patients</h2>
              <button 
                onClick={() => {
                  setEditMode(false);
                  setPatientToEdit(null);
                  setShowAddPatientForm(true);
                }}
                className="text-sm text-blue-400 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Patient
              </button>
            </div>
            
            {/* Patient Selection Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
              {patients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                    selectedPatient?.id === patient.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center">
                    <User className="w-3 h-3" />
                  </div>
                  <span>{patient.name}</span>
                  {selectedPatient?.id === patient.id && (
                    <span className="ml-1 text-xs bg-blue-700 px-1.5 py-0.5 rounded-full">Selected</span>
                  )}
                </button>
              ))}
            </div>

            {/* Selected Patient Information */}
            {selectedPatient && (
              <div className="bg-gray-900 rounded-lg border border-gray-800">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                      <p className="text-sm text-gray-400">{formatAge(selectedPatient.dateOfBirth)} • {selectedPatient.gender} • {selectedPatient.bloodGroup || 'Unknown blood group'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditPatient(selectedPatient)}
                      className="text-sm text-blue-400 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeletePatient(selectedPatient.id)}
                      className="text-sm text-red-400 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Tabs for different information */}
                  <div className="border-b border-gray-800 mb-4">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveTab('vitals')}
                        className={`pb-2 px-1 ${
                          activeTab === 'vitals' 
                            ? 'border-b-2 border-blue-500 text-blue-500' 
                            : 'text-gray-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Vitals
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('surgical')}
                        className={`pb-2 px-1 ${
                          activeTab === 'surgical' 
                            ? 'border-b-2 border-blue-500 text-blue-500' 
                            : 'text-gray-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <Syringe className="w-4 h-4 mr-1" />
                          Surgical
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  <div>
                    {activeTab === 'vitals' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-400">Height</p>
                              {!isEditingHeight && (
                                <button 
                                  onClick={() => setIsEditingHeight(true)}
                                  className="p-1 bg-gray-700 rounded-full hover:bg-gray-600"
                                  title="Edit height"
                                >
                                  <Edit className="w-3 h-3 text-gray-400" />
                                </button>
                              )}
                            </div>
                            
                            {isEditingHeight ? (
                              <div className="mt-1">
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    value={heightValue}
                                    onChange={(e) => setHeightValue(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-lg"
                                    min="0"
                                    step="0.1"
                                  />
                                  <span className="ml-1 text-gray-400">cm</span>
                                </div>
                                <div className="flex justify-end mt-2 space-x-2">
                                  <button 
                                    onClick={() => resetEditingState('height')}
                                    className="px-2 py-1 bg-gray-700 text-xs rounded"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={() => handleVitalParamUpdate('height', heightValue)}
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xl font-semibold">{selectedPatient.height || '—'} cm</p>
                            )}
                          </div>
                          <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-400">Weight</p>
                              {!isEditingWeight && (
                                <button 
                                  onClick={() => setIsEditingWeight(true)}
                                  className="p-1 bg-gray-700 rounded-full hover:bg-gray-600"
                                  title="Edit weight"
                                >
                                  <Edit className="w-3 h-3 text-gray-400" />
                                </button>
                              )}
                            </div>
                            
                            {isEditingWeight ? (
                              <div className="mt-1">
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    value={weightValue}
                                    onChange={(e) => setWeightValue(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-lg"
                                    min="0"
                                    step="0.1"
                                  />
                                  <span className="ml-1 text-gray-400">kg</span>
                                </div>
                                <div className="flex justify-end mt-2 space-x-2">
                                  <button 
                                    onClick={() => resetEditingState('weight')}
                                    className="px-2 py-1 bg-gray-700 text-xs rounded"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={() => handleVitalParamUpdate('weight', weightValue)}
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xl font-semibold">{selectedPatient.weight || '—'} kg</p>
                            )}
                          </div>
                          <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-400">BP</p>
                              {!isEditingBP && (
                                <button 
                                  onClick={() => setIsEditingBP(true)}
                                  className="p-1 bg-gray-700 rounded-full hover:bg-gray-600"
                                  title="Edit blood pressure"
                                >
                                  <Edit className="w-3 h-3 text-gray-400" />
                                </button>
                              )}
                            </div>
                            
                            {isEditingBP ? (
                              <div className="mt-1">
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    value={bpValue}
                                    onChange={(e) => setBpValue(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-lg"
                                    placeholder="120/80"
                                  />
                                  <span className="ml-1 text-gray-400">mmHg</span>
                                </div>
                                <div className="flex justify-end mt-2 space-x-2">
                                  <button 
                                    onClick={() => resetEditingState('bloodPressure')}
                                    className="px-2 py-1 bg-gray-700 text-xs rounded"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={() => handleVitalParamUpdate('bloodPressure', bpValue)}
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xl font-semibold">{selectedPatient.bloodPressure || '—'} mmHg</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800 rounded-lg p-4">
                            <p className="text-sm text-gray-400">BMI</p>
                            {selectedPatient.height && selectedPatient.weight ? (
                              <div>
                                <p className="text-xl font-semibold">
                                  {calculateBMI(selectedPatient.weight, selectedPatient.height)}
                                </p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Category:</span>
                                    <span className="text-xs font-medium text-blue-400">Normal</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Surgical Risk:</span>
                                    <span className="text-xs font-medium">Low</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xl font-semibold">—</p>
                            )}
                          </div>
                          
                          <div className="bg-gray-800 rounded-lg p-4">
                            <p className="text-sm text-gray-400">ASA Class</p>
                            <div>
                              <p className="text-xl font-semibold">II</p>
                              <div className="mt-2 space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-xs text-gray-500">Mortality Risk:</span>
                                  <span className="text-xs font-medium">0.4%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-gray-500">Status:</span>
                                  <span className="text-xs font-medium text-blue-400">Mild Systemic Disease</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm text-gray-400">Recent Lab Values</p>
                            <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded-full">Updated 2 days ago</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Hemoglobin</p>
                              <p className="text-sm font-medium">14.2 g/dL</p>
                              <p className="text-xs text-green-400">Normal</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Creatinine</p>
                              <p className="text-sm font-medium">0.8 mg/dL</p>
                              <p className="text-xs text-green-400">Normal</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">PT/INR</p>
                              <p className="text-sm font-medium">1.1</p>
                              <p className="text-xs text-green-400">Normal</p>
                            </div>
                          </div>
                        </div>
                        
                        <Link href={`/vitals?patientId=${selectedPatient?.id || ''}`} className="flex items-center justify-between py-3 px-4 bg-gray-800 rounded-lg text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                            <span>View Complete Vitals & Lab History</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </Link>
                      </div>
                    )}
                    
                    {activeTab === 'surgical' && (
                      <div className="space-y-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-2">Surgical Assessment</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Surgical Risk</p>
                              <p className="text-lg font-semibold">Low</p>
                              <p className="text-xs text-blue-400">Based on ASA class and comorbidities</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Anesthesia Type</p>
                              <p className="text-lg font-semibold">General</p>
                              <p className="text-xs text-gray-500">Recommended</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">NPO Status</p>
                              <p className="text-lg font-semibold">Clear for surgery</p>
                              <p className="text-xs text-gray-500">Last meal: 10 hours ago</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Allergies</p>
                              <p className="text-lg font-semibold">Penicillin</p>
                              <p className="text-xs text-red-400">Verified</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Display procedure status tracker */}
                        <ProcedureStatusTracker 
                          patient={selectedPatient}
                          procedures={mockProcedures}
                          onProcedureUpdate={handleProcedureStatusUpdate}
                        />
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm text-gray-400">Surgical History</p>
                            <button className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded-full">
                              Add New
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="p-3 bg-gray-900 rounded-lg">
                              <div className="flex justify-between mb-1">
                                <p className="font-medium">Appendectomy</p>
                                <p className="text-xs text-gray-500">2 years ago</p>
                              </div>
                              <p className="text-xs text-gray-400">Laparoscopic, uncomplicated</p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded mr-2">
                                  Dr. Johnson
                                </span>
                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                                  Memorial Hospital
                                </span>
                              </div>
                            </div>
                            
                            <div className="p-3 bg-gray-900 rounded-lg">
                              <div className="flex justify-between mb-1">
                                <p className="font-medium">Hernia Repair</p>
                                <p className="text-xs text-gray-500">5 years ago</p>
                              </div>
                              <p className="text-xs text-gray-400">Right inguinal, mesh placement</p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded mr-2">
                                  Dr. Smith
                                </span>
                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                                  City General
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm text-gray-400">Upcoming Procedures</p>
                            <button className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded-full">
                              Schedule
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-900/30 border border-blue-800 rounded-lg">
                              <div className="flex justify-between mb-1">
                                <p className="font-medium">Cholecystectomy</p>
                                <p className="text-xs text-blue-400">Scheduled</p>
                              </div>
                              <p className="text-xs text-gray-400">Laparoscopic, elective</p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded mr-2">
                                  June 15, 2023
                                </span>
                                <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">
                                  8:00 AM
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Link href="/surgical-planning" className="flex items-center justify-between py-3 px-4 bg-gray-800 rounded-lg text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Syringe className="w-5 h-5 mr-2 text-blue-500" />
                            <span>View Complete Surgical Records</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Expandable Procedure Section - Only show when patient is selected */}
        {selectedPatient && !showAddPatientForm && (
          <section className="mt-4">
            <div className="bg-gray-900 rounded-lg border border-gray-800">
              <button 
                onClick={() => setShowProcedureSection(!showProcedureSection)}
                className="w-full flex justify-between items-center p-4"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                    <Syringe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Quick Procedure Scheduler</h2>
                    <p className="text-sm text-gray-400">Schedule procedures and update surgical status</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showProcedureSection ? 'rotate-180' : ''}`} />
              </button>
              
              {showProcedureSection && (
                <div className="p-4 border-t border-gray-800">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-md font-medium mb-2 flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-blue-500" />
                      Quick Schedule
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Quickly schedule common procedures for this patient.
                      Perfect for documenting upcoming surgical interventions.
                    </p>
                    <Link
                      href={`/procedures/schedule?patientId=${selectedPatient.id}`}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Schedule Procedure</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* No Patient Selected State */}
        {!selectedPatient && !showAddPatientForm && patients.length === 0 && (
          <section className="text-center py-8">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Patients Added Yet</h3>
            <p className="text-gray-400 mb-4">Add your first patient to get started</p>
            <button
              onClick={() => {
                setEditMode(false);
                setPatientToEdit(null);
                setShowAddPatientForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add New Patient
            </button>
          </section>
        )}

        {/* Clinical Tools Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Surgical Tools</h2>
            <Link href="/tools" className="text-sm text-blue-400">View all</Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link href="/tools/surgical-risk" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-medium text-sm">Risk Calculator</h3>
                <p className="text-xs text-gray-400 mt-1">Calculate surgical risk</p>
              </div>
            </Link>
            
            <Link href="/tools/lab-values" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-3">
                  <Clipboard className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-medium text-sm">Lab References</h3>
                <p className="text-xs text-gray-400 mt-1">Normal ranges & flags</p>
              </div>
            </Link>
            
            <Link href="/tools/anesthesia-calculator" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-400">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">Anesthesia Calc</h3>
                <p className="text-xs text-gray-400 mt-1">Calculate dosages</p>
              </div>
            </Link>
            
            <Link href="/tools/fluid-calculator" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyan-400">
                    <path d="M8 2h8"></path>
                    <path d="M12 2v10.3a4 4 0 0 1-1.17 2.83l-1.9 1.91a4 4 0 0 0-1.17 2.83V22"></path>
                    <path d="M10 10.5v1"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">Fluid Calculator</h3>
                <p className="text-xs text-gray-400 mt-1">Perioperative fluids</p>
              </div>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-4">
            <Link href="/tools/bmi-calculator" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m4.93 4.93 14.14 14.14"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">BMI Calculator</h3>
                <p className="text-xs text-gray-400 mt-1">Calculate & interpret BMI</p>
              </div>
            </Link>
            
            <Link href="/tools/antibiotic-guide" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-400">
                    <path d="M15 11h.01"></path>
                    <path d="M11 15h.01"></path>
                    <path d="M16 16h.01"></path>
                    <path d="M10 13h.01"></path>
                    <path d="M18 10.01l-1-1l1-1"></path>
                    <path d="m6 16.01 1-1-1-1"></path>
                    <path d="m7 5.01 1 1-1 1"></path>
                    <path d="m17 19.01-1-1 1-1"></path>
                    <path d="M3 8h1"></path>
                    <path d="M20 8h1"></path>
                    <path d="M8 3v1"></path>
                    <path d="M8 20v1"></path>
                    <path d="M16 3v1"></path>
                    <path d="M16 20v1"></path>
                    <path d="M3 16h1"></path>
                    <path d="M20 16h1"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">Antibiotic Guide</h3>
                <p className="text-xs text-gray-400 mt-1">Prophylaxis protocols</p>
              </div>
            </Link>
            
            <Link href="/tools/suture-guide" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-400">
                    <path d="M2 12s5-7 10-7 10 7 10 7-5 7-10 7-10-7-10-7Z"></path>
                    <path d="M5 12v.01"></path>
                    <path d="M19 12v.01"></path>
                    <path d="M12 12v.01"></path>
                    <path d="M12 7v.01"></path>
                    <path d="M12 17v.01"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">Suture Guide</h3>
                <p className="text-xs text-gray-400 mt-1">Selection & techniques</p>
              </div>
            </Link>
            
            <Link href="/tools/all" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">More Tools</h3>
                <p className="text-xs text-gray-400 mt-1">View all surgical tools</p>
              </div>
            </Link>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
} 