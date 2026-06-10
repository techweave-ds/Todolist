"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, ArrowLeft, Copy, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/toaster";
import type { CheatSheet } from "@/types";

export function CheatSheetDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [cs, setCs] = useState<CheatSheet | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    import("@/data/cheatsheets").then((m) => setCs(m.cheatsheets.find((c: CheatSheet) => c.id === params.id) || null));
  }, [params.id]);

  const copyCmd = (cmd: string, i: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(i);
    toast("Copied!", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!cs) {
    return <div className="flex items-center justify-center py-24 text-muted-foreground">
      <div className="text-center"><BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>Not found</p></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.push("/cheat-sheets")}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10"><BookOpen className="h-6 w-6 text-primary" /></div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{cs.category}</Badge>
            <Badge variant="secondary">{cs.level}</Badge>
          </div>
          <h1 className="text-2xl font-bold">{cs.title}</h1>
          <p className="text-muted-foreground mt-1">{cs.description}</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto">{cs.content}</pre>
        </CardContent>
      </Card>
      {cs.commands.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Terminal className="h-4 w-4" /> Commands</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {cs.commands.map((cmd, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted rounded-md px-3 py-2 group cursor-pointer" onClick={() => copyCmd(cmd, i)}>
                <code className="flex-1 text-xs font-mono">{cmd}</code>
                {copiedIndex === i ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
