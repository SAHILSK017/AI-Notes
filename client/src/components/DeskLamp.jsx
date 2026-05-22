'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';

export default function DeskLamp({ isOn, onToggle }) {
  const chainRef = useRef(null);

  const handlePull = () => {
    // Play switch sound using synthesized Web Audio API (extremely premium)
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}

    // Pull chain animation using GSAP elastic bounce-back
    if (chainRef.current) {
      gsap.timeline()
        .to(chainRef.current, { y: 14, duration: 0.1, ease: 'power1.out' })
        .to(chainRef.current, { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
    }

    onToggle();
  };

  return (
    <div className="relative flex flex-col items-center select-none group/lamp pointer-events-auto z-20">
      {/* Light glow behind the lamp */}
      <div
        className={`absolute top-12 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-amber-500/10 blur-[60px] pointer-events-none transition-all duration-700 ${
          isOn ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
        }`}
      />

      <svg
        width="200"
        height="280"
        viewBox="0 0 200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Metallic brass gradients */}
          <linearGradient id="brass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ebd08b" />
            <stop offset="40%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#b59424" />
            <stop offset="100%" stopColor="#7a6011" />
          </linearGradient>
          <linearGradient id="brass-grad-dark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b59424" />
            <stop offset="100%" stopColor="#574204" />
          </linearGradient>
          <linearGradient id="stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f5dc9e" />
            <stop offset="30%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#aa881b" />
            <stop offset="100%" stopColor="#5e4a0b" />
          </linearGradient>

          {/* Glass shade gradients */}
          <linearGradient id="shade-off" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a3b2c" />
            <stop offset="50%" stopColor="#36291d" />
            <stop offset="100%" stopColor="#1e1610" />
          </linearGradient>
          <radialGradient id="shade-on" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff8e7" />
            <stop offset="30%" stopColor="#ffd885" />
            <stop offset="70%" stopColor="#fca524" />
            <stop offset="100%" stopColor="#a35d03" />
          </radialGradient>

          {/* Light bulb gradient */}
          <radialGradient id="bulb-on" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fff2cc" />
            <stop offset="100%" stopColor="#ffc000" stopOpacity="0" />
          </radialGradient>

          {/* Light beam gradient */}
          <linearGradient id="beam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffd685" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#ffb834" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#ffb834" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffb834" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Light Cone/Beam (drawn behind the lamp base/stem for correct layering) */}
        <polygon
          points="115,115 175,115 270,278 -70,278"
          fill="url(#beam-grad)"
          className="transition-all duration-700 origin-top pointer-events-none"
          style={{
            opacity: isOn ? 1 : 0,
            transform: isOn ? 'scaleY(1)' : 'scaleY(0.95)',
          }}
        />

        {/* 2. Lamp Base */}
        {/* Tier 1 - Bottom Plate */}
        <ellipse cx="100" cy="250" rx="55" ry="12" fill="url(#brass-grad-dark)" stroke="#574204" strokeWidth="1" />
        {/* Tier 2 - Weighted Base */}
        <ellipse cx="100" cy="246" rx="45" ry="10" fill="url(#brass-grad)" />
        <path d="M 55 246 C 55 240, 145 240, 145 246 Z" fill="url(#brass-grad-dark)" />
        <ellipse cx="100" cy="240" rx="45" ry="8" fill="url(#brass-grad)" stroke="#ebd08b" strokeWidth="0.5" />

        {/* 3. Stem (Curved neck) */}
        {/* Rises from center of base, sweeps back then arches forward over the shade */}
        <path
          d="M 100 236 Q 75 140 142 95"
          fill="none"
          stroke="url(#stem-grad)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* Joint Accent Ring */}
        <circle cx="100" cy="235" r="7" fill="url(#brass-grad-dark)" />
        <circle cx="142" cy="95" r="6" fill="url(#brass-grad-dark)" />

        {/* 4. Socket Holder / Shade Connector */}
        {/* Hanging down slightly tilted */}
        <g transform="rotate(-12 142 95)">
          <rect x="137" y="99" width="10" height="16" rx="2" fill="url(#brass-grad-dark)" stroke="#3a2b02" strokeWidth="1" />
          <ellipse cx="142" cy="115" rx="7" ry="3" fill="url(#brass-grad)" />
        </g>

        {/* 5. Glowing Bulb (Behind glass shade) */}
        <ellipse
          cx="145"
          cy="124"
          rx="11"
          ry="13"
          fill="url(#bulb-on)"
          className="transition-opacity duration-300 pointer-events-none"
          style={{ opacity: isOn ? 1 : 0 }}
        />

        {/* 6. Glass Banker's Shade */}
        <path
          d="M 112 122 C 108 95, 182 95, 178 122 C 178 124, 112 124, 112 122 Z"
          fill={isOn ? 'url(#shade-on)' : 'url(#shade-off)'}
          stroke={isOn ? '#ffe2a3' : '#574204'}
          strokeWidth="1.5"
          className="transition-all duration-500 shadow-lg cursor-pointer"
          onClick={handlePull}
        />
        {/* Highlight line on top of shade */}
        <path
          d="M 125 106 Q 145 101 165 106"
          fill="none"
          stroke={isOn ? '#ffffff' : '#6b543d'}
          strokeWidth="1.5"
          strokeLinecap="round"
          className="transition-all duration-500 pointer-events-none opacity-40"
        />

        {/* 7. Pull Chain */}
        {/* Swings slightly on group hover to feel alive */}
        <g
          ref={chainRef}
          onClick={handlePull}
          className="cursor-pointer group/chain transition-transform duration-300 origin-[138px_118px] hover:rotate-[3deg]"
        >
          {/* Invisible trigger area around chain for easier clicking */}
          <rect x="130" y="118" width="16" height="85" fill="transparent" />

          {/* Chain beads (using dasharray trick) */}
          <line
            x1="138"
            y1="118"
            x2="138"
            y2="188"
            stroke={isOn ? '#ebd08b' : '#7d6139'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="0 6"
            className="transition-colors duration-500"
          />

          {/* Brass Pull Knob */}
          <circle
            cx="138"
            cy="194"
            r="6.5"
            fill={isOn ? 'url(#brass-grad)' : 'url(#brass-grad-dark)'}
            stroke={isOn ? '#ffd573' : '#453303'}
            strokeWidth="1"
            className="transition-all duration-500 group-hover/chain:scale-110 origin-[138px_194px]"
          />
          {/* Little metallic highlight dot on the knob */}
          <circle
            cx="136"
            cy="192"
            r="1.5"
            fill="#ffffff"
            className="opacity-40 pointer-events-none"
          />
        </g>
      </svg>

      {/* Tiny descriptive label/tooltip */}
      <span className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-[0.15em] mt-2 group-hover/lamp:text-primary/40 transition-colors duration-300 pointer-events-none">
        Pull Chain
      </span>
    </div>
  );
}
