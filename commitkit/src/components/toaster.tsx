"use client";

import { useState, useEffect } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let toastListeners: ((toast: Toast) => void)[] = [];

export function toast(message: string, type: Toast["type"] = "info") {
  const id = Math.random().toString(36).slice(2);
  toastListeners.forEach((fn) => fn({ id, message, type }));
  setTimeout(() => {
    toastListeners.forEach((fn) => fn({ id: "", message: "", type: "info" }));
  }, 3000);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListeners.push((t) => {
      if (t.id) {
        setToasts((prev) => [...prev.filter((x) => x.id !== t.id), t]);
      }
    });
    return () => { toastListeners = []; };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-xl animate-in slide-in-from-right-2 ${
            t.type === "success"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : t.type === "error"
              ? "border-red-500/20 bg-red-500/10 text-red-400"
              : "border-blue-500/20 bg-blue-500/10 text-blue-400"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
