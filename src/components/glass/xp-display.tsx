"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn, formatXp } from "@/lib/utils";

interface XpDisplayProps {
  amount: number;
  show: boolean;
  className?: string;
}

export function XpDisplay({ amount, show, className }: XpDisplayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("xp-text text-lg font-bold pointer-events-none", className)}
        >
          +{formatXp(amount)} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
