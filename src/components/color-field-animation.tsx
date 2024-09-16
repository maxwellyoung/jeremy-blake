"use client";

import React, { useEffect, useRef } from "react";

export function ColorFieldAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9D56E", "#FF8C42"];
    let colorIndex = 0;

    const animate = () => {
      ctx.fillStyle = colors[colorIndex];
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      colorIndex = (colorIndex + 1) % colors.length;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
