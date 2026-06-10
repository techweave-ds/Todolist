"use client";

import { useState } from "react";
import { GitBranch, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getWorkflows } from "@/engines/workflow-engine";
import { toast } from "@/components/toaster";
import type { WorkflowType } from "@/types";

const types: WorkflowType[] = ["Solo Developer", "Small Team", "Startup", "Enterprise", "Open Source"];

export default function WorkflowBuilderPage() {
  const [selectedType, setSelectedType] = useState<WorkflowType>("Solo Developer");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const workflows = getWorkflows();
  const workflow = workflows.find((w) => w.type === selectedType);

  const copyCmd = (cmd: string, i: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(i);
    toast("Copied!", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10"><GitBranch className="h-6 w-6 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold">Workflow Builder</h1>
          <p className="text-sm text-muted-foreground">Generate Git workflows for any team size</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button key={t} onClick={() => setSelectedType(t)} className={`px-4 py-2 text-sm rounded-md border transition-colors ${selectedType === t ? "bg-primary/10 border-primary/30 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/30"}`}>{t}</button>
        ))}
      </div>

      {workflow && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{workflow.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-md bg-muted">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Branch Strategy</p>
                  <p className="text-sm mt-1">{workflow.branchStrategy}</p>
                </div>
                <div className="p-3 rounded-md bg-muted">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Release Strategy</p>
                  <p className="text-sm mt-1">{workflow.releaseStrategy}</p>
                </div>
              </div>

              <h3 className="text-sm font-medium mb-3">Workflow Steps</h3>
              <div className="space-y-2">
                {workflow.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{step.phase}</p>
                        <Badge variant="outline" className="text-[10px]">{step.action}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                      {step.command && (
                        <div className="mt-1 flex items-center gap-2 bg-muted rounded px-2 py-1 group cursor-pointer" onClick={() => copyCmd(step.command!, i)}>
                          <code className="text-xs font-mono flex-1">{step.command}</code>
                          {copiedIndex === i ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Key Commands</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {workflow.commands.map((cmd, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted rounded-md px-3 py-2 group cursor-pointer" onClick={() => copyCmd(cmd, i + 100)}>
                  <code className="flex-1 text-xs font-mono">{cmd}</code>
                  {copiedIndex === i + 100 ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
