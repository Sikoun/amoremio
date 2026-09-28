'use client';

import React, { useState, useEffect } from 'react';
import { Heart, KeyRound, Smartphone } from 'lucide-react';
import { haptic } from '@/lib/haptics';

interface PairingScreenProps {
  isStandalone: boolean;
  onOpenInstallGuide: () => void;
  onPaired: () => void;
}

export const PairingScreen: React.FC<PairingScreenProps> = ({
  isStandalone,
  onOpenInstallGuide,
  onPaired,
}) => {
  // On phones, the home-screen app keeps its own cookies separate from the browser,
  // so pairing in Safari/Chrome wouldn't carry over. Nudge to install first.
  const [isPhone, setIsPhone] = useState(false);
  const [continueInBrowser, setContinueInBrowser] = useState(false);
  useEffect(() => {
    setIsPhone(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);
  const showInstallFirst = isPhone && !isStandalone && !continueInBrowser;

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isSubmitting) return;

    haptic.lightTap();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        haptic.celebration();
        onPaired();
        return;
      }
      const data = await res.json().catch(() => null);
      setError(data?.error || "That code doesn't match");
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-400 to-rose-600 text-white flex items-center justify-center animate-heart-pulse shadow-lg shadow-rose-500/30">
        <Heart className="w-8 h-8 fill-white" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-700 via-pink-600 to-rose-500 bg-clip-text text-transparent">
          Amore Mio
        </h1>
        <p className="text-sm text-rose-500 font-medium">Enter your pairing code to open our space 💕</p>
      </div>

      {showInstallFirst ? (
        <div className="w-full max-w-xs space-y-3">
          <div className="bg-white/80 border border-rose-200 rounded-2xl p-4 text-left space-y-1.5 shadow-xs">
            <p className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              Add me to your Home Screen first
            </p>
            <p className="text-xs text-rose-700 leading-relaxed">
              Then open Amore Mio from the new icon and enter your code there. Codes entered here in the
              browser don&apos;t carry over to the app.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenInstallGuide}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-500/25 active:scale-95 transition"
          >
            Show me how 📱
          </button>
          <button
            type="button"
            onClick={() => setContinueInBrowser(true)}
            className="w-full py-1 text-[11px] font-semibold text-rose-400 hover:text-rose-600 transition"
          >
            Continue in the browser instead
          </button>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <div className="relative">
          <KeyRound className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="XXXX-XXXX-XXXX"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-2xl bg-white border border-rose-200 py-3 pl-9 pr-3 text-base tracking-widest font-mono text-rose-950 text-center focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
          />
        </div>
        {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting || !code.trim()}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-500/25 active:scale-95 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Checking…' : 'Open 💌'}
        </button>
      </form>
      )}
    </div>
  );
};
