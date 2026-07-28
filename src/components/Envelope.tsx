import { useRef, useState, useEffect } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

const CornerBlueRose = ({ className, id }: { className?: string; id?: string }) => (
  <img
    id={id}
    src="/blue-rose.png"
    alt="Blue watercolor rose illustration"
    className={`pointer-events-none select-none object-contain ${className}`}
  />
);

/**
 * Envelope — centered in viewport. Appears after fireworks.
 * Click to open → flap rotates → letter card slides up with scrollable message.
 * Blue roses get extravagant floating/shimmer/glow animations.
 * `onOpen` fires so parent can fade out the bouquet.
 */
export default function Envelope({
  visible,
  message,
  onOpen,
  onNext,
}: {
  visible: boolean;
  message?: string;
  onOpen?: () => void;
  onNext?: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<SVGSVGElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Entrance
  useGSAP(
    () => {
      if (!visible || !wrapperRef.current) return;

      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, y: 20, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)' }
      );

      // Idle float
      gsap.to(envelopeRef.current, {
        y: -3,
        duration: 2.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1,
      });
    },
    { scope: wrapperRef, dependencies: [visible] }
  );

  // Seal glow pulse
  useEffect(() => {
    if (visible && !isOpen) {
      gsap.to('.seal-glow', {
        opacity: 0.7,
        scale: 1.25,
        duration: 1.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, [visible, isOpen]);

  // Extravagant flower animations — triggered after letter card appears
  const animateFlowers = () => {
    const flowers = [
      { el: document.getElementById('flower-top-left'),     fromX: -80, fromY: -60, fromRot: -45, delay: 0.1 },
      { el: document.getElementById('flower-top-right'),    fromX:  80, fromY: -60, fromRot:  40, delay: 0.25 },
      { el: document.getElementById('flower-bottom-right'), fromX:  80, fromY:  60, fromRot:  45, delay: 0.35 },
      { el: document.getElementById('flower-bottom-left'),  fromX: -80, fromY:  60, fromRot: -40, delay: 0.5 },
      { el: document.getElementById('flower-accent-top'),   fromX:  0,  fromY: -70, fromRot: -30, delay: 0.6 },
      { el: document.getElementById('flower-accent-bottom'),fromX:  0,  fromY:  70, fromRot:  30, delay: 0.7 },
    ].filter(f => f.el !== null);

    // ── DRAMATIC ELASTIC ENTRANCE — each flower sweeps in from a different direction ──
    flowers.forEach(({ el, fromX, fromY, fromRot, delay }) => {
      gsap.fromTo(el!,
        { opacity: 0, x: fromX, y: fromY, scale: 0.2, rotation: fromRot },
        { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: 1.3, ease: 'elastic.out(1, 0.5)', delay }
      );
    });

    // ── PERPETUAL FLOATING — single clean hardware-accelerated 60fps loop per flower without layout thrashing ──
    flowers.forEach(({ el }, i) => {
      gsap.to(el!, {
        y: i % 2 === 0 ? -8 : 8,
        x: i % 2 === 0 ? 6 : -6,
        rotation: i % 2 === 0 ? 4 : -4,
        scale: 1.04,
        duration: 3 + (i * 0.3),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.4 + (i * 0.2),
        force3D: true,
      });
    });
  };

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    onOpen?.();

    gsap.killTweensOf(envelopeRef.current);
    gsap.killTweensOf('.seal-glow');

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

    tl.to(labelRef.current, { opacity: 0, y: -5, duration: 0.25 }, 0);

    tl.to('.envelope-flap', {
      rotateX: 180,
      duration: 0.65,
      transformOrigin: 'top center',
      ease: 'power2.inOut',
    }, 0.1);

    tl.to(envelopeRef.current, {
      scale: 0.5,
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: 'power3.in',
      onComplete: () => {
        if (envelopeRef.current) envelopeRef.current.style.display = 'none';
        if (labelRef.current) labelRef.current.style.display = 'none';
      }
    }, 0.5);

    tl.fromTo(
      letterRef.current,
      { opacity: 0, y: 60, scale: 0.85 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)',
        onComplete: animateFlowers,
      },
      0.8
    );
  };

  const wiggleTweenRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);

  const handleHover = () => {
    if (isOpen || !envelopeRef.current) return;
    wiggleTweenRef.current?.kill();
    const tl = gsap.timeline();
    tl.to(envelopeRef.current, { rotation: -4, y: -4, duration: 0.12, ease: 'power1.inOut' })
      .to(envelopeRef.current, { rotation: 4, duration: 0.14, ease: 'power1.inOut' })
      .to(envelopeRef.current, { rotation: -3, duration: 0.12, ease: 'power1.inOut' })
      .to(envelopeRef.current, { rotation: 3, duration: 0.12, ease: 'power1.inOut' })
      .to(envelopeRef.current, { rotation: -2, duration: 0.1, ease: 'power1.inOut' })
      .to(envelopeRef.current, { rotation: 0, y: -4, duration: 0.1, ease: 'power1.out' });
    wiggleTweenRef.current = tl;
  };

  const handleHoverOut = () => {
    if (isOpen || !envelopeRef.current) return;
    wiggleTweenRef.current?.kill();
    gsap.to(envelopeRef.current, { rotation: 0, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
  };


  if (!visible) return null;

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 flex items-center justify-center z-20 px-4 sm:px-6"
      style={{ opacity: 0 }}
    >
      <div className="relative flex flex-col items-center justify-center w-full">
        <svg
          ref={envelopeRef}
          viewBox="0 0 280 200"
          className="w-[60vw] sm:w-[45vw] md:w-[32vw] lg:w-[25vw] max-w-[310px] cursor-pointer relative z-20"
          style={{ filter: 'drop-shadow(0 8px 20px rgba(126, 180, 226, 0.3))' }}
          onClick={handleOpen}
          onMouseEnter={handleHover}
          onMouseLeave={handleHoverOut}
          xmlns="http://www.w3.org/2000/svg"
          role="button"
          aria-label="Open invitation envelope"
        >
          <rect x="10" y="48" width="260" height="148" rx="10" fill="#c4d5e6" opacity="0.3" />
          <rect x="10" y="45" width="260" height="145" rx="10" fill="#e8eef8" stroke="#c4d5e6" strokeWidth="1.5" />

          <rect x="30" y="58" width="220" height="95" rx="5" fill="#ffffff" opacity="0.5" />
          <line x1="52" y1="80" x2="195" y2="80" stroke="#d0dcea" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52" y1="96" x2="175" y2="96" stroke="#d0dcea" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52" y1="112" x2="155" y2="112" stroke="#d0dcea" strokeWidth="1.5" strokeLinecap="round" />

          <path d="M10,190 L140,128 L270,190" fill="none" stroke="#d0dcea" strokeWidth="0.8" opacity="0.4" />
          <path d="M10,45 L140,120" fill="none" stroke="#d0dcea" strokeWidth="0.6" opacity="0.3" />
          <path d="M270,45 L140,120" fill="none" stroke="#d0dcea" strokeWidth="0.6" opacity="0.3" />

          <path
            className="envelope-flap"
            d="M10,45 L140,-5 L270,45 Z"
            fill="#a8ceed"
            stroke="#8ab8d8"
            strokeWidth="1.5"
            strokeLinejoin="round"
            style={{ transformOrigin: '140px 45px' }}
          />
          <path
            className="envelope-flap"
            d="M22,45 L140,2 L258,45 Z"
            fill="#b8d4f0"
            opacity="0.35"
            style={{ transformOrigin: '140px 45px' }}
          />

          <circle className="seal-glow" cx="140" cy="118" r="18" fill="#7eb4e2" opacity="0.15" />
          <circle cx="140" cy="118" r="13" fill="#7eb4e2" opacity="0.65" />
          <circle cx="140" cy="118" r="8" fill="#5a9ad4" opacity="0.55" />
          <path d="M140,115 C138,112 134,112 134,116 C134,119 140,123 140,123 C140,123 146,119 146,116 C146,112 142,112 140,115Z" fill="#ffffff" opacity="0.8" />
        </svg>

        <p
          ref={labelRef}
          className="mt-4 text-sm sm:text-base font-medium tracking-widest animate-pulse relative z-20"
          style={{ color: '#6b8299' }}
        >
          {!isOpen ? 'Tap to open' : ''}
        </p>

        {/* ─── LETTER CARD — scrollable dialog with extravagant flower animations ─── */}
        <div
          ref={letterRef}
          onClick={() => {
            if (isOpen && onNext) onNext();
          }}
          className="absolute inset-0 flex flex-col items-center justify-center w-full max-w-[92vw] sm:max-w-lg md:max-w-xl mx-auto z-10 pointer-events-auto cursor-pointer"
          style={{ opacity: 0 }}
        >
          {/* Stacked Paper Container — Tilted/Slanted ("pa-slant") */}
          <div className="relative w-full py-6 sm:py-8 px-2 sm:px-4 transform -rotate-3 sm:-rotate-4 transition-transform duration-500 hover:-rotate-2">
            {/* Top-Left Blue Rose — animated via id */}
            <CornerBlueRose
              id="flower-top-left"
              className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-24 sm:w-32 md:w-36 h-24 sm:h-32 md:h-36 z-30 pointer-events-none opacity-85"
            />

            {/* Bottom-Right Blue Rose — animated via id */}
            <CornerBlueRose
              id="flower-bottom-right"
              className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-24 sm:w-32 md:w-36 h-24 sm:h-32 md:h-36 z-30 rotate-180 pointer-events-none opacity-85"
            />

            {/* Bottom tilted paper sheet 1 */}
            <div
              className="absolute inset-x-4 inset-y-6 bg-white rounded-md shadow-lg transform rotate-4 border border-slate-200/80"
              style={{ boxShadow: '0 12px 25px rgba(0,0,0,0.08)' }}
            />
            {/* Middle tilted paper sheet 2 */}
            <div
              className="absolute inset-x-2 inset-y-5 bg-white rounded-md shadow-md transform rotate-2 border border-slate-200/80"
              style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}
            />

            {/* Main Top White Paper Sheet — responsive max-height for mobile */}
            <div
              className="relative bg-white rounded-md shadow-2xl border border-slate-100 transition-all duration-300 z-10 flex flex-col"
              style={{
                boxShadow: '0 20px 45px rgba(30, 41, 59, 0.15)',
                maxHeight: 'clamp(260px, 65vh, 600px)',
              }}
            >
              {/* Title — always visible at top */}
              <div className="px-6 sm:px-10 md:px-14 pt-6 sm:pt-10 pb-3 sm:pb-4 shrink-0 border-b border-slate-100/60">
                <h2
                  className="text-2xl sm:text-4xl md:text-5xl font-normal mb-1 tracking-wide select-none relative z-10 text-center"
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    color: '#476b92',
                    textShadow: '0 2px 4px rgba(71, 107, 146, 0.15)',
                  }}
                >
                  A letter for you
                </h2>
              </div>

              {/* Scrollable Message Body — fully responsive */}
              <div
                className="overflow-y-auto overscroll-contain px-6 sm:px-10 md:px-12 pt-2 pb-8 sm:pb-10 flex-1 min-h-0 custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="text-left leading-[1.65] sm:leading-[1.75] text-[11px] sm:text-xs md:text-sm font-normal space-y-3 sm:space-y-3.5 tracking-wide text-slate-700/90"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {(message || 'Your message will appear here.').split('\n').map((paragraph, index) =>
                    paragraph.trim() ? (
                      <p key={index} className="italic">
                        {paragraph}
                      </p>
                    ) : null
                  )}
                </div>
              </div>

              {/* Subtle scroll fade hint at bottom when overflowing */}
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent rounded-b-md pointer-events-none z-20" />
            </div>
          </div>

          {/* Clean Label outside the message card! Tap anywhere to transition! */}
          {onNext && (
            <p className="mt-3 sm:mt-6 text-center text-[10px] sm:text-xs font-semibold tracking-widest uppercase animate-pulse text-slate-500 select-none">
              Tap anywhere to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
