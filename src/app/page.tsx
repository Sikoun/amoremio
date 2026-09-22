'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PartnerId, CoupleData } from '@/lib/types';
import { Header } from '@/components/Header';
import { AnniversaryCard } from '@/components/AnniversaryCard';
import { DailyQuestionCard } from '@/components/DailyQuestionCard';
import { MoodAndPokeCard } from '@/components/MoodAndPokeCard';
import { SettingsModal } from '@/components/SettingsModal';
import { HistoryModal } from '@/components/HistoryModal';
import { ReactionProvider } from '@/components/graphics/FloatingReactions';
import { CoupleMascot } from '@/components/graphics/CoupleMascot';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';

function AmoreMioContent() {
  const searchParams = useSearchParams();
  const [currentPartner, setCurrentPartner] = useState<PartnerId>('partner1');
  const [coupleState, setCoupleState] = useState<CoupleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
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

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    fetchState();

    // Register service worker for Android PWA WebAPK installability
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    }

    // Capture install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

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
    <ReactionProvider>
      <div className="flex flex-col min-h-screen pb-safe">
        {/* Top Header with Partner Switcher */}
        <Header
          currentPartner={currentPartner}
          onSwitchPartner={handleSwitchPartner}
          coupleState={coupleState}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        {/* Hero Mascot: Gaspar the Lion & Mi Amor the Sea Lion */}
        <div className="flex justify-center my-1.5 animate-float">
          <CoupleMascot
            partner1Name={coupleState.partner1.name}
            partner2Name={coupleState.partner2.name}
          />
        </div>

        {/* PWA 1-Tap Install Banner (when installable) */}
        {installPrompt && (
          <div className="my-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl p-3 flex items-center justify-between shadow-md animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📱</span>
              <div>
                <p className="text-xs font-bold leading-tight">Install Amore Mio</p>
                <p className="text-[10px] text-rose-100">Standalone full screen, no browser bar!</p>
              </div>
            </div>
            <button
              onClick={handleInstallApp}
              className="bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs active:scale-95 transition"
            >
              Install
            </button>
          </div>
        )}

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

        {/* Modals */}
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
    </ReactionProvider>
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
