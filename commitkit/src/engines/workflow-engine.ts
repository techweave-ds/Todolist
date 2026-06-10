import type { Workflow, WorkflowType } from "@/types";

const workflows: Workflow[] = [
  {
    id: "solo",
    title: "Solo Developer Workflow",
    description: "Simple yet effective Git workflow for individual developers",
    type: "Solo Developer",
    branchStrategy: "Trunk-based development with short-lived feature branches",
    releaseStrategy: "Git tags for versioning, direct main branch releases",
    steps: [
      { phase: "Start", action: "Create feature branch from main", command: "git checkout -b feat/my-feature", description: "Branch off main for each new feature" },
      { phase: "Develop", action: "Make small, focused commits", command: "git commit -m \"feat: add new feature\"", description: "Commit early and often with conventional commits" },
      { phase: "Sync", action: "Rebase on latest main", command: "git fetch && git rebase origin/main", description: "Keep your branch up to date" },
      { phase: "Review", action: "Self-review changes", command: "git diff main", description: "Review your changes before merging" },
      { phase: "Merge", action: "Merge to main", command: "git checkout main && git merge feat/my-feature", description: "Merge with a merge commit" },
      { phase: "Release", action: "Tag the release", command: "git tag -a v1.0.0 -m \"Release v1.0.0\"", description: "Create a semantic version tag" },
      { phase: "Push", action: "Push everything", command: "git push origin main --tags", description: "Push branch and tags to remote" },
      { phase: "Cleanup", action: "Delete feature branch", command: "git branch -d feat/my-feature", description: "Clean up local branches" },
    ],
    commands: [
      "git checkout -b feat/feature-name",
      "git add . && git commit -m \"type(scope): message\"",
      "git fetch && git rebase origin/main",
      "git checkout main && git pull",
      "git merge --no-ff feat/feature-name",
      "git tag -a v$(node -p \"require('./package.json').version\") -m \"v$(node -p \"require('./package.json').version\")\"",
      "git push origin main --tags",
      "git branch -d feat/feature-name",
    ],
    tags: ["solo", "simple", "trunk-based", "beginner"],
  },
  {
    id: "small-team",
    title: "Small Team Workflow",
    description: "Collaborative workflow for small teams (2-5 developers)",
    type: "Small Team",
    branchStrategy: "Feature branches with pull request reviews",
    releaseStrategy: "Release branches for staging and production",
    steps: [
      { phase: "Plan", action: "Create issue and assign", command: "", description: "Track work in GitHub Issues" },
      { phase: "Branch", action: "Create feature branch from main", command: "git checkout -b feat/issue-123-feature", description: "Use issue numbers in branch names" },
      { phase: "Develop", action: "Make conventional commits", command: "git commit -m \"feat(scope): description\"", description: "Follow conventional commit format" },
      { phase: "Push", action: "Push branch to remote", command: "git push -u origin feat/issue-123-feature", description: "Share your branch with the team" },
      { phase: "PR", action: "Create Pull Request", command: "", description: "Open PR on GitHub with description" },
      { phase: "Review", action: "Team reviews code", command: "", description: "At least one approval required" },
      { phase: "Merge", action: "Squash and merge to main", command: "", description: "Use squash merge for clean history" },
      { phase: "Deploy", action: "Deploy to staging", command: "", description: "Auto-deploy main to staging" },
    ],
    commands: [
      "git checkout -b feat/issue-123-description",
      "git commit -m \"feat(payments): add stripe integration\"",
      "git push -u origin feat/issue-123-description",
      "gh pr create --title \"feat: add stripe\" --body \"Closes #123\"",
      "git checkout main && git pull",
      "git branch -d feat/issue-123-description",
    ],
    tags: ["team", "collaborative", "pr-review", "github-flow"],
  },
  {
    id: "enterprise",
    title: "Enterprise Git Workflow",
    description: "Comprehensive workflow for enterprise teams with strict release management",
    type: "Enterprise",
    branchStrategy: "Git Flow with develop, release, and hotfix branches",
    releaseStrategy: "Scheduled releases with release branches and semantic versioning",
    steps: [
      { phase: "Develop", action: "Feature branches from develop", command: "git checkout -b feature/feat-name develop", description: "Branch from develop for features" },
      { phase: "PR to Develop", action: "Merge feature to develop", command: "", description: "PR must pass CI and get approvals" },
      { phase: "Release Prep", action: "Create release branch", command: "git checkout -b release/1.2.0 develop", description: "Branch from develop for release" },
      { phase: "Stabilize", action: "Fix bugs on release branch", command: "", description: "Only bug fixes on release branch" },
      { phase: "Release", action: "Merge to main and tag", command: "git checkout main && git merge release/1.2.0 && git tag -a v1.2.0 -m \"v1.2.0\"", description: "Merge to main and tag" },
      { phase: "Back Merge", action: "Merge back to develop", command: "git checkout develop && git merge main", description: "Keep develop in sync with main" },
      { phase: "Hotfix", action: "Emergency fix from main", command: "git checkout -b hotfix/1.2.1 main", description: "Branch from main for hotfixes" },
    ],
    commands: [
      "git checkout -b feature/feat-name develop",
      "git checkout -b release/1.2.0 develop",
      "git checkout main && git merge --no-ff release/1.2.0",
      "git tag -a v1.2.0 -m \"Release version 1.2.0\"",
      "git checkout develop && git merge main",
      "git checkout -b hotfix/urgent-fix main",
      "git push origin --all && git push origin --tags",
    ],
    tags: ["enterprise", "git-flow", "release-management", "hotfix"],
  },
  {
    id: "open-source",
    title: "Open Source Workflow",
    description: "Fork-based workflow for open source contributions",
    type: "Open Source",
    branchStrategy: "Fork the repository, work on feature branches, submit PRs",
    releaseStrategy: "Maintainer-managed releases with semantic versioning",
    steps: [
      { phase: "Fork", action: "Fork the repository on GitHub", command: "", description: "Create a fork under your account" },
      { phase: "Clone", action: "Clone your fork locally", command: "git clone https://github.com/your-username/repo.git && cd repo", description: "Clone your fork" },
      { phase: "Remote", action: "Add upstream remote", command: "git remote add upstream https://github.com/original/repo.git", description: "Track original repository" },
      { phase: "Branch", action: "Create feature branch", command: "git checkout -b feat/improvement", description: "Branch from main for your changes" },
      { phase: "Sync", action: "Keep fork updated", command: "git fetch upstream && git rebase upstream/main", description: "Stay up to date with upstream" },
      { phase: "Push", action: "Push to your fork", command: "git push -u origin feat/improvement", description: "Share your changes" },
      { phase: "PR", action: "Submit Pull Request", command: "", description: "Open PR from your fork to upstream" },
      { phase: "Address Feedback", action: "Make requested changes", command: "", description: "Update your branch based on review" },
    ],
    commands: [
      "git clone https://github.com/your-username/repo.git",
      "cd repo",
      "git remote add upstream https://github.com/original/repo.git",
      "git checkout -b feat/contribution",
      "git fetch upstream && git rebase upstream/main",
      "git push -u origin feat/contribution",
      "gh pr create --repo original/repo",
    ],
    tags: ["open-source", "fork", "contributing", "community"],
  },
  {
    id: "startup",
    title: "Startup Workflow",
    description: "Fast-paced workflow for startups that balances speed and quality",
    type: "Startup",
    branchStrategy: "Short-lived feature branches with continuous deployment",
    releaseStrategy: "Continuous deployment to production with feature flags",
    steps: [
      { phase: "Ideate", action: "Create experiment branch", command: "git checkout -b experiment/feature-idea", description: "Quickly prototype ideas" },
      { phase: "Build", action: "MVP implementation", command: "git commit -m \"feat: implement MVP\"", description: "Focus on core functionality" },
      { phase: "Ship", action: "Deploy to production", command: "", description: "Auto-deploy to production" },
      { phase: "Measure", action: "Analyze impact", command: "", description: "Check metrics and user feedback" },
      { phase: "Iterate", action: "Improve based on feedback", command: "", description: "Quick iteration cycles" },
    ],
    commands: [
      "git checkout -b experiment/new-feature",
      "git add . && git commit -m \"feat: implement new feature\"",
      "git push origin experiment/new-feature",
      "gh pr create --base main",
      "git checkout main && git pull",
    ],
    tags: ["startup", "fast", "continuous-deployment", "experimental"],
  },
];

export function getWorkflows(): Workflow[] {
  return workflows;
}

export function getWorkflowByType(type: WorkflowType): Workflow | undefined {
  return workflows.find((w) => w.type === type);
}

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}
