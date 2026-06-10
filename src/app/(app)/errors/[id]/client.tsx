"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Copy, Check, Terminal, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/toaster";
import type { GitError } from "@/types";

export function ErrorDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [error, setError] = useState<GitError | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allErrors, setAllErrors] = useState<GitError[]>([]);

  useEffect(() => {
    import("@/data/errors").then((m) => {
      const found = m.errors.find((e: GitError) => e.id === params.id);
      setError(found || null);
      setAllErrors(m.errors);
    });
  }, [params.id]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast("Copied!", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!error) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
          <p className="text-muted-foreground">Error not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/errors")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </div>
    );
  }

  const relatedErrors = allErrors.filter((e) => e.category === error.category && e.id !== error.id).slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.push("/errors")}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-destructive/10"><AlertTriangle className="h-6 w-6 text-destructive" /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={error.severity === "critical" || error.severity === "high" ? "destructive" : "secondary"}>{error.severity}</Badge>
            <Badge variant="outline">{error.category}</Badge>
            <span className="text-xs text-muted-foreground">{error.id}</span>
          </div>
          <h1 className="text-xl font-bold leading-tight">{error.title}</h1>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Problem</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error.description}</p>
          {error.symptoms.length > 0 && (
            <div className="mt-4 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Symptoms</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {error.symptoms.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Cause</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{error.rootCause}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Fix</CardTitle></CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            {error.fixSteps.map((step, i) => <li key={i} className="text-muted-foreground">{step}</li>)}
          </ol>
        </CardContent>
      </Card>

      {error.commands.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Terminal className="h-4 w-4" /> Commands</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {error.commands.map((cmd, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted rounded-md px-3 py-2 group">
                <code className="flex-1 text-sm font-mono">{cmd}</code>
                <button onClick={() => copyToClipboard(cmd, i)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedIndex === i ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {error.warnings.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader><CardTitle className="text-base text-amber-400">Warnings</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-amber-300/80">
              {error.warnings.map((w, i) => <li key={i} className="flex items-start gap-2"><span className="mt-1">•</span><span>{w}</span></li>)}
            </ul>
          </CardContent>
        </Card>
      )}

      {relatedErrors.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Related Errors</h2>
            <div className="space-y-2">
              {relatedErrors.map((re) => (
                <a key={re.id} href={`/errors/${re.id}`}>
                  <Card className="hover:border-primary/30 transition-all cursor-pointer">
                    <CardContent className="py-3 flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{re.title}</p>
                        <p className="text-xs text-muted-foreground">{re.category}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
