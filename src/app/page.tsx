'use client';

import React from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { RecipeCard } from '@/components/recipe-card';
import { NutritionTipCard } from '@/components/nutrition-tip-card';
import { AchievementCard } from '@/components/achievement-card';
import { mockRecipes, mockNutritionTips, mockAchievements, mockUserProfile } from '@/data/mock';
import { TrendingUp, Apple, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative h-72 bg-gradient-to-b from-green-600 to-green-700">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <p className="text-sm text-green-100">Welcome back!</p>
          <h1 className="text-2xl font-bold">{mockUserProfile.name}&apos;s Growth Journey</h1>
          <p className="text-sm text-green-100 mt-1">Age: {mockUserProfile.age} years</p>
          
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-black/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-100" />
                <p className="text-sm text-green-100">Growth</p>
              </div>
              <p className="text-lg font-semibold">On Track</p>
            </div>
            <div className="bg-black/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-green-100" />
                <p className="text-sm text-green-100">Nutrition</p>
              </div>
              <p className="text-lg font-semibold">Good</p>
            </div>
            <div className="bg-black/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-green-100" />
                <p className="text-sm text-green-100">Activity</p>
              </div>
              <p className="text-lg font-semibold">Active</p>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 py-6 space-y-8">
        {/* Growth Milestones */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Growth Milestones</h2>
            <button className="text-sm text-green-400">View details</button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Height</p>
                <p className="text-lg font-semibold">125 cm</p>
                <p className="text-xs text-green-400">+2 cm this month</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Weight</p>
                <p className="text-lg font-semibold">28 kg</p>
                <p className="text-xs text-green-400">+0.5 kg this month</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">BMI</p>
                <p className="text-lg font-semibold">17.9</p>
                <p className="text-xs text-green-400">Healthy range</p>
              </div>
            </div>
          </div>
        </section>

        {/* Today's Meal Plan */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Today&apos;s Meal Plan</h2>
            <button className="text-sm text-green-400">View all</button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mockRecipes.slice(0, 2).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* Nutrition Tips */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Nutrition Tips for {mockUserProfile.name}</h2>
          <div className="space-y-4">
            {mockNutritionTips.map((tip) => (
              <NutritionTipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </section>

        {/* Learning Progress */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
          <div className="space-y-4">
            {mockAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
} 