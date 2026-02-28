'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = 'white' }: SpotlightProps) {
  return (
    <svg
      className={cn(
        'absolute pointer-events-none animate-spotlight opacity-0',
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8" />
        </filter>
      </defs>
    </svg>
  );
}

/** Card with a subtle border glow on hover */
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative group rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm',
        'shadow-[0_0_0_1px_rgba(0,0,0,0.04)] hover:shadow-[0_0_30px_rgba(0,0,0,0.08)]',
        'dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.06)]',
        'transition-all duration-300',
        className
      )}
    >
      {/* Spotlight glow */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}
