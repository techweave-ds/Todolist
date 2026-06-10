"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  AlertTriangle,
  Terminal,
  GitCommit,
  FileText,
  GitPullRequest,
  Package,
  Search,
  GitBranch,
  LifeBuoy,
  BookOpen,
  GraduationCap,
  Folder,
  Info,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { mainNavigation } from "@/lib/navigation";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ReactNode> = {
  home: <Home className="h-4 w-4" />,
  "alert-triangle": <AlertTriangle className="h-4 w-4" />,
  terminal: <Terminal className="h-4 w-4" />,
  "git-commit": <GitCommit className="h-4 w-4" />,
  "file-text": <FileText className="h-4 w-4" />,
  "git-pull-request": <GitPullRequest className="h-4 w-4" />,
  package: <Package className="h-4 w-4" />,
  search: <Search className="h-4 w-4" />,
  "git-branch": <GitBranch className="h-4 w-4" />,
  "life-buoy": <LifeBuoy className="h-4 w-4" />,
  "book-open": <BookOpen className="h-4 w-4" />,
  "graduation-cap": <GraduationCap className="h-4 w-4" />,
  folder: <Folder className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  wrench: <Wrench className="h-4 w-4" />,
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} />
      )}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r bg-background overflow-y-auto scrollbar-thin md:static md:z-auto md:block md:translate-x-0"
          >
            <div className="p-4 space-y-1">
              {mainNavigation.map((item) => (
                <div key={item.href}>
                  {item.children ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {iconMap[item.icon]}
                        {item.label}
                      </div>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ml-6",
                            pathname === child.href
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          )}
                        >
                          {iconMap[child.icon]}
                          {child.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      {iconMap[item.icon]}
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
