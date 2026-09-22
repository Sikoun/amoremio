'use client';

import React, { useState, useEffect } from 'react';
import { PartnerId, WidgyResponse, W12Row } from '@/lib/types';
import { X, Copy, Check, Smartphone, ExternalLink, Sparkles, RefreshCw, KeyRound, Palette } from 'lucide-react';

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
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'terminal'>('dark');
  const [activeTab, setActiveTab] = useState<'api_widget' | 'preview' | 'widgy_guide' | 'kwgt_guide' | 'raw_json'>('api_widget');
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
            onClick={() => setActiveTab('api_widget')}
            className={`pb-2 border-b-2 whitespace-nowrap transition flex items-center gap-1 ${
              activeTab === 'api_widget'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            <span>⭐ API Widget (Both)</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'preview'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            Simulated Card
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
              Generating widget for: <span className="font-bold text-rose-600">{targetPartner === 'partner1' ? 'Gaspar (Partner 1)' : 'Mi Amor (Partner 2)'}</span>
            </span>
            <button
              onClick={() => setTargetPartner(targetPartner === 'partner1' ? 'partner2' : 'partner1')}
              className="text-[11px] text-rose-600 font-bold bg-white px-2 py-0.5 rounded-lg border border-rose-200 hover:bg-rose-100 transition"
            >
              Switch to {targetPartner === 'partner1' ? 'Partner 2' : 'Partner 1'}
            </button>
          </div>

          {/* TAB 1: API WIDGET (UNIFORM CROSS-PLATFORM) */}
          {activeTab === 'api_widget' && (
            <div className="space-y-3.5">
              {/* Highlight badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-emerald-900 flex items-start gap-2">
                <span className="text-base leading-none">📱</span>
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-emerald-950">Recommended uniform setup: </span>
                  Install <strong>API Widget</strong> on both Android & iPhone. Same app, same key, zero syntax hassle!
                </div>
              </div>

              {/* Theme Picker */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                    <Palette className="w-3 h-3 text-rose-500" />
                    Widget Theme:
                  </span>
                  <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg">
                    {(['dark', 'light', 'terminal'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTheme(t)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize transition ${
                          selectedTheme === t
                            ? 'bg-white text-zinc-900 shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Copy Key Box */}
              <div className="bg-zinc-900 rounded-2xl p-3 text-white space-y-2 border border-zinc-800 shadow-md">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 font-semibold text-rose-400">
                    <KeyRound className="w-3.5 h-3.5" />
                    Your API Widget Key
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
                      <span>Copied Key to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy API Widget Key</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live W12 Widget Mockup */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-700">Live Preview ({selectedTheme} theme):</span>
                <div
                  className={`rounded-2xl p-3 font-mono text-[11px] border transition shadow-inner ${
                    selectedTheme === 'dark'
                      ? 'bg-zinc-950 text-zinc-100 border-zinc-800'
                      : selectedTheme === 'terminal'
                      ? 'bg-black text-emerald-400 border-emerald-900/50'
                      : 'bg-zinc-50 text-zinc-900 border-zinc-200'
                  }`}
                >
                  <div className="space-y-1">
                    {w12Data && w12Data.length > 0 ? (
                      w12Data.map((row, idx) => {
                        if (!row.key && !row.value) {
                          return <div key={idx} className="h-1.5" />;
                        }
                        let colorClass = '';
                        if (row.color === 'main') {
                          colorClass = selectedTheme === 'terminal' ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold';
                        } else if (row.color === 'success') {
                          colorClass = 'text-emerald-400 font-semibold';
                        } else if (row.color === 'warning') {
                          colorClass = 'text-amber-400 font-semibold';
                        } else if (row.color === 'danger') {
                          colorClass = 'text-rose-500 font-semibold';
                        }

                        return (
                          <div key={idx} className="flex justify-between items-baseline gap-2">
                            <span className={colorClass || (row.value ? 'text-zinc-400' : 'font-medium')}>{row.key}</span>
                            {row.value && <span className={colorClass || 'text-right font-medium'}>{row.value}</span>}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-zinc-500 text-center py-2">Loading preview...</div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3 Step Instructions */}
              <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200 space-y-2">
                <span className="text-[11px] font-bold text-rose-950 block">Quick 3-Step Setup:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-rose-900">
                  <li>
                    Install <strong>API Widget</strong> from{' '}
                    <a
                      href="https://play.google.com/store/apps/details?id=com.apiwidget.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 font-bold underline inline-flex items-center gap-0.5"
                    >
                      Google Play <ExternalLink className="w-2.5 h-2.5 inline" />
                    </a>{' '}
                    (Android) or{' '}
                    <a
                      href="https://apps.apple.com/app/api-widget/id1593685419"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 font-bold underline inline-flex items-center gap-0.5"
                    >
                      App Store <ExternalLink className="w-2.5 h-2.5 inline" />
                    </a>{' '}
                    (iPhone).
                  </li>
                  <li>Open the app, paste the copied <strong>API Widget Key</strong> above, and tap <strong>Save</strong>.</li>
                  <li>Go to your Home Screen, long-press, add the <strong>API Widget (Small/Medium)</strong>, and select your saved widget!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE SIMULATED CARD */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-rose-600">
                <span className="font-semibold">Simulated Medium Graphic Widget</span>
                <button
                  onClick={fetchData}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-700"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* The Medium Widget Box Replica */}
              <div className="w-full bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-[28px] p-4 text-white shadow-xl relative overflow-hidden aspect-2/1 flex flex-col justify-between border border-white/20">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {widgetData?.question_category || 'ROMANTIC'}
                  </span>
                  <span className="text-rose-100 font-medium">
                    {widgetData?.days_together || 'Together'}
                  </span>
                </div>

                <div className="my-auto py-1">
                  <p className="text-xs font-bold leading-snug line-clamp-2 drop-shadow-xs">
                    &ldquo;{widgetData?.question_text || 'Loading question...'}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/20">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{widgetData?.partner_mood_emoji || '🥰'}</span>
                    <span className="font-medium text-rose-100">
                      {widgetData?.partner_name}: {widgetData?.partner_status_badge}
                    </span>
                  </div>
                  <span className="bg-white text-rose-600 font-bold px-2 py-0.5 rounded-lg text-[9px]">
                    Tap to open
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-rose-600 text-center italic">
                Refreshes automatically in the background throughout the day!
              </p>
            </div>
          )}

          {/* TAB 3: WIDGY GUIDE (FOR IPHONE) */}
          {activeTab === 'widgy_guide' && (
            <div className="space-y-2 text-rose-900 leading-relaxed">
              <h4 className="font-bold text-rose-700 text-xs uppercase tracking-wider">
                How to set up on iPhone (Widgy):
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs bg-white p-3 rounded-2xl border border-rose-100">
                <li>Install <strong>Widgy Widgets</strong> from the iOS App Store.</li>
                <li>Create a new <strong>Medium</strong> widget.</li>
                <li>Add a <strong>Text Layer</strong> &rarr; <strong>Data</strong> &rarr; <strong>JSON Endpoint</strong>.</li>
                <li>
                  Paste your URL:{' '}
                  <code className="bg-rose-100 px-1 py-0.5 rounded text-[10px] font-mono break-all">
                    {apiUrl}
                  </code>
                </li>
                <li>Pick the JSON keys: <code className="font-mono">question_text</code>, <code className="font-mono">partner_status_badge</code>, <code className="font-mono">days_together</code>.</li>
                <li>In <strong>Tap Action</strong>, select <strong>Open URL</strong> to link to your app. Done!</li>
              </ol>
            </div>
          )}

          {/* TAB 4: KWGT GUIDE (FOR ANDROID) */}
          {activeTab === 'kwgt_guide' && (
            <div className="space-y-2 text-rose-900 leading-relaxed">
              <h4 className="font-bold text-rose-700 text-xs uppercase tracking-wider">
                How to set up on Android (KWGT):
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs bg-white p-3 rounded-2xl border border-rose-100">
                <li>Install <strong>KWGT Kustom Widget Maker</strong> from Google Play.</li>
                <li>Add a blank KWGT widget to your home screen and open it.</li>
                <li>
                  Add text layer and set formula to:
                  <code className="bg-rose-100 p-1 rounded text-[10px] font-mono block mt-1 break-all">
                    $wg(&quot;{apiUrl}&quot;, json, .question_text)$
                  </code>
                </li>
                <li>Under Touch tab, set action to Launch App &rarr; Amore Mio.</li>
              </ol>
            </div>
          )}

          {/* TAB 5: RAW JSON */}
          {activeTab === 'raw_json' && (
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-rose-700 block mb-1">Standard JSON (/api/widget):</span>
                <pre className="p-3 bg-zinc-900 text-emerald-400 font-mono text-[10px] rounded-2xl overflow-x-auto max-h-40">
                  {JSON.stringify(widgetData, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-700 block mb-1">API Widget W12 JSON (/api/widget/w12):</span>
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
