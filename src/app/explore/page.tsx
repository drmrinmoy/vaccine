'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import { RecipeCard } from '@/components/recipe-card';
import { NutritionTipCard } from '@/components/nutrition-tip-card';
import { mockRecipes, mockNutritionTips } from '@/data/mock';

const categories = [
  'All',
  'Growth Foods',
  'Brain Foods',
  'Energy Foods',
  'Immunity',
  'Calcium Rich',
  'Iron Rich',
];

const ageGroups = [
  '4-6 years',
  '7-9 years',
  '10-12 years'
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAge, setSelectedAge] = useState('7-9 years');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || recipe.tags.includes(selectedCategory);
    const matchesAge = recipe.ageGroup.includes(selectedAge.split(' ')[0]);
    return matchesSearch && matchesCategory && matchesAge;
  });

  const filteredTips = mockNutritionTips.filter(tip =>
    (tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    tip.ageGroup.includes(selectedAge.split(' ')[0])
  );

  return (
    <div className="pb-16">
      {/* Search Header */}
      <header className="sticky top-0 z-30 bg-black p-4 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search age-appropriate recipes and nutrition tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </header>

      {/* Age Groups */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-gray-400">Age Group:</span>
          <div className="flex gap-2">
            {ageGroups.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedAge === age
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 p-4 whitespace-nowrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1 rounded-full text-sm ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Age-appropriate Recipes */}
        {filteredRecipes.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Age-appropriate Recipes</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        )}

        {/* Growth & Nutrition Tips */}
        {filteredTips.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Growth & Nutrition Tips</h2>
            <div className="space-y-4">
              {filteredTips.map((tip) => (
                <NutritionTipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredRecipes.length === 0 && filteredTips.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No results found for &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search, age group, or category filter</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
} 