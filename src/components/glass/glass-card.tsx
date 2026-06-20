"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  delay?: number;
}

export function GlassCard({ children, className, hover = false, glow = false, gradient = false, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 relative overflow-hidden",
        hover && "hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 cursor-pointer",
        glow && "shadow-[0_0_20px_rgba(59,130,246,0.1)]",
        gradient && "gradient-border",
        className
      )}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
