import React from 'react';
import { SurgicalGuideline } from '@/types';
import { Bookmark, Share2, ExternalLink } from 'lucide-react';

interface SurgicalGuidelineCardProps {
  guideline: SurgicalGuideline;
}

export function SurgicalGuidelineCard({ guideline }: SurgicalGuidelineCardProps) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium bg-blue-900/50 text-blue-400 px-2 py-1 rounded-full">
            {guideline.category}
          </span>
          <span className="text-xs text-gray-500">
            Updated: {new Date(guideline.lastUpdated).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-lg font-medium mb-2">{guideline.title}</h3>
        <p className="text-gray-400 text-sm mb-3">{guideline.content}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {guideline.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <span className="text-xs text-gray-500">Source: {guideline.source}</span>
          <div className="flex space-x-2">
            <button className="p-1 text-gray-500 hover:text-blue-400">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-500 hover:text-blue-400">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-500 hover:text-blue-400">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 