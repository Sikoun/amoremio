'use client';

import React, { useState } from 'react';
import { haptic } from '@/lib/haptics';

interface CoupleMascotProps {
  partner1Name?: string;
  partner2Name?: string;
  className?: string;
}

export const CoupleMascot: React.FC<CoupleMascotProps> = ({
  partner1Name = 'Gaspar',
  partner2Name = 'Mi Amor',
  className = '',
}) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [heartsCount, setHeartsCount] = useState<number[]>([]);

  const handleTap = () => {
    haptic.heartbeat();
    setIsBouncing(true);
    setHeartsCount((prev) => [...prev.slice(-4), Date.now()]);
    setTimeout(() => setIsBouncing(false), 600);
  };

  return (
    <div
      onClick={handleTap}
      role="button"
      tabIndex={0}
      title="Tap us for love!"
      className={`relative inline-flex flex-col items-center justify-center cursor-pointer select-none transition-transform active:scale-95 ${className}`}
    >
      {/* Floating Mini Hearts on Tap */}
      <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
        {heartsCount.map((id) => (
          <span
            key={id}
            className="absolute text-lg animate-float-heart"
            style={{
              left: `${45 + (Math.random() * 20 - 10)}%`,
              top: '10%',
            }}
          >
            💕
          </span>
        ))}
      </div>

      {/* SVG Illustration Container */}
      <svg
        viewBox="0 0 240 140"
        className={`w-full max-w-[240px] h-auto drop-shadow-sm transition-transform duration-300 ${
          isBouncing ? 'scale-105' : 'hover:scale-[1.02]'
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Lion Mane Gradient */}
          <linearGradient id="lionMane" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Lion Body Gradient */}
          <linearGradient id="lionBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Sea Lion Body Gradient */}
          <linearGradient id="sealBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0e7ff" />
            <stop offset="50%" stopColor="#c7d2fe" />
            <stop offset="100%" stopColor="#a5b4fc" />
          </linearGradient>

          {/* Heart Glow */}
          <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow Ground */}
        <ellipse cx="120" cy="125" rx="90" ry="10" fill="rgba(244, 63, 94, 0.08)" />

        {/* ========================================================= */}
        {/* CHARACTER 1: GASPAR THE LION (LEFT)                       */}
        {/* ========================================================= */}
        <g id="gaspar-lion" className="transition-transform duration-300">
          {/* Lion Tail */}
          <path
            d="M 52 110 Q 30 115 28 95 Q 26 80 34 75"
            stroke="#b45309"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tail Tuft */}
          <circle cx="34" cy="74" r="7" fill="#92400e" />

          {/* Lion Mane (Back Petals) */}
          <circle cx="82" cy="75" r="42" fill="url(#lionMane)" />

          {/* Lion Body */}
          <ellipse cx="84" cy="98" rx="26" ry="24" fill="url(#lionBody)" />
          {/* Lion White Belly */}
          <ellipse cx="86" cy="100" rx="16" ry="15" fill="#fef3c7" />

          {/* Lion Head */}
          <circle cx="82" cy="75" r="30" fill="url(#lionBody)" />

          {/* Lion Ears */}
          <circle cx="62" cy="54" r="10" fill="#d97706" />
          <circle cx="62" cy="54" r="6" fill="#fef3c7" />
          <circle cx="102" cy="54" r="10" fill="#d97706" />
          <circle cx="102" cy="54" r="6" fill="#fef3c7" />

          {/* Mane Front Tuft */}
          <path
            d="M 72 48 Q 82 40 92 48 Q 82 52 72 48 Z"
            fill="#b45309"
          />

          {/* Lion Snout / Muzzle */}
          <ellipse cx="82" cy="80" rx="14" ry="10" fill="#fef3c7" />
          {/* Nose */}
          <path d="M 78 74 L 86 74 L 82 78 Z" fill="#78350f" />
          {/* Mouth */}
          <path
            d="M 78 81 Q 82 85 86 81"
            stroke="#78350f"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Lion Eyes (Happy smiling crescents) */}
          <path
            d="M 70 70 Q 74 65 78 70"
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 86 70 Q 90 65 94 70"
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Rosy Blushing Cheeks */}
          <ellipse cx="68" cy="76" rx="5" ry="3.5" fill="#fda4af" opacity="0.85" />
          <ellipse cx="96" cy="76" rx="5" ry="3.5" fill="#fda4af" opacity="0.85" />

          {/* Paws */}
          <ellipse cx="74" cy="118" rx="8" ry="6" fill="#f59e0b" />
          <ellipse cx="94" cy="118" rx="8" ry="6" fill="#f59e0b" />
        </g>

        {/* ========================================================= */}
        {/* CHARACTER 2: MI AMOR THE SEA LION (RIGHT)                 */}
        {/* ========================================================= */}
        <g id="miamor-sealion" className="transition-transform duration-300">
          {/* Sea Lion Rear Flippers / Tail */}
          <path
            d="M 180 115 Q 198 120 205 110 Q 195 105 178 108"
            fill="#a5b4fc"
          />
          <circle cx="205" cy="109" r="6" fill="#818cf8" />
          <circle cx="198" cy="116" r="5" fill="#818cf8" />

          {/* Sea Lion Body (Chubby, smooth) */}
          <path
            d="M 145 120 C 135 110 132 85 142 70 C 150 56 168 55 176 68 C 185 82 188 105 178 120 Z"
            fill="url(#sealBody)"
          />

          {/* Sea Lion Pale Tummy */}
          <ellipse cx="155" cy="98" rx="14" ry="18" fill="#eef2ff" opacity="0.9" />

          {/* Sea Lion Snout / Muzzle */}
          <ellipse cx="148" cy="76" rx="12" ry="9" fill="#ffffff" />
          {/* Tiny Cute Black Nose */}
          <ellipse cx="146" cy="72" rx="4.5" ry="3" fill="#1e1b4b" />
          {/* Smile */}
          <path
            d="M 142 77 Q 146 81 150 77"
            stroke="#1e1b4b"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Whiskers */}
          <path d="M 137 75 L 129 74 M 137 78 L 128 79" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 155 75 L 163 74 M 155 78 L 164 79" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />

          {/* Sea Lion Eyes (Happy smiling closed curves) */}
          <path
            d="M 140 66 Q 144 61 148 66"
            stroke="#1e1b4b"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 154 66 Q 158 61 162 66"
            stroke="#1e1b4b"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cute Rosy Blushing Cheeks */}
          <ellipse cx="138" cy="72" rx="5" ry="3.5" fill="#fda4af" opacity="0.85" />
          <ellipse cx="162" cy="72" rx="5" ry="3.5" fill="#fda4af" opacity="0.85" />

          {/* Sea Lion Front Flipper (Resting cute on front) */}
          <ellipse cx="138" cy="98" rx="9" ry="16" fill="#818cf8" transform="rotate(30 138 98)" />
          {/* Cute Flower/Bow on Sea Lion's head */}
          <circle cx="166" cy="55" r="4.5" fill="#f43f5e" />
          <circle cx="166" cy="55" r="2" fill="#fef08a" />
        </g>

        {/* ========================================================= */}
        {/* CENTER: FLOATING LOVE HEART                               */}
        {/* ========================================================= */}
        <g transform="translate(112, 45)">
          <path
            d="M 8 3 C 8 0 4 -2 1 1 C -2 -2 -6 0 -6 3 C -6 7 1 12 1 12 C 1 12 8 7 8 3 Z"
            fill="#f43f5e"
            filter="url(#heartGlow)"
            className="animate-heart-pulse origin-center"
          />
          <circle cx="-1" cy="2" r="1" fill="#ffffff" opacity="0.8" />
        </g>
      </svg>

      {/* Mascots Name Tag */}
      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-bold text-rose-700/80 bg-white/70 px-2.5 py-0.5 rounded-full border border-rose-200/60 shadow-2xs">
        <span>🦁 {partner1Name}</span>
        <span className="text-rose-400">♥</span>
        <span>🦭 {partner2Name}</span>
      </div>
    </div>
  );
};
