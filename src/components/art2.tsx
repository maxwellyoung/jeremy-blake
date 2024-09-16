"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Volume2, VolumeX } from "lucide-react";

const gradients = [
  "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
  "linear-gradient(135deg, #45B7D1, #F9D56E)",
  "linear-gradient(225deg, #FF8C42, #D45079)",
  "linear-gradient(315deg, #6B5CA5, #00A878)",
];

type Shape = {
  id: number;
  gradient: string;
  path: string;
  layer: number;
};

export default function Art2({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [colorShift, setColorShift] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createShape = useCallback((x: number, y: number, layer: number) => {
    const newShape: Shape = {
      id: Date.now(),
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      path: `
        M ${x},${y} 
        c ${Math.random() * 200 - 100},${Math.random() * 200 - 100} 
          ${Math.random() * 200 - 100},${Math.random() * 200 - 100} 
          ${Math.random() * 200 - 100},${Math.random() * 200 - 100}
        s ${Math.random() * 200 - 100},${Math.random() * 200 - 100} 
          ${Math.random() * 200 - 100},${Math.random() * 200 - 100}
      `,
      layer,
    };
    setShapes((prevShapes) => [...prevShapes.slice(-29), newShape]);
  }, []);

  useEffect(() => {
    if (Math.random() > 0.8) {
      createShape(
        mousePosition.x,
        mousePosition.y,
        Math.floor(Math.random() * 3)
      );
    }
  }, [mousePosition, createShape]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorShift((prev) => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleMute = () => {
    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const captureSnapshot = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "jeremy-blake-inspired-art.png";
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <svg width="100%" height="100%">
        <defs>
          {gradients.map((gradient, index) => (
            <linearGradient
              key={index}
              id={`gradient-${index}`}
              gradientTransform={`rotate(${colorShift})`}
            >
              <stop
                offset="0%"
                stopColor={gradient.split(", ")[0].split("(")[1]}
              />
              <stop
                offset="100%"
                stopColor={gradient.split(", ")[1].split(")")[0]}
              />
            </linearGradient>
          ))}
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>
        <AnimatePresence>
          {shapes.map((shape, index) => (
            <motion.g
              key={shape.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 2 }}
              style={{ zIndex: shape.layer }}
            >
              <motion.path
                d={shape.path}
                fill={`url(#gradient-${index % gradients.length})`}
                filter="url(#blur)"
                animate={{
                  d: [
                    shape.path,
                    shape.path.replace(/(-?\d+\.?\d*)/g, (match) =>
                      (parseFloat(match) + (Math.random() * 40 - 20)).toString()
                    ),
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 10 + Math.random() * 5,
                  ease: "easeInOut",
                }}
              />
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>
      <motion.div
        className="w-4 h-4 rounded-full bg-white absolute pointer-events-none mix-blend-difference"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          boxShadow: "0 0 20px 10px rgba(255, 255, 255, 0.5)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          transition: { duration: 0.5, repeat: Infinity },
        }}
      />
      <div className="absolute bottom-4 left-4 text-white text-opacity-70 font-light pointer-events-auto">
        Move and click to create art inspired by Jeremy Blake
      </div>
      <div className="absolute bottom-4 right-4 flex space-x-4 pointer-events-auto">
        <button
          onClick={handleMute}
          className="text-white opacity-70 hover:opacity-100 transition-opacity"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <button
          onClick={captureSnapshot}
          className="text-white opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Capture Snapshot"
        >
          <Camera size={24} />
        </button>
      </div>
      <audio
        ref={audioRef}
        src="/placeholder.mp3"
        loop
        autoPlay
        muted={isMuted}
      />
    </div>
  );
}
