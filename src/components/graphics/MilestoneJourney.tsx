'use client';

import React from 'react';

interface MilestoneJourneyProps {
  days: number;
  nextMilestone: number;
  className?: string;
}

export const MilestoneJourney: React.FC<MilestoneJourneyProps> = ({
  days,
  nextMilestone,
  className = '',
}) => {
  // Previous milestone baseline (e.g. 1000 if next is 1500, or 0)
  const milestones = [0, 100, 200, 365, 500, 730, 1000, 1500, 2000, 3000];
  const prevMilestone = milestones.filter((m) => m <= days).pop() || 0;

  const totalRange = nextMilestone - prevMilestone;
  const currentProgress = totalRange > 0 ? Math.min(Math.max((days - prevMilestone) / totalRange, 0.05), 0.95) : 0.5;

  // Path coordinates for a gentle curved S-wave trail
  // Start: (20, 35) -> End: (260, 35)
  const trailStartX = 25;
  const trailEndX = 255;
  const trailWidth = trailEndX - trailStartX;
  const markerX = trailStartX + trailWidth * currentProgress;

  return (
    <div className={`w-full select-none ${className}`}>
      <svg
        viewBox="0 0 280 65"
        className="w-full h-auto drop-shadow-2xs overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Progress Trail Gradient */}
          <linearGradient id="journeyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
          <linearGradient id="trackBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fecdd3" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </linearGradient>
        </defs>

        {/* Background Track (Dotted soft path) */}
        <path
          d="M 25 38 C 90 28, 190 48, 255 38"
          stroke="url(#trackBg)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Active Progress Path */}
        <path
          d={`M 25 38 C ${trailStartX + (markerX - trailStartX) * 0.4} ${
            38 - (markerX - trailStartX) * 0.06
          }, ${trailStartX + (markerX - trailStartX) * 0.8} ${
            38 + (markerX - trailStartX) * 0.06
          }, ${markerX} 38`}
          stroke="url(#journeyGlow)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Start Milestone Node */}
        <g transform="translate(25, 38)">
          <circle cx="0" cy="0" r="5" fill="#f43f5e" />
          <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
          <text
            x="0"
            y="17"
            textAnchor="middle"
            fill="#9f1239"
            fontSize="8.5"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            {prevMilestone}d
          </text>
        </g>

        {/* Next Milestone Goal Node */}
        <g transform="translate(255, 38)">
          <circle cx="0" cy="0" r="6" fill="#f43f5e" />
          <circle cx="0" cy="0" r="3" fill="#fbbf24" />
          <text
            x="0"
            y="17"
            textAnchor="middle"
            fill="#e11d48"
            fontSize="9"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            {nextMilestone}d 🏆
          </text>
        </g>

        {/* Current Position Marker (Lion 🦁 & Sea Lion 🦭 walking together) */}
        <g transform={`translate(${markerX}, 28)`} className="cursor-pointer transition-transform duration-300">
          {/* Glowing pin base */}
          <ellipse cx="0" cy="10" rx="9" ry="3.5" fill="rgba(244, 63, 94, 0.2)" />

          {/* Marker Pill */}
          <rect
            x="-20"
            y="-22"
            width="40"
            height="20"
            rx="10"
            fill="#ffffff"
            stroke="#f43f5e"
            strokeWidth="1.5"
            filter="drop-shadow(0 2px 4px rgba(244, 63, 94, 0.2))"
          />

          {/* Mini Lion and Sea Lion inside pill */}
          <text
            x="0"
            y="-8"
            textAnchor="middle"
            fontSize="11"
            fontFamily="sans-serif"
          >
            🦁🦭
          </text>

          {/* Arrow Pointer */}
          <path d="M -3 -2 L 3 -2 L 0 3 Z" fill="#f43f5e" />
        </g>
      </svg>
    </div>
  );
};
