'use client';

import React, { useState } from 'react';
import { PartnerId, CoupleData, Poke } from '@/lib/types';
import { Heart, Send, Smile, Sparkles, MessageCircleHeart } from 'lucide-react';

interface MoodAndPokeCardProps {
  currentPartner: PartnerId;
  coupleState: CoupleData;
  onStateUpdated: (newState: CoupleData) => void;
}

const PRESET_MOODS = [
  { emoji: '🥰', label: 'In love' },
  { emoji: '🥺', label: 'Missing you' },
  { emoji: '😴', label: 'Sleepy' },
  { emoji: '☕', label: 'Busy' },
  { emoji: '🥳', label: 'Excited' },
  { emoji: '🍕', label: 'Hungry' },
  { emoji: '🛋️', label: 'Chilling' },
  { emoji: '🌧️', label: 'Need a hug' },
];

const PRESET_POKES = [
  { emoji: '💋', message: 'Sent you a sweet kiss!' },
  { emoji: '🫂', message: 'Sending you a big warm hug!' },
  { emoji: '👉👈', message: 'Thinking of you right now...' },
  { emoji: '❤️', message: 'I love you so much!' },
];

export const MoodAndPokeCard: React.FC<MoodAndPokeCardProps> = ({
  currentPartner,
  coupleState,
  onStateUpdated,
}) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [showCustomMoodInput, setShowCustomMoodInput] = useState(false);
  const [isUpdatingMood, setIsUpdatingMood] = useState(false);
  const [isSendingPoke, setIsSendingPoke] = useState(false);
  const [pokeSentNotification, setPokeSentNotification] = useState<string | null>(null);

  const me = coupleState[currentPartner];
  const partnerId: PartnerId = currentPartner === 'partner1' ? 'partner2' : 'partner1';
  const partner = coupleState[partnerId];

  // Latest poke received from partner
  const latestPokeReceived = (coupleState.recentPokes || []).find((p) => p.from === partnerId);

  const handleSetMood = async (emoji: string, label: string) => {
    setIsUpdatingMood(true);
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: currentPartner,
          mood: label,
          moodEmoji: emoji,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        onStateUpdated(updated);
        setShowCustomMoodInput(false);
        setCustomMood('');
      }
    } catch (err) {
      console.error('Failed to update mood:', err);
    } finally {
      setIsUpdatingMood(false);
    }
  };

  const handleSendPoke = async (emoji: string, message: string) => {
    setIsSendingPoke(true);
    try {
      const res = await fetch('/api/poke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPartnerId: currentPartner,
          emoji,
          message,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        onStateUpdated(updated);
        setPokeSentNotification(`${emoji} Sent to ${partner.name}!`);
        setTimeout(() => setPokeSentNotification(null), 3000);
      }
    } catch (err) {
      console.error('Failed to send poke:', err);
    } finally {
      setIsSendingPoke(false);
    }
  };

  return (
    <div className="space-y-3 my-2">
      {/* Partner Live Status & Mood Box */}
      <div className="glass-card rounded-3xl p-4 border border-rose-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-200 to-rose-100 flex items-center justify-center text-2xl border border-rose-200 shadow-xs">
                {partner.avatarEmoji}
              </div>
              <span className="absolute -bottom-1 -right-1 text-base">
                {partner.moodEmoji}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-rose-950">{partner.name}</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-xs text-rose-600 font-medium">
                {partner.moodEmoji} {partner.mood}
              </p>
              <p className="text-[10px] text-rose-400">
                Last updated {new Date(partner.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Quick poke button for partner */}
          <button
            onClick={() => handleSendPoke('💋', 'Sent you a sweet kiss!')}
            disabled={isSendingPoke}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-sm shadow-rose-500/20 active:scale-95 transition flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Kiss 💋</span>
          </button>
        </div>

        {/* Latest message received notification if any */}
        {latestPokeReceived && (
          <div className="mt-3 pt-2.5 border-t border-rose-100/70 flex items-center gap-2 text-xs text-rose-700 bg-rose-50/60 p-2 rounded-xl">
            <span className="text-base">{latestPokeReceived.emoji}</span>
            <span className="font-medium text-[11px] truncate">
              {partner.name}: &ldquo;{latestPokeReceived.message}&rdquo;
            </span>
            <span className="text-[9px] text-rose-400 ml-auto whitespace-nowrap">
              {new Date(latestPokeReceived.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}

        {/* Transient alert when poke is sent */}
        {pokeSentNotification && (
          <div className="absolute inset-x-4 top-3 bg-rose-600 text-white text-xs font-semibold py-1.5 px-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{pokeSentNotification}</span>
          </div>
        )}
      </div>

      {/* Update My Mood & Love Pings */}
      <div className="glass-card rounded-3xl p-4 border border-rose-100 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-rose-500" />
            Your Mood ({me.name})
          </span>
          <span className="text-xs text-rose-500 font-semibold bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
            Current: {me.moodEmoji} {me.mood}
          </span>
        </div>

        {/* Mood Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {PRESET_MOODS.map((m) => (
            <button
              key={m.label}
              onClick={() => handleSetMood(m.emoji, m.label)}
              disabled={isUpdatingMood}
              className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all active:scale-95 flex items-center gap-1 ${
                me.mood === m.label
                  ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                  : 'bg-white/80 hover:bg-rose-50 text-rose-800 border-rose-200/80'
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Love Reactions Grid */}
        <div className="mt-3 pt-3 border-t border-rose-100">
          <span className="text-[11px] font-bold text-rose-700 block mb-2">
            Send instant love to {partner.name}:
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {PRESET_POKES.map((poke) => (
              <button
                key={poke.emoji}
                onClick={() => handleSendPoke(poke.emoji, poke.message)}
                disabled={isSendingPoke}
                className="py-2 px-1 rounded-xl bg-white hover:bg-rose-50 border border-rose-200/80 text-center active:scale-95 transition shadow-2xs group"
                title={poke.message}
              >
                <div className="text-xl group-hover:scale-110 transition">{poke.emoji}</div>
                <div className="text-[9px] font-semibold text-rose-600 truncate mt-0.5">
                  {poke.message.split(' ')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
