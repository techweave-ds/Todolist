"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Search, Clock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/types";

const categories = ["Git Foundations", "Git Collaboration", "GitHub Mastery", "Release Management", "CI/CD", "Monorepos", "Enterprise Git", "Advanced Techniques", "Best Practices", "Troubleshooting"];

export default function LearnPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    import("@/data/articles").then((m) => setArticles(m.articles));
  }, []);

  const filtered = articles.filter((a) => {
    const matchesSearch = search === "" || a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = level === "all" || a.level === level;
    const matchesCategory = category === "all" || a.category === category;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Learning Center</h1>
          <p className="text-sm text-muted-foreground">200+ articles to master Git from beginner to expert</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." className="pl-9" />
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm">
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCategory("all")} className={`px-3 py-1 text-xs rounded-full border transition-colors ${category === "all" ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>All</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(category === cat ? "all" : cat)} className={`px-3 py-1 text-xs rounded-full border transition-colors ${category === cat ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((article) => (
          <a key={article.id} href={`/learn/${article.id}`}>
            <Card className="hover:border-primary/30 transition-all hover:translate-y-[-2px] cursor-pointer h-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-4 w-4 text-primary shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{article.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-[10px]">{article.category}</Badge>
                      <Badge variant={article.level === "beginner" ? "secondary" : article.level === "expert" ? "destructive" : "outline"} className="text-[10px]">{article.level}</Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{article.readingTime} min</span>
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
