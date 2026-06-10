"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CheatSheet } from "@/types";

const categoryColors: Record<string, string> = {
  "Git Basics": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Git Branching": "bg-green-500/10 text-green-400 border-green-500/20",
  "GitHub Actions": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  SSH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function CheatSheetsPage() {
  const [cheatsheets, setCheatsheets] = useState<CheatSheet[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");

  useEffect(() => {
    import("@/data/cheatsheets").then((m) => setCheatsheets(m.cheatsheets));
  }, []);

  const filtered = cheatsheets.filter((cs) => {
    const matchesSearch = search === "" || cs.title.toLowerCase().includes(search.toLowerCase()) || cs.description.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = level === "all" || cs.level === level;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Cheat Sheet Library</h1>
          <p className="text-sm text-muted-foreground">150+ quick reference guides for Git</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cheat sheets..." className="pl-9" />
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm">
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cs) => (
          <a key={cs.id} href={`/cheat-sheets/${cs.id}`}>
            <Card className="hover:border-primary/30 transition-all hover:translate-y-[-2px] cursor-pointer h-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-4 w-4 text-primary shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{cs.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cs.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-[10px]">{cs.category}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{cs.level}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
