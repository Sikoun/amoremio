'use client';

import React, { useState } from 'react';
import { PartnerId, CoupleData } from '@/lib/types';
import { Heart, Send, Sparkles, MessageCircleHeart, Plus, Smile } from 'lucide-react';
import { useFloatingReactions } from './graphics/FloatingReactions';
import { haptic } from '@/lib/haptics';

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
  { emoji: '💋', label: 'Kiss', message: 'Sent you a sweet kiss!' },
  { emoji: '🫂', label: 'Warm Hug', message: 'Sending you a big warm hug!' },
  { emoji: '👉👈', label: 'Thinking of you', message: 'Thinking of you right now...' },
  { emoji: '❤️', label: 'Love You', message: 'I love you so much!' },
];

export const MoodAndPokeCard: React.FC<MoodAndPokeCardProps> = ({
  currentPartner,
  coupleState,
  onStateUpdated,
}) => {
  const [customMood, setCustomMood] = useState('');
  const [showCustomMoodInput, setShowCustomMoodInput] = useState(false);
  const [customPokeMessage, setCustomPokeMessage] = useState('');
  const [showCustomPokeInput, setShowCustomPokeInput] = useState(false);
  const [isUpdatingMood, setIsUpdatingMood] = useState(false);
  const [isSendingPoke, setIsSendingPoke] = useState(false);
  const [pokeSentNotification, setPokeSentNotification] = useState<string | null>(null);

  const { triggerFloatingReaction } = useFloatingReactions();

  const me = coupleState[currentPartner];
  const partnerId: PartnerId = currentPartner === 'partner1' ? 'partner2' : 'partner1';
  const partner = coupleState[partnerId];

  // Latest poke received from partner
  const latestPokeReceived = (coupleState.recentPokes || []).find((p) => p.from === partnerId);

  const handleSetMood = async (emoji: string, label: string) => {
    haptic.lightTap();
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
        triggerFloatingReaction(emoji, 6);
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
    haptic.heartbeat();
    setIsSendingPoke(true);

    // Floating reaction burst
    triggerFloatingReaction(emoji, 8);
    if (emoji === '💋' || emoji === '❤️') {
      triggerFloatingReaction('💕', 6);
    }

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
        setPokeSentNotification(`${emoji} ${message}`);
        setShowCustomPokeInput(false);
        setCustomPokeMessage('');
        setTimeout(() => setPokeSentNotification(null), 3000);
      }
    } catch (err) {
      console.error('Failed to send poke:', err);
    } finally {
      setIsSendingPoke(false);
    }
  };

  return (
    <div className="space-y-3.5 my-3">
      {/* ========================================================= */}
      {/* 1. Partner Live Status & Mood Box                         */}
      {/* ========================================================= */}
      <div className="glass-card rounded-3xl p-4.5 border border-rose-100 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 flex items-center justify-center text-2xl border border-rose-200 shadow-xs">
                {partner.avatarEmoji}
              </div>
              <span className="absolute -bottom-1 -right-1 text-lg drop-shadow-xs">
                {partner.moodEmoji}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-rose-950">{partner.name}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Connected" />
              </div>
              <p className="text-xs text-rose-600 font-semibold mt-0.5">
                {partner.moodEmoji} {partner.mood}
              </p>
              <p className="text-[10px] text-rose-400">
                Last active {new Date(partner.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Quick Kiss Button */}
          <button
            onClick={() => handleSendPoke('💋', 'Sent you a sweet kiss!')}
            disabled={isSendingPoke}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-500/25 active:scale-95 transition flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Kiss 💋</span>
          </button>
        </div>

        {/* Latest message received notification if any */}
        {latestPokeReceived && (
          <div className="mt-3 pt-2.5 border-t border-rose-100/70 flex items-center gap-2 text-xs text-rose-700 bg-rose-50/60 p-2.5 rounded-xl shadow-2xs">
            <span className="text-lg">{latestPokeReceived.emoji}</span>
            <div className="truncate flex-1">
              <span className="font-bold text-rose-900">{partner.name}: </span>
              <span className="font-medium text-[11px]">&ldquo;{latestPokeReceived.message}&rdquo;</span>
            </div>
            <span className="text-[9px] text-rose-400 ml-1 whitespace-nowrap">
              {new Date(latestPokeReceived.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}

        {/* Transient alert when poke is sent */}
        {pokeSentNotification && (
          <div className="absolute inset-x-4 top-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-lg flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="truncate">{pokeSentNotification}</span>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. Interactive Love Pings (Fast Reactions)                */}
      {/* ========================================================= */}
      <div className="glass-card rounded-3xl p-4 border border-rose-100 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
            <MessageCircleHeart className="w-3.5 h-3.5" />
            <span>Send Instant Love</span>
          </span>
          <button
            onClick={() => {
              haptic.lightTap();
              setShowCustomPokeInput(!showCustomPokeInput);
            }}
            className="text-[10px] font-bold text-rose-500 hover:text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200"
          >
            {showCustomPokeInput ? 'Cancel' : '+ Custom Note'}
          </button>
        </div>

        {/* 4 Quick Preset Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {PRESET_POKES.map((poke) => (
            <button
              key={poke.emoji}
              onClick={() => handleSendPoke(poke.emoji, poke.message)}
              disabled={isSendingPoke}
              className="py-2.5 px-1.5 rounded-2xl bg-white/90 hover:bg-rose-50 border border-rose-100 flex flex-col items-center justify-center gap-1 shadow-2xs hover:shadow-sm active:scale-90 transition-transform disabled:opacity-50"
            >
              <span className="text-xl leading-none">{poke.emoji}</span>
              <span className="text-[10px] font-bold text-rose-800 tracking-tight truncate w-full text-center">
                {poke.label}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Note / Whisper Input */}
        {showCustomPokeInput && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customPokeMessage.trim()) {
                handleSendPoke('💌', customPokeMessage.trim());
              }
            }}
            className="flex items-center gap-2 pt-2 border-t border-rose-100"
          >
            <input
              type="text"
              value={customPokeMessage}
              onChange={(e) => setCustomPokeMessage(e.target.value)}
              placeholder={`Whisper something sweet to ${partner.name}...`}
              maxLength={60}
              className="flex-1 rounded-xl bg-white border border-rose-200 p-2 text-xs text-rose-950 placeholder-rose-300 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="submit"
              disabled={!customPokeMessage.trim() || isSendingPoke}
              className="p-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 transition active:scale-95 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. My Live Mood Selector                                  */}
      {/* ========================================================= */}
      <div className="glass-card rounded-3xl p-4 border border-rose-100 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5" />
            <span>Update My Mood ({me.name})</span>
          </span>
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
            Current: {me.moodEmoji} {me.mood}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {PRESET_MOODS.map((m) => {
            const isCurrent = me.mood === m.label;
            return (
              <button
                key={m.label}
                onClick={() => handleSetMood(m.emoji, m.label)}
                disabled={isUpdatingMood}
                className={`py-2 px-1.5 rounded-2xl border text-center transition flex flex-col items-center gap-0.5 ${
                  isCurrent
                    ? 'border-rose-400 bg-rose-100/80 ring-2 ring-rose-300 font-bold'
                    : 'border-rose-100 bg-white/80 hover:bg-rose-50 text-rose-800'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-[10px] font-semibold text-rose-800 truncate w-full">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
