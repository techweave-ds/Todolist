"use client";

import { useRef, useState, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
}

export function MagneticButton({ children, className = "" }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPos({ x, y });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setPos({ x: 0, y: 0 }); setHover(false); }}
      className={`inline-block ${className}`}
      style={{ perspective: "600px" }}
    >
      <div
        style={{
          transform: hover
            ? `translate(${pos.x}px, ${pos.y}px) scale(1.05)`
            : "translate(0px, 0px) scale(1)",
          transition: hover ? "transform 0.08s ease-out" : "transform 0.4s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
