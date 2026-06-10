"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, AlertTriangle, Terminal, BookOpen, GraduationCap, GitBranch, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { search, buildSearchIndex } from "@/lib/search";
import type { SearchResult } from "@/types";

const categoryIcons: Record<string, React.ReactNode> = {
  error: <AlertTriangle className="h-4 w-4 text-destructive" />,
  command: <Terminal className="h-4 w-4 text-primary" />,
  cheatsheet: <BookOpen className="h-4 w-4 text-green-400" />,
  article: <GraduationCap className="h-4 w-4 text-purple-400" />,
  workflow: <GitBranch className="h-4 w-4 text-amber-400" />,
};

const categoryColors: Record<string, string> = {
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  command: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cheatsheet: "bg-green-500/10 text-green-400 border-green-500/20",
  article: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  workflow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    async function load() {
      const { errors } = await import("@/data/errors");
      const { commands } = await import("@/data/commands");
      const { cheatsheets } = await import("@/data/cheatsheets");
      const { articles } = await import("@/data/articles");
      const { workflows } = await import("@/data/workflows");
      const index = buildSearchIndex(errors, commands, cheatsheets, articles, workflows);
      if (index.length > 0) {
        index.forEach((item) => {
          const { addToSearchIndex } = require("@/lib/search");
          addToSearchIndex([item]);
        });
      }
      if (initialQuery) {
        setResults(search(initialQuery));
      }
    }
    load();
  }, [initialQuery]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setResults(search(value));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Search className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Search</h1>
          <p className="text-sm text-muted-foreground">Search across errors, commands, guides, and more</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Search everything..." className="pl-10 h-12 text-base" />
      </div>

      {query && (
        <p className="text-sm text-muted-foreground">
          Found {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="space-y-2">
        {results.map((result, i) => (
          <a key={`${result.category}-${result.id}`} href={result.url}>
            <Card className="hover:border-primary/30 transition-all hover:translate-x-1 cursor-pointer">
              <CardContent className="py-3 flex items-center gap-3">
                {categoryIcons[result.category]}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${categoryColors[result.category]}`}>
                      {result.category}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-0.5">{result.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </a>
        ))}
        {query && results.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm mt-1">Try different keywords or browse categories</p>
          </div>
        )}
        {!query && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Search across 1,000+ errors, 500+ commands, 150+ cheat sheets, 200+ articles, and workflows</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-muted-foreground">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
