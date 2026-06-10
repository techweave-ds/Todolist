"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GraduationCap, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/types";

export function ArticleDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    import("@/data/articles").then((m) => setArticle(m.articles.find((a: Article) => a.id === params.id) || null));
  }, [params.id]);

  if (!article) {
    return <div className="flex items-center justify-center py-24 text-muted-foreground">
      <div className="text-center"><GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>Article not found</p></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.push("/learn")}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10"><GraduationCap className="h-6 w-6 text-primary" /></div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{article.category}</Badge>
            <Badge variant={article.level === "beginner" ? "secondary" : article.level === "expert" ? "destructive" : "outline"}>{article.level}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{article.readingTime} min read</span>
          </div>
          <h1 className="text-2xl font-bold">{article.title}</h1>
          <p className="text-muted-foreground mt-1">{article.description}</p>
        </div>
      </div>
      {article.prerequisites && article.prerequisites.length > 0 && (
        <Card><CardContent className="py-3 px-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Prerequisites</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {article.prerequisites.map((p: string, i: number) => <li key={i}>{p}</li>)}
          </ul>
        </CardContent></Card>
      )}
      <Card>
        <CardContent className="p-6">
          <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto leading-relaxed">{article.content}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
