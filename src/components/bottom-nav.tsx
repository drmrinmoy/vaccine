'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Syringe, Shield, Brain } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="h-6 w-6" />,
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Syringe className="h-6 w-6" />,
    },
    {
      label: 'Vaccines',
      href: '/explore/vaccines',
      icon: <Shield className="h-6 w-6" />,
    },
    {
      label: 'Vaccine AI',
      href: '/vaccine-ai',
      icon: <Brain className="h-6 w-6" />,
    },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-2 py-3 z-50">
      <div className="max-w-lg mx-auto">
        <ul className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center ${
                    isActive ? 'text-green-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
} 