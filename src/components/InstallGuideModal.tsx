'use client';

import React, { useState, useEffect } from 'react';
import { X, Smartphone, Share, PlusSquare, MoreVertical, ExternalLink, CheckCircle2 } from 'lucide-react';
import { haptic } from '@/lib/haptics';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onInstalled?: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled,
}) => {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOSPlatform, setIsIOSPlatform] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /Android/i.test(ua);
    const inApp = /FBAN|FBAV|Instagram|WhatsApp|Telegram|Line|Twitter|Snapchat/i.test(ua);
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    setIsIOSPlatform(isIOS);
    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'other');
    setIsInAppBrowser(inApp);
    setIsStandalone(standalone);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    haptic.lightTap();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      onInstalled?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-rose-100">
        {/* Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-950">Install Amore Mio</h3>
              <p className="text-[11px] text-rose-500 font-medium">Add to your phone's Home Screen</p>
            </div>
          </div>
          <button
            onClick={() => {
              haptic.lightTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white border border-rose-200 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Already installed notice */}
          {isStandalone && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-xs">Already Installed!</p>
                <p className="text-[11px] text-emerald-700">You are currently using the standalone app.</p>
              </div>
            </div>
          )}

          {/* Warning for WhatsApp / Instagram In-App Browser */}
          {isInAppBrowser && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900">
              <span className="text-xl">⚠️</span>
              <div className="space-y-1">
                <p className="font-bold text-xs">Opened in WhatsApp or Instagram?</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  In-app browsers block installing apps! Tap the three dots <span className="font-bold">⋮</span> or <span className="font-bold">⋯</span> in the top-right corner and select <span className="font-bold underline">{isIOSPlatform ? 'Open in Safari' : 'Open in Chrome'}</span>.
                </p>
              </div>
            </div>
          )}

          {/* Android Section */}
          {platform === 'android' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span>🤖</span>
                <span>Android Instructions</span>
              </div>

              {deferredPrompt ? (
                <button
                  onClick={handleNativeInstall}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-md active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Tap Here to Install App</span>
                </button>
              ) : null}

              <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-3.5 space-y-2.5">
                <p className="font-semibold text-rose-900 text-[11px]">Manual install in Chrome / Brave:</p>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                  <p className="text-slate-700">Make sure you are in <span className="font-semibold">Google Chrome</span>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                  <div className="text-slate-700 flex-1">
                    Tap the three dots <MoreVertical className="w-3.5 h-3.5 inline mx-0.5" /> in the top-right corner.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                  <p className="text-slate-700">Tap <span className="font-semibold text-rose-600">"Install app"</span> (or "Add to Home screen").</p>
                </div>
              </div>
            </div>
          )}

          {/* iPhone / iOS Section */}
          {platform === 'ios' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span>🍎</span>
                <span>iPhone / iPad (Safari)</span>
              </div>

              <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-3.5 space-y-3">
                <p className="text-[11px] text-slate-600 leading-tight">
                  Apple requires installing through Safari. It only takes 5 seconds:
                </p>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                  <div className="text-slate-700 flex-1">
                    Open this link in <span className="font-semibold">Safari</span> (not Chrome or WhatsApp).
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                  <div className="text-slate-700 flex-1">
                    Tap the <span className="font-semibold text-rose-600">Share button</span> <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> at the bottom toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                  <div className="text-slate-700 flex-1">
                    Scroll down and tap <span className="font-semibold text-rose-600">"Add to Home Screen"</span> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5" />.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
                  <div className="text-slate-700 flex-1">
                    Tap <span className="font-semibold text-rose-600">"Add"</span> in the top-right corner. Done!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop or generic instructions */}
          {platform === 'other' && (
            <div className="space-y-3">
              <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-3.5 space-y-2">
                <p className="font-bold text-slate-800">For iPhone:</p>
                <p className="text-slate-600">Open in Safari → Tap Share <Share className="w-3 h-3 inline text-blue-500" /> → "Add to Home Screen".</p>
                <div className="pt-2 border-t border-rose-100" />
                <p className="font-bold text-slate-800">For Android:</p>
                <p className="text-slate-600">Open in Chrome → Tap three dots <MoreVertical className="w-3 h-3 inline" /> → "Install app".</p>
              </div>
            </div>
          )}

          {/* Why install benefit */}
          <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-100 flex items-center gap-2 text-[11px] text-pink-700">
            <span>✨</span>
            <span>Once installed, it opens full-screen like a native app without any browser URL bars!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
