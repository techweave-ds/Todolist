"use client";

import { useState } from "react";
import { LifeBuoy, Search, AlertTriangle, CheckCircle, Terminal, Lightbulb, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { troubleshoot } from "@/engines/troubleshoot-engine";
import { toast } from "@/components/toaster";
import type { TroubleshootResult } from "@/types";

const problems = [
  "I accidentally committed my .env file",
  "I have a merge conflict",
  "I'm in detached HEAD state",
  "My push was rejected (non-fast-forward)",
  "I committed to the wrong branch",
  "I want to undo my last commit",
  "I lost my changes",
  "Authentication failed",
  "Rebase conflict",
  "Cherry-pick failed",
];

export default function TroubleshooterPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TroubleshootResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    const res = troubleshoot({ problem: query });
    setResult(res);
    setSearched(true);
  };

  const handleQuick = (problem: string) => {
    setQuery(problem);
    const res = troubleshoot({ problem });
    setResult(res);
    setSearched(true);
  };

  const copyCmd = (cmd: string, i: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(i);
    toast("Copied!", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10"><LifeBuoy className="h-6 w-6 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold">Git Troubleshooter</h1>
          <p className="text-sm text-muted-foreground">Describe your Git problem and get a solution</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-3">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Describe your Git problem..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="flex-1" />
            <Button onClick={handleSearch}><Search className="h-4 w-4 mr-2" /> Solve</Button>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Quick problems:</p>
            <div className="flex flex-wrap gap-2">
              {problems.map((p) => (
                <button key={p} onClick={() => handleQuick(p)} className="text-xs px-2.5 py-1 rounded-md border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {searched && !result && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No solution found for this problem</p>
            <p className="text-xs mt-1">Try rephrasing or browse the error database</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{result.category}</Badge>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Problem</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{result.explanation}</p></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Recovery Plan</CardTitle></CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {result.recoveryPlan.map((step, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Terminal className="h-4 w-4" /> Commands</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {result.commands.map((cmd, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted rounded-md px-3 py-2 group cursor-pointer" onClick={() => copyCmd(cmd, i)}>
                  <code className="flex-1 text-xs font-mono">{cmd}</code>
                  {copiedIndex === i ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Terminal className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {result.warnings.length > 0 && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader><CardTitle className="text-base text-amber-400 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Warnings</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="text-sm text-amber-300/80 flex items-start gap-2"><span className="mt-1">•</span>{w}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /> Best Practices</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {result.bestPractices.map((bp, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><Shield className="h-3 w-3 mt-1 shrink-0 text-primary" />{bp}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
