'use client';

import React from 'react';
import { PetAccessoryHead, PetAccessoryNeck, PetType } from '@/lib/types';

interface PetAccessoriesProps {
  species: PetType;
  head: PetAccessoryHead;
  neck: PetAccessoryNeck;
  cx: number;
  cy: number;
  flip?: number; // 1 = facing right/standard, -1 = facing left
}

interface AnchorPoint {
  headX: number;
  headY: number;
  eyeX: number;
  eyeY: number;
  neckX: number;
  neckY: number;
}

const ANCHORS: Record<PetType, AnchorPoint> = {
  sealion: { headX: -2, headY: -18, eyeX: -3, eyeY: -11, neckX: -1, neckY: 90 },
  lion:    { headX: 0,  headY: -28, eyeX: 0,  eyeY: -7,  neckX: 0,  neckY: 93 },
  bear:    { headX: 0,  headY: -28, eyeX: 0,  eyeY: -4,  neckX: 0,  neckY: 94 },
  bunny:   { headX: 0,  headY: -26, eyeX: 0,  eyeY: -7,  neckX: 0,  neckY: 93 },
  cat:     { headX: 0,  headY: -25, eyeX: 0,  eyeY: -7,  neckX: 0,  neckY: 92 },
  fox:     { headX: 0,  headY: -25, eyeX: 0,  eyeY: -6,  neckX: 0,  neckY: 93 },
  panda:   { headX: 0,  headY: -26, eyeX: 0,  eyeY: -4,  neckX: 0,  neckY: 94 },
  penguin: { headX: 0,  headY: -24, eyeX: 0,  eyeY: -8,  neckX: 0,  neckY: 88 },
};

export const PetAccessories: React.FC<PetAccessoriesProps> = ({
  species,
  head,
  neck,
  cx,
  cy,
  flip = 1,
}) => {
  const anchor = ANCHORS[species] || ANCHORS.sealion;
  const hx = cx + anchor.headX * flip;
  const hy = cy + anchor.headY;
  const ex = cx + anchor.eyeX * flip;
  const ey = cy + anchor.eyeY;
  const nx = cx + anchor.neckX * flip;
  const ny = anchor.neckY;

  return (
    <g id="pet-accessories" className="pointer-events-none">
      {/* ----------------- NECK ACCESSORIES LAYER ----------------- */}
      {neck === 'scarf' && (
        <g id="neck-scarf" transform={`translate(${nx}, ${ny})`}>
          {/* Main Scarf Wrap */}
          <ellipse cx="0" cy="0" rx="19" ry="7" fill="#e11d48" />
          <ellipse cx="0" cy="0" rx="16" ry="5" fill="#f43f5e" />
          {/* Scarf Fringes Hanging Down */}
          <path
            d={`M ${4 * flip} 3 L ${12 * flip} 20 L ${20 * flip} 19 L ${13 * flip} 2 Z`}
            fill="#be123c"
          />
          {/* Fringe Lines */}
          <line x1={13 * flip} y1="20" x2={14 * flip} y2="23" stroke="#ffd1d9" strokeWidth="1.2" strokeLinecap="round" />
          <line x1={16 * flip} y1="20" x2={17 * flip} y2="23" stroke="#ffd1d9" strokeWidth="1.2" strokeLinecap="round" />
          <line x1={19 * flip} y1="19" x2={20 * flip} y2="22" stroke="#ffd1d9" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}

      {neck === 'bell' && (
        <g id="neck-bell" transform={`translate(${nx}, ${ny})`}>
          {/* Red Collar Ribbon */}
          <ellipse cx="0" cy="-1" rx="17" ry="4" fill="#e11d48" stroke="#be123c" strokeWidth="0.8" />
          {/* Gold Bell */}
          <circle cx="0" cy="4" r="5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
          <circle cx="0" cy="4" r="4" fill="#fbbf24" />
          {/* Bell Slit & Clapper */}
          <line x1="-3" y1="5" x2="3" y2="5" stroke="#78350f" strokeWidth="0.9" />
          <circle cx="0" cy="6" r="1" fill="#78350f" />
          {/* Top Ring */}
          <ellipse cx="0" cy="0" rx="1.5" ry="1" fill="none" stroke="#b45309" strokeWidth="0.8" />
          {/* Shiny Spec */}
          <circle cx="-1.5" cy="2.5" r="0.8" fill="#ffffff" />
        </g>
      )}

      {neck === 'bowtie' && (
        <g id="neck-bowtie" transform={`translate(${nx}, ${ny + 2})`}>
          {/* Left Wing */}
          <polygon points="-12,-6 -1,0 -12,6" fill="#1e1b4b" />
          <polygon points="-11,-5 -2,0 -11,5" fill="#312e81" />
          {/* Right Wing */}
          <polygon points="12,-6 1,0 12,6" fill="#1e1b4b" />
          <polygon points="11,-5 2,0 11,5" fill="#312e81" />
          {/* Knot */}
          <rect x="-3" y="-3.5" width="6" height="7" rx="2" fill="#be123c" />
          <rect x="-2" y="-2.5" width="4" height="5" rx="1" fill="#e11d48" />
        </g>
      )}

      {neck === 'heart_locket' && (
        <g id="neck-heart-locket" transform={`translate(${nx}, ${ny})`}>
          {/* Gold Chain */}
          <path
            d={`M -14 -4 Q 0 4 14 -4`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeDasharray="2 1"
          />
          {/* Locket Bail */}
          <circle cx="0" cy="3" r="1.5" fill="none" stroke="#d97706" strokeWidth="0.9" />
          {/* Ruby Heart Locket */}
          <path
            d="M 0 5 C 0 3.5 -3 2 -5 4 C -7 6 -5 9 0 13 C 5 9 7 6 5 4 C 3 2 0 3.5 0 5 Z"
            fill="#e11d48"
            stroke="#9f1239"
            strokeWidth="0.8"
          />
          <path
            d="M 0 6 C 0 4.8 -2 3.5 -3.5 5 C -5 6.5 -3.5 8.5 0 11.5 C 3.5 8.5 5 6.5 3.5 5 C 2 3.5 0 4.8 0 6 Z"
            fill="#f43f5e"
          />
          {/* Gold Highlight */}
          <circle cx="-1.5" cy="5.5" r="0.8" fill="#ffffff" opacity="0.9" />
        </g>
      )}

      {neck === 'bandana' && (
        <g id="neck-bandana" transform={`translate(${nx}, ${ny})`}>
          {/* Folded Bandana Triangle */}
          <polygon points="-16,-2 16,-2 0,14" fill="#dc2626" />
          <polygon points="-14,-1 14,-1 0,12" fill="#ef4444" />
          {/* Bandana Pattern Dots */}
          <circle cx="0" cy="3" r="1" fill="#ffffff" opacity="0.85" />
          <circle cx="-6" cy="2" r="0.8" fill="#ffffff" opacity="0.85" />
          <circle cx="6" cy="2" r="0.8" fill="#ffffff" opacity="0.85" />
          <circle cx="-3" cy="7" r="0.8" fill="#ffffff" opacity="0.85" />
          <circle cx="3" cy="7" r="0.8" fill="#ffffff" opacity="0.85" />
          {/* Center Knot */}
          <circle cx="0" cy="-2" r="2.5" fill="#991b1b" />
        </g>
      )}

      {/* ----------------- EYEWEAR ACCESSORIES LAYER ----------------- */}
      {head === 'sunglasses' && (
        <g id="head-sunglasses" transform={`translate(${ex}, ${ey})`}>
          {/* Bridge */}
          <rect x="-4" y="-3" width="8" height="2" fill="#09090b" rx="1" />
          {/* Left Frame & Lens */}
          <rect x="-17" y="-7" width="13" height="10" rx="3" fill="#09090b" />
          <rect x="-16" y="-6" width="11" height="8" rx="2" fill="#18181b" />
          <path d="M -14 -5 L -8 -5 L -13 0 Z" fill="#ffffff" opacity="0.4" />
          {/* Right Frame & Lens */}
          <rect x="4" y="-7" width="13" height="10" rx="3" fill="#09090b" />
          <rect x="5" y="-6" width="11" height="8" rx="2" fill="#18181b" />
          <path d="M 7 -5 L 13 -5 L 8 0 Z" fill="#ffffff" opacity="0.4" />
          {/* Side Temples */}
          <line x1="-17" y1="-5" x2="-22" y2="-4" stroke="#09090b" strokeWidth="2" strokeLinecap="round" />
          <line x1="17" y1="-5" x2="22" y2="-4" stroke="#09090b" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* ----------------- HEAD ACCESSORIES LAYER ----------------- */}
      {head === 'crown' && (
        <g id="head-crown" transform={`translate(${hx}, ${hy})`}>
          {/* Base Rim */}
          <rect x="-12" y="-1" width="24" height="4" rx="1.5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
          {/* Crown Peaks */}
          <polygon
            points="-11,-1 -11,-12 -6,-5 0,-15 6,-5 11,-12 11,-1"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="0.8"
          />
          {/* Jewels */}
          <circle cx="0" cy="-15" r="1.8" fill="#ef4444" />
          <circle cx="-11" cy="-12" r="1.5" fill="#3b82f6" />
          <circle cx="11" cy="-12" r="1.5" fill="#10b981" />
          {/* Band Gem */}
          <rect x="-2" y="0" width="4" height="2" rx="0.5" fill="#ef4444" />
          {/* Shine */}
          <line x1="-3" y1="-7" x2="-2" y2="-3" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        </g>
      )}

      {head === 'bow' && (
        <g id="head-bow" transform={`translate(${hx + 6 * flip}, ${hy + 4}) rotate(${12 * flip})`}>
          {/* Left Loop */}
          <path
            d="M 0 0 C -10 -8 -12 6 0 1 Z"
            fill="#f43f5e"
            stroke="#be123c"
            strokeWidth="0.8"
          />
          {/* Right Loop */}
          <path
            d="M 0 0 C 10 -8 12 6 0 1 Z"
            fill="#f43f5e"
            stroke="#be123c"
            strokeWidth="0.8"
          />
          {/* Ribbon Tails */}
          <path d="M -2 2 Q -8 8 -9 14 L -4 12 Z" fill="#e11d48" />
          <path d="M 2 2 Q 8 8 9 14 L 4 12 Z" fill="#e11d48" />
          {/* Center Knot */}
          <circle cx="0" cy="0" r="3" fill="#fda4af" stroke="#be123c" strokeWidth="0.8" />
          <circle cx="-0.8" cy="-0.8" r="0.8" fill="#ffffff" />
        </g>
      )}

      {head === 'flower' && (
        <g id="head-flower" transform={`translate(${hx + 8 * flip}, ${hy + 4})`}>
          {/* Leaf */}
          <ellipse cx="-7" cy="4" rx="4" ry="2.5" fill="#22c55e" transform="rotate(-30 -7 4)" />
          {/* 5 Blossom Petals */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-6"
              rx="4"
              ry="5.5"
              fill="#fbcfe8"
              stroke="#f472b6"
              strokeWidth="0.6"
              transform={`rotate(${angle})`}
            />
          ))}
          {/* Center Pistil */}
          <circle cx="0" cy="0" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
          <circle cx="-0.5" cy="-0.5" r="0.8" fill="#ffffff" />
        </g>
      )}

      {head === 'cap' && (
        <g id="head-cap" transform={`translate(${hx}, ${hy + 6})`}>
          {/* Cap Crown / Dome */}
          <path
            d="M -15 0 C -15 -14 15 -14 15 0 Z"
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth="0.8"
          />
          {/* Button on top */}
          <circle cx="0" cy="-14" r="1.8" fill="#ffffff" />
          {/* Cap Visor / Brim */}
          <path
            d={`M ${-15 * flip} 0 C ${-22 * flip} 0 ${-24 * flip} 5 ${-14 * flip} 4 L ${12 * flip} 0 Z`}
            fill="#1d4ed8"
          />
          {/* Front Amore 'A' Emblem */}
          <circle cx="0" cy="-6" r="3.5" fill="#ffffff" />
          <path d="M 0 -8.5 L -1.8 -4 L 1.8 -4 Z" fill="#ef4444" />
        </g>
      )}

      {head === 'tophat' && (
        <g id="head-tophat" transform={`translate(${hx}, ${hy + 6})`}>
          {/* Brim */}
          <ellipse cx="0" cy="0" rx="18" ry="4" fill="#0f172a" stroke="#020617" strokeWidth="0.8" />
          {/* Cylinder Crown */}
          <path
            d="M -11 0 L -9 -20 L 9 -20 L 11 0 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="0.8"
          />
          {/* Flat Top */}
          <ellipse cx="0" cy="-20" rx="9" ry="2.5" fill="#334155" />
          {/* Satin Ribbon Band */}
          <path d="M -10.5 -1 L -10.2 -5 L 10.2 -5 L 10.5 -1 Z" fill="#e11d48" />
          {/* Gold Buckle */}
          <rect x="-2.5" y="-5" width="5" height="4" rx="0.5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.6" />
        </g>
      )}

      {head === 'sprout' && (
        <g id="head-sprout" transform={`translate(${hx}, ${hy + 4})`}>
          {/* Tiny Brown Seed Mount */}
          <ellipse cx="0" cy="1" rx="3.5" ry="1.5" fill="#78350f" opacity="0.6" />
          {/* Stem */}
          <path
            d="M 0 0 Q -1 -9 0 -13"
            stroke="#22c55e"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Leaf */}
          <path
            d="M 0 -13 C -8 -16 -10 -9 -1 -11 Z"
            fill="#4ade80"
            stroke="#16a34a"
            strokeWidth="0.8"
          />
          <circle cx="-4" cy="-12" r="0.6" fill="#ffffff" opacity="0.8" />
          {/* Right Leaf */}
          <path
            d="M 0 -13 C 8 -17 11 -10 1 -11 Z"
            fill="#22c55e"
            stroke="#15803d"
            strokeWidth="0.8"
          />
          <circle cx="4" cy="-13" r="0.6" fill="#ffffff" opacity="0.8" />
        </g>
      )}

      {head === 'party_hat' && (
        <g id="head-party-hat" transform={`translate(${hx}, ${hy + 5})`}>
          {/* Cone Hat */}
          <polygon points="-11,0 0,-24 11,0" fill="#f43f5e" />
          {/* Diagonal Stripes */}
          <polygon points="-7,-8 0,-24 3,-17 -2,-8" fill="#fbbf24" />
          <polygon points="-10,-2 0,-24 -5,-13 -9,-2" fill="#38bdf8" />
          {/* Pompom on top */}
          <circle cx="0" cy="-25" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.6" />
          <circle cx="0" cy="-25" r="2" fill="#fef08a" />
          {/* Bottom Ruffle */}
          <path d="M -11 0 Q -5 2 0 0 Q 5 2 11 0" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {head === 'halo' && (
        <g id="head-halo" transform={`translate(${hx}, ${hy - 6})`}>
          {/* Floating Glow */}
          <ellipse cx="0" cy="0" rx="16" ry="5" fill="none" stroke="#fef08a" strokeWidth="3" opacity="0.6" />
          {/* Golden Ring */}
          <ellipse cx="0" cy="0" rx="16" ry="5" fill="none" stroke="#f59e0b" strokeWidth="2.2" />
          <ellipse cx="0" cy="0" rx="15" ry="4.5" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
          {/* Little Sparkles */}
          <circle cx="-12" cy="-2" r="1" fill="#ffffff" />
          <circle cx="12" cy="1" r="0.8" fill="#ffffff" />
        </g>
      )}
    </g>
  );
};
