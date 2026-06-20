"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LevelProgressProps {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  className?: string;
}

export function LevelProgress({ level, currentXp, xpToNextLevel, className }: LevelProgressProps) {
  const progress = Math.min((currentXp / xpToNextLevel) * 100, 100);

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Level {level}</span>
        <span className="text-xs text-muted-foreground">
          {currentXp} / {xpToNextLevel} XP
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
