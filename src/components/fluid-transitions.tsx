"use client";

import React, { useEffect, useRef } from "react";

export function FluidTransitions() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9D56E", "#FF8C42"];
    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < colors.length; i++) {
        const x =
          Math.sin(t + i * 0.5) * canvas.width * 0.4 + canvas.width * 0.5;
        const y =
          Math.cos(t + i * 0.5) * canvas.height * 0.4 + canvas.height * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
      }

      t += 0.02;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
