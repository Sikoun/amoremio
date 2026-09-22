'use client';

import React from 'react';
import { Sparkles, Calendar, Heart } from 'lucide-react';
import { calculateDaysTogether } from '@/lib/calculations';
import { MilestoneJourney } from './graphics/MilestoneJourney';
import { haptic } from '@/lib/haptics';

interface AnniversaryCardProps {
  anniversaryDate: string;
}

export const AnniversaryCard: React.FC<AnniversaryCardProps> = ({ anniversaryDate }) => {
  const days = calculateDaysTogether(anniversaryDate);

  // Milestone thresholds
  const milestones = [100, 200, 365, 500, 730, 1000, 1500, 2000, 2500, 3000];
  const nextMilestone = milestones.find((m) => m > days) || Math.ceil((days + 1) / 500) * 500;
  const daysRemaining = Math.max(nextMilestone - days, 0);

  // Milestone title
  const getMilestoneTitle = (m: number) => {
    if (m === 365) return '1 Year';
    if (m === 730) return '2 Years';
    if (m === 1000) return '1,000 Days';
    if (m === 1500) return '1,500 Days';
    if (m === 2000) return '2,000 Days';
    return `${m} Days`;
  };

  return (
    <div
      onClick={() => haptic.lightTap()}
      className="glass-card-accent rounded-3xl p-5 my-3 text-rose-950 shadow-md relative overflow-hidden border border-rose-200/80 transition-all hover:shadow-lg"
    >
      {/* Decorative background glow */}
      <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-rose-300/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -top-8 w-24 h-24 bg-pink-200/40 rounded-full blur-xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Loving Each Other</span>
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">
              {days.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-rose-500">Days</span>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-rose-200/90 px-3 py-1.5 rounded-full text-[11px] font-bold text-rose-700 shadow-2xs">
            <Calendar className="w-3 h-3 text-rose-500" />
            <span>Next: {getMilestoneTitle(nextMilestone)}</span>
          </div>
          <p className="text-[10px] font-semibold text-rose-400 mt-1">
            {daysRemaining === 0 ? '🎉 Milestone reached today!' : `${daysRemaining} days to go`}
          </p>
        </div>
      </div>

      {/* SVG Milestone Journey Path */}
      <div className="mt-3 pt-2 border-t border-rose-200/60 relative z-10">
        <MilestoneJourney days={days} nextMilestone={nextMilestone} />
      </div>

      {/* Footer Milestone Note */}
      <div className="mt-1 flex items-center justify-between text-[10px] text-rose-500/80 font-medium">
        <span>Since {anniversaryDate}</span>
        <span className="flex items-center gap-1">
          <span>Our love story continues</span>
          <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
        </span>
      </div>
    </div>
  );
};
