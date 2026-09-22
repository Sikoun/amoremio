'use client';

import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { calculateDaysTogether } from '@/lib/calculations';

interface AnniversaryCardProps {
  anniversaryDate: string;
}

export const AnniversaryCard: React.FC<AnniversaryCardProps> = ({ anniversaryDate }) => {
  const days = calculateDaysTogether(anniversaryDate);

  // Compute next milestone (e.g. 100, 200, 365, 500, 730, 1000 days...)
  const milestones = [100, 200, 365, 500, 730, 1000, 1500, 2000];
  const nextMilestone = milestones.find((m) => m > days) || Math.ceil((days + 1) / 100) * 100;
  const daysRemaining = nextMilestone - days;

  return (
    <div className="glass-card-accent rounded-3xl p-4 my-3 text-rose-900 shadow-sm relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-300/30 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Together
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-3xl font-black tracking-tight text-rose-700">
              {days.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-rose-500">Days</span>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1 bg-white/70 backdrop-blur-sm border border-rose-200/80 px-2.5 py-1 rounded-full text-[11px] font-semibold text-rose-700 shadow-2xs">
            <Calendar className="w-3 h-3 text-rose-500" />
            <span>{nextMilestone} Days in {daysRemaining}d</span>
          </div>
          <p className="text-[10px] text-rose-400 mt-1">Since {anniversaryDate}</p>
        </div>
      </div>
    </div>
  );
};
