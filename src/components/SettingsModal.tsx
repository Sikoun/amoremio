'use client';

import React, { useState } from 'react';
import { CoupleData, PetType, PET_EMOJIS } from '@/lib/types';
import { X, Save, Heart, Sparkles } from 'lucide-react';
import { haptic } from '@/lib/haptics';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupleState: CoupleData;
  onStateUpdated: (newState: CoupleData) => void;
}

const PET_OPTIONS: { id: PetType; label: string; emoji: string }[] = [
  { id: 'sealion', label: 'Sea Lion', emoji: '🦭' },
  { id: 'lion', label: 'Lion', emoji: '🦁' },
  { id: 'bear', label: 'Bear', emoji: '🐻' },
  { id: 'bunny', label: 'Bunny', emoji: '🐰' },
  { id: 'cat', label: 'Kitten', emoji: '🐱' },
  { id: 'fox', label: 'Fox', emoji: '🦊' },
  { id: 'panda', label: 'Panda', emoji: '🐼' },
  { id: 'penguin', label: 'Penguin', emoji: '🐧' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  coupleState,
  onStateUpdated,
}) => {
  const [partner1Name, setPartner1Name] = useState(coupleState.partner1.name);
  const [partner2Name, setPartner2Name] = useState(coupleState.partner2.name);
  const [partner1Pet, setPartner1Pet] = useState<PetType>(coupleState.partner1.pet || 'sealion');
  const [partner2Pet, setPartner2Pet] = useState<PetType>(coupleState.partner2.pet || 'lion');
  const [anniversaryDate, setAnniversaryDate] = useState(coupleState.anniversaryDate);
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    haptic.lightTap();
    setIsSaving(true);
    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner1Name,
          partner2Name,
          anniversaryDate,
          partner1Pet,
          partner2Pet,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        onStateUpdated(updated);
        setSuccessNotice(true);
        setTimeout(() => {
          setSuccessNotice(false);
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-rose-100">
        {/* Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-950">Couple Settings</h3>
              <p className="text-[11px] text-rose-500 font-medium">Names, Pets & Anniversary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-rose-200 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Partner 1 Info */}
          <div className="space-y-2 bg-rose-50/40 p-3 rounded-2xl border border-rose-100">
            <label className="block text-xs font-bold text-rose-900">
              Your Profile (Partner 1)
            </label>
            <input
              type="text"
              value={partner1Name}
              onChange={(e) => setPartner1Name(e.target.value)}
              className="w-full rounded-xl bg-white border border-rose-200 p-2 text-xs text-rose-950 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              placeholder="Your name"
              required
            />

            <div>
              <span className="text-[11px] font-semibold text-rose-700 block mb-1">
                Your Pet Mascot:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {PET_OPTIONS.map((opt) => {
                  const isSelected = partner1Pet === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        haptic.lightTap();
                        setPartner1Pet(opt.id);
                      }}
                      className={`py-1.5 px-1 rounded-xl border text-center transition flex flex-col items-center gap-0.5 ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500 text-white font-bold shadow-xs'
                          : 'border-rose-100 bg-white hover:bg-rose-50 text-rose-800'
                      }`}
                    >
                      <span className="text-base">{opt.emoji}</span>
                      <span className="text-[9px] truncate w-full">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Partner 2 Info */}
          <div className="space-y-2 bg-pink-50/40 p-3 rounded-2xl border border-pink-100">
            <label className="block text-xs font-bold text-rose-900">
              Partner&apos;s Profile (Partner 2)
            </label>
            <input
              type="text"
              value={partner2Name}
              onChange={(e) => setPartner2Name(e.target.value)}
              className="w-full rounded-xl bg-white border border-rose-200 p-2 text-xs text-rose-950 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              placeholder="Partner's name"
              required
            />

            <div>
              <span className="text-[11px] font-semibold text-rose-700 block mb-1">
                Partner&apos;s Pet Mascot:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {PET_OPTIONS.map((opt) => {
                  const isSelected = partner2Pet === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        haptic.lightTap();
                        setPartner2Pet(opt.id);
                      }}
                      className={`py-1.5 px-1 rounded-xl border text-center transition flex flex-col items-center gap-0.5 ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500 text-white font-bold shadow-xs'
                          : 'border-rose-100 bg-white hover:bg-rose-50 text-rose-800'
                      }`}
                    >
                      <span className="text-base">{opt.emoji}</span>
                      <span className="text-[9px] truncate w-full">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Anniversary Date */}
          <div>
            <label className="block text-xs font-bold text-rose-900 mb-1">
              Anniversary Date
            </label>
            <input
              type="date"
              value={anniversaryDate}
              onChange={(e) => setAnniversaryDate(e.target.value)}
              className="w-full rounded-xl bg-white border border-rose-200 p-2.5 text-xs text-rose-950 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              required
            />
            <p className="text-[10px] text-rose-400 mt-1">
              Used to calculate &ldquo;Days Together&rdquo; for your couple milestones.
            </p>
          </div>

          {successNotice && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-2.5 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Settings saved! Your mascots are updated 💕</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-xs shadow-md shadow-rose-500/25 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Settings & Pets'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
