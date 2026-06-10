"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Terminal, AlertTriangle, BookOpen, GraduationCap, GitBranch, GitCommit, ArrowRight, Star, GitPullRequest, FileText, Package, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import type { GitError, CommandRecipe, CheatSheet, Article } from "@/types";

const stats = [
  { label: "Git Errors", value: "1,000+", icon: AlertTriangle },
  { label: "Commands", value: "500+", icon: Terminal },
  { label: "Cheat Sheets", value: "150+", icon: BookOpen },
  { label: "Articles", value: "200+", icon: GraduationCap },
];

const quickActions = [
  { label: "Commit Generator", href: "/commit-generator", icon: GitCommit, desc: "Generate conventional commits" },
  { label: "README Generator", href: "/readme-generator", icon: FileText, desc: "Create professional READMEs" },
  { label: "PR Generator", href: "/pr-generator", icon: GitPullRequest, desc: "Generate PR descriptions" },
  { label: "Release Notes", href: "/release-notes-generator", icon: Package, desc: "Generate release notes" },
  { label: "Repo Analyzer", href: "/repo-analyzer", icon: Search, desc: "Analyze GitHub repos" },
  { label: "Workflow Builder", href: "/workflow-builder", icon: GitBranch, desc: "Build Git workflows" },
  { label: "Troubleshooter", href: "/troubleshooter", icon: LifeBuoy, desc: "Fix Git problems" },
];

const learningTracks = [
  { title: "Git Foundations", href: "/learn", desc: "Start here if you're new to Git", level: "Beginner" },
  { title: "Git Collaboration", href: "/learn", desc: "Working with teams using Git", level: "Intermediate" },
  { title: "Release Management", href: "/learn", desc: "Tags, releases, and versioning", level: "Advanced" },
  { title: "Enterprise Git", href: "/learn", desc: "Git at scale for organizations", level: "Expert" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [popularErrors, setPopularErrors] = useState<GitError[]>([]);
  const [popularCommands, setPopularCommands] = useState<CommandRecipe[]>([]);
  const [featuredCheatsheets, setFeaturedCheatsheets] = useState<CheatSheet[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function load() {
      const { errors } = await import("@/data/errors");
      const { commands } = await import("@/data/commands");
      const { cheatsheets } = await import("@/data/cheatsheets");
      const { articles } = await import("@/data/articles");
      setPopularErrors(errors.slice(0, 5));
      setPopularCommands(commands.slice(0, 5));
      setFeaturedCheatsheets(cheatsheets.slice(0, 4));
      setRecentArticles(articles.slice(0, 4));
    }
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="relative pt-12 md:pt-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs border-primary/30 text-primary bg-primary/5">
            Free &bull; Open Source &bull; Cloudflare
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            Search Errors.
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Generate Commands.
            </span>
            <br />
            Master Git.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            The single destination for Git and GitHub help. Search 1,000+ errors, generate commands,
            create commits, and learn Git — all for free.
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 1,000+ Git errors, commands, guides..."
              className="pl-10 h-12 text-base border-primary/20 focus-visible:ring-primary"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </form>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="text-center hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {quickActions.map((action) => (
            <a key={action.href} href={action.href}>
              <Card className="text-center hover:border-primary/30 transition-all hover:translate-y-[-2px] cursor-pointer h-full">
                <CardContent className="pt-4 pb-3">
                  <action.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <div className="text-xs font-medium">{action.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{action.desc}</div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Popular Errors */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Popular Errors</h2>
          <a href="/errors" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></a>
        </div>
        <div className="space-y-2">
          {popularErrors.map((error) => (
            <a key={error.id} href={`/errors/${error.id}`}>
              <Card className="hover:border-primary/30 transition-all hover:translate-x-1 cursor-pointer">
                <CardContent className="py-3 flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{error.title}</p>
                    <p className="text-xs text-muted-foreground">{error.category}</p>
                  </div>
                  <Badge variant={error.severity === "critical" ? "destructive" : "secondary"} className="shrink-0">{error.severity}</Badge>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Popular Commands */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Popular Commands</h2>
          <a href="/commands" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularCommands.map((cmd) => (
            <a key={cmd.id} href={`/commands/${cmd.id}`}>
              <Card className="hover:border-primary/30 transition-all hover:translate-y-[-2px] cursor-pointer">
                <CardContent className="py-3 flex items-center gap-3">
                  <Terminal className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{cmd.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{cmd.description}</p>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Learning Tracks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" /> Learning Tracks
          </h2>
          <a href="/learn" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningTracks.map((track) => (
            <a key={track.title} href={track.href}>
              <Card className="hover:border-primary/30 transition-all hover:translate-y-[-2px] cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base">{track.title}</CardTitle>
                  <CardDescription>{track.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-xs">{track.level}</Badge>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Cheat Sheets & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Cheat Sheets
            </h2>
            <a href="/cheat-sheets" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></a>
          </div>
          <div className="space-y-2">
            {featuredCheatsheets.map((cs) => (
              <a key={cs.id} href={`/cheat-sheets/${cs.id}`}>
                <Card className="hover:border-primary/30 transition-all cursor-pointer">
                  <CardContent className="py-3 flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cs.title}</p>
                      <p className="text-xs text-muted-foreground">{cs.category} &bull; {cs.level}</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" /> Recent Guides
            </h2>
            <a href="/learn" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></a>
          </div>
          <div className="space-y-2">
            {recentArticles.map((article) => (
              <a key={article.id} href={`/learn/${article.id}`}>
                <Card className="hover:border-primary/30 transition-all cursor-pointer">
                  <CardContent className="py-3 flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.category} &bull; {article.readingTime} min read</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px]">{article.level}</Badge>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t pt-8 text-center text-sm text-muted-foreground">
        <p>CommitKit — Free Git & GitHub Developer Platform</p>
        <p className="mt-1">Built with Next.js, Tailwind CSS, Fuse.js &bull; Deployed on Cloudflare Pages</p>
      </footer>
    </div>
  );
}
