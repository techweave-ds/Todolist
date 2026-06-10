"use client";

import Link from "next/link";
import { Menu, Search, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center px-4 gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Terminal className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline-block">CommitKit</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 ml-6">
          {[
            { href: "/errors", label: "Errors" },
            { href: "/commands", label: "Commands" },
            { href: "/cheat-sheets", label: "Cheat Sheets" },
            { href: "/learn", label: "Learn" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex-1" />

        <button
          onClick={onSearchClick}
          className="inline-flex items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm text-muted-foreground shadow-sm hover:bg-secondary transition-colors w-64 max-w-full"
        >
          <Search className="h-4 w-4" />
          <span>Search errors, commands...</span>
          <kbd className="ml-auto hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>
    </header>
  );
}
