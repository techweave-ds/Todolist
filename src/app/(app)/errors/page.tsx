"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Search, ChevronRight, Bug, Filter } from "lucide-react";
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

const severityConfig = {
  critical: "bg-red-500/10 text-red-400 border-red-500/30",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20">
          <Bug className="h-6 w-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Git Error Center</h1>
          <p className="text-sm text-muted-foreground">Search and browse 1,000+ Git errors with solutions</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search errors by title, description..."
            className="pl-9 border-red-500/20"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-red-500/20 bg-background/50 pl-9 pr-4 py-1.5 text-sm shadow-sm appearance-none min-w-[160px]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 8).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? "all" : cat)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              selectedCategory === cat
                ? "bg-red-500/20 border-red-500/30 text-red-300"
                : "border-border text-muted-foreground hover:border-red-500/30"
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
              <Card className="group hover:border-red-500/30 transition-all hover:-translate-y-0.5 cursor-pointer border-red-500/10">
                <CardContent className="py-3 flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{error.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{error.category}</p>
                  </div>
                  {error.severity && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${severityConfig[error.severity as keyof typeof severityConfig] || severityConfig.low}`}>
                      {error.severity}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bug className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No errors found</p>
          </div>
        )}
      </div>
    </div>
  );
}
