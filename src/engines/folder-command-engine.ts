export interface FolderCommandInput {
  repoUrl: string;
  projectPath: string;
  branch: string;
  commitMessage: string;
  localFolderName: string;
  mode: "init" | "push" | "clone" | "pull" | "backup";
  provider: "github" | "gitlab" | "bitbucket" | "azure";
}

export interface CommandStep {
  command: string;
  description: string;
  explanation: string;
}

export interface FolderCommandOutput {
  title: string;
  steps: CommandStep[];
  fullCommand: string;
  warnings: string[];
}

export function generateFolderCommands(input: FolderCommandInput): FolderCommandOutput {
  const { repoUrl, projectPath, branch, commitMessage, localFolderName, mode, provider } = input;
  const steps: CommandStep[] = [];
  const warnings: string[] = [];
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

  // Detect auth type
  const isSSH = repoUrl.startsWith("git@");
  const remoteName = "origin";
  const actualBranch = branch || "main";

  if (!isSSH) {
    warnings.push("Using HTTPS? Generate a personal access token — passwords no longer work.");
  }

  switch (mode) {
    case "init": {
      const folder = projectPath || localFolderName || "my-project";
      steps.push(
        { command: `mkdir ${folder} && cd ${folder}`, description: "Create and enter project directory", explanation: "Creates the folder that will contain your Git repository and moves into it." },
        { command: "git init", description: "Initialize a new Git repository", explanation: "Creates a fresh .git directory — your project is now version-controlled." },
        { command: `git remote add ${remoteName} ${repoUrl}`, description: `Link to ${providerName} remote`, explanation: `Connects your local repo to the ${providerName} remote so you can push/pull later.` }
      );
      if (projectPath) {
        steps.splice(0, 1,
          { command: `cd ${projectPath}`, description: "Navigate to project directory", explanation: "Enters the project folder on your machine." }
        );
      }
      steps.push(
        { command: `git add .`, description: "Stage all files", explanation: "Adds every file in the project to Git's staging area, ready to be committed." },
        { command: `git commit -m "${commitMessage || "Initial commit"}"`, description: "Create initial commit", explanation: "Saves a snapshot of all staged files with a descriptive message." },
        { command: `git branch -M ${actualBranch}`, description: `Rename branch to ${actualBranch}`, explanation: `Renames the default branch to '${actualBranch}' to match modern conventions.` },
        { command: `git push -u ${remoteName} ${actualBranch}`, description: "Push to remote and set upstream", explanation: `Uploads your commits to ${providerName} and sets the upstream tracking so future pushes are simpler.` }
      );
      break;
    }

    case "push": {
      steps.push(
        { command: `cd ${projectPath || "."}`, description: "Navigate to project", explanation: "Moves into your project directory." },
        { command: `git add .`, description: "Stage all changes", explanation: "Stages every changed, added, or deleted file for the next commit." },
        { command: `git commit -m "${commitMessage || "Update"}"`, description: "Commit changes", explanation: `Saves the staged snapshot with message: "${commitMessage || "Update"}"` },
        { command: `git push ${remoteName} ${actualBranch}`, description: `Push to ${providerName} ${actualBranch}`, explanation: `Uploads your new commits to the remote branch '${actualBranch}' on ${providerName}.` }
      );
      warnings.push("Always pull before pushing to avoid non-fast-forward rejections.");
      break;
    }

    case "clone": {
      const folder = localFolderName || "";
      steps.push(
        { command: `git clone ${repoUrl}${folder ? " " + folder : ""}`, description: "Clone repository", explanation: `Downloads the entire repository from ${providerName} to your local machine.${folder ? ` Saves into '${folder}'.` : ""}` },
        { command: `cd ${folder || repoUrl.split("/").pop()?.replace(".git", "") || "repo"}`, description: "Enter project directory", explanation: "Navigates into the cloned repository folder." },
        { command: `git checkout ${actualBranch}`, description: `Switch to ${actualBranch} branch`, explanation: `Checks out the '${actualBranch}' branch so you're working on the right one.` }
      );
      if (!isSSH) {
        steps.push(
          { command: `git remote set-url origin ${repoUrl}`, description: "Verify remote URL", explanation: "Ensures the remote URL is correct for fetching/pushing later." }
        );
      }
      break;
    }

    case "pull": {
      steps.push(
        { command: `cd ${projectPath || "."}`, description: "Navigate to project", explanation: "Enters your local project folder." },
        { command: `git pull ${remoteName} ${actualBranch}`, description: `Pull latest from ${actualBranch}`, explanation: `Fetches the latest commits from ${providerName} and merges them into your local '${actualBranch}'.` }
      );
      if (!isSSH) {
        steps.push(
          { command: `git fetch --prune`, description: "Clean up stale remote refs", explanation: "Removes references to remote branches that no longer exist." }
        );
      }
      warnings.push("If you have uncommitted changes, stash them first: git stash");
      break;
    }

    case "backup": {
      const timestamp = new Date().toISOString().split("T")[0];
      const backupBranch = `backup/${timestamp}`;
      steps.push(
        { command: `cd ${projectPath || "."}`, description: "Navigate to project", explanation: "Enters the project you want to back up." },
        { command: `git checkout -b ${backupBranch}`, description: "Create backup branch", explanation: `Creates a snapshot branch '${backupBranch}' marking the current state.` },
        { command: `git tag backup-${timestamp}`, description: "Tag the backup point", explanation: "Adds a lightweight tag so you can always find this exact state." },
        { command: `git push ${remoteName} ${backupBranch}`, description: "Push backup branch", explanation: `Uploads the backup branch to ${providerName} as an extra safety net.` },
        { command: `git push ${remoteName} backup-${timestamp}`, description: "Push backup tag", explanation: "Also pushes the tag so it appears in the remote's tag list." },
        { command: `git archive --format=zip HEAD > backup-${timestamp}.zip`, description: "Create zip archive", explanation: "Generates a .zip file of the current commit — a portable offline backup." },
        { command: `git bundle create backup-${timestamp}.bundle HEAD ${actualBranch}`, description: "Create Git bundle", explanation: "Creates a single-file portable Git repository you can restore from anywhere." }
      );
      warnings.push("Keep backup files in a safe location outside the repo.");
      warnings.push("For critical repos, also push to a second remote.");
      break;
    }
  }

  const fullCommand = steps.map((s) => s.command).join("\n");

  let title = "";
  switch (mode) {
    case "init": title = `Initialize & Push to ${providerName}`; break;
    case "push": title = `Commit & Push to ${actualBranch}`; break;
    case "clone": title = `Clone from ${providerName}`; break;
    case "pull": title = `Pull Latest from ${actualBranch}`; break;
    case "backup": title = `Backup Repository`; break;
  }

  return { title, steps, fullCommand, warnings };
}

export interface NaturalLanguageResult {
  query: string;
  interpretedGoal: string;
  commands: string[];
  explanation: string;
  context: string;
  alternatives: string[];
}

const nlPatterns: { patterns: RegExp[]; goal: string; commands: string[]; explanation: string; context: string }[] = [
  {
    patterns: [/start|new repo|init|begin|create repo|initialize/i],
    goal: "Initialize a new Git repository",
    commands: ["git init", "git add .", "git commit -m \"Initial commit\"", "git branch -M main", "git remote add origin <url>", "git push -u origin main"],
    explanation: "Start tracking a project with Git. First 'git init' creates the repository, then you stage files, commit, connect a remote, and push.",
    context: "Best for brand-new projects not yet under version control"
  },
  {
    patterns: [/clone|download|copy repo|get repo/i],
    goal: "Clone an existing repository",
    commands: ["git clone <repository-url>", "cd <repo-folder>", "git checkout main"],
    explanation: "Downloads the entire project from a remote server. You get the full commit history, all branches, and can start working immediately.",
    context: "Best for contributing to existing projects or setting up a project on a new machine"
  },
  {
    patterns: [/push|upload|publish|share|deploy/i],
    goal: "Push local commits to remote",
    commands: ["git add .", "git commit -m \"message\"", "git push origin <branch>"],
    explanation: "Uploads your local commits to the remote repository so others can see and pull your changes.",
    context: "Do this after committing locally to share your work or trigger CI/CD"
  },
  {
    patterns: [/pull|update|sync|get latest|fetch/i],
    goal: "Pull latest changes from remote",
    commands: ["git pull origin <branch>", "git fetch --prune"],
    explanation: "Downloads new commits from the remote and merges them into your current branch. Keeps you in sync with your team.",
    context: "Do this before starting work each day to avoid merge conflicts"
  },
  {
    patterns: [/branch|create branch|new feature|feature branch/i],
    goal: "Create and switch to a new branch",
    commands: ["git checkout -b feature/<name>", "git add .", "git commit -m \"feat: description\""],
    explanation: "Creates a separate line of development so you can work on features without affecting the main codebase.",
    context: "Best for working on new features, bug fixes, or experiments in isolation"
  },
  {
    patterns: [/merge|combine|join branches/i],
    goal: "Merge one branch into another",
    commands: ["git checkout main", "git pull origin main", "git merge feature/<name>", "git push origin main"],
    explanation: "Combines the changes from one branch into another, typically merging a feature branch back into main.",
    context: "Best for integrating completed work back into the main branch"
  },
  {
    patterns: [/rebase|clean history|rewrite|squash|interactive/i],
    goal: "Rebase or squash commits",
    commands: ["git rebase -i HEAD~N", "git rebase main", "git push --force-with-lease"],
    explanation: "Rewrites commit history — useful for cleaning up commits before merging or keeping a linear history.",
    context: "Best for local branches before merging. Never rebase shared branches."
  },
  {
    patterns: [/stash|temporary save|save changes|shelve/i],
    goal: "Stash uncommitted changes",
    commands: ["git stash", "git stash pop", "git stash list"],
    explanation: "Temporarily saves your uncommitted changes so you can switch branches, then reapply them later.",
    context: "Best when you need to quickly switch branches but aren't ready to commit"
  },
  {
    patterns: [/undo|revert|rollback|go back|reset|discard/i],
    goal: "Undo or revert changes",
    commands: ["git reset HEAD~1", "git revert HEAD", "git reset --hard HEAD~1", "git restore <file>"],
    explanation: "Removes or undoes commits. Use 'revert' for shared branches and 'reset' for local-only work.",
    context: "Best for fixing mistakes. 'git revert' is safer for public branches."
  },
  {
    patterns: [/tag|release|version|publish version/i],
    goal: "Tag a release version",
    commands: ["git tag -a v1.0.0 -m \"Release v1.0.0\"", "git push origin v1.0.0"],
    explanation: "Marks a specific point in history as a release. Tags are often used with semantic versioning.",
    context: "Best done after merging a release branch into main"
  },
  {
    patterns: [/log|history|show commits|what changed/i],
    goal: "View commit history",
    commands: ["git log --oneline --graph --decorate --all", "git log --author=\"name\"", "git log --grep=\"pattern\""],
    explanation: "Shows the commit history with various filtering options — by author, date range, file, or search pattern.",
    context: "Useful for understanding what changed, when, and by whom"
  },
  {
    patterns: [/diff|changes|what's different|compare/i],
    goal: "View file differences",
    commands: ["git diff", "git diff --staged", "git diff branch1..branch2"],
    explanation: "Shows line-by-line changes between commits, branches, or the working tree and index.",
    context: "Useful for reviewing changes before committing or merging"
  },
  {
    patterns: [/conflict|resolve|merge conflict|conflicted/i],
    goal: "Resolve merge conflicts",
    commands: ["git status", "git diff", "git mergetool", "git add <resolved-file>", "git commit"],
    explanation: "When Git can't auto-merge, you manually choose which changes to keep. After resolving, stage and commit.",
    context: "Happens when two branches modify the same lines. Use a merge tool for complex conflicts."
  },
  {
    patterns: [/delete branch|remove branch|clean up branch/i],
    goal: "Delete a branch",
    commands: ["git branch -d <branch>", "git push origin --delete <branch>"],
    explanation: "Removes a branch locally and/or remotely after its work has been merged.",
    context: "Best practice: delete feature branches after merging to keep the repo clean"
  },
  {
    patterns: [/cherry.?pick|pick commit|select commit|copy commit/i],
    goal: "Cherry-pick a specific commit",
    commands: ["git cherry-pick <commit-hash>"],
    explanation: "Applies a specific commit from one branch onto your current branch without merging the whole branch.",
    context: "Useful for hotfixes or selectively porting changes between branches"
  },
  {
    patterns: [/submodule|nested repo|external dependency|include repo/i],
    goal: "Add or manage submodules",
    commands: ["git submodule add <url> <path>", "git submodule update --init --recursive"],
    explanation: "Embeds one Git repo inside another. Submodules track specific commits of external dependencies.",
    context: "Best for managing third-party libraries or shared components across projects"
  },
  {
    patterns: [/backup|back up|archive|zip|save copy|copy project/i],
    goal: "Backup the entire repository",
    commands: ["git bundle create backup.bundle --all", "git archive --format=zip HEAD > backup.zip", "git push --mirror <backup-url>"],
    explanation: "Creates portable backups of your entire repository — including all branches and tags.",
    context: "Best done regularly for critical repositories or before major refactors"
  },
  {
    patterns: [/ignore|gitignore|untrack|exclude|\.env/i],
    goal: "Set up .gitignore to exclude files",
    commands: ["echo \"node_modules/\" >> .gitignore", "git rm --cached <file>"],
    explanation: "Tells Git to ignore certain files (dependencies, secrets, build outputs) so they're never committed.",
    context: "Essential for keeping secrets out of version control and avoiding bloated repos"
  },
  {
    patterns: [/large file|lfs|big file|binary/i],
    goal: "Track large files with Git LFS",
    commands: ["git lfs track \"*.psd\"", "git add .gitattributes", "git lfs migrate import"],
    explanation: "Git Large File Storage replaces large files with text pointers, storing the actual content on a remote server.",
    context: "Best for binary assets, design files, datasets, or any file over a few MB"
  },
  {
    patterns: [/hook|pre-commit|automate|lint before|pre-push|githook/i],
    goal: "Set up Git hooks for automation",
    commands: ["touch .git/hooks/pre-commit", "chmod +x .git/hooks/pre-commit", "npx husky install"],
    explanation: "Git hooks are scripts that run automatically before or after Git events like commits or pushes.",
    context: "Best for enforcing code quality, running tests, or preventing bad commits"
  },
  {
    patterns: [/bisect|find bug|debug|search commit|broken commit/i],
    goal: "Find the commit that introduced a bug (bisect)",
    commands: ["git bisect start", "git bisect bad", "git bisect good <known-good-commit>", "git bisect reset"],
    explanation: "Binary search through commits to find exactly when a bug was introduced. Git automatically checks out commits for you to test.",
    context: "Invaluable when you know a feature worked before but broke at some point"
  },
  {
    patterns: [/detached|head detached|lost commit|lost changes/i],
    goal: "Recover from detached HEAD or lost commits",
    commands: ["git reflog", "git checkout <hash>", "git branch <name> <hash>", "git cherry-pick <hash>"],
    explanation: "Detached HEAD means you're not on a branch. Use reflog to find and recover any commits you made.",
    context: "First: don't panic. Every action is logged in reflog for ~90 days."
  },
  {
    patterns: [/fork|contribute|open source|pull request|pr|github flow/i],
    goal: "Contribute to an open-source project",
    commands: ["git clone <fork-url>", "git remote add upstream <original-url>", "git fetch upstream", "git checkout -b feat/improvement", "git push -u origin feat/improvement"],
    explanation: "Clone your fork, add the original as 'upstream', create a feature branch, push it, then open a PR on GitHub.",
    context: "The standard GitHub flow for contributing to any open-source project"
  },
  {
    patterns: [/workflow|git flow|trunk|github flow|team/i],
    goal: "Set up a team Git workflow",
    commands: ["git checkout -b feature/<ticket>", "git rebase main", "gh pr create", "git checkout main && git pull"],
    explanation: "A structured Git workflow ensures your team collaborates smoothly without stepping on each other's toes.",
    context: "Choose: GitHub Flow (simple), Git Flow (complex), or Trunk-based (fast)"
  },
];

export function interpretNaturalLanguage(query: string): NaturalLanguageResult | null {
  const lower = query.toLowerCase();

  for (const pattern of nlPatterns) {
    if (pattern.patterns.some((p) => p.test(lower))) {
      return {
        query,
        interpretedGoal: pattern.goal,
        commands: pattern.commands,
        explanation: pattern.explanation,
        context: pattern.context,
        alternatives: [],
      };
    }
  }

  // Fallback with keyword matching
  const keywords = query.split(/\s+/).filter((w) => w.length > 3);
  let bestScore = 0;
  let bestMatch = null;

  for (const pattern of nlPatterns) {
    let score = 0;
    for (const keyword of keywords) {
      if (pattern.explanation.toLowerCase().includes(keyword)) score += 2;
      if (pattern.patterns.some((p) => p.source.toLowerCase().includes(keyword))) score += 3;
      if (pattern.goal.toLowerCase().includes(keyword)) score += 4;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pattern;
    }
  }

  if (bestMatch && bestScore > 0) {
    return {
      query,
      interpretedGoal: bestMatch.goal,
      commands: bestMatch.commands,
      explanation: bestMatch.explanation,
      context: bestMatch.context,
      alternatives: [],
    };
  }

  return null;
}
