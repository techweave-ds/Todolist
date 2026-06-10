export interface GitError {
  id: string;
  title: string;
  category: ErrorCategory;
  symptoms: string[];
  description: string;
  rootCause: string;
  fixSteps: string[];
  commands: string[];
  warnings: string[];
  relatedErrors: string[];
  severity?: "low" | "medium" | "high" | "critical";
}

export type ErrorCategory =
  | "Push Errors"
  | "Pull Errors"
  | "Merge Errors"
  | "Rebase Errors"
  | "Branch Errors"
  | "Authentication Errors"
  | "SSH Errors"
  | "GitHub Errors"
  | "Actions Errors"
  | "CI/CD Errors"
  | "Repository Errors"
  | "Configuration Errors"
  | "Stash Errors"
  | "Tag Errors"
  | "Detached HEAD Errors"
  | "Submodule Errors"
  | "Index Errors"
  | "Recovery Errors";

export interface CommandRecipe {
  id: string;
  title: string;
  description: string;
  category: CommandCategory;
  goal: string;
  environment?: string[];
  branchType?: string[];
  workflow?: string[];
  commands: string[];
  explanation: string;
  risks: string[];
  alternatives: string[];
  examples: string[];
}

export type CommandCategory =
  | "Setup"
  | "Clone"
  | "Push"
  | "Pull"
  | "Branch"
  | "Merge"
  | "Rebase"
  | "Stash"
  | "Tag"
  | "Reset"
  | "Revert"
  | "Cherry Pick"
  | "Reflog"
  | "Recovery"
  | "Diff"
  | "Log"
  | "Config"
  | "Remote"
  | "Submodule"
  | "Worktree"
  | "Bisect"
  | "Blame"
  | "Archive"
  | "Hook";

export interface CheatSheet {
  id: string;
  title: string;
  description: string;
  category: CheatSheetCategory;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  content: string;
  tags: string[];
  commands: string[];
}

export type CheatSheetCategory =
  | "Git Basics"
  | "Git Branching"
  | "GitHub Actions"
  | "SSH"
  | "Rebase"
  | "Merge"
  | "Conflict Resolution"
  | "Recovery"
  | "Advanced Git"
  | "Git Config"
  | "Git Hooks"
  | "GitHub CLI"
  | "CI/CD"
  | "Git Workflows"
  | "Git Tips";

export interface Article {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: ArticleCategory;
  content: string;
  tags: string[];
  readingTime: number;
  prerequisites?: string[];
  relatedArticles?: string[];
}

export type ArticleCategory =
  | "Git Foundations"
  | "Git Collaboration"
  | "GitHub Mastery"
  | "Release Management"
  | "CI/CD"
  | "Monorepos"
  | "Enterprise Git"
  | "Advanced Techniques"
  | "Best Practices"
  | "Troubleshooting";

export interface Workflow {
  id: string;
  title: string;
  description: string;
  type: WorkflowType;
  branchStrategy: string;
  releaseStrategy: string;
  steps: WorkflowStep[];
  commands: string[];
  tags: string[];
}

export type WorkflowType =
  | "Solo Developer"
  | "Small Team"
  | "Startup"
  | "Enterprise"
  | "Open Source";

export interface WorkflowStep {
  phase: string;
  action: string;
  command?: string;
  description: string;
}

export interface CommitOptions {
  type: CommitType;
  scope: string;
  description: string;
  body?: string;
  breaking?: string;
  issues?: string[];
}

export type CommitType =
  | "feat"
  | "fix"
  | "docs"
  | "style"
  | "refactor"
  | "perf"
  | "test"
  | "chore"
  | "build"
  | "ci"
  | "revert";

export interface CommitOutput {
  conventional: string;
  short: string;
  long: string;
  enterprise: string;
  semverBump: "patch" | "minor" | "major";
  examples: string[];
}

export interface ReadmeOptions {
  projectName: string;
  description: string;
  features: string[];
  installation: string;
  usage: string;
  screenshots: string[];
  techStack: string[];
  contributing: string;
  license: string;
  template: ReadmeTemplate;
}

export type ReadmeTemplate =
  | "Open Source"
  | "SaaS"
  | "CLI"
  | "Library"
  | "API"
  | "Mobile App";

export interface PROptions {
  changes: string;
  summary?: string;
}

export interface PROutput {
  summary: string;
  testingSteps: string[];
  checklist: string[];
  breakingChanges: string;
  reviewNotes: string[];
  markdown: string;
}

export interface ReleaseNotesOptions {
  version?: string;
  commits: string[];
  features: string[];
  fixes: string[];
  breaking?: string[];
  contributors?: string[];
}

export interface ReleaseNotesOutput {
  version: string;
  date: string;
  notes: string;
  githubRelease: string;
  changelog: string;
}

export interface RepoAnalysis {
  name: string;
  description: string;
  url: string;
  languages: Record<string, number>;
  branches: number;
  stars: number;
  forks: number;
  topics: string[];
  issues: number;
  releases: number;
  detectedFramework: string | null;
  overview: string;
  setupGuide: string;
  folderExplanation: string;
  missingFiles: string[];
  healthScore: number;
  documentationScore: number;
  maintainabilityScore: number;
}

export interface TroubleshootQuery {
  problem: string;
}

export interface TroubleshootResult {
  explanation: string;
  recoveryPlan: string[];
  commands: string[];
  warnings: string[];
  bestPractices: string[];
  category: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: "error" | "command" | "cheatsheet" | "article" | "workflow";
  url: string;
  content?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
}
