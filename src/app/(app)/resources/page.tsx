"use client";

import { Folder, ExternalLink, BookOpen, FileText, Video, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const resources = [
  {
    title: "Official Git Documentation",
    desc: "Complete Git reference manual and documentation",
    url: "https://git-scm.com/doc",
    icon: BookOpen,
    tags: ["Official", "Reference"],
  },
  {
    title: "GitHub Docs",
    desc: "Official GitHub documentation and guides",
    url: "https://docs.github.com",
    icon: Globe,
    tags: ["GitHub", "Official"],
  },
  {
    title: "Pro Git Book",
    desc: "Free online book covering Git in depth",
    url: "https://git-scm.com/book",
    icon: BookOpen,
    tags: ["Book", "Free"],
  },
  {
    title: "GitHub Skills",
    desc: "Interactive courses to learn GitHub",
    url: "https://skills.github.com",
    icon: Video,
    tags: ["Interactive", "Free"],
  },
  {
    title: "Conventional Commits",
    desc: "Specification for conventional commit messages",
    url: "https://www.conventionalcommits.org",
    icon: FileText,
    tags: ["Standard", "Commits"],
  },
  {
    title: "GitHub Changelog",
    desc: "Stay updated with the latest GitHub features",
    url: "https://github.blog/changelog",
    icon: Globe,
    tags: ["Updates", "GitHub"],
  },
  {
    title: "Atlassian Git Tutorials",
    desc: "Comprehensive Git tutorials from Atlassian",
    url: "https://www.atlassian.com/git/tutorials",
    icon: Video,
    tags: ["Tutorials", "Free"],
  },
  {
    title: "Oh My Git!",
    desc: "Learn Git through an interactive game",
    url: "https://ohmygit.org",
    icon: Video,
    tags: ["Game", "Learning"],
  },
  {
    title: "GitHub Git Cheatsheet",
    desc: "Official GitHub Git cheat sheet PDF",
    url: "https://training.github.com/downloads/github-git-cheat-sheet.pdf",
    icon: FileText,
    tags: ["Cheatsheet", "PDF"],
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Folder className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-sm text-muted-foreground">Curated Git and GitHub resources</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((r) => (
          <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer">
            <Card className="hover:border-primary/30 transition-all hover:translate-y-[-2px] cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <r.icon className="h-5 w-5 text-primary" />
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-base mt-2">{r.title}</CardTitle>
                <CardDescription>{r.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {r.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
