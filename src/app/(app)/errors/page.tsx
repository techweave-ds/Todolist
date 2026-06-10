"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GitError, ErrorCategory } from "@/types";

const categories: ErrorCategory[] = [
  "Push Errors", "Pull Errors", "Merge Errors", "Rebase Errors",
  "Branch Errors", "Authentication Errors", "SSH Errors", "GitHub Errors",
  "Actions Errors", "CI/CD Errors", "Repository Errors", "Configuration Errors",
  "Stash Errors", "Tag Errors", "Detached HEAD Errors", "Submodule Errors",
  "Index Errors", "Recovery Errors"
];

export default function ErrorsPage() {
  const [errors, setErrors] = useState<GitError[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    import("@/data/errors").then((m) => setErrors(m.errors));
  }, []);

  const filtered = errors.filter((e) => {
    const matchesSearch = search === "" || 
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const severityColor = (s?: string) => {
    if (s === "critical") return "destructive";
    if (s === "high") return "destructive";
    if (s === "medium") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <div>
          <h1 className="text-2xl font-bold">Git Error Center</h1>
          <p className="text-sm text-muted-foreground">Search and browse 1,000+ Git errors</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search errors by title, description..."
            className="pl-9"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 8).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? "all" : cat)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              selectedCategory === cat
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        Showing {filtered.length} of {errors.length} errors
      </div>

      <div className="space-y-2">
        {filtered.map((error, i) => (
          <motion.div
            key={error.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <a href={`/errors/${error.id}`}>
              <Card className="hover:border-primary/30 transition-all hover:translate-x-1 cursor-pointer">
                <CardContent className="py-3 flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{error.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{error.category}</p>
                  </div>
                  <Badge variant={severityColor(error.severity)} className="shrink-0">{error.severity}</Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No errors found</p>
          </div>
        )}
      </div>
    </div>
  );
}
