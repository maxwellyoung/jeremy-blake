"use client";

import React, { useEffect, useRef } from "react";

export function ColorFields() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9D56E", "#FF8C42"];
    let currentColor = 0;

    const animate = () => {
      ctx.fillStyle = colors[currentColor];
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      currentColor = (currentColor + 1) % colors.length;
      setTimeout(animate, 2000);
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

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
