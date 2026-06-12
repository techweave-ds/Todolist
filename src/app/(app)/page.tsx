"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Search, Terminal, AlertTriangle, BookOpen, GraduationCap, GitBranch, GitCommit, ArrowRight, Star, GitPullRequest, FileText, Package, LifeBuoy, Zap, MessageSquareText, FolderGit2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TiltCard } from "@/components/tilt-card";
import { MagneticButton } from "@/components/magnetic-button";
import { useRouter } from "next/navigation";
import type { GitError, CommandRecipe, CheatSheet, Article } from "@/types";

const stats = [
  { label: "Git Errors Solved", value: "1,000+", icon: AlertTriangle, color: "from-rose-500 to-pink-500" },
  { label: "Command Recipes", value: "500+", icon: Terminal, color: "from-violet-500 to-purple-500" },
  { label: "Cheat Sheets", value: "150+", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
  { label: "Learning Articles", value: "200+", icon: GraduationCap, color: "from-cyan-500 to-blue-500" },
];

const quickActions = [
  { label: "Smart Command", href: "/commands", icon: Zap, desc: "Describe what you want", gradient: "from-violet-500/20 to-purple-500/10" },
  { label: "Folder Builder", href: "/commands", icon: FolderGit2, desc: "Generate from directory", gradient: "from-blue-500/20 to-cyan-500/10" },
  { label: "Commits", href: "/commit-generator", icon: GitCommit, desc: "Generate commit messages", gradient: "from-emerald-500/20 to-teal-500/10" },
  { label: "README", href: "/readme-generator", icon: FileText, desc: "Create README files", gradient: "from-amber-500/20 to-orange-500/10" },
  { label: "PRs", href: "/pr-generator", icon: GitPullRequest, desc: "Pull request descs", gradient: "from-rose-500/20 to-pink-500/10" },
  { label: "Release Notes", href: "/release-notes-generator", icon: Package, desc: "Generate changelogs", gradient: "from-indigo-500/20 to-violet-500/10" },
  { label: "Analyze", href: "/repo-analyzer", icon: Search, desc: "Analyze any repo", gradient: "from-sky-500/20 to-blue-500/10" },
  { label: "Troubleshoot", href: "/troubleshooter", icon: LifeBuoy, desc: "Fix Git problems", gradient: "from-red-500/20 to-rose-500/10" },
  { label: "Workflows", href: "/workflow-builder", icon: GitBranch, desc: "Build Git workflows", gradient: "from-green-500/20 to-emerald-500/10" },
];

const learningTracks = [
  { title: "Git Foundations", desc: "Start from zero", level: "Beginner", color: "from-emerald-500 to-teal-500" },
  { title: "Git Collaboration", desc: "Work with teams", level: "Intermediate", color: "from-blue-500 to-cyan-500" },
  { title: "Release Management", desc: "Ship with confidence", level: "Advanced", color: "from-violet-500 to-purple-500" },
  { title: "Enterprise Git", desc: "Scale your org", level: "Expert", color: "from-amber-500 to-orange-500" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [popularErrors, setPopularErrors] = useState<GitError[]>([]);
  const [popularCommands, setPopularCommands] = useState<CommandRecipe[]>([]);

  useEffect(() => {
    async function load() {
      const { errors } = await import("@/data/errors");
      const { commands } = await import("@/data/commands");
      setPopularErrors(errors.filter((e: GitError) => e.severity === "critical" || e.severity === "high").slice(0, 5));
      setPopularCommands(commands.slice(0, 5));
    }
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="space-y-24 pb-16">
      {/* Hero */}
      <section className="relative pt-16 md:pt-24 text-center overflow-hidden section-3d">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-500/10 blur-[150px] animate-pulse-glow" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px] animate-drift" />
        <div className="absolute bottom-1/4 left-1/5 w-[250px] h-[250px] rounded-full bg-purple-500/5 blur-[80px] animate-drift" style={{ animationDelay: "-5s" }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-sm text-violet-300 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Free &bull; Open Source &bull; Cloudflare
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-tight">
            <span className="inline-block animate-fade-up">Search Errors.</span>
            <br />
            <span className="text-shimmer inline-block animate-fade-up animate-fade-up-2">Generate Commands.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent inline-block animate-fade-up animate-fade-up-3">Master Git.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animate-fade-up-4">
            The ultimate Git & GitHub developer platform. Search 1,000+ errors, generate commands
            from plain English, build folder-based workflows — all free, all client-side.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative animate-fade-up animate-fade-up-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 rounded-xl opacity-20 group-hover:opacity-40 blur transition-all duration-500 animate-gradient" />
              <div className="relative flex">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Try "how to undo last commit" or "push to github"...'
                  className="pl-12 h-14 text-base bg-background/80 border-violet-500/30 focus-visible:ring-violet-500 rounded-xl flex-1"
                />
                <MagneticButton>
                  <Button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-11 px-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 rounded-lg">
                    <Zap className="h-4 w-4 mr-2" /> Search
                  </Button>
                </MagneticButton>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["undo last commit", "merge conflict", "push to github", "create branch", ".env committed"].map((s) => (
                <button key={s} onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)} className="text-xs px-3 py-1 rounded-full border border-violet-500/10 text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-all bg-muted/50 hover:bg-violet-500/10">
                  {s}
                </button>
              ))}
            </div>
          </form>
        </motion.div>
      </section>

      {/* Stats */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <TiltCard tiltDegree={6} glare={false}>
              <Card className="relative overflow-hidden group hover:border-violet-500/30 transition-all duration-500 border-violet-500/10">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`} />
                <CardContent className="pt-6 relative">
                  <div className="flex justify-center mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 tilt-card-icon`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tilt-card-content`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 tilt-card-depth">{stat.label}</div>
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </motion.section>

      {/* Quick Actions */}
      <section>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <Star className="h-5 w-5 text-violet-400" />
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          {quickActions.map((action) => (
            <motion.div key={action.label} variants={itemVariants}>
              <TiltCard tiltDegree={5} glare={false}>
                <a href={action.href}>
                  <Card className="relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300 cursor-pointer h-full border-violet-500/10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <CardContent className="py-4 relative">
                      <div className="p-2 rounded-lg bg-violet-500/10 w-fit mb-3 group-hover:scale-110 transition-transform tilt-card-icon">
                        <action.icon className="h-4 w-4 text-violet-400" />
                      </div>
                      <div className="text-sm font-medium tilt-card-content">{action.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 tilt-card-depth">{action.desc}</div>
                    </CardContent>
                  </Card>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Natural Language CTA */}
      <section className="relative overflow-hidden rounded-2xl border border-violet-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-cyan-500/5 to-violet-500/5" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
        <div className="relative p-8 md:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-violet-500/10 text-violet-300 border-violet-500/20 px-3 py-1">
              <MessageSquareText className="h-3.5 w-3.5 mr-1.5" /> New
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Just describe what you need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Type <span className="text-violet-300 font-mono text-sm">"I accidentally committed my .env file"</span> or <span className="text-cyan-300 font-mono text-sm">"push my project to GitHub"</span> — we'll give you the exact commands.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <MagneticButton>
                <Button onClick={() => router.push("/commands")} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0">
                  <MessageSquareText className="h-4 w-4 mr-2" /> Try Natural Language
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button onClick={() => router.push("/troubleshooter")} variant="outline" className="border-violet-500/30 hover:bg-violet-500/10">
                  <LifeBuoy className="h-4 w-4 mr-2" /> Troubleshooter
                </Button>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Errors */}
      <section>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-4"
        >
          <h2 className="text-xl font-semibold">🔥 Popular Errors</h2>
          <a href="/errors" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"><ArrowRight className="h-3 w-3" /> View all 1,000+</a>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-2"
        >
          {popularErrors.map((error) => (
            <motion.div key={error.id} variants={itemVariants}>
              <TiltCard tiltDegree={4} glare={false}>
                <a href={`/errors/${error.id}`}>
                  <Card className="group hover:border-violet-500/30 transition-all cursor-pointer border-rose-500/10">
                    <CardContent className="py-3 flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 tilt-card-icon" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate tilt-card-content">{error.title}</p>
                        <p className="text-xs text-muted-foreground">{error.category}</p>
                      </div>
                      <Badge variant={error.severity === "critical" ? "destructive" : "secondary"} className="shrink-0">{error.severity}</Badge>
                    </CardContent>
                  </Card>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Commands & Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-4"
          >
            <h2 className="text-xl font-semibold">⚡ Popular Commands</h2>
            <a href="/commands" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"><ArrowRight className="h-3 w-3" /> View all 500+</a>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-2"
          >
            {popularCommands.map((cmd) => (
              <motion.div key={cmd.id} variants={itemVariants}>
                <TiltCard tiltDegree={4} glare={false}>
                  <a href={`/commands/${cmd.id}`}>
                    <Card className="group hover:border-cyan-500/30 transition-all cursor-pointer border-cyan-500/10">
                      <CardContent className="py-3 flex items-center gap-3">
                        <Terminal className="h-4 w-4 text-cyan-400 shrink-0 tilt-card-icon" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate tilt-card-content">{cmd.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{cmd.description}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">{cmd.category}</Badge>
                      </CardContent>
                    </Card>
                  </a>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-4"
          >
            <h2 className="text-xl font-semibold">📚 Learning Tracks</h2>
            <a href="/learn" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"><ArrowRight className="h-3 w-3" /> View all 200+</a>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-3"
          >
            {learningTracks.map((track) => (
              <motion.div key={track.title} variants={itemVariants}>
                <TiltCard tiltDegree={4} glare={false}>
                  <a href="/learn">
                    <Card className="group relative overflow-hidden hover:border-violet-500/30 transition-all cursor-pointer border-violet-500/10">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${track.color}`} />
                      <CardContent className="py-4 pl-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium tilt-card-content">{track.title}</p>
                            <p className="text-xs text-muted-foreground">{track.desc}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px]">{track.level}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-violet-500/10 pt-8 text-center relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
        <div className="flex items-center justify-center gap-2 mb-2">
          <Terminal className="h-4 w-4 text-violet-400" />
          <span className="font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">CommitKit</span>
        </div>
        <p className="text-sm text-muted-foreground">Search Errors. Generate Commands. Master Git.</p>
        <p className="text-xs text-muted-foreground mt-1">Next.js &bull; Tailwind CSS &bull; Fuse.js &bull; Cloudflare Pages</p>
      </motion.footer>
    </div>
  );
}
