"use client";

import React, { useEffect, useRef } from "react";

export function JeremyBlakeInspiredArt({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colorPalettes = [
      ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9D56E", "#FF8C42"],
      ["#05668D", "#028090", "#00A896", "#02C39A", "#F0F3BD"],
      ["#D0E1F9", "#4D648D", "#283655", "#1E1F26", "#E8EBE4"],
    ];

    let currentPalette = 0;
    let time = 0;

    // Simple 2D noise function
    const noise = (x: number, y: number) => {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      x -= Math.floor(x);
      y -= Math.floor(y);
      const u = fade(x);
      const v = fade(y);
      const A = p[X] + Y,
        B = p[X + 1] + Y;
      return lerp(
        v,
        lerp(u, grad(p[A], x, y), grad(p[B], x - 1, y)),
        lerp(u, grad(p[A + 1], x, y - 1), grad(p[B + 1], x - 1, y - 1))
      );
    };

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t: number, a: number, b: number) => a + t * (b - a);
    const grad = (hash: number, x: number, y: number) => {
      const h = hash & 15;
      const grad = 1 + (h & 7);
      return (h & 8 ? -grad : grad) * x + (h & 4 ? -grad : grad) * y;
    };

    const p = new Array(512);
    const permutation = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
      140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
      120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
      33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
      71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
      133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
      63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
      135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
      226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
      59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
      152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
      39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
      246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
      81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
      222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];
    for (let i = 0; i < 256; i++) p[256 + i] = p[i] = permutation[i];

    const drawLayer = (offset: number) => {
      ctx.save();
      ctx.globalAlpha = 0.1;

      for (let x = 0; x < canvas.width; x += 20) {
        for (let y = 0; y < canvas.height; y += 20) {
          const distanceToMouse = Math.sqrt(
            Math.pow(x - mousePosition.x, 2) + Math.pow(y - mousePosition.y, 2)
          );
          const influence = Math.max(0, 1 - distanceToMouse / 300);

          const nx =
            (x / canvas.width -
              0.5 +
              offset +
              influence * Math.sin(time * 0.01)) *
            4;
          const ny =
            (y / canvas.height -
              0.5 +
              offset +
              influence * Math.cos(time * 0.01)) *
            4;
          const n = noise(nx, ny);

          ctx.fillStyle =
            colorPalettes[currentPalette][Math.floor((n + 1) * 2.5) % 5];
          ctx.fillRect(x, y, 20, 20);
        }
      }

      ctx.restore();
    };

    const drawGlitch = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        if (Math.random() < 0.01) {
          pixels[i] = pixels[i + 4];
          pixels[i + 1] = pixels[i + 5];
          pixels[i + 2] = pixels[i + 6];
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 5; i++) {
        drawLayer(i * 0.1);
      }

      drawGlitch();

      time++;

      if (time % 500 === 0) {
        currentPalette = (currentPalette + 1) % colorPalettes.length;
      }

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
  }, [mousePosition]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
