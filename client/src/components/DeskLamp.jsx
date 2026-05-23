'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function DeskLamp({ isOn, onToggle }) {
  const lampRef = useRef(null);
  const chainRef = useRef(null);
  const bulbGlowRef = useRef(null);
  const beamRef = useRef(null);
  const bulbRef = useRef(null);
  const ringHintRef = useRef(null);

  // 1. Play realistic mechanical switch click sound (Web Audio API)
  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Node 1: Oscillator for the metal click (higher pitch, fast decay)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(800, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.015);
      gain1.gain.setValueAtTime(0.012, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

      // Node 2: Low-frequency spring sound (deeper hollow click)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(120, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.035);
      gain2.gain.setValueAtTime(0.025, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.015);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.035);
    } catch (e) {
      // Fail silently if browser blocks audio context prior to user interaction
    }
  };

  // 2. Continuous Idle Floating Animation (Subtle 3D sway)
  useEffect(() => {
    const floatAnim = gsap.to(lampRef.current, {
      y: -5,
      x: 1,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    return () => {
      floatAnim.kill();
    };
  }, []);

  // 3. Continuous Chain Swinging Animation
  const swingChain = () => {
    return gsap.to(chainRef.current, {
      rotation: 3,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: '97px 120px'
    });
  };

  useEffect(() => {
    const swingAnim = swingChain();
    return () => {
      swingAnim.kill();
    };
  }, []);

  // 4. Filment Startup Flicker effect (when switched ON)
  useEffect(() => {
    if (isOn) {
      // Reset targets opacity to prepare for flicker timeline
      gsap.set([bulbGlowRef.current, beamRef.current, bulbRef.current], { opacity: 0 });

      // Fast vintage micro-flicker timeline
      gsap.timeline()
        .to([bulbGlowRef.current, beamRef.current, bulbRef.current], { opacity: 0.15, duration: 0.04 })
        .to([bulbGlowRef.current, beamRef.current, bulbRef.current], { opacity: 0.05, duration: 0.03 })
        .to([bulbGlowRef.current, beamRef.current, bulbRef.current], { opacity: 0.85, duration: 0.05 })
        .to([bulbGlowRef.current, beamRef.current, bulbRef.current], { opacity: 0.1, duration: 0.04 })
        .to([bulbGlowRef.current, beamRef.current, bulbRef.current], { opacity: 0.45, duration: 0.04 })
        .to([bulbGlowRef.current, beamRef.current, bulbRef.current], { opacity: 1, duration: 0.1, ease: 'power2.in' });
    } else {
      // Smooth fade-out when toggled OFF
      gsap.to([bulbGlowRef.current, beamRef.current, bulbRef.current], {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [isOn]);

  // 5. Handle Click Trigger (Pull chain snapping physics + switch state)
  const handlePull = () => {
    playClickSound();

    // Kill any active idle sways to execute the pull physics cleanly
    gsap.killTweensOf(chainRef.current);

    gsap.timeline()
      .to(chainRef.current, {
        y: 13,
        rotation: 0,
        duration: 0.08,
        ease: 'power1.out'
      })
      .to(chainRef.current, {
        y: 0,
        duration: 0.45,
        ease: 'elastic.out(1.1, 0.35)'
      })
      .then(() => {
        // Resume continuous gentle swinging after snapping recoil completes
        swingChain();
      });

    onToggle();
  };

  return (
    <div 
      ref={lampRef}
      className="relative flex flex-col items-center select-none group/lamp pointer-events-auto z-20"
    >
      {/* 3D Volumetric layered radial blur behind the lamp */}
      <div
        className={`absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(253,186,116,0.18)_0%,rgba(0,0,0,0)_70%)] blur-2xl pointer-events-none transition-all duration-1000 ${
          isOn ? 'opacity-100 scale-110' : 'opacity-0 scale-95'
        }`}
      />

      <svg
        width="240"
        height="320"
        viewBox="0 0 240 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Gaussian blur for smooth volumetric light edges */}
          <filter id="soft-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          {/* Premium brass/metallic neck gradients */}
          <linearGradient id="gold-brass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fae5b6" />
            <stop offset="35%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#9e7c11" />
            <stop offset="100%" stopColor="#594403" />
          </linearGradient>
          <linearGradient id="dark-brass-hinge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#aa881b" />
            <stop offset="100%" stopColor="#3d2c01" />
          </linearGradient>
          
          {/* Conical pleated shade gradients */}
          <linearGradient id="shade-glass-off" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eae5d9" />
            <stop offset="60%" stopColor="#ccc6b8" />
            <stop offset="100%" stopColor="#a39d90" />
          </linearGradient>
          <radialGradient id="shade-glass-on" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fff6df" />
            <stop offset="70%" stopColor="#ffd273" />
            <stop offset="100%" stopColor="#cc8300" />
          </radialGradient>

          {/* Light bulb emission */}
          <radialGradient id="bulb-filament" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#fff2cc" />
            <stop offset="85%" stopColor="#ffb834" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffb834" stopOpacity="0" />
          </radialGradient>

          {/* Volumetric warm golden cone gradient */}
          <linearGradient id="volumetric-cone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffd885" stopOpacity="0.4" />
            <stop offset="20%" stopColor="#ffa62b" stopOpacity="0.18" />
            <stop offset="55%" stopColor="#ffa62b" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffa62b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Volumetric Light Cone with Gaussian Blur filter (layered behind frame) */}
        <polygon
          ref={beamRef}
          points="97,132 280,320 -86,320"
          fill="url(#volumetric-cone)"
          filter="url(#soft-blur)"
          className="pointer-events-none transition-all duration-1000 origin-top"
          style={{
            opacity: isOn ? 1 : 0,
            transform: isOn ? 'scaleY(1)' : 'scaleY(0.95)',
          }}
        />

        {/* 2. Lamp Base (Weighted circular brass pedestal) */}
        {/* Tier 1 - Bottom Ring */}
        <ellipse cx="165" cy="290" rx="35" ry="9" fill="url(#dark-brass-hinge)" stroke="#3d2c01" strokeWidth="0.5" />
        {/* Tier 2 - Beveled Ring */}
        <ellipse cx="165" cy="286" rx="28" ry="7" fill="url(#gold-brass)" stroke="#fae5b6" strokeWidth="0.5" />
        <path d="M 137 286 C 137 278, 193 278, 193 286 Z" fill="url(#dark-brass-hinge)" />
        <ellipse cx="165" cy="281" rx="26" ry="6" fill="url(#gold-brass)" />

        {/* 3. Curved Gooseneck Neck Stem */}
        {/* Sweeps gracefully from right base up, then arches left over the table */}
        <path
          d="M 165 278 C 165 180, 130 50, 97 90"
          fill="none"
          stroke="url(#gold-brass)"
          strokeWidth="6.5"
          strokeLinecap="round"
          className="drop-shadow-lg"
        />
        {/* Base and Head Joint Rings */}
        <circle cx="165" cy="277" r="5.5" fill="url(#dark-brass-hinge)" />
        <circle cx="97" cy="90" r="5" fill="url(#dark-brass-hinge)" />

        {/* 4. Socket Hinge and Holder */}
        <rect x="92" y="93" width="10" height="15" rx="1.5" fill="url(#dark-brass-hinge)" stroke="#261b01" strokeWidth="0.75" />
        <ellipse cx="97" cy="108" rx="8" ry="2.5" fill="url(#gold-brass)" />

        {/* 5. Glowing Filament Bulb (reveals below glass cone) */}
        <circle
          ref={bulbRef}
          cx="97"
          cy="128"
          r="10"
          fill="url(#bulb-filament)"
          className="pointer-events-none transition-all duration-300"
          style={{ opacity: isOn ? 1 : 0 }}
        />

        {/* 6. Conical Pleated Glass Shade */}
        {/* Features custom fluted bottom and detailed pleats for organic vintage glow */}
        <g className="cursor-pointer" onClick={handlePull}>
          {/* Glass Shade Outer Shape */}
          <path
            d="M 85 102 L 109 102 C 115 102, 137 112, 137 138 C 137 142, 57 142, 57 138 C 57 112, 79 102, 85 102 Z"
            fill={isOn ? 'url(#shade-glass-on)' : 'url(#shade-glass-off)'}
            stroke={isOn ? '#ffeebf' : '#635d51'}
            strokeWidth="1.2"
            className="transition-all duration-1000 drop-shadow-md"
          />

          {/* 3D Vertical Pleats Crease Lines */}
          <path d="M 97 102 L 97 142" stroke={isOn ? '#cc8300' : '#8c8679'} strokeWidth="1" strokeLinecap="round" className="opacity-45 transition-colors duration-1000" />
          <path d="M 97 102 L 77 141" stroke={isOn ? '#cc8300' : '#8c8679'} strokeWidth="1" strokeLinecap="round" className="opacity-45 transition-colors duration-1000" />
          <path d="M 97 102 L 117 141" stroke={isOn ? '#cc8300' : '#8c8679'} strokeWidth="1" strokeLinecap="round" className="opacity-45 transition-colors duration-1000" />
          <path d="M 97 102 L 63 139" stroke={isOn ? '#b87600' : '#7d776b'} strokeWidth="1" strokeLinecap="round" className="opacity-35 transition-colors duration-1000" />
          <path d="M 97 102 L 131 139" stroke={isOn ? '#b87600' : '#7d776b'} strokeWidth="1" strokeLinecap="round" className="opacity-35 transition-colors duration-1000" />
          <path d="M 97 102 L 69 140" stroke={isOn ? '#cc8300' : '#8c8679'} strokeWidth="1" strokeLinecap="round" className="opacity-40 transition-colors duration-1000" />
          <path d="M 97 102 L 125 140" stroke={isOn ? '#cc8300' : '#8c8679'} strokeWidth="1" strokeLinecap="round" className="opacity-40 transition-colors duration-1000" />

          {/* Soft highlight flare on top rim */}
          <path
            d="M 86 104 Q 97 102 108 104"
            fill="none"
            stroke={isOn ? '#ffffff' : '#f0ede6'}
            strokeWidth="1"
            className="opacity-40 pointer-events-none transition-colors duration-1000"
          />
        </g>

        {/* 7. Layered Radial Glow Overlay on Bulb base */}
        <ellipse
          ref={bulbGlowRef}
          cx="97"
          cy="138"
          rx="18"
          ry="6"
          fill="url(#bulb-filament)"
          className="pointer-events-none transition-all duration-300"
          style={{ opacity: isOn ? 1 : 0 }}
        />

        {/* 8. Pull Chain (Interactive snapping kinematics + swing) */}
        <g
          ref={chainRef}
          onClick={handlePull}
          className="cursor-pointer group/chain transition-transform duration-300 origin-[97px_120px] hover:rotate-[2deg]"
        >
          {/* Broad invisible grab boundary for easy clicking */}
          <rect x="87" y="120" width="20" height="98" fill="transparent" />

          {/* Chain beads */}
          <line
            x1="97"
            y1="120"
            x2="97"
            y2="208"
            stroke={isOn ? '#ffdf94' : '#857864'}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray="0 5.5"
            className="transition-colors duration-1000"
          />

          {/* Pulsing Beacon Hint (Interactive indicator when OFF) */}
          {!isOn && (
            <circle
              ref={ringHintRef}
              cx="97"
              cy="214"
              r="10"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
              className="pointer-events-none origin-[97px_214px] animate-ping opacity-45"
              style={{ animationDuration: '2.5s' }}
            />
          )}

          {/* Solid Brass Pull Handle Knob */}
          <circle
            cx="97"
            cy="214"
            r="6.5"
            fill={isOn ? 'url(#gold-brass)' : 'url(#dark-brass-hinge)'}
            stroke={isOn ? '#ffeabf' : '#3d2c01'}
            strokeWidth="0.75"
            className="transition-all duration-500 group-hover/chain:scale-110 origin-[97px_214px]"
          />
          {/* Mini metal highlight reflection */}
          <circle
            cx="95"
            cy="212"
            r="1.2"
            fill="#ffffff"
            className="opacity-55 pointer-events-none"
          />
        </g>
      </svg>

      {/* Elegant Hover Interaction Tooltip Tool */}
      <div className="absolute top-[235px] left-1/2 -translate-x-1/2 bg-[#1b1915]/95 backdrop-blur-md border border-[#ebd08b]/30 px-3.5 py-1.5 rounded-xl pointer-events-none opacity-0 group-hover/lamp:opacity-100 transition-opacity duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <span className="text-[10px] text-[#ebd08b] font-bold uppercase tracking-[0.15em] whitespace-nowrap">
          {isOn ? 'Turn Off Light' : 'Pull Chain to Light'}
        </span>
      </div>
    </div>
  );
}
