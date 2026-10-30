"use client";

import { useEffect, useRef } from "react";

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  phase: number;
  drift: number;
}

export default function EmberField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let W = 0;
    let H = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const embers: Ember[] = [];
    const targetCount = () => Math.round(Math.min(W, 1800) / 7);

    // Cubed random keeps most embers small, so the field reads as sparks
    // rather than the soft blobs a uniform distribution produces.
    function spawn(fromBottom: boolean) {
      const size = 0.6 + Math.pow(Math.random(), 3) * 3.4;
      embers.push({
        x: Math.random() * W,
        y: fromBottom ? H + Math.random() * 40 : Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(0.25 + Math.random() * 0.9) * (0.6 + size / 4),
        life: fromBottom ? 0 : Math.random() * 200,
        maxLife: 260 + Math.random() * 340,
        size,
        phase: Math.random() * Math.PI * 2,
        drift: 0.2 + Math.random() * 0.5,
      });
    }

    for (let i = 0, n = targetCount(); i < n; i++) spawn(false);

    let raf = 0;

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      const target = targetCount();
      while (embers.length < target) spawn(true);

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++;

        if (e.life >= e.maxLife || e.y < -20) {
          embers.splice(i, 1);
          continue;
        }

        const t = e.life / e.maxLife;
        e.phase += 0.015;
        e.x += e.vx + Math.sin(e.phase) * e.drift * 0.6;
        e.y += e.vy;
        e.vy *= 0.9995;

        let a = t < 0.08 ? t / 0.08 : 1 - (t - 0.08) / 0.92;
        a *= 0.55 + Math.sin(e.phase * 3.1) * 0.18;
        a = Math.max(0, Math.min(1, a));

        const heat = 1 - t;
        const g = Math.round(70 + heat * 150);
        const b = Math.round(heat * heat * 40);
        const radius = e.size * 3;

        const glow = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, radius);
        glow.addColorStop(0, `rgba(255,${g},${b},${a})`);
        glow.addColorStop(0.4, `rgba(255,${Math.round(g * 0.5)},0,${a * 0.35})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(e.x, e.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      aria-hidden
    />
  );
}
