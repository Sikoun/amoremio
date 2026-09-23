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
          {/* Dynamic Tail with Majestic Flame Brush Tuft */}
          <path
            d={`M ${cx - 24 * flip} 108 C ${cx - 44 * flip} 112 ${cx - 52 * flip} 95 ${cx - 42 * flip} 76`}
            stroke={palette.accent}
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx - 42 * flip} 76 C ${cx - 48 * flip} 70 ${cx - 47 * flip} 58 ${cx - 39 * flip} 56 C ${cx - 35 * flip} 64 ${cx - 33 * flip} 71 ${cx - 42 * flip} 76 Z`}
            fill={palette.accent}
          />
          <path
            d={`M ${cx - 41 * flip} 73 C ${cx - 45 * flip} 68 ${cx - 44 * flip} 60 ${cx - 39 * flip} 58 C ${cx - 36 * flip} 64 ${cx - 35 * flip} 69 ${cx - 41 * flip} 73 Z`}
            fill={palette.secondary}
            opacity="0.85"
          />

          {/* Sculpted Outer Mane with Dynamic Layered Locks */}
          <path
            d={`M ${cx} ${cy - 41} 
                Q ${cx + 12} ${cy - 42} ${cx + 20} ${cy - 34} 
                L ${cx + 26} ${cy - 38} 
                Q ${cx + 28} ${cy - 24} ${cx + 36} ${cy - 18} 
                L ${cx + 42} ${cy - 19} 
                Q ${cx + 39} ${cy - 4} ${cx + 42} ${cy + 6} 
                L ${cx + 45} ${cy + 11} 
                Q ${cx + 37} ${cy + 20} ${cx + 33} ${cy + 26} 
                L ${cx + 33} ${cy + 32} 
                Q ${cx + 22} ${cy + 36} ${cx + 13} ${cy + 35} 
                L ${cx + 7} ${cy + 40} 
                Q ${cx} ${cy + 35} ${cx - 7} ${cy + 40} 
                L ${cx - 13} ${cy + 35} 
                Q ${cx - 22} ${cy + 36} ${cx - 33} ${cy + 32} 
                L ${cx - 33} ${cy + 26} 
                Q ${cx - 37} ${cy + 20} ${cx - 45} ${cy + 11} 
                L ${cx - 42} ${cy + 6} 
                Q ${cx - 39} ${cy - 4} ${cx - 42} ${cy - 19} 
                L ${cx - 36} ${cy - 18} 
                Q ${cx - 28} ${cy - 24} ${cx - 26} ${cy - 38} 
                L ${cx - 20} ${cy - 34} 
                Q ${cx - 12} ${cy - 42} ${cx} ${cy - 41} Z`}
            fill={`url(#${prefix}-maneGrad)`}
          />

          {/* Inner Mane Volume Layer */}
          <path
            d={`M ${cx} ${cy - 33} 
                Q ${cx + 16} ${cy - 31} ${cx + 26} ${cy - 17} 
                Q ${cx + 34} ${cy} ${cx + 27} ${cy + 18} 
                Q ${cx + 18} ${cy + 28} ${cx} ${cy + 30} 
                Q ${cx - 18} ${cy + 28} ${cx - 27} ${cy + 18} 
                Q ${cx - 34} ${cy} ${cx - 26} ${cy - 17} 
                Q ${cx - 16} ${cy - 31} ${cx} ${cy - 33} Z`}
            fill={palette.secondary}
            opacity="0.6"
          />

          {/* Lion Body */}
          <ellipse cx={cx + 2 * flip} cy={bodyY} rx="26" ry="24" fill={palette.primary} />
          {/* Regal Golden Cream Chest / Tummy */}
          <ellipse cx={cx + 3 * flip} cy={bodyY + 2} rx="16" ry="16" fill="#fef3c7" opacity="0.95" />
          <path
            d={`M ${cx - 9} ${bodyY - 9} Q ${cx} ${bodyY - 3} ${cx + 9} ${bodyY - 9} L ${cx + 11} ${bodyY + 13} Q ${cx} ${bodyY + 18} ${cx - 11} ${bodyY + 13} Z`}
            fill="#ffffff"
            opacity="0.5"
          />

          {/* Sculpted Feline Ears (Nestled Organically in Mane) */}
          {/* Left Ear */}
          <path
            d={`M ${cx - 28} ${cy - 12} C ${cx - 31} ${cy - 26} ${cx - 20} ${cy - 32} ${cx - 13} ${cy - 22} C ${cx - 10} ${cy - 16} ${cx - 12} ${cy - 11} ${cx - 16} ${cy - 9} Z`}
            fill={palette.primary}
            stroke={palette.accent}
            strokeWidth="1.2"
          />
          <path
            d={`M ${cx - 25} ${cy - 14} C ${cx - 27} ${cy - 24} ${cx - 19} ${cy - 28} ${cx - 15} ${cy - 20} C ${cx - 13} ${cy - 16} ${cx - 15} ${cy - 12} ${cx - 18} ${cy - 11} Z`}
            fill="#fef3c7"
          />
          <path
            d={`M ${cx - 25} ${cy - 12} Q ${cx - 19} ${cy - 16} ${cx - 15} ${cy - 10}`}
            stroke={palette.accent}
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx - 22} ${cy - 15} Q ${cx - 18} ${cy - 19} ${cx - 16} ${cy - 13}`}
            stroke="#ffffff"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.75"
            fill="none"
          />

          {/* Right Ear */}
          <path
            d={`M ${cx + 28} ${cy - 12} C ${cx + 31} ${cy - 26} ${cx + 20} ${cy - 32} ${cx + 13} ${cy - 22} C ${cx + 10} ${cy - 16} ${cx + 12} ${cy - 11} ${cx + 16} ${cy - 9} Z`}
            fill={palette.primary}
            stroke={palette.accent}
            strokeWidth="1.2"
          />
          <path
            d={`M ${cx + 25} ${cy - 14} C ${cx + 27} ${cy - 24} ${cx + 19} ${cy - 28} ${cx + 15} ${cy - 20} C ${cx + 13} ${cy - 16} ${cx + 15} ${cy - 12} ${cx + 18} ${cy - 11} Z`}
            fill="#fef3c7"
          />
          <path
            d={`M ${cx + 25} ${cy - 12} Q ${cx + 19} ${cy - 16} ${cx + 15} ${cy - 10}`}
            stroke={palette.accent}
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx + 22} ${cy - 15} Q ${cx + 18} ${cy - 19} ${cx + 16} ${cy - 13}`}
            stroke="#ffffff"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.75"
            fill="none"
          />

          {/* Lion Head */}
          <ellipse cx={cx} cy={cy} rx="24" ry="23" fill={palette.primary} />

          {/* Forehead Mane Lock Crest */}
          <path
            d={`M ${cx - 5} ${cy - 21} Q ${cx} ${cy - 26} ${cx + 5} ${cy - 21} Q ${cx} ${cy - 16} ${cx - 5} ${cy - 21} Z`}
            fill={palette.accent}
          />

          {/* Puffy Dual-Lobed Cream Muzzle */}
          <ellipse cx={cx - 6} cy={cy + 7} rx="7.2" ry="5.8" fill="#fef3c7" />
          <ellipse cx={cx + 6} cy={cy + 7} rx="7.2" ry="5.8" fill="#fef3c7" />

          {/* Regal Terracotta Nose */}
          <path
            d={`M ${cx} ${cy + 6.5} L ${cx - 4.2} ${cy + 2.8} C ${cx - 3.5} ${cy + 1.8} ${cx + 3.5} ${cy + 1.8} ${cx + 4.2} ${cy + 2.8} Z`}
            fill="#78350f"
          />
          <circle cx={cx - 1.2} cy={cy + 2.8} r="0.7" fill="#ffffff" opacity="0.6" />

          {/* Mouth Cleft & Sweet Regal Smile */}
          <line x1={cx} y1={cy + 6.5} x2={cx} y2={cy + 9} stroke="#78350f" strokeWidth="1.4" strokeLinecap="round" />
          <path
            d={`M ${cx - 4.8} ${cy + 8.8} Q ${cx - 2.4} ${cy + 11.5} ${cx} ${cy + 9.2} Q ${cx + 2.4} ${cy + 11.5} ${cx + 4.8} ${cy + 8.8}`}
            stroke="#78350f"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Whisker Freckle Dots */}
          <circle cx={cx - 8} cy={cy + 6} r="0.7" fill="#78350f" opacity="0.5" />
          <circle cx={cx - 10} cy={cy + 7.8} r="0.7" fill="#78350f" opacity="0.5" />
          <circle cx={cx + 8} cy={cy + 6} r="0.7" fill="#78350f" opacity="0.5" />
          <circle cx={cx + 10} cy={cy + 7.8} r="0.7" fill="#78350f" opacity="0.5" />

          {/* Lion Chin Beard Tuft */}
          <path
            d={`M ${cx - 3.5} ${cy + 11.8} Q ${cx} ${cy + 16} ${cx + 3.5} ${cy + 11.8} Z`}
            fill="#fef3c7"
            stroke={palette.secondary}
            strokeWidth="0.7"
          />

          {/* Expressive Warm Lion Eyes - Clean & Iconic (Less is more) */}
          <path
            d={`M ${cx - 13} ${cy - 4} Q ${cx - 8.5} ${cy - 9.5} ${cx - 4} ${cy - 4}`}
            stroke="#451a03"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx + 4} ${cy - 4} Q ${cx + 8.5} ${cy - 9.5} ${cx + 13} ${cy - 4}`}
            stroke="#451a03"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Soft Rosy Cheeks */}
          <ellipse cx={cx - 16} cy={cy + 4} rx="4.2" ry="2.8" fill="#fda4af" opacity="0.8" />
          <ellipse cx={cx + 16} cy={cy + 4} rx="4.2" ry="2.8" fill="#fda4af" opacity="0.8" />

          {/* Regal Lion Paws */}
          <ellipse cx={cx - 10} cy="118" rx="7.5" ry="5.5" fill={palette.primary} stroke={palette.secondary} strokeWidth="1" />
          <ellipse cx={cx - 10} cy="118.5" rx="3.8" ry="2.8" fill="#fef3c7" />
          <ellipse cx={cx + 10} cy="118" rx="7.5" ry="5.5" fill={palette.primary} stroke={palette.secondary} strokeWidth="1" />
          <ellipse cx={cx + 10} cy="118.5" rx="3.8" ry="2.8" fill="#fef3c7" />
        </g>
      )}

      {pet === 'bear' && (
        <g id={`${prefix}-bear`} className="transition-transform duration-300">
          {/* Broad Cozy Gentle Giant Body */}
          <ellipse cx={cx} cy={bodyY} rx="28" ry="25" fill={palette.primary} />
          {/* Warm Hearth Chest & Tummy */}
          <ellipse cx={cx} cy={bodyY + 2} rx="17" ry="17" fill={palette.secondary} />
          {/* Scruffy Chest Fur Fluff */}
          <path
            d={`M ${cx - 11} ${bodyY - 11} Q ${cx} ${bodyY - 4} ${cx + 11} ${bodyY - 11} L ${cx + 13} ${bodyY + 13} Q ${cx} ${bodyY + 19} ${cx - 13} ${bodyY + 13} Z`}
            fill={palette.secondary}
            opacity="0.9"
          />

          {/* Furry Mountain Bear Ears (Stout & Nestled) */}
          {/* Left Ear */}
          <ellipse cx={cx - 20} cy={cy - 18} rx="9.5" ry="8.5" fill={palette.primary} stroke={palette.accent} strokeWidth="1" />
          <ellipse cx={cx - 20} cy={cy - 18} rx="5.5" ry="5" fill={palette.secondary} />
          <path d={`M ${cx - 23} ${cy - 17} Q ${cx - 20} ${cy - 20} ${cx - 17} ${cy - 17}`} stroke={palette.accent} strokeWidth="1" strokeLinecap="round" opacity="0.7" fill="none" />

          {/* Right Ear */}
          <ellipse cx={cx + 20} cy={cy - 18} rx="9.5" ry="8.5" fill={palette.primary} stroke={palette.accent} strokeWidth="1" />
          <ellipse cx={cx + 20} cy={cy - 18} rx="5.5" ry="5" fill={palette.secondary} />
          <path d={`M ${cx + 17} ${cy - 17} Q ${cx + 20} ${cy - 20} ${cx + 23} ${cy - 17}`} stroke={palette.accent} strokeWidth="1" strokeLinecap="round" opacity="0.7" fill="none" />

          {/* Broad Cozy Head with Scruffy Beard / Cheek Tufts (Hagrid Silhouette) */}
          <path
            d={`M ${cx - 24} ${cy - 17} 
                C ${cx - 14} ${cy - 23} ${cx + 14} ${cy - 23} ${cx + 24} ${cy - 17} 
                C ${cx + 29} ${cy - 7} ${cx + 28} ${cy + 3} ${cx + 26} ${cy + 8} 
                L ${cx + 31} ${cy + 13} 
                L ${cx + 25} ${cy + 16} 
                L ${cx + 28} ${cy + 21} 
                Q ${cx + 16} ${cy + 27} ${cx} ${cy + 28} 
                Q ${cx - 16} ${cy + 27} ${cx - 28} ${cy + 21} 
                L ${cx - 25} ${cy + 16} 
                L ${cx - 31} ${cy + 13} 
                L ${cx - 26} ${cy + 8} 
                C ${cx - 28} ${cy + 3} ${cx - 29} ${cy - 7} ${cx - 24} ${cy - 17} Z`}
            fill={palette.primary}
          />
          {/* Cozy Chin Beard Scruff Details */}
          <path
            d={`M ${cx - 12} ${cy + 22} Q ${cx} ${cy + 26} ${cx + 12} ${cy + 22}`}
            stroke={palette.accent}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
            fill="none"
          />
          <path
            d={`M ${cx - 6} ${cy + 24} Q ${cx} ${cy + 27} ${cx + 6} ${cy + 24}`}
            stroke={palette.accent}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
            fill="none"
          />

          {/* Broad Sturdy Muzzle */}
          <ellipse cx={cx} cy={cy + 7} rx="15" ry="10.5" fill={palette.secondary} />

          {/* Broad Leathery Dark Bear Nose */}
          <path
            d={`M ${cx - 6} ${cy + 3} C ${cx - 7} ${cy + 1} ${cx + 7} ${cy + 1} ${cx + 6} ${cy + 3} C ${cx + 4.5} ${cy + 8} ${cx} ${cy + 8.5} ${cx - 4.5} ${cy + 8} Z`}
            fill="#291809"
          />
          {/* Leathery Nose Top Sheen */}
          <path
            d={`M ${cx - 3.5} ${cy + 2.8} Q ${cx} ${cy + 2} ${cx + 3.5} ${cy + 2.8}`}
            stroke="#ffffff"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.45"
            fill="none"
          />

          {/* Gentle Giant Reassuring Smile */}
          <line x1={cx} y1={cy + 8.5} x2={cx} y2={cy + 11.5} stroke="#451a03" strokeWidth="1.6" />
          <path
            d={`M ${cx - 6} ${cy + 10.5} Q ${cx - 3} ${cy + 14} ${cx} ${cy + 11.5} Q ${cx + 3} ${cy + 14} ${cx + 6} ${cy + 10.5}`}
            stroke="#451a03"
            strokeWidth="1.7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Honest Whisker Freckles */}
          <circle cx={cx - 9.5} cy={cy + 7.5} r="0.8" fill="#78350f" opacity="0.5" />
          <circle cx={cx + 9.5} cy={cy + 7.5} r="0.8" fill="#78350f" opacity="0.5" />

          {/* Warm Soulful Eyes (Gentle Giant / Hagrid Vibe - No Anime Eyes) */}
          {/* Left Warm Eye */}
          <path
            d={`M ${cx - 14} ${cy - 1} C ${cx - 13} ${cy - 5} ${cx - 7} ${cy - 5} ${cx - 6} ${cy - 1}`}
            stroke="#291809"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx={cx - 10} cy={cy - 1} rx="3.2" ry="3.5" fill="#291809" />
          {/* Friendly Smile Crinkle */}
          <path
            d={`M ${cx - 14} ${cy} Q ${cx - 16} ${cy - 1} ${cx - 15} ${cy - 3}`}
            stroke="#78350f"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.6"
            fill="none"
          />
          {/* Single Warm Pin-Glint */}
          <circle cx={cx - 10.8} cy={cy - 2.2} r="0.9" fill="#ffffff" />
          {/* Bushy Warm Eyebrow */}
          <path
            d={`M ${cx - 15} ${cy - 7} Q ${cx - 10} ${cy - 11} ${cx - 5} ${cy - 8.5}`}
            stroke="#451a03"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right Warm Eye */}
          <path
            d={`M ${cx + 6} ${cy - 1} C ${cx + 7} ${cy - 5} ${cx + 13} ${cy - 5} ${cx + 14} ${cy - 1}`}
            stroke="#291809"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx={cx + 10} cy={cy - 1} rx="3.2" ry="3.5" fill="#291809" />
          {/* Friendly Smile Crinkle */}
          <path
            d={`M ${cx + 14} ${cy} Q ${cx + 16} ${cy - 1} ${cx + 15} ${cy - 3}`}
            stroke="#78350f"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.6"
            fill="none"
          />
          {/* Single Warm Pin-Glint */}
          <circle cx={cx + 9.2} cy={cy - 2.2} r="0.9" fill="#ffffff" />
          {/* Bushy Warm Eyebrow */}
          <path
            d={`M ${cx + 5} ${cy - 8.5} Q ${cx + 10} ${cy - 11} ${cx + 15} ${cy - 7}`}
            stroke="#451a03"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Warm Hearth Cheeks */}
          <ellipse cx={cx - 16} cy={cy + 5} rx="4" ry="2.8" fill="#fda4af" opacity="0.75" />
          <ellipse cx={cx + 16} cy={cy + 5} rx="4" ry="2.8" fill="#fda4af" opacity="0.75" />

          {/* Protective Gentle Giant Paws */}
          <ellipse cx={cx - 11} cy="118" rx="8.5" ry="6" fill={palette.primary} stroke={palette.accent} strokeWidth="1" />
          <ellipse cx={cx - 11} cy="118.5" rx="4.5" ry="3.2" fill={palette.accent} />
          <circle cx={cx - 15} cy="115.5" r="1.4" fill={palette.accent} />
          <circle cx={cx - 11} cy="114" r="1.5" fill={palette.accent} />
          <circle cx={cx - 7} cy="115.5" r="1.4" fill={palette.accent} />

          <ellipse cx={cx + 11} cy="118" rx="8.5" ry="6" fill={palette.primary} stroke={palette.accent} strokeWidth="1" />
          <ellipse cx={cx + 11} cy="118.5" rx="4.5" ry="3.2" fill={palette.accent} />
          <circle cx={cx + 7} cy="115.5" r="1.4" fill={palette.accent} />
          <circle cx={cx + 11} cy="114" r="1.5" fill={palette.accent} />
          <circle cx={cx + 15} cy="115.5" r="1.4" fill={palette.accent} />
        </g>
      )}

      {pet === 'bunny' && (
        <g id={`${prefix}-bunny`} className="transition-transform duration-300">
          {/* Fluffy Cotton Tail (Peeking out at side) */}
          <circle cx={cx - 24 * flip} cy="110" r="8" fill="#ffffff" stroke="#fecdd3" strokeWidth="0.8" />
          <circle cx={cx - 26 * flip} cy="108" r="5" fill="#fff1f2" />

          {/* Chubby Bunny Body */}
          <ellipse cx={cx} cy={bodyY} rx="24" ry="23" fill={palette.primary} stroke={palette.secondary} strokeWidth="1.2" />
          {/* Sweet Creamy Tummy */}
          <ellipse cx={cx} cy={bodyY + 2} rx="15" ry="16" fill="#fff1f2" />
          <path
            d={`M ${cx - 8} ${bodyY - 10} Q ${cx} ${bodyY - 4} ${cx + 8} ${bodyY - 10} L ${cx + 10} ${bodyY + 12} Q ${cx} ${bodyY + 16} ${cx - 10} ${bodyY + 12} Z`}
            fill="#ffffff"
            opacity="0.9"
          />

          {/* Expressive Soft Bunny Ears (Playfully curved & bouncy) */}
          {/* Left Ear - Perked with gentle curve */}
          <path
            d={`M ${cx - 16} ${cy - 12} C ${cx - 20} ${cy - 26} ${cx - 18} ${cy - 44} ${cx - 9} ${cy - 44} C ${cx - 1} ${cy - 44} ${cx - 2} ${cy - 26} ${cx - 5} ${cy - 14} Z`}
            fill={palette.primary}
            stroke={palette.secondary}
            strokeWidth="1.2"
          />
          {/* Left Inner Pink Velvet */}
          <path
            d={`M ${cx - 14} ${cy - 16} C ${cx - 17} ${cy - 26} ${cx - 15} ${cy - 40} ${cx - 9} ${cy - 40} C ${cx - 4} ${cy - 40} ${cx - 5} ${cy - 26} ${cx - 7} ${cy - 18} Z`}
            fill="#fda4af"
          />
          <path
            d={`M ${cx - 10} ${cy - 22} Q ${cx - 9} ${cy - 34} ${cx - 8} ${cy - 22}`}
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
            fill="none"
          />

          {/* Right Ear - Playfully tipped/cocked */}
          <path
            d={`M ${cx + 5} ${cy - 14} C ${cx + 4} ${cy - 28} ${cx + 7} ${cy - 45} ${cx + 15} ${cy - 44} C ${cx + 22} ${cy - 43} ${cx + 20} ${cy - 24} ${cx + 16} ${cy - 12} Z`}
            fill={palette.primary}
            stroke={palette.secondary}
            strokeWidth="1.2"
          />
          {/* Right Inner Pink Velvet */}
          <path
            d={`M ${cx + 7} ${cy - 18} C ${cx + 6} ${cy - 28} ${cx + 9} ${cy - 40} ${cx + 14} ${cy - 39} C ${cx + 19} ${cy - 38} ${cx + 17} ${cy - 25} ${cx + 14} ${cy - 16} Z`}
            fill="#fda4af"
          />
          <path
            d={`M ${cx + 11} ${cy - 22} Q ${cx + 12} ${cy - 34} ${cx + 13} ${cy - 22}`}
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
            fill="none"
          />

          {/* Bunny Head - Chubby Cheeked Round Silhouette */}
          <path
            d={`M ${cx - 24} ${cy + 8} C ${cx - 28} ${cy + 2} ${cx - 28} ${cy - 12} ${cx - 20} ${cy - 22} C ${cx - 10} ${cy - 27} ${cx + 10} ${cy - 27} ${cx + 20} ${cy - 22} C ${cx + 28} ${cy - 12} ${cx + 28} ${cy + 2} ${cx + 24} ${cy + 8} C ${cx + 18} ${cy + 22} ${cx - 18} ${cy + 22} ${cx - 24} ${cy + 8} Z`}
            fill={palette.primary}
            stroke={palette.secondary}
            strokeWidth="1.2"
          />

          {/* Puffy Soft White Cheeks / Muzzle */}
          <ellipse cx={cx - 5} cy={cy + 7} rx="6.2" ry="5" fill="#ffffff" />
          <ellipse cx={cx + 5} cy={cy + 7} rx="6.2" ry="5" fill="#ffffff" />

          {/* Tiny Pink Heart Nose */}
          <path
            d={`M ${cx} ${cy + 3.8} C ${cx - 0.6} ${cy + 2.8} ${cx - 2.5} ${cy + 2.8} ${cx - 2.5} ${cy + 4.2} C ${cx - 2.5} ${cy + 5.5} ${cx} ${cy + 7} ${cx} ${cy + 7} C ${cx} ${cy + 7} ${cx + 2.5} ${cy + 5.5} ${cx + 2.5} ${cy + 4.2} C ${cx + 2.5} ${cy + 2.8} ${cx + 0.6} ${cy + 2.8} ${cx} ${cy + 3.8} Z`}
            fill="#f43f5e"
          />

          {/* Bunny Smile */}
          <path
            d={`M ${cx - 4.5} ${cy + 8.5} Q ${cx - 2.2} ${cy + 11.2} ${cx} ${cy + 9} Q ${cx + 2.2} ${cy + 11.2} ${cx + 4.5} ${cy + 8.5}`}
            stroke="#9f1239"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Delicate Whiskers */}
          <path d={`M ${cx - 9} ${cy + 6} L ${cx - 21} ${cy + 4} M ${cx - 9} ${cy + 9} L ${cx - 20} ${cy + 11}`} stroke="#fda4af" strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M ${cx + 9} ${cy + 6} L ${cx + 21} ${cy + 4} M ${cx + 9} ${cy + 9} L ${cx + 20} ${cy + 11}`} stroke="#fda4af" strokeWidth="1.1" strokeLinecap="round" />

          {/* Big Sparkling Anime Bunny Eyes */}
          <ellipse cx={cx - 9} cy={cy - 2} rx="4.5" ry="5.2" fill="#881337" />
          <ellipse cx={cx - 9} cy={cy - 1} rx="3.5" ry="3.8" fill="#be123c" opacity="0.45" />
          <circle cx={cx - 10.5} cy={cy - 4} r="1.8" fill="#ffffff" />
          <circle cx={cx - 7.5} cy={cy} r="1" fill="#ffffff" />

          <ellipse cx={cx + 9} cy={cy - 2} rx="4.5" ry="5.2" fill="#881337" />
          <ellipse cx={cx + 9} cy={cy - 1} rx="3.5" ry="3.8" fill="#be123c" opacity="0.45" />
          <circle cx={cx + 7.5} cy={cy - 4} r="1.8" fill="#ffffff" />
          <circle cx={cx + 10.5} cy={cy} r="1" fill="#ffffff" />

          {/* Soft Glowing Rosy Cheeks */}
          <ellipse cx={cx - 15} cy={cy + 5} rx="4.5" ry="3.2" fill="#fda4af" opacity="0.9" />
          <ellipse cx={cx + 15} cy={cy + 5} rx="4.5" ry="3.2" fill="#fda4af" opacity="0.9" />

          {/* Soft Bunny Paws with Pink Toe Beans */}
          <ellipse cx={cx - 8} cy="118" rx="6.5" ry="5" fill={palette.primary} stroke={palette.secondary} strokeWidth="1" />
          <ellipse cx={cx - 8} cy="118.5" rx="3.5" ry="2.6" fill="#fecdd3" />

          <ellipse cx={cx + 8} cy="118" rx="6.5" ry="5" fill={palette.primary} stroke={palette.secondary} strokeWidth="1" />
          <ellipse cx={cx + 8} cy="118.5" rx="3.5" ry="2.6" fill="#fecdd3" />
        </g>
      )}

      {pet === 'cat' && (
        <g id={`${prefix}-cat`} className="transition-transform duration-300">
          {/* Expressive Swishing Tail with rings */}
          <path
            d={`M ${cx - 24 * flip} 112 Q ${cx - 42 * flip} 118 ${cx - 40 * flip} 88 Q ${cx - 38 * flip} 68 ${cx - 26 * flip} 72`}
            stroke={palette.primary}
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx - 35 * flip} 73 Q ${cx - 38 * flip} 68 ${cx - 26 * flip} 72`}
            stroke={palette.secondary}
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Fluffy Kitten Body */}
          <ellipse cx={cx} cy={bodyY} rx="24" ry="23" fill={palette.primary} />
          {/* Decisive White Chest Bib */}
          <ellipse cx={cx} cy={bodyY + 2} rx="15" ry="16" fill={palette.secondary} />
          <path
            d={`M ${cx - 8} ${bodyY - 12} Q ${cx} ${bodyY - 6} ${cx + 8} ${bodyY - 12} L ${cx + 12} ${bodyY + 14} Q ${cx} ${bodyY + 18} ${cx - 12} ${bodyY + 14} Z`}
            fill={palette.secondary}
            opacity="0.95"
          />

          {/* Kitten Ears - Curved outer ear with soft fluffy inner ear */}
          <path
            d={`M ${cx - 23} ${cy - 5} C ${cx - 24} ${cy - 20} ${cx - 19} ${cy - 30} ${cx - 12} ${cy - 30} C ${cx - 6} ${cy - 30} ${cx - 2} ${cy - 18} ${cx - 2} ${cy - 12} Z`}
            fill={palette.primary}
            stroke={palette.accent}
            strokeWidth="0.8"
          />
          {/* Left Inner Ear (Warm pastel pink with fluff) */}
          <path
            d={`M ${cx - 19} ${cy - 9} C ${cx - 20} ${cy - 19} ${cx - 16} ${cy - 25} ${cx - 12} ${cy - 25} C ${cx - 8} ${cy - 25} ${cx - 5} ${cy - 17} ${cx - 5} ${cy - 13} Z`}
            fill="#fecdd3"
          />
          <path
            d={`M ${cx - 18} ${cy - 10} Q ${cx - 12} ${cy - 16} ${cx - 6} ${cy - 12}`}
            fill="#ffffff"
            opacity="0.75"
          />

          {/* Right Ear */}
          <path
            d={`M ${cx + 23} ${cy - 5} C ${cx + 24} ${cy - 20} ${cx + 19} ${cy - 30} ${cx + 12} ${cy - 30} C ${cx + 6} ${cy - 30} ${cx + 2} ${cy - 18} ${cx + 2} ${cy - 12} Z`}
            fill={palette.primary}
            stroke={palette.accent}
            strokeWidth="0.8"
          />
          {/* Right Inner Ear */}
          <path
            d={`M ${cx + 19} ${cy - 9} C ${cx + 20} ${cy - 19} ${cx + 16} ${cy - 25} ${cx + 12} ${cy - 25} C ${cx + 8} ${cy - 25} ${cx + 5} ${cy - 17} ${cx + 5} ${cy - 13} Z`}
            fill="#fecdd3"
          />
          <path
            d={`M ${cx + 18} ${cy - 10} Q ${cx + 12} ${cy - 16} ${cx + 6} ${cy - 12}`}
            fill="#ffffff"
            opacity="0.75"
          />

          {/* Head - Cute Chubby Cheek Silhouette */}
          <path
            d={`M ${cx - 24} ${cy + 10} C ${cx - 28} ${cy + 3} ${cx - 28} ${cy - 12} ${cx - 20} ${cy - 22} C ${cx - 10} ${cy - 28} ${cx + 10} ${cy - 28} ${cx + 20} ${cy - 22} C ${cx + 28} ${cy - 12} ${cx + 28} ${cy + 3} ${cx + 24} ${cy + 10} C ${cx + 18} ${cy + 22} ${cx - 18} ${cy + 22} ${cx - 24} ${cy + 10} Z`}
            fill={palette.primary}
          />

          {/* Tabby Forehead Markings (Decisive contrast) */}
          <path d={`M ${cx} ${cy - 23} L ${cx} ${cy - 15}`} stroke={palette.accent} strokeWidth="1.8" strokeLinecap="round" />
          <path d={`M ${cx - 6} ${cy - 21} Q ${cx - 5} ${cy - 18} ${cx - 4} ${cy - 16}`} stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" />
          <path d={`M ${cx + 6} ${cy - 21} Q ${cx + 5} ${cy - 18} ${cx + 4} ${cy - 16}`} stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" />

          {/* Puffy White Muzzle (High contrast!) */}
          <ellipse cx={cx - 5} cy={cy + 7} rx="6.5" ry="5.2" fill={palette.secondary} />
          <ellipse cx={cx + 5} cy={cy + 7} rx="6.5" ry="5.2" fill={palette.secondary} />

          {/* Nose */}
          <polygon points={`${cx - 3.5},${cy + 4} ${cx + 3.5},${cy + 4} ${cx},${cy + 7.5}`} fill="#f43f5e" />

          {/* Kitty Smile */}
          <path
            d={`M ${cx - 5} ${cy + 9} Q ${cx - 2.5} ${cy + 12} ${cx} ${cy + 9.5} Q ${cx + 2.5} ${cy + 12} ${cx + 5} ${cy + 9}`}
            stroke="#7c2d12"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Whiskers */}
          <path d={`M ${cx - 10} ${cy + 5} L ${cx - 22} ${cy + 3} M ${cx - 10} ${cy + 8} L ${cx - 21} ${cy + 10}`} stroke={palette.accent} strokeWidth="1.3" strokeLinecap="round" />
          <path d={`M ${cx + 10} ${cy + 5} L ${cx + 22} ${cy + 3} M ${cx + 10} ${cy + 8} L ${cx + 21} ${cy + 10}`} stroke={palette.accent} strokeWidth="1.3" strokeLinecap="round" />

          {/* Big Sparkling Anime Kitten Eyes */}
          <ellipse cx={cx - 10} cy={cy - 2} rx="4.5" ry="5.2" fill="#18181b" />
          <ellipse cx={cx - 10} cy={cy - 1} rx="3.5" ry="3.8" fill={palette.accent} opacity="0.4" />
          <circle cx={cx - 11.5} cy={cy - 4} r="1.8" fill="#ffffff" />
          <circle cx={cx - 8.5} cy={cy} r="1" fill="#ffffff" />

          <ellipse cx={cx + 10} cy={cy - 2} rx="4.5" ry="5.2" fill="#18181b" />
          <ellipse cx={cx + 10} cy={cy - 1} rx="3.5" ry="3.8" fill={palette.accent} opacity="0.4" />
          <circle cx={cx + 8.5} cy={cy - 4} r="1.8" fill="#ffffff" />
          <circle cx={cx + 11.5} cy={cy} r="1" fill="#ffffff" />

          {/* Rosy Glowing Cheeks */}
          <ellipse cx={cx - 16} cy={cy + 5} rx="4.5" ry="3.2" fill="#fda4af" opacity="0.9" />
          <ellipse cx={cx + 16} cy={cy + 5} rx="4.5" ry="3.2" fill="#fda4af" opacity="0.9" />

          {/* White "Kitten Mittens" Paws */}
          <ellipse cx={cx - 9} cy="118" rx="6.5" ry="5" fill={palette.secondary} stroke="#fecdd3" strokeWidth="0.8" />
          <ellipse cx={cx + 9} cy="118" rx="6.5" ry="5" fill={palette.secondary} stroke="#fecdd3" strokeWidth="0.8" />
        </g>
      )}

      {pet === 'fox' && (
        <g id={`${prefix}-fox`} className="transition-transform duration-300">
          {/* Big Bushy Fox Tail with Jagged White Tip */}
          <path
            d={`M ${cx - 25 * flip} 115 C ${cx - 52 * flip} 122 ${cx - 58 * flip} 88 ${cx - 42 * flip} 70 C ${cx - 32 * flip} 65 ${cx - 26 * flip} 82 ${cx - 20 * flip} 104 Z`}
            fill={palette.primary}
          />
          {/* Stylized 3-point White Tail Tip */}
          <path
            d={`M ${cx - 42 * flip} 70 C ${cx - 52 * flip} 64 ${cx - 56 * flip} 80 ${cx - 48 * flip} 90 L ${cx - 44 * flip} 84 L ${cx - 42 * flip} 88 L ${cx - 38 * flip} 81 L ${cx - 36 * flip} 84 C ${cx - 32 * flip} 75 ${cx - 36 * flip} 68 ${cx - 42 * flip} 70 Z`}
            fill={palette.secondary}
          />

          {/* Fox Body */}
          <ellipse cx={cx} cy={bodyY} rx="24" ry="23" fill={palette.primary} />
          {/* Lush White Chest Bib with Fluffy Scalloped Tuft */}
          <path
            d={`M ${cx - 13} ${bodyY - 12} Q ${cx} ${bodyY - 4} ${cx + 13} ${bodyY - 12} L ${cx + 11} ${bodyY + 12} Q ${cx} ${bodyY + 18} ${cx - 11} ${bodyY + 12} Z`}
            fill={palette.secondary}
          />
          <path
            d={`M ${cx} ${bodyY - 2} L ${cx - 4} ${bodyY + 6} L ${cx} ${bodyY + 12} L ${cx + 4} ${bodyY + 6} Z`}
            fill="#ffffff"
          />

          {/* Large Alert Fox Ears with Black Backs and Fluffy White Inner Tuft */}
          {/* Left Ear */}
          <polygon points={`${cx - 24},${cy - 2} ${cx - 15},${cy - 33} ${cx - 3},${cy - 14}`} fill="#18181b" />
          <polygon points={`${cx - 22},${cy - 4} ${cx - 15},${cy - 30} ${cx - 5},${cy - 14}`} fill={palette.primary} />
          {/* Inner White Tuft */}
          <polygon points={`${cx - 19},${cy - 8} ${cx - 15},${cy - 25} ${cx - 7},${cy - 14}`} fill="#ffffff" />
          <path d={`M ${cx - 17} ${cy - 12} L ${cx - 14} ${cy - 20} L ${cx - 10} ${cy - 13}`} fill="#ffedd5" />

          {/* Right Ear */}
          <polygon points={`${cx + 24},${cy - 2} ${cx + 15},${cy - 33} ${cx + 3},${cy - 14}`} fill="#18181b" />
          <polygon points={`${cx + 22},${cy - 4} ${cx + 15},${cy - 30} ${cx + 5},${cy - 14}`} fill={palette.primary} />
          {/* Inner White Tuft */}
          <polygon points={`${cx + 19},${cy - 8} ${cx + 15},${cy - 25} ${cx + 7},${cy - 14}`} fill="#ffffff" />
          <path d={`M ${cx + 17} ${cy - 12} L ${cx + 14} ${cy - 20} L ${cx + 10} ${cy - 13}`} fill="#ffedd5" />

          {/* Fox Head Silhouette with Flared Cheek Tufts */}
          <path
            d={`M ${cx - 22} ${cy + 6} L ${cx - 28} ${cy + 10} L ${cx - 22} ${cy + 13} L ${cx - 25} ${cy + 17} L ${cx - 15} ${cy + 22} Q ${cx} ${cy + 25} ${cx + 15} ${cy + 22} L ${cx + 25} ${cy + 17} L ${cx + 22} ${cy + 13} L ${cx + 28} ${cy + 10} L ${cx + 22} ${cy + 6} C ${cx + 26} ${cy - 10} ${cx + 16} ${cy - 26} ${cx} ${cy - 26} C ${cx - 16} ${cy - 26} ${cx - 26} ${cy - 10} ${cx - 22} ${cy + 6} Z`}
            fill={palette.primary}
          />

          {/* Dramatic Fox White Mask - sweeps under eyes to cheeks and muzzle */}
          <path
            d={`M ${cx - 20} ${cy + 2} Q ${cx - 10} ${cy + 10} ${cx - 5} ${cy + 12} L ${cx} ${cy + 17} L ${cx + 5} ${cy + 12} Q ${cx + 10} ${cy + 10} ${cx + 20} ${cy + 2} L ${cx + 25} ${cy + 17} L ${cx + 15} ${cy + 22} Q ${cx} ${cy + 25} ${cx - 15} ${cy + 22} L ${cx - 25} ${cy + 17} Z`}
            fill={palette.secondary}
          />
          <path
            d={`M ${cx - 14} ${cy + 7} Q ${cx} ${cy + 14} ${cx + 14} ${cy + 7} L ${cx} ${cy + 22} Z`}
            fill="#ffffff"
          />

          {/* Refined Black Button Nose */}
          <ellipse cx={cx} cy={cy + 11} rx="3" ry="2.2" fill="#18181b" />
          <circle cx={cx - 0.8} cy={cy + 10.3} r="0.8" fill="#ffffff" />
          <path d={`M ${cx - 3} ${cy + 14} Q ${cx} ${cy + 17} ${cx + 3} ${cy + 14}`} stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Sleek Almond Fox Eyes with Black Eyeliner Wings */}
          <path
            d={`M ${cx - 15} ${cy - 2} C ${cx - 13} ${cy - 8} ${cx - 7} ${cy - 8} ${cx - 4} ${cy - 2}`}
            stroke="#18181b"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Sparkling Eye Iris & Double Catchlights */}
          <circle cx={cx - 9} cy={cy - 2.5} r="3.2" fill="#18181b" />
          <circle cx={cx - 10} cy={cy - 3.5} r="1.3" fill="#ffffff" />
          <circle cx={cx - 7.5} cy={cy - 1.2} r="0.7" fill="#ffffff" />

          <path
            d={`M ${cx + 4} ${cy - 2} C ${cx + 7} ${cy - 8} ${cx + 13} ${cy - 8} ${cx + 15} ${cy - 2}`}
            stroke="#18181b"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={cx + 9} cy={cy - 2.5} r="3.2" fill="#18181b" />
          <circle cx={cx + 8} cy={cy - 3.5} r="1.3" fill="#ffffff" />
          <circle cx={cx + 10.5} cy={cy - 1.2} r="0.7" fill="#ffffff" />

          {/* Rosy Cheeks */}
          <ellipse cx={cx - 15} cy={cy + 6} rx="4.5" ry="3" fill="#fda4af" opacity="0.9" />
          <ellipse cx={cx + 15} cy={cy + 6} rx="4.5" ry="3" fill="#fda4af" opacity="0.9" />

          {/* Sleek Black Fox Paws / Socks */}
          <ellipse cx={cx - 9} cy="118" rx="6.5" ry="5" fill="#18181b" />
          <ellipse cx={cx + 9} cy="118" rx="6.5" ry="5" fill="#18181b" />
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
        <g id={`${prefix}-penguin`} className="transition-transform duration-300">
          {/* Flippers behind/side */}
          <ellipse
            cx={cx - 23}
            cy={bodyY - 2}
            rx="6"
            ry="14"
            fill={palette.primary}
            transform={`rotate(22 ${cx - 23} ${bodyY - 2})`}
          />
          <ellipse
            cx={cx + 23}
            cy={bodyY - 2}
            rx="6"
            ry="14"
            fill={palette.primary}
            transform={`rotate(-22 ${cx + 23} ${bodyY - 2})`}
          />

          {/* Chubby Penguin Body (Tuxedo) */}
          <ellipse cx={cx} cy={bodyY} rx="26" ry="23" fill={palette.primary} />

          {/* Penguin Head Dome (Top at 46, centered at 68) */}
          <circle cx={cx} cy="68" r="22" fill={palette.primary} />

          {/* Crisp White Face Mask (Sanrio/Kawaii Style) */}
          <path
            d={`M ${cx - 15} 67 C ${cx - 15} 55 ${cx - 2} 55 ${cx} 62 C ${cx + 2} 55 ${cx + 15} 55 ${cx + 15} 67 C ${cx + 15} 78 ${cx + 8} 86 ${cx} 88 C ${cx - 8} 86 ${cx - 15} 78 ${cx - 15} 67 Z`}
            fill="#ffffff"
          />

          {/* Broad Brilliant White Belly */}
          <ellipse cx={cx} cy={bodyY + 2} rx="16" ry="18" fill="#ffffff" />

          {/* Big Glossy Penguin Eyes (Centered at y=68 with plenty of forehead above!) */}
          <circle cx={cx - 8} cy="68" r="3.6" fill="#0f172a" />
          <circle cx={cx - 9.5} cy="66.5" r="1.5" fill="#ffffff" />
          <circle cx={cx - 6.8} cy="69.5" r="0.8" fill="#ffffff" />

          <circle cx={cx + 8} cy="68" r="3.6" fill="#0f172a" />
          <circle cx={cx + 6.5} cy="66.5" r="1.5" fill="#ffffff" />
          <circle cx={cx + 9.2} cy="69.5" r="0.8" fill="#ffffff" />

          {/* Rosy Cheeks */}
          <ellipse cx={cx - 13} cy="73" rx="4" ry="2.8" fill="#fda4af" opacity="0.9" />
          <ellipse cx={cx + 13} cy="73" rx="4" ry="2.8" fill="#fda4af" opacity="0.9" />

          {/* 3D Golden-Amber Beak */}
          <path
            d={`M ${cx - 5.5} 72 Q ${cx} 70 ${cx + 5.5} 72 L ${cx} 78 Z`}
            fill="#d97706"
          />
          <path
            d={`M ${cx - 5.5} 72 Q ${cx} 70 ${cx + 5.5} 72 L ${cx} 76 Z`}
            fill="#fbbf24"
          />

          {/* Front Flipper Wings */}
          <path
            d={`M ${cx - 21} ${bodyY - 6} C ${cx - 24} ${bodyY + 6} ${cx - 14} ${bodyY + 12} ${cx - 13} ${bodyY + 3} Z`}
            fill={palette.primary}
            opacity="0.25"
          />
          <path
            d={`M ${cx + 21} ${bodyY - 6} C ${cx + 24} ${bodyY + 6} ${cx + 14} ${bodyY + 12} ${cx + 13} ${bodyY + 3} Z`}
            fill={palette.primary}
            opacity="0.25"
          />

          {/* Cute Plump Webbed Orange Feet */}
          <path
            d={`M ${cx - 14} 118 Q ${cx - 8} 114 ${cx - 2} 118 Q ${cx - 4} 122 ${cx - 8} 122 Q ${cx - 12} 122 ${cx - 14} 118 Z`}
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="0.6"
          />
          <path
            d={`M ${cx + 2} 118 Q ${cx + 8} 114 ${cx + 14} 118 Q ${cx + 12} 122 ${cx + 8} 122 Q ${cx + 4} 122 ${cx + 2} 118 Z`}
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="0.6"
          />
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
