import { useEffect, useRef } from 'react';

/**
 * MusicPlayer — Invisible background audio player.
 * Plays background music (`/ENHYPEN 'Polaroid Love' (Official Instrumental) [z8rwiKfOkvE].mp3`) on continuous loop.
 * Automatically starts at the very start without requiring a click, and guarantees infinite looping when ended.
 */
export default function MusicPlayer({ autoPlayTrigger }: { autoPlayTrigger?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.85; // Audible volume
    audio.loop = true;   // Ensure loop is explicitly enabled

    const playAudio = () => {
      if (audio.paused) {
        audio.play().catch(() => {
          // Autoplay blocked by browser until micro-interaction
        });
      }
    };

    // Try playing immediately at the very start without waiting for any click!
    playAudio();

    // Aggressive retry interval every 100ms (in case browser allows autoplay after page load/focus)
    const interval = setInterval(() => {
      if (!audio.paused) {
        clearInterval(interval);
      } else {
        playAudio();
      }
    }, 100);

    // Listen to ANY micro-interaction (mouse move, hover, scroll, touch, click, key) so it plays instantly
    const events = ['click', 'pointerdown', 'keydown', 'touchstart', 'mousemove', 'pointermove', 'pointerenter', 'scroll', 'wheel', 'focus'];
    events.forEach(event => {
      window.addEventListener(event, playAudio, { once: false });
      document.addEventListener(event, playAudio, { once: false });
    });

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        window.removeEventListener(event, playAudio);
        document.removeEventListener(event, playAudio);
      });
    };
  }, []);

  // Trigger play when envelope is opened (or state changes)
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [autoPlayTrigger]);

  return (
    <audio
      ref={audioRef}
      id="bg-music"
      src="/ENHYPEN%20'Polaroid%20Love'%20(Official%20Instrumental)%20%5Bz8rwiKfOkvE%5D.mp3"
      autoPlay
      loop
      preload="auto"
      onEnded={() => {
        // Guarantee 100% infinite looping when track finishes
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      }}
    />
  );
}
