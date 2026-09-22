'use client';

import React, { useState, useEffect } from 'react';
import { PartnerId, CoupleData, Question } from '@/lib/types';
import { Lock, Unlock, Send, Sparkles, Heart, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyQuestionCardProps {
  currentPartner: PartnerId;
  coupleState: CoupleData;
  onAnswerSubmitted: (newState: CoupleData) => void;
}

export const DailyQuestionCard: React.FC<DailyQuestionCardProps> = ({
  currentPartner,
  coupleState,
  onAnswerSubmitted,
}) => {
  const [answerInput, setAnswerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const me = coupleState[currentPartner];
  const partnerId: PartnerId = currentPartner === 'partner1' ? 'partner2' : 'partner1';
  const partner = coupleState[partnerId];

  // Get today's question
  const todayKey = Object.keys(coupleState.dailyQuestions).sort().reverse()[0] || 'today';
  const question: Question | undefined = coupleState.dailyQuestions[todayKey];
  const answers = coupleState.answers[todayKey];

  const myAnswer = answers?.[currentPartner];
  const partnerAnswer = answers?.[partnerId];
  const bothAnswered = Boolean(myAnswer && partnerAnswer);

  // Trigger confetti when both answers are unlocked
  useEffect(() => {
    if (bothAnswered && !hasCelebrated) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#ffe4e6'],
      });
      setHasCelebrated(true);
    }
  }, [bothAnswered, hasCelebrated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: currentPartner,
          answerText: answerInput.trim(),
          date: todayKey,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setAnswerInput('');
        onAnswerSubmitted(updated);
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (cat: string = 'romantic') => {
    switch (cat.toLowerCase()) {
      case 'romantic':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'deep':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'fun':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'memories':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'spicy':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-rose-100 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 my-2 text-rose-950 shadow-md border border-rose-100 relative">
      {/* Category & Status */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getCategoryColor(
            question?.category
          )}`}
        >
          {question?.category || 'ROMANTIC'} • TODAY'S PROMPT
        </span>

        {bothAnswered ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <Unlock className="w-3 h-3" />
            Both Answered!
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
            <Lock className="w-3 h-3" />
            Blind Reveal Mode
          </span>
        )}
      </div>

      {/* Question Headline */}
      <h2 className="text-lg font-bold text-rose-950 leading-snug tracking-tight mb-4">
        {question ? question.text : "What made you smile today?"}
      </h2>

      {/* Scenario A: Current user hasn't answered yet */}
      {!myAnswer && (
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="relative">
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder={`Type your honest answer, ${me.name}...`}
                rows={3}
                className="w-full rounded-2xl bg-white/90 border border-rose-200 p-3 text-sm text-rose-950 placeholder-rose-300 focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition resize-none shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={!answerInput.trim() || isSubmitting}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm shadow-md shadow-rose-500/25 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Locking in your answer...' : 'Submit & Reveal Status'}</span>
            </button>
          </form>

          {/* Locked partner preview */}
          <div className="rounded-2xl border border-dashed border-rose-200/90 bg-rose-50/50 p-4 text-center">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-1.5">
              <Lock className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-rose-800">
              {partner.name}&apos;s answer is secret
            </p>
            <p className="text-[11px] text-rose-500 mt-0.5">
              {partnerAnswer
                ? `🔥 ${partner.name} has already submitted! Submit yours to read it.`
                : `Submit your answer to unlock the reveal once ${partner.name} answers.`}
            </p>
          </div>
        </div>
      )}

      {/* Scenario B: Current user has answered, but partner hasn't */}
      {myAnswer && !partnerAnswer && (
        <div className="space-y-3.5">
          {/* My answer card */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-xs text-rose-600 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <span>{me.avatarEmoji}</span>
                <span>Your Answer ({me.name})</span>
              </span>
              <span className="text-[10px] text-rose-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Submitted
              </span>
            </div>
            <p className="text-sm text-rose-900 font-medium whitespace-pre-wrap leading-relaxed">
              &ldquo;{myAnswer.text}&rdquo;
            </p>
          </div>

          {/* Waiting for partner card */}
          <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/70 p-4 text-center">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-1.5 animate-pulse">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-amber-900">
              Waiting for {partner.name} to answer...
            </p>
            <p className="text-[11px] text-amber-700/80 mt-0.5">
              Their response is locked until they submit. Switch to {partner.name} above to test!
            </p>
          </div>
        </div>
      )}

      {/* Scenario C: Both have answered! Revealed! */}
      {bothAnswered && (
        <div className="space-y-3">
          <div className="text-center py-1">
            <span className="text-xs font-bold text-rose-600 bg-rose-100/70 px-3 py-1 rounded-full border border-rose-200 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              You both shared today!
            </span>
          </div>

          {/* Answer 1: Current User */}
          <div className="bg-white/90 border border-rose-200/80 rounded-2xl p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-rose-600 font-semibold mb-1.5">
              <span className="flex items-center gap-1.5">
                <span>{me.avatarEmoji}</span>
                <span>{me.name}</span>
              </span>
              <span className="text-[10px] text-rose-400">
                {new Date(myAnswer!.answeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm text-rose-900 font-medium leading-relaxed">
              &ldquo;{myAnswer!.text}&rdquo;
            </p>
          </div>

          {/* Answer 2: Partner */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-pink-200/80 rounded-2xl p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-pink-700 font-semibold mb-1.5">
              <span className="flex items-center gap-1.5">
                <span>{partner.avatarEmoji}</span>
                <span>{partner.name}</span>
              </span>
              <span className="text-[10px] text-pink-400">
                {new Date(partnerAnswer!.answeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm text-pink-950 font-medium leading-relaxed">
              &ldquo;{partnerAnswer!.text}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
