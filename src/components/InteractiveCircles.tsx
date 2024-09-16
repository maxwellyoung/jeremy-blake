"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface Circle {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  color: string;
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9D56E", "#FF8C42"];

export default function InteractiveCircles({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circlesRef = useRef<Circle[]>([]);

  const createCircle = useCallback(
    (x: number, y: number): Circle => ({
      x,
      y,
      radius: Math.random() * 20 + 10,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }),
    []
  );

  const updateAndDrawCircles = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);

      circlesRef.current.forEach((circle, index) => {
        // Update position
        circle.x += circle.dx;
        circle.y += circle.dy;

        // Bounce off walls
        if (circle.x - circle.radius < 0 || circle.x + circle.radius > width)
          circle.dx *= -1;
        if (circle.y - circle.radius < 0 || circle.y + circle.radius > height)
          circle.dy *= -1;

        // Interact with mouse
        const dx = mousePosition.x - circle.x;
        const dy = mousePosition.y - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          circle.dx += dx * 0.002;
          circle.dy += dy * 0.002;
        }

        // Draw circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.closePath();
      });
    },
    [mousePosition]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create initial circles
    circlesRef.current = Array.from({ length: 50 }, () =>
      createCircle(Math.random() * canvas.width, Math.random() * canvas.height)
    );

    const animate = () => {
      updateAndDrawCircles(ctx, canvas.width, canvas.height);
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
  }, [createCircle, updateAndDrawCircles]);

  return <canvas ref={canvasRef} className="w-full h-full bg-black" />;
}
