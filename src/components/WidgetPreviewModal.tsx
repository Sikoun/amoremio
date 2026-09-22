'use client';

import React, { useState, useEffect } from 'react';
import { PartnerId, WidgetPreferences, WidgetTheme } from '@/lib/types';
import {
  X,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  RefreshCw,
  Palette,
  Layers,
  Settings2,
  Apple,
} from 'lucide-react';

interface WidgetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPartner: PartnerId;
}

interface ThemeOption {
  id: WidgetTheme;
  name: string;
  dotColor: string;
  bgPreview: string;
  borderColor: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'rose',
    name: 'Soft Rose',
    dotColor: '#f43f5e',
    bgPreview: 'from-rose-100 to-rose-200',
    borderColor: 'border-rose-300',
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    dotColor: '#a855f7',
    bgPreview: 'from-purple-100 to-purple-200',
    borderColor: 'border-purple-300',
  },
  {
    id: 'matcha',
    name: 'Matcha Cream',
    dotColor: '#84cc16',
    bgPreview: 'from-lime-100 to-lime-200',
    borderColor: 'border-lime-300',
  },
  {
    id: 'peach',
    name: 'Sunset Peach',
    dotColor: '#f97316',
    bgPreview: 'from-orange-100 to-amber-200',
    borderColor: 'border-orange-300',
  },
  {
    id: 'midnight',
    name: 'Midnight Velvet',
    dotColor: '#fb7185',
    bgPreview: 'from-zinc-900 to-zinc-950',
    borderColor: 'border-zinc-700',
  },
  {
    id: 'minimal',
    name: 'Minimalist Milk',
    dotColor: '#18181b',
    bgPreview: 'from-zinc-50 to-zinc-200',
    borderColor: 'border-zinc-300',
  },
];

export const WidgetPreviewModal: React.FC<WidgetPreviewModalProps> = ({
  isOpen,
  onClose,
  currentPartner,
}) => {
  const [copiedImageUrl, setCopiedImageUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'studio' | 'kwgt_guide' | 'widgy_guide'>('studio');
  const [targetPartner, setTargetPartner] = useState<PartnerId>(currentPartner);
  const [isSaving, setIsSaving] = useState(false);
  const [imgTimestamp, setImgTimestamp] = useState(Date.now());

  // Widget customizer preferences
  const [prefs, setPrefs] = useState<WidgetPreferences>({
    theme: 'rose',
    showDays: true,
    showCategory: true,
    showPartnerStatus: true,
    roundedCorners: false, // Default to full-bleed for cleaner fit in KWGT/Widgy boxes
  });

  // Fetch saved preferences on open or partner switch
  useEffect(() => {
    if (!isOpen) return;

    const loadPrefs = async () => {
      try {
        const res = await fetch(`/api/widget/config?partner=${targetPartner}`);
        if (res.ok) {
          const data = await res.json();
          if (data.preferences) {
            setPrefs(data.preferences);
          }
        }
      } catch (err) {
        console.error('Failed to load widget preferences:', err);
      }
    };

    loadPrefs();
  }, [isOpen, targetPartner]);

  // Persist preference updates
  const updatePreference = async (newPrefs: Partial<WidgetPreferences>) => {
    const updated = { ...prefs, ...newPrefs };
    setPrefs(updated);
    setImgTimestamp(Date.now());
    setIsSaving(true);

    try {
      await fetch(`/api/widget/config?partner=${targetPartner}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner: targetPartner, preferences: updated }),
      });
    } catch (err) {
      console.error('Failed to save widget preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://amoremio-peach.vercel.app';

  // Direct clean URL without bloated query params — the server automatically looks up saved preferences!
  const cleanWidgetImageUrl = `${currentOrigin}/api/widget/image?partner=${targetPartner}`;

  // Live preview URL passing active states for instant real-time feedback
  const previewImageUrl = `${currentOrigin}/api/widget/image?partner=${targetPartner}&theme=${prefs.theme}&showDays=${prefs.showDays}&showCategory=${prefs.showCategory}&showPartnerStatus=${prefs.showPartnerStatus}&rounded=${prefs.roundedCorners}&t=${imgTimestamp}`;

  const handleCopyImageUrl = () => {
    navigator.clipboard.writeText(cleanWidgetImageUrl);
    setCopiedImageUrl(true);
    setTimeout(() => setCopiedImageUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg max-h-[94vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-rose-100">
        {/* Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-950">Amore Mio Widget Studio</h3>
              <p className="text-[11px] text-rose-600 font-medium">
                Customize live for Android & iPhone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-rose-200 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-rose-100 px-4 pt-2 gap-3 text-xs font-semibold bg-rose-50/30">
          <button
            onClick={() => setActiveTab('studio')}
            className={`pb-2 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Customize Widget</span>
          </button>
          <button
            onClick={() => setActiveTab('kwgt_guide')}
            className={`pb-2 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'kwgt_guide'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android (KWGT)</span>
          </button>
          <button
            onClick={() => setActiveTab('widgy_guide')}
            className={`pb-2 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'widgy_guide'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iPhone (Widgy)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Target Partner Switcher */}
          <div className="flex items-center justify-between bg-rose-50/80 px-3 py-2 rounded-xl border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-900">
              Customizing for:{' '}
              <span className="font-bold text-rose-600">
                {targetPartner === 'partner1' ? 'Gaspar (Partner 1)' : 'Mi Amor (Partner 2)'}
              </span>
            </span>
            <button
              onClick={() =>
                setTargetPartner(targetPartner === 'partner1' ? 'partner2' : 'partner1')
              }
              className="text-[11px] text-rose-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-100 transition shadow-2xs"
            >
              Switch to {targetPartner === 'partner1' ? 'Mi Amor' : 'Gaspar'}
            </button>
          </div>

          {/* TAB 1: WIDGET STUDIO */}
          {activeTab === 'studio' && (
            <div className="space-y-4">
              {/* Live Preview Card */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                    <span>Live High-DPI Output</span>
                    {isSaving && (
                      <span className="text-[10px] text-rose-500 font-normal animate-pulse">
                        (Saving...)
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => setImgTimestamp(Date.now())}
                    className="flex items-center gap-1 text-[10px] font-semibold text-rose-500 hover:text-rose-700"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-200 bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImageUrl}
                    alt="Amore Mio High-DPI Widget Preview"
                    className="w-full h-auto object-cover transition-opacity duration-300"
                  />
                </div>
              </div>

              {/* 1. Theme Picker */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider block">
                  Color Theme:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {THEME_OPTIONS.map((t) => {
                    const isSelected = prefs.theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => updatePreference({ theme: t.id })}
                        className={`p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                          isSelected
                            ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-300'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0 shadow-xs border border-white"
                          style={{ backgroundColor: t.dotColor }}
                        />
                        <span className="text-[11px] font-bold text-zinc-800 truncate">
                          {t.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Content Toggles */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider block">
                  Displayed Information:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Days Together */}
                  <button
                    onClick={() => updatePreference({ showDays: !prefs.showDays })}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      prefs.showDays
                        ? 'border-rose-400 bg-rose-50/60 text-rose-900 font-semibold'
                        : 'border-zinc-200 bg-white text-zinc-500'
                    }`}
                  >
                    <span>💕 Days Together</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        prefs.showDays ? 'bg-rose-500 text-white' : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {prefs.showDays ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Question Category */}
                  <button
                    onClick={() => updatePreference({ showCategory: !prefs.showCategory })}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      prefs.showCategory
                        ? 'border-rose-400 bg-rose-50/60 text-rose-900 font-semibold'
                        : 'border-zinc-200 bg-white text-zinc-500'
                    }`}
                  >
                    <span>✨ Category Badge</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        prefs.showCategory ? 'bg-rose-500 text-white' : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {prefs.showCategory ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Partner Mood & Status */}
                  <button
                    onClick={() =>
                      updatePreference({ showPartnerStatus: !prefs.showPartnerStatus })
                    }
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      prefs.showPartnerStatus
                        ? 'border-rose-400 bg-rose-50/60 text-rose-900 font-semibold'
                        : 'border-zinc-200 bg-white text-zinc-500'
                    }`}
                  >
                    <span>🥰 Partner Mood</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        prefs.showPartnerStatus
                          ? 'bg-rose-500 text-white'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {prefs.showPartnerStatus ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Corner Style (Full Bleed vs Rounded Card) */}
                  <button
                    onClick={() => updatePreference({ roundedCorners: !prefs.roundedCorners })}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      prefs.roundedCorners
                        ? 'border-rose-400 bg-rose-50/60 text-rose-900 font-semibold'
                        : 'border-zinc-200 bg-white text-zinc-500'
                    }`}
                  >
                    <span>🔲 Card Corners</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        prefs.roundedCorners
                          ? 'bg-rose-500 text-white'
                          : 'bg-zinc-700 text-zinc-100'
                      }`}
                    >
                      {prefs.roundedCorners ? 'Rounded' : 'Edge-to-Edge'}
                    </span>
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 italic">
                  💡 Tip: Set &ldquo;Edge-to-Edge&rdquo; if your phone’s launcher already rounds widget corners, so you avoid an awkward double-border.
                </p>
              </div>

              {/* 3. The Single Permanent URL */}
              <div className="bg-zinc-900 rounded-2xl p-3.5 text-white space-y-2 border border-zinc-800 shadow-md">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    Permanent Widget URL
                  </span>
                  <span className="text-[10px] text-zinc-400">Auto-syncs your colors</span>
                </div>

                <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800 font-mono text-[10px] text-rose-200 break-all select-all leading-relaxed">
                  {cleanWidgetImageUrl}
                </div>

                <button
                  onClick={handleCopyImageUrl}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 active:scale-98 shadow-sm"
                >
                  {copiedImageUrl ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied URL to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Widget URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: KWGT GUIDE (ANDROID) */}
          {activeTab === 'kwgt_guide' && (
            <div className="space-y-3 text-zinc-800 leading-relaxed">
              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-rose-950">
                <h4 className="font-bold text-xs text-rose-900 mb-1">
                  Android Setup with KWGT (One-Time Setup):
                </h4>
                <p className="text-[11px] text-rose-800">
                  Once set up, whenever you change colors or options in the studio tab above, your widget updates automatically without ever touching KWGT again!
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-2.5 text-xs bg-white p-3.5 rounded-2xl border border-zinc-200">
                <li>
                  In KWGT, add an <strong>Image</strong> module (tap <code>+</code> &rarr; Image).
                </li>
                <li>
                  Under the Image module, check <strong>Bitmap</strong>, tap the calculator icon at the top, and paste your URL:
                  <code className="bg-zinc-100 p-1.5 rounded text-[10px] font-mono block mt-1 break-all text-rose-700">
                    {cleanWidgetImageUrl}
                  </code>
                </li>
                <li>
                  Adjust the Image <strong>Width</strong> (usually <code>600 - 700</code>) so the card comfortably fills your widget.
                </li>
                <li>
                  Go back to <strong>Root</strong> (tap <code>Root</code> in the top navigation).
                </li>
                <li>
                  Tap the <strong className="text-rose-600">CONTACTO</strong> tab (this is Spanish for Touch).
                </li>
                <li>
                  Tap the default action &rarr; set <strong>Action</strong> to <strong>Launch App</strong> &rarr; select <strong>Amore Mio</strong>.
                </li>
                <li>
                  Tap the <strong>Floppy Disk / Save</strong> icon in the top right.
                </li>
              </ol>
            </div>
          )}

          {/* TAB 3: WIDGY GUIDE (IPHONE) */}
          {activeTab === 'widgy_guide' && (
            <div className="space-y-3 text-zinc-800 leading-relaxed">
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 text-purple-950">
                <h4 className="font-bold text-xs text-purple-900 mb-1">
                  iPhone Setup with Widgy (For your partner):
                </h4>
                <p className="text-[11px] text-purple-800">
                  Zero layer designing needed. Widgy fetches the high-res card and renders it retina-sharp.
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-2.5 text-xs bg-white p-3.5 rounded-2xl border border-zinc-200">
                <li>Install <strong>Widgy Widgets</strong> from the App Store.</li>
                <li>Create a <strong>Medium</strong> widget and add an <strong>Image</strong> layer.</li>
                <li>
                  In the Image layer data, select <strong>Web (Image URL)</strong> and paste:
                  <code className="bg-zinc-100 p-1.5 rounded text-[10px] font-mono block mt-1 break-all text-purple-700">
                    {currentOrigin}/api/widget/image?partner=partner2
                  </code>
                </li>
                <li>
                  In <strong>Tap Action</strong>, select <strong>Open URL</strong> and enter:
                  <code className="bg-zinc-100 px-1 py-0.5 rounded text-[10px] font-mono block mt-1 text-purple-700">
                    {currentOrigin}/?partner=partner2
                  </code>
                </li>
                <li>Assign the widget to a Home Screen slot. Done!</li>
              </ol>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-rose-50/70 border-t border-rose-100 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            Amore Mio High-DPI Widget
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl transition active:scale-95 shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
