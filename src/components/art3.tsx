"use client";

import React, { useEffect, useRef, useCallback } from "react";

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#F9D56E",
  "#FF8C42",
  "#D45079",
  "#6B5CA5",
  "#00A878",
  "#E84855",
  "#3185FC",
];

interface Shape {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
}

const MAX_SHAPES = 50;

export default function Art3({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const animationRef = useRef<number>();

  const createShape = useCallback(
    (x: number, y: number): Shape => ({
      x,
      y,
      size: Math.random() * 50 + 25,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }),
    []
  );

  const updateAndDrawShapes = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      shapesRef.current.forEach((shape) => {
        const dx = mousePosition.x - shape.x;
        const dy = mousePosition.y - shape.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          shape.vx += (dx / distance) * 0.2;
          shape.vy += (dy / distance) * 0.2;
        }

        shape.x += shape.vx;
        shape.y += shape.vy;

        shape.vx *= 0.99;
        shape.vy *= 0.99;

        if (shape.x < 0 || shape.x > width) shape.vx *= -1;
        if (shape.y < 0 || shape.y > height) shape.vy *= -1;

        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
        ctx.fillStyle = shape.color;
        ctx.fill();
      });
    },
    [mousePosition]
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    updateAndDrawShapes(ctx, canvas.width, canvas.height);
    animationRef.current = requestAnimationFrame(animate);
  }, [updateAndDrawShapes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    shapesRef.current = Array.from({ length: MAX_SHAPES }, () =>
      createShape(Math.random() * canvas.width, Math.random() * canvas.height)
    );

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, createShape]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const newShape = createShape(e.clientX, e.clientY);
      shapesRef.current = [
        ...shapesRef.current.slice(-MAX_SHAPES + 1),
        newShape,
      ];
    },
    [createShape]
  );

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-black cursor-none"
      onClick={handleClick}
    />
  );
}
