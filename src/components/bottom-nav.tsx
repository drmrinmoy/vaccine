'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-black/90 backdrop-blur-lg border-t border-gray-800">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        <Link 
          href="/" 
          className={`flex flex-col items-center ${isActive('/') ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link 
          href="/explore" 
          className={`flex flex-col items-center ${isActive('/explore') ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Explore</span>
        </Link>
      </div>
    </nav>
  );
} 