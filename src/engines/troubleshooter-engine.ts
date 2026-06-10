import { TroubleshootQuery, TroubleshootResult } from "@/types";

interface Scenario {
  keywords: string[];
  category: string;
  explanation: string;
  recoveryPlan: string[];
  commands: string[];
  warnings: string[];
  bestPractices: string[];
}

const SCENARIOS: Scenario[] = [
  {
    keywords: ["committed sensitive", "password", "secret", "credentials", "api key", "token", "committed secret"],
    category: "Security",
    explanation: "You committed sensitive data (passwords, API keys, or tokens) to Git. Even if you remove them in a later commit, they remain in the history.",
    recoveryPlan: [
      "Immediately rotate the exposed credentials",
      "Use git filter-repo or BFG to remove sensitive data from history",
      "Force push the cleaned history",
      "Notify team members to rebase their branches on the cleaned history",
    ],
    commands: [
      "git filter-repo --path <file> --invert-paths",
      "git push --force --all",
      "git push --force --tags",
    ],
    warnings: [
      "Force-pushing rewrites history — coordinate with your team first",
      "The sensitive data may still be accessible in forks and clones",
      "Consider the data as compromised regardless of cleanup",
    ],
    bestPractices: [
      "Use .gitignore to prevent accidental commits of sensitive files",
      "Use environment variables for configuration",
      "Set up pre-commit hooks to scan for secrets",
      "Use tools like git-secrets, truffleHog, or Gitleaks",
    ],
  },
  {
    keywords: ["wrong branch", "committed to main", "committed to master", "commit on wrong", "wrong branch commit"],
    category: "Branch Management",
    explanation: "You committed changes to the wrong branch. The commits can be moved to the correct branch using cherry-pick or reset.",
    recoveryPlan: [
      "Note the commit hash of the misplaced commit",
      "Create or switch to the correct branch",
      "Cherry-pick the commit(s) to the correct branch",
      "Reset the original branch to remove the misplaced commits",
    ],
    commands: [
      "git log --oneline -5",
      "git checkout correct-branch",
      "git cherry-pick <commit-hash>",
      "git checkout wrong-branch",
      "git reset --hard HEAD~1",
    ],
    warnings: [
      "Only use reset --hard if you haven't pushed yet",
      "If pushed, use revert instead to maintain history",
    ],
    bestPractices: [
      "Always check your current branch with 'git status' before committing",
      "Use branch name prompts in your terminal (e.g., via git-prompt.sh)",
      "Create feature branches for all work — never commit directly to main",
    ],
  },
  {
    keywords: ["undo commit", "revert commit", "remove commit", "delete commit", "uncommit", "undo last commit"],
    category: "Undo Operations",
    explanation: "You want to undo one or more commits. The approach depends on whether the commit has been pushed and how many commits to undo.",
    recoveryPlan: [
      "Determine if the commit has been pushed to remote",
      "If local only: use git reset to undo the commit",
      "If pushed: use git revert to create an inverse commit",
      "Verify the working tree is in the expected state",
    ],
    commands: [
      "git reset --soft HEAD~1    # Keep changes staged",
      "git reset --mixed HEAD~1   # Keep changes unstaged (default)",
      "git reset --hard HEAD~1    # Discard changes permanently",
      "git revert HEAD            # Create inverse commit (safe for pushed commits)",
      "git revert <commit-hash>   # Revert a specific commit",
    ],
    warnings: [
      "Reset --hard discards changes permanently — use with caution",
      "Never reset commits that have been shared with others",
    ],
    bestPractices: [
      "Use revert for any commit that has been pushed to shared branches",
      "Use reset for local commits that haven't left your machine",
      "Keep commits small and focused to make reverts easier",
    ],
  },
  {
    keywords: ["lost work", "lost changes", "reset lost", "stash lost", "deleted changes", "discard changes"],
    category: "Recovery",
    explanation: "You lost work after a reset, checkout, or other operation. Git's reflog tracks all reference changes and can help recover lost commits.",
    recoveryPlan: [
      "Use reflog to find the lost commit hash",
      "Checkout or cherry-pick the lost commit",
      "Create a branch at the recovered commit to save it permanently",
    ],
    commands: [
      "git reflog",
      "git reflog --all",
      "git checkout <lost-commit-hash>",
      "git branch recover-branch <lost-commit-hash>",
      "git cherry-pick <lost-commit-hash>",
    ],
    warnings: [
      "Reflog entries expire (default 90 days for reachable, 30 days for unreachable)",
      "Act quickly — garbage collection can permanently delete unreachable commits",
    ],
    bestPractices: [
      "Commit frequently to minimize potential data loss",
      "Use 'git stash' with a message: git stash push -m 'description'",
      "Regularly push branches to remote as backup",
    ],
  },
  {
    keywords: ["merge conflict", "conflict", "merge error", "conflicting", "failed merge", "merge failed"],
    category: "Merge Conflicts",
    explanation: "A merge conflict occurs when two branches have made different changes to the same part of a file. Git cannot automatically resolve which change to keep.",
    recoveryPlan: [
      "Run git status to identify conflicted files",
      "Open each conflicted file and resolve the marked conflicts",
      "After resolving all conflicts, stage the resolved files",
      "Complete the merge by committing",
    ],
    commands: [
      "git status",
      "git diff",
      "git add <resolved-file>",
      "git merge --continue",
      "git merge --abort   # Cancel the merge if needed",
    ],
    warnings: [
      "Do not delete conflict markers without actually resolving the conflict",
      "Test the merged code thoroughly before committing",
    ],
    bestPractices: [
      "Pull and rebase frequently to minimize conflict size",
      "Communicate with teammates about shared files",
      "Use a merge tool: git mergetool",
      "Break large PRs into smaller, focused changes",
    ],
  },
  {
    keywords: ["detached head", "detached HEAD", "not on a branch", "HEAD detached"],
    category: "Detached HEAD",
    explanation: "Detached HEAD state means you're viewing a specific commit rather than being on a branch. New commits here will be lost unless you create a branch.",
    recoveryPlan: [
      "Create a branch from the current HEAD to save any work",
      "Checkout to the desired branch",
    ],
    commands: [
      "git branch temp-branch",
      "git checkout -b new-branch",
      "git switch -c new-branch",
      "git log --oneline -1   # See current commit",
    ],
    warnings: [
      "Any commits made in detached HEAD state are vulnerable to garbage collection",
      "Always create a branch if you want to keep work done in detached HEAD",
    ],
    bestPractices: [
      "Use 'git switch' instead of 'git checkout' for clarity",
      "Create a branch immediately when you end up in detached HEAD",
    ],
  },
  {
    keywords: ["deleted branch", "branch deleted", "lost branch", "remove branch", "branch gone"],
    category: "Branch Recovery",
    explanation: "A branch was deleted either accidentally or intentionally. If it was pushed recently, you can recover it from remote or reflog.",
    recoveryPlan: [
      "Check reflog for the branch's last commit",
      "Check if the branch exists on remote",
      "Recreate the branch from the recovered commit or remote tracking branch",
    ],
    commands: [
      "git reflog --all",
      "git branch <branch-name> <last-commit-hash>",
      "git checkout -b <branch-name> origin/<branch-name>",
    ],
    warnings: [
      "Local-only branches cannot be recovered if reflog entries have expired",
      "Work fast — garbage collection eventually removes unreachable commits",
    ],
    bestPractices: [
      "Push branches to remote regularly as backup",
      "Be careful with 'git branch -d' (use -d, not -D, to get safety checks)",
    ],
  },
  {
    keywords: ["wrong remote", "remote url", "change remote", "origin wrong", "wrong origin", "remote incorrect"],
    category: "Remote Configuration",
    explanation: "The remote repository URL is incorrect or pointing to the wrong repository.",
    recoveryPlan: [
      "Verify the current remote URL",
      "Set the correct remote URL",
      "Verify the new URL works",
    ],
    commands: [
      "git remote -v",
      "git remote set-url origin https://github.com/user/repo.git",
      "git remote set-url origin git@github.com:user/repo.git",
      "git ls-remote origin",
    ],
    warnings: [
      "Pushing to the wrong remote could expose code to the wrong audience",
    ],
    bestPractices: [
      "Use SSH URLs instead of HTTPS for better security",
      "Verify the remote URL before first push to a new repo",
    ],
  },
  {
    keywords: ["authentication failed", "auth failed", "permission denied", "access denied", "login failed", "auth error"],
    category: "Authentication",
    explanation: "Git cannot authenticate with the remote server. This is usually due to expired credentials, wrong SSH keys, or missing tokens.",
    recoveryPlan: [
      "Check if you're using HTTPS or SSH",
      "For HTTPS: update your credentials or use a personal access token",
      "For SSH: verify your SSH key is loaded and added to GitHub",
    ],
    commands: [
      "ssh -T git@github.com       # Test SSH connection",
      "ssh-add -l                  # List loaded SSH keys",
      "ssh-add ~/.ssh/id_rsa       # Add SSH key to agent",
      "git config --global credential.helper wincred   # Windows",
      "git config --global credential.helper osxkeychain  # macOS",
    ],
    warnings: [
      "GitHub no longer accepts account passwords for HTTPS — use personal access tokens",
      "SSH keys should be passphrase-protected",
    ],
    bestPractices: [
      "Use SSH keys instead of HTTPS for authentication",
      "Set up credential helpers to cache credentials securely",
      "Rotate personal access tokens regularly",
    ],
  },
  {
    keywords: ["large file", "file too large", "file size", "big file", "oversized", "exceeds limit"],
    category: "Large Files",
    explanation: "You tried to commit a file that exceeds Git's file size limit (typically 50-100 MB) or the repository hosting limit.",
    recoveryPlan: [
      "Remove the large file from the commit and add it to .gitignore",
      "Use Git LFS (Large File Storage) for large files that need to be tracked",
      "If already committed, use git filter-repo to remove from history",
    ],
    commands: [
      "git rm --cached <large-file>",
      'echo "<large-file>" >> .gitignore',
      "git lfs track <large-file>",
      "git filter-repo --path <large-file> --invert-paths",
    ],
    warnings: [
      "Large files in Git history permanently bloat the repository",
      "Removing large files from history requires force push and team coordination",
    ],
    bestPractices: [
      "Set up pre-commit hooks to reject large files",
      "Use Git LFS for binaries, assets, and archives",
      "Keep repositories lean — store large assets elsewhere",
    ],
  },
  {
    keywords: ["rebase conflict", "rebase error", "rebase failed", "abort rebase", "rebase in progress"],
    category: "Rebase Conflicts",
    explanation: "A rebase operation encountered conflicts. Git pauses the rebase to let you resolve them before continuing.",
    recoveryPlan: [
      "Identify conflicted files with git status",
      "Resolve conflicts in each file",
      "Stage resolved files and continue the rebase",
      "If stuck, abort the rebase to return to the original state",
    ],
    commands: [
      "git status",
      "git add <resolved-file>",
      "git rebase --continue",
      "git rebase --skip",
      "git rebase --abort",
    ],
    warnings: [
      "Rebase rewrites commit history — never rebase shared/pushed branches",
      "Each conflict resolution applies to one commit at a time during rebase",
    ],
    bestPractices: [
      "Use interactive rebase for cleanup before pushing",
      "Rebase frequently to avoid large, complex conflict resolutions",
      "Prefer merge for shared branches to preserve history",
    ],
  },
  {
    keywords: ["stash pop", "stash apply", "stash lost", "stash drop", "lost stash", "stash disappeared"],
    category: "Stash Recovery",
    explanation: "You lost a stash entry after popping, dropping, or due to an error. Stashes are stored as commits and can be recovered via reflog.",
    recoveryPlan: [
      "List all stashes to see if it still exists",
      "Check the stash reflog for dropped stashes",
      "Apply the stash from the recovered reference",
    ],
    commands: [
      "git stash list",
      "git stash show -p stash@{0}",
      "git stash apply stash@{0}",
      'git log --oneline --graph refs/stash',
    ],
    warnings: [
      "Popped stashes are not immediately deleted — act quickly",
      "Use 'git stash apply' instead of pop to test before removing",
    ],
    bestPractices: [
      "Use 'git stash push -m \"description\"' to name your stashes",
      "Use apply instead of pop to keep the stash until you're sure",
      "Commit work instead of stashing when possible",
    ],
  },
  {
    keywords: ["untracked files", "gitignore not working", "ignored file", "gitignore ignore"],
    category: "Gitignore",
    explanation: "Files you want to ignore are still being tracked or showing as untracked. Gitignore only affects untracked files.",
    recoveryPlan: [
      "Check if the file is already tracked (committed previously)",
      "Remove tracked files from the index without deleting them",
      "Verify gitignore pattern syntax",
    ],
    commands: [
      "git rm --cached <file>",
      "git rm -r --cached <directory>",
      'echo "<pattern>" >> .gitignore',
      "git check-ignore -v <file>  # Debug why a file is ignored",
    ],
    warnings: [
      "Gitignore cannot ignore files that are already tracked",
      "Use --cached with rm to avoid deleting the file from disk",
    ],
    bestPractices: [
      "Set up .gitignore before committing any files",
      "Use global .gitignore for OS-specific files",
      "Commit .gitignore early in the project",
    ],
  },
  {
    keywords: ["merge commit", "remove merge", "undo merge", "abort merge", "merge revert"],
    category: "Merge Operations",
    explanation: "You want to undo a merge commit. The approach differs depending on whether the merge was pushed and if you want to keep the changes.",
    recoveryPlan: [
      "For local merge: reset to the commit before the merge",
      "For pushed merge: use revert with -m to specify which parent to keep",
      "Verify the branch is in the correct state",
    ],
    commands: [
      "git reset --hard HEAD~1               # Undo local merge",
      "git revert -m 1 <merge-commit-hash>   # Revert pushed merge (keep mainline)",
      "git log --oneline --graph --merges    # Find merge commits",
    ],
    warnings: [
      "Reverting a merge with -m 1 keeps the main branch's changes",
      "Resetting a pushed merge requires force push",
    ],
    bestPractices: [
      "Review PRs carefully before merging",
      "Use --no-ff for feature merges to preserve branch history",
    ],
  },
  {
    keywords: ["amend", "amend commit", "edit commit message", "change commit", "modify commit"],
    category: "Commit Modification",
    explanation: "You need to change the most recent commit message or add forgotten changes to it.",
    recoveryPlan: [
      "Stage any additional changes",
      "Amend the commit with new message or changes",
      "Force push if the commit was already pushed",
    ],
    commands: [
      "git add .",
      "git commit --amend -m \"New message\"",
      "git commit --amend --no-edit   # Keep existing message",
      "git push --force-with-lease    # Safer than --force",
    ],
    warnings: [
      "Amending a pushed commit rewrites history — use --force-with-lease",
      "Other developers may have based work on the original commit",
    ],
    bestPractices: [
      "Only amend commits that haven't been shared with others",
      "Use --force-with-lease instead of --force for safety",
      "Consider revert + new commit for pushed changes",
    ],
  },
  {
    keywords: ["git push rejected", "push rejected", "rejected", "failed to push", "push error", "non-fast-forward"],
    category: "Push Errors",
    explanation: "Your push was rejected because the remote branch has commits you don't have locally. This is a non-fast-forward rejection.",
    recoveryPlan: [
      "Pull the latest remote changes",
      "Rebase or merge your local changes on top",
      "Try pushing again",
    ],
    commands: [
      "git fetch origin",
      "git rebase origin/main",
      "git pull origin main --rebase",
      "git push origin <branch>",
      "git push --force-with-lease   # Only if you intentionally want to overwrite",
    ],
    warnings: [
      "Force pushing overwrites remote history — only do this on personal branches",
      "Always use --force-with-lease instead of --force",
    ],
    bestPractices: [
      "Pull before pushing to catch diverged histories early",
      "Use rebase for feature branches, merge for shared branches",
    ],
  },
  {
    keywords: ["git pull error", "pull failed", "cannot pull", "pull rejected", "pull conflict"],
    category: "Pull Errors",
    explanation: "Git pull failed, usually due to local changes that would be overwritten or merge conflicts.",
    recoveryPlan: [
      "Stash or commit your local changes",
      "Pull the latest changes",
      "Restore or apply your local changes",
    ],
    commands: [
      "git stash push -m \"local changes\"",
      "git pull origin main",
      "git stash pop",
      "git pull --rebase   # Rebase local commits on top of pulled changes",
    ],
    warnings: [
      "Uncommitted changes can be lost if you don't stash them first",
      "Merge conflicts during pull need manual resolution",
    ],
    bestPractices: [
      "Commit or stash local changes before pulling",
      "Use git pull --rebase for a cleaner history",
    ],
  },
  {
    keywords: ["cherry-pick failed", "cherry pick conflict", "cherry-pick error"],
    category: "Cherry-Pick",
    explanation: "A cherry-pick operation failed due to conflicts. Git pauses to let you resolve them before continuing.",
    recoveryPlan: [
      "Identify conflicted files with git status",
      "Resolve conflicts manually",
      "Stage the resolved files and continue",
      "Or abort the cherry-pick entirely",
    ],
    commands: [
      "git status",
      "git add <resolved-file>",
      "git cherry-pick --continue",
      "git cherry-pick --abort",
      "git cherry-pick --skip",
    ],
    warnings: [
      "Cherry-picking creates duplicate commits with different hashes",
      "Resolve conflicts carefully — cherry-pick applies changes as a diff",
    ],
    bestPractices: [
      "Cherry-pick is for selective commits, not bulk operations",
      "Include the original commit hash in the message (-x flag)",
    ],
  },
  {
    keywords: ["gitignore", "ignored not working", "file not ignoring", "gitignore file"],
    category: "Configuration",
    explanation: "Your .gitignore patterns aren't working as expected. This is usually due to files already tracked or pattern mismatches.",
    recoveryPlan: [
      "Check if the file is already tracked by Git",
      "Remove tracked files from the index if needed",
      "Verify your gitignore pattern syntax",
    ],
    commands: [
      "git ls-files --error-unmatch <file>   # Check if tracked",
      "git rm --cached <file>                 # Stop tracking",
      "git check-ignore -v <file>             # Debug gitignore",
      "git status --ignored                   # Show ignored files",
    ],
    warnings: [
      "Patterns with leading / are anchored to repo root",
      "Patterns ending with / only match directories",
    ],
    bestPractices: [
      "Use git check-ignore -v to debug why a file isn't ignored",
      "Commit .gitignore early — before adding files that should be ignored",
    ],
  },
  {
    keywords: ["git lfs", "lfs error", "large file storage", "lfs failed", "git lfs migrate"],
    category: "Large File Storage",
    explanation: "Git LFS is not configured correctly or a migration operation failed.",
    recoveryPlan: [
      "Install and configure Git LFS",
      "Track the correct file patterns",
      "Migrate existing large files to LFS if needed",
    ],
    commands: [
      "git lfs install",
      "git lfs track \"*.psd\"",
      "git lfs track \"*.zip\"",
      "git lfs migrate import --include=\"*.psd\" --everything",
      "git lfs ls-files --all",
    ],
    warnings: [
      "LFS migration rewrites history — coordinate with the team",
      "LFS files count against hosting quotas",
    ],
    bestPractices: [
      "Set up LFS tracking before adding large files",
      "Use .gitattributes to define LFS patterns",
      "Monitor LFS bandwidth usage",
    ],
  },
  {
    keywords: ["git submodule", "submodule update", "submodule error", "submodule failed"],
    category: "Submodules",
    explanation: "Git submodule operations failed, often due to uninitialized submodules, detached HEAD, or URL changes.",
    recoveryPlan: [
      "Initialize and update all submodules recursively",
      "Check if submodule URLs are accessible",
      "Fix any detached HEAD states in submodules",
    ],
    commands: [
      "git submodule update --init --recursive",
      "git submodule status",
      "git submodule foreach git checkout main",
      "git submodule sync",
      "git submodule deinit -f .  # Remove all submodules",
    ],
    warnings: [
      "Submodules stay at a specific commit — they don't auto-update with the parent",
      "Always commit submodule changes after updating them",
    ],
    bestPractices: [
      "Use submodule update --init --recursive in CI and setup scripts",
      "Document submodule workflow for new contributors",
    ],
  },
  {
    keywords: ["git tag", "delete tag", "remove tag", "tag error", "create tag"],
    category: "Tags",
    explanation: "You need to create, delete, or fix a Git tag. Tags are references to specific commits for versioning.",
    recoveryPlan: [
      "Delete the incorrect tag locally and remotely",
      "Create the correct tag at the right commit",
      "Push the new tag",
    ],
    commands: [
      "git tag -d v1.0.0                          # Delete local tag",
      "git push origin --delete v1.0.0            # Delete remote tag",
      "git tag v1.0.0 <commit-hash>               # Create tag at specific commit",
      "git tag -a v1.0.0 -m \"Version 1.0.0\"       # Annotated tag",
      "git push origin --tags",
    ],
    warnings: [
      "Deleting remote tags can break CI/CD pipelines",
      "Use annotated tags (-a) for releases, lightweight tags for private pointers",
    ],
    bestPractices: [
      "Use semantic versioning for tags (v1.2.3)",
      "Sign tags with -s for verified releases",
      "Only tag on main or release branches",
    ],
  },
  {
    keywords: ["git bisect", "bisect error", "find bad commit", "git blame", "find bug"],
    category: "Debugging",
    explanation: "You need to find which commit introduced a bug. Git bisect performs a binary search through your commit history.",
    recoveryPlan: [
      "Start the bisect session and mark the current commit as bad",
      "Mark an older known-good commit as good",
      "Git will checkout commits for you to test — mark each as good or bad",
      "After bisect completes, reset to end the session",
    ],
    commands: [
      "git bisect start",
      "git bisect bad",
      "git bisect good <known-good-commit>",
      "git bisect good    # If current test passes",
      "git bisect bad     # If current test fails",
      "git bisect reset   # End bisect session",
      "git bisect visualize  # Show remaining commits",
    ],
    warnings: [
      "Bisect can take many steps in large histories",
      "Automate with 'git bisect run <script>' for efficiency",
    ],
    bestPractices: [
      "Write a test script that returns 0 for good, 1 for bad",
      "Use 'git bisect run ./test.sh' for fully automated bisect",
    ],
  },
  {
    keywords: ["git log", "view history", "git history", "show commits", "commit history"],
    category: "History",
    explanation: "You need to view, search, or format the Git commit history.",
    recoveryPlan: [
      "Use the appropriate log command for your needs",
      "Filter by author, date, file, or message",
      "Format the output for readability",
    ],
    commands: [
      "git log --oneline --graph --all",
      "git log --author=\"name\"",
      "git log --since=\"2 weeks ago\"",
      "git log -- <file>",
      "git log --grep=\"fix\"",
      "git log --format=\"%h %s %aI %an\"",
      "git shortlog -sn   # Summary by author",
    ],
    warnings: [],
    bestPractices: [
      "Use --oneline --graph for a visual branch history",
      "Use --all to see commits on all branches",
    ],
  },
  {
    keywords: ["git diff", "show changes", "compare branches", "diff between", "file changes"],
    category: "Diff",
    explanation: "You need to compare different versions of files, branches, or commits.",
    recoveryPlan: [
      "Use git diff with the appropriate targets",
      "Review the changes",
      "Apply or revert specific changes if needed",
    ],
    commands: [
      "git diff                        # Working tree vs index",
      "git diff --staged               # Index vs last commit",
      "git diff branch1..branch2       # Compare branches",
      "git diff <commit1> <commit2>    # Compare commits",
      "git diff --stat                 # Summary of changes",
      "git diff --name-only            # Only file names",
    ],
    warnings: [],
    bestPractices: [
      "Review diffs before committing to catch unintended changes",
      "Use --stat for a quick overview of changed files",
    ],
  },
  {
    keywords: ["git clean", "remove untracked", "delete untracked", "clean files"],
    category: "Cleanup",
    explanation: "You want to remove untracked files and directories from the working tree.",
    recoveryPlan: [
      "Do a dry run to see what would be deleted",
      "Run git clean with the appropriate flags",
      "Verify the working tree is clean",
    ],
    commands: [
      "git clean -n               # Dry run — shows what would be removed",
      "git clean -f               # Remove untracked files",
      "git clean -fd              # Remove untracked files and directories",
      "git clean -fx              # Also remove files ignored by gitignore",
      'git clean -fdn             # Dry run with directories',
    ],
    warnings: [
      "Git clean permanently deletes untracked files — cannot be undone",
      "Use -n (dry run) first to verify what will be deleted",
    ],
    bestPractices: [
      "Always run git clean -n first to preview deletions",
      "Commit or stash valuable untracked files before cleaning",
    ],
  },
  {
    keywords: ["git fork", "fork sync", "sync fork", "update fork", "outdated fork"],
    category: "Fork Management",
    explanation: "Your fork is behind the upstream repository and needs to be updated with the latest changes.",
    recoveryPlan: [
      "Add the upstream remote if not already configured",
      "Fetch the latest upstream changes",
      "Merge or rebase your fork's main branch",
      "Push the updated main to your fork",
    ],
    commands: [
      "git remote add upstream <original-repo-url>",
      "git fetch upstream",
      "git checkout main",
      "git merge upstream/main",
      "git rebase upstream/main",
      "git push origin main",
    ],
    warnings: [
      "If you have diverged from upstream, rebase may rewrite your history",
      "Coordinate with collaborators before force pushing",
    ],
    bestPractices: [
      "Sync your fork before starting new work",
      "Use feature branches to keep your main clean",
    ],
  },
  {
    keywords: ["git hook", "pre-commit", "commit hook", "hook failed", "githook"],
    category: "Git Hooks",
    explanation: "A Git hook is failing or preventing you from completing an operation.",
    recoveryPlan: [
      "Check the hook output for error details",
      "Fix the issue the hook is complaining about",
      "Or bypass the hook temporarily with --no-verify",
    ],
    commands: [
      "git commit --no-verify              # Bypass pre-commit hook",
      "git push --no-verify                # Bypass pre-push hook",
      "ls .git/hooks/                      # List all hooks",
      "rm .git/hooks/pre-commit            # Remove a hook (if needed)",
    ],
    warnings: [
      "Bypassing hooks should be a temporary workaround, not a habit",
      "Hooks are local and not shared via Git — use a tool like Husky",
    ],
    bestPractices: [
      "Use Husky for shared, version-controlled hooks",
      "Keep hooks fast — developers will bypass slow ones",
    ],
  },
  {
    keywords: ["git sparse", "sparse checkout", "partial clone", "clone specific", "clone subset"],
    category: "Sparse Checkout",
    explanation: "You want to work with only a subset of files from a large repository without downloading everything.",
    recoveryPlan: [
      "Initialize sparse checkout",
      "Specify the directories/files you want",
      "Checkout only those files",
    ],
    commands: [
      "git clone --filter=blob:none --sparse <repo-url>",
      "git sparse-checkout init --cone",
      "git sparse-checkout set <dir1> <dir2>",
      "git sparse-checkout add <additional-dir>",
      "git sparse-checkout list",
    ],
    warnings: [
      "Some operations (blame, log) may be slower with partial clones",
      "Not all Git hosts support partial cloning",
    ],
    bestPractices: [
      "Use sparse checkout for monorepos to reduce clone time",
      "Combine with partial clone for minimal downloads",
    ],
  },
  {
    keywords: ["git revert", "revert conflict", "revert failed", "undo revert"],
    category: "Revert",
    explanation: "A revert operation failed or you need to undo a revert.",
    recoveryPlan: [
      "Resolve conflicts from the revert if any",
      "Continue or abort the revert",
      "Use revert to undo a previous revert",
    ],
    commands: [
      "git revert --continue",
      "git revert --abort",
      "git revert HEAD --no-edit",
      "git log --oneline -5",
    ],
    warnings: [
      "Reverting a revert re-applies the original changes",
      "Revert creates new commits — it doesn't delete history",
    ],
    bestPractices: [
      "Use revert for any commit that has been shared with others",
      "Use reset only for local, unpublished commits",
    ],
  },
  {
    keywords: ["github actions", "ci failed", "actions failed", "workflow failed", "action error"],
    category: "CI/CD",
    explanation: "A GitHub Actions workflow failed or is not behaving as expected.",
    recoveryPlan: [
      "Check the workflow run logs in the Actions tab",
      "Verify the workflow file syntax",
      "Test the workflow locally with act if possible",
    ],
    commands: [
      "gh run list",
      "gh run view <run-id> --log",
      "gh workflow run <workflow-name>",
      "act -j <job-name>   # Run locally",
    ],
    warnings: [
      "Workflow syntax errors won't show until you push",
      "Secrets are not available in PRs from forks",
    ],
    bestPractices: [
      "Use a linter for workflow YAML files",
      "Test workflows in a non-production branch first",
      "Use reusable workflows to avoid duplication",
    ],
  },
  {
    keywords: ["git config", "configuration", "git settings", "config error"],
    category: "Configuration",
    explanation: "You need to view, set, or unset Git configuration at different levels.",
    recoveryPlan: [
      "Check which config level has the setting",
      "Set the configuration at the correct level",
      "Verify it took effect",
    ],
    commands: [
      "git config --list",
      "git config --global user.name \"Your Name\"",
      "git config --global user.email \"email@example.com\"",
      "git config --global core.editor \"code --wait\"",
      "git config --global --unset <key>",
      "git config --global alias.lg \"log --oneline --graph\"",
    ],
    warnings: [
      "Config levels: --local (repo), --global (user), --system (machine)",
      "Global and system config apply to all repositories unless overridden",
    ],
    bestPractices: [
      "Set user.name and user.email immediately after installing Git",
      "Use aliases for frequently used commands",
      "Use includeIf for conditional config per directory",
    ],
  },
];

function calculateConfidence(problem: string, keywords: string[]): number {
  const lower = problem.toLowerCase();
  let matches = 0;
  for (const kw of keywords) {
    if (lower.includes(kw)) matches++;
  }
  return keywords.length > 0 ? matches / keywords.length : 0;
}

export function troubleshoot(query: TroubleshootQuery): TroubleshootResult {
  const problem = query.problem;

  let bestMatch: Scenario | null = null;
  let bestScore = 0;

  for (const scenario of SCENARIOS) {
    const score = calculateConfidence(problem, scenario.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = scenario;
    }
  }

  if (!bestMatch || bestScore === 0) {
    return {
      explanation: "I couldn't identify the specific Git problem you're describing. Here are some general troubleshooting steps.",
      recoveryPlan: [
        "Run 'git status' to see the current state of your repository",
        "Check 'git log --oneline -5' for recent commits",
        "If there's an error message, search for it in CommitKit's error database",
        "Provide more details about what you were trying to do and what went wrong",
      ],
      commands: ["git status", "git log --oneline -5"],
      warnings: [],
      bestPractices: [
        "Read error messages carefully — they often tell you exactly what to do",
        "Check Git's documentation or CommitKit for specific error guides",
      ],
      category: "General",
    };
  }

  return {
    explanation: bestMatch.explanation,
    recoveryPlan: bestMatch.recoveryPlan,
    commands: bestMatch.commands,
    warnings: bestMatch.warnings,
    bestPractices: bestMatch.bestPractices,
    category: bestMatch.category,
  };
}
