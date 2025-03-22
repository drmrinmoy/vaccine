'use client';

import React, { useState, useEffect } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { RecipeCard } from '@/components/recipe-card';
import { NutritionTipCard } from '@/components/nutrition-tip-card';
import { AddChildForm } from '@/components/add-child-form';
import { CompactVaccineSchedule } from '@/components/compact-vaccine-schedule';
import { mockRecipes, mockNutritionTips, mockUserProfile, mockVaccines, mockVaccineSchedule, mockChildren } from '@/data/mock';
import { TrendingUp, Shield, Plus, X, User, ChevronRight, Clipboard, Syringe, Utensils, Trash2, Edit } from 'lucide-react';
import { getVaccineRecommendations } from '@/utils/vaccine-utils';
import { formatAge } from '@/utils/vaccine-utils';
import { Child } from '@/types';
import Link from 'next/link';

export default function Home() {
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'vaccines' | 'growth' | 'nutrition'>('vaccines');
  const [editMode, setEditMode] = useState(false);
  const [childToEdit, setChildToEdit] = useState<Child | null>(null);
  
  // Growth parameters editing states
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [isEditingHeadCircumference, setIsEditingHeadCircumference] = useState(false);
  const [heightValue, setHeightValue] = useState('');
  const [weightValue, setWeightValue] = useState('');
  const [headCircumferenceValue, setHeadCircumferenceValue] = useState('');
  
  // Set the first child as selected by default if available
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
      // Set active tab to 'growth' by default when a child is selected
      setActiveTab('growth');
    }
  }, [children, selectedChild]);
  
  // Function to select a child and show their details
  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
    setActiveTab('growth'); // Switch to growth tab when selecting a child
  };
  
  // Get vaccine recommendations for the selected child
  const vaccineRecommendations = selectedChild 
    ? getVaccineRecommendations(selectedChild, mockVaccines, mockVaccineSchedule)
    : [];

  // Handle adding a new child
  const handleAddChild = (newChild: Omit<Child, 'id' | 'vaccineHistory'>) => {
    if (editMode && childToEdit) {
      // Update existing child
      const updatedChildren = children.map(child => 
        child.id === childToEdit.id 
          ? { 
              ...child, 
              name: newChild.name,
              dateOfBirth: newChild.dateOfBirth,
              gender: newChild.gender,
              weight: newChild.weight,
              height: newChild.height,
              headCircumference: newChild.headCircumference
            } 
          : child
      );
      
      setChildren(updatedChildren);
      setSelectedChild(updatedChildren.find(child => child.id === childToEdit.id) || null);
      setActiveTab('growth'); // Switch to growth tab after updating a child
      setEditMode(false);
      setChildToEdit(null);
    } else {
      // Add new child
      const newChildWithId: Child = {
        ...newChild,
        id: `c${children.length + 1}`,
        vaccineHistory: []
      };
      
      setChildren([...children, newChildWithId]);
      setSelectedChild(newChildWithId);
      setActiveTab('growth'); // Switch to growth tab after adding a new child
    }
    
    setShowAddChildForm(false);
  };

  // Handle clearing selected child
  const handleClearSelectedChild = () => {
    setSelectedChild(null);
  };
  
  // Handle deleting a child
  const handleDeleteChild = (childId: string) => {
    const updatedChildren = children.filter(child => child.id !== childId);
    setChildren(updatedChildren);
    
    if (selectedChild && selectedChild.id === childId) {
      setSelectedChild(updatedChildren.length > 0 ? updatedChildren[0] : null);
    }
  };
  
  // Handle editing a child
  const handleEditChild = (child: Child) => {
    setChildToEdit(child);
    setEditMode(true);
    setShowAddChildForm(true);
  };
  
  // Handle canceling the form
  const handleCancelForm = () => {
    setShowAddChildForm(false);
    setEditMode(false);
    setChildToEdit(null);
  };

  // Handle updating growth parameters
  const handleGrowthParamUpdate = (param: 'height' | 'weight' | 'headCircumference', value: string) => {
    if (!selectedChild) return;
    
    // Validate input
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;
    
    // Update the child with the new parameter value
    const updatedChildren = children.map(child => 
      child.id === selectedChild.id 
        ? { ...child, [param]: numValue } 
        : child
    );
    
    setChildren(updatedChildren);
    setSelectedChild(updatedChildren.find(child => child.id === selectedChild.id) || null);
    
    // Reset editing states
    setIsEditingHeight(false);
    setIsEditingWeight(false);
    setIsEditingHeadCircumference(false);
  };
  
  // Initialize editing values when the selected child changes
  useEffect(() => {
    if (selectedChild) {
      setHeightValue(selectedChild.height?.toString() || '');
      setWeightValue(selectedChild.weight?.toString() || '');
      setHeadCircumferenceValue(selectedChild.headCircumference?.toString() || '');
    }
  }, [selectedChild]);
  
  // Reset editing state for a parameter
  const resetEditingState = (param: 'height' | 'weight' | 'headCircumference') => {
    if (!selectedChild) return;
    
    if (param === 'height') {
      setIsEditingHeight(false);
      setHeightValue(selectedChild.height?.toString() || '');
    } else if (param === 'weight') {
      setIsEditingWeight(false);
      setWeightValue(selectedChild.weight?.toString() || '');
    } else if (param === 'headCircumference') {
      setIsEditingHeadCircumference(false);
      setHeadCircumferenceValue(selectedChild.headCircumference?.toString() || '');
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
      <section className="relative h-72 bg-gradient-to-b from-green-600 to-green-700">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <p className="text-sm text-green-100">Welcome back!</p>
          <h1 className="text-2xl font-bold">{mockUserProfile.name}&apos;s Dashboard</h1>
          
          {/* Quick Add Child Button */}
          <button
            onClick={() => {
              setEditMode(false);
              setChildToEdit(null);
              setShowAddChildForm(true);
            }}
            className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Child</span>
          </button>
          
          {/* Child Selection Area */}
          {children.length > 0 && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => handleSelectChild(child)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap ${
                    selectedChild?.id === child.id 
                      ? 'bg-green-500 text-white' 
                      : 'bg-black/20 text-green-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{child.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="px-4 py-6 space-y-8">
        {/* Add/Edit Child Form */}
        {showAddChildForm && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editMode ? 'Edit Child' : 'Add New Child'}
              </h2>
            </div>
            <AddChildForm 
              onSubmit={handleAddChild}
              onCancel={handleCancelForm}
              initialData={editMode && childToEdit ? {
                name: childToEdit.name,
                dateOfBirth: childToEdit.dateOfBirth,
                gender: childToEdit.gender,
                weight: childToEdit.weight,
                height: childToEdit.height,
                headCircumference: childToEdit.headCircumference
              } : undefined}
            />
          </section>
        )}

        {!showAddChildForm && children.length > 0 && (
          <section>
            {/* Child Tabs */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Children</h2>
              <button 
                onClick={() => {
                  setEditMode(false);
                  setChildToEdit(null);
                  setShowAddChildForm(true);
                }}
                className="text-sm text-green-400 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Child
              </button>
            </div>
            
            {/* Child Selection Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => handleSelectChild(child)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                    selectedChild?.id === child.id 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center">
                    <User className="w-3 h-3" />
                  </div>
                  <span>{child.name}</span>
                  {selectedChild?.id === child.id && (
                    <span className="ml-1 text-xs bg-green-700 px-1.5 py-0.5 rounded-full">Selected</span>
                  )}
                </button>
              ))}
            </div>

            {/* Selected Child Information */}
            {selectedChild && (
              <div className="bg-gray-900 rounded-lg border border-gray-800">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedChild.name}</h2>
                      <p className="text-sm text-gray-400">{formatAge(selectedChild.dateOfBirth)} • {selectedChild.gender} • {selectedChild.bloodGroup || 'Unknown blood group'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditChild(selectedChild)}
                      className="text-sm text-green-400 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteChild(selectedChild.id)}
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
                        onClick={() => setActiveTab('vaccines')}
                        className={`pb-2 px-1 ${
                          activeTab === 'vaccines' 
                            ? 'border-b-2 border-green-500 text-green-500' 
                            : 'text-gray-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <Syringe className="w-4 h-4 mr-1" />
                          Vaccines
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('growth')}
                        className={`pb-2 px-1 ${
                          activeTab === 'growth' 
                            ? 'border-b-2 border-green-500 text-green-500' 
                            : 'text-gray-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Growth
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('nutrition')}
                        className={`pb-2 px-1 ${
                          activeTab === 'nutrition' 
                            ? 'border-b-2 border-green-500 text-green-500' 
                            : 'text-gray-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <Utensils className="w-4 h-4 mr-1" />
                          Nutrition
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  <div>
                    {activeTab === 'vaccines' && (
                      <div className="space-y-4">
                        {vaccineRecommendations.length > 0 ? (
                          <CompactVaccineSchedule
                            child={selectedChild}
                            vaccineRecommendations={vaccineRecommendations}
                            maxDisplay={6}
                            showViewAll={true}
                          />
                        ) : (
                          <div className="text-center py-6">
                            <Shield className="w-12 h-12 text-green-500 mx-auto mb-2 opacity-50" />
                            <p className="text-gray-400">No vaccines found for this child</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <Link href="/vaccines/schedule" className="flex flex-col items-center justify-center py-3 px-4 bg-gray-800 rounded-lg text-white hover:bg-gray-700 text-center">
                            <Clipboard className="w-5 h-5 mb-1 text-green-500" />
                            <span className="text-sm">Vaccine Schedule</span>
                          </Link>
                          
                          <Link href="/vaccines/record" className="flex flex-col items-center justify-center py-3 px-4 bg-gray-800 rounded-lg text-white hover:bg-gray-700 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-green-500">
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <path d="M7 7h.01" />
                              <path d="M10.5 7h7" />
                              <path d="M7 10.5h.01" />
                              <path d="M10.5 10.5h7" />
                              <path d="M7 14h.01" />
                              <path d="M10.5 14h7" />
                              <path d="M7 17.5h.01" />
                              <path d="M10.5 17.5h7" />
                            </svg>
                            <span className="text-sm">Vaccination Record</span>
                          </Link>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'growth' && (
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
                                    onClick={() => handleGrowthParamUpdate('height', heightValue)}
                                    className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xl font-semibold">{selectedChild.height || '—'} cm</p>
                            )}
                            
                            {selectedChild.height && !isEditingHeight && (
                              <div className="mt-1">
                                <p className="text-xs text-green-400">On track for age</p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Z-score:</span>
                                    <span className="text-xs font-medium">+0.8</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Percentile:</span>
                                    <span className="text-xs font-medium">75th</span>
                                  </div>
                                </div>
                              </div>
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
                                    onClick={() => handleGrowthParamUpdate('weight', weightValue)}
                                    className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xl font-semibold">{selectedChild.weight || '—'} kg</p>
                            )}
                            
                            {selectedChild.weight && !isEditingWeight && (
                              <div className="mt-1">
                                <p className="text-xs text-green-400">On track for age</p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Z-score:</span>
                                    <span className="text-xs font-medium">+0.5</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Percentile:</span>
                                    <span className="text-xs font-medium">65th</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-400">Head</p>
                              {!isEditingHeadCircumference && (
                                <button 
                                  onClick={() => setIsEditingHeadCircumference(true)}
                                  className="p-1 bg-gray-700 rounded-full hover:bg-gray-600"
                                  title="Edit head circumference"
                                >
                                  <Edit className="w-3 h-3 text-gray-400" />
                                </button>
                              )}
                            </div>
                            
                            {isEditingHeadCircumference ? (
                              <div className="mt-1">
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    value={headCircumferenceValue}
                                    onChange={(e) => setHeadCircumferenceValue(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-lg"
                                    min="0"
                                    step="0.1"
                                  />
                                  <span className="ml-1 text-gray-400">cm</span>
                                </div>
                                <div className="flex justify-end mt-2 space-x-2">
                                  <button 
                                    onClick={() => resetEditingState('headCircumference')}
                                    className="px-2 py-1 bg-gray-700 text-xs rounded"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={() => handleGrowthParamUpdate('headCircumference', headCircumferenceValue)}
                                    className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xl font-semibold">{selectedChild.headCircumference || '—'} cm</p>
                            )}
                            
                            {selectedChild.headCircumference && !isEditingHeadCircumference && (
                              <div className="mt-1">
                                <p className="text-xs text-green-400">On track for age</p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Z-score:</span>
                                    <span className="text-xs font-medium">+0.2</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Percentile:</span>
                                    <span className="text-xs font-medium">55th</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800 rounded-lg p-4">
                            <p className="text-sm text-gray-400">BMI</p>
                            {selectedChild.height && selectedChild.weight ? (
                              <div>
                                <p className="text-xl font-semibold">
                                  {calculateBMI(selectedChild.weight, selectedChild.height)}
                                </p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Z-score:</span>
                                    <span className="text-xs font-medium">+0.3</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Percentile:</span>
                                    <span className="text-xs font-medium">60th</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Status:</span>
                                    <span className="text-xs font-medium text-green-400">Normal</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xl font-semibold">—</p>
                            )}
                          </div>
                          
                          <div className="bg-gray-800 rounded-lg p-4">
                            <p className="text-sm text-gray-400">Weight-for-Height</p>
                            {selectedChild.height && selectedChild.weight ? (
                              <div>
                                <p className="text-xl font-semibold">Normal</p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Z-score:</span>
                                    <span className="text-xs font-medium">+0.4</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Percentile:</span>
                                    <span className="text-xs font-medium">62nd</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xl font-semibold">—</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm text-gray-400">Growth Velocity</p>
                            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full">Normal</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Height Gain</p>
                              <p className="text-sm font-medium">+2.5 cm</p>
                              <p className="text-xs text-gray-500">last 3 months</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Weight Gain</p>
                              <p className="text-sm font-medium">+1.2 kg</p>
                              <p className="text-xs text-gray-500">last 3 months</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Head Growth</p>
                              <p className="text-sm font-medium">+0.5 cm</p>
                              <p className="text-xs text-gray-500">last 3 months</p>
                            </div>
                          </div>
                        </div>
                        
                        <Link href={`/growth?childId=${selectedChild?.id || ''}`} className="flex items-center justify-between py-3 px-4 bg-gray-800 rounded-lg text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                            <span>View Growth Charts & History</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </Link>
                      </div>
                    )}
                    
                    {activeTab === 'nutrition' && (
                      <div className="space-y-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-2">Daily Nutrition Requirements</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Calories</p>
                              <p className="text-lg font-semibold">1400-1600 kcal</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Protein</p>
                              <p className="text-lg font-semibold">25-35g</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Carbohydrates</p>
                              <p className="text-lg font-semibold">130-150g</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Fats</p>
                              <p className="text-lg font-semibold">40-50g</p>
                            </div>
                          </div>
                        </div>
                        
                        <Link href="/meal-plans" className="flex items-center justify-between py-3 px-4 bg-gray-800 rounded-lg text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Utensils className="w-5 h-5 mr-2 text-green-500" />
                            <span>View Recommended Meal Plans</span>
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

        {/* No Child Selected State */}
        {!selectedChild && !showAddChildForm && children.length === 0 && (
          <section className="text-center py-8">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Children Added Yet</h3>
            <p className="text-gray-400 mb-4">Add your first child to get started</p>
            <button
              onClick={() => {
                setEditMode(false);
                setChildToEdit(null);
                setShowAddChildForm(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add New Child
            </button>
          </section>
        )}

        {/* Clinical Tools Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Clinical Tools</h2>
            <Link href="/tools" className="text-sm text-green-400">View all</Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link href="/tools/bp-centile" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-medium text-sm">BP Centile</h3>
                <p className="text-xs text-gray-400 mt-1">Calculate blood pressure percentiles</p>
              </div>
            </Link>
            
            <Link href="/tools/normal-values" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center mb-3">
                  <Clipboard className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-medium text-sm">Normal Values</h3>
                <p className="text-xs text-gray-400 mt-1">Reference ranges by age</p>
              </div>
            </Link>
            
            <Link href="/tools/growth-calculator" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-400">
                    <path d="M12 2v20"></path>
                    <path d="M2 12h20"></path>
                    <path d="m4.93 4.93 14.14 14.14"></path>
                    <path d="m19.07 4.93-14.14 14.14"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">Growth Velocity</h3>
                <p className="text-xs text-gray-400 mt-1">Calculate growth rates</p>
              </div>
            </Link>
            
            <Link href="/tools/fluid-calculator" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyan-400">
                    <path d="M12 2v20"></path>
                    <path d="M2 12h20"></path>
                    <path d="M7 12a5 5 0 0 1 5-5"></path>
                    <path d="M17 12a5 5 0 0 0-5-5"></path>
                    <path d="M7 12a5 5 0 0 0 5 5"></path>
                    <path d="M17 12a5 5 0 0 1-5 5"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">Fluid Calculator</h3>
                <p className="text-xs text-gray-400 mt-1">Calculate fluid requirements</p>
              </div>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-4">
            <Link href="/tools/bmi-calculator" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-400">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                    <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                    <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">BMI Calculator</h3>
                <p className="text-xs text-gray-400 mt-1">Calculate & interpret BMI</p>
              </div>
            </Link>
            
            <Link href="/tools/gir-calculator" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-400">
                    <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Z" />
                    <path d="M9 10h6" />
                    <path d="M12 7v6" />
                    <path d="M9 17h6" />
                  </svg>
                </div>
                <h3 className="font-medium text-sm">GIR Calculator</h3>
                <p className="text-xs text-gray-400 mt-1">Calculate glucose infusion rates</p>
              </div>
            </Link>
            
            <Link href="/tools/nutrition-calculator" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-400">
                    <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8"></path>
                    <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">Nutrition Calc</h3>
                <p className="text-xs text-gray-400 mt-1">Calculate nutritional needs</p>
              </div>
            </Link>
            
            <Link href="/tools/pedigree" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-indigo-400">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M12 3v18" />
                    <path d="M7 7h5" />
                    <path d="M7 12h5" />
                    <path d="M7 17h5" />
                    <path d="M17 7h.01" />
                    <path d="M17 12h.01" />
                    <path d="M17 17h.01" />
                  </svg>
                </div>
                <h3 className="font-medium text-sm">Pedigree Chart</h3>
                <p className="text-xs text-gray-400 mt-1">Create family pedigrees</p>
              </div>
            </Link>
            
            <Link href="/tools/all" className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <h3 className="font-medium text-sm">More Tools</h3>
                <p className="text-xs text-gray-400 mt-1">View all clinical tools</p>
              </div>
            </Link>
          </div>
        </section>
        </div>

      <BottomNav />
    </div>
  );
} 