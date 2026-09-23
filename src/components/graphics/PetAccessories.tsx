'use client';

import React from 'react';
import { PetAccessoryHead, PetAccessoryNeck, PetType } from '@/lib/types';

export type AccessoryLayer = 'back' | 'front' | 'all';

interface PetAccessoriesProps {
  species: PetType;
  head: PetAccessoryHead;
  neck: PetAccessoryNeck;
  cx: number;
  cy: number;
  flip?: number; // 1 = facing right/standard, -1 = facing left
  layer?: AccessoryLayer;
}

interface AnimalProfile {
  headX: number;       // relative to cx, multiplied by flip
  headY: number;       // absolute Y for base of hat/crown
  headScale: number;   // size multiplier
  headAngle: number;   // tilt in degrees, multiplied by flip

  eyeX: number;        // relative to cx, multiplied by flip
  eyeY: number;        // Y level of eyes
  eyeSpacing: number;  // pixel distance between left and right eye centers
  eyeScale: number;    // scale for sunglasses
  eyeAngle: number;    // eye tilt angle

  neckX: number;       // relative to cx, multiplied by flip
  neckY: number;       // Y coordinate of collar/neck line
  neckWidth: number;   // width across neck
  neckScale: number;   // scale for neckwear
  neckCurve: number;   // downward curve depth
}

const ANIMAL_PROFILES: Record<PetType, AnimalProfile> = {
  sealion: {
    headX: 4,
    headY: 57,
    headScale: 0.95,
    headAngle: 12,
    eyeX: -2,
    eyeY: 66,
    eyeSpacing: 14,
    eyeScale: 0.95,
    eyeAngle: 8,
    neckX: 2,
    neckY: 88,
    neckWidth: 38,
    neckScale: 0.98,
    neckCurve: 6,
  },
  lion: {
    headX: 0,
    headY: 48,
    headScale: 1.18,
    headAngle: 0,
    eyeX: 0,
    eyeY: 71,
    eyeSpacing: 16,
    eyeScale: 1.08,
    eyeAngle: 0,
    neckX: 0,
    neckY: 103,
    neckWidth: 46,
    neckScale: 1.15,
    neckCurve: 5,
  },
  bear: {
    headX: 0,
    headY: 48,
    headScale: 1.06,
    headAngle: 0,
    eyeX: 0,
    eyeY: 72,
    eyeSpacing: 20,
    eyeScale: 1.08,
    eyeAngle: 0,
    neckX: 0,
    neckY: 103,
    neckWidth: 44,
    neckScale: 1.1,
    neckCurve: 5,
  },
  bunny: {
    headX: 0,
    headY: 51,
    headScale: 0.92,
    headAngle: 0,
    eyeX: 0,
    eyeY: 71,
    eyeSpacing: 13,
    eyeScale: 0.92,
    eyeAngle: 0,
    neckX: 0,
    neckY: 98,
    neckWidth: 34,
    neckScale: 0.92,
    neckCurve: 5,
  },
  cat: {
    headX: 0,
    headY: 50,
    headScale: 0.95,
    headAngle: 0,
    eyeX: 0,
    eyeY: 71,
    eyeSpacing: 15,
    eyeScale: 0.95,
    eyeAngle: 0,
    neckX: 0,
    neckY: 99,
    neckWidth: 36,
    neckScale: 0.95,
    neckCurve: 5,
  },
  fox: {
    headX: 0,
    headY: 50,
    headScale: 0.95,
    headAngle: 0,
    eyeX: 0,
    eyeY: 71,
    eyeSpacing: 15,
    eyeScale: 0.95,
    eyeAngle: 0,
    neckX: 0,
    neckY: 100,
    neckWidth: 36,
    neckScale: 0.95,
    neckCurve: 5,
  },
  panda: {
    headX: 0,
    headY: 50,
    headScale: 1.04,
    headAngle: 0,
    eyeX: 0,
    eyeY: 72,
    eyeSpacing: 17,
    eyeScale: 1.02,
    eyeAngle: 0,
    neckX: 0,
    neckY: 101,
    neckWidth: 42,
    neckScale: 1.05,
    neckCurve: 5,
  },
  penguin: {
    headX: 0,
    headY: 66,
    headScale: 0.92,
    headAngle: 0,
    eyeX: 0,
    eyeY: 68,
    eyeSpacing: 14,
    eyeScale: 0.9,
    eyeAngle: 0,
    neckX: 0,
    neckY: 88,
    neckWidth: 32,
    neckScale: 0.9,
    neckCurve: 4,
  },
};

export const PetAccessories: React.FC<PetAccessoriesProps> = ({
  species,
  head,
  neck,
  cx,
  cy,
  flip = 1,
  layer = 'front',
}) => {
  const p = ANIMAL_PROFILES[species] || ANIMAL_PROFILES.sealion;

  // Compute absolute anchor positions
  const hx = cx + p.headX * flip;
  const hy = p.headY;
  const hScale = p.headScale;
  const hAngle = p.headAngle * flip;

  const ex = cx + p.eyeX * flip;
  const ey = p.eyeY;
  const eScale = p.eyeScale;
  const eAngle = p.eyeAngle * flip;

  const nx = cx + p.neckX * flip;
  const ny = p.neckY;
  const nw = p.neckWidth;
  const nScale = p.neckScale;

  const isBack = layer === 'back' || layer === 'all';
  const isFront = layer === 'front' || layer === 'all';

  return (
    <g id={`accessories-${layer}`} className="pointer-events-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. BACK ACCESSORIES LAYER (Wraps behind the head & neck)      */}
      {/* ------------------------------------------------------------- */}
      {isBack && (
        <>
          {/* Back Scarf Wrap */}
          {neck === 'scarf' && (
            <g id="scarf-back" transform={`translate(${nx}, ${ny}) scale(${nScale})`}>
              {/* Dark inner collar wrap passing behind neck */}
              <path
                d={`M ${-nw / 2} -1 C ${-nw / 4} -7 ${nw / 4} -7 ${nw / 2} -1 L ${nw / 2 + 1} 6 C ${nw / 4} 0 ${-nw / 4} 0 ${-nw / 2 - 1} 6 Z`}
                fill="#881337"
              />
            </g>
          )}

          {/* Back Bell Collar Wrap */}
          {neck === 'bell' && (
            <g id="bell-back" transform={`translate(${nx}, ${ny}) scale(${nScale})`}>
              <path
                d={`M ${-nw / 2 + 1} 0 C ${-nw / 4} -3 ${nw / 4} -3 ${nw / 2 - 1} 0 L ${nw / 2 - 1} 3 C ${nw / 4} 0 ${-nw / 4} 0 ${-nw / 2 + 1} 3 Z`}
                fill="#881337"
              />
            </g>
          )}

          {/* Back Bandana Knot & Strap */}
          {neck === 'bandana' && (
            <g id="bandana-back" transform={`translate(${nx}, ${ny}) scale(${nScale})`}>
              <path
                d={`M ${-nw / 2} 1 C ${-nw / 4} -3 ${nw / 4} -3 ${nw / 2} 1 L ${nw / 2} 4 C ${nw / 4} 0 ${-nw / 4} 0 ${-nw / 2} 4 Z`}
                fill="#991b1b"
              />
              {/* Back tied knot */}
              <circle cx="0" cy="-3" r="2.5" fill="#7f1d1d" />
            </g>
          )}

          {/* Back Halo Arc (encircles behind skull) */}
          {head === 'halo' && (
            <g id="halo-back" transform={`translate(${hx}, ${hy - 10}) rotate(${hAngle}) scale(${hScale})`}>
              <path
                d="M -18 0 C -18 -6 18 -6 18 0"
                fill="none"
                stroke="#b45309"
                strokeWidth="2.5"
                opacity="0.8"
              />
            </g>
          )}

          {/* Back Tophat Rim */}
          {head === 'tophat' && (
            <g id="tophat-back" transform={`translate(${hx}, ${hy}) rotate(${hAngle}) scale(${hScale})`}>
              <ellipse cx="0" cy="0" rx="19" ry="3.5" fill="#09090b" />
            </g>
          )}

          {/* Back Cap Dome Interior */}
          {head === 'cap' && (
            <g id="cap-back" transform={`translate(${hx}, ${hy}) rotate(${hAngle}) scale(${hScale})`}>
              <path
                d="M -15 0 C -15 -4 15 -4 15 0 Z"
                fill="#1e3a8a"
              />
            </g>
          )}

          {/* Back Crown Peaks */}
          {head === 'crown' && (
            <g id="crown-back" transform={`translate(${hx}, ${hy}) rotate(${hAngle}) scale(${hScale})`}>
              {/* Back two recessed peaks */}
              <polygon points="-7,-1 -8,-10 -3,-5" fill="#b45309" />
              <polygon points="7,-1 8,-10 3,-5" fill="#b45309" />
            </g>
          )}
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. FRONT ACCESSORIES LAYER (Wraps in front of chin & chest)   */}
      {/* ------------------------------------------------------------- */}
      {isFront && (
        <>
          {/* ===================== NECK ACCESSORIES ===================== */}

          {/* 1. COZY WINTER SCARF (Plump 3D Volumetric Wrap) */}
          {neck === 'scarf' && (
            <g id="scarf-front" transform={`translate(${nx}, ${ny}) scale(${nScale})`}>
              <defs>
                <linearGradient id="scarfRollGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="40%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#9f1239" />
                </linearGradient>
                <linearGradient id="scarfTailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
              </defs>

              {/* Ambient drop shadow under scarf onto belly */}
              <ellipse cx="0" cy="14" rx={nw / 2 + 1} ry="6" fill="rgba(0,0,0,0.14)" />

              {/* Shadow cast under chin */}
              <path
                d={`M ${-nw / 2 + 2} 1 C ${-nw / 4} 6 ${nw / 4} 6 ${nw / 2 - 2} 1 L ${nw / 2 - 2} 4 C ${nw / 4} 9 ${-nw / 4} 9 ${-nw / 2 + 2} 4 Z`}
                fill="rgba(0,0,0,0.22)"
              />

              {/* Main Plump Curved Donut Collar */}
              <path
                d={`M ${-nw / 2} 1 C ${-nw / 4} 9 ${nw / 4} 9 ${nw / 2} 1 C ${nw / 2 + 2} 8 ${nw / 4} 16 0 16 C ${-nw / 4} 16 ${-nw / 2 - 2} 8 ${-nw / 2} 1 Z`}
                fill="url(#scarfRollGrad)"
                stroke="#9f1239"
                strokeWidth="0.8"
              />

              {/* Soft 3D Tubular Highlight Arc along the top curvature */}
              <path
                d={`M ${-nw / 2 + 3} 3 C ${-nw / 4} 10 ${nw / 4} 10 ${nw / 2 - 3} 3`}
                stroke="#fda4af"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.55"
              />

              {/* Knitted Ribbing Stitches */}
              {[-12, -6, 0, 6, 12].map((xOffset) => (
                <line
                  key={xOffset}
                  x1={xOffset * 0.9}
                  y1="5"
                  x2={xOffset * 0.95}
                  y2="13"
                  stroke="#fda4af"
                  strokeWidth="0.8"
                  opacity="0.35"
                  strokeLinecap="round"
                />
              ))}

              {/* Shadow cast by the knot & draping tail */}
              <path
                d={`M ${4 * flip} 8 L ${16 * flip} 33 L ${25 * flip} 30 L ${16 * flip} 13 Z`}
                fill="rgba(0,0,0,0.18)"
              />

              {/* Volumetric Scarf Tail draping over chest */}
              <path
                d={`M ${2 * flip} 7 C ${3 * flip} 14 ${5 * flip} 22 ${10 * flip} 32 L ${19 * flip} 30 C ${16 * flip} 20 ${14 * flip} 12 ${13 * flip} 5 Z`}
                fill="url(#scarfTailGrad)"
                stroke="#9f1239"
                strokeWidth="0.8"
              />

              {/* Tail fold highlights & ribbing */}
              <line
                x1={6 * flip}
                y1="11"
                x2={13 * flip}
                y2="28"
                stroke="#fda4af"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.4"
              />

              {/* Fringed Tassels at tail end */}
              <line x1={11 * flip} y1="32" x2={12 * flip} y2="36" stroke="#fecdd3" strokeWidth="1.3" strokeLinecap="round" />
              <line x1={14 * flip} y1="31.5" x2={15.5 * flip} y2="35.5" stroke="#fecdd3" strokeWidth="1.3" strokeLinecap="round" />
              <line x1={17 * flip} y1="31" x2={18.5 * flip} y2="35" stroke="#fecdd3" strokeWidth="1.3" strokeLinecap="round" />

              {/* Overlapping Wrap Crossover Knot */}
              <path
                d={`M ${1 * flip} 3 C ${-2 * flip} 8 ${8 * flip} 12 ${12 * flip} 6 C ${14 * flip} 2 ${4 * flip} -1 ${1 * flip} 3 Z`}
                fill="#e11d48"
                stroke="#9f1239"
                strokeWidth="0.8"
              />
              <circle cx={6 * flip} cy="5" r="1.5" fill="#fda4af" opacity="0.6" />
            </g>
          )}

          {/* 2. GOLD BELL (Curved Collar with 3D Spherical Bell) */}
          {neck === 'bell' && (
            <g id="bell-front" transform={`translate(${nx}, ${ny}) scale(${nScale})`}>
              {/* Drop shadow on chest */}
              <ellipse cx="0" cy="11" rx="8" ry="4" fill="rgba(0,0,0,0.15)" />

              {/* Front Curved Collar Band */}
              <path
                d={`M ${-nw / 2 + 1} 1 C ${-nw / 4} 6 ${nw / 4} 6 ${nw / 2 - 1} 1 L ${nw / 2 - 1} 5 C ${nw / 4} 10 ${-nw / 4} 10 ${-nw / 2 + 1} 5 Z`}
                fill="#dc2626"
                stroke="#991b1b"
                strokeWidth="0.8"
              />

              {/* Collar Highlight */}
              <path
                d={`M ${-nw / 2 + 4} 2.5 C ${-nw / 4} 7 ${nw / 4} 7 ${nw / 2 - 4} 2.5`}
                stroke="#fca5a5"
                strokeWidth="0.8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Brass Bell Ring Bail */}
              <ellipse cx="0" cy="5" rx="2.5" ry="1.8" fill="none" stroke="#b45309" strokeWidth="1" />

              {/* 3D Golden Spherical Bell */}
              <circle cx="0" cy="9.5" r="6" fill="url(#bellShineGrad)" stroke="#b45309" strokeWidth="0.9" />
              <defs>
                <radialGradient id="bellShineGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#b45309" />
                </radialGradient>
              </defs>

              {/* Bell Cut Slit & Clapper */}
              <line x1="-3.5" y1="11" x2="3.5" y2="11" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="0" cy="11.8" r="1.3" fill="#451a03" />

              {/* Specular White Highlight */}
              <circle cx="-2" cy="7.5" r="1.2" fill="#ffffff" opacity="0.9" />
            </g>
          )}

          {/* 3. DAPPER BOWTIE (3D Folded Silk Wings) */}
          {neck === 'bowtie' && (
            <g id="bowtie-front" transform={`translate(${nx}, ${ny + 2}) scale(${nScale})`}>
              {/* Drop shadow on chest */}
              <ellipse cx="0" cy="8" rx="14" ry="4" fill="rgba(0,0,0,0.16)" />

              {/* Left Wing (Back fold shadow + front satin) */}
              <polygon points="-16,-6 -1,0 -16,6" fill="#1e1b4b" stroke="#0f172a" strokeWidth="0.7" />
              <polygon points="-15,-5 -2,0 -15,5" fill="#312e81" />
              <path d="M -15 -5 L -2 0 L -15 0 Z" fill="#4338ca" opacity="0.7" />

              {/* Right Wing */}
              <polygon points="16,-6 1,0 16,6" fill="#1e1b4b" stroke="#0f172a" strokeWidth="0.7" />
              <polygon points="15,-5 2,0 15,5" fill="#312e81" />
              <path d="M 15 -5 L 2 0 L 15 0 Z" fill="#4338ca" opacity="0.7" />

              {/* Center Ribbon Knot */}
              <rect x="-3.5" y="-4" width="7" height="8" rx="2.5" fill="#be123c" stroke="#9f1239" strokeWidth="0.8" />
              <rect x="-2.5" y="-3" width="5" height="6" rx="1.5" fill="#e11d48" />
              <line x1="-1" y1="-2" x2="-1" y2="2" stroke="#fda4af" strokeWidth="1" strokeLinecap="round" />
            </g>
          )}

          {/* 4. HEART LOCKET (Catenary Chain with 3D Ruby Pendant) */}
          {neck === 'heart_locket' && (
            <g id="heart-locket-front" transform={`translate(${nx}, ${ny}) scale(${nScale})`}>
              {/* Gold Chain Catenary Curve */}
              <path
                d={`M ${-nw / 2 + 2} -2 Q 0 9 ${nw / 2 - 2} -2`}
                fill="none"
                stroke="#d97706"
                strokeWidth="1.4"
                strokeDasharray="2 1.2"
              />
              <path
                d={`M ${-nw / 2 + 2} -2 Q 0 9 ${nw / 2 - 2} -2`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.8"
              />

              {/* Drop shadow of pendant on fur */}
              <ellipse cx="0" cy="16" rx="6" ry="3.5" fill="rgba(0,0,0,0.18)" />

              {/* Locket Bail Ring */}
              <circle cx="0" cy="7.5" r="2" fill="none" stroke="#d97706" strokeWidth="1.2" />

              {/* Gold Bezel Frame */}
              <path
                d="M 0 8.5 C 0 6.5 -4 4.5 -6.5 7 C -9 9.5 -6 13.5 0 18 C 6 13.5 9 9.5 6.5 7 C 4 4.5 0 6.5 0 8.5 Z"
                fill="#d97706"
                stroke="#b45309"
                strokeWidth="0.8"
              />

              {/* 3D Ruby Gemstone */}
              <path
                d="M 0 9.5 C 0 7.8 -3.5 6 -5.5 8 C -7.5 10 -5 13.2 0 17 C 5 13.2 7.5 10 5.5 8 C 3.5 6 0 7.8 0 9.5 Z"
                fill="url(#rubyGemGrad)"
              />
              <defs>
                <linearGradient id="rubyGemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="50%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#881337" />
                </linearGradient>
              </defs>

              {/* Gem Facet Specular Highlight */}
              <path
                d="M 0 10.5 C 0 9 -2.5 7.5 -4 9 C -5 10.5 -3.5 12 0 14.5 Z"
                fill="#ffffff"
                opacity="0.75"
              />
            </g>
          )}

          {/* 5. WILDFLOWER BANDANA (Folded Triangle with Pattern & Creases) */}
          {neck === 'bandana' && (
            <g id="bandana-front" transform={`translate(${nx}, ${ny}) scale(${nScale})`}>
              {/* Drop shadow on belly */}
              <polygon points={`0,17 ${-nw / 2 + 2},5 ${nw / 2 - 2},5`} fill="rgba(0,0,0,0.16)" />

              {/* Folded Triangle Cloth */}
              <polygon
                points={`0,15 ${-nw / 2},1 ${nw / 2},1`}
                fill="#dc2626"
                stroke="#991b1b"
                strokeWidth="0.8"
              />

              {/* Center Fabric Crease */}
              <line x1="0" y1="2" x2="0" y2="14" stroke="#991b1b" strokeWidth="1" />
              <line x1="-1" y1="2" x2="-1" y2="13" stroke="#ef4444" strokeWidth="0.8" />

              {/* Rolled Top Collar Band */}
              <path
                d={`M ${-nw / 2} 1 C ${-nw / 4} 6 ${nw / 4} 6 ${nw / 2} 1 L ${nw / 2} 4 C ${nw / 4} 9 ${-nw / 4} 9 ${-nw / 2} 4 Z`}
                fill="#b91c1c"
              />

              {/* White Polka Dots in Perspective */}
              <circle cx="0" cy="6" r="1.1" fill="#ffffff" opacity="0.9" />
              <circle cx="-7" cy="4" r="0.9" fill="#ffffff" opacity="0.9" />
              <circle cx="7" cy="4" r="0.9" fill="#ffffff" opacity="0.9" />
              <circle cx="-4" cy="9" r="0.8" fill="#ffffff" opacity="0.9" />
              <circle cx="4" cy="9" r="0.8" fill="#ffffff" opacity="0.9" />
              <circle cx="0" cy="11.5" r="0.7" fill="#ffffff" opacity="0.9" />
            </g>
          )}

          {/* ===================== EYEWEAR ACCESSORIES ===================== */}

          {/* COOL SHADES / SUNGLASSES (Matched to exact eye spacing & angle) */}
          {head === 'sunglasses' && (
            <g id="sunglasses-front" transform={`translate(${ex}, ${ey}) rotate(${eAngle}) scale(${eScale})`}>
              {/* Left Lens Center: -eyeSpacing / 2 */}
              {/* Right Lens Center: +eyeSpacing / 2 */}
              {(() => {
                const halfSpacing = p.eyeSpacing / 2;
                const lensW = 14;
                const lensH = 11;
                return (
                  <>
                    {/* Shadow under glasses */}
                    <ellipse cx={-halfSpacing} cy="4" rx="8" ry="3" fill="rgba(0,0,0,0.18)" />
                    <ellipse cx={halfSpacing} cy="4" rx="8" ry="3" fill="rgba(0,0,0,0.18)" />

                    {/* Frame Temples wrapping back into fur */}
                    <line x1={-halfSpacing - lensW / 2} y1="-1" x2={-halfSpacing - lensW / 2 - 6} y2="-3" stroke="#09090b" strokeWidth="2.4" strokeLinecap="round" />
                    <line x1={halfSpacing + lensW / 2} y1="-1" x2={halfSpacing + lensW / 2 + 6} y2="-3" stroke="#09090b" strokeWidth="2.4" strokeLinecap="round" />

                    {/* Bridge */}
                    <rect x="-4" y="-3" width="8" height="2.5" rx="1.2" fill="#09090b" />
                    <line x1="-3" y1="-2" x2="3" y2="-2" stroke="#27272a" strokeWidth="0.8" />

                    {/* Left Frame & Polarized Dark Lens */}
                    <rect x={-halfSpacing - lensW / 2} y={-lensH / 2} width={lensW} height={lensH} rx="3.5" fill="#09090b" stroke="#18181b" strokeWidth="0.8" />
                    <rect x={-halfSpacing - lensW / 2 + 1} y={-lensH / 2 + 1} width={lensW - 2} height={lensH - 2} rx="2.5" fill="#18181b" />
                    {/* Glint Reflection Streak */}
                    <path
                      d={`M ${-halfSpacing - lensW / 2 + 3} ${-lensH / 2 + 2} L ${-halfSpacing + 3} ${-lensH / 2 + 2} L ${-halfSpacing - lensW / 2 + 3} ${lensH / 2 - 2} Z`}
                      fill="#ffffff"
                      opacity="0.45"
                    />

                    {/* Right Frame & Polarized Dark Lens */}
                    <rect x={halfSpacing - lensW / 2} y={-lensH / 2} width={lensW} height={lensH} rx="3.5" fill="#09090b" stroke="#18181b" strokeWidth="0.8" />
                    <rect x={halfSpacing - lensW / 2 + 1} y={-lensH / 2 + 1} width={lensW - 2} height={lensH - 2} rx="2.5" fill="#18181b" />
                    {/* Glint Reflection Streak */}
                    <path
                      d={`M ${halfSpacing - lensW / 2 + 3} ${-lensH / 2 + 2} L ${halfSpacing + 3} ${-lensH / 2 + 2} L ${halfSpacing - lensW / 2 + 3} ${lensH / 2 - 2} Z`}
                      fill="#ffffff"
                      opacity="0.45"
                    />
                  </>
                );
              })()}
            </g>
          )}

          {/* ===================== HEAD ACCESSORIES ===================== */}

          {/* 1. ROYAL CROWN (3D Curved Skull Rim + Ruby Cabochons) */}
          {head === 'crown' && (
            <g id="crown-front" transform={`translate(${hx}, ${hy}) rotate(${hAngle}) scale(${hScale})`}>
              {/* Ambient drop shadow under crown onto skull */}
              <ellipse cx="0" cy="1" rx="14" ry="3" fill="rgba(0,0,0,0.18)" />

              {/* 3 Front Peaks with Gradient */}
              <polygon
                points="-12,-1 -13,-12 -6,-5 0,-16 6,-5 13,-12 12,-1"
                fill="url(#crownGoldGrad)"
                stroke="#b45309"
                strokeWidth="0.8"
              />
              <defs>
                <linearGradient id="crownGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              {/* Curved Base Band hugging the skull */}
              <ellipse cx="0" cy="0" rx="13" ry="3.2" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
              <ellipse cx="0" cy="-0.5" rx="12" ry="2.2" fill="#fbbf24" />

              {/* Embedded Center Ruby Cabochon */}
              <circle cx="0" cy="-16" r="2.2" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.6" />
              <circle cx="-0.6" cy="-16.8" r="0.8" fill="#ffffff" />

              {/* Left Blue Sapphire Gem */}
              <circle cx="-13" cy="-12" r="1.8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.6" />
              <circle cx="-13.5" cy="-12.6" r="0.6" fill="#ffffff" />

              {/* Right Emerald Gem */}
              <circle cx="13" cy="-12" r="1.8" fill="#10b981" stroke="#047857" strokeWidth="0.6" />
              <circle cx="12.5" cy="-12.6" r="0.6" fill="#ffffff" />

              {/* Band Ruby Inlay */}
              <rect x="-2.5" y="-1.5" width="5" height="2.5" rx="0.8" fill="#ef4444" />
              <circle cx="-1" cy="-1" r="0.5" fill="#ffffff" />

              {/* Specular Ridge Glint */}
              <line x1="-3" y1="-8" x2="-2" y2="-4" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}

          {/* 2. SILK RIBBON BOW (3D Velvet Loops & Tails) */}
          {head === 'bow' && (
            <g id="bow-front" transform={`translate(${hx + 6 * flip}, ${hy + 2}) rotate(${14 * flip + hAngle}) scale(${hScale})`}>
              {/* Drop shadow on fur */}
              <ellipse cx="0" cy="5" rx="9" ry="4" fill="rgba(0,0,0,0.18)" />

              {/* Left Ribbon Loop */}
              <path
                d="M 0 0 C -12 -10 -15 8 0 2 Z"
                fill="#f43f5e"
                stroke="#be123c"
                strokeWidth="0.8"
              />
              <path d="M -1 -1 C -8 -7 -10 4 -1 1 Z" fill="#9f1239" opacity="0.6" />

              {/* Right Ribbon Loop */}
              <path
                d="M 0 0 C 12 -10 15 8 0 2 Z"
                fill="#f43f5e"
                stroke="#be123c"
                strokeWidth="0.8"
              />
              <path d="M 1 -1 C 8 -7 10 4 1 1 Z" fill="#9f1239" opacity="0.6" />

              {/* Ribbon Tails */}
              <path d="M -2 2 Q -8 9 -9 16 L -4 14 Z" fill="#e11d48" stroke="#be123c" strokeWidth="0.6" />
              <path d="M 2 2 Q 8 9 9 16 L 4 14 Z" fill="#e11d48" stroke="#be123c" strokeWidth="0.6" />

              {/* Center Knot with Silk Bevel */}
              <circle cx="0" cy="0" r="3.5" fill="#fda4af" stroke="#be123c" strokeWidth="0.8" />
              <circle cx="-1" cy="-1" r="1" fill="#ffffff" />
            </g>
          )}

          {/* 3. SAKURA BLOSSOM (5 Layered Cupped Petals + Pollen) */}
          {head === 'flower' && (
            <g id="flower-front" transform={`translate(${hx + 8 * flip}, ${hy + 2}) rotate(${hAngle}) scale(${hScale})`}>
              {/* Drop shadow on fur */}
              <ellipse cx="0" cy="4" rx="8" ry="4" fill="rgba(0,0,0,0.18)" />

              {/* Leaf behind */}
              <ellipse cx="-8" cy="5" rx="4.5" ry="3" fill="#22c55e" stroke="#16a34a" strokeWidth="0.6" transform="rotate(-30 -8 5)" />
              <line x1="-10" y1="6" x2="-6" y2="4" stroke="#86efac" strokeWidth="0.7" />

              {/* 5 Layered Petals */}
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <g key={i} transform={`rotate(${angle})`}>
                  <ellipse
                    cx="0"
                    cy="-6.5"
                    rx="4.5"
                    ry="6"
                    fill="url(#sakuraPetalGrad)"
                    stroke="#f472b6"
                    strokeWidth="0.6"
                  />
                  {/* Petal cleft notch */}
                  <path d="M -0.5 -12 L 0 -11 L 0.5 -12" stroke="#f472b6" strokeWidth="0.6" fill="none" />
                </g>
              ))}
              <defs>
                <linearGradient id="sakuraPetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="60%" stopColor="#fbcfe8" />
                  <stop offset="100%" stopColor="#fff1f2" />
                </linearGradient>
              </defs>

              {/* Center Stamen & Golden Pollen */}
              <circle cx="0" cy="0" r="3.2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />
              <circle cx="-1" cy="-1" r="1" fill="#ffffff" />
            </g>
          )}

          {/* 4. BASEBALL CAP (3D Curved Visor & Stitching) */}
          {head === 'cap' && (
            <g id="cap-front" transform={`translate(${hx}, ${hy + 3}) rotate(${hAngle}) scale(${hScale})`}>
              {/* Drop shadow of visor on face */}
              <ellipse cx={-4 * flip} cy="4" rx="14" ry="4" fill="rgba(0,0,0,0.2)" />

              {/* Main Cap Crown Dome */}
              <path
                d="M -15 0 C -15 -14 15 -14 15 0 Z"
                fill="url(#capDomeGrad)"
                stroke="#1d4ed8"
                strokeWidth="0.8"
              />
              <defs>
                <linearGradient id="capDomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>

              {/* Seam Lines */}
              <path d="M 0 -14 Q 0 -6 0 0" stroke="#1e40af" strokeWidth="0.8" />
              <path d="M 0 -14 Q -7 -6 -10 0" stroke="#1e40af" strokeWidth="0.8" />
              <path d="M 0 -14 Q 7 -6 10 0" stroke="#1e40af" strokeWidth="0.8" />

              {/* Top Button */}
              <circle cx="0" cy="-14" r="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />

              {/* 3D Visor / Bill protruding outward with highlight */}
              <path
                d={`M ${-15 * flip} 0 C ${-22 * flip} 1 ${-23 * flip} 6 ${-13 * flip} 6 L ${12 * flip} 0 Z`}
                fill="#1e40af"
                stroke="#172554"
                strokeWidth="0.8"
              />
              <path
                d={`M ${-15 * flip} 1 C ${-21 * flip} 2 ${-22 * flip} 5 ${-14 * flip} 5`}
                stroke="#60a5fa"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />

              {/* Front Heart Emblem */}
              <circle cx="0" cy="-6" r="3.5" fill="#ffffff" />
              <path d="M 0 -7.5 C 0 -8.5 -1.5 -8.5 -2 -7 C -2.5 -5 0 -3.5 0 -3.5 C 0 -3.5 2.5 -5 2 -7 C 1.5 -8.5 0 -8.5 0 -7.5 Z" fill="#ef4444" />
            </g>
          )}

          {/* 5. TOP HAT (3D Charcoal Satin Cylinder with Crimson Band) */}
          {head === 'tophat' && (
            <g id="tophat-front" transform={`translate(${hx}, ${hy + 2}) rotate(${hAngle}) scale(${hScale})`}>
              {/* Drop shadow on forehead */}
              <ellipse cx="0" cy="3" rx="16" ry="3.5" fill="rgba(0,0,0,0.22)" />

              {/* Front Curved Brim */}
              <ellipse cx="0" cy="0" rx="18" ry="4" fill="#0f172a" stroke="#020617" strokeWidth="0.8" />
              <ellipse cx="0" cy="-0.5" rx="16" ry="2.8" fill="#1e293b" />

              {/* Cylinder Crown */}
              <path
                d="M -11 -1 L -9 -21 L 9 -21 L 11 -1 Z"
                fill="url(#tophatCylinderGrad)"
                stroke="#0f172a"
                strokeWidth="0.8"
              />
              <defs>
                <linearGradient id="tophatCylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="35%" stopColor="#334155" />
                  <stop offset="70%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* Flat Oval Lid */}
              <ellipse cx="0" cy="-21" rx="9" ry="2.5" fill="#334155" stroke="#1e293b" strokeWidth="0.6" />

              {/* Red Silk Ribbon Band */}
              <path d="M -10.8 -1.5 L -10.4 -6 L 10.4 -6 L 10.8 -1.5 Z" fill="#e11d48" />
              <line x1="-10.5" y1="-2" x2="10.5" y2="-2" stroke="#fda4af" strokeWidth="0.8" opacity="0.6" />

              {/* Gold Metallic Buckle */}
              <rect x="-3" y="-6" width="6" height="5" rx="0.8" fill="#f59e0b" stroke="#b45309" strokeWidth="0.6" />
              <rect x="-1.5" y="-4.8" width="3" height="2.6" fill="#e11d48" />
            </g>
          )}

          {/* 6. KAWAII SPROUT (Natural Organic Stem & Glowing Leaves) */}
          {head === 'sprout' && (
            <g id="sprout-front" transform={`translate(${hx}, ${hy + 1}) rotate(${hAngle}) scale(${hScale})`}>
              {/* Soil Mount */}
              <ellipse cx="0" cy="1" rx="3.5" ry="1.5" fill="#78350f" opacity="0.7" />

              {/* Curved Organic Stem */}
              <path
                d="M 0 1 Q -2 -7 0 -13"
                stroke="#15803d"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 0 1 Q -2 -7 0 -13"
                stroke="#22c55e"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Left Leaf Cup */}
              <path
                d="M 0 -13 C -8 -17 -11 -10 -1 -11 Z"
                fill="#4ade80"
                stroke="#16a34a"
                strokeWidth="0.8"
              />
              <line x1="-1" y1="-12" x2="-6" y2="-13.5" stroke="#bbf7d0" strokeWidth="0.8" strokeLinecap="round" />
              <circle cx="-4" cy="-14" r="0.7" fill="#ffffff" />

              {/* Right Leaf Cup */}
              <path
                d="M 0 -13 C 8 -18 12 -11 1 -11 Z"
                fill="#22c55e"
                stroke="#15803d"
                strokeWidth="0.8"
              />
              <line x1="1" y1="-12" x2="6" y2="-14" stroke="#86efac" strokeWidth="0.8" strokeLinecap="round" />
              <circle cx="4" cy="-14" r="0.7" fill="#ffffff" />
            </g>
          )}

          {/* 7. PARTY CONE HAT (Shaded Cone with Stripes & Fluffy Pompom) */}
          {head === 'party_hat' && (
            <g id="party-hat-front" transform={`translate(${hx}, ${hy + 1}) rotate(${hAngle}) scale(${hScale})`}>
              {/* Drop shadow on forehead */}
              <ellipse cx="0" cy="2" rx="10" ry="2.5" fill="rgba(0,0,0,0.2)" />

              {/* Main Cone */}
              <polygon points="-11,0 0,-25 11,0" fill="#f43f5e" stroke="#be123c" strokeWidth="0.6" />

              {/* Diagonal Spiral Stripes */}
              <polygon points="-8,-8 0,-25 3,-18 -3,-8" fill="#fbbf24" />
              <polygon points="-10,-1 0,-25 -4,-15 -9,-1" fill="#38bdf8" />

              {/* Curved Bottom Rim Arc */}
              <path d="M -11 0 Q 0 4 11 0" stroke="#facc15" strokeWidth="2.6" strokeLinecap="round" fill="none" />

              {/* Fluffy Textured Pompom */}
              <circle cx="0" cy="-26" r="3.8" fill="#facc15" stroke="#ca8a04" strokeWidth="0.6" />
              <circle cx="0" cy="-26" r="2.4" fill="#fef08a" />
              <circle cx="-1" cy="-27" r="0.8" fill="#ffffff" />
            </g>
          )}

          {/* 8. ANGEL HALO (Front Glowing Arc & Celestial Sparkles) */}
          {head === 'halo' && (
            <g id="halo-front" transform={`translate(${hx}, ${hy - 10}) rotate(${hAngle}) scale(${hScale})`}>
              {/* Ambient Glow */}
              <path
                d="M -18 0 C -18 6 18 6 18 0"
                fill="none"
                stroke="#fef08a"
                strokeWidth="4"
                opacity="0.6"
              />
              {/* Front Golden Ring Arc */}
              <path
                d="M -18 0 C -18 6 18 6 18 0"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M -17 0.5 C -17 5 17 5 17 0.5"
                fill="none"
                stroke="#fef08a"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Little Floating Stars */}
              <circle cx="-13" cy="2" r="1.1" fill="#ffffff" />
              <circle cx="13" cy="1" r="0.9" fill="#ffffff" />
            </g>
          )}
        </>
      )}
    </g>
  );
};
