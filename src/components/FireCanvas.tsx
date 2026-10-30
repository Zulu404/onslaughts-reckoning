"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  spawnAngle: number;
}

export default function FireCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    const particles: Particle[] = [];

    function logoRadius() {
      return Math.min(W, H) * 0.23;
    }

    function logoCx() {
      return W / 2;
    }

    function logoCy() {
      // Logo is centered, shifted up slightly to give room for the button
      return H * 0.46;
    }

    function spawnParticle() {
      const cx = logoCx();
      const cy = logoCy();
      const lr = logoRadius();

      // Spawn from the outer ring, slightly inside and outside
      const angle = Math.random() * Math.PI * 2;
      const r = lr * (0.72 + Math.random() * 0.45);

      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      // Velocity: outward from center + strong upward
      const outwardSpeed = Math.random() * 0.4;
      const upwardSpeed = Math.random() * 4.5 + 2;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * outwardSpeed + (Math.random() - 0.5) * 0.6,
        vy: -upwardSpeed,
        life: 0,
        maxLife: Math.random() * 90 + 50,
        size: lr * (Math.random() * 0.22 + 0.06),
        spawnAngle: angle,
      });
    }

    let raf: number;

    function frame() {
      ctx.clearRect(0, 0, W, H);

      // Additive blending makes particles glow and blend like real fire
      ctx.globalCompositeOperation = "lighter";

      // Spawn more particles for denser fire
      const spawnPerFrame = Math.ceil(W / 80);
      for (let i = 0; i < spawnPerFrame; i++) spawnParticle();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const t = p.life / p.maxLife;

        // Turbulence: sine wave offset + slight horizontal drift
        p.x += p.vx + Math.sin(p.life * 0.18 + p.spawnAngle * 2) * 1.1;
        p.y += p.vy;
        // Gravity reversed (fire rises faster over time)
        p.vy -= 0.04;
        p.size *= 0.982;

        // Fire color ramp:
        //  0.0–0.12  →  white-yellow core (fade in)
        //  0.12–0.35 →  bright yellow-orange
        //  0.35–0.60 →  orange to red
        //  0.60–1.00 →  deep red → transparent
        let r = 255, g = 0, b = 0, a = 1;

        if (t < 0.12) {
          const s = t / 0.12;
          r = 255; g = Math.round(240 + 15 * (1 - s)); b = Math.round(180 * (1 - s)); a = s;
        } else if (t < 0.35) {
          const s = (t - 0.12) / 0.23;
          r = 255; g = Math.round(240 - s * 140); b = 0; a = 1;
        } else if (t < 0.60) {
          const s = (t - 0.35) / 0.25;
          r = 255; g = Math.round(100 - s * 100); b = 0; a = 0.9 - s * 0.1;
        } else {
          const s = (t - 0.60) / 0.40;
          r = Math.round(220 - s * 80); g = 0; b = 0; a = (1 - s) * 0.65;
        }

        // Radial gradient: bright core → dimmer mid → invisible edge
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(0.35, `rgba(${r},${Math.round(g * 0.4)},0,${a * 0.55})`);
        grad.addColorStop(0.75, `rgba(${Math.round(r * 0.6)},0,0,${a * 0.2})`);
        grad.addColorStop(1, `rgba(0,0,0,0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Soft ambient glow behind the logo
      ctx.globalCompositeOperation = "lighter";
      const cx = logoCx();
      const cy = logoCy();
      const lr = logoRadius();
      const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, lr * 1.6);
      glowGrad.addColorStop(0, "rgba(180,40,0,0.18)");
      glowGrad.addColorStop(0.5, "rgba(120,20,0,0.08)");
      glowGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, lr * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(frame);
    }

    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
