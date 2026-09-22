'use client';

import React from 'react';
import { PartnerId, CoupleData } from '@/lib/types';
import { Heart, Sparkles, BookOpen, Settings, Smartphone } from 'lucide-react';

interface HeaderProps {
  currentPartner: PartnerId;
  onSwitchPartner: (newPartner: PartnerId) => void;
  coupleState: CoupleData;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenWidgetModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPartner,
  onSwitchPartner,
  coupleState,
  onOpenHistory,
  onOpenSettings,
  onOpenWidgetModal,
}) => {
  const me = coupleState[currentPartner];
  const partnerId: PartnerId = currentPartner === 'partner1' ? 'partner2' : 'partner1';
  const partner = coupleState[partnerId];

  return (
    <header className="pt-safe pb-2">
      {/* Dev / Solo Testing Banner */}
      <div className="mb-3 bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200/80 rounded-2xl p-2.5 px-3.5 flex items-center justify-between text-xs text-rose-900 shadow-sm">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active user:</span>
          <span className="font-bold text-rose-700 bg-white/80 px-2 py-0.5 rounded-lg border border-rose-200">
            {me.avatarEmoji} {me.name}
          </span>
        </div>
        <button
          onClick={() => onSwitchPartner(partnerId)}
          className="text-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold px-2.5 py-1 rounded-xl transition-all active:scale-95 shadow-xs flex items-center gap-1"
          title="Switch perspective to test the other partner"
        >
          <span>Switch to {partner.name}</span>
          <span>⇄</span>
        </button>
      </div>

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
          <button
            onClick={onOpenWidgetModal}
            aria-label="Widget Setup"
            title="Widget Setup (Widgy / KWGT)"
            className="w-9 h-9 rounded-xl bg-white border border-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-50 transition active:scale-95 shadow-xs"
          >
            <Smartphone className="w-4 h-4" />
          </button>
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
