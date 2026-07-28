import { useRef, useEffect, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/**
 * BlueBouquet — Extravagant lush bouquet with 15 blue flowers, filler buds,
 * sparkle particles, grass, wrapper and ribbon.
 * Sized larger on desktop, responsive on mobile.
 */
export default function BlueBouquet({
  onComplete,
  fadeOut,
}: {
  onComplete?: () => void;
  fadeOut?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showCongrats, setShowCongrats] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          startIdleAnimations();
          // Let user admire the flowers for 3.5 seconds, then FADE OUT / REMOVE THE FLOWERS completely so they do not overlap the congratulations text!
          setTimeout(() => {
            gsap.to('.bouquet-svg-container', {
              opacity: 0,
              scale: 0.85,
              duration: 1.0,
              ease: 'power2.inOut',
              onComplete: () => {
                setShowCongrats(true);
                onComplete?.();
              },
            });
          }, 3500);
        },
      });

      // Whole bouquet fades in gently first
      tl.fromTo(
        '.bouquet-group',
        { scale: 0.6, opacity: 0, transformOrigin: 'center bottom' },
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' }
      );

      // Wrapper and ribbon appear first (the base)
      tl.fromTo(
        '.b-wrapper',
        { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' },
        { opacity: 1, scaleY: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
        '-=0.8'
      );

      tl.fromTo(
        '.b-ribbon',
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.6, stagger: 0.08 },
        '-=0.4'
      );

      // Stems grow upward — slow and graceful
      tl.fromTo(
        '.b-stem',
        { scaleY: 0, transformOrigin: 'bottom center' },
        { scaleY: 1, duration: 1.2, stagger: 0.08, ease: 'power2.out' },
        '-=0.4'
      );

      // Leaves unfurl — one by one
      tl.fromTo(
        '.b-leaf',
        { scale: 0, opacity: 0, transformOrigin: 'bottom center' },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'back.out(1.8)' },
        '-=0.8'
      );

      // Petals bloom — PETAL BY PETAL, slow and beautiful
      tl.fromTo(
        '.b-petal',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(1.6)' },
        '-=0.5'
      );

      // Centers appear — one by one after their petals
      tl.fromTo(
        '.b-center',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(2.5)' },
        '-=0.6'
      );

      // Grass blades grow last — gentle wave
      tl.fromTo(
        '.grass-blade',
        { scaleY: 0, transformOrigin: 'bottom center' },
        { scaleY: 1, duration: 0.5, stagger: 0.02, ease: 'back.out(1.3)' },
        '-=0.8'
      );

      // Sparkle particles fade in after everything blooms
      tl.fromTo(
        '.sparkle-particle',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(2)' },
        '-=0.3'
      );

      // ── LIGHT BURST — soft, subtle glow when bouquet finishes blooming ──
      tl.fromTo(
        '.bouquet-glow-aura',
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 0.25, duration: 1.2, ease: 'power2.out' },
        '-=1.5'
      );

      // Light burst flash (subtle and delicate)
      tl.fromTo(
        '.bouquet-light-burst',
        { scale: 0, opacity: 0.35 },
        { scale: 2.5, opacity: 0, duration: 1.5, ease: 'power2.out' },
        '-=1.0'
      );


      // Fairy dust rises up
      tl.fromTo(
        '.fairy-dust',
        { opacity: 0, scale: 0 },
        { opacity: 0.8, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' },
        '-=0.6'
      );

      // Origami butterflies float in
      tl.fromTo(
        '.b-butterfly',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(2)' },
        '-=0.8'
      );

    },
    { scope: containerRef }
  );

  const startIdleAnimations = () => {
    // ── 1. Whole-bouquet breathing & gentle sway (Hardware accelerated!) ──
    gsap.to('.bouquet-group', {
      y: -6,
      rotation: 1,
      duration: 3.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      force3D: true,
    });

    // ── 2. Individual flower group sway (Animate 15 parent groups instead of 150+ individual petals!) ──
    gsap.to('.b-flower-group', {
      rotation: 'random(-3, 3)',
      duration: 'random(2.5, 4)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.2, from: 'random' },
      force3D: true,
    });

    // ── 3. Sparkle particles — perpetual gentle twinkling ──
    gsap.to('.sparkle-particle', {
      opacity: 'random(0.3, 0.9)',
      scale: 'random(0.7, 1.2)',
      duration: 'random(1.5, 2.5)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.15, from: 'random' },
      force3D: true,
    });

    // ── 4. Aura glow pulse (Subtle, delicate breath without overshadowing) ──
    gsap.to('.bouquet-glow-aura', {
      scale: 1.05,
      opacity: 0.2,
      duration: 3.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      force3D: true,
    });

    // ── 5. Falling petals — lightweight hardware-accelerated drift without CPU frame modifiers ──
    // ── 6. Fairy dust — smooth floating without layout thrashing ──
    document.querySelectorAll('.fairy-dust').forEach((dust, idx) => {
      gsap.to(dust, {
        y: -15,
        opacity: 0.8,
        duration: 2.5 + (idx % 2),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        force3D: true,
      });
    });

    // ── 7. Origami Butterflies — gentle floating & wing flapping in the sky ──
    gsap.to('.b-butterfly', {
      y: 'random(-12, 12)',
      x: 'random(-10, 10)',
      rotation: 'random(-10, 10)',
      duration: 'random(3, 5)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.2, from: 'random' },
      force3D: true,
    });
    gsap.to('.b-butterfly-wing-l', {
      scaleX: 0.3,
      duration: 'random(0.35, 0.55)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.1, from: 'random' },
      force3D: true,
    });
    gsap.to('.b-butterfly-wing-r', {
      scaleX: 0.3,
      duration: 'random(0.35, 0.55)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.1, from: 'random' },
      force3D: true,
    });
  };

  // Fade-out on envelope open
  useEffect(() => {
    if (fadeOut && containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 0.4,
        opacity: 0,
        y: -60,
        duration: 0.9,
        ease: 'power3.inOut',
      });
    }
  }, [fadeOut]);

  // Editorial GSAP animation for the congratulations typography
  useEffect(() => {
    if (showCongrats && !fadeOut) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Gentle, refined entrance
      tl.fromTo(
        '.congrats-badge',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }
      );

      tl.fromTo(
        '.congrats-title',
        { y: 25, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.5'
      );

      tl.fromTo(
        '.congrats-subtitle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
        '-=0.7'
      );

      // Gentle cloud floating idle animation after entrance
      gsap.to('.congrats-content-wrapper', {
        y: -8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2,
      });
    }
  }, [showCongrats, fadeOut]);

  // Helper to generate a flower at a given position
  const Flower = ({ cx, cy, size, colors, stemPath, leaves }: {
    cx: number; cy: number; size: number;
    colors: [string, string, string];
    stemPath: string;
    leaves?: { d: string; fill: string }[];
  }) => (
    <g className="b-flower-group">
      <path className="b-stem" d={stemPath} fill="none" stroke="#6ba89a" strokeWidth={size > 10 ? '2.5' : '2'} strokeLinecap="round" />
      {leaves?.map((leaf, i) => (
        <path key={i} className="b-leaf" d={leaf.d} fill={leaf.fill} opacity="0.8" />
      ))}
      <g transform={`translate(${cx}, ${cy})`}>
        <ellipse className="b-petal" cx="0" cy={-size} rx={size * 0.75} ry={size} fill={colors[0]} />
        <ellipse className="b-petal" cx={size * 1.15} cy={-size * 0.35} rx={size * 0.75} ry={size} fill={colors[1]} transform="rotate(72)" />
        <ellipse className="b-petal" cx={size * 0.7} cy={size * 0.85} rx={size * 0.75} ry={size} fill={colors[2]} transform="rotate(144)" />
        <ellipse className="b-petal" cx={-size * 0.7} cy={size * 0.85} rx={size * 0.75} ry={size} fill={colors[1]} transform="rotate(216)" />
        <ellipse className="b-petal" cx={-size * 1.15} cy={-size * 0.35} rx={size * 0.75} ry={size} fill={colors[0]} transform="rotate(288)" />
        <circle className="b-center" cx="0" cy="0" r={size * 0.42} fill="#f0dfa0" />
        <circle className="b-center" cx="0" cy="0" r={size * 0.2} fill="#e8d08a" />
      </g>
    </g>
  );

  const grassBlades = [
    { x: 30, h: 38, r: -8 }, { x: 48, h: 30, r: 6 }, { x: 65, h: 42, r: -4 },
    { x: 82, h: 32, r: 7 }, { x: 98, h: 36, r: -5 }, { x: 115, h: 28, r: 4 },
    { x: 130, h: 44, r: -6 }, { x: 148, h: 34, r: 8 }, { x: 165, h: 38, r: -3 },
    { x: 180, h: 30, r: 5 }, { x: 198, h: 46, r: -7 }, { x: 215, h: 32, r: 4 },
    { x: 232, h: 40, r: -2 }, { x: 248, h: 35, r: 6 }, { x: 265, h: 42, r: -5 },
    { x: 282, h: 30, r: 7 }, { x: 298, h: 46, r: -4 }, { x: 315, h: 32, r: 3 },
    { x: 332, h: 38, r: -8 }, { x: 348, h: 34, r: 5 }, { x: 365, h: 44, r: -3 },
    { x: 382, h: 30, r: 6 }, { x: 398, h: 40, r: -5 }, { x: 415, h: 32, r: 4 },
    { x: 432, h: 36, r: -7 }, { x: 448, h: 34, r: 6 }, { x: 465, h: 30, r: -4 },
    { x: 480, h: 38, r: 5 }, { x: 495, h: 32, r: -6 }, { x: 510, h: 28, r: 4 },
    { x: 528, h: 36, r: -3 }, { x: 545, h: 42, r: 7 }, { x: 560, h: 30, r: -5 },
    { x: 575, h: 38, r: 4 },
  ];

  // Sparkle particle positions — scattered around the bouquet
  const sparkles = [
    { cx: 180, cy: 140, r: 2.5 }, { cx: 420, cy: 150, r: 2 }, { cx: 250, cy: 110, r: 3 },
    { cx: 350, cy: 105, r: 2.5 }, { cx: 150, cy: 200, r: 2 }, { cx: 450, cy: 195, r: 2.5 },
    { cx: 300, cy: 90, r: 3.5 }, { cx: 200, cy: 165, r: 2 }, { cx: 400, cy: 170, r: 2 },
    { cx: 270, cy: 130, r: 2.5 }, { cx: 330, cy: 125, r: 2 }, { cx: 160, cy: 230, r: 2 },
    { cx: 440, cy: 225, r: 2 }, { cx: 220, cy: 148, r: 1.8 }, { cx: 380, cy: 142, r: 1.8 },
    { cx: 290, cy: 100, r: 2 }, { cx: 310, cy: 150, r: 1.5 }, { cx: 240, cy: 175, r: 2.2 },
    { cx: 360, cy: 180, r: 2.2 }, { cx: 185, cy: 185, r: 1.5 }, { cx: 415, cy: 182, r: 1.5 },
    { cx: 275, cy: 155, r: 2.8 }, { cx: 325, cy: 160, r: 2.8 }, { cx: 210, cy: 200, r: 1.8 },
  ];

  // Falling petal data — scattered across the viewport

  // Fairy dust data — rising particles
  const fairyDust = Array.from({ length: 12 }, (_, i) => ({
    left: 20 + (i / 12) * 60 + (Math.random() - 0.5) * 10,
    bottom: 10 + Math.random() * 30,
    size: 3 + Math.random() * 5,
  }));

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full min-h-[580px] sm:min-h-[660px] md:min-h-[740px] h-full relative overflow-visible">
      {/* ── CENTERED OPEN-SKY EDITORIAL CONGRATULATIONS TYPOGRAPHY (NO BOX CONTAINER, NO FLOWERS OVERLAP!) ── */}
      {showCongrats && !fadeOut && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 px-3 sm:px-8">
          <div className="congrats-content-wrapper flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full my-auto py-6 sm:py-10">
            <div className="congrats-badge inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/85 border border-blue-200/70 shadow-sm backdrop-blur-md mb-4 sm:mb-6 md:mb-8">
              <span className="text-blue-500 text-xs sm:text-sm animate-pulse">✦</span>
              <span className="text-xs xs:text-sm sm:text-base font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#345376] whitespace-nowrap">
                Thesis 1 Defended
              </span>
              <span className="text-blue-500 text-xs sm:text-sm animate-pulse">✦</span>
            </div>

            <h1
              className="congrats-title text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-normal tracking-wide text-[#284361] mb-6 sm:mb-8 md:mb-10 drop-shadow-sm leading-[1.25] sm:leading-[1.3] px-2 sm:px-4 max-w-full flex flex-col items-center justify-center gap-3 sm:gap-5 md:gap-6"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              <span className="block text-4xl xs:text-5xl sm:text-6xl md:text-7xl text-[#36577b] opacity-95">
                Congratulations on
              </span>
              <span className="block text-5xl xs:text-6xl sm:text-7xl md:text-8xl text-[#1e3a59] font-medium drop-shadow-md">
                Your Victory!
              </span>
            </h1>

            <p className="congrats-subtitle text-xs xs:text-sm sm:text-base md:text-lg font-bold tracking-[0.15em] sm:tracking-[0.25em] text-[#3a628c] uppercase drop-shadow-2xs max-w-[92%] sm:max-w-2xl mx-auto leading-relaxed border border-blue-200/70 py-3.5 sm:py-4 px-6 sm:px-10 bg-white/60 backdrop-blur-md rounded-2xl sm:rounded-full shadow-sm text-center">
              ✦ So proud of all your hard work & amazing success ✦
            </p>
          </div>
        </div>
      )}

      <svg
        viewBox="0 0 600 480"
        preserveAspectRatio="xMidYMid meet"
        className="bouquet-svg-container w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-[45vw] max-w-[580px] h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Grass ground ── */}
        <g>
          <ellipse cx="300" cy="475" rx="280" ry="20" fill="#a8d5a2" opacity="0.3" />
          <ellipse cx="300" cy="478" rx="240" ry="14" fill="#8fca88" opacity="0.2" />

          {grassBlades.map((g, i) => (
            <path
              key={i}
              className="grass-blade"
              d={`M${g.x},478 Q${g.x + g.r},${478 - g.h * 0.6} ${g.x + g.r * 1.5},${478 - g.h}`}
              fill="none"
              stroke={i % 3 === 0 ? '#7ec8a8' : i % 3 === 1 ? '#8ad4b5' : '#6bb89a'}
              strokeWidth={i % 2 === 0 ? '2.5' : '2'}
              strokeLinecap="round"
              opacity={0.55 + (i % 4) * 0.08}
            />
          ))}

          {[70, 160, 250, 340, 430, 520].map((x, i) => (
            <g key={`tuft-${i}`}>
              <path className="grass-blade" d={`M${x},478 C${x - 3},465 ${x - 8},458 ${x - 13},452`} fill="none" stroke="#7ec8a8" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
              <path className="grass-blade" d={`M${x},478 C${x + 2},466 ${x + 7},460 ${x + 11},454`} fill="none" stroke="#8ad4b5" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
            </g>
          ))}
        </g>

        <g className="bouquet-group">
          {/* ── Wrapper ── */}
          <path className="b-wrapper" d="M220,370 L238,460 L362,460 L380,370 Q300,400 220,370Z" fill="#dce6f2" stroke="#c4d5e6" strokeWidth="1.2" />
          <path className="b-wrapper" d="M228,370 Q300,395 372,370 L365,408 Q300,420 235,408 Z" fill="#e8eef8" stroke="#c4d5e6" strokeWidth="0.8" />

          {/* ── Ribbon ── */}
          <ellipse className="b-ribbon" cx="300" cy="382" rx="32" ry="7" fill="#7eb4e2" opacity="0.8" />
          <path className="b-ribbon" d="M275,382 C266,396 258,410 262,414 C269,422 284,400 292,387" fill="none" stroke="#5a9ad4" strokeWidth="2.2" strokeLinecap="round" />
          <path className="b-ribbon" d="M325,382 C334,396 342,410 338,414 C331,422 316,400 308,387" fill="none" stroke="#5a9ad4" strokeWidth="2.2" strokeLinecap="round" />

          {/* ── FLOWER 1: Large center bloom ── */}
          <Flower cx={300} cy={165} size={16}
            colors={['#7eb4e2', '#6aa8db', '#8fc4ec']}
            stemPath="M300,370 C298,310 302,240 300,170"
            leaves={[
              { d: 'M300,300 C278,286 272,306 288,314 C296,317 298,308 300,300Z', fill: '#7ec8a8' },
              { d: 'M300,255 C320,238 328,258 314,266 C306,270 302,260 300,255Z', fill: '#8ad4b5' },
            ]}
          />

          {/* ── FLOWER 2: Upper left large ── */}
          <Flower cx={228} cy={185} size={14}
            colors={['#a8ceed', '#93c1e8', '#b4d6f0']}
            stemPath="M300,370 C285,320 250,260 230,190"
            leaves={[
              { d: 'M262,285 C244,272 238,292 254,300 C262,303 261,294 262,285Z', fill: '#7ec8a8' },
            ]}
          />

          {/* ── FLOWER 3: Upper right large ── */}
          <Flower cx={372} cy={185} size={14}
            colors={['#93c1e8', '#7eb4e2', '#a8ceed']}
            stemPath="M300,370 C315,320 350,260 370,190"
            leaves={[
              { d: 'M342,280 C358,266 366,286 350,294 C342,298 340,288 342,280Z', fill: '#8ad4b5' },
            ]}
          />

          {/* ── FLOWER 4: Mid-left medium ── */}
          <Flower cx={195} cy={218} size={11}
            colors={['#b4d6f0', '#a0c9eb', '#c0dff5']}
            stemPath="M300,370 C278,325 238,275 198,225"
            leaves={[
              { d: 'M240,300 C224,290 218,308 234,314 C240,316 240,308 240,300Z', fill: '#7ec8a8' },
            ]}
          />

          {/* ── FLOWER 5: Mid-right medium ── */}
          <Flower cx={405} cy={218} size={11}
            colors={['#a8ceed', '#b4d6f0', '#93c1e8']}
            stemPath="M300,370 C322,325 362,275 402,225"
            leaves={[
              { d: 'M365,295 C380,282 388,300 372,308 C364,312 363,302 365,295Z', fill: '#8ad4b5' },
            ]}
          />

          {/* ── FLOWER 6: Top center bud ── */}
          <Flower cx={295} cy={138} size={9}
            colors={['#c0dff5', '#a8ceed', '#b4d6f0']}
            stemPath="M300,370 C300,320 297,260 295,145"
            leaves={[
              { d: 'M297,240 C282,228 276,248 292,254 C298,256 297,248 297,240Z', fill: '#7ec8a8' },
            ]}
          />

          {/* ── FLOWER 7: Far left bud ── */}
          <Flower cx={165} cy={245} size={9}
            colors={['#b4d6f0', '#c0dff5', '#a8ceed']}
            stemPath="M300,370 C268,330 218,280 168,252"
          />

          {/* ── FLOWER 8: Far right bud ── */}
          <Flower cx={435} cy={245} size={9}
            colors={['#93c1e8', '#a8ceed', '#b4d6f0']}
            stemPath="M300,370 C332,330 382,280 432,252"
          />

          {/* ── FLOWER 9: Low-left accent ── */}
          <Flower cx={210} cy={260} size={8}
            colors={['#c0dff5', '#b4d6f0', '#a8ceed']}
            stemPath="M300,370 C275,340 240,300 212,268"
          />

          {/* ── FLOWER 10: Low-right accent ── */}
          <Flower cx={390} cy={260} size={8}
            colors={['#a8ceed', '#c0dff5', '#b4d6f0']}
            stemPath="M300,370 C325,340 360,300 388,268"
          />

          {/* ── FLOWER 11: Upper-left high bloom (NEW) ── */}
          <Flower cx={255} cy={148} size={12}
            colors={['#7eb4e2', '#93c1e8', '#a8ceed']}
            stemPath="M300,370 C290,310 270,240 257,155"
            leaves={[
              { d: 'M272,230 C256,218 250,238 266,244 C274,247 272,238 272,230Z', fill: '#8ad4b5' },
            ]}
          />

          {/* ── FLOWER 12: Upper-right high bloom (NEW) ── */}
          <Flower cx={345} cy={148} size={12}
            colors={['#93c1e8', '#7eb4e2', '#b4d6f0']}
            stemPath="M300,370 C310,310 330,240 343,155"
            leaves={[
              { d: 'M328,225 C344,212 350,232 334,240 C326,244 326,234 328,225Z', fill: '#7ec8a8' },
            ]}
          />

          {/* ── FLOWER 13: Top crown bloom (NEW) ── */}
          <Flower cx={300} cy={118} size={10}
            colors={['#8fc4ec', '#7eb4e2', '#a8ceed']}
            stemPath="M300,370 C300,300 300,220 300,125"
          />

          {/* ── FLOWER 14: Far-left low cascade (NEW) ── */}
          <Flower cx={145} cy={270} size={8}
            colors={['#b4d6f0', '#a8ceed', '#c0dff5']}
            stemPath="M300,370 C258,340 198,300 148,278"
            leaves={[
              { d: 'M195,310 C178,300 172,318 188,324 C196,326 194,316 195,310Z', fill: '#8ad4b5' },
            ]}
          />

          {/* ── FLOWER 15: Far-right low cascade (NEW) ── */}
          <Flower cx={455} cy={270} size={8}
            colors={['#a8ceed', '#b4d6f0', '#93c1e8']}
            stemPath="M300,370 C342,340 402,300 452,278"
            leaves={[
              { d: 'M410,308 C426,296 432,316 416,324 C408,328 406,316 410,308Z', fill: '#7ec8a8' },
            ]}
          />

          {/* ── Filler leaves for fullness ── */}
          <path className="b-leaf" d="M250,215 C232,202 226,222 244,230 C252,233 250,224 250,215Z" fill="#8ad4b5" opacity="0.4" />
          <path className="b-leaf" d="M355,210 C372,196 380,218 362,226 C354,230 352,220 355,210Z" fill="#7ec8a8" opacity="0.4" />
          <path className="b-leaf" d="M275,190 C260,178 254,198 270,205 C278,208 276,198 275,190Z" fill="#8ad4b5" opacity="0.35" />
          <path className="b-leaf" d="M330,185 C346,172 354,192 338,200 C330,204 328,194 330,185Z" fill="#7ec8a8" opacity="0.35" />
          <path className="b-leaf" d="M240,250 C222,240 218,258 234,264 C242,266 240,256 240,250Z" fill="#8ad4b5" opacity="0.35" />
          <path className="b-leaf" d="M365,245 C382,234 388,254 372,262 C364,266 362,254 365,245Z" fill="#7ec8a8" opacity="0.35" />
          {/* Extra filler leaves for the new flowers */}
          <path className="b-leaf" d="M260,170 C246,158 240,178 256,184 C264,187 262,178 260,170Z" fill="#7ec8a8" opacity="0.35" />
          <path className="b-leaf" d="M340,168 C356,156 362,176 346,184 C338,188 338,178 340,168Z" fill="#8ad4b5" opacity="0.35" />
          <path className="b-leaf" d="M175,258 C158,248 152,268 168,274 C176,276 174,266 175,258Z" fill="#7ec8a8" opacity="0.3" />
          <path className="b-leaf" d="M428,255 C444,244 450,264 434,272 C426,276 424,264 428,255Z" fill="#8ad4b5" opacity="0.3" />
        </g>

        {/* ── Sparkle particles floating around the bouquet ── */}
        <g>
          {sparkles.map((s, i) => (
            <g key={`sparkle-${i}`} className="sparkle-particle">
              {/* Diamond shape sparkle */}
              <path
                d={`M${s.cx},${s.cy - s.r * 1.8} L${s.cx + s.r},${s.cy} L${s.cx},${s.cy + s.r * 1.8} L${s.cx - s.r},${s.cy} Z`}
                fill={i % 3 === 0 ? '#c0dff5' : i % 3 === 1 ? '#f0dfa0' : '#d4b8f0'}
                opacity={0.6 + (i % 4) * 0.1}
              />
              {/* Tiny glow circle behind */}
              <circle
                cx={s.cx}
                cy={s.cy}
                r={s.r * 0.6}
                fill={i % 3 === 0 ? '#7eb4e2' : i % 3 === 1 ? '#e8d08a' : '#b89ae0'}
                opacity="0.3"
              />
            </g>
          ))}
        </g>
      </svg>

      {/* ── Glowing Aura behind bouquet ── */}
      <div
        className="bouquet-glow-aura absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none -z-10"
        style={{
          width: 'clamp(280px, 55vw, 500px)',
          height: 'clamp(280px, 55vw, 500px)',
          background: 'radial-gradient(circle, rgba(126,180,226,0.35) 0%, rgba(168,206,237,0.15) 40%, transparent 70%)',
          filter: 'blur(30px)',
          opacity: 0,
        }}
      />

      {/* ── Light burst flash on bloom ── */}
      <div
        className="bouquet-light-burst absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none -z-10"
        style={{
          width: 'clamp(200px, 40vw, 400px)',
          height: 'clamp(200px, 40vw, 400px)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(192,223,245,0.3) 30%, transparent 60%)',
          opacity: 0,
        }}
      />

      {/* ── Fairy Dust — tiny glowing orbs rising upward ── */}
      {fairyDust.map((d, i) => (
        <div
          key={`dust-${i}`}
          className="fairy-dust absolute pointer-events-none rounded-full"
          style={{
            left: `${d.left}%`,
            bottom: `${d.bottom}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            background: i % 3 === 0
              ? 'radial-gradient(circle, rgba(240,223,160,0.9), rgba(240,223,160,0))'
              : i % 3 === 1
                ? 'radial-gradient(circle, rgba(126,180,226,0.9), rgba(126,180,226,0))'
                : 'radial-gradient(circle, rgba(212,184,240,0.9), rgba(212,184,240,0))',
            boxShadow: i % 3 === 0
              ? '0 0 6px rgba(240,223,160,0.6)'
              : i % 3 === 1
                ? '0 0 6px rgba(126,180,226,0.6)'
                : '0 0 6px rgba(212,184,240,0.6)',
            opacity: 0,
          }}
        />
      ))}

    </div>
  );
}
