"use client";

import React, { useEffect, useRef } from "react";

interface NodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function AvatarMotionBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetProgress = 0.5;
    let currentProgress = 0.5;
    let isMouseActive = false;
    let mouseTimeout: NodeJS.Timeout;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Normalize X mouse movement across full screen width (0 to 1)
      targetProgress = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      isMouseActive = true;

      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        isMouseActive = false;
      }, 2000);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize Tech Nodes for Cyber Grid Overlay
    const nodeCount = Math.floor(Math.min(width, height) / 18);
    const nodes: NodeParticle[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: 1.5 + Math.random() * 2,
    }));

    // Video play setup
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.play().catch(() => {});

    // Render RAF Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Smooth RAF Video Time Scrubbing matching avatar head motion to mouse X position
      if (video.duration && !isNaN(video.duration)) {
        currentProgress += (targetProgress - currentProgress) * 0.12; // Increased responsiveness
        const targetTime = currentProgress * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.01) {
          video.currentTime = targetTime;
        }
      }

      // 2. Render Tech Grid Background Lines
      ctx.strokeStyle = "rgba(59, 130, 246, 0.08)";
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Render Cyber Cursor Glow Spotlight following mouse
      const cursorGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 380);
      cursorGlow.addColorStop(0, "rgba(59, 130, 246, 0.22)");
      cursorGlow.addColorStop(0.4, "rgba(139, 92, 246, 0.08)");
      cursorGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      // 4. Render Head Tracking Cybernetic Target Reticle
      ctx.save();
      ctx.strokeStyle = "rgba(96, 165, 250, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(96, 165, 250, 0.6)";
      ctx.fill();
      ctx.restore();

      // 5. Render Interactive Tech Nodes & Network Connections
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96, 165, 250, 0.7)";
        ctx.fill();

        // Connect node to mouse cursor if within range
        const dxMouse = mouseX - node.x;
        const dyMouse = mouseY - node.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 200) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(147, 197, 253, ${0.45 * (1 - distMouse / 200)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Connect to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      if (document.visibilityState === "visible") {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
      clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full bg-slate-950">
      {/* 3D Model / Mannequin Video Layer */}
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className="w-full h-full object-cover object-center opacity-85 transition-opacity duration-700"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
      />

      {/* Cyber Tech Canvas Layer (Grid lines, cursor glow spotlight, network nodes) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Dark vignette overlay ensuring login & sign-up forms stay dominant with maximum contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/80 backdrop-blur-[1.5px] z-20 pointer-events-none" />
    </div>
  );
}
