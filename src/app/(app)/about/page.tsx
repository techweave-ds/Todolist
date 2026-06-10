import { Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  "1,000+ Git and GitHub errors with detailed solutions",
  "500+ command recipes for every Git operation",
  "150+ cheat sheets for quick reference",
  "200+ learning articles from beginner to expert",
  "Commit message generator (Conventional Commits)",
  "README generator with multiple templates",
  "Pull Request description generator",
  "Release notes and changelog generator",
  "GitHub repository analyzer",
  "Git workflow builder for any team size",
  "Natural-language Git troubleshooter",
  "Universal search across all content types",
];

const techStack = [
  "Next.js 16 (App Router)",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui components",
  "Framer Motion",
  "Fuse.js (search)",
  "Lucide Icons",
  "Cloudflare Pages",
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Terminal className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">About CommitKit</h1>
          <p className="text-sm text-muted-foreground">The single destination for Git and GitHub help</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            CommitKit is a free, open-source developer platform that combines the strengths of
            GitFluence, GitCommand, GitHub Docs, Atlassian Git Tutorials, and Git cheat sheets
            into one fast, searchable platform.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Built with a "Free Forever" architecture, CommitKit runs entirely on Cloudflare Pages
            with zero recurring hosting costs, zero paid APIs, zero database costs, and near-zero
            maintenance. Everything functions using static assets and client-side logic.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {techStack.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            CommitKit is built with ❤️ for the developer community.
            <br />
            <span className="text-xs">Search Errors. Generate Commands. Master Git.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
