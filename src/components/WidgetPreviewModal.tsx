'use client';

import React, { useState, useEffect } from 'react';
import { PartnerId, WidgyResponse } from '@/lib/types';
import { X, Copy, Check, Smartphone, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'preview' | 'widgy_guide' | 'kwgt_guide' | 'raw_json'>('preview');
  const [widgetData, setWidgetData] = useState<WidgyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetPartner, setTargetPartner] = useState<PartnerId>(
    currentPartner === 'partner1' ? 'partner2' : 'partner1'
  );

  const fetchWidgetData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/widget?partner=${targetPartner}`);
      if (res.ok) {
        const data = await res.json();
        setWidgetData(data);
      }
    } catch (err) {
      console.error('Failed to load widget data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWidgetData();
    }
  }, [isOpen, targetPartner]);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://your-app.vercel.app';
  const apiUrl = `${currentOrigin}/api/widget?partner=${targetPartner}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(apiUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-rose-100">
        {/* Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-950">Home Screen Widget</h3>
              <p className="text-[11px] text-rose-500 font-medium">iOS (Widgy) & Android (KWGT)</p>
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
        <div className="flex border-b border-rose-100 px-4 pt-2 gap-2 text-xs font-semibold bg-rose-50/30">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'preview'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab('widgy_guide')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'widgy_guide'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            iPhone (Widgy)
          </button>
          <button
            onClick={() => setActiveTab('kwgt_guide')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'kwgt_guide'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            Android (KWGT)
          </button>
          <button
            onClick={() => setActiveTab('raw_json')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'raw_json'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-rose-400 hover:text-rose-600'
            }`}
          >
            JSON Feed
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Endpoint URL Card */}
          <div className="bg-rose-50 rounded-2xl p-3 border border-rose-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-rose-700">
                Widget Feed for: {targetPartner === 'partner1' ? 'Partner 1' : 'Partner 2'}
              </span>
              <button
                onClick={() => setTargetPartner(targetPartner === 'partner1' ? 'partner2' : 'partner1')}
                className="text-[10px] text-rose-600 font-semibold underline"
              >
                Switch Partner
              </button>
            </div>
            <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-rose-200 font-mono text-[10px] text-rose-800 break-all select-all">
              <span className="truncate">{apiUrl}</span>
              <button
                onClick={handleCopyUrl}
                className="ml-auto shrink-0 bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded-lg transition"
                title="Copy API URL"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* TAB 1: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-rose-600">
                <span className="font-semibold">Simulated Medium iOS Widget</span>
                <button
                  onClick={fetchWidgetData}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-700"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* The iOS Medium Widget Box Replica */}
              <div className="w-full bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-[28px] p-4 text-white shadow-xl relative overflow-hidden aspect-2/1 flex flex-col justify-between border border-white/20">
                {/* Background glow decoration */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                {/* Widget Top Header */}
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {widgetData?.question_category || 'ROMANTIC'}
                  </span>
                  <span className="text-rose-100 font-medium">
                    {widgetData?.days_together || 'Together'}
                  </span>
                </div>

                {/* Widget Question Body */}
                <div className="my-auto py-1">
                  <p className="text-xs font-bold leading-snug line-clamp-2 drop-shadow-xs">
                    &ldquo;{widgetData?.question_text || 'Loading question...'}&rdquo;
                  </p>
                </div>

                {/* Widget Footer */}
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
                👆 This widget refreshes every 15 minutes on your partner&apos;s home screen!
              </p>
            </div>
          )}

          {/* TAB 2: WIDGY GUIDE (FOR IPHONE) */}
          {activeTab === 'widgy_guide' && (
            <div className="space-y-2 text-rose-900 leading-relaxed">
              <h4 className="font-bold text-rose-700 text-xs uppercase tracking-wider">
                How to set up on your partner&apos;s iPhone:
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs bg-white p-3 rounded-2xl border border-rose-100">
                <li>
                  Install <strong>Widgy Widgets</strong> from the App Store (it&apos;s free).
                </li>
                <li>
                  Create a new <strong>Medium</strong> widget.
                </li>
                <li>
                  Add a <strong>Text Layer</strong>, go to <strong>Data</strong> &rarr; <strong>JSON Endpoint</strong>.
                </li>
                <li>
                  Paste the copied feed URL:{' '}
                  <code className="bg-rose-100 px-1 py-0.5 rounded text-[10px] font-mono break-all">
                    {apiUrl}
                  </code>
                </li>
                <li>
                  Select the JSON keys for each layer:
                  <ul className="list-disc list-inside pl-3 mt-1 text-[11px] text-rose-600">
                    <li><code className="font-mono">question_text</code> for the question</li>
                    <li><code className="font-mono">partner_status_badge</code> for status</li>
                    <li><code className="font-mono">days_together</code> for anniversary</li>
                  </ul>
                </li>
                <li>
                  In <strong>Tap Action</strong>, select <strong>Open URL</strong> and set it to your app domain so tapping the widget opens directly to today&apos;s prompt!
                </li>
                <li>
                  Add the Widgy widget to her iOS Home Screen. Done!
                </li>
              </ol>
            </div>
          )}

          {/* TAB 3: KWGT GUIDE (FOR ANDROID) */}
          {activeTab === 'kwgt_guide' && (
            <div className="space-y-2 text-rose-900 leading-relaxed">
              <h4 className="font-bold text-rose-700 text-xs uppercase tracking-wider">
                How to set up on your Android phone:
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs bg-white p-3 rounded-2xl border border-rose-100">
                <li>
                  Install <strong>KWGT Kustom Widget Maker</strong> from Google Play.
                </li>
                <li>
                  Add a 4x2 KWGT widget to your home screen and open it.
                </li>
                <li>
                  Add a text layer, edit formula, and use the web get formula:
                  <br />
                  <code className="bg-rose-100 p-1 rounded text-[10px] font-mono block mt-1 break-all">
                    $wg(&quot;{apiUrl}&quot;, json, .question_text)$
                  </code>
                </li>
                <li>
                  Set the touch action to open Chrome or your PWA app.
                </li>
              </ol>
            </div>
          )}

          {/* TAB 4: RAW JSON */}
          {activeTab === 'raw_json' && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-rose-700">Real-time JSON response:</span>
              <pre className="p-3 bg-zinc-900 text-emerald-400 font-mono text-[10px] rounded-2xl overflow-x-auto max-h-52">
                {JSON.stringify(widgetData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-rose-50/60 border-t border-rose-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl transition active:scale-95"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
