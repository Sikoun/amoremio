'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CoupleData } from '@/lib/types';
import { ERROR_EVENT, UNPAIRED_EVENT } from '@/lib/api';
import { PairingScreen } from '@/components/PairingScreen';
import { Header } from '@/components/Header';
import { AnniversaryCard } from '@/components/AnniversaryCard';
import { DailyQuestionCard } from '@/components/DailyQuestionCard';
import { MoodAndPokeCard } from '@/components/MoodAndPokeCard';
import { SettingsModal } from '@/components/SettingsModal';
import { HistoryModal } from '@/components/HistoryModal';
import { PetStudioModal } from '@/components/PetStudioModal';
import { InstallGuideModal } from '@/components/InstallGuideModal';
import { ReactionProvider } from '@/components/graphics/FloatingReactions';
import { CoupleMascot } from '@/components/graphics/CoupleMascot';
import { Heart, RefreshCw } from 'lucide-react';

export default function Home() {
  const [coupleState, setCoupleState] = useState<CoupleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsPairing, setNeedsPairing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Modals
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPetStudioOpen, setIsPetStudioOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // default true to avoid flash

  // Bumped whenever an action (answer, mood, poke…) returns fresh state, so a background
  // refresh that started before it can't overwrite the newer data when it lands later.
  const stateVersion = useRef(0);
  const applyState = useCallback((newState: CoupleData) => {
    stateVersion.current++;
    setCoupleState(newState);
  }, []);

  const fetchState = useCallback(async () => {
    const versionAtStart = stateVersion.current;
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (res.status === 401) {
        setNeedsPairing(true);
      } else if (res.ok) {
        const data = await res.json();
        if (versionAtStart === stateVersion.current) setCoupleState(data);
        setNeedsPairing(false);
        setLoadError(false);
      } else {
        setLoadError(true);
      }
    } catch (err) {
      console.error('Failed to load couple state:', err);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Any API call can report "not paired" or an error; handle both here
  useEffect(() => {
    let toastTimer: ReturnType<typeof setTimeout> | undefined;
    const handleUnpaired = () => setNeedsPairing(true);
    const handleError = (e: Event) => {
      setToast((e as CustomEvent<string>).detail);
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => setToast(null), 4000);
    };
    window.addEventListener(UNPAIRED_EVENT, handleUnpaired);
    window.addEventListener(ERROR_EVENT, handleError);
    return () => {
      window.removeEventListener(UNPAIRED_EVENT, handleUnpaired);
      window.removeEventListener(ERROR_EVENT, handleError);
      clearTimeout(toastTimer);
    };
  }, []);

  // Keep in sync with the other phone: refresh when the app comes back to the foreground
  // (iOS resumes home-screen apps without reloading) and poll gently while it's open.
  const isReady = Boolean(coupleState) && !needsPairing;
  useEffect(() => {
    if (!isReady) return;
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') fetchState();
    };
    const interval = setInterval(refreshIfVisible, 30_000);
    document.addEventListener('visibilitychange', refreshIfVisible);
    window.addEventListener('focus', refreshIfVisible);
    window.addEventListener('pageshow', refreshIfVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshIfVisible);
      window.removeEventListener('focus', refreshIfVisible);
      window.removeEventListener('pageshow', refreshIfVisible);
    };
  }, [isReady, fetchState]);

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    fetchState();

    // Check standalone mode on mount
    if (typeof window !== 'undefined') {
      const isApp =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true;
      setIsStandalone(isApp);
    }

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
  }, [fetchState]);

  const handleInstallApp = async () => {
    if (!installPrompt) {
      setIsInstallModalOpen(true);
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsStandalone(true);
    }
  };

  if (needsPairing) {
    return (
      <>
        <PairingScreen
          isStandalone={isStandalone}
          onOpenInstallGuide={() => setIsInstallModalOpen(true)}
          onPaired={() => {
            setIsLoading(true);
            fetchState();
          }}
        />
        <InstallGuideModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          deferredPrompt={installPrompt}
          onInstalled={() => setIsStandalone(true)}
        />
      </>
    );
  }

  if (!isLoading && !coupleState && loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 space-y-3">
        <p className="text-3xl">🥺</p>
        <p className="text-sm font-semibold text-rose-700">Couldn&apos;t open Amore Mio right now.</p>
        <p className="text-xs text-rose-500">Check your connection and try again.</p>
        <button
          onClick={() => {
            setIsLoading(true);
            fetchState();
          }}
          className="mt-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-md active:scale-95 transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try again</span>
        </button>
      </div>
    );
  }

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

  const currentPartner = coupleState.me ?? 'partner1';

  return (
    <ReactionProvider>
      <div className="flex flex-col min-h-screen pb-safe">
        {/* Error toast */}
        {toast && (
          <div className="fixed top-4 inset-x-4 z-[60] max-w-md mx-auto bg-rose-950 text-white text-xs font-semibold rounded-2xl px-4 py-3 shadow-lg text-center">
            {toast}
          </div>
        )}

        <Header
          coupleState={coupleState}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenPetStudio={() => setIsPetStudioOpen(true)}
        />

        {/* Hero Mascot: Customizable Couple Pets */}
        <div className="flex justify-center my-1.5 animate-float">
          <CoupleMascot
            partner1Name={coupleState.partner1.name}
            partner2Name={coupleState.partner2.name}
            partner1Pet={coupleState.partner1.pet || 'sealion'}
            partner2Pet={coupleState.partner2.pet || 'lion'}
            partner1CustomPet={coupleState.partner1.customPet}
            partner2CustomPet={coupleState.partner2.customPet}
            onOpenStudio={() => setIsPetStudioOpen(true)}
          />
        </div>

        {/* PWA Smart Install Banner (visible on mobile web when not installed) */}
        {!isStandalone && (
          <div className="my-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl p-3 flex items-center justify-between shadow-md animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📱</span>
              <div>
                <p className="text-xs font-bold leading-tight">Install Amore Mio</p>
                <p className="text-[10px] text-rose-100">Add to Home Screen for fullscreen & love pings!</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (installPrompt) {
                  handleInstallApp();
                } else {
                  setIsInstallModalOpen(true);
                }
              }}
              className="bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs active:scale-95 transition"
            >
              {installPrompt ? 'Install' : 'How to Add'}
            </button>
          </div>
        )}

        {/* Anniversary & Days Together Card */}
        <AnniversaryCard
          anniversaryDate={coupleState.anniversaryDate}
          partner1Emoji={coupleState.partner1.avatarEmoji || '🦭'}
          partner2Emoji={coupleState.partner2.avatarEmoji || '🦁'}
        />

        {/* Daily Question (Blind Reveal) */}
        <DailyQuestionCard
          currentPartner={currentPartner}
          coupleState={coupleState}
          onAnswerSubmitted={applyState}
        />

        {/* Mood Tracker & Love Pings */}
        <MoodAndPokeCard
          currentPartner={currentPartner}
          coupleState={coupleState}
          onStateUpdated={applyState}
        />

        {/* Modals */}
        <PetStudioModal
          isOpen={isPetStudioOpen}
          onClose={() => setIsPetStudioOpen(false)}
          coupleState={coupleState}
          initialPartner={currentPartner}
          onStateUpdated={applyState}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          coupleState={coupleState}
          onStateUpdated={applyState}
          onOpenPetStudio={() => {
            setIsSettingsModalOpen(false);
            setIsPetStudioOpen(true);
          }}
          onOpenInstallGuide={() => {
            setIsSettingsModalOpen(false);
            setIsInstallModalOpen(true);
          }}
        />

        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          coupleState={coupleState}
        />

        <InstallGuideModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          deferredPrompt={installPrompt}
          onInstalled={() => setIsStandalone(true)}
        />
      </div>
    </ReactionProvider>
  );
}
