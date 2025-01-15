'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import { mockRecipes } from '@/data/mock';
import { Recipe } from '@/types';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const;

type Day = typeof days[number];
type Meal = typeof meals[number];
type DailyPlan = Record<Meal, Recipe>;
type WeeklyPlan = Record<Day, DailyPlan>;

// Mock weekly meal plan data
const mockWeeklyPlan: WeeklyPlan = days.reduce((acc, day) => {
  acc[day] = meals.reduce((mealAcc, meal) => {
    mealAcc[meal] = mockRecipes[0];
    return mealAcc;
  }, {} as DailyPlan);
  return acc;
}, {} as WeeklyPlan);

export default function MealPlansPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const formatWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  return (
    <div className="pb-16">
      {/* Header */}
      <header className="bg-gradient-to-b from-green-600 to-green-700 p-4">
        <h1 className="text-2xl font-bold">Meal Plans</h1>
        <p className="text-sm opacity-80">Plan your weekly meals</p>
      </header>

      {/* Week Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={() => navigateWeek('prev')}
          className="p-2 hover:bg-gray-900 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium">{formatWeekRange(currentWeek)}</span>
        <button
          onClick={() => navigateWeek('next')}
          className="p-2 hover:bg-gray-900 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekly Plan */}
      <div className="p-4 space-y-6">
        {days.map((day) => (
          <section key={day} className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="bg-black/30 p-3">
              <h2 className="font-medium">{day}</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {meals.map((meal) => {
                const recipe = mockWeeklyPlan[day][meal];
                return (
                  <div key={meal} className="p-3 hover:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{meal}</span>
                      {recipe ? (
                        <div className="text-right">
                          <p className="text-sm font-medium">{recipe.name}</p>
                          <p className="text-xs text-gray-400">
                            {recipe.calories} cal • {recipe.prepTime}
                          </p>
                        </div>
                      ) : (
                        <button className="text-sm text-green-400">
                          + Add meal
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <BottomNav />
    </div>
  );
} 