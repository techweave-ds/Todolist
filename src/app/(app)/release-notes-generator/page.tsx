"use client";

import { useState } from "react";
import { Package, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateReleaseNotes } from "@/engines/release-notes-engine";
import { toast } from "@/components/toaster";

export default function ReleaseNotesPage() {
  const [version, setVersion] = useState("1.0.0");
  const [featuresText, setFeaturesText] = useState("");
  const [fixesText, setFixesText] = useState("");
  const [breakingText, setBreakingText] = useState("");
  const [commitsText, setCommitsText] = useState("");
  const [output, setOutput] = useState<ReturnType<typeof generateReleaseNotes> | null>(null);
  const [copyLabel, setCopyLabel] = useState("");

  const handleGenerate = () => {
    setOutput(generateReleaseNotes({
      version: version.trim() || undefined,
      features: featuresText.split("\n").filter(Boolean),
      fixes: fixesText.split("\n").filter(Boolean),
      breaking: breakingText.split("\n").filter(Boolean),
      commits: commitsText.split("\n").filter(Boolean),
    }));
  };

  const copyTo = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyLabel(label);
    toast("Copied!", "success");
    setTimeout(() => setCopyLabel(""), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10"><Package className="h-6 w-6 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold">Release Notes Generator</h1>
          <p className="text-sm text-muted-foreground">Generate release notes, changelogs, and GitHub releases</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Release Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="Version (e.g., 1.0.0)" />
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Features (one per line)</label>
              <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[60px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Added user dashboard" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Bug Fixes (one per line)</label>
              <textarea value={fixesText} onChange={(e) => setFixesText(e.target.value)} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[60px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Fixed login timeout" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Breaking Changes (one per line)</label>
              <textarea value={breakingText} onChange={(e) => setBreakingText(e.target.value)} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[60px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Deprecated v1 API" />
            </div>
            <Button onClick={handleGenerate} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" /> Generate Release Notes
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {output && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">Release Notes</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyTo(output.notes, "notes")}>
                    {copyLabel === "notes" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent><pre className="text-xs font-mono whitespace-pre-wrap">{output.notes}</pre></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">GitHub Release Format</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyTo(output.githubRelease, "github")}>
                    {copyLabel === "github" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent><pre className="text-xs font-mono whitespace-pre-wrap">{output.githubRelease}</pre></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">Changelog Entry</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyTo(output.changelog, "cl")}>
                    {copyLabel === "cl" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent><pre className="text-xs font-mono whitespace-pre-wrap">{output.changelog}</pre></CardContent>
              </Card>
            </div>
          )}
          {!output && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Enter details to generate</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
