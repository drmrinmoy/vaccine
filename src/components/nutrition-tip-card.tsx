'use client';

import React from 'react';
import Image from 'next/image';
import { NutritionTip } from '@/types';

interface NutritionTipCardProps {
  tip: NutritionTip;
  className?: string;
}

export function NutritionTipCard({ tip, className = '' }: NutritionTipCardProps) {
  return (
    <div className={`bg-gradient-to-br from-green-900/50 to-gray-900 rounded-lg overflow-hidden ${className}`}>
      {tip.image && (
        <div className="relative h-32 w-full">
          <Image
            src={tip.image}
            alt={tip.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-1 rounded-full bg-green-900/50 text-green-400">
            {tip.category}
          </span>
          <span className="text-xs text-gray-400">
            For ages {tip.ageGroup.join(', ')}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{tip.content}</p>

        <button className="mt-4 text-sm text-green-400 hover:text-green-300 transition-colors">
          Learn more →
        </button>
      </div>
    </div>
  );
} 