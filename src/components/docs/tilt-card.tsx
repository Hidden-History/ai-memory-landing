"use client";

import { useState, useCallback, useRef, type MouseEvent, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({ children, className, maxTilt = 4 }: TiltCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const lastCall = useRef(0);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion.current) return;
      const now = Date.now();
      if (now - lastCall.current < 100) return;
      lastCall.current = now;

      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = Math.max(-maxTilt, Math.min(maxTilt, ((y - centerY) / centerY) * maxTilt));
      const rotateY = Math.max(-maxTilt, Math.min(maxTilt, ((centerX - x) / centerX) * maxTilt));
      setRotate({ x: rotateX, y: rotateY });
    },
    [maxTilt]
  );

  const onMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)",
        willChange: "transform",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}
