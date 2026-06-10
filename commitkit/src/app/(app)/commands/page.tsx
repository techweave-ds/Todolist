"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, MessageSquareText, Copy, Check, ArrowRight, Sparkles, Terminal, FolderGit2, GitBranch, Globe, BookOpen, ChevronRight, Search, Lightbulb, Shield, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/toaster";
import { interpretNaturalLanguage, generateFolderCommands } from "@/engines/folder-command-engine";
import type { CommandRecipe } from "@/types";
import type { NaturalLanguageResult, FolderCommandOutput } from "@/engines/folder-command-engine";

const providers = [
  { value: "github", label: "GitHub", icon: GitPullRequest },
  { value: "gitlab", label: "GitLab", icon: Globe },
  { value: "bitbucket", label: "Bitbucket", icon: Globe },
  { value: "azure", label: "Azure DevOps", icon: Globe },
];

const quickNLPrompts = [
  "push my project to github",
  "create a new branch for a feature",
  "undo my last commit",
  "clone a repository",
  "merge my feature branch",
  "backup my entire repo",
  "set up git for a new project",
  "resolve a merge conflict",
  "stash my changes temporarily",
  "find what commit broke my code",
];

export default function CommandsPage() {
  const [commands, setCommands] = useState<CommandRecipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // NL query state
  const [nlQuery, setNlQuery] = useState("");
  const [nlResult, setNlResult] = useState<NaturalLanguageResult | null>(null);
  const [nlSearched, setNlSearched] = useState(false);

  // Folder command state
  const [repoUrl, setRepoUrl] = useState("");
  const [projectPath, setProjectPath] = useState("");
  const [branch, setBranch] = useState("");
  const [commitMsg, setCommitMsg] = useState("");
  const [localFolder, setLocalFolder] = useState("");
  const [mode, setMode] = useState<"init" | "push" | "clone" | "pull" | "backup">("init");
  const [provider, setProvider] = useState("github");
  const [folderResult, setFolderResult] = useState<FolderCommandOutput | null>(null);
  const [folderGenerated, setFolderGenerated] = useState(false);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    import("@/data/commands").then((m) => setCommands(m.commands));
  }, []);

  const filtered = commands.filter((c) => {
    const matchesSearch = searchQuery === "" || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNLSearch = () => {
    if (!nlQuery.trim()) return;
    const result = interpretNaturalLanguage(nlQuery);
    setNlResult(result);
    setNlSearched(true);
  };

  const handleQuickNL = (prompt: string) => {
    setNlQuery(prompt);
    const result = interpretNaturalLanguage(prompt);
    setNlResult(result);
    setNlSearched(true);
  };

  const handleFolderGenerate = () => {
    if (!repoUrl.trim()) return;
    const result = generateFolderCommands({
      repoUrl: repoUrl.trim(),
      projectPath: projectPath.trim(),
      branch: branch.trim() || "main",
      commitMessage: commitMsg.trim() || "Initial commit",
      localFolderName: localFolder.trim(),
      mode,
      provider: provider as any,
    });
    setFolderResult(result);
    setFolderGenerated(true);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast("Copied!", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast("All commands copied!", "success");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20">
          <Zap className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Smart Command Center</h1>
          <p className="text-sm text-muted-foreground">Describe, build, or browse — get the right Git command instantly</p>
        </div>
      </div>

      <Tabs defaultValue="natural-language" className="space-y-6">
        <TabsList className="bg-muted/50 border border-violet-500/10 p-1 w-full justify-start overflow-x-auto">
          <TabsTrigger value="natural-language" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 gap-2">
            <MessageSquareText className="h-4 w-4" /> Natural Language
          </TabsTrigger>
          <TabsTrigger value="folder" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 gap-2">
            <FolderGit2 className="h-4 w-4" /> Folder Builder
          </TabsTrigger>
          <TabsTrigger value="browse" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 gap-2">
            <Terminal className="h-4 w-4" /> Browse Commands
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Natural Language */}
        <TabsContent value="natural-language" className="space-y-6 mt-0">
          <Card className="relative overflow-hidden border-violet-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5" />
            <CardContent className="pt-6 relative">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium">Describe what you want to do in plain English</span>
              </div>
              <div className="relative">
                <MessageSquareText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNLSearch()}
                  placeholder='e.g., "I want to push my project to GitHub" or "undo my last commit"...'
                  className="pl-12 h-13 text-base bg-background/50 border-violet-500/30 focus-visible:ring-violet-500 rounded-xl"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {quickNLPrompts.slice(0, 6).map((p) => (
                  <button key={p} onClick={() => handleQuickNL(p)} className="text-xs px-3 py-1.5 rounded-full border border-violet-500/10 text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-all bg-muted/30">
                    {p}
                  </button>
                ))}
              </div>
              <Button onClick={handleNLSearch} disabled={!nlQuery.trim()} className="mt-4 w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0">
                <Zap className="h-4 w-4 mr-2" /> Interpret Command
              </Button>
            </CardContent>
          </Card>

          <AnimatePresence>
            {nlSearched && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {!nlResult ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">Could not interpret your request</p>
                      <p className="text-sm mt-1">Try rephrasing or use more specific Git terminology</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Card className="border-emerald-500/20 bg-emerald-500/5">
                      <CardContent className="py-4 flex items-center gap-3">
                        <Lightbulb className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-sm font-medium text-emerald-300">Interpreted as: <span className="text-foreground">{nlResult.interpretedGoal}</span></p>
                          <p className="text-xs text-muted-foreground mt-0.5">{nlResult.context}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2"><Terminal className="h-4 w-4 text-cyan-400" /> Commands</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => copyAll(nlResult.commands.join("\n"))} className="border-violet-500/30">
                          {copiedAll ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />} Copy All
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {nlResult.commands.map((cmd, i) => (
                          <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2.5 group hover:bg-muted/80 transition-colors cursor-pointer border border-violet-500/10" onClick={() => copyToClipboard(cmd, i)}>
                            <code className="flex-1 text-sm font-mono">{cmd}</code>
                            {copiedIndex === i ? <Check className="h-4 w-4 text-emerald-400 shrink-0" /> : <Copy className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-violet-400" /> Explanation</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{nlResult.explanation}</p></CardContent>
                    </Card>

                    <Card className="border-amber-500/20 bg-amber-500/5">
                      <CardHeader><CardTitle className="text-base text-amber-400 flex items-center gap-2"><Shield className="h-4 w-4" /> Context & Tips</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-amber-300/80">{nlResult.context}</p></CardContent>
                    </Card>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Tab 2: Folder Builder */}
        <TabsContent value="folder" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><FolderGit2 className="h-4 w-4 text-violet-400" /> Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Provider</label>
                  <div className="flex gap-2">
                    {providers.map((p) => (
                      <button key={p.value} onClick={() => setProvider(p.value)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${provider === p.value ? "bg-violet-500/20 border-violet-500/30 text-violet-300" : "border-border text-muted-foreground hover:border-violet-500/30"}`}>
                        <p.icon className="h-3.5 w-3.5" /> {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Remote Repo URL (SSH or HTTPS)</label>
                  <Input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="git@github.com:user/repo.git or https://..." className="bg-background/50 border-violet-500/20" />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Mode</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: "init" as const, label: "Initial Upload", desc: "First time push" },
                      { value: "push" as const, label: "Commit & Push", desc: "Update remote" },
                      { value: "clone" as const, label: "Clone", desc: "Download repo" },
                      { value: "pull" as const, label: "Pull", desc: "Update local" },
                      { value: "backup" as const, label: "Backup", desc: "Full backup" },
                    ].map((m) => (
                      <button key={m.value} onClick={() => setMode(m.value)} className={`px-2.5 py-1.5 text-xs rounded-lg border transition-all text-left ${mode === m.value ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-300" : "border-border text-muted-foreground hover:border-cyan-500/30"}`}>
                        <div className="font-medium">{m.label}</div>
                        <div className="text-[10px] opacity-70">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Project Path (local)</label>
                    <Input value={projectPath} onChange={(e) => setProjectPath(e.target.value)} placeholder="/path/to/project" className="bg-background/50 border-violet-500/20" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Branch</label>
                    <Input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="main" className="bg-background/50 border-violet-500/20" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Commit Message</label>
                  <Input value={commitMsg} onChange={(e) => setCommitMsg(e.target.value)} placeholder="Initial commit" className="bg-background/50 border-violet-500/20" />
                </div>

                {mode === "clone" && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Local Folder Name (optional)</label>
                    <Input value={localFolder} onChange={(e) => setLocalFolder(e.target.value)} placeholder="my-project" className="bg-background/50 border-violet-500/20" />
                  </div>
                )}

                <Button onClick={handleFolderGenerate} disabled={!repoUrl.trim()} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0">
                  <Terminal className="h-4 w-4 mr-2" /> Generate Command Sequence
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <AnimatePresence>
                {folderGenerated && folderResult && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <Card className="border-cyan-500/20">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Terminal className="h-4 w-4 text-cyan-400" />
                          {folderResult.title}
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={() => copyAll(folderResult.fullCommand)} className="border-cyan-500/30">
                          {copiedAll ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />} Copy All
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {folderResult.steps.map((step, i) => (
                          <div key={i} className="relative pl-8 group">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-cyan-500 rounded-full opacity-30" />
                            <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-[10px] font-bold flex items-center justify-center text-white">
                              {i + 1}
                            </div>
                            <div className="bg-muted/30 rounded-lg p-3 border border-violet-500/10 cursor-pointer hover:border-violet-500/30 transition-colors" onClick={() => copyToClipboard(step.command, i)}>
                              <div className="flex items-center gap-2">
                                <code className="flex-1 text-sm font-mono">{step.command}</code>
                                {copiedIndex === i ? <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1.5">{step.description}</p>
                              <p className="text-[11px] text-muted-foreground/60 mt-0.5 italic">{step.explanation}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {folderResult.warnings.length > 0 && (
                      <Card className="border-amber-500/20 bg-amber-500/5">
                        <CardHeader><CardTitle className="text-sm text-amber-400 flex items-center gap-2"><Shield className="h-4 w-4" /> Warnings</CardTitle></CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {folderResult.warnings.map((w, i) => (
                              <li key={i} className="text-xs text-amber-300/80 flex items-start gap-2"><span className="mt-1">•</span>{w}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader><CardTitle className="text-sm">Full Command Sequence</CardTitle></CardHeader>
                      <CardContent>
                        <pre className="text-xs font-mono whitespace-pre-wrap bg-muted/50 p-4 rounded-lg border border-violet-500/10">{folderResult.fullCommand}</pre>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {!folderGenerated && (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <FolderGit2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Configure & generate</p>
                    <p className="text-sm mt-1">Enter your repo URL and settings to get a step-by-step command sequence</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Browse Commands */}
        <TabsContent value="browse" className="space-y-6 mt-0">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search 500+ commands..." className="pl-9 border-violet-500/20" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory("all")} className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedCategory === "all" ? "bg-violet-500/20 border-violet-500/30 text-violet-300" : "border-border text-muted-foreground hover:border-violet-500/30"}`}>All</button>
            {["Setup", "Clone", "Push", "Pull", "Branch", "Merge", "Rebase", "Stash", "Tag", "Reset", "Revert", "Cherry Pick", "Recovery", "Diff", "Log", "Config", "Remote", "Submodule"].map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? "all" : cat)} className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedCategory === cat ? "bg-violet-500/20 border-violet-500/30 text-violet-300" : "border-border text-muted-foreground hover:border-violet-500/30"}`}>{cat}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((cmd, i) => (
              <motion.a key={cmd.id} href={`/commands/${cmd.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                <Card className="group hover:border-violet-500/30 transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <Terminal className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{cmd.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{cmd.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-[10px] border-violet-500/20">{cmd.category}</Badge>
                          {cmd.commands[0] && <code className="text-[10px] text-muted-foreground font-mono truncate">{cmd.commands[0]}</code>}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
