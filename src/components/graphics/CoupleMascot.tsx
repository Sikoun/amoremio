'use client';

import React, { useState } from 'react';
import { PetType, PET_EMOJIS, PetCustomization, PET_COLOR_PALETTES } from '@/lib/types';
import { PetAccessories } from './PetAccessories';
import { haptic } from '@/lib/haptics';

interface AnimalFigureProps {
  pet: PetType;
  customPet?: PetCustomization;
  isLeft?: boolean;
  customCx?: number;
  customCy?: number;
  customBodyY?: number;
  idPrefix?: string;
}

export const AnimalFigure: React.FC<AnimalFigureProps> = ({
  pet,
  customPet,
  isLeft = true,
  customCx,
  customCy,
  customBodyY,
  idPrefix,
}) => {
  const cx = customCx !== undefined ? customCx : isLeft ? 78 : 162;
  const cy = customCy !== undefined ? customCy : 76;
  const bodyY = customBodyY !== undefined ? customBodyY : 98;
  const flip = !isLeft ? -1 : 1;
  const prefix = idPrefix || (isLeft ? 'p1' : 'p2');

  const palettes = PET_COLOR_PALETTES[pet] || [];
  const palette = palettes.find((p) => p.id === customPet?.colorShade) || palettes[0] || {
    id: 'default',
    primary: '#c7d2fe',
    secondary: '#a5b4fc',
    accent: '#818cf8',
  };

  const headAcc = customPet?.headAccessory || 'none';
  const neckAcc = customPet?.neckAccessory || 'none';

  return (
    <g id={`figure-${pet}-${prefix}`}>
      {/* Local Gradients for this character instance */}
      <defs>
        <linearGradient id={`${prefix}-bodyGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.primary} />
          <stop offset="100%" stopColor={palette.secondary} />
        </linearGradient>
        <linearGradient id={`${prefix}-maneGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.secondary} />
          <stop offset="100%" stopColor={palette.accent} />
        </linearGradient>
      </defs>

      {/* BACK ACCESSORIES LAYER (behind skull & neck) */}
      <PetAccessories
        species={pet}
        head={headAcc}
        neck={neckAcc}
        cx={cx}
        cy={cy}
        flip={flip}
        layer="back"
      />

      {/* ANIMAL BODY BY SPECIES */}
      {pet === 'sealion' && (
        <g id={`${prefix}-sealion`} className="transition-transform duration-300">
          {/* Rear Flippers */}
          <path
            d={`M ${cx + 25 * flip} 115 Q ${cx + 42 * flip} 120 ${cx + 48 * flip} 110 Q ${cx + 38 * flip} 105 ${cx + 22 * flip} 108`}
            fill={palette.secondary}
          />
          <circle cx={cx + 48 * flip} cy="109" r="5" fill={palette.accent} />
          <circle cx={cx + 42 * flip} cy="116" r="4" fill={palette.accent} />

          {/* Chubby Body */}
          <path
            d={`M ${cx - 10 * flip} 120 C ${cx - 20 * flip} 110 ${cx - 22 * flip} 85 ${cx - 12 * flip} 70 C ${cx - 5 * flip} 56 ${cx + 14 * flip} 55 ${cx + 22 * flip} 68 C ${cx + 30 * flip} 82 ${cx + 32 * flip} 105 ${cx + 22 * flip} 120 Z`}
            fill={`url(#${prefix}-bodyGrad)`}
          />
          {/* Pale Tummy */}
          <ellipse cx={cx + 4 * flip} cy={bodyY} rx="14" ry="17" fill="#ffffff" opacity="0.85" />

          {/* Snout */}
          <ellipse cx={cx - 3 * flip} cy={cy} rx="12" ry="9" fill="#ffffff" />
          <ellipse cx={cx - 5 * flip} cy={cy - 4} rx="4.5" ry="3" fill="#1e1b4b" />
          <path
            d={`M ${cx - 9 * flip} ${cy + 1} Q ${cx - 5 * flip} ${cy + 5} ${cx - 1 * flip} ${cy + 1}`}
            stroke="#1e1b4b"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Whiskers */}
          <path
            d={`M ${cx - 14 * flip} ${cy - 1} L ${cx - 22 * flip} ${cy - 2} M ${cx - 14 * flip} ${cy + 2} L ${cx - 23 * flip} ${cy + 3}`}
            stroke={palette.accent}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx + 4 * flip} ${cy - 1} L ${cx + 12 * flip} ${cy - 2} M ${cx + 4 * flip} ${cy + 2} L ${cx + 13 * flip} ${cy + 3}`}
            stroke={palette.accent}
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Eyes */}
          <path
            d={`M ${cx - 11 * flip} ${cy - 10} Q ${cx - 7 * flip} ${cy - 15} ${cx - 3 * flip} ${cy - 10}`}
            stroke="#1e1b4b"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx + 3 * flip} ${cy - 10} Q ${cx + 7 * flip} ${cy - 15} ${cx + 11 * flip} ${cy - 10}`}
            stroke="#1e1b4b"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Rosy Cheeks */}
          <ellipse cx={cx - 13 * flip} cy={cy - 4} rx="4.5" ry="3" fill="#fda4af" opacity="0.85" />
          <ellipse cx={cx + 11 * flip} cy={cy - 4} rx="4.5" ry="3" fill="#fda4af" opacity="0.85" />

          {/* Front Flipper */}
          <ellipse
            cx={cx - 13 * flip}
            cy={bodyY}
            rx="8"
            ry="15"
            fill={palette.accent}
            transform={`rotate(${25 * flip} ${cx - 13 * flip} ${bodyY})`}
          />
        </g>
      )}

      {pet === 'lion' && (
        <g id={`${prefix}-lion`} className="transition-transform duration-300">
          {/* Tail */}
          <path
            d={`M ${cx - 28 * flip} 110 Q ${cx - 48 * flip} 115 ${cx - 50 * flip} 95 Q ${cx - 52 * flip} 80 ${cx - 44 * flip} 75`}
            stroke={palette.accent}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={cx - 44 * flip} cy="74" r="6" fill={palette.accent} />

          {/* Mane */}
          <circle cx={cx} cy={cy} r="40" fill={`url(#${prefix}-maneGrad)`} />
          {/* Body */}
          <ellipse cx={cx + 2 * flip} cy={bodyY} rx="25" ry="23" fill={`url(#${prefix}-bodyGrad)`} />
          <ellipse cx={cx + 4 * flip} cy={bodyY + 2} rx="15" ry="14" fill="#fef3c7" opacity="0.9" />

          {/* Head */}
          <circle cx={cx} cy={cy} r="28" fill={`url(#${prefix}-bodyGrad)`} />

          {/* Ears */}
          <circle cx={cx - 20 * flip} cy={cy - 20} r="9" fill={palette.secondary} />
          <circle cx={cx - 20 * flip} cy={cy - 20} r="5" fill="#fef3c7" />
          <circle cx={cx + 20 * flip} cy={cy - 20} r="9" fill={palette.secondary} />
          <circle cx={cx + 20 * flip} cy={cy - 20} r="5" fill="#fef3c7" />

          {/* Snout */}
          <ellipse cx={cx} cy={cy + 5} rx="13" ry="9" fill="#fef3c7" />
          <path d={`M ${cx - 4} ${cy - 1} L ${cx + 4} ${cy - 1} L ${cx} ${cy + 3} Z`} fill="#78350f" />
          <path
            d={`M ${cx - 4} ${cy + 6} Q ${cx} ${cy + 10} ${cx + 4} ${cy + 6}`}
            stroke="#78350f"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes */}
          <path
            d={`M ${cx - 12} ${cy - 5} Q ${cx - 8} ${cy - 10} ${cx - 4} ${cy - 5}`}
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx + 4} ${cy - 5} Q ${cx + 8} ${cy - 10} ${cx + 12} ${cy - 5}`}
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheeks */}
          <ellipse cx={cx - 14} cy={cy + 1} rx="4.5" ry="3" fill="#fda4af" opacity="0.85" />
          <ellipse cx={cx + 14} cy={cy + 1} rx="4.5" ry="3" fill="#fda4af" opacity="0.85" />

          {/* Paws */}
          <ellipse cx={cx - 10} cy="118" rx="7" ry="5.5" fill={palette.accent} />
          <ellipse cx={cx + 10} cy="118" rx="7" ry="5.5" fill={palette.accent} />
        </g>
      )}

      {pet === 'bear' && (
        <g id={`${prefix}-bear`}>
          {/* Bear Body */}
          <ellipse cx={cx} cy={bodyY} rx="26" ry="24" fill={palette.primary} />
          <ellipse cx={cx} cy={bodyY + 2} rx="16" ry="15" fill={palette.secondary} />

          {/* Bear Head */}
          <circle cx={cx} cy={cy} r="28" fill={palette.primary} />
          {/* Ears */}
          <circle cx={cx - 20} cy={cy - 20} r="10" fill={palette.primary} />
          <circle cx={cx - 20} cy={cy - 20} r="5" fill={palette.secondary} />
          <circle cx={cx + 20} cy={cy - 20} r="10" fill={palette.primary} />
          <circle cx={cx + 20} cy={cy - 20} r="5" fill={palette.secondary} />

          {/* Snout */}
          <ellipse cx={cx} cy={cy + 6} rx="13" ry="9" fill={palette.secondary} />
          <ellipse cx={cx} cy={cy + 2} rx="5" ry="3.5" fill="#451a03" />
          <path
            d={`M ${cx - 4} ${cy + 7} Q ${cx} ${cy + 11} ${cx + 4} ${cy + 7}`}
            stroke="#451a03"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes */}
          <circle cx={cx - 10} cy={cy - 4} r="3" fill="#451a03" />
          <circle cx={cx - 11} cy={cy - 5} r="1" fill="#ffffff" />
          <circle cx={cx + 10} cy={cy - 4} r="3" fill="#451a03" />
          <circle cx={cx + 9} cy={cy - 5} r="1" fill="#ffffff" />

          {/* Cheeks */}
          <ellipse cx={cx - 14} cy={cy + 3} rx="4.5" ry="3" fill="#fda4af" opacity="0.8" />
          <ellipse cx={cx + 14} cy={cy + 3} rx="4.5" ry="3" fill="#fda4af" opacity="0.8" />

          {/* Paws */}
          <ellipse cx={cx - 11} cy="118" rx="7.5" ry="5.5" fill={palette.accent} />
          <ellipse cx={cx + 11} cy="118" rx="7.5" ry="5.5" fill={palette.accent} />
        </g>
      )}

      {pet === 'bunny' && (
        <g id={`${prefix}-bunny`}>
          {/* Bunny Ears */}
          <ellipse cx={cx - 9} cy={cy - 30} rx="6" ry="18" fill={palette.primary} stroke={palette.secondary} strokeWidth="1.5" />
          <ellipse cx={cx - 9} cy={cy - 30} rx="3" ry="13" fill={palette.secondary} />
          <ellipse cx={cx + 9} cy={cy - 30} rx="6" ry="18" fill={palette.primary} stroke={palette.secondary} strokeWidth="1.5" />
          <ellipse cx={cx + 9} cy={cy - 30} rx="3" ry="13" fill={palette.secondary} />

          {/* Body */}
          <ellipse cx={cx} cy={bodyY} rx="24" ry="23" fill={palette.primary} stroke={palette.secondary} strokeWidth="1.5" />
          <ellipse cx={cx} cy={bodyY + 2} rx="14" ry="14" fill="#ffffff" opacity="0.8" />

          {/* Head */}
          <circle cx={cx} cy={cy} r="26" fill={palette.primary} stroke={palette.secondary} strokeWidth="1.5" />

          {/* Nose */}
          <ellipse cx={cx} cy={cy + 3} rx="3.5" ry="2.5" fill="#f43f5e" />
          <path
            d={`M ${cx - 4} ${cy + 7} Q ${cx} ${cy + 10} ${cx + 4} ${cy + 7}`}
            stroke="#9f1239"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes */}
          <path
            d={`M ${cx - 10} ${cy - 5} Q ${cx - 6} ${cy - 10} ${cx - 2} ${cy - 5}`}
            stroke="#9f1239"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx + 2} ${cy - 5} Q ${cx + 6} ${cy - 10} ${cx + 10} ${cy - 5}`}
            stroke="#9f1239"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheeks */}
          <ellipse cx={cx - 13} cy={cy + 2} rx="5" ry="3.5" fill="#fda4af" opacity="0.9" />
          <ellipse cx={cx + 13} cy={cy + 2} rx="5" ry="3.5" fill="#fda4af" opacity="0.9" />

          {/* Paws */}
          <ellipse cx={cx - 8} cy="118" rx="6.5" ry="5" fill={palette.primary} stroke={palette.secondary} strokeWidth="1" />
          <ellipse cx={cx + 8} cy="118" rx="6.5" ry="5" fill={palette.primary} stroke={palette.secondary} strokeWidth="1" />
        </g>
      )}

      {pet === 'cat' && (
        <g id={`${prefix}-cat`}>
          {/* Tail */}
          <path
            d={`M ${cx - 24 * flip} 112 Q ${cx - 40 * flip} 115 ${cx - 38 * flip} 90 Q ${cx - 36 * flip} 76 ${cx - 26 * flip} 80`}
            stroke={palette.primary}
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Ears */}
          <polygon points={`${cx - 22},${cy - 8} ${cx - 12},${cy - 28} ${cx - 2},${cy - 14}`} fill={palette.primary} />
          <polygon points={`${cx - 19},${cy - 10} ${cx - 12},${cy - 24} ${cx - 5},${cy - 15}`} fill="#fecdd3" />
          <polygon points={`${cx + 22},${cy - 8} ${cx + 12},${cy - 28} ${cx + 2},${cy - 14}`} fill={palette.primary} />
          <polygon points={`${cx + 19},${cy - 10} ${cx + 12},${cy - 24} ${cx + 5},${cy - 15}`} fill="#fecdd3" />

          {/* Body */}
          <ellipse cx={cx} cy={bodyY} rx="24" ry="23" fill={palette.primary} />
          <ellipse cx={cx} cy={bodyY + 2} rx="14" ry="14" fill={palette.secondary} />

          {/* Head */}
          <circle cx={cx} cy={cy} r="26" fill={palette.primary} />

          {/* Nose */}
          <polygon points={`${cx - 3},${cy + 2} ${cx + 3},${cy + 2} ${cx},${cy + 5}`} fill="#be123c" />
          <path
            d={`M ${cx - 4} ${cy + 7} Q ${cx} ${cy + 10} ${cx + 4} ${cy + 7}`}
            stroke="#7c2d12"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Whiskers */}
          <path
            d={`M ${cx - 12} ${cy + 4} L ${cx - 22} ${cy + 2} M ${cx - 12} ${cy + 7} L ${cx - 21} ${cy + 9}`}
            stroke={palette.accent}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx + 12} ${cy + 4} L ${cx + 22} ${cy + 2} M ${cx + 12} ${cy + 7} L ${cx + 21} ${cy + 9}`}
            stroke={palette.accent}
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Eyes */}
          <path
            d={`M ${cx - 11} ${cy - 5} Q ${cx - 7} ${cy - 10} ${cx - 3} ${cy - 5}`}
            stroke="#431407"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx + 3} ${cy - 5} Q ${cx + 7} ${cy - 10} ${cx + 11} ${cy - 5}`}
            stroke="#431407"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheeks */}
          <ellipse cx={cx - 12} cy={cy + 2} rx="4" ry="3" fill="#fda4af" opacity="0.9" />
          <ellipse cx={cx + 12} cy={cy + 2} rx="4" ry="3" fill="#fda4af" opacity="0.9" />

          {/* Paws */}
          <ellipse cx={cx - 9} cy="118" rx="6.5" ry="5" fill={palette.secondary} />
          <ellipse cx={cx + 9} cy="118" rx="6.5" ry="5" fill={palette.secondary} />
        </g>
      )}

      {pet === 'fox' && (
        <g id={`${prefix}-fox`}>
          {/* Big Bushy Tail */}
          <path
            d={`M ${cx - 25 * flip} 115 C ${cx - 50 * flip} 120 ${cx - 55 * flip} 90 ${cx - 40 * flip} 75 C ${cx - 30 * flip} 70 ${cx - 25 * flip} 85 ${cx - 20 * flip} 105 Z`}
            fill={palette.primary}
          />
          <path
            d={`M ${cx - 40 * flip} 75 C ${cx - 48 * flip} 70 ${cx - 52 * flip} 85 ${cx - 45 * flip} 95 Z`}
            fill={palette.secondary}
          />

          {/* Ears */}
          <polygon points={`${cx - 22},${cy - 8} ${cx - 14},${cy - 30} ${cx - 4},${cy - 14}`} fill={palette.accent} />
          <polygon points={`${cx - 15},${cy - 27} ${cx - 14},${cy - 30} ${cx - 10},${cy - 24}`} fill="#18181b" />
          <polygon points={`${cx - 18},${cy - 10} ${cx - 13},${cy - 23} ${cx - 6},${cy - 15}`} fill="#ffedd5" />

          <polygon points={`${cx + 22},${cy - 8} ${cx + 14},${cy - 30} ${cx + 4},${cy - 14}`} fill={palette.accent} />
          <polygon points={`${cx + 15},${cy - 27} ${cx + 14},${cy - 30} ${cx + 10},${cy - 24}`} fill="#18181b" />
          <polygon points={`${cx + 18},${cy - 10} ${cx + 13},${cy - 23} ${cx + 6},${cy - 15}`} fill="#ffedd5" />

          {/* Body */}
          <ellipse cx={cx} cy={bodyY} rx="24" ry="23" fill={palette.primary} />
          <path
            d={`M ${cx - 12} ${bodyY - 14} Q ${cx} ${bodyY - 2} ${cx + 12} ${bodyY - 14} L ${cx + 8} ${bodyY + 16} L ${cx - 8} ${bodyY + 16} Z`}
            fill={palette.secondary}
          />

          {/* Head */}
          <circle cx={cx} cy={cy} r="26" fill={palette.primary} />
          <path
            d={`M ${cx - 18} ${cy + 6} Q ${cx} ${cy + 18} ${cx + 18} ${cy + 6} L ${cx} ${cy + 15} Z`}
            fill={palette.secondary}
          />

          {/* Nose */}
          <circle cx={cx} cy={cy + 8} r="3" fill="#18181b" />

          {/* Eyes */}
          <path
            d={`M ${cx - 11} ${cy - 4} Q ${cx - 7} ${cy - 9} ${cx - 3} ${cy - 4}`}
            stroke="#431407"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx + 3} ${cy - 4} Q ${cx + 7} ${cy - 9} ${cx + 11} ${cy - 4}`}
            stroke="#431407"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheeks */}
          <ellipse cx={cx - 12} cy={cy + 2} rx="4" ry="3" fill="#fda4af" opacity="0.9" />
          <ellipse cx={cx + 12} cy={cy + 2} rx="4" ry="3" fill="#fda4af" opacity="0.9" />

          {/* Paws */}
          <ellipse cx={cx - 9} cy="118" rx="6" ry="5" fill="#18181b" />
          <ellipse cx={cx + 9} cy="118" rx="6" ry="5" fill="#18181b" />
        </g>
      )}

      {pet === 'panda' && (
        <g id={`${prefix}-panda`}>
          {/* Body */}
          <ellipse cx={cx} cy={bodyY} rx="26" ry="24" fill={palette.primary} stroke={palette.secondary} strokeWidth="1.5" />
          {/* Arms / Vest */}
          <path
            d={`M ${cx - 24} ${bodyY - 10} C ${cx - 26} ${bodyY + 10} ${cx + 26} ${bodyY + 10} ${cx + 24} ${bodyY - 10} Z`}
            fill={palette.secondary}
            opacity="0.15"
          />

          {/* Ears */}
          <circle cx={cx - 18} cy={cy - 20} r="9" fill={palette.secondary} />
          <circle cx={cx + 18} cy={cy - 20} r="9" fill={palette.secondary} />

          {/* Head */}
          <circle cx={cx} cy={cy} r="26" fill={palette.primary} stroke={palette.secondary} strokeWidth="1.5" />

          {/* Eye Patches */}
          <ellipse
            cx={cx - 9}
            cy={cy - 4}
            rx="6.5"
            ry="8"
            fill={palette.secondary}
            transform={`rotate(-15 ${cx - 9} ${cy - 4})`}
          />
          <ellipse
            cx={cx + 9}
            cy={cy - 4}
            rx="6.5"
            ry="8"
            fill={palette.secondary}
            transform={`rotate(15 ${cx + 9} ${cy - 4})`}
          />

          {/* Eyes */}
          <circle cx={cx - 8} cy={cy - 4} r="2" fill="#ffffff" />
          <circle cx={cx + 8} cy={cy - 4} r="2" fill="#ffffff" />

          {/* Nose */}
          <ellipse cx={cx} cy={cy + 4} rx="4" ry="2.5" fill={palette.secondary} />
          <path
            d={`M ${cx - 4} ${cy + 8} Q ${cx} ${cy + 11} ${cx + 4} ${cy + 8}`}
            stroke={palette.secondary}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheeks */}
          <ellipse cx={cx - 15} cy={cy + 3} rx="4" ry="3" fill="#fda4af" opacity="0.9" />
          <ellipse cx={cx + 15} cy={cy + 3} rx="4" ry="3" fill="#fda4af" opacity="0.9" />

          {/* Paws */}
          <ellipse cx={cx - 10} cy="118" rx="7" ry="5.5" fill={palette.secondary} />
          <ellipse cx={cx + 10} cy="118" rx="7" ry="5.5" fill={palette.secondary} />
        </g>
      )}

      {pet === 'penguin' && (
        <g id={`${prefix}-penguin`}>
          {/* Penguin Body (Tuxedo) */}
          <ellipse cx={cx} cy={bodyY - 4} rx="24" ry="28" fill={palette.primary} />
          {/* Belly */}
          <ellipse cx={cx} cy={bodyY - 2} rx="15" ry="22" fill={palette.secondary} />

          {/* Flippers */}
          <ellipse
            cx={cx - 20}
            cy={bodyY}
            rx="5.5"
            ry="14"
            fill={palette.primary}
            transform={`rotate(20 ${cx - 20} ${bodyY})`}
          />
          <ellipse
            cx={cx + 20}
            cy={bodyY}
            rx="5.5"
            ry="14"
            fill={palette.primary}
            transform={`rotate(-20 ${cx + 20} ${bodyY})`}
          />

          {/* Eyes */}
          <circle cx={cx - 7} cy={cy - 8} r="3" fill={palette.primary} />
          <circle cx={cx - 8} cy={cy - 9} r="1" fill="#ffffff" />
          <circle cx={cx + 7} cy={cy - 8} r="3" fill={palette.primary} />
          <circle cx={cx + 6} cy={cy - 9} r="1" fill="#ffffff" />

          {/* Beak */}
          <polygon points={`${cx - 5},${cy - 2} ${cx + 5},${cy - 2} ${cx},${cy + 4}`} fill={palette.accent} />

          {/* Cheeks */}
          <ellipse cx={cx - 12} cy={cy - 2} rx="4" ry="3" fill="#fda4af" opacity="0.9" />
          <ellipse cx={cx + 12} cy={cy - 2} rx="4" ry="3" fill="#fda4af" opacity="0.9" />

          {/* Webbed Feet */}
          <ellipse cx={cx - 8} cy="118" rx="7" ry="4" fill={palette.accent} />
          <ellipse cx={cx + 8} cy="118" rx="7" ry="4" fill={palette.accent} />
        </g>
      )}

      {/* FRONT ACCESSORIES OVERLAY LAYER */}
      <PetAccessories
        species={pet}
        head={headAcc}
        neck={neckAcc}
        cx={cx}
        cy={cy}
        flip={flip}
        layer="front"
      />
    </g>
  );
};

export const SinglePetPreview: React.FC<{
  customPet: PetCustomization;
  className?: string;
  isBouncing?: boolean;
}> = ({ customPet, className = '', isBouncing = false }) => {
  return (
    <svg
      viewBox="0 0 200 145"
      className={`w-full max-w-[210px] h-auto drop-shadow-md transition-transform duration-300 ${
        isBouncing ? 'scale-105' : 'hover:scale-[1.02]'
      } ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Spotlight Glow Behind Mascot */}
      <circle cx="100" cy="75" r="55" fill="rgba(254, 205, 211, 0.25)" />
      {/* Ground Shadow */}
      <ellipse cx="100" cy="128" rx="55" ry="9" fill="rgba(244, 63, 94, 0.12)" />

      {/* Centered Single Pet */}
      <AnimalFigure
        pet={customPet.species}
        customPet={customPet}
        customCx={100}
        customCy={76}
        customBodyY={98}
        isLeft={true}
        idPrefix="preview"
      />
    </svg>
  );
};

export interface CoupleMascotProps {
  partner1Name?: string;
  partner2Name?: string;
  partner1Pet?: PetType;
  partner2Pet?: PetType;
  partner1CustomPet?: PetCustomization;
  partner2CustomPet?: PetCustomization;
  onOpenStudio?: () => void;
  className?: string;
}

export const CoupleMascot: React.FC<CoupleMascotProps> = ({
  partner1Name = 'Gaspar',
  partner2Name = 'Mi Amor',
  partner1Pet = 'sealion',
  partner2Pet = 'lion',
  partner1CustomPet,
  partner2CustomPet,
  onOpenStudio,
  className = '',
}) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [heartsCount, setHeartsCount] = useState<number[]>([]);

  // Resolve customPet fallbacks
  const p1Custom: PetCustomization = partner1CustomPet || {
    species: partner1Pet,
    colorShade: 'default',
    headAccessory: 'sprout',
    neckAccessory: 'heart_locket',
  };

  const p2Custom: PetCustomization = partner2CustomPet || {
    species: partner2Pet,
    colorShade: 'default',
    headAccessory: 'crown',
    neckAccessory: 'bowtie',
  };

  const handleTap = () => {
    haptic.heartbeat();
    setIsBouncing(true);
    setHeartsCount((prev) => [...prev.slice(-4), Date.now()]);
    setTimeout(() => setIsBouncing(false), 600);
  };

  const p1Emoji = PET_EMOJIS[p1Custom.species] || '🦭';
  const p2Emoji = PET_EMOJIS[p2Custom.species] || '🦁';

  return (
    <div
      onClick={handleTap}
      role="button"
      tabIndex={0}
      title="Tap for love, or click Customize Pets ✨"
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
          <filter id="heartGlowMascot" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow Ground */}
        <ellipse cx="120" cy="125" rx="90" ry="10" fill="rgba(244, 63, 94, 0.08)" />

        {/* LEFT CHARACTER: Partner 1 */}
        <AnimalFigure
          pet={p1Custom.species}
          customPet={p1Custom}
          isLeft={true}
          idPrefix="mascot-p1"
        />

        {/* RIGHT CHARACTER: Partner 2 */}
        <AnimalFigure
          pet={p2Custom.species}
          customPet={p2Custom}
          isLeft={false}
          idPrefix="mascot-p2"
        />

        {/* CENTER: Floating Pulsing Heart */}
        <g transform="translate(112, 45)">
          <path
            d="M 8 3 C 8 0 4 -2 1 1 C -2 -2 -6 0 -6 3 C -6 7 1 12 1 12 C 1 12 8 7 8 3 Z"
            fill="#f43f5e"
            filter="url(#heartGlowMascot)"
            className="animate-heart-pulse origin-center"
          />
          <circle cx="-1" cy="2" r="1" fill="#ffffff" opacity="0.8" />
        </g>
      </svg>

      {/* Name Tag Pill */}
      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-bold text-rose-700/80 bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-rose-200/60 shadow-2xs">
        <span>{p1Emoji} {partner1Name}</span>
        <span className="text-rose-400">♥</span>
        <span>{p2Emoji} {partner2Name}</span>
      </div>

      {/* Quick Customize Button */}
      {onOpenStudio && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            haptic.lightTap();
            onOpenStudio();
          }}
          className="mt-1 text-[10px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-2 py-0.5 rounded-full flex items-center gap-1 transition active:scale-95 shadow-2xs"
          title="Open Character Customizer"
        >
          <span>🎨 Style Pets</span>
        </button>
      )}
    </div>
  );
};
