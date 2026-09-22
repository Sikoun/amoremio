'use client';

import React, { useState, useEffect } from 'react';
import { PartnerId, WidgyResponse, W12Row } from '@/lib/types';
import { X, Copy, Check, Smartphone, ExternalLink, Sparkles, RefreshCw, KeyRound, Palette, ImageIcon } from 'lucide-react';

interface WidgetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPartner: PartnerId;
}

export const WidgetPreviewModal: React.FC<WidgetPreviewModalProps> = ({
  isOpen,
  onClose,
  currentPartner,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedImageUrl, setCopiedImageUrl] = useState(false);
  const [imageTheme, setImageTheme] = useState<'rose' | 'dark'>('rose');
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'terminal'>('dark');
  const [activeTab, setActiveTab] = useState<'image_widget' | 'kwgt_guide' | 'widgy_guide' | 'api_widget' | 'raw_json'>('image_widget');
  const [widgetData, setWidgetData] = useState<WidgyResponse | null>(null);
  const [w12Data, setW12Data] = useState<W12Row[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetPartner, setTargetPartner] = useState<PartnerId>(
    currentPartner === 'partner1' ? 'partner2' : 'partner1'
  );

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resWidgy, resW12] = await Promise.all([
        fetch(`/api/widget?partner=${targetPartner}`),
        fetch(`/api/widget/w12?partner=${targetPartner}`)
      ]);
      if (resWidgy.ok) {
        const data = await resWidgy.json();
        setWidgetData(data);
      }
      if (resW12.ok) {
        const data = await resW12.json();
        setW12Data(data);
      }
    } catch (err) {
      console.error('Failed to load widget data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, targetPartner]);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://your-app.vercel.app';
  const apiUrl = `${currentOrigin}/api/widget?partner=${targetPartner}`;
  const w12ApiUrl = `${currentOrigin}/api/widget/w12?partner=${targetPartner}`;
  const apiWidgetKey = `v1::w12::${selectedTheme}::json::${w12ApiUrl}`;
  const widgetImageUrl = `${currentOrigin}/api/widget/image?partner=${targetPartner}&theme=${imageTheme}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(apiUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiWidgetKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleCopyImageUrl = () => {
    navigator.clipboard.writeText(widgetImageUrl);
    setCopiedImageUrl(true);
    setTimeout(() => setCopiedImageUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-rose-100">
        {/* Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-950">Home Screen Widget</h3>
              <p className="text-[11px] text-rose-600 font-medium">Uniform setup for Android & iPhone</p>
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
        <div className="flex border-b border-rose-100 px-3 pt-2 gap-2 text-xs font-semibold bg-rose-50/30 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('image_widget')}
            className={`pb-2 border-b-2 whitespace-nowrap transition flex items-center gap-1 ${
              activeTab === 'image_widget'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Live Card (Zero Edit)</span>
          </button>
          <button
            onClick={() => setActiveTab('kwgt_guide')}
            className={`pb-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'kwgt_guide'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            KWGT (Android)
          </button>
          <button
            onClick={() => setActiveTab('widgy_guide')}
            className={`pb-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'widgy_guide'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            Widgy (iOS)
          </button>
          <button
            onClick={() => setActiveTab('api_widget')}
            className={`pb-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'api_widget'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            API Widget
          </button>
          <button
            onClick={() => setActiveTab('raw_json')}
            className={`pb-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'raw_json'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            JSON
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Target Partner Switcher */}
          <div className="flex items-center justify-between bg-rose-50/80 px-3 py-2 rounded-xl border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-900">
              Widget feed for: <span className="font-bold text-rose-600">{targetPartner === 'partner1' ? 'Gaspar (Partner 1)' : 'Mi Amor (Partner 2)'}</span>
            </span>
            <button
              onClick={() => setTargetPartner(targetPartner === 'partner1' ? 'partner2' : 'partner1')}
              className="text-[11px] text-rose-600 font-bold bg-white px-2 py-0.5 rounded-lg border border-rose-200 hover:bg-rose-100 transition"
            >
              Switch to {targetPartner === 'partner1' ? 'Partner 2' : 'Partner 1'}
            </button>
          </div>

          {/* TAB 1: SERVER-RENDERED DYNAMIC IMAGE WIDGET (UNIFORM & EFFORTLESS) */}
          {activeTab === 'image_widget' && (
            <div className="space-y-3.5">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-rose-950 flex items-start gap-2">
                <span className="text-base leading-none">🎨</span>
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-rose-900">Server-Rendered Design: </span>
                  The card design is generated directly on your server with genuine web fonts, colors, and emojis. Neither of you ever has to design layers or edit formulas on your phones!
                </div>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3 h-3 text-rose-500" />
                  Theme:
                </span>
                <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg">
                  <button
                    onClick={() => setImageTheme('rose')}
                    className={`px-3 py-0.5 rounded-md text-[10px] font-semibold transition ${
                      imageTheme === 'rose'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    🌸 Soft Rose
                  </button>
                  <button
                    onClick={() => setImageTheme('dark')}
                    className={`px-3 py-0.5 rounded-md text-[10px] font-semibold transition ${
                      imageTheme === 'dark'
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    🌙 Dark Mode
                  </button>
                </div>
              </div>

              {/* Live Rendered Card Image */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-700">Live Card Output:</span>
                  <button
                    onClick={fetchData}
                    className="flex items-center gap-1 text-[10px] font-semibold text-rose-500 hover:text-rose-700"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md border border-rose-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${widgetImageUrl}&t=${Date.now()}`}
                    alt="Amore Mio Live Widget Preview"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Image URL Copy Card */}
              <div className="bg-zinc-900 rounded-2xl p-3 text-white space-y-2 border border-zinc-800 shadow-md">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 font-semibold text-rose-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Widget Image Feed URL
                  </span>
                  <span className="text-[10px] text-zinc-500">800x420 PNG</span>
                </div>

                <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800 font-mono text-[10px] text-rose-200 break-all select-all leading-relaxed">
                  {widgetImageUrl}
                </div>

                <button
                  onClick={handleCopyImageUrl}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 active:scale-98 shadow-sm"
                >
                  {copiedImageUrl ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied Image URL to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Widget Image URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* How to use in 30 seconds */}
              <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200 space-y-2 text-rose-900">
                <span className="text-[11px] font-bold text-rose-950 block">How to use (Same for both of you):</span>
                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <strong>On Android (using KWGT or Web Image Widget):</strong>
                    <p className="text-rose-700">Add an Image widget, paste the copied Image URL, and set the click action to Launch <strong>Amore Mio</strong>.</p>
                  </div>
                  <div className="pt-1 border-t border-rose-200/60">
                    <strong>On iPhone (using Widgy):</strong>
                    <p className="text-rose-700">Add an Image Layer &rarr; Image from Web (paste the URL) &rarr; Tap Action: Open URL to your app.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KWGT GUIDE (FOR ANDROID) */}
          {activeTab === 'kwgt_guide' && (
            <div className="space-y-2 text-rose-900 leading-relaxed">
              <h4 className="font-bold text-rose-700 text-xs uppercase tracking-wider">
                How to set up in KWGT:
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs bg-white p-3 rounded-2xl border border-rose-100">
                <li>
                  In KWGT, you can simply add an <strong>Image</strong> item instead of 10 text layers.
                </li>
                <li>
                  In the Image properties, set Mode to <strong>Web</strong> and URL to:
                  <code className="bg-rose-100 p-1 rounded text-[10px] font-mono block mt-1 break-all">
                    {widgetImageUrl}
                  </code>
                </li>
                <li>
                  Under the <strong>Touch</strong> tab, set Action to <strong>Launch App</strong> &rarr; <strong>Amore Mio</strong>.
                </li>
                <li>
                  Tap Save. Now your widget looks 100% like the card above, with no font or wrap setup needed.
                </li>
              </ol>
            </div>
          )}

          {/* TAB 3: WIDGY GUIDE (FOR IPHONE) */}
          {activeTab === 'widgy_guide' && (
            <div className="space-y-2 text-rose-900 leading-relaxed">
              <h4 className="font-bold text-rose-700 text-xs uppercase tracking-wider">
                How to set up on iPhone (Widgy):
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs bg-white p-3 rounded-2xl border border-rose-100">
                <li>Install <strong>Widgy Widgets</strong> on her iPhone.</li>
                <li>Create a <strong>Medium</strong> widget and add an <strong>Image</strong> layer.</li>
                <li>
                  Under Image properties, choose <strong>Web / URL</strong> and paste:
                  <code className="bg-rose-100 px-1 py-0.5 rounded text-[10px] font-mono block mt-1 break-all">
                    {currentOrigin}/api/widget/image?partner=partner2
                  </code>
                </li>
                <li>In <strong>Tap Action</strong>, set to Open URL &rarr; <code className="font-mono">{currentOrigin}/?partner=partner2</code>. Done!</li>
              </ol>
            </div>
          )}

          {/* TAB 4: API WIDGET */}
          {activeTab === 'api_widget' && (
            <div className="space-y-3.5">
              <div className="bg-zinc-900 rounded-2xl p-3 text-white space-y-2 border border-zinc-800 shadow-md">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 font-semibold text-rose-400">
                    <KeyRound className="w-3.5 h-3.5" />
                    API Widget Key
                  </span>
                  <span className="text-[10px] text-zinc-500">v1 W12 format</span>
                </div>

                <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800 font-mono text-[10px] text-rose-200 break-all select-all leading-relaxed">
                  {apiWidgetKey}
                </div>

                <button
                  onClick={handleCopyKey}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 active:scale-98 shadow-sm"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied Key!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy API Widget Key</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: RAW JSON */}
          {activeTab === 'raw_json' && (
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-rose-700 block mb-1">Raw JSON (/api/widget):</span>
                <pre className="p-3 bg-zinc-900 text-emerald-400 font-mono text-[10px] rounded-2xl overflow-x-auto max-h-40">
                  {JSON.stringify(widgetData, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-700 block mb-1">API Widget JSON (/api/widget/w12):</span>
                <pre className="p-3 bg-zinc-900 text-pink-300 font-mono text-[10px] rounded-2xl overflow-x-auto max-h-40">
                  {JSON.stringify(w12Data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-rose-50/70 border-t border-rose-100 flex items-center justify-between">
          <button
            onClick={handleCopyUrl}
            className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Raw Feed URL</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl transition active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
