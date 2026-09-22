'use client';

import React from 'react';
import { CoupleData } from '@/lib/types';
import { X, BookOpen, Calendar, Heart } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupleState: CoupleData;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  coupleState,
}) => {
  if (!isOpen) return null;

  // Gather answered questions sorted by date descending
  const dates = Object.keys(coupleState.answers).sort().reverse();
  const answeredHistory = dates
    .map((date) => {
      const question = coupleState.dailyQuestions[date];
      const answer = coupleState.answers[date];
      return { date, question, answer };
    })
    .filter((item) => item.answer && (item.answer.partner1 || item.answer.partner2));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-rose-100">
        {/* Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-950">Memory Book</h3>
              <p className="text-[11px] text-rose-500 font-medium">Our Past Questions & Answers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-rose-200 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          {answeredHistory.length === 0 ? (
            <div className="py-12 text-center text-rose-400">
              <Heart className="w-8 h-8 mx-auto mb-2 text-rose-300 stroke-1" />
              <p className="font-semibold text-rose-600">No memories recorded yet!</p>
              <p className="text-[11px] text-rose-400 mt-0.5">
                Answer today&apos;s question together to start your memory collection.
              </p>
            </div>
          ) : (
            answeredHistory.map(({ date, question, answer }) => (
              <div
                key={date}
                className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between text-[10px] text-rose-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-rose-400" />
                    {date}
                  </span>
                  <span className="uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    {question?.category || 'PROMPT'}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-rose-950">
                  {question?.text || 'Daily Question'}
                </h4>

                <div className="space-y-1.5 pt-1">
                  {/* Partner 1 answer */}
                  {answer.partner1 ? (
                    <div className="bg-white p-2.5 rounded-xl border border-rose-100">
                      <span className="font-bold text-[10px] text-rose-600 block mb-0.5">
                        {coupleState.partner1.avatarEmoji} {coupleState.partner1.name}:
                      </span>
                      <p className="text-xs text-rose-900 leading-snug">
                        &ldquo;{answer.partner1.text}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <div className="text-[10px] text-rose-400 italic">
                      {coupleState.partner1.name} didn&apos;t answer this day.
                    </div>
                  )}

                  {/* Partner 2 answer */}
                  {answer.partner2 ? (
                    <div className="bg-white p-2.5 rounded-xl border border-rose-100">
                      <span className="font-bold text-[10px] text-pink-600 block mb-0.5">
                        {coupleState.partner2.avatarEmoji} {coupleState.partner2.name}:
                      </span>
                      <p className="text-xs text-pink-950 leading-snug">
                        &ldquo;{answer.partner2.text}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <div className="text-[10px] text-rose-400 italic">
                      {coupleState.partner2.name} didn&apos;t answer this day.
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
