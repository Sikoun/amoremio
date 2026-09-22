'use client';

import React from 'react';

interface LoveEnvelopeProps {
  status: 'locked' | 'waiting' | 'revealed';
  className?: string;
}

export const LoveEnvelope: React.FC<LoveEnvelopeProps> = ({ status, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 200 130"
        className="w-full max-w-[190px] h-auto drop-shadow-sm transition-all duration-500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Envelope Body Gradient */}
          <linearGradient id="envBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="50%" stopColor="#ffe4e6" />
            <stop offset="100%" stopColor="#fecdd3" />
          </linearGradient>

          {/* Envelope Flap Gradient */}
          <linearGradient id="envFlap" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe4e6" />
            <stop offset="100%" stopColor="#fda4af" />
          </linearGradient>

          {/* Wax Seal Gradient */}
          <linearGradient id="waxRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="waxGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Letter Parchment */}
          <linearGradient id="parchment" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fffbeb" />
          </linearGradient>
        </defs>

        {/* Envelope Base Shadow */}
        <ellipse cx="100" cy="120" rx="75" ry="7" fill="rgba(244, 63, 94, 0.1)" />

        {/* ========================================================= */}
        {/* REVEALED STATE: PARCHMENT LETTERS SLIDING OUT             */}
        {/* ========================================================= */}
        {status === 'revealed' && (
          <g className="transition-all duration-700 animate-in fade-in slide-in-from-bottom-3">
            {/* Letter 1 (Left tilted) */}
            <g transform="translate(48, 12) rotate(-8 30 40)">
              <rect
                x="0"
                y="0"
                width="56"
                height="70"
                rx="6"
                fill="url(#parchment)"
                stroke="#fed7aa"
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
              />
              <path d="M 10 16 L 46 16 M 10 26 L 40 26 M 10 36 L 46 36 M 10 46 L 34 46" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <circle cx="28" cy="56" r="3" fill="#f43f5e" />
            </g>

            {/* Letter 2 (Right tilted) */}
            <g transform="translate(94, 10) rotate(8 30 40)">
              <rect
                x="0"
                y="0"
                width="56"
                height="70"
                rx="6"
                fill="url(#parchment)"
                stroke="#fed7aa"
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
              />
              <path d="M 10 16 L 46 16 M 10 26 L 38 26 M 10 36 L 46 36 M 10 46 L 30 46" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <circle cx="28" cy="56" r="3" fill="#a855f7" />
            </g>

            {/* Sparkles around open letters */}
            <path d="M 32 20 L 35 12 L 38 20 L 46 23 L 38 26 L 35 34 L 32 26 L 24 23 Z" fill="#fbbf24" opacity="0.9" />
            <path d="M 160 22 L 162 16 L 164 22 L 170 24 L 164 26 L 162 32 L 160 26 L 154 24 Z" fill="#fbbf24" opacity="0.9" />
          </g>
        )}

        {/* ========================================================= */}
        {/* ENVELOPE BODY                                             */}
        {/* ========================================================= */}
        {/* Back Pocket */}
        <path
          d="M 25 45 L 100 85 L 175 45 L 175 112 Q 175 118 168 118 L 32 118 Q 25 118 25 112 Z"
          fill="url(#envBody)"
          stroke="#fecdd3"
          strokeWidth="1.5"
        />

        {/* Side folds */}
        <path d="M 25 45 L 90 85 L 25 118 Z" fill="#ffe4e6" opacity="0.7" />
        <path d="M 175 45 L 110 85 L 175 118 Z" fill="#ffe4e6" opacity="0.7" />

        {/* Bottom fold */}
        <path
          d="M 25 118 L 100 70 L 175 118 Z"
          fill="#fecdd3"
          opacity="0.85"
          stroke="#fda4af"
          strokeWidth="1"
        />

        {/* ========================================================= */}
        {/* ENVELOPE FLAP: CLOSED VS OPEN                             */}
        {/* ========================================================= */}
        {status !== 'revealed' ? (
          // CLOSED FLAP (Triangle pointing down)
          <path
            d="M 25 45 Q 26 42 32 42 L 168 42 Q 174 42 175 45 L 104 88 Q 100 90 96 88 Z"
            fill="url(#envFlap)"
            stroke="#fda4af"
            strokeWidth="1.5"
            filter="drop-shadow(0 2px 3px rgba(244, 63, 94, 0.15))"
          />
        ) : (
          // OPEN FLAP (Triangle pointing up)
          <path
            d="M 25 45 Q 26 48 32 48 L 168 48 Q 174 48 175 45 L 104 15 Q 100 13 96 15 Z"
            fill="#ffe4e6"
            stroke="#fecdd3"
            strokeWidth="1.5"
          />
        )}

        {/* ========================================================= */}
        {/* WAX SEAL (LOCKED & WAITING STATES)                        */}
        {/* ========================================================= */}
        {status !== 'revealed' && (
          <g transform="translate(100, 85)" className="cursor-pointer transition-transform hover:scale-110">
            {/* Wax Spill Rim */}
            <circle
              cx="0"
              cy="0"
              r="17"
              fill={status === 'waiting' ? 'url(#waxGold)' : 'url(#waxRed)'}
              filter="drop-shadow(0 3px 5px rgba(190, 18, 60, 0.35))"
            />
            {/* Wax Inner Stamp */}
            <circle
              cx="0"
              cy="0"
              r="12.5"
              fill={status === 'waiting' ? '#d97706' : '#be123c'}
              stroke={status === 'waiting' ? '#fef08a' : '#fda4af'}
              strokeWidth="1"
            />

            {status === 'waiting' ? (
              // Hourglass / Clock symbol
              <g transform="translate(-5, -6)">
                <path
                  d="M 1 1 L 9 1 L 5 6 L 9 11 L 1 11 L 5 6 Z"
                  fill="#ffffff"
                  className="animate-pulse"
                />
              </g>
            ) : (
              // Heart with Paw-print Stamp
              <g transform="translate(0, 0)">
                {/* Heart */}
                <path
                  d="M 0 -4 C -2.5 -7 -6.5 -5 -6.5 -1.5 C -6.5 2.5 0 6 0 6 C 0 6 6.5 2.5 6.5 -1.5 C 6.5 -5 2.5 -7 0 -4 Z"
                  fill="#ffffff"
                />
                {/* Paw print center dots */}
                <circle cx="-2" cy="-1.5" r="0.9" fill="#be123c" />
                <circle cx="2" cy="-1.5" r="0.9" fill="#be123c" />
                <circle cx="0" cy="1" r="1.3" fill="#be123c" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
