'use client';

import React from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { RecipeCard } from '@/components/recipe-card';
import { NutritionTipCard } from '@/components/nutrition-tip-card';
import { AchievementCard } from '@/components/achievement-card';
import { mockRecipes, mockNutritionTips, mockAchievements, mockUserProfile } from '@/data/mock';

export default function Home() {
  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-b from-green-600 to-green-700">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <p className="text-sm text-green-100">Welcome back</p>
          <h1 className="text-2xl font-bold">{mockUserProfile.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-black/20 rounded-lg px-3 py-2">
              <p className="text-sm text-green-100">Streak</p>
              <p className="text-xl font-semibold">{mockUserProfile.streakDays} days 🔥</p>
            </div>
            <div className="bg-black/20 rounded-lg px-3 py-2">
              <p className="text-sm text-green-100">Achievements</p>
              <p className="text-xl font-semibold">{mockUserProfile.achievements.filter(a => a.unlocked).length} unlocked 🏆</p>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 py-6 space-y-8">
        {/* Today's Recommendations */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Today's Picks</h2>
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
          <h2 className="text-xl font-semibold mb-4">Nutrition Tips</h2>
          <div className="space-y-4">
            {mockNutritionTips.map((tip) => (
              <NutritionTipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
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