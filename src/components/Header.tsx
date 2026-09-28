'use client';

import React from 'react';
import { CoupleData } from '@/lib/types';
import { Heart, Sparkles, BookOpen, Settings } from 'lucide-react';

interface HeaderProps {
  coupleState: CoupleData;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenPetStudio?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  coupleState,
  onOpenHistory,
  onOpenSettings,
  onOpenPetStudio,
}) => {
  return (
    <header className="pt-safe pb-2">
      {/* Main Title Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 animate-heart-pulse">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-700 via-pink-600 to-rose-500 bg-clip-text text-transparent">
              Amore Mio
            </h1>
            <p className="text-[11px] font-medium text-rose-400">
              {coupleState.partner1.name} & {coupleState.partner2.name}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {onOpenPetStudio && (
            <button
              onClick={onOpenPetStudio}
              aria-label="Pet Studio"
              title="Style Spirit Pets"
              className="w-9 h-9 rounded-xl bg-white border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-50 transition active:scale-95 shadow-xs"
            >
              <Sparkles className="w-4 h-4 fill-rose-100" />
            </button>
          )}
          <button
            onClick={onOpenHistory}
            aria-label="Memories History"
            title="View Past Answers"
            className="w-9 h-9 rounded-xl bg-white border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-50 transition active:scale-95 shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            title="Couple Settings"
            className="w-9 h-9 rounded-xl bg-white border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-50 transition active:scale-95 shadow-xs"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
