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
  fromLogo: boolean;
}

interface Source {
  cx: number;
  cy: number;
  r: number;
}

export default function EmberField({
  sourceSelector,
}: {
  sourceSelector?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let W = 0;
    let H = 0;
    let source: Source | null = null;

    const measureSource = () => {
      if (!sourceSelector) return;
      const el = document.querySelector(sourceSelector);
      if (!el) {
        source = null;
        return;
      }
      const b = el.getBoundingClientRect();
      source = b.width
        ? {
            cx: b.left + b.width / 2,
            cy: b.top + b.height / 2,
            r: Math.min(b.width, b.height) * 0.4,
          }
        : null;
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measureSource();
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("load", measureSource);

    const embers: Ember[] = [];
    const targetCount = () => Math.round(Math.min(W, 1800) / 7);

    // Cubed random keeps most embers small, so the field reads as sparks
    // rather than the soft blobs a uniform distribution produces.
    function spawnAmbient(fromBottom: boolean) {
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
        fromLogo: false,
      });
    }

    function spawnSpark(s: Source) {
      const angle = Math.random() * Math.PI * 2;
      const radius = s.r * (0.85 + Math.random() * 0.3);
      embers.push({
        x: s.cx + Math.cos(angle) * radius,
        y: s.cy + Math.sin(angle) * radius,
        vx: Math.cos(angle) * 0.12 + (Math.random() - 0.5) * 0.2,
        vy: -(0.5 + Math.random() * 1.1),
        life: 0,
        maxLife: 90 + Math.random() * 130,
        size: 0.5 + Math.pow(Math.random(), 3) * 1.8,
        phase: Math.random() * Math.PI * 2,
        drift: 0.25 + Math.random() * 0.5,
        fromLogo: true,
      });
    }

    for (let i = 0, n = targetCount(); i < n; i++) spawnAmbient(false);

    let raf = 0;

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      if (source && Math.random() < 0.4) spawnSpark(source);

      let ambient = 0;

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++;

        if (e.life >= e.maxLife || e.y < -20) {
          embers.splice(i, 1);
          continue;
        }
        if (!e.fromLogo) ambient++;

        const t = e.life / e.maxLife;
        e.phase += 0.015;
        e.x += e.vx + Math.sin(e.phase) * e.drift * 0.6;
        e.y += e.vy;
        e.vy *= 0.9995;

        let a = t < 0.08 ? t / 0.08 : 1 - (t - 0.08) / 0.92;
        a *= 0.55 + Math.sin(e.phase * 3.1) * 0.18;
        a = Math.max(0, Math.min(1, a));

        // Green stays low so embers track the logo's hue range (3-18deg)
        // instead of climbing into yellow.
        const heat = 1 - t;
        const g = Math.round(20 + heat * 60);
        const b = Math.round(heat * heat * 14);
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

      for (let n = targetCount(); ambient < n; ambient++) spawnAmbient(true);

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", measureSource);
    };
  }, [sourceSelector]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      aria-hidden
    />
  );
}
