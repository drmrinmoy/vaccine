'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ChevronLeft, Share2 } from 'lucide-react';
import { mockNutritionTips } from '@/data/mock';
import { BottomNav } from '@/components/bottom-nav';

const relatedTips = [
  {
    title: 'Fun Food Facts',
    items: [
      'Carrots were originally purple before being bred orange',
      'Honey never spoils - archaeologists found edible honey in ancient Egyptian tombs',
      'Apples float in water because they are 25% air'
    ]
  },
  {
    title: 'Did You Know?',
    items: [
      'Eating slowly helps you feel full with less food',
      'Different colored fruits have different nutrients',
      'Drinking water before meals can help control portion sizes'
    ]
  }
];

export default function TipDetailPage() {
  const { id } = useParams();
  const tip = mockNutritionTips.find(t => t.id === id);

  if (!tip) {
    return <div>Tip not found</div>;
  }

  return (
    <div className="pb-16">
      {/* Hero Image */}
      <div className="relative h-64 w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        {tip.image && (
          <Image
            src={tip.image}
            alt={tip.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute top-4 left-4 z-20">
          <button className="bg-black/50 rounded-full p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <button className="bg-black/50 rounded-full p-2">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-4 -mt-16 relative z-20">
        <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-600 rounded-full text-sm">
              {tip.category}
            </span>
            <span className="text-sm text-gray-400">
              For ages {tip.ageGroup.join(', ')}
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-4">{tip.title}</h1>
          <p className="text-gray-300 leading-relaxed mb-6">{tip.content}</p>

          {/* Related Tips */}
          {relatedTips.map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
              <div className="space-y-3">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-black/30 rounded-lg p-4 border border-gray-800"
                  >
                    <p className="text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Interactive Elements */}
          <div className="space-y-4">
            <button className="w-full bg-green-600 text-white rounded-lg py-3 font-medium">
              Save to Favorites
            </button>
            <button className="w-full bg-gray-800 text-white rounded-lg py-3 font-medium">
              Share with Friends
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
} 