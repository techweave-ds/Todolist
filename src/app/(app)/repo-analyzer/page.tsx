"use client";

import { useState } from "react";
import { Search, Globe, ExternalLink, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { analyzeRepo } from "@/engines/repo-engine";
import type { RepoAnalysis } from "@/types";

export default function RepoAnalyzerPage() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        setError("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)");
        return;
      }

      const [_, owner, repoName] = match;
      const cleanRepo = repoName.replace(/\.git$/, "");

      const [repoRes, langsRes, topicsRes, readmeRes] = await Promise.allSettled([
        fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`),
        fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/languages`),
        fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/topics`, { headers: { Accept: "application/vnd.github.mercy-preview+json" } }),
        fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/readme`),
      ]);

      const repoData = repoRes.status === "fulfilled" ? await repoRes.value.json() : {};
      const langsData = langsRes.status === "fulfilled" ? await langsRes.value.json() : {};
      const topicsData = topicsRes.status === "fulfilled" ? await topicsRes.value.json() : { names: [] };
      const readmeData = readmeRes.status === "fulfilled" ? await readmeRes.value.json() : {};
      const readmeContent = readmeData.content ? atob(readmeData.content.replace(/\n/g, "")) : "";

      const result = analyzeRepo({
        name: repoData.name || cleanRepo,
        description: repoData.description || "No description",
        url: repoData.html_url || url,
        languages: langsData || {},
        branches: repoData.default_branch ? 1 : 0,
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        topics: topicsData.names || [],
        issues: repoData.open_issues_count || 0,
        releases: repoData.releases_count || 0,
        readme: readmeContent,
      });

      setAnalysis(result);
    } catch {
      setError("Failed to fetch repository data. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10"><Search className="h-6 w-6 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold">Repository Analyzer</h1>
          <p className="text-sm text-muted-foreground">Analyze any public GitHub repository</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/owner/repo" className="flex-1" />
            <Button onClick={handleAnalyze} disabled={loading}>
              <Search className="h-4 w-4 mr-2" /> {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Stars", value: analysis.stars },
              { label: "Forks", value: analysis.forks },
              { label: "Issues", value: analysis.issues },
              { label: "Topics", value: analysis.topics.length },
            ].map((s) => (
              <Card key={s.label} className="text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">              <Globe className="h-4 w-4 inline mr-2" />Repository Overview</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{analysis.overview}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.topics.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
              {analysis.detectedFramework && (
                <div className="mt-3">
                  <Badge>Detected Framework: {analysis.detectedFramework}</Badge>
                </div>
              )}
              {Object.keys(analysis.languages).length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(analysis.languages).map(([lang, _]) => (
                      <Badge key={lang} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Health Score", score: analysis.healthScore, icon: CheckCircle },
              { label: "Documentation", score: analysis.documentationScore, icon: Info },
              { label: "Maintainability", score: analysis.maintainabilityScore, icon: AlertTriangle },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="pt-6 text-center">
                  <item.icon className={`h-6 w-6 mx-auto mb-2 ${getScoreColor(item.score)}`} />
                  <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>{item.score}/100</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Setup Guide</CardTitle></CardHeader>
            <CardContent>
              <pre className="text-xs font-mono whitespace-pre-wrap bg-muted p-3 rounded-md">{analysis.setupGuide}</pre>
            </CardContent>
          </Card>

          {analysis.missingFiles.length > 0 && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader><CardTitle className="text-base text-amber-400">Missing Files</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {analysis.missingFiles.map((f) => (
                    <li key={f} className="text-sm text-amber-300/80 flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">Folder Structure Explanation</CardTitle></CardHeader>
            <CardContent>
              <pre className="text-xs font-mono whitespace-pre-wrap">{analysis.folderExplanation}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
