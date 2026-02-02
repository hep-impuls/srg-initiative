import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface InfoBoxProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: 'blue' | 'amber' | 'emerald';
}

export function InfoBox({ title, children, icon, color = 'blue' }: InfoBoxProps) {
  const styles = {
    blue: 'bg-blue-50 border-blue-500 text-blue-900',
    amber: 'bg-amber-50 border-amber-500 text-amber-900',
    emerald: 'bg-emerald-50 border-emerald-500 text-emerald-900'
  };

  return (
    <div className={`${styles[color]} border-l-4 p-5 rounded-r-lg my-6`}>
      <h4 className="flex items-center font-bold mb-3 text-sm uppercase tracking-wide">
        {icon || <BrainCircuit className="w-4 h-4 mr-2" />}
        {title}
      </h4>
      <div className="text-gray-700 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
