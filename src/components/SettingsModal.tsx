'use client';

import React, { useState } from 'react';
import { CoupleData } from '@/lib/types';
import { X, Save, Heart, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupleState: CoupleData;
  onStateUpdated: (newState: CoupleData) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  coupleState,
  onStateUpdated,
}) => {
  const [partner1Name, setPartner1Name] = useState(coupleState.partner1.name);
  const [partner2Name, setPartner2Name] = useState(coupleState.partner2.name);
  const [anniversaryDate, setAnniversaryDate] = useState(coupleState.anniversaryDate);
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner1Name,
          partner2Name,
          anniversaryDate,
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-rose-100">
        {/* Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-950">Couple Settings</h3>
              <p className="text-[11px] text-rose-500 font-medium">Names & Anniversary Milestone</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-rose-900 mb-1">
              Your Name (Partner 1)
            </label>
            <input
              type="text"
              value={partner1Name}
              onChange={(e) => setPartner1Name(e.target.value)}
              className="w-full rounded-xl bg-white border border-rose-200 p-2.5 text-xs text-rose-950 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              placeholder="e.g. Gaspar"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-900 mb-1">
              Partner&apos;s Name (Partner 2)
            </label>
            <input
              type="text"
              value={partner2Name}
              onChange={(e) => setPartner2Name(e.target.value)}
              className="w-full rounded-xl bg-white border border-rose-200 p-2.5 text-xs text-rose-950 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              placeholder="e.g. Valentina"
              required
            />
          </div>

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
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-2 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Saved successfully!</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-500/25 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
