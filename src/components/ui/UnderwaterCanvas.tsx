"use client";

import React, { useEffect, useRef } from "react";

interface Fish {
  x: number;
  y: number;
  z: number; // 0 (background/depth) to 1 (foreground)
  vx: number;
  vy: number;
  maxSpeed: number;
  size: number;
  tailPhase: number;
  tailSpeed: number;
  color: string;
  secondaryColor: string;
  finColor: string;
  type: "angel" | "neon" | "gold" | "clown" | "silver";
  schoolId: number;
}

interface Bubble {
  x: number;
  y: number;
  z: number;
  r: number;
  vy: number;
  wobbleSpeed: number;
  wobblePhase: number;
  opacity: number;
}

interface MarineSnow {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  pulsePhase: number;
}

export default function UnderwaterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Color palettes for fish species
    const speciesPalettes = [
      { type: "neon" as const, color: "#00d2ff", secondary: "#3a7bd5", fin: "#70e1ff" },
      { type: "clown" as const, color: "#ff7e5f", secondary: "#feb47b", fin: "#ff9966" },
      { type: "angel" as const, color: "#11998e", secondary: "#38ef7d", fin: "#45f39f" },
      { type: "silver" as const, color: "#e0eafc", secondary: "#cfdef3", fin: "#ffffff" },
      { type: "gold" as const, color: "#f857a6", secondary: "#ff5858", fin: "#ffa0a0" },
    ];

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Adaptive population count based on screen size
    const fishCount = width < 768 ? 22 : 45;
    const fishList: Fish[] = [];

    for (let i = 0; i < fishCount; i++) {
      const palette = speciesPalettes[i % speciesPalettes.length];
      const z = Math.random(); // 0 (far) to 1 (near)
      const isRight = Math.random() > 0.5;
      const speedScale = 0.4 + z * 0.6;

      fishList.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        vx: (isRight ? 1 : -1) * (0.6 + Math.random() * 0.8) * speedScale,
        vy: (Math.random() - 0.5) * 0.2,
        maxSpeed: (1.2 + Math.random() * 0.8) * speedScale,
        size: (9 + Math.random() * 15) * (0.5 + z * 0.6),
        tailPhase: Math.random() * Math.PI * 2,
        tailSpeed: 0.08 + Math.random() * 0.06,
        color: palette.color,
        secondaryColor: palette.secondary,
        finColor: palette.fin,
        type: palette.type,
        schoolId: Math.floor(i / 6),
      });
    }

    // Translucent Rising Bubbles
    const bubbleCount = width < 768 ? 20 : 40;
    const bubbles: Bubble[] = Array.from({ length: bubbleCount }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 200,
      z: Math.random(),
      r: 1.2 + Math.random() * 4.0,
      vy: 0.5 + Math.random() * 1.0,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      wobblePhase: Math.random() * Math.PI * 2,
      opacity: 0.2 + Math.random() * 0.4,
    }));

    // Marine Snow / Plankton Particles
    const snowCount = width < 768 ? 35 : 70;
    const marineSnow: MarineSnow[] = Array.from({ length: snowCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.7 + Math.random() * 2.0,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      alpha: 0.15 + Math.random() * 0.45,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let causticsPhase = 0;

    // Draw realistic fish entity with depth effects
    const drawFish = (fish: Fish) => {
      ctx.save();
      ctx.translate(fish.x, fish.y);
      ctx.scale(fish.vx < 0 ? -1 : 1, 1);

      // Depth Atmospheric Fog Attenuation
      const alpha = 0.35 + fish.z * 0.65;
      ctx.globalAlpha = alpha;

      const tailOffset = Math.sin(fish.tailPhase) * (fish.size * 0.35);

      // Depth Shadow for foreground fish
      if (fish.z > 0.4) {
        ctx.fillStyle = `rgba(1, 8, 22, ${0.15 * fish.z})`;
        ctx.beginPath();
        ctx.ellipse(3 * fish.z, 5 * fish.z, fish.size, fish.size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Body Linear Gradient
      const bodyGrad = ctx.createLinearGradient(-fish.size, 0, fish.size, 0);
      bodyGrad.addColorStop(0, fish.secondaryColor);
      bodyGrad.addColorStop(0.6, fish.color);
      bodyGrad.addColorStop(1, fish.finColor);

      // Tail Fin (Animated sinusoidal oscillation)
      ctx.fillStyle = fish.finColor;
      ctx.beginPath();
      ctx.moveTo(-fish.size * 0.4, 0);
      ctx.quadraticCurveTo(
        -fish.size * 0.95,
        -fish.size * 0.65 + tailOffset,
        -fish.size * 1.3,
        -fish.size * 0.8 + tailOffset
      );
      ctx.quadraticCurveTo(
        -fish.size * 0.9,
        tailOffset * 0.5,
        -fish.size * 1.3,
        fish.size * 0.8 + tailOffset
      );
      ctx.quadraticCurveTo(
        -fish.size * 0.95,
        fish.size * 0.65 + tailOffset,
        -fish.size * 0.4,
        0
      );
      ctx.fill();

      // Dorsal Top Fin
      ctx.beginPath();
      ctx.moveTo(-fish.size * 0.2, -fish.size * 0.35);
      ctx.quadraticCurveTo(-fish.size * 0.6, -fish.size * 0.95, 0, -fish.size * 0.4);
      ctx.fill();

      // Main Body
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(fish.size, 0);
      ctx.quadraticCurveTo(fish.size * 0.3, -fish.size * 0.55, -fish.size * 0.5, 0);
      ctx.quadraticCurveTo(fish.size * 0.3, fish.size * 0.55, fish.size, 0);
      ctx.fill();

      // Species Stripes
      if (fish.type === "clown" || fish.type === "angel") {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.55 * fish.z + 0.25})`;
        ctx.lineWidth = fish.size * 0.12;
        ctx.beginPath();
        ctx.moveTo(-fish.size * 0.1, -fish.size * 0.35);
        ctx.lineTo(-fish.size * 0.1, fish.size * 0.35);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(fish.size * 0.3, -fish.size * 0.3);
        ctx.lineTo(fish.size * 0.3, fish.size * 0.3);
        ctx.stroke();
      }

      // Side Pectoral Fin
      ctx.fillStyle = fish.finColor;
      ctx.beginPath();
      ctx.ellipse(0, fish.size * 0.1, fish.size * 0.32, fish.size * 0.14, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Specular Eye
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(fish.size * 0.62, -fish.size * 0.12, fish.size * 0.11, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#031024";
      ctx.beginPath();
      ctx.arc(fish.size * 0.64, -fish.size * 0.12, fish.size * 0.055, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(fish.size * 0.66, -fish.size * 0.15, fish.size * 0.025, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Organic Flocking (Boids) Simulation
    const applyFlocking = () => {
      for (let i = 0; i < fishList.length; i++) {
        const fish = fishList[i];
        let alignX = 0, alignY = 0;
        let cohesionX = 0, cohesionY = 0;
        let separationX = 0, separationY = 0;
        let count = 0;

        for (let j = 0; j < fishList.length; j++) {
          if (i === j) continue;
          const other = fishList[j];
          if (other.schoolId !== fish.schoolId) continue;

          const dx = other.x - fish.x;
          const dy = other.y - fish.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            alignX += other.vx;
            alignY += other.vy;

            cohesionX += other.x;
            cohesionY += other.y;

            if (dist < 45) {
              separationX -= dx / (dist || 1);
              separationY -= dy / (dist || 1);
            }
            count++;
          }
        }

        if (count > 0) {
          alignX /= count;
          alignY /= count;
          cohesionX = (cohesionX / count - fish.x) * 0.008;
          cohesionY = (cohesionY / count - fish.y) * 0.008;

          fish.vx += (alignX * 0.04 + cohesionX + separationX * 0.08);
          fish.vy += (alignY * 0.04 + cohesionY + separationY * 0.08);
        }

        // Mouse avoidance physics
        const mdx = fish.x - mouseX;
        const mdy = fish.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 130 && mdist > 0) {
          fish.vx += (mdx / mdist) * 0.6;
          fish.vy += (mdy / mdist) * 0.6;
        }

        // Speed capping
        const speed = Math.sqrt(fish.vx * fish.vx + fish.vy * fish.vy);
        if (speed > fish.maxSpeed) {
          fish.vx = (fish.vx / speed) * fish.maxSpeed;
          fish.vy = (fish.vy / speed) * fish.maxSpeed;
        }

        // Position update & Screen Wrapping
        fish.x += fish.vx;
        fish.y += fish.vy + Math.sin(fish.tailPhase) * 0.15;
        fish.tailPhase += fish.tailSpeed;

        if (fish.vx > 0 && fish.x > width + 60) fish.x = -60;
        if (fish.vx < 0 && fish.x < -60) fish.x = width + 60;
        if (fish.y < -40) fish.y = height + 40;
        if (fish.y > height + 40) fish.y = -40;
      }
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Deep Ocean Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#02122c");
      bgGrad.addColorStop(0.35, "#041b3d");
      bgGrad.addColorStop(0.75, "#020f26");
      bgGrad.addColorStop(1, "#010816");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Volumetric Sunlight Rays & Caustics
      causticsPhase += 0.005;
      const rayCount = 7;
      for (let i = 0; i < rayCount; i++) {
        const rayAngle = Math.sin(causticsPhase + i * 1.1) * 0.08;
        const startX = width * (0.08 + i * 0.16);
        const rayGrad = ctx.createLinearGradient(startX, 0, startX + Math.sin(rayAngle) * height, height);
        rayGrad.addColorStop(0, "rgba(56, 189, 248, 0.14)");
        rayGrad.addColorStop(0.4, "rgba(14, 165, 233, 0.05)");
        rayGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX - 40, 0);
        ctx.lineTo(startX + 80, 0);
        ctx.lineTo(startX + 200 + Math.sin(causticsPhase + i) * 50, height);
        ctx.lineTo(startX - 110 + Math.sin(causticsPhase + i) * 50, height);
        ctx.closePath();
        ctx.fillStyle = rayGrad;
        ctx.fill();
        ctx.restore();
      }

      // 3. Bioluminescent Marine Snow / Plankton Particles
      marineSnow.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.pulsePhase += 0.03;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        const alphaPulse = p.alpha + Math.sin(p.pulsePhase) * 0.12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${Math.max(0.05, alphaPulse)})`;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Sort fish by depth z (background -> foreground)
      fishList.sort((a, b) => a.z - b.z);

      // 4. Update & Render Fish Population
      if (!prefersReducedMotion) {
        applyFlocking();
      }

      fishList.forEach((fish) => {
        drawFish(fish);
      });

      // 5. Translucent Rising Water Bubbles
      bubbles.forEach((b) => {
        if (!prefersReducedMotion) {
          b.y -= b.vy;
          b.wobblePhase += b.wobbleSpeed;
          b.x += Math.sin(b.wobblePhase) * 0.5;

          if (b.y < -20) {
            b.y = height + 20;
            b.x = Math.random() * width;
          }
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * (0.6 + b.z * 0.4), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(186, 230, 253, ${b.opacity * (0.4 + b.z * 0.6)})`;
        ctx.lineWidth = 0.8 + b.z * 0.4;
        ctx.stroke();
        ctx.fillStyle = `rgba(224, 242, 254, ${b.opacity * 0.25 * (0.4 + b.z * 0.6)})`;
        ctx.fill();
      });

      // 6. Deep Radial Vignette Shimmer
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.max(width, height) * 0.3,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(1, 7, 22, 0.75)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      if (document.visibilityState === "visible") {
        animId = requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        cancelAnimationFrame(animId);
        render();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
    />
  );
}
