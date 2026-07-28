import { useRef, useEffect, useCallback } from 'react';

/**
 * Sparkles — gentle floating sparkle particles in pastel blue/gold.
 * More like soft celebration glitter than explosive fireworks.
 * Appropriate for a personal invitation.
 */

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  radius: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const COLORS = [
  '#7eb4e2', '#a8ceed', '#b4d6f0', '#c0dff5',
  '#f0dfa0', '#e8d88c', '#d4a8d0', '#c8b4e0',
];

export default function Fireworks({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);
  const startTimeRef = useRef(0);
  const spawnTimerRef = useRef(0);

  const spawnWave = useCallback((canvas: HTMLCanvasElement) => {
    const w = canvas.width;
    const h = canvas.height;
    const count = 12 + Math.floor(Math.random() * 8);

    for (let i = 0; i < count; i++) {
      const x = w * 0.15 + Math.random() * w * 0.7;
      const y = h * 0.1 + Math.random() * h * 0.5;

      sparklesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.3 - Math.random() * 0.5,
        alpha: 0,
        decay: 0.003 + Math.random() * 0.003,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        radius: 1.5 + Math.random() * 2.5,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const elapsed = Date.now() - startTimeRef.current;
    const sparkles = sparklesRef.current;

    // Spawn new waves periodically during the show
    if (elapsed < 3500) {
      spawnTimerRef.current += 16;
      if (spawnTimerRef.current > 500) {
        spawnTimerRef.current = 0;
        spawnWave(canvas);
      }
    }

    let anyAlive = false;

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];

      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.998;
      s.vy *= 0.998;

      // Fade in then fade out
      const age = time * 0.001;
      if (s.alpha < 1 && s.decay > 0) {
        s.alpha = Math.min(s.alpha + 0.025, 1);
      }
      if (elapsed > 2500) {
        s.alpha -= s.decay * 1.5;
      }

      if (s.alpha <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      anyAlive = true;

      // Twinkle effect
      const twinkle = 0.5 + 0.5 * Math.sin(age * s.twinkleSpeed * 60 + s.twinkleOffset);
      const drawAlpha = s.alpha * (0.4 + twinkle * 0.6);

      ctx.save();
      ctx.globalAlpha = drawAlpha;

      // Soft glow
      ctx.shadowBlur = 12;
      ctx.shadowColor = s.color;

      // Draw sparkle as a 4-point star
      const r = s.radius;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - r * 1.8);
      ctx.quadraticCurveTo(s.x + r * 0.3, s.y - r * 0.3, s.x + r * 1.8, s.y);
      ctx.quadraticCurveTo(s.x + r * 0.3, s.y + r * 0.3, s.x, s.y + r * 1.8);
      ctx.quadraticCurveTo(s.x - r * 0.3, s.y + r * 0.3, s.x - r * 1.8, s.y);
      ctx.quadraticCurveTo(s.x - r * 0.3, s.y - r * 0.3, s.x, s.y - r * 1.8);
      ctx.fillStyle = s.color;
      ctx.fill();

      // Center bright dot
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = drawAlpha * 0.8;
      ctx.fill();

      ctx.restore();
    }

    if (anyAlive || elapsed < 4000) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    }
  }, [onComplete, spawnWave]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    const handleResize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      const c = canvas.getContext('2d');
      if (c) c.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener('resize', handleResize);

    completedRef.current = false;
    startTimeRef.current = Date.now();
    spawnTimerRef.current = 0;
    sparklesRef.current = [];

    // Initial wave
    spawnWave(canvas);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, animate, spawnWave]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
