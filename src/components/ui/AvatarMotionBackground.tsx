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
    // Cap max nodes to 40 to prevent O(N^2) lag on large screens
    const maxNodes = 40;
    const calculatedNodes = Math.floor(Math.min(width, height) / 25);
    const nodeCount = Math.min(calculatedNodes, maxNodes);
    
    const nodes: NodeParticle[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: 1.5 + Math.random() * 2,
    }));

    // Pre-render static grid on an offscreen canvas to save CPU cycles
    const gridCanvas = document.createElement("canvas");
    gridCanvas.width = width;
    gridCanvas.height = height;
    const gridCtx = gridCanvas.getContext("2d");
    if (gridCtx) {
      gridCtx.strokeStyle = "rgba(59, 130, 246, 0.08)";
      gridCtx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, height);
        gridCtx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(width, y);
        gridCtx.stroke();
      }
    }

    // Video play setup
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.play().catch(() => {});

    let lastVideoUpdateTime = 0;

    // Render RAF Loop
    const render = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Smooth RAF Video Time Scrubbing (Throttled)
      if (video.duration && !isNaN(video.duration)) {
        currentProgress += (targetProgress - currentProgress) * 0.12; 
        const targetTime = currentProgress * video.duration;
        
        // Only update video.currentTime if delta is noticeable and at least 40ms has passed since last update
        // This prevents the decoder from stalling and dropping frames on scrubbing
        if (Math.abs(video.currentTime - targetTime) > 0.04 && timestamp - lastVideoUpdateTime > 40) {
          video.currentTime = targetTime;
          lastVideoUpdateTime = timestamp;
        }
      }

      // 2. Render Tech Grid Background Lines from Pre-rendered Offscreen Canvas
      if (gridCanvas.width > 0) {
        ctx.drawImage(gridCanvas, 0, 0);
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
      ctx.lineWidth = 0.8;
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
            ctx.stroke();
          }
        }
      });

      if (document.visibilityState === "visible") {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

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
