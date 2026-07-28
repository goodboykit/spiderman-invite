import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

const TopCornerImg = ({ className }: { className?: string }) => (
  <img
    src="/image%20copy%202.png"
    alt="Top corner decoration"
    className={`pointer-events-none select-none object-contain ${className}`}
  />
);

const BottomCornerImg = ({ className }: { className?: string }) => (
  <img
    src="/image%20copy.png"
    alt="Bottom corner decoration"
    className={`pointer-events-none select-none object-contain ${className}`}
  />
);

/**
 * HangoutQuestion — Uses the SAME tilted paper + watercolor flower design
 * as the Envelope letter card. Matches the blue/white theme exactly.
 */
export default function HangoutQuestion({
  visible,
  onNext,
}: {
  visible: boolean;
  onNext?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (visible && cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, scale: 0.88, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.3)' }
        );
      }
    },
    { dependencies: [visible] }
  );

  if (!visible) return null;

  return (
    <div
      onClick={() => onNext?.()}
      className="absolute inset-0 flex flex-col items-center justify-center z-40 px-4 sm:px-6 pointer-events-auto cursor-pointer select-none"
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-[90vw] sm:max-w-lg md:max-w-xl mx-auto"
        style={{ opacity: 0 }}
      >
        {/* Stacked Paper Container — same tilted/slanted style as the letter */}
        <div className="relative w-full py-6 sm:py-8 px-2 sm:px-4 transform -rotate-2 sm:-rotate-3 transition-transform duration-500 hover:-rotate-1">
          {/* Custom Theme Decorations */}
          <TopCornerImg className="absolute -top-8 -left-8 sm:-top-10 sm:-left-10 w-32 sm:w-40 md:w-44 h-32 sm:h-40 md:h-44 z-30 pointer-events-none opacity-95" />
          <BottomCornerImg className="absolute -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 w-32 sm:w-40 md:w-44 h-32 sm:h-40 md:h-44 z-30 pointer-events-none opacity-95" />

          {/* Stacked paper sheets behind */}
          <div
            className="absolute inset-x-4 inset-y-6 bg-white rounded-md shadow-lg transform rotate-3 border border-slate-200/80"
            style={{ boxShadow: '0 12px 25px rgba(0,0,0,0.08)' }}
          />
          <div
            className="absolute inset-x-2 inset-y-5 bg-white rounded-md shadow-md transform rotate-1 border border-slate-200/80"
            style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}
          />

          {/* Main White Paper */}
          <div
            className="relative bg-white rounded-md p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-100 z-10 text-center"
            style={{ boxShadow: '0 20px 45px rgba(30, 41, 59, 0.15)' }}
          >
            {/* Subtitle label */}
            <span
              className="text-sm sm:text-base font-bold uppercase tracking-[0.2em] block mb-2"
              style={{ color: '#5a8bbc', fontFamily: "'Poppins', sans-serif" }}
            >
              One small question
            </span>

            {/* Main question in elegant cursive — matches "A letter for you" */}
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal mb-3 sm:mb-4 tracking-wide select-none"
              style={{
                fontFamily: "'Great Vibes', cursive",
                color: '#476b92',
                textShadow: '0 2px 4px rgba(71, 107, 146, 0.15)',
              }}
            >
              Can I invite you to a movie hangout?
            </h2>

            {/* Custom Pepe GIF */}
            <div className="my-3 sm:my-4 relative w-48 sm:w-56 h-36 sm:h-44 mx-auto rounded-2xl overflow-hidden border-2 border-blue-100/80 shadow-md bg-gradient-to-br from-blue-50/90 to-indigo-50/60 flex flex-col items-center justify-center group transform hover:scale-105 transition-all duration-300">
              <img
                src="/xpepe-xrpl.gif"
                alt="Cute Pepe movie hangout GIF"
                className="w-full h-full object-contain opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            </div>

            {/* Description text — same Poppins italic style as the letter */}
            <p
              className="text-xs sm:text-sm md:text-base leading-relaxed italic max-w-md mx-auto"
              style={{
                color: '#334155',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Since you've been sending me all those TikToks about Spider-Man, I know you really like it!! So to celebrate your thesis defense, can we hangout and watch a Spider-Man movie together? plsplsplsplsplspls 🥺🍿
            </p>
          </div>
        </div>

        {/* Tap to continue label — same styling as Envelope */}
        <p className="mt-3 sm:mt-6 text-center text-[10px] sm:text-xs font-semibold tracking-widest uppercase animate-pulse text-slate-500 select-none">
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
