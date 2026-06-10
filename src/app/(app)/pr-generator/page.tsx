"use client";

import { useState } from "react";
import { GitPullRequest, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generatePR } from "@/engines/pr-engine";
import { toast } from "@/components/toaster";

export default function PRGeneratorPage() {
  const [changes, setChanges] = useState("");
  const [summary, setSummary] = useState("");
  const [output, setOutput] = useState<ReturnType<typeof generatePR> | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!changes.trim()) return;
    setOutput(generatePR({ changes: changes.trim(), summary: summary.trim() || undefined }));
  };

  const copyAll = () => {
    if (!output) return;
    navigator.clipboard.writeText(output.markdown);
    setCopied(true);
    toast("Copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10"><GitPullRequest className="h-6 w-6 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold">Pull Request Generator</h1>
          <p className="text-sm text-muted-foreground">Generate professional PR descriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Changes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Summary (optional)</label>
              <Input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary of changes" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Changes Made *</label>
              <textarea value={changes} onChange={(e) => setChanges(e.target.value)}
                placeholder="Added user authentication&#10;Updated API endpoints&#10;Fixed login bug"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[150px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <Button onClick={handleGenerate} disabled={!changes.trim()} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" /> Generate PR
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {output && (
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Generated PR</h2>
              <Button variant="outline" size="sm" onClick={copyAll}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
              </Button>
            </div>
          )}
          <Card>
            <CardContent className="p-4">
              {output ? (
                <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-[500px]">{output.markdown}</pre>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <GitPullRequest className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Enter changes to generate PR</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
