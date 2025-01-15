'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Clock, Users, ChevronLeft, Star, Heart } from 'lucide-react';
import { mockRecipes } from '@/data/mock';
import { BottomNav } from '@/components/bottom-nav';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const recipe = mockRecipes.find(r => r.id === id);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div className="pb-16">
      {/* Recipe Image */}
      <div className="relative h-72 w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <Image
          src={recipe.image}
          alt={recipe.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4 z-20">
          <button className="bg-black/50 rounded-full p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <button className="bg-black/50 rounded-full p-2">
            <Heart className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h1 className="text-2xl font-bold mb-2">{recipe.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{recipe.rating} ({recipe.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Nutrition Info */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Nutrition Information</h2>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(recipe.nutrition).map(([key, value]) => (
              <div key={key} className="bg-gray-900 rounded-lg p-3 text-center">
                <span className="text-lg font-semibold">{value}g</span>
                <p className="text-xs text-gray-400 capitalize">{key}</p>
              </div>
            ))}
            <div className="bg-gray-900 rounded-lg p-3 text-center">
              <span className="text-lg font-semibold">{recipe.calories}</span>
              <p className="text-xs text-gray-400">Calories</p>
            </div>
          </div>
        </section>

        {/* Ingredients */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Cooking Steps</h2>
          <div className="space-y-4">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-none w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <p className="flex-1 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tags */}
        <section>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 rounded-full bg-green-900/30 text-green-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
} 