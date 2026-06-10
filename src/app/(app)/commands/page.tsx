"use client";

import { useState, useEffect } from "react";
import { Terminal, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CommandRecipe } from "@/types";

const categories = ["Setup", "Clone", "Push", "Pull", "Branch", "Merge", "Rebase", "Stash", "Tag", "Reset", "Revert", "Cherry Pick", "Reflog", "Recovery", "Diff", "Log", "Config", "Remote", "Submodule", "Worktree", "Bisect", "Blame", "Archive", "Hook"];

export default function CommandsPage() {
  const [commands, setCommands] = useState<CommandRecipe[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    import("@/data/commands").then((m) => setCommands(m.commands));
  }, []);

  const filtered = commands.filter((c) => {
    const matchesSearch = search === "" || 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.commands.some((cmd) => cmd.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Terminal className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Git Command Generator</h1>
          <p className="text-sm text-muted-foreground">500+ command recipes for every Git operation</p>
        </div>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search commands..." className="pl-9" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedCategory("all")} className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedCategory === "all" ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>All</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? "all" : cat)} className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedCategory === cat ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{cat}</button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">Showing {filtered.length} of {commands.length} commands</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((cmd) => (
          <a key={cmd.id} href={`/commands/${cmd.id}`}>
            <Card className="hover:border-primary/30 transition-all hover:translate-y-[-2px] cursor-pointer h-full">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Terminal className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{cmd.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cmd.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">{cmd.category}</Badge>
                      {cmd.commands[0] && <code className="text-[10px] text-muted-foreground font-mono truncate">{cmd.commands[0]}</code>}
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
