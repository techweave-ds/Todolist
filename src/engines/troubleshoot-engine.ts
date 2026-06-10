import type { TroubleshootQuery, TroubleshootResult } from "@/types";

interface Rule {
  patterns: string[];
  category: string;
  explanation: string;
  recoveryPlan: string[];
  commands: string[];
  warnings: string[];
  bestPractices: string[];
}

const rules: Rule[] = [
  {
    patterns: ["committed .env", "committed secret", "committed password", "committed key", "accidentally committed"],
    category: "Recovery",
    explanation: "You've committed sensitive information to Git. This is a security issue — even if you remove the file, it remains in the history.",
    recoveryPlan: [
      "Immediately revoke the exposed secrets (API keys, passwords, etc.)",
      "Remove the file from the current commit with git rm --cached",
      "Rewrite history to purge the file from all commits",
      "Force push the cleaned history",
      "Notify your team to rebase any branches",
    ],
    commands: [
      'git rm --cached .env',
      'echo ".env" >> .gitignore',
      'git add .gitignore',
      'git commit -m "chore: remove .env from tracking"',
      'git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all',
      'git push origin --force --all',
    ],
    warnings: [
      "Force pushing rewrites history — anyone with a clone will need to rebase",
      "The old commits still exist in any forks or local clones",
      "Consider the file compromised regardless of removal",
    ],
    bestPractices: [
      "Use .gitignore before adding files",
      "Use environment variables in CI/CD systems",
      "Consider using git-secrets to prevent future commits of secrets",
      "Use pre-commit hooks to scan for sensitive data",
    ],
  },
  {
    patterns: ["merge conflict", "conflict", "merge failed", "can't merge"],
    category: "Merge",
    explanation: "Git cannot automatically merge because both branches have modified the same part of a file.",
    recoveryPlan: [
      "Identify conflicting files with git status",
      "Open each conflicted file and look for conflict markers (<<<<<<<, =======, >>>>>>>)",
      "Choose which version to keep, or manually combine changes",
      "Remove the conflict markers",
      "Stage the resolved files and complete the merge",
    ],
    commands: [
      "git status",
      "git diff",
      "git merge --abort",
      "git add <file>",
      "git commit -m \"merge: resolve conflicts\"",
    ],
    warnings: [
      "Don't commit files with conflict markers still present",
      "Merge --abort will undo the entire merge",
      "Use a merge tool for complex conflicts",
    ],
    bestPractices: [
      "Pull and merge main into your branch frequently to reduce conflict size",
      "Communicate with your team about shared file changes",
      "Use smaller, more focused commits",
    ],
  },
  {
    patterns: ["detached HEAD", "detached head", "HEAD detached at"],
    category: "Detached HEAD Errors",
    explanation: "You're in a detached HEAD state, meaning you're not on any branch. Any commits here will be lost unless you create a branch.",
    recoveryPlan: [
      "Create a branch from the current commit to save your work",
      "Switch back to your working branch",
      "Cherry-pick any commits you made in detached mode",
    ],
    commands: [
      "git branch temp-branch",
      "git checkout main",
      "git merge temp-branch",
      "git branch -d temp-branch",
    ],
    warnings: [
      "Commits made in detached HEAD can be garbage collected",
      "Always create a branch if you want to keep changes",
      "Use git reflog to find lost commits",
    ],
    bestPractices: [
      "Avoid making commits in detached HEAD state",
      "Use git switch or git checkout with a branch name",
      "Use git stash if you need to temporarily explore",
    ],
  },
  {
    patterns: ["can't push", "push rejected", "push failed", "non-fast-forward", "rejected"],
    category: "Push Errors",
    explanation: "Your push was rejected because the remote has commits you don't have locally.",
    recoveryPlan: [
      "Pull the latest changes from the remote",
      "Resolve any conflicts",
      "Try pushing again",
    ],
    commands: [
      "git pull origin main",
      "git pull --rebase origin main",
      "git push origin main",
    ],
    warnings: [
      "Don't force push unless you're sure",
      "Force push rewrites remote history",
      "Communicate with your team before force pushing",
    ],
    bestPractices: [
      "Always pull before pushing",
      "Use rebase for a cleaner history",
      "Protect important branches in GitHub settings",
    ],
  },
  {
    patterns: ["wrong branch", "committed to main", "committed to master", "wrong branch commit"],
    category: "Branch Errors",
    explanation: "You committed to the wrong branch and need to move your changes.",
    recoveryPlan: [
      "Copy the commit hash from the wrong branch",
      "Switch to the correct branch",
      "Cherry-pick the commit to the correct branch",
      "Reset the wrong branch",
    ],
    commands: [
      "git log --oneline -1",
      "git checkout correct-branch",
      "git cherry-pick <commit-hash>",
      "git checkout wrong-branch",
      "git reset --hard HEAD~1",
    ],
    warnings: [
      "Hard reset discards changes permanently",
      "Make sure you've cherry-picked before resetting",
      "Use git stash if you have uncommitted changes",
    ],
    bestPractices: [
      "Check your current branch before committing",
      "Use branch naming conventions to avoid confusion",
      "Consider using git hooks to prevent commits to protected branches",
    ],
  },
  {
    patterns: ["undo commit", "revert commit", "remove commit", "undo last commit"],
    category: "Recovery",
    explanation: "You need to undo a recent commit. Git provides several options depending on whether you want to keep the changes or not.",
    recoveryPlan: [
      "Decide if you want to keep the changes (soft reset) or discard them (hard reset)",
      "Use the appropriate reset command",
      "Force push if the commit was already pushed",
    ],
    commands: [
      "git reset --soft HEAD~1",
      "git reset --hard HEAD~1",
      "git revert HEAD",
      "git push origin branch --force",
    ],
    warnings: [
      "Hard reset permanently deletes changes",
      "Revert is safer for shared branches",
      "Force push after resetting rewrites history",
    ],
    bestPractices: [
      "Use revert for public/shared branches",
      "Use reset for local/unpushed commits",
      "Always double-check the commit hash",
    ],
  },
  {
    patterns: ["lost changes", "where did my changes go", "disappeared", "stash lost", "lost commit"],
    category: "Recovery",
    explanation: "Your changes seem to have disappeared. Git's reflog tracks all movements of HEAD and can help recover lost work.",
    recoveryPlan: [
      "Check git reflog to find where your changes went",
      "Use checkout or cherry-pick to recover them",
      "Create a branch if needed to preserve the recovered work",
    ],
    commands: [
      "git reflog",
      "git checkout <commit-hash>",
      "git cherry-pick <commit-hash>",
      "git branch recovered <commit-hash>",
    ],
    warnings: [
      "Git eventually garbage collects unreferenced commits",
      "Act quickly to recover lost changes",
      "Reflog only works for local operations",
    ],
    bestPractices: [
      "Commit frequently to minimize loss",
      "Push important branches to remote",
      "Use git stash list to track stashes",
    ],
  },
  {
    patterns: ["auth failed", "authentication", "permission denied", "access denied", "403", "401"],
    category: "Authentication Errors",
    explanation: "Your Git authentication failed. This usually happens due to incorrect credentials, expired tokens, or SSH key issues.",
    recoveryPlan: [
      "Check your remote URL (HTTPS vs SSH)",
      "Verify your credentials are current",
      "Test your SSH connection",
    ],
    commands: [
      "git remote -v",
      "ssh -T git@github.com",
      "git config --global credential.helper cache",
      'git config --global user.email "you@example.com"',
    ],
    warnings: [
      "GitHub no longer supports password authentication for Git operations",
      "Use a personal access token or SSH key instead",
      "Tokens have expiration dates — set reminders",
    ],
    bestPractices: [
      "Use SSH keys for authentication",
      "Use a credential manager",
      "Set up GPG signing for commit verification",
    ],
  },
  {
    patterns: ["rebase conflict", "rebase stopped", "rebase failed", "interactive rebase"],
    category: "Rebase Errors",
    explanation: "A rebase operation stopped because of conflicts. You need to resolve them to continue the rebase.",
    recoveryPlan: [
      "Look at which commit the rebase is stopped on",
      "Resolve conflicts in the affected files",
      "Stage the resolved files and continue the rebase",
    ],
    commands: [
      "git status",
      "git rebase --continue",
      "git rebase --skip",
      "git rebase --abort",
      "git mergetool",
    ],
    warnings: [
      "Rebase rewrites commit history",
      "Don't rebase shared/published branches",
      "Use --abort to cancel the rebase entirely",
    ],
    bestPractices: [
      "Use rebase for local cleanup before pushing",
      "Always use merge for shared branches",
      "Keep rebase interactive sessions focused",
    ],
  },
  {
    patterns: ["cherry-pick failed", "cherry pick conflict", "cannot cherry-pick"],
    category: "Cherry Pick",
    explanation: "The cherry-pick operation encountered conflicts that need manual resolution.",
    recoveryPlan: [
      "Identify the conflicted files",
      "Resolve the conflicts manually",
      "Stage the changes and continue the cherry-pick",
    ],
    commands: [
      "git status",
      "git cherry-pick --continue",
      "git cherry-pick --abort",
      "git cherry-pick --skip",
    ],
    warnings: [
      "Cherry-picked commits have different hashes",
      "Resolving conflicts during cherry-pick is common",
      "Order matters when cherry-picking multiple commits",
    ],
    bestPractices: [
      "Cherry-pick in chronological order",
      "Use cherry-pick for selective porting of changes",
      "Consider using rebase --onto for multiple commits",
    ],
  },
];

export function troubleshoot(query: TroubleshootQuery): TroubleshootResult | null {
  const lowerQuery = query.problem.toLowerCase();

  for (const rule of rules) {
    if (rule.patterns.some((p) => lowerQuery.includes(p))) {
      return {
        explanation: rule.explanation,
        recoveryPlan: rule.recoveryPlan,
        commands: rule.commands,
        warnings: rule.warnings,
        bestPractices: rule.bestPractices,
        category: rule.category,
      };
    }
  }

  return null;
}

export function getAllTroubleshootCategories(): string[] {
  return [...new Set(rules.map((r) => r.category))];
}
