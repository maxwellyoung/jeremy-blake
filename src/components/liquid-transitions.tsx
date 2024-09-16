"use client";

import React, { useEffect, useRef } from "react";

export function LiquidTransitions() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9D56E", "#FF8C42"];
    let time = 0;

    const drawLiquid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x < canvas.width; x++) {
          const y =
            Math.sin((x + time + i * 100) * 0.01) * 50 + canvas.height / 2;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
      }

      time += 0.5;
      requestAnimationFrame(drawLiquid);
    };

    drawLiquid();

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
