"use client";

import { useState } from "react";
import { FileText, Copy, Check, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateReadme } from "@/engines/readme-engine";
import { toast } from "@/components/toaster";
import type { ReadmeTemplate } from "@/types";

export default function ReadmeGeneratorPage() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [installation, setInstallation] = useState("");
  const [usage, setUsage] = useState("");
  const [screenshotsText, setScreenshotsText] = useState("");
  const [techStackText, setTechStackText] = useState("");
  const [contributing, setContributing] = useState("");
  const [license, setLicense] = useState("MIT");
  const [template, setTemplate] = useState<ReadmeTemplate>("Open Source");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const templates: ReadmeTemplate[] = ["Open Source", "SaaS", "CLI", "Library", "API", "Mobile App"];

  const handleGenerate = () => {
    if (!projectName.trim()) return;
    const result = generateReadme({
      projectName: projectName.trim(),
      description: description.trim() || "A great project",
      features: featuresText.split("\n").filter(Boolean),
      installation: installation.trim() || "npm install",
      usage: usage.trim() || "npm start",
      screenshots: screenshotsText.split("\n").filter(Boolean),
      techStack: techStackText.split("\n").filter(Boolean),
      contributing: contributing.trim() || "Contributions are welcome!",
      license: license.trim(),
      template,
    });
    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast("Copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
    toast("Downloaded!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10"><FileText className="h-6 w-6 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold">README Generator</h1>
          <p className="text-sm text-muted-foreground">Create professional README files for any project</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Project Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Template</label>
              <div className="flex flex-wrap gap-1.5">
                {templates.map((t) => (
                  <button key={t} onClick={() => setTemplate(t)} className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${template === t ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Project Name *</label>
              <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="My Awesome Project" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[60px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Features (one per line)</label>
              <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="Feature 1&#10;Feature 2" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[60px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Installation</label>
              <Input value={installation} onChange={(e) => setInstallation(e.target.value)} placeholder="npm install my-package" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Usage</label>
              <Input value={usage} onChange={(e) => setUsage(e.target.value)} placeholder="npm start or code example" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tech Stack (one per line)</label>
              <textarea value={techStackText} onChange={(e) => setTechStackText(e.target.value)} placeholder="React&#10;Node.js&#10;TypeScript" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[60px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">License</label>
              <Input value={license} onChange={(e) => setLicense(e.target.value)} placeholder="MIT" />
            </div>
            <Button onClick={handleGenerate} disabled={!projectName.trim()} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" /> Generate README
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Preview</h2>
            {output && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            )}
          </div>
          <Card>
            <CardContent className="p-4">
              {output ? (
                <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-[500px]">{output}</pre>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Fill in the form and generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
