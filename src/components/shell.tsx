"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { SearchDialog } from "@/components/search-dialog";
import { Toaster } from "@/components/toaster";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onSearchClick={() => setSearchOpen(true)} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={cn("flex-1 px-4 py-6 md:px-6 lg:px-8 transition-all duration-200", sidebarOpen && "md:ml-64")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <Toaster />
    </div>
  );
}
