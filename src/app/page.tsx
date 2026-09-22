'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PartnerId, CoupleData } from '@/lib/types';
import { Header } from '@/components/Header';
import { AnniversaryCard } from '@/components/AnniversaryCard';
import { DailyQuestionCard } from '@/components/DailyQuestionCard';
import { MoodAndPokeCard } from '@/components/MoodAndPokeCard';
import { WidgetPreviewModal } from '@/components/WidgetPreviewModal';
import { SettingsModal } from '@/components/SettingsModal';
import { HistoryModal } from '@/components/HistoryModal';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';

function AmoreMioContent() {
  const searchParams = useSearchParams();
  const [currentPartner, setCurrentPartner] = useState<PartnerId>('partner1');
  const [coupleState, setCoupleState] = useState<CoupleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Initialize partner from query params or localStorage
  useEffect(() => {
    const pParam = searchParams.get('partner');
    if (pParam === 'partner2' || pParam === 'her' || pParam === 'them' || pParam === 'p2') {
      setCurrentPartner('partner2');
    } else if (pParam === 'partner1' || pParam === 'me' || pParam === 'p1') {
      setCurrentPartner('partner1');
    } else {
      const saved = localStorage.getItem('amoremio_partner');
      if (saved === 'partner1' || saved === 'partner2') {
        setCurrentPartner(saved);
      }
    }
  }, [searchParams]);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setCoupleState(data);
      }
    } catch (err) {
      console.error('Failed to load couple state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleSwitchPartner = (newPartner: PartnerId) => {
    setCurrentPartner(newPartner);
    localStorage.setItem('amoremio_partner', newPartner);
  };

  if (isLoading || !coupleState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center animate-heart-pulse shadow-lg shadow-rose-500/30">
          <Heart className="w-6 h-6 fill-white" />
        </div>
        <p className="text-sm font-semibold text-rose-700">Opening Amore Mio...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-safe">
      {/* Top Header with Partner Switcher */}
      <Header
        currentPartner={currentPartner}
        onSwitchPartner={handleSwitchPartner}
        coupleState={coupleState}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenWidgetModal={() => setIsWidgetModalOpen(true)}
      />

      {/* Anniversary & Days Together Card */}
      <AnniversaryCard anniversaryDate={coupleState.anniversaryDate} />

      {/* Daily Question (Blind Reveal) */}
      <DailyQuestionCard
        currentPartner={currentPartner}
        coupleState={coupleState}
        onAnswerSubmitted={(newState) => setCoupleState(newState)}
      />

      {/* Mood Tracker & Love Pings */}
      <MoodAndPokeCard
        currentPartner={currentPartner}
        coupleState={coupleState}
        onStateUpdated={(newState) => setCoupleState(newState)}
      />

      {/* Bottom Floating Quick Widget Bar */}
      <div className="mt-auto pt-4 pb-2 text-center">
        <button
          onClick={() => setIsWidgetModalOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 bg-white/80 hover:bg-rose-50 border border-rose-200/80 px-3.5 py-1.5 rounded-full shadow-2xs transition active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Home Screen Widget Setup (Widgy / KWGT)</span>
        </button>
      </div>

      {/* Modals */}
      <WidgetPreviewModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
        currentPartner={currentPartner}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        coupleState={coupleState}
        onStateUpdated={(newState) => setCoupleState(newState)}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        coupleState={coupleState}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-rose-400 animate-spin" />
        </div>
      }
    >
      <AmoreMioContent />
    </Suspense>
  );
}
