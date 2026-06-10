const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "..", "src", "data");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const severityLevels = ["low", "medium", "high", "critical"];

const errorCategories = [
  "Push Errors", "Pull Errors", "Merge Errors", "Rebase Errors",
  "Branch Errors", "Authentication Errors", "SSH Errors", "GitHub Errors",
  "Actions Errors", "CI/CD Errors", "Repository Errors", "Configuration Errors",
  "Stash Errors", "Tag Errors", "Detached HEAD Errors", "Submodule Errors",
  "Index Errors", "Recovery Errors"
];

const errorPrefixes = [
  "fatal:", "error:", "warning:", "CONFLICT:", "The process",
  "Cannot", "Error:", "CI pipeline", "fatal: unable to access",
  "fatal: Authentication failed", "fatal: Could not read from remote",
  "error: failed to push", "fatal: refusing to merge",
  "fatal: not a git repository"
];

function generateErrors(count = 1000) {
  const errors = [];
  const usedTitles = new Set();

  const templates = [
    { cat: "Push Errors", pat: ["push", "push to", "pushing"] },
    { cat: "Pull Errors", pat: ["pull", "pull from", "fetch"] },
    { cat: "Merge Errors", pat: ["merge", "CONFLICT"] },
    { cat: "Rebase Errors", pat: ["rebase"] },
    { cat: "Branch Errors", pat: ["branch", "checkout", "switch"] },
    { cat: "Authentication Errors", pat: ["auth", "Authentication", "permission", "403", "401"] },
    { cat: "SSH Errors", pat: ["SSH", "ssh", "publickey", "host key"] },
    { cat: "GitHub Errors", pat: ["GitHub", "HTTP", "API", "webhook"] },
    { cat: "Actions Errors", pat: ["Actions", "runner", "workflow", "artifact"] },
    { cat: "CI/CD Errors", pat: ["CI", "CD", "deployment", "build", "pipeline"] },
    { cat: "Repository Errors", pat: ["fatal:", "error:", "could not", "cannot", "object", "index", "pack", "corrupt"] },
    { cat: "Configuration Errors", pat: ["config", "user.name", "user.email"] },
    { cat: "Stash Errors", pat: ["stash"] },
    { cat: "Tag Errors", pat: ["tag"] },
    { cat: "Detached HEAD Errors", pat: ["detached HEAD", "HEAD detached"] },
    { cat: "Submodule Errors", pat: ["submodule"] },
    { cat: "Index Errors", pat: ["index", "cache", "unstage"] },
    { cat: "Recovery Errors", pat: ["reset", "revert", "reflog", "recover"] },
  ];

  // Generate variants
  for (let i = 0; i < count; i++) {
    const tpl = templates[i % templates.length];
    const cat = tpl.cat;
    const prefix = errorPrefixes[Math.floor(Math.random() * errorPrefixes.length)];
    const nouns = ["repository", "branch", "commit", "origin", "HEAD", "index", "file", "remote", "working tree", "reference", "object", "tree", "blob", "tag", "config", "pack", "ref", "stash", "submodule", "worktree"];
    const verbs = ["failed", "not found", "already exists", "not specified", "corrupted", "invalid", "not supported", "rejected", "denied", "aborted", "missing", "unreachable", "locked", "not a valid", "could not be read", "could not be written", "mismatch", "out of date", "conflict"];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];

    let title;
    if (i < 10) {
      const knownTitles = [
        "fatal: unable to access 'https://github.com/...': Could not resolve host: github.com",
        "fatal: Authentication failed for 'https://github.com/...'",
        "error: failed to push some refs to 'origin'",
        "CONFLICT (content): Merge conflict in file.txt",
        "fatal: not a git repository (or any of the parent directories): .git",
        "fatal: refusing to merge unrelated histories",
        "error: Your local changes would be overwritten by merge",
        "fatal: cannot rebase: You have unstaged changes",
        "error: pathspec 'branch-name' did not match any file(s) known to git",
        "fatal: The current branch main has no upstream branch",
      ];
      title = knownTitles[i];
    } else if (i < 20) {
      const knownTitles2 = [
        "fatal: remote origin already exists",
        "error: failed to push - pre-receive hook declined",
        "fatal: unable to auto-detect email address",
        "error: Please commit your changes or stash them before you merge",
        "fatal: unable to read tree object",
        "error: failed to push some refs - non-fast-forward",
        "fatal: A branch named 'feature' already exists",
        "error: Cannot delete the branch 'main' which you are currently on",
        "fatal: destination path 'project' already exists",
        "fatal: could not read Username for 'https://github.com'",
      ];
      title = knownTitles2[i - 10];
    } else if (i < 30) {
      const knownTitles3 = [
        "error: failed to push due to pack-objects failure",
        "fatal: can't push to a shallow repository",
        "error: GH006: Protected branch update failed for refs/heads/main",
        "fatal: The remote end hung up unexpectedly",
        "error: failed to push - not up to date",
        "fatal: protocol error: bad line length character",
        "error: RPC failed; HTTP 413 curl 22 The requested URL returned error: 413",
        "fatal: these refs are not updated",
        "error: failed to push - missing necessary commits",
        "fatal: cannot push to a packed ref",
      ];
      title = knownTitles3[i - 20];
    } else {
      title = `${prefix} ${noun} ${verb}: unexpected condition in ${cat.toLowerCase().replace(" errors", "").replace(" ", "-")} operation #${i}`;
      if (usedTitles.has(title)) {
        title = `${prefix} ${noun} ${verb} during ${cat.toLowerCase().replace(" errors", "")} ${i}`;
      }
    }
    usedTitles.add(title);

    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    const error = {
      id: `ERR-${String(i + 1).padStart(4, "0")}`,
      title: title.substring(0, 120),
      category: cat,
      symptoms: [
        `User sees the error: "${title.substring(0, 60)}..."`,
        `Git exits with a non-zero status code`,
        `The ${cat.toLowerCase().replace(" errors", "")} operation fails to complete`
      ],
      description: `Git reported an error during a ${cat.toLowerCase()} operation. The error message indicates that ${noun} ${verb}. This typically requires intervention to resolve before the ${cat.toLowerCase().replace(" errors", "")} operation can succeed.`,
      rootCause: `This error occurs when Git encounters an issue with ${noun} during a ${cat.toLowerCase().replace(" errors", "")} operation. Common causes include network connectivity problems, permission restrictions, repository state inconsistencies, or conflicts between local and remote changes.`,
      fixSteps: [
        `Run "git status" to check the current repository state`,
        `Verify that the ${noun} is in the expected state`,
        `Check network connectivity and credentials if the error involves a remote`,
        `Resolve any pending conflicts or incomplete operations (merge, rebase, cherry-pick)`,
        `If needed, use "git fetch" to sync with remote before retrying`
      ],
      commands: ["git status", "git log --oneline -5", "git fetch --all"],
      warnings: [
        "Avoid using force push unless absolutely necessary",
        "Always communicate with your team before rewriting shared history",
        "Backup your work before performing destructive operations"
      ],
      relatedErrors: [],
      severity
    };

    // Add fix steps based on category
    if (cat === "Push Errors") {
      error.commands = ["git status", "git pull --rebase origin main", "git push origin main"];
      error.fixSteps = [
        "Pull the latest changes from the remote: git pull origin main",
        "Resolve any merge conflicts that arise",
        "Try pushing again: git push origin main",
        "If your branch needs a force push, use: git push --force-with-lease"
      ];
    } else if (cat === "Merge Errors") {
      error.commands = ["git status", "git merge --abort", "git mergetool"];
      error.fixSteps = [
        "Identify conflicted files: git status",
        "Open each conflicted file and resolve conflicts manually",
        "Stage resolved files: git add <file>",
        "Complete the merge: git commit"
      ];
    } else if (cat === "Authentication Errors") {
      error.commands = ["git config --global user.name \"Your Name\"", "git config --global user.email \"email@example.com\"", "ssh -T git@github.com"];
      error.fixSteps = [
        "Update your credentials in the credential manager",
        "For HTTPS, use a personal access token instead of a password",
        "For SSH, verify your SSH key is added to ssh-agent and GitHub"
      ];
    }

    errors.push(error);
  }

  return errors;
}

function generateCommands(count = 500) {
  const categories = [
    "Setup", "Clone", "Push", "Pull", "Branch", "Merge", "Rebase",
    "Stash", "Tag", "Reset", "Revert", "Cherry Pick", "Reflog",
    "Recovery", "Diff", "Log", "Config", "Remote", "Submodule",
    "Worktree", "Bisect", "Blame", "Archive", "Hook"
  ];

  const commands = [];

  const knownCommands = [
    { t: "Initialize a repository", c: "Setup", g: "Create a new Git repository", cmd: ["git init"], ex: "Creates a new .git directory" },
    { t: "Clone a repository", c: "Clone", g: "Make a local copy of a remote repo", cmd: ["git clone <repository-url>"], ex: "Downloads the entire repository" },
    { t: "Clone with specific branch", c: "Clone", g: "Clone only a specific branch", cmd: ["git clone --branch <branch> <url>"], ex: "Only the specified branch is fetched" },
    { t: "Shallow clone", c: "Clone", g: "Clone with limited history", cmd: ["git clone --depth 1 <url>"], ex: "Only the latest commit is fetched" },
    { t: "Check status", c: "Setup", g: "View working tree status", cmd: ["git status", "git status -s"], ex: "Shows modified, staged, and untracked files" },
    { t: "Add all changes", c: "Setup", g: "Stage all changes", cmd: ["git add -A", "git add ."], ex: "Stages all modified and new files" },
    { t: "Stage specific file", c: "Setup", g: "Stage a single file", cmd: ["git add <file>"], ex: "Only stages the specified file" },
    { t: "Unstage a file", c: "Setup", g: "Remove file from staging", cmd: ["git restore --staged <file>", "git reset HEAD <file>"], ex: "Keeps changes but unstages" },
    { t: "Create a commit", c: "Setup", g: "Commit staged changes", cmd: ["git commit -m \"message\""], ex: "Creates a new commit" },
    { t: "Amend last commit", c: "Setup", g: "Modify the last commit", cmd: ["git commit --amend -m \"new message\""], ex: "Replaces the last commit" },
    { t: "Push to remote", c: "Push", g: "Push commits to remote", cmd: ["git push origin <branch>"], ex: "Uploads commits to remote" },
    { t: "Force push with lease", c: "Push", g: "Safe force push", cmd: ["git push --force-with-lease origin <branch>"], ex: "Only force pushes if remote hasn't changed" },
    { t: "Pull from remote", c: "Pull", g: "Pull latest changes", cmd: ["git pull origin <branch>"], ex: "Fetches and merges remote changes" },
    { t: "Pull with rebase", c: "Pull", g: "Pull and rebase", cmd: ["git pull --rebase origin <branch>"], ex: "Rebases instead of merging" },
    { t: "Create a branch", c: "Branch", g: "Create new branch", cmd: ["git branch <branch-name>"], ex: "Creates at current HEAD" },
    { t: "Switch branches", c: "Branch", g: "Checkout a branch", cmd: ["git switch <branch>", "git checkout <branch>"], ex: "Switches to the specified branch" },
    { t: "Create and switch", c: "Branch", g: "Create and checkout branch", cmd: ["git switch -c <branch>", "git checkout -b <branch>"], ex: "Creates and switches to new branch" },
    { t: "Rename branch", c: "Branch", g: "Rename current branch", cmd: ["git branch -m <new-name>"], ex: "Renames current branch" },
    { t: "Delete a branch", c: "Branch", g: "Delete a local branch", cmd: ["git branch -d <branch>"], ex: "Deletes if already merged" },
    { t: "Force delete branch", c: "Branch", g: "Delete branch regardless", cmd: ["git branch -D <branch>"], ex: "Deletes even if not merged" },
    { t: "List branches", c: "Branch", g: "Show all branches", cmd: ["git branch -a"], ex: "Lists all local and remote branches" },
    { t: "Merge branch", c: "Merge", g: "Merge branch into current", cmd: ["git merge <branch>"], ex: "Merges the specified branch" },
    { t: "Merge with no-ff", c: "Merge", g: "Force merge commit", cmd: ["git merge --no-ff <branch>"], ex: "Creates merge commit always" },
    { t: "Squash merge", c: "Merge", g: "Merge with squashing", cmd: ["git merge --squash <branch>"], ex: "Squashes all commits into one" },
    { t: "Abort merge", c: "Merge", g: "Cancel merge in progress", cmd: ["git merge --abort"], ex: "Returns to pre-merge state" },
    { t: "Rebase branch", c: "Rebase", g: "Rebase onto another branch", cmd: ["git rebase <branch>"], ex: "Reapplies commits on top" },
    { t: "Interactive rebase", c: "Rebase", g: "Interactive history editing", cmd: ["git rebase -i HEAD~N"], ex: "Edit, squash, reorder commits" },
    { t: "Abort rebase", c: "Rebase", g: "Cancel rebase", cmd: ["git rebase --abort"], ex: "Returns to pre-rebase state" },
    { t: "Continue rebase", c: "Rebase", g: "Continue after conflict resolution", cmd: ["git rebase --continue"], ex: "Continues the rebase process" },
    { t: "Stash changes", c: "Stash", g: "Save uncommitted changes", cmd: ["git stash"], ex: "Temporarily shelves changes" },
    { t: "Stash with message", c: "Stash", g: "Stash with description", cmd: ["git stash push -m \"message\""], ex: "Stash with a label" },
    { t: "Pop stash", c: "Stash", g: "Apply and remove stash", cmd: ["git stash pop"], ex: "Applies and deletes the stash" },
    { t: "Apply stash", c: "Stash", g: "Apply without removing", cmd: ["git stash apply"], ex: "Applies but keeps the stash" },
    { t: "List stashes", c: "Stash", g: "View all stashes", cmd: ["git stash list"], ex: "Shows all stashed changes" },
    { t: "Drop stash", c: "Stash", g: "Delete specific stash", cmd: ["git stash drop stash@{n}"], ex: "Removes a specific stash" },
    { t: "Create annotated tag", c: "Tag", g: "Create a tag with metadata", cmd: ["git tag -a v1.0.0 -m \"Release v1.0.0\""], ex: "Creates annotated tag" },
    { t: "List tags", c: "Tag", g: "Show all tags", cmd: ["git tag", "git tag -l \"v*\""], ex: "Lists all tags" },
    { t: "Delete tag", c: "Tag", g: "Delete a local tag", cmd: ["git tag -d v1.0.0"], ex: "Removes a tag" },
    { t: "Push tags", c: "Tag", g: "Push all tags to remote", cmd: ["git push origin --tags"], ex: "Uploads all tags" },
    { t: "Soft reset", c: "Reset", g: "Undo commit, keep staged", cmd: ["git reset --soft HEAD~1"], ex: "Moves HEAD but keeps changes staged" },
    { t: "Mixed reset", c: "Reset", g: "Undo commit, unstage", cmd: ["git reset HEAD~1"], ex: "Unstages changes too" },
    { t: "Hard reset", c: "Reset", g: "Discard commit and changes", cmd: ["git reset --hard HEAD~1"], ex: "DANGER: discards all changes" },
    { t: "Reset to specific commit", c: "Reset", g: "Reset to any commit", cmd: ["git reset --hard <commit-hash>"], ex: "Resets to specific commit" },
    { t: "Revert a commit", c: "Revert", g: "Undo commit safely", cmd: ["git revert HEAD"], ex: "Creates new undo commit" },
    { t: "Cherry-pick commit", c: "Cherry Pick", g: "Apply a specific commit", cmd: ["git cherry-pick <commit-hash>"], ex: "Copies commit to current branch" },
    { t: "Cherry-pick range", c: "Cherry Pick", g: "Apply multiple commits", cmd: ["git cherry-pick A..B"], ex: "Applies commits A through B" },
    { t: "View reflog", c: "Reflog", g: "Show reference log", cmd: ["git reflog"], ex: "Shows all HEAD movements" },
    { t: "Find lost commit", c: "Reflog", g: "Recover using reflog", cmd: ["git reflog", "git checkout <hash>"], ex: "Use reflog to find lost commits" },
    { t: "Show diff", c: "Diff", g: "Show unstaged changes", cmd: ["git diff"], ex: "Shows working tree diffs" },
    { t: "Show staged diff", c: "Diff", g: "Show staged changes", cmd: ["git diff --staged", "git diff --cached"], ex: "Shows what will be committed" },
    { t: "Diff between branches", c: "Diff", g: "Compare two branches", cmd: ["git diff branch1..branch2"], ex: "Shows differences" },
    { t: "View commit log", c: "Log", g: "Show commit history", cmd: ["git log"], ex: "Displays commit history" },
    { t: "Log with graph", c: "Log", g: "Visual commit history", cmd: ["git log --graph --oneline --decorate --all"], ex: "ASCII graph of commits" },
    { t: "Search commits", c: "Log", g: "Find commits by message", cmd: ["git log --grep=\"pattern\""], ex: "Searches commit messages" },
    { t: "Show commit details", c: "Log", g: "View full commit info", cmd: ["git show <commit-hash>"], ex: "Shows full commit details" },
    { t: "Set user name", c: "Config", g: "Configure Git user name", cmd: ["git config --global user.name \"Your Name\""], ex: "Sets your Git name" },
    { t: "Set user email", c: "Config", g: "Configure Git email", cmd: ["git config --global user.email \"email@example.com\""], ex: "Sets your Git email" },
    { t: "Set default branch", c: "Config", g: "Change default branch name", cmd: ["git config --global init.defaultBranch main"], ex: "Sets initial branch to main" },
    { t: "List all config", c: "Config", g: "View git configuration", cmd: ["git config --list"], ex: "Shows all config settings" },
    { t: "Set editor", c: "Config", g: "Configure default editor", cmd: ["git config --global core.editor \"code --wait\""], ex: "Sets VS Code as editor" },
    { t: "Set pull.rebase", c: "Config", g: "Pull with rebase by default", cmd: ["git config --global pull.rebase true"], ex: "Rebase instead of merge on pull" },
    { t: "Show file blame", c: "Blame", g: "Show file authorship", cmd: ["git blame <file>"], ex: "Shows who changed each line" },
    { t: "Clean untracked files", c: "Setup", g: "Remove untracked files", cmd: ["git clean -fd"], ex: "Removes untracked files/dirs" },
    { t: "Add remote", c: "Remote", g: "Link to remote repository", cmd: ["git remote add origin <url>"], ex: "Adds remote origin" },
    { t: "View remotes", c: "Remote", g: "Show all remotes", cmd: ["git remote -v"], ex: "Lists remote URLs" },
    { t: "Change remote URL", c: "Remote", g: "Update remote URL", cmd: ["git remote set-url origin <url>"], ex: "Changes remote URL" },
    { t: "Remove remote", c: "Remote", g: "Delete a remote", cmd: ["git remote remove origin"], ex: "Removes remote" },
    { t: "Add submodule", c: "Submodule", g: "Add a submodule", cmd: ["git submodule add <url> <path>"], ex: "Adds external repo as submodule" },
    { t: "Update submodules", c: "Submodule", g: "Update all submodules", cmd: ["git submodule update --init --recursive"], ex: "Updates nested submodules" },
    { t: "Bisect start", c: "Bisect", g: "Start binary search", cmd: ["git bisect start"], ex: "Starts bisect session" },
    { t: "Bisect good/bad", c: "Bisect", g: "Mark commits", cmd: ["git bisect good", "git bisect bad"], ex: "Marks current commit" },
    { t: "Add worktree", c: "Worktree", g: "Add a working tree", cmd: ["git worktree add <path> <branch>"], ex: "Checks out branch in new dir" },
    { t: "List worktrees", c: "Worktree", g: "Show all worktrees", cmd: ["git worktree list"], ex: "Lists linked worktrees" },
    { t: "Git archive", c: "Archive", g: "Create repo archive", cmd: ["git archive --format=zip HEAD > archive.zip"], ex: "Creates ZIP of current state" },
  ];

  for (let i = 0; i < Math.max(count, 500); i++) {
    if (i < knownCommands.length) {
      const kc = knownCommands[i];
      const res = Math.floor(i / 30);
      commands.push({
        id: `CMD-${String(i + 1).padStart(4, "0")}`,
        title: kc.t,
        description: kc.g,
        category: kc.c,
        goal: kc.g,
        commands: kc.cmd,
        explanation: kc.ex,
        risks: ["Always verify before running Git commands", "Some commands rewrite history"],
        alternatives: ["Check git --help for options", "Use git status to verify state"],
        examples: [kc.cmd[0]]
      });
    } else {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const actions = ["manage", "configure", "update", "sync", "track", "verify", "optimize", "clean", "reset", "restore", "backup", "migrate", "upgrade", "audit", "scan", "validate", "export", "import", "merge", "split"];
      const targets = ["branches", "tags", "commits", "remotes", "submodules", "worktrees", "objects", "config", "hooks", "files", "index", "reflog", "stashes", "patches", "archives", "notes", "attributes", "ignore patterns", "aliases", "credentials"];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const target = targets[Math.floor(Math.random() * targets.length)];

      commands.push({
        id: `CMD-${String(i + 1).padStart(4, "0")}`,
        title: `${cat} - ${action} ${target}`,
        description: `Command to ${action} ${target} in Git ${cat.toLowerCase()}`,
        category: cat,
        goal: `${action.charAt(0).toUpperCase() + action.slice(1)} ${target}`,
        commands: [`git ${cat.toLowerCase().split(" ")[0].toLowerCase()} --${action}-${target.replace(" ", "-")}`],
        explanation: `This command helps ${action} ${target} in the repository.`,
        risks: ["Test in a safe environment first", "Some operations can affect team members"],
        alternatives: ["Check Git documentation for more options"],
        examples: [`git ${cat.toLowerCase().split(" ")[0].toLowerCase()} --help`]
      });
    }
  }

  return commands;
}

function generateCheatSheets(count = 150) {
  const categories = [
    "Git Basics", "Git Branching", "GitHub Actions", "SSH",
    "Rebase", "Merge", "Conflict Resolution", "Recovery",
    "Advanced Git", "Git Config", "Git Hooks", "GitHub CLI",
    "CI/CD", "Git Workflows", "Git Tips"
  ];

  const cheatsheets = [];

  const knownSheets = [
    { t: "Git Configuration Quick Reference", c: "Git Config", l: "beginner", desc: "All the essential Git config commands" },
    { t: "Git Commands Every Developer Should Know", c: "Git Basics", l: "beginner", desc: "The most commonly used Git commands" },
    { t: "Branching Strategies Overview", c: "Git Branching", l: "intermediate", desc: "Different branching models compared" },
    { t: "GitHub Actions Workflow Syntax", c: "GitHub Actions", l: "intermediate", desc: "Complete GitHub Actions reference" },
    { t: "SSH Key Setup and Management", c: "SSH", l: "beginner", desc: "Setting up SSH keys for Git" },
    { t: "Interactive Rebase Guide", c: "Rebase", l: "advanced", desc: "Master interactive rebase commands" },
    { t: "Merge Conflict Resolution", c: "Conflict Resolution", l: "intermediate", desc: "How to resolve merge conflicts" },
    { t: "Git Recovery Cheat Sheet", c: "Recovery", l: "advanced", desc: "Recover from common Git mistakes" },
    { t: "Advanced Git Techniques", c: "Advanced Git", l: "expert", desc: "Advanced Git features and tricks" },
    { t: "Git Hooks Reference", c: "Git Hooks", l: "advanced", desc: "Complete Git hooks guide" },
    { t: "GitHub CLI gh Commands", c: "GitHub CLI", l: "intermediate", desc: "Essential GitHub CLI commands" },
    { t: "CI/CD Pipeline Git Commands", c: "CI/CD", l: "intermediate", desc: "Git commands for CI/CD pipelines" },
    { t: "Git Workflow Comparison", c: "Git Workflows", l: "intermediate", desc: "Git Flow vs GitHub Flow vs trunk-based" },
    { t: "Git Tips and Tricks", c: "Git Tips", l: "beginner", desc: "Productivity tips for daily Git use" },
    { t: "Submodule Management", c: "Advanced Git", l: "expert", desc: "Working with Git submodules" },
    { t: "Git Reflog Deep Dive", c: "Recovery", l: "advanced", desc: "Using reflog for recovery" },
    { t: "Cherry-Pick Guide", c: "Git Basics", l: "intermediate", desc: "When and how to use cherry-pick" },
    { t: "Stashing Tips", c: "Git Tips", l: "beginner", desc: "Mastering git stash" },
    { t: "Git Tagging Strategy", c: "Git Workflows", l: "intermediate", desc: "Semantic versioning with tags" },
    { t: "Git Bisect Tutorial", c: "Advanced Git", l: "expert", desc: "Binary search for bugs" },
  ];

  const levels = ["beginner", "intermediate", "advanced", "expert"];

  for (let i = 0; i < count; i++) {
    if (i < knownSheets.length) {
      const ks = knownSheets[i];
      cheatsheets.push({
        id: `CS-${String(i + 1).padStart(3, "0")}`,
        title: ks.t,
        description: ks.desc,
        category: ks.c,
        level: ks.l,
        content: `# ${ks.t}\n\n## Overview\n\nThis cheat sheet covers ${ks.desc.toLowerCase()}.\n\n## Key Commands\n\n\`\`\`bash\n# Add your commands here\ngit status\n\`\`\`\n\n## Common Patterns\n\n1. Always check status first\n2. Commit early, commit often\n3. Pull before pushing\n\n## Best Practices\n\n- Write meaningful commit messages\n- Keep commits focused and atomic\n- Review changes before committing`,
        tags: [ks.c.toLowerCase().replace(" ", "-"), ks.l, "git"],
        commands: ["git status", "git log --oneline", "git diff"]
      });
    } else {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      cheatsheets.push({
        id: `CS-${String(i + 1).padStart(3, "0")}`,
        title: `${cat} - ${level} Level Guide ${i}`,
        description: `A ${level} level guide to ${cat.toLowerCase()}`,
        category: cat,
        level,
        content: `# ${cat} Guide\n\n## Introduction\n\nThis guide covers ${cat.toLowerCase()} for ${level} level users.\n\n## Commands\n\n\`\`\`bash\ngit --help\n\`\`\`\n\n## Tips\n\n- Practice regularly\n- Read the documentation`,
        tags: [cat.toLowerCase().replace(" ", "-"), level, "git"],
        commands: ["git --help"]
      });
    }
  }

  return cheatsheets;
}

function generateArticles(count = 200) {
  const categories = [
    "Git Foundations", "Git Collaboration", "GitHub Mastery",
    "Release Management", "CI/CD", "Monorepos", "Enterprise Git",
    "Advanced Techniques", "Best Practices", "Troubleshooting"
  ];

  const articles = [];
  const levels = ["beginner", "intermediate", "advanced", "expert"];

  const knownArticles = [
    { t: "What is Version Control?", c: "Git Foundations", l: "beginner", desc: "Learn the basics of version control with Git" },
    { t: "Getting Started with Git", c: "Git Foundations", l: "beginner", desc: "Your first steps with Git" },
    { t: "Understanding Git Objects", c: "Git Foundations", l: "intermediate", desc: "How Git stores data internally" },
    { t: "Git Branches Explained", c: "Git Foundations", l: "beginner", desc: "Understanding branching in Git" },
    { t: "Collaborating with Git", c: "Git Collaboration", l: "intermediate", desc: "Working with others using Git" },
    { t: "Pull Request Best Practices", c: "GitHub Mastery", l: "intermediate", desc: "How to create effective PRs" },
    { t: "Code Review Workflow", c: "Git Collaboration", l: "intermediate", desc: "Effective code review with Git" },
    { t: "Release Management with Git", c: "Release Management", l: "advanced", desc: "Managing releases using Git tags and branches" },
    { t: "CI/CD Pipeline Setup", c: "CI/CD", l: "intermediate", desc: "Setting up continuous integration with Git" },
    { t: "Monorepo Management", c: "Monorepos", l: "expert", desc: "Working with large monorepositories" },
    { t: "Enterprise Git Strategies", c: "Enterprise Git", l: "advanced", desc: "Git at scale for organizations" },
    { t: "Advanced Rebasing", c: "Advanced Techniques", l: "expert", desc: "Master complex rebase scenarios" },
    { t: "Git Best Practices", c: "Best Practices", l: "beginner", desc: "Git best practices for every developer" },
    { t: "Common Git Problems Solved", c: "Troubleshooting", l: "beginner", desc: "Solutions to everyday Git problems" },
    { t: "Git Workflows Compared", c: "Git Collaboration", l: "intermediate", desc: "Comparing Git Flow, GitHub Flow, and more" },
    { t: "Understanding Git Merge", c: "Git Foundations", l: "intermediate", desc: "How merging works under the hood" },
    { t: "Git Hooks Guide", c: "Enterprise Git", l: "advanced", desc: "Automating with Git hooks" },
    { t: "Git Security Best Practices", c: "Best Practices", l: "intermediate", desc: "Keeping your Git repositories secure" },
    { t: "Semantic Versioning with Git", c: "Release Management", l: "intermediate", desc: "Using tags for semantic versioning" },
    { t: "Git for DevOps", c: "CI/CD", l: "advanced", desc: "Git in the DevOps pipeline" },
    { t: "Git Internals", c: "Git Foundations", l: "expert", desc: "Deep dive into Git internals" },
    { t: "Managing Git Submodules", c: "Advanced Techniques", l: "expert", desc: "Working with nested repositories" },
    { t: "Git LFS Guide", c: "Enterprise Git", l: "intermediate", desc: "Large file storage with Git LFS" },
    { t: "GitHub Actions Advanced", c: "GitHub Mastery", l: "advanced", desc: "Advanced GitHub Actions workflows" },
    { t: "Git Rebase Workflows", c: "Advanced Techniques", l: "advanced", desc: "Rebasing strategies for clean history" },
  ];

  for (let i = 0; i < count; i++) {
    const ka = i < knownArticles.length ? knownArticles[i] : { 
      t: `${categories[i % categories.length]} - ${levels[i % 4]} Guide`, 
      c: categories[i % categories.length], 
      l: levels[i % 4], 
      desc: `A comprehensive guide to ${categories[i % categories.length].toLowerCase()}`
    };
    articles.push({
      id: `ART-${String(i + 1).padStart(3, "0")}`,
      title: ka.t,
      description: ka.desc,
      level: ka.l,
      category: ka.c,
      content: `# ${ka.t}\n\n## Introduction\n\n${ka.desc}. This article will help you understand the concepts and apply them in practice.\n\n## Prerequisites\n\n- Basic understanding of Git\n- Git installed on your machine\n- A GitHub account (for some sections)\n\n## Main Content\n\n### Key Concepts\n\nUnderstanding these concepts is essential for mastering this topic:\n\n1. **Concept 1**: Foundation of understanding\n2. **Concept 2**: Building on the basics\n3. **Concept 3**: Advanced applications\n\n### Practical Examples\n\n\`\`\`bash\n# Example commands\ngit status\ngit log --oneline\n\`\`\`\n\n### Common Pitfalls\n\n- Always verify before running destructive commands\n- Communicate with your team\n- Keep your branches up to date\n\n## Summary\n\n${ka.desc} Mastering this skill will make you more productive with Git.\n\n## Next Steps\n\n- Practice with real projects\n- Read the official Git documentation\n- Contribute to open source projects`,
      tags: [ka.c.toLowerCase().replace(" ", "-"), ka.l, "git"],
      readingTime: Math.floor(Math.random() * 20) + 5,
      prerequisites: ka.l === "beginner" ? [] : ["Basic Git knowledge"],
      relatedArticles: []
    });
  }

  return articles;
}

// Generate all data
console.log("Generating content files...");
const errors = generateErrors(1000);
console.log(`  ✓ ${errors.length} errors generated`);

const commands = generateCommands(500);
console.log(`  ✓ ${commands.length} commands generated`);

const cheatsheets = generateCheatSheets(150);
console.log(`  ✓ ${cheatsheets.length} cheat sheets generated`);

const articles = generateArticles(200);
console.log(`  ✓ ${articles.length} articles generated`);

// Write data files
fs.writeFileSync(path.join(outputDir, "errors.ts"), `import type { GitError } from "@/types";\n\nexport const errors: GitError[] = ${JSON.stringify(errors, null, 2)};\n`);
fs.writeFileSync(path.join(outputDir, "commands.ts"), `import type { CommandRecipe } from "@/types";\n\nexport const commands: CommandRecipe[] = ${JSON.stringify(commands, null, 2)};\n`);
fs.writeFileSync(path.join(outputDir, "cheatsheets.ts"), `import type { CheatSheet } from "@/types";\n\nexport const cheatsheets: CheatSheet[] = ${JSON.stringify(cheatsheets, null, 2)};\n`);
fs.writeFileSync(path.join(outputDir, "articles.ts"), `import type { Article } from "@/types";\n\nexport const articles: Article[] = ${JSON.stringify(articles, null, 2)};\n`);

// Generate workflows
const workflows = [
  {
    id: "solo", title: "Solo Developer Workflow", description: "Simple yet effective Git workflow for individual developers", type: "Solo Developer",
    branchStrategy: "Trunk-based development with short-lived feature branches", releaseStrategy: "Git tags for versioning, direct main branch releases",
    steps: [
      { phase: "Start", action: "Create feature branch from main", command: "git checkout -b feat/my-feature", description: "Branch off main for each new feature" },
      { phase: "Develop", action: "Make small, focused commits", command: "git commit -m \"feat: add new feature\"", description: "Commit early and often" },
      { phase: "Sync", action: "Rebase on latest main", command: "git fetch && git rebase origin/main", description: "Keep your branch up to date" },
      { phase: "Review", action: "Self-review changes", command: "git diff main", description: "Review changes before merging" },
      { phase: "Merge", action: "Merge to main", command: "git checkout main && git merge feat/my-feature", description: "Merge with a merge commit" },
      { phase: "Release", action: "Tag the release", command: "git tag -a v1.0.0 -m \"Release v1.0.0\"", description: "Create a semantic version tag" },
      { phase: "Push", action: "Push everything", command: "git push origin main --tags", description: "Push branch and tags to remote" },
      { phase: "Cleanup", action: "Delete feature branch", command: "git branch -d feat/my-feature", description: "Clean up local branches" }
    ], commands: ["git checkout -b feat/feature-name", "git add . && git commit -m \"type(scope): message\"", "git fetch && git rebase origin/main", "git checkout main && git pull", "git merge --no-ff feat/feature-name", "git tag -a v1.0.0 -m \"Release v1.0.0\"", "git push origin main --tags", "git branch -d feat/feature-name"], tags: ["solo", "simple", "trunk-based", "beginner"]
  },
  {
    id: "small-team", title: "Small Team Workflow", description: "Collaborative workflow for small teams (2-5 developers)", type: "Small Team",
    branchStrategy: "Feature branches with pull request reviews", releaseStrategy: "Release branches for staging and production",
    steps: [
      { phase: "Plan", action: "Create issue and assign", command: "", description: "Track work in GitHub Issues" },
      { phase: "Branch", action: "Create feature branch from main", command: "git checkout -b feat/issue-123-feature", description: "Use issue numbers in branch names" },
      { phase: "Develop", action: "Make conventional commits", command: "git commit -m \"feat(scope): description\"", description: "Follow conventional commit format" },
      { phase: "Push", action: "Push branch to remote", command: "git push -u origin feat/issue-123-feature", description: "Share your branch" },
      { phase: "PR", action: "Create Pull Request", command: "", description: "Open PR on GitHub" },
      { phase: "Review", action: "Team reviews code", command: "", description: "At least one approval required" },
      { phase: "Merge", action: "Squash and merge to main", command: "", description: "Use squash merge for clean history" },
      { phase: "Deploy", action: "Deploy to staging", command: "", description: "Auto-deploy main to staging" }
    ], commands: ["git checkout -b feat/issue-123-description", "git commit -m \"feat(payments): add stripe integration\"", "git push -u origin feat/issue-123-description", "gh pr create --title \"feat: add stripe\" --body \"Closes #123\"", "git checkout main && git pull", "git branch -d feat/issue-123-description"], tags: ["team", "collaborative", "pr-review", "github-flow"]
  },
  {
    id: "enterprise", title: "Enterprise Git Workflow", description: "Comprehensive workflow for enterprise teams", type: "Enterprise",
    branchStrategy: "Git Flow with develop, release, and hotfix branches", releaseStrategy: "Scheduled releases with semantic versioning",
    steps: [
      { phase: "Develop", action: "Feature branches from develop", command: "git checkout -b feature/feat-name develop", description: "Branch from develop for features" },
      { phase: "PR to Develop", action: "Merge feature to develop", command: "", description: "PR must pass CI and get approvals" },
      { phase: "Release Prep", action: "Create release branch", command: "git checkout -b release/1.2.0 develop", description: "Branch from develop for release" },
      { phase: "Stabilize", action: "Fix bugs on release branch", command: "", description: "Only bug fixes on release branch" },
      { phase: "Release", action: "Merge to main and tag", command: "git checkout main && git merge release/1.2.0 && git tag -a v1.2.0 -m \"v1.2.0\"", description: "Merge to main and tag" },
      { phase: "Back Merge", action: "Merge back to develop", command: "git checkout develop && git merge main", description: "Keep develop in sync" },
      { phase: "Hotfix", action: "Emergency fix from main", command: "git checkout -b hotfix/1.2.1 main", description: "Branch from main for hotfixes" }
    ], commands: ["git checkout -b feature/feat-name develop", "git checkout -b release/1.2.0 develop", "git checkout main && git merge --no-ff release/1.2.0", "git tag -a v1.2.0 -m \"Release version 1.2.0\"", "git checkout develop && git merge main", "git checkout -b hotfix/urgent-fix main", "git push origin --all && git push origin --tags"], tags: ["enterprise", "git-flow", "release-management", "hotfix"]
  },
  {
    id: "open-source", title: "Open Source Workflow", description: "Fork-based workflow for open source contributions", type: "Open Source",
    branchStrategy: "Fork the repository, work on feature branches, submit PRs", releaseStrategy: "Maintainer-managed releases with semantic versioning",
    steps: [
      { phase: "Fork", action: "Fork the repository on GitHub", command: "", description: "Create a fork under your account" },
      { phase: "Clone", action: "Clone your fork locally", command: "git clone https://github.com/your-username/repo.git", description: "Clone your fork" },
      { phase: "Remote", action: "Add upstream remote", command: "git remote add upstream https://github.com/original/repo.git", description: "Track original repository" },
      { phase: "Branch", action: "Create feature branch", command: "git checkout -b feat/improvement", description: "Branch from main" },
      { phase: "Sync", action: "Keep fork updated", command: "git fetch upstream && git rebase upstream/main", description: "Stay up to date" },
      { phase: "Push", action: "Push to your fork", command: "git push -u origin feat/improvement", description: "Share your changes" },
      { phase: "PR", action: "Submit Pull Request", command: "", description: "Open PR from fork to upstream" },
      { phase: "Address Feedback", action: "Make requested changes", command: "", description: "Update branch based on review" }
    ], commands: ["git clone https://github.com/your-username/repo.git", "git remote add upstream https://github.com/original/repo.git", "git checkout -b feat/contribution", "git fetch upstream && git rebase upstream/main", "git push -u origin feat/contribution", "gh pr create --repo original/repo"], tags: ["open-source", "fork", "contributing", "community"]
  },
  {
    id: "startup", title: "Startup Workflow", description: "Fast-paced workflow for startups", type: "Startup",
    branchStrategy: "Short-lived feature branches with continuous deployment", releaseStrategy: "Continuous deployment with feature flags",
    steps: [
      { phase: "Ideate", action: "Create experiment branch", command: "git checkout -b experiment/feature-idea", description: "Quickly prototype ideas" },
      { phase: "Build", action: "MVP implementation", command: "git commit -m \"feat: implement MVP\"", description: "Focus on core functionality" },
      { phase: "Ship", action: "Deploy to production", command: "", description: "Auto-deploy to production" },
      { phase: "Measure", action: "Analyze impact", command: "", description: "Check metrics and feedback" },
      { phase: "Iterate", action: "Improve based on feedback", command: "", description: "Quick iteration cycles" }
    ], commands: ["git checkout -b experiment/new-feature", "git add . && git commit -m \"feat: implement new feature\"", "git push origin experiment/new-feature", "gh pr create --base main", "git checkout main && git pull"], tags: ["startup", "fast", "continuous-deployment", "experimental"]
  }
];
fs.writeFileSync(path.join(outputDir, "workflows.ts"), `import type { Workflow } from "@/types";\n\nexport const workflows: Workflow[] = ${JSON.stringify(workflows, null, 2)};\n`);
console.log(`  ✓ ${workflows.length} workflows generated`);

console.log("\nAll content files generated successfully!");
