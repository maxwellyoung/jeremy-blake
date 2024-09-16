"use client";

import React, { useEffect, useRef } from "react";

export function GeometricPatterns() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9D56E", "#FF8C42"];

    const drawPattern = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let x = 0; x < canvas.width; x += 50) {
        for (let y = 0; y < canvas.height; y += 50) {
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 50, y + 25);
          ctx.lineTo(x + 50, y + 50);
          ctx.lineTo(x, y + 25);
          ctx.closePath();
          ctx.fill();
        }
      }

      requestAnimationFrame(drawPattern);
    };

    drawPattern();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
