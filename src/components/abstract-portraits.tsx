"use client";

import React, { useEffect, useRef, useCallback } from "react";

export function AbstractPortraits({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current != undefined) {
        const deltaTime = time - previousTimeRef.current;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            drawPortrait(
              ctx,
              canvas.width,
              canvas.height,
              mousePosition,
              deltaTime
            );
          }
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [mousePosition]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

function drawPortrait(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mousePosition: { x: number; y: number },
  deltaTime: number
) {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9D56E", "#FF8C42"];

  ctx.clearRect(0, 0, width, height);

  // Use deltaTime to create a subtle pulsing effect
  const pulseFactor = Math.sin(deltaTime * 0.005) * 0.1 + 1;

  // Face
  ctx.fillStyle = colors[0];
  ctx.beginPath();
  ctx.ellipse(
    width / 2,
    height / 2,
    (100 + mousePosition.x * 0.1) * pulseFactor,
    (150 + mousePosition.y * 0.1) * pulseFactor,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Eyes
  ctx.fillStyle = colors[1];
  ctx.beginPath();
  ctx.ellipse(
    width / 2 - 40,
    height / 2 - 30,
    20 * pulseFactor,
    (10 + mousePosition.y * 0.05) * pulseFactor,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(
    width / 2 + 40,
    height / 2 - 30,
    20 * pulseFactor,
    (10 + mousePosition.y * 0.05) * pulseFactor,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Mouth
  ctx.fillStyle = colors[2];
  ctx.beginPath();
  ctx.ellipse(
    width / 2,
    height / 2 + 50,
    (40 + mousePosition.x * 0.1) * pulseFactor,
    20 * pulseFactor,
    0,
    0,
    Math.PI
  );
  ctx.fill();

  // Hair
  ctx.fillStyle = colors[3];
  ctx.beginPath();
  ctx.moveTo(width / 2 - 100, height / 2 - 150);
  ctx.quadraticCurveTo(
    width / 2,
    height / 2 - 250 - mousePosition.y * 0.2 * pulseFactor,
    width / 2 + 100,
    height / 2 - 150
  );
  ctx.fill();
}
