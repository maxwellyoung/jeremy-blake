"use client";

import React, { useEffect, useRef } from "react";

export default function Title() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;

    const drawLayer = (offset: number) => {
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.translate(offset, offset);

      // Create gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, `hsl(${(time * 10) % 360}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${(time * 10 + 180) % 360}, 100%, 50%)`);

      // Draw flowing shapes
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.moveTo(
          Math.sin(time * 0.1 + i) * canvas.width * 0.2 + canvas.width * 0.5,
          Math.cos(time * 0.1 + i) * canvas.height * 0.2 + canvas.height * 0.5
        );
        ctx.bezierCurveTo(
          Math.sin(time * 0.2 + i) * canvas.width * 0.4 + canvas.width * 0.5,
          Math.cos(time * 0.2 + i) * canvas.height * 0.4 + canvas.height * 0.5,
          Math.sin(time * 0.3 + i) * canvas.width * 0.4 + canvas.width * 0.5,
          Math.cos(time * 0.3 + i) * canvas.height * 0.4 + canvas.height * 0.5,
          Math.sin(time * 0.4 + i) * canvas.width * 0.2 + canvas.width * 0.5,
          Math.cos(time * 0.4 + i) * canvas.height * 0.2 + canvas.height * 0.5
        );
      }
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.restore();
    };

    const drawText = () => {
      ctx.save();
      ctx.globalAlpha = Math.sin(time * 0.1) * 0.5 + 0.5;
      ctx.font = "60px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.textAlign = "center";
      ctx.fillText(
        "Jeremy Blake via Maxwell Young",
        canvas.width / 2,
        canvas.height / 2
      );
      ctx.restore();
    };

    const animate = () => {
      time += 0.01;
      ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 5; i++) {
        drawLayer(i * 20);
      }

      drawText();

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />;
}
