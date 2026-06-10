"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Terminal, ArrowLeft, Copy, Check, AlertTriangle, BookOpen, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/toaster";
import type { CommandRecipe } from "@/types";

export function CommandDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [cmd, setCmd] = useState<CommandRecipe | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    import("@/data/commands").then((m) => {
      setCmd(m.commands.find((c: CommandRecipe) => c.id === params.id) || null);
    });
  }, [params.id]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast("Copied!", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!cmd) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Terminal className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Command not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/commands")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.push("/commands")}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Commands
      </Button>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20">
          <Terminal className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="border-violet-500/30">{cmd.category}</Badge>
            <span className="text-xs text-muted-foreground">{cmd.id}</span>
          </div>
          <h1 className="text-2xl font-bold">{cmd.title}</h1>
          <p className="text-muted-foreground mt-1">{cmd.description}</p>
        </div>
      </div>

      <Card className="border-violet-500/20">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Terminal className="h-4 w-4 text-cyan-400" /> Commands</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {cmd.commands.map((c, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted/50 border border-violet-500/10 rounded-lg px-4 py-2.5 group hover:bg-muted/80 transition-all cursor-pointer" onClick={() => copyToClipboard(c, i)}>
              <code className="flex-1 text-sm font-mono">{c}</code>
              {copiedIndex === i ? <Check className="h-4 w-4 text-emerald-400 shrink-0" /> : <Copy className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-violet-500/20">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-violet-400" /> Explanation</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{cmd.explanation}</p></CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cmd.risks.length > 0 && (
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader><CardTitle className="text-base text-amber-400 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Risks</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-amber-300/80">
                {cmd.risks.map((r, i) => <li key={i} className="flex items-start gap-2"><AlertTriangle className="h-3 w-3 mt-1 shrink-0" />{r}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}
        {cmd.alternatives.length > 0 && (
          <Card className="border-violet-500/20">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-cyan-400" /> Alternatives</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                {cmd.alternatives.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {cmd.examples.length > 0 && (
        <Card className="border-violet-500/20">
          <CardHeader><CardTitle className="text-base">Examples</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cmd.examples.map((ex, i) => (
                <div key={i} className="bg-muted/50 border border-violet-500/10 rounded-lg px-4 py-2.5">
                  <code className="text-sm font-mono">$ {ex}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
