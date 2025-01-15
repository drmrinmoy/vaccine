'use client';

import React from 'react';
import { Achievement } from '@/types';

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
}

export function AchievementCard({ achievement, className = '' }: AchievementCardProps) {
  const progressPercentage = (achievement.progress / achievement.total) * 100;

  return (
    <div className={`bg-gray-900 rounded-lg p-4 ${className} ${achievement.unlocked ? 'border border-green-500' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{achievement.icon}</span>
        <div className="flex-1">
          <h3 className="font-medium">{achievement.name}</h3>
          <p className="text-sm text-gray-400">{achievement.description}</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className={achievement.unlocked ? 'text-green-400' : 'text-gray-400'}>
            {achievement.progress}/{achievement.total}
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              achievement.unlocked ? 'bg-green-500' : 'bg-green-700'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {achievement.unlocked && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 text-sm text-green-400">
            <span className="text-lg">🎉</span> Achievement Unlocked!
          </span>
        </div>
      )}
    </div>
  );
} 