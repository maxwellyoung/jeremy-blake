"use client";

import React, { useEffect, useRef } from "react";

export function GeometricAbstraction() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const drawShape = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const shapes = ["triangle", "rectangle", "circle"];
      const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9D56E", "#FF8C42"];

      for (let i = 0; i < 5; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 100 + 50;

        ctx.fillStyle = color;

        switch (shape) {
          case "triangle":
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + size / 2, y + size);
            ctx.lineTo(x - size / 2, y + size);
            ctx.closePath();
            ctx.fill();
            break;
          case "rectangle":
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
      }

      animationFrameId = requestAnimationFrame(drawShape);
    };

    drawShape();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
