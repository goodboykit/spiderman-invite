import { useState, useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { Calendar } from './ui/calendar';

const TopCornerImg = ({ className, isEatOut }: { className?: string; isEatOut?: boolean }) => (
  <img
    src={isEatOut ? "/fa9a307f-9047-4312-a658-6b7978a6d511-removebg-preview.png" : "/image%20copy%202.png"}
    alt="Top corner decoration"
    className={
      isEatOut
        ? "absolute -top-14 -left-12 sm:-top-16 sm:-left-14 md:-top-18 md:-left-16 w-36 sm:w-44 md:w-52 h-36 sm:h-44 md:h-52 z-30 pointer-events-none select-none object-contain opacity-95 transition-all duration-500"
        : `pointer-events-none select-none object-contain ${className || ''}`
    }
  />
);

const BottomCornerImg = ({ className, isEatOut }: { className?: string; isEatOut?: boolean }) => (
  <img
    src={isEatOut ? "/e87e7d7e-de23-47f1-a063-cfd0f01c32eb-removebg-preview.png" : "/image%20copy.png"}
    alt="Bottom corner decoration"
    className={
      isEatOut
        ? "absolute -bottom-14 -right-12 sm:-bottom-16 sm:-right-14 md:-bottom-18 md:-right-16 w-36 sm:w-44 md:w-52 h-36 sm:h-44 md:h-52 z-30 pointer-events-none select-none object-contain opacity-95 transition-all duration-500"
        : `pointer-events-none select-none object-contain ${className || ''}`
    }
  />
);

const TIME_SLOTS = [
  { id: 'afternoon', label: '1:30 PM', movieDesc: 'Afternoon Show', eatOutDesc: 'Afternoon Meal' },
  { id: 'late-afternoon', label: '4:00 PM', movieDesc: 'Late Afternoon', eatOutDesc: 'Merienda Time' },
  { id: 'evening', label: '6:00 PM', movieDesc: 'Evening Show', eatOutDesc: 'Early Dinner' },
  { id: 'night', label: '9:00 PM', movieDesc: 'Night Show', eatOutDesc: 'Late Dinner' },
];

const NO_BUTTON_TEXTS = [
  "Ayoko nga! 😝",
  "Bawal mag No! 🙅‍♀️",
  "Sure ka ba dyan? 🤔",
  "Bleh! Di mo ko mapipindot 😛",
  "Uyyy sige na plsss 🥺",
  "Pindutin mo na yung Yes!! 😭",
  "Ang bagal mo naman! 🐢",
  "Nangangawit na ko kaka-ilag! 🤸‍♂️",
  "Daya mo naman eh! 🥺",
  "Wala kang choice! 💅",
  "Gusto ko yung Yes! 😤"
];

// Helper to get next occurrence of a day (0 = Sun, 5 = Fri, 6 = Sat)

/**
 * SpidermanInvite — Rebuilt with an effortless, UX-intuitive shadcn Calendar
 * and time selector, plus the card-constrained dodging button!
 */
export default function SpidermanInvite({
  visible,
  onConfirm,
}: {
  visible: boolean;
  onConfirm?: () => void;
}) {
  const [step, setStep] = useState<'invite' | 'select-date' | 'confirmed'>('invite');
  const [isSaving, setIsSaving] = useState(false);
  const [isEatOut, setIsEatOut] = useState(false);
  
  // Date & Time picker state — default to July 30 (movie day)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => new Date(2026, 6, 30));
  const [chosenTime, setChosenTime] = useState<string>('');
  
  // Dodging "No" button state — constrained strictly inside the message card!
  const [noBtnPos, setNoBtnPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [noBtnCount, setNoBtnCount] = useState(0);
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

  const handleStartSelection = () => {
    setStep('select-date');
  };

  const handleEatOutSelection = () => {
    setIsEatOut(true);
    setStep('select-date');
  };

  const handleConfirmDate = () => {
    setIsSaving(true);
    
    // Fire-and-forget background request so the user gets INSTANT 0-second loading!
    fetch('/api/save-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        occasion: 'Hangout Celebration',
        film: isEatOut ? 'Eat Out' : 'Spider-Man',
        date: formatReadableDate(selectedDate),
        timeSlot: chosenTime,
        status: 'confirmed',
        activityType: isEatOut ? 'eat-out' : 'movie',
        created_at: new Date().toISOString(),
      }),
    }).catch(err => console.warn('Network offline, but proceeding:', err));

    setIsSaving(false);
    setStep('confirmed');
    onConfirm?.();
  };

  const handleDodgeNo = () => {
    let newX = 0;
    let newY = 0;
    
    // Pick 1 of 4 extreme zones inside the white card to guarantee it NEVER overlaps the Yes button!
    const zone = Math.floor(Math.random() * 4);
    
    if (zone === 0) {
      // TOP ZONE (Flies up into the text area)
      newX = (Math.random() - 0.5) * 180; 
      newY = -100 - (Math.random() * 80); 
    } else if (zone === 1) {
      // BOTTOM ZONE (Safely below the buttons)
      newX = (Math.random() - 0.5) * 180; 
      newY = 40 + (Math.random() * 40);   
    } else if (zone === 2) {
      // FAR LEFT ZONE
      newX = -110 - (Math.random() * 30); 
      newY = (Math.random() - 0.5) * 100; 
    } else {
      // FAR RIGHT ZONE
      newX = 110 + (Math.random() * 30);  
      newY = (Math.random() - 0.5) * 100; 
    }

    setNoBtnPos({ x: newX, y: newY });
    setNoBtnCount((prev) => prev + 1);
  };

  // Format date cleanly for human reading
  const formatReadableDate = (d?: Date) => {
    if (!d) return 'Select a date';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-40 px-4 sm:px-6 pointer-events-auto select-none overflow-hidden">
      <div
        ref={cardRef}
        className="relative w-full max-w-[92vw] sm:max-w-lg md:max-w-xl mx-auto"
        style={{ opacity: 0 }}
      >
        <div className="relative w-full py-6 sm:py-8 px-2 sm:px-4 transform -rotate-2 sm:-rotate-3 transition-transform duration-500 hover:-rotate-1">
          <TopCornerImg isEatOut={isEatOut || (step === 'invite' && noBtnCount >= 12)} className="absolute -top-8 -left-8 sm:-top-10 sm:-left-10 w-32 sm:w-40 md:w-44 h-32 sm:h-40 md:h-44 z-30 pointer-events-none opacity-95" />
          <BottomCornerImg isEatOut={isEatOut || (step === 'invite' && noBtnCount >= 12)} className="absolute -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 w-32 sm:w-40 md:w-44 h-32 sm:h-40 md:h-44 z-30 pointer-events-none opacity-95" />

          <div
            className="absolute inset-x-4 inset-y-6 bg-white rounded-md shadow-lg transform rotate-3 border border-slate-200/80"
            style={{ boxShadow: '0 12px 25px rgba(0,0,0,0.08)' }}
          />
          <div
            className="absolute inset-x-2 inset-y-5 bg-white rounded-md shadow-md transform rotate-1 border border-slate-200/80"
            style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}
          />

          <div
            className="relative bg-white rounded-md p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-100 z-10 text-center flex flex-col items-center overflow-hidden"
            style={{
              boxShadow: '0 20px 45px rgba(30, 41, 59, 0.15)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {step === 'invite' && (
              <div className="w-full animate-fade-in">
                {noBtnCount < 12 ? (
                  <>
                    <span className="text-sm sm:text-base font-bold uppercase tracking-[0.2em] block mb-2" style={{ color: '#5a8bbc' }}>
                      Hangout Celebration
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-3 tracking-wide" style={{ fontFamily: "'Great Vibes', cursive", color: '#476b92', textShadow: '0 2px 4px rgba(71, 107, 146, 0.15)' }}>
                      Spider-Man Movie Hangout
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base leading-relaxed italic max-w-md mx-auto mb-6" style={{ color: '#334155' }}>
                      Would you do me the honor of watching Spider-Man together? plsplsplsplsplspls 🥺🍿
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-8 opacity-60">
                      <div className="h-[1px] w-12 bg-blue-300" />
                      <span className="text-blue-500 text-xs">✦ ✦ ✦</span>
                      <div className="h-[1px] w-12 bg-blue-300" />
                    </div>
                    <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[70px]">
                      <button onClick={handleStartSelection} className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#5a8bbc] to-[#476b92] hover:from-[#476b92] hover:to-[#365270] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 cursor-pointer z-20">
                        Yes, I'd love to!
                      </button>
                      <button onMouseEnter={handleDodgeNo} onTouchStart={(e) => { e.preventDefault(); handleDodgeNo(); }} onClick={handleDodgeNo} style={{ transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)`, transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }} className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs sm:text-sm font-medium tracking-wide transition-colors cursor-pointer select-none border border-slate-200/80 z-10">
                        {NO_BUTTON_TEXTS[noBtnCount % NO_BUTTON_TEXTS.length]}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="animate-fade-in py-2">
                    <h2
                      className="text-3xl sm:text-4xl md:text-5xl font-normal mb-3 tracking-wide text-[#476b92]"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      Okay, okay! You win!
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base leading-relaxed italic max-w-md mx-auto mb-6 text-slate-600">
                      How about we just eat out instead? 🥺🍕✨
                    </p>
                    <div className="flex items-center justify-center mt-4">
                      <button
                        onClick={handleEatOutSelection}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#5a8bbc] to-[#476b92] hover:from-[#476b92] hover:to-[#365270] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 cursor-pointer"
                      >
                        Let's Eat Out! 🍽️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'select-date' && (
              <div className="w-full animate-fade-in text-left max-h-[72vh] overflow-y-auto overflow-x-hidden pr-1 space-y-5">
                <div className="text-center mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] block mb-0.5" style={{ color: '#5a8bbc' }}>
                    {isEatOut ? 'Eat Out Schedule' : 'Movie Schedule'}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-normal tracking-wide" style={{ fontFamily: "'Great Vibes', cursive", color: '#476b92' }}>
                    {isEatOut ? 'Pick Our Day' : 'When Works Best?'}
                  </h3>
                </div>

                {/* Live Preview Ticket Banner */}
                <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-blue-50/90 border border-blue-200/80 rounded-xl p-3.5 text-center shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Selection Preview</span>
                  <span className="text-xs sm:text-sm font-bold text-[#476b92] bg-white px-3 py-1.5 rounded-lg shadow-2xs border border-blue-100">
                    {formatReadableDate(selectedDate)} • {chosenTime.split(' (')[0]}
                  </span>
                </div>

                {/* 1. DATE SELECTION CONTAINER */}
                <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      1. Choose Day
                    </label>
                    <span className="text-[10px] text-[#5a8bbc] font-semibold bg-blue-50 px-2 py-0.5 rounded-md">Tap any date below</span>
                  </div>


                  {/* Clean shadcn Calendar widget */}
                  <div className="flex justify-center bg-white border border-slate-200/70 rounded-xl p-2 sm:p-3 shadow-inner">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => d && setSelectedDate(d)}
                      disabled={(date) => {
                        // Disable all dates before July 30
                        const minDate = new Date(2026, 6, 30);
                        minDate.setHours(0, 0, 0, 0);
                        if (date < minDate) return true;
                        // Disable anything after August 31
                        const maxDate = new Date(2026, 7, 31);
                        if (date > maxDate) return true;
                        return false;
                      }}
                      startMonth={new Date(2026, 6)}
                      endMonth={new Date(2026, 7)}
                      className="rounded-lg bg-white p-1 sm:p-2"
                    />
                  </div>
                </div>

                {/* 2. TIME SLOT SELECTION CONTAINER */}
                <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="border-b border-slate-200/60 pb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      2. Choose Time
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TIME_SLOTS.map((t) => {
                      const desc = isEatOut ? t.eatOutDesc : t.movieDesc;
                      const tStr = `${t.label} (${desc})`;
                      const active = chosenTime === tStr;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setChosenTime(tStr)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            active
                              ? 'bg-blue-50/90 border-[#5a8bbc] shadow-sm ring-1 ring-[#5a8bbc]/40'
                              : 'bg-white border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-200'
                          }`}
                        >
                          <div>
                            <span className="block text-xs font-bold text-slate-800">{t.label}</span>
                            <span className="block text-[11px] text-[#5a8bbc] font-medium">{desc}</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? 'border-[#5a8bbc] bg-[#5a8bbc]' : 'border-slate-300'}`}>
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="flex items-center justify-end pt-2 border-t border-slate-100">

                  <button
                    onClick={handleConfirmDate}
                    disabled={isSaving || !chosenTime || !selectedDate}
                    className={`px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                      isSaving || !chosenTime || !selectedDate
                        ? 'bg-slate-300 text-white cursor-not-allowed shadow-none opacity-80'
                        : 'bg-gradient-to-r from-[#5a8bbc] to-[#476b92] hover:from-[#476b92] hover:to-[#365270] text-white shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      'Confirm Schedule'
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 'confirmed' && (
              <div className="w-full animate-fade-in text-center py-1 sm:py-2">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50/80 border border-blue-200 text-[#476b92] mb-3 shadow-md shadow-blue-500/15 transition-transform duration-700 hover:scale-105">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base font-bold uppercase tracking-[0.2em] block mb-1" style={{ color: '#5a8bbc' }}>It's a Plan!</span>
                <h3 className="text-3xl sm:text-4xl font-normal mb-5 tracking-wide" style={{ fontFamily: "'Great Vibes', cursive", color: '#476b92' }}>
                  {isEatOut ? 'See you there!' : 'See you at the movies'}
                </h3>

                {/* Confirmed Schedule Display Box */}
                <div className="bg-slate-50/90 border border-blue-200/70 rounded-2xl p-5 sm:p-6 mb-6 text-left max-w-md mx-auto shadow-md space-y-4">
                  {/* Row 1: Occasion */}
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-3.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0 w-28 sm:w-32">
                      OCCASION
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-700 text-right">
                      Hangout Celebration
                    </span>
                  </div>

                  {/* Row 2: Activity */}
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-3.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0 w-28 sm:w-32">
                      {isEatOut ? 'ACTIVITY' : 'FEATURE FILM'}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#476b92] text-right">
                      {isEatOut ? 'Eat Out' : 'Spider-Man'}
                    </span>
                  </div>

                  {/* Row 3: Schedule */}
                  <div className="pt-0.5">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        SCHEDULE
                      </span>
                      <span className="text-[10px] font-bold text-[#5a8bbc] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                        Confirmed
                      </span>
                    </div>
                    <div className="w-full bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-blue-50/80 px-4 py-3 rounded-xl border border-blue-200/80 text-center shadow-2xs">
                      <span className="text-sm sm:text-base font-bold text-[#476b92] block">
                        {formatReadableDate(selectedDate)}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#5a8bbc] block mt-0.5">
                        {chosenTime}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm italic leading-relaxed max-w-sm mx-auto text-slate-500 font-medium">
                  {isEatOut
                    ? "Your eat out schedule is confirmed! Can't wait to celebrate with you."
                    : "Your movie hangout schedule is confirmed! Can't wait to celebrate with you."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
