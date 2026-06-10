"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { search, buildSearchIndex } from "@/lib/search";
import type { SearchResult } from "@/types";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryColors: Record<string, string> = {
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  command: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cheatsheet: "bg-green-500/10 text-green-400 border-green-500/20",
  article: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  workflow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const loadIndex = async () => {
      const { errors } = await import("@/data/errors");
      const { commands } = await import("@/data/commands");
      const { cheatsheets } = await import("@/data/cheatsheets");
      const { articles } = await import("@/data/articles");
      const { workflows } = await import("@/data/workflows");
      const index = buildSearchIndex(errors, commands, cheatsheets, articles, workflows);
      index.forEach((item) => {
        const { addToSearchIndex } = require("@/lib/search");
        addToSearchIndex([item]);
      });
    };
    loadIndex();
  }, []);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setResults(search(value));
    setSelectedIndex(0);
  }, []);

  const handleSelect = (result: SearchResult) => {
    onOpenChange(false);
    router.push(result.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 top-[15%] translate-y-0">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search errors, commands, guides..."
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-12 text-base"
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
          {query && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No results found</p>
            </div>
          )}
          {results.map((result, i) => (
            <button
              key={`${result.category}-${result.id}`}
              onClick={() => handleSelect(result)}
              className={cn(
                "flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors",
                i === selectedIndex ? "bg-secondary" : "hover:bg-secondary/50"
              )}
            >
              <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium mt-0.5 shrink-0", categoryColors[result.category])}>
                {result.category}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{result.title}</p>
                <p className="text-xs text-muted-foreground truncate">{result.description}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="border-t px-3 py-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span><kbd className="rounded border bg-muted px-1">↑↓</kbd> Navigate</span>
          <span><kbd className="rounded border bg-muted px-1">↵</kbd> Open</span>
          <span><kbd className="rounded border bg-muted px-1">Esc</kbd> Close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
