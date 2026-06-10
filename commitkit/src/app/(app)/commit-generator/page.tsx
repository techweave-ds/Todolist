"use client";

import { useState } from "react";
import { GitCommit, Copy, Check, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateCommits, getCommitTypes } from "@/engines/commit-engine";
import { toast } from "@/components/toaster";
import type { CommitType, CommitOutput } from "@/types";

export default function CommitGeneratorPage() {
  const [type, setType] = useState<CommitType>("feat");
  const [scope, setScope] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [breaking, setBreaking] = useState("");
  const [issues, setIssues] = useState("");
  const [output, setOutput] = useState<CommitOutput | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [inputsExpanded, setInputsExpanded] = useState(false);

  const types = getCommitTypes();

  const handleGenerate = () => {
    if (!description.trim()) return;
    const result = generateCommits({
      type,
      scope,
      description: description.trim(),
      body: body.trim() || undefined,
      breaking: breaking.trim() || undefined,
      issues: issues.trim() ? issues.split(",").map((i) => i.trim()) : undefined,
    });
    setOutput(result);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast("Copied!", "success");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10"><GitCommit className="h-6 w-6 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold">Commit Message Generator</h1>
          <p className="text-sm text-muted-foreground">Generate conventional commit messages</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commit Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type</label>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    type === t.value
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t.value}
                  <span className="block text-[10px] opacity-60">{t.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Scope (optional)</label>
            <Input value={scope} onChange={(e) => setScope(e.target.value)} placeholder="e.g., auth, api, ui..." />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description *</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description of changes" />
          </div>

          <button onClick={() => setInputsExpanded(!inputsExpanded)} className="text-xs text-primary hover:underline">
            {inputsExpanded ? "Less options" : "More options"}
          </button>

          {inputsExpanded && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Body (optional)</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Detailed description of changes" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Breaking Change (optional)</label>
                <Input value={breaking} onChange={(e) => setBreaking(e.target.value)} placeholder="Describe the breaking change" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Issues (comma-separated, optional)</label>
                <Input value={issues} onChange={(e) => setIssues(e.target.value)} placeholder="e.g., #123, #456" />
              </div>
            </div>
          )}

          <Button onClick={handleGenerate} disabled={!description.trim()} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" /> Generate Commit Message
          </Button>
        </CardContent>
      </Card>

      {output && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight className="h-4 w-4 text-primary" />
            Semantic Version: <Badge variant={output.semverBump === "major" ? "destructive" : output.semverBump === "minor" ? "default" : "secondary"}>{output.semverBump.toUpperCase()}</Badge> bump
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Conventional Commit</CardTitle>
              <button onClick={() => copyToClipboard(output.conventional, "conventional")}>
                {copied === "conventional" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </CardHeader>
            <CardContent>
              <code className="text-sm font-mono bg-muted block p-3 rounded-md">{output.conventional}</code>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Short Version</CardTitle>
                <button onClick={() => copyToClipboard(output.short, "short")}>
                  {copied === "short" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </button>
              </CardHeader>
              <CardContent>
                <code className="text-xs font-mono">{output.short}</code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Enterprise Version</CardTitle>
                <button onClick={() => copyToClipboard(output.enterprise, "enterprise")}>
                  {copied === "enterprise" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </button>
              </CardHeader>
              <CardContent>
                <code className="text-xs font-mono whitespace-pre-wrap">{output.enterprise}</code>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Long Version</CardTitle>
              <button onClick={() => copyToClipboard(output.long, "long")}>
                {copied === "long" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono whitespace-pre-wrap bg-muted p-3 rounded-md">{output.long}</pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Examples</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {output.examples.map((ex, i) => (
                  <li key={i}><code className="text-xs font-mono text-muted-foreground">{ex}</code></li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
