"use client";

import React, { useState, useEffect, useCallback } from "react";

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

type Shape = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  type: "circle" | "rect" | "polygon";
};

export function EnhancedJeremyBlakeNetArt() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const createShape = useCallback((x: number, y: number) => {
    const newShape: Shape = {
      id: Date.now(),
      x,
      y,
      size: Math.random() * 100 + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: ["circle", "rect", "polygon"][Math.floor(Math.random() * 3)] as
        | "circle"
        | "rect"
        | "polygon",
    };
    setShapes((prevShapes) => [...prevShapes.slice(-19), newShape]);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (Math.random() > 0.9) {
        createShape(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [createShape]);

  const renderShape = (shape: Shape) => {
    switch (shape.type) {
      case "circle":
        return (
          <circle
            cx={shape.x}
            cy={shape.y}
            r={shape.size / 2}
            fill={shape.color}
          />
        );
      case "rect":
        return (
          <rect
            x={shape.x - shape.size / 2}
            y={shape.y - shape.size / 2}
            width={shape.size}
            height={shape.size}
            fill={shape.color}
          />
        );
      case "polygon":
        const points = Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const x = shape.x + (Math.cos(angle) * shape.size) / 2;
          const y = shape.y + (Math.sin(angle) * shape.size) / 2;
          return `${x},${y}`;
        }).join(" ");
        return <polygon points={points} fill={shape.color} />;
    }
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden cursor-none">
      <svg width="100%" height="100%">
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
        {shapes.map((shape) => (
          <g key={shape.id} opacity={0.7} filter="url(#blur)">
            {renderShape(shape)}
          </g>
        ))}
      </svg>
      <div
        className="w-4 h-4 rounded-full bg-white absolute pointer-events-none mix-blend-difference"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 20px 10px rgba(255, 255, 255, 0.5)",
        }}
      />
      <div className="absolute bottom-4 left-4 text-white text-opacity-70">
        Move your mouse to create art
      </div>
    </div>
  );
}
