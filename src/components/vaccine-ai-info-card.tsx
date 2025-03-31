import React from 'react';
import { Calendar, Shield, AlertCircle, Info } from 'lucide-react';

interface VaccineInfoProps {
  title: string;
  type: 'schedule' | 'protection' | 'sideEffects' | 'general';
  children: React.ReactNode;
}

export function VaccineAIInfoCard({ title, type, children }: VaccineInfoProps) {
  const getIcon = () => {
    switch (type) {
      case 'schedule':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'protection':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'sideEffects':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'general':
      default:
        return <Info className="h-5 w-5 text-purple-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'schedule':
        return 'bg-blue-900/20 border-blue-900/30';
      case 'protection':
        return 'bg-green-900/20 border-green-900/30';
      case 'sideEffects':
        return 'bg-amber-900/20 border-amber-900/30';
      case 'general':
      default:
        return 'bg-purple-900/20 border-purple-900/30';
    }
  };

  return (
    <div className={`rounded-lg ${getBgColor()} border p-4 mb-4`}>
      <div className="flex items-center mb-2">
        {getIcon()}
        <h3 className="text-lg font-medium ml-2">{title}</h3>
      </div>
      <div className="text-gray-300 text-sm">
        {children}
      </div>
    </div>
  );
} 