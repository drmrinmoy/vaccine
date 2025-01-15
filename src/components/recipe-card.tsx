'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, Users, Star } from 'lucide-react';
import { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export function RecipeCard({ recipe, className = '' }: RecipeCardProps) {
  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden card-hover ${className}`}>
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <Image
          src={recipe.image}
          alt={recipe.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 bg-black/60 rounded-full px-2 py-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm">{recipe.rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{recipe.name}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-green-900/30 text-green-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 