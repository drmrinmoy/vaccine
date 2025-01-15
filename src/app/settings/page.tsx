'use client';

import React from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { ChevronRight, Bell, Moon, Globe, Shield, HelpCircle, LogOut } from 'lucide-react';
import { mockUserProfile } from '@/data/mock';

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: Bell, label: 'Notifications', value: 'On' },
      { icon: Moon, label: 'Dark Mode', value: 'System' },
      { icon: Globe, label: 'Language', value: 'English' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { icon: Shield, label: 'Privacy', value: null },
      { icon: HelpCircle, label: 'Help & Support', value: null },
      { icon: LogOut, label: 'Sign Out', value: null, danger: true },
    ]
  }
];

const dietaryRestrictions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Egg-Free'
];

export default function SettingsPage() {
  return (
    <div className="pb-16">
      <header className="bg-gradient-to-b from-green-600 to-green-700 p-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm opacity-80">Customize your experience</p>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <section className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-xl font-bold">
              {mockUserProfile.name[0]}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{mockUserProfile.name}</h2>
              <p className="text-sm text-gray-400">{mockUserProfile.age} years old</p>
            </div>
            <button className="text-green-400">Edit</button>
          </div>
        </section>

        {/* Dietary Preferences */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Dietary Preferences</h2>
          <div className="grid grid-cols-2 gap-2">
            {dietaryRestrictions.map((restriction) => (
              <label
                key={restriction}
                className="flex items-center gap-2 bg-gray-900 rounded-lg p-3"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 text-green-600 focus:ring-green-500"
                  checked={mockUserProfile.dietaryPreferences.includes(restriction)}
                  readOnly
                />
                <span>{restriction}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`w-full flex items-center justify-between p-3 bg-gray-900 rounded-lg ${
                      item.danger ? 'text-red-400' : 'text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      {item.value && <span className="text-sm">{item.value}</span>}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <div className="text-center text-sm text-gray-400 pt-4">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2024 YumGrow. All rights reserved.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
} 