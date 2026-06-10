import type { CommandRecipe } from "@/types";

export const commands: CommandRecipe[] = [
  {
    "id": "CMD-0001",
    "title": "Initialize a repository",
    "description": "Create a new Git repository",
    "category": "Setup",
    "goal": "Create a new Git repository",
    "commands": [
      "git init"
    ],
    "explanation": "Creates a new .git directory",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git init"
    ]
  },
  {
    "id": "CMD-0002",
    "title": "Clone a repository",
    "description": "Make a local copy of a remote repo",
    "category": "Clone",
    "goal": "Make a local copy of a remote repo",
    "commands": [
      "git clone <repository-url>"
    ],
    "explanation": "Downloads the entire repository",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git clone <repository-url>"
    ]
  },
  {
    "id": "CMD-0003",
    "title": "Clone with specific branch",
    "description": "Clone only a specific branch",
    "category": "Clone",
    "goal": "Clone only a specific branch",
    "commands": [
      "git clone --branch <branch> <url>"
    ],
    "explanation": "Only the specified branch is fetched",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git clone --branch <branch> <url>"
    ]
  },
  {
    "id": "CMD-0004",
    "title": "Shallow clone",
    "description": "Clone with limited history",
    "category": "Clone",
    "goal": "Clone with limited history",
    "commands": [
      "git clone --depth 1 <url>"
    ],
    "explanation": "Only the latest commit is fetched",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git clone --depth 1 <url>"
    ]
  },
  {
    "id": "CMD-0005",
    "title": "Check status",
    "description": "View working tree status",
    "category": "Setup",
    "goal": "View working tree status",
    "commands": [
      "git status",
      "git status -s"
    ],
    "explanation": "Shows modified, staged, and untracked files",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git status"
    ]
  },
  {
    "id": "CMD-0006",
    "title": "Add all changes",
    "description": "Stage all changes",
    "category": "Setup",
    "goal": "Stage all changes",
    "commands": [
      "git add -A",
      "git add ."
    ],
    "explanation": "Stages all modified and new files",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git add -A"
    ]
  },
  {
    "id": "CMD-0007",
    "title": "Stage specific file",
    "description": "Stage a single file",
    "category": "Setup",
    "goal": "Stage a single file",
    "commands": [
      "git add <file>"
    ],
    "explanation": "Only stages the specified file",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git add <file>"
    ]
  },
  {
    "id": "CMD-0008",
    "title": "Unstage a file",
    "description": "Remove file from staging",
    "category": "Setup",
    "goal": "Remove file from staging",
    "commands": [
      "git restore --staged <file>",
      "git reset HEAD <file>"
    ],
    "explanation": "Keeps changes but unstages",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git restore --staged <file>"
    ]
  },
  {
    "id": "CMD-0009",
    "title": "Create a commit",
    "description": "Commit staged changes",
    "category": "Setup",
    "goal": "Commit staged changes",
    "commands": [
      "git commit -m \"message\""
    ],
    "explanation": "Creates a new commit",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git commit -m \"message\""
    ]
  },
  {
    "id": "CMD-0010",
    "title": "Amend last commit",
    "description": "Modify the last commit",
    "category": "Setup",
    "goal": "Modify the last commit",
    "commands": [
      "git commit --amend -m \"new message\""
    ],
    "explanation": "Replaces the last commit",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git commit --amend -m \"new message\""
    ]
  },
  {
    "id": "CMD-0011",
    "title": "Push to remote",
    "description": "Push commits to remote",
    "category": "Push",
    "goal": "Push commits to remote",
    "commands": [
      "git push origin <branch>"
    ],
    "explanation": "Uploads commits to remote",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git push origin <branch>"
    ]
  },
  {
    "id": "CMD-0012",
    "title": "Force push with lease",
    "description": "Safe force push",
    "category": "Push",
    "goal": "Safe force push",
    "commands": [
      "git push --force-with-lease origin <branch>"
    ],
    "explanation": "Only force pushes if remote hasn't changed",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git push --force-with-lease origin <branch>"
    ]
  },
  {
    "id": "CMD-0013",
    "title": "Pull from remote",
    "description": "Pull latest changes",
    "category": "Pull",
    "goal": "Pull latest changes",
    "commands": [
      "git pull origin <branch>"
    ],
    "explanation": "Fetches and merges remote changes",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git pull origin <branch>"
    ]
  },
  {
    "id": "CMD-0014",
    "title": "Pull with rebase",
    "description": "Pull and rebase",
    "category": "Pull",
    "goal": "Pull and rebase",
    "commands": [
      "git pull --rebase origin <branch>"
    ],
    "explanation": "Rebases instead of merging",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git pull --rebase origin <branch>"
    ]
  },
  {
    "id": "CMD-0015",
    "title": "Create a branch",
    "description": "Create new branch",
    "category": "Branch",
    "goal": "Create new branch",
    "commands": [
      "git branch <branch-name>"
    ],
    "explanation": "Creates at current HEAD",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git branch <branch-name>"
    ]
  },
  {
    "id": "CMD-0016",
    "title": "Switch branches",
    "description": "Checkout a branch",
    "category": "Branch",
    "goal": "Checkout a branch",
    "commands": [
      "git switch <branch>",
      "git checkout <branch>"
    ],
    "explanation": "Switches to the specified branch",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git switch <branch>"
    ]
  },
  {
    "id": "CMD-0017",
    "title": "Create and switch",
    "description": "Create and checkout branch",
    "category": "Branch",
    "goal": "Create and checkout branch",
    "commands": [
      "git switch -c <branch>",
      "git checkout -b <branch>"
    ],
    "explanation": "Creates and switches to new branch",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git switch -c <branch>"
    ]
  },
  {
    "id": "CMD-0018",
    "title": "Rename branch",
    "description": "Rename current branch",
    "category": "Branch",
    "goal": "Rename current branch",
    "commands": [
      "git branch -m <new-name>"
    ],
    "explanation": "Renames current branch",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git branch -m <new-name>"
    ]
  },
  {
    "id": "CMD-0019",
    "title": "Delete a branch",
    "description": "Delete a local branch",
    "category": "Branch",
    "goal": "Delete a local branch",
    "commands": [
      "git branch -d <branch>"
    ],
    "explanation": "Deletes if already merged",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git branch -d <branch>"
    ]
  },
  {
    "id": "CMD-0020",
    "title": "Force delete branch",
    "description": "Delete branch regardless",
    "category": "Branch",
    "goal": "Delete branch regardless",
    "commands": [
      "git branch -D <branch>"
    ],
    "explanation": "Deletes even if not merged",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git branch -D <branch>"
    ]
  },
  {
    "id": "CMD-0021",
    "title": "List branches",
    "description": "Show all branches",
    "category": "Branch",
    "goal": "Show all branches",
    "commands": [
      "git branch -a"
    ],
    "explanation": "Lists all local and remote branches",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git branch -a"
    ]
  },
  {
    "id": "CMD-0022",
    "title": "Merge branch",
    "description": "Merge branch into current",
    "category": "Merge",
    "goal": "Merge branch into current",
    "commands": [
      "git merge <branch>"
    ],
    "explanation": "Merges the specified branch",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git merge <branch>"
    ]
  },
  {
    "id": "CMD-0023",
    "title": "Merge with no-ff",
    "description": "Force merge commit",
    "category": "Merge",
    "goal": "Force merge commit",
    "commands": [
      "git merge --no-ff <branch>"
    ],
    "explanation": "Creates merge commit always",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git merge --no-ff <branch>"
    ]
  },
  {
    "id": "CMD-0024",
    "title": "Squash merge",
    "description": "Merge with squashing",
    "category": "Merge",
    "goal": "Merge with squashing",
    "commands": [
      "git merge --squash <branch>"
    ],
    "explanation": "Squashes all commits into one",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git merge --squash <branch>"
    ]
  },
  {
    "id": "CMD-0025",
    "title": "Abort merge",
    "description": "Cancel merge in progress",
    "category": "Merge",
    "goal": "Cancel merge in progress",
    "commands": [
      "git merge --abort"
    ],
    "explanation": "Returns to pre-merge state",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git merge --abort"
    ]
  },
  {
    "id": "CMD-0026",
    "title": "Rebase branch",
    "description": "Rebase onto another branch",
    "category": "Rebase",
    "goal": "Rebase onto another branch",
    "commands": [
      "git rebase <branch>"
    ],
    "explanation": "Reapplies commits on top",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git rebase <branch>"
    ]
  },
  {
    "id": "CMD-0027",
    "title": "Interactive rebase",
    "description": "Interactive history editing",
    "category": "Rebase",
    "goal": "Interactive history editing",
    "commands": [
      "git rebase -i HEAD~N"
    ],
    "explanation": "Edit, squash, reorder commits",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git rebase -i HEAD~N"
    ]
  },
  {
    "id": "CMD-0028",
    "title": "Abort rebase",
    "description": "Cancel rebase",
    "category": "Rebase",
    "goal": "Cancel rebase",
    "commands": [
      "git rebase --abort"
    ],
    "explanation": "Returns to pre-rebase state",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git rebase --abort"
    ]
  },
  {
    "id": "CMD-0029",
    "title": "Continue rebase",
    "description": "Continue after conflict resolution",
    "category": "Rebase",
    "goal": "Continue after conflict resolution",
    "commands": [
      "git rebase --continue"
    ],
    "explanation": "Continues the rebase process",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git rebase --continue"
    ]
  },
  {
    "id": "CMD-0030",
    "title": "Stash changes",
    "description": "Save uncommitted changes",
    "category": "Stash",
    "goal": "Save uncommitted changes",
    "commands": [
      "git stash"
    ],
    "explanation": "Temporarily shelves changes",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git stash"
    ]
  },
  {
    "id": "CMD-0031",
    "title": "Stash with message",
    "description": "Stash with description",
    "category": "Stash",
    "goal": "Stash with description",
    "commands": [
      "git stash push -m \"message\""
    ],
    "explanation": "Stash with a label",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git stash push -m \"message\""
    ]
  },
  {
    "id": "CMD-0032",
    "title": "Pop stash",
    "description": "Apply and remove stash",
    "category": "Stash",
    "goal": "Apply and remove stash",
    "commands": [
      "git stash pop"
    ],
    "explanation": "Applies and deletes the stash",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git stash pop"
    ]
  },
  {
    "id": "CMD-0033",
    "title": "Apply stash",
    "description": "Apply without removing",
    "category": "Stash",
    "goal": "Apply without removing",
    "commands": [
      "git stash apply"
    ],
    "explanation": "Applies but keeps the stash",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git stash apply"
    ]
  },
  {
    "id": "CMD-0034",
    "title": "List stashes",
    "description": "View all stashes",
    "category": "Stash",
    "goal": "View all stashes",
    "commands": [
      "git stash list"
    ],
    "explanation": "Shows all stashed changes",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git stash list"
    ]
  },
  {
    "id": "CMD-0035",
    "title": "Drop stash",
    "description": "Delete specific stash",
    "category": "Stash",
    "goal": "Delete specific stash",
    "commands": [
      "git stash drop stash@{n}"
    ],
    "explanation": "Removes a specific stash",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git stash drop stash@{n}"
    ]
  },
  {
    "id": "CMD-0036",
    "title": "Create annotated tag",
    "description": "Create a tag with metadata",
    "category": "Tag",
    "goal": "Create a tag with metadata",
    "commands": [
      "git tag -a v1.0.0 -m \"Release v1.0.0\""
    ],
    "explanation": "Creates annotated tag",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git tag -a v1.0.0 -m \"Release v1.0.0\""
    ]
  },
  {
    "id": "CMD-0037",
    "title": "List tags",
    "description": "Show all tags",
    "category": "Tag",
    "goal": "Show all tags",
    "commands": [
      "git tag",
      "git tag -l \"v*\""
    ],
    "explanation": "Lists all tags",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git tag"
    ]
  },
  {
    "id": "CMD-0038",
    "title": "Delete tag",
    "description": "Delete a local tag",
    "category": "Tag",
    "goal": "Delete a local tag",
    "commands": [
      "git tag -d v1.0.0"
    ],
    "explanation": "Removes a tag",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git tag -d v1.0.0"
    ]
  },
  {
    "id": "CMD-0039",
    "title": "Push tags",
    "description": "Push all tags to remote",
    "category": "Tag",
    "goal": "Push all tags to remote",
    "commands": [
      "git push origin --tags"
    ],
    "explanation": "Uploads all tags",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git push origin --tags"
    ]
  },
  {
    "id": "CMD-0040",
    "title": "Soft reset",
    "description": "Undo commit, keep staged",
    "category": "Reset",
    "goal": "Undo commit, keep staged",
    "commands": [
      "git reset --soft HEAD~1"
    ],
    "explanation": "Moves HEAD but keeps changes staged",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git reset --soft HEAD~1"
    ]
  },
  {
    "id": "CMD-0041",
    "title": "Mixed reset",
    "description": "Undo commit, unstage",
    "category": "Reset",
    "goal": "Undo commit, unstage",
    "commands": [
      "git reset HEAD~1"
    ],
    "explanation": "Unstages changes too",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git reset HEAD~1"
    ]
  },
  {
    "id": "CMD-0042",
    "title": "Hard reset",
    "description": "Discard commit and changes",
    "category": "Reset",
    "goal": "Discard commit and changes",
    "commands": [
      "git reset --hard HEAD~1"
    ],
    "explanation": "DANGER: discards all changes",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git reset --hard HEAD~1"
    ]
  },
  {
    "id": "CMD-0043",
    "title": "Reset to specific commit",
    "description": "Reset to any commit",
    "category": "Reset",
    "goal": "Reset to any commit",
    "commands": [
      "git reset --hard <commit-hash>"
    ],
    "explanation": "Resets to specific commit",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git reset --hard <commit-hash>"
    ]
  },
  {
    "id": "CMD-0044",
    "title": "Revert a commit",
    "description": "Undo commit safely",
    "category": "Revert",
    "goal": "Undo commit safely",
    "commands": [
      "git revert HEAD"
    ],
    "explanation": "Creates new undo commit",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git revert HEAD"
    ]
  },
  {
    "id": "CMD-0045",
    "title": "Cherry-pick commit",
    "description": "Apply a specific commit",
    "category": "Cherry Pick",
    "goal": "Apply a specific commit",
    "commands": [
      "git cherry-pick <commit-hash>"
    ],
    "explanation": "Copies commit to current branch",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git cherry-pick <commit-hash>"
    ]
  },
  {
    "id": "CMD-0046",
    "title": "Cherry-pick range",
    "description": "Apply multiple commits",
    "category": "Cherry Pick",
    "goal": "Apply multiple commits",
    "commands": [
      "git cherry-pick A..B"
    ],
    "explanation": "Applies commits A through B",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git cherry-pick A..B"
    ]
  },
  {
    "id": "CMD-0047",
    "title": "View reflog",
    "description": "Show reference log",
    "category": "Reflog",
    "goal": "Show reference log",
    "commands": [
      "git reflog"
    ],
    "explanation": "Shows all HEAD movements",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git reflog"
    ]
  },
  {
    "id": "CMD-0048",
    "title": "Find lost commit",
    "description": "Recover using reflog",
    "category": "Reflog",
    "goal": "Recover using reflog",
    "commands": [
      "git reflog",
      "git checkout <hash>"
    ],
    "explanation": "Use reflog to find lost commits",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git reflog"
    ]
  },
  {
    "id": "CMD-0049",
    "title": "Show diff",
    "description": "Show unstaged changes",
    "category": "Diff",
    "goal": "Show unstaged changes",
    "commands": [
      "git diff"
    ],
    "explanation": "Shows working tree diffs",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git diff"
    ]
  },
  {
    "id": "CMD-0050",
    "title": "Show staged diff",
    "description": "Show staged changes",
    "category": "Diff",
    "goal": "Show staged changes",
    "commands": [
      "git diff --staged",
      "git diff --cached"
    ],
    "explanation": "Shows what will be committed",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git diff --staged"
    ]
  },
  {
    "id": "CMD-0051",
    "title": "Diff between branches",
    "description": "Compare two branches",
    "category": "Diff",
    "goal": "Compare two branches",
    "commands": [
      "git diff branch1..branch2"
    ],
    "explanation": "Shows differences",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git diff branch1..branch2"
    ]
  },
  {
    "id": "CMD-0052",
    "title": "View commit log",
    "description": "Show commit history",
    "category": "Log",
    "goal": "Show commit history",
    "commands": [
      "git log"
    ],
    "explanation": "Displays commit history",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git log"
    ]
  },
  {
    "id": "CMD-0053",
    "title": "Log with graph",
    "description": "Visual commit history",
    "category": "Log",
    "goal": "Visual commit history",
    "commands": [
      "git log --graph --oneline --decorate --all"
    ],
    "explanation": "ASCII graph of commits",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git log --graph --oneline --decorate --all"
    ]
  },
  {
    "id": "CMD-0054",
    "title": "Search commits",
    "description": "Find commits by message",
    "category": "Log",
    "goal": "Find commits by message",
    "commands": [
      "git log --grep=\"pattern\""
    ],
    "explanation": "Searches commit messages",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git log --grep=\"pattern\""
    ]
  },
  {
    "id": "CMD-0055",
    "title": "Show commit details",
    "description": "View full commit info",
    "category": "Log",
    "goal": "View full commit info",
    "commands": [
      "git show <commit-hash>"
    ],
    "explanation": "Shows full commit details",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git show <commit-hash>"
    ]
  },
  {
    "id": "CMD-0056",
    "title": "Set user name",
    "description": "Configure Git user name",
    "category": "Config",
    "goal": "Configure Git user name",
    "commands": [
      "git config --global user.name \"Your Name\""
    ],
    "explanation": "Sets your Git name",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git config --global user.name \"Your Name\""
    ]
  },
  {
    "id": "CMD-0057",
    "title": "Set user email",
    "description": "Configure Git email",
    "category": "Config",
    "goal": "Configure Git email",
    "commands": [
      "git config --global user.email \"email@example.com\""
    ],
    "explanation": "Sets your Git email",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git config --global user.email \"email@example.com\""
    ]
  },
  {
    "id": "CMD-0058",
    "title": "Set default branch",
    "description": "Change default branch name",
    "category": "Config",
    "goal": "Change default branch name",
    "commands": [
      "git config --global init.defaultBranch main"
    ],
    "explanation": "Sets initial branch to main",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git config --global init.defaultBranch main"
    ]
  },
  {
    "id": "CMD-0059",
    "title": "List all config",
    "description": "View git configuration",
    "category": "Config",
    "goal": "View git configuration",
    "commands": [
      "git config --list"
    ],
    "explanation": "Shows all config settings",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git config --list"
    ]
  },
  {
    "id": "CMD-0060",
    "title": "Set editor",
    "description": "Configure default editor",
    "category": "Config",
    "goal": "Configure default editor",
    "commands": [
      "git config --global core.editor \"code --wait\""
    ],
    "explanation": "Sets VS Code as editor",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git config --global core.editor \"code --wait\""
    ]
  },
  {
    "id": "CMD-0061",
    "title": "Set pull.rebase",
    "description": "Pull with rebase by default",
    "category": "Config",
    "goal": "Pull with rebase by default",
    "commands": [
      "git config --global pull.rebase true"
    ],
    "explanation": "Rebase instead of merge on pull",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git config --global pull.rebase true"
    ]
  },
  {
    "id": "CMD-0062",
    "title": "Show file blame",
    "description": "Show file authorship",
    "category": "Blame",
    "goal": "Show file authorship",
    "commands": [
      "git blame <file>"
    ],
    "explanation": "Shows who changed each line",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git blame <file>"
    ]
  },
  {
    "id": "CMD-0063",
    "title": "Clean untracked files",
    "description": "Remove untracked files",
    "category": "Setup",
    "goal": "Remove untracked files",
    "commands": [
      "git clean -fd"
    ],
    "explanation": "Removes untracked files/dirs",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git clean -fd"
    ]
  },
  {
    "id": "CMD-0064",
    "title": "Add remote",
    "description": "Link to remote repository",
    "category": "Remote",
    "goal": "Link to remote repository",
    "commands": [
      "git remote add origin <url>"
    ],
    "explanation": "Adds remote origin",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git remote add origin <url>"
    ]
  },
  {
    "id": "CMD-0065",
    "title": "View remotes",
    "description": "Show all remotes",
    "category": "Remote",
    "goal": "Show all remotes",
    "commands": [
      "git remote -v"
    ],
    "explanation": "Lists remote URLs",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git remote -v"
    ]
  },
  {
    "id": "CMD-0066",
    "title": "Change remote URL",
    "description": "Update remote URL",
    "category": "Remote",
    "goal": "Update remote URL",
    "commands": [
      "git remote set-url origin <url>"
    ],
    "explanation": "Changes remote URL",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git remote set-url origin <url>"
    ]
  },
  {
    "id": "CMD-0067",
    "title": "Remove remote",
    "description": "Delete a remote",
    "category": "Remote",
    "goal": "Delete a remote",
    "commands": [
      "git remote remove origin"
    ],
    "explanation": "Removes remote",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git remote remove origin"
    ]
  },
  {
    "id": "CMD-0068",
    "title": "Add submodule",
    "description": "Add a submodule",
    "category": "Submodule",
    "goal": "Add a submodule",
    "commands": [
      "git submodule add <url> <path>"
    ],
    "explanation": "Adds external repo as submodule",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git submodule add <url> <path>"
    ]
  },
  {
    "id": "CMD-0069",
    "title": "Update submodules",
    "description": "Update all submodules",
    "category": "Submodule",
    "goal": "Update all submodules",
    "commands": [
      "git submodule update --init --recursive"
    ],
    "explanation": "Updates nested submodules",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git submodule update --init --recursive"
    ]
  },
  {
    "id": "CMD-0070",
    "title": "Bisect start",
    "description": "Start binary search",
    "category": "Bisect",
    "goal": "Start binary search",
    "commands": [
      "git bisect start"
    ],
    "explanation": "Starts bisect session",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git bisect start"
    ]
  },
  {
    "id": "CMD-0071",
    "title": "Bisect good/bad",
    "description": "Mark commits",
    "category": "Bisect",
    "goal": "Mark commits",
    "commands": [
      "git bisect good",
      "git bisect bad"
    ],
    "explanation": "Marks current commit",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git bisect good"
    ]
  },
  {
    "id": "CMD-0072",
    "title": "Add worktree",
    "description": "Add a working tree",
    "category": "Worktree",
    "goal": "Add a working tree",
    "commands": [
      "git worktree add <path> <branch>"
    ],
    "explanation": "Checks out branch in new dir",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git worktree add <path> <branch>"
    ]
  },
  {
    "id": "CMD-0073",
    "title": "List worktrees",
    "description": "Show all worktrees",
    "category": "Worktree",
    "goal": "Show all worktrees",
    "commands": [
      "git worktree list"
    ],
    "explanation": "Lists linked worktrees",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git worktree list"
    ]
  },
  {
    "id": "CMD-0074",
    "title": "Git archive",
    "description": "Create repo archive",
    "category": "Archive",
    "goal": "Create repo archive",
    "commands": [
      "git archive --format=zip HEAD > archive.zip"
    ],
    "explanation": "Creates ZIP of current state",
    "risks": [
      "Always verify before running Git commands",
      "Some commands rewrite history"
    ],
    "alternatives": [
      "Check git --help for options",
      "Use git status to verify state"
    ],
    "examples": [
      "git archive --format=zip HEAD > archive.zip"
    ]
  },
  {
    "id": "CMD-0075",
    "title": "Worktree - configure commits",
    "description": "Command to configure commits in Git worktree",
    "category": "Worktree",
    "goal": "Configure commits",
    "commands": [
      "git worktree --configure-commits"
    ],
    "explanation": "This command helps configure commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0076",
    "title": "Diff - upgrade ignore patterns",
    "description": "Command to upgrade ignore patterns in Git diff",
    "category": "Diff",
    "goal": "Upgrade ignore patterns",
    "commands": [
      "git diff --upgrade-ignore-patterns"
    ],
    "explanation": "This command helps upgrade ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0077",
    "title": "Tag - upgrade notes",
    "description": "Command to upgrade notes in Git tag",
    "category": "Tag",
    "goal": "Upgrade notes",
    "commands": [
      "git tag --upgrade-notes"
    ],
    "explanation": "This command helps upgrade notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0078",
    "title": "Recovery - scan attributes",
    "description": "Command to scan attributes in Git recovery",
    "category": "Recovery",
    "goal": "Scan attributes",
    "commands": [
      "git recovery --scan-attributes"
    ],
    "explanation": "This command helps scan attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0079",
    "title": "Bisect - update remotes",
    "description": "Command to update remotes in Git bisect",
    "category": "Bisect",
    "goal": "Update remotes",
    "commands": [
      "git bisect --update-remotes"
    ],
    "explanation": "This command helps update remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0080",
    "title": "Archive - export worktrees",
    "description": "Command to export worktrees in Git archive",
    "category": "Archive",
    "goal": "Export worktrees",
    "commands": [
      "git archive --export-worktrees"
    ],
    "explanation": "This command helps export worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0081",
    "title": "Bisect - export aliases",
    "description": "Command to export aliases in Git bisect",
    "category": "Bisect",
    "goal": "Export aliases",
    "commands": [
      "git bisect --export-aliases"
    ],
    "explanation": "This command helps export aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0082",
    "title": "Remote - scan stashes",
    "description": "Command to scan stashes in Git remote",
    "category": "Remote",
    "goal": "Scan stashes",
    "commands": [
      "git remote --scan-stashes"
    ],
    "explanation": "This command helps scan stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0083",
    "title": "Reflog - reset submodules",
    "description": "Command to reset submodules in Git reflog",
    "category": "Reflog",
    "goal": "Reset submodules",
    "commands": [
      "git reflog --reset-submodules"
    ],
    "explanation": "This command helps reset submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0084",
    "title": "Revert - import archives",
    "description": "Command to import archives in Git revert",
    "category": "Revert",
    "goal": "Import archives",
    "commands": [
      "git revert --import-archives"
    ],
    "explanation": "This command helps import archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0085",
    "title": "Bisect - audit aliases",
    "description": "Command to audit aliases in Git bisect",
    "category": "Bisect",
    "goal": "Audit aliases",
    "commands": [
      "git bisect --audit-aliases"
    ],
    "explanation": "This command helps audit aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0086",
    "title": "Reflog - scan patches",
    "description": "Command to scan patches in Git reflog",
    "category": "Reflog",
    "goal": "Scan patches",
    "commands": [
      "git reflog --scan-patches"
    ],
    "explanation": "This command helps scan patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0087",
    "title": "Recovery - restore objects",
    "description": "Command to restore objects in Git recovery",
    "category": "Recovery",
    "goal": "Restore objects",
    "commands": [
      "git recovery --restore-objects"
    ],
    "explanation": "This command helps restore objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0088",
    "title": "Pull - configure remotes",
    "description": "Command to configure remotes in Git pull",
    "category": "Pull",
    "goal": "Configure remotes",
    "commands": [
      "git pull --configure-remotes"
    ],
    "explanation": "This command helps configure remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0089",
    "title": "Push - reset stashes",
    "description": "Command to reset stashes in Git push",
    "category": "Push",
    "goal": "Reset stashes",
    "commands": [
      "git push --reset-stashes"
    ],
    "explanation": "This command helps reset stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0090",
    "title": "Rebase - clean commits",
    "description": "Command to clean commits in Git rebase",
    "category": "Rebase",
    "goal": "Clean commits",
    "commands": [
      "git rebase --clean-commits"
    ],
    "explanation": "This command helps clean commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0091",
    "title": "Rebase - clean commits",
    "description": "Command to clean commits in Git rebase",
    "category": "Rebase",
    "goal": "Clean commits",
    "commands": [
      "git rebase --clean-commits"
    ],
    "explanation": "This command helps clean commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0092",
    "title": "Diff - split archives",
    "description": "Command to split archives in Git diff",
    "category": "Diff",
    "goal": "Split archives",
    "commands": [
      "git diff --split-archives"
    ],
    "explanation": "This command helps split archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0093",
    "title": "Reset - sync credentials",
    "description": "Command to sync credentials in Git reset",
    "category": "Reset",
    "goal": "Sync credentials",
    "commands": [
      "git reset --sync-credentials"
    ],
    "explanation": "This command helps sync credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0094",
    "title": "Cherry Pick - configure config",
    "description": "Command to configure config in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Configure config",
    "commands": [
      "git cherry --configure-config"
    ],
    "explanation": "This command helps configure config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0095",
    "title": "Archive - upgrade config",
    "description": "Command to upgrade config in Git archive",
    "category": "Archive",
    "goal": "Upgrade config",
    "commands": [
      "git archive --upgrade-config"
    ],
    "explanation": "This command helps upgrade config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0096",
    "title": "Push - manage commits",
    "description": "Command to manage commits in Git push",
    "category": "Push",
    "goal": "Manage commits",
    "commands": [
      "git push --manage-commits"
    ],
    "explanation": "This command helps manage commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0097",
    "title": "Reflog - migrate aliases",
    "description": "Command to migrate aliases in Git reflog",
    "category": "Reflog",
    "goal": "Migrate aliases",
    "commands": [
      "git reflog --migrate-aliases"
    ],
    "explanation": "This command helps migrate aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0098",
    "title": "Rebase - sync credentials",
    "description": "Command to sync credentials in Git rebase",
    "category": "Rebase",
    "goal": "Sync credentials",
    "commands": [
      "git rebase --sync-credentials"
    ],
    "explanation": "This command helps sync credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0099",
    "title": "Bisect - import aliases",
    "description": "Command to import aliases in Git bisect",
    "category": "Bisect",
    "goal": "Import aliases",
    "commands": [
      "git bisect --import-aliases"
    ],
    "explanation": "This command helps import aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0100",
    "title": "Clone - upgrade files",
    "description": "Command to upgrade files in Git clone",
    "category": "Clone",
    "goal": "Upgrade files",
    "commands": [
      "git clone --upgrade-files"
    ],
    "explanation": "This command helps upgrade files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0101",
    "title": "Config - export ignore patterns",
    "description": "Command to export ignore patterns in Git config",
    "category": "Config",
    "goal": "Export ignore patterns",
    "commands": [
      "git config --export-ignore-patterns"
    ],
    "explanation": "This command helps export ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0102",
    "title": "Merge - export attributes",
    "description": "Command to export attributes in Git merge",
    "category": "Merge",
    "goal": "Export attributes",
    "commands": [
      "git merge --export-attributes"
    ],
    "explanation": "This command helps export attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0103",
    "title": "Bisect - merge stashes",
    "description": "Command to merge stashes in Git bisect",
    "category": "Bisect",
    "goal": "Merge stashes",
    "commands": [
      "git bisect --merge-stashes"
    ],
    "explanation": "This command helps merge stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0104",
    "title": "Rebase - split remotes",
    "description": "Command to split remotes in Git rebase",
    "category": "Rebase",
    "goal": "Split remotes",
    "commands": [
      "git rebase --split-remotes"
    ],
    "explanation": "This command helps split remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0105",
    "title": "Reflog - optimize remotes",
    "description": "Command to optimize remotes in Git reflog",
    "category": "Reflog",
    "goal": "Optimize remotes",
    "commands": [
      "git reflog --optimize-remotes"
    ],
    "explanation": "This command helps optimize remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0106",
    "title": "Merge - export submodules",
    "description": "Command to export submodules in Git merge",
    "category": "Merge",
    "goal": "Export submodules",
    "commands": [
      "git merge --export-submodules"
    ],
    "explanation": "This command helps export submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0107",
    "title": "Cherry Pick - restore archives",
    "description": "Command to restore archives in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Restore archives",
    "commands": [
      "git cherry --restore-archives"
    ],
    "explanation": "This command helps restore archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0108",
    "title": "Remote - sync objects",
    "description": "Command to sync objects in Git remote",
    "category": "Remote",
    "goal": "Sync objects",
    "commands": [
      "git remote --sync-objects"
    ],
    "explanation": "This command helps sync objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0109",
    "title": "Reset - export archives",
    "description": "Command to export archives in Git reset",
    "category": "Reset",
    "goal": "Export archives",
    "commands": [
      "git reset --export-archives"
    ],
    "explanation": "This command helps export archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0110",
    "title": "Worktree - split config",
    "description": "Command to split config in Git worktree",
    "category": "Worktree",
    "goal": "Split config",
    "commands": [
      "git worktree --split-config"
    ],
    "explanation": "This command helps split config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0111",
    "title": "Stash - merge ignore patterns",
    "description": "Command to merge ignore patterns in Git stash",
    "category": "Stash",
    "goal": "Merge ignore patterns",
    "commands": [
      "git stash --merge-ignore-patterns"
    ],
    "explanation": "This command helps merge ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0112",
    "title": "Recovery - clean reflog",
    "description": "Command to clean reflog in Git recovery",
    "category": "Recovery",
    "goal": "Clean reflog",
    "commands": [
      "git recovery --clean-reflog"
    ],
    "explanation": "This command helps clean reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0113",
    "title": "Tag - configure credentials",
    "description": "Command to configure credentials in Git tag",
    "category": "Tag",
    "goal": "Configure credentials",
    "commands": [
      "git tag --configure-credentials"
    ],
    "explanation": "This command helps configure credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0114",
    "title": "Push - clean tags",
    "description": "Command to clean tags in Git push",
    "category": "Push",
    "goal": "Clean tags",
    "commands": [
      "git push --clean-tags"
    ],
    "explanation": "This command helps clean tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0115",
    "title": "Submodule - restore submodules",
    "description": "Command to restore submodules in Git submodule",
    "category": "Submodule",
    "goal": "Restore submodules",
    "commands": [
      "git submodule --restore-submodules"
    ],
    "explanation": "This command helps restore submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0116",
    "title": "Cherry Pick - reset submodules",
    "description": "Command to reset submodules in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Reset submodules",
    "commands": [
      "git cherry --reset-submodules"
    ],
    "explanation": "This command helps reset submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0117",
    "title": "Config - sync branches",
    "description": "Command to sync branches in Git config",
    "category": "Config",
    "goal": "Sync branches",
    "commands": [
      "git config --sync-branches"
    ],
    "explanation": "This command helps sync branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0118",
    "title": "Branch - audit notes",
    "description": "Command to audit notes in Git branch",
    "category": "Branch",
    "goal": "Audit notes",
    "commands": [
      "git branch --audit-notes"
    ],
    "explanation": "This command helps audit notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0119",
    "title": "Tag - sync aliases",
    "description": "Command to sync aliases in Git tag",
    "category": "Tag",
    "goal": "Sync aliases",
    "commands": [
      "git tag --sync-aliases"
    ],
    "explanation": "This command helps sync aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0120",
    "title": "Cherry Pick - backup ignore patterns",
    "description": "Command to backup ignore patterns in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Backup ignore patterns",
    "commands": [
      "git cherry --backup-ignore-patterns"
    ],
    "explanation": "This command helps backup ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0121",
    "title": "Recovery - scan submodules",
    "description": "Command to scan submodules in Git recovery",
    "category": "Recovery",
    "goal": "Scan submodules",
    "commands": [
      "git recovery --scan-submodules"
    ],
    "explanation": "This command helps scan submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0122",
    "title": "Recovery - clean stashes",
    "description": "Command to clean stashes in Git recovery",
    "category": "Recovery",
    "goal": "Clean stashes",
    "commands": [
      "git recovery --clean-stashes"
    ],
    "explanation": "This command helps clean stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0123",
    "title": "Submodule - manage notes",
    "description": "Command to manage notes in Git submodule",
    "category": "Submodule",
    "goal": "Manage notes",
    "commands": [
      "git submodule --manage-notes"
    ],
    "explanation": "This command helps manage notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0124",
    "title": "Setup - migrate ignore patterns",
    "description": "Command to migrate ignore patterns in Git setup",
    "category": "Setup",
    "goal": "Migrate ignore patterns",
    "commands": [
      "git setup --migrate-ignore-patterns"
    ],
    "explanation": "This command helps migrate ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git setup --help"
    ]
  },
  {
    "id": "CMD-0125",
    "title": "Rebase - manage credentials",
    "description": "Command to manage credentials in Git rebase",
    "category": "Rebase",
    "goal": "Manage credentials",
    "commands": [
      "git rebase --manage-credentials"
    ],
    "explanation": "This command helps manage credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0126",
    "title": "Stash - verify ignore patterns",
    "description": "Command to verify ignore patterns in Git stash",
    "category": "Stash",
    "goal": "Verify ignore patterns",
    "commands": [
      "git stash --verify-ignore-patterns"
    ],
    "explanation": "This command helps verify ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0127",
    "title": "Archive - scan attributes",
    "description": "Command to scan attributes in Git archive",
    "category": "Archive",
    "goal": "Scan attributes",
    "commands": [
      "git archive --scan-attributes"
    ],
    "explanation": "This command helps scan attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0128",
    "title": "Stash - reset hooks",
    "description": "Command to reset hooks in Git stash",
    "category": "Stash",
    "goal": "Reset hooks",
    "commands": [
      "git stash --reset-hooks"
    ],
    "explanation": "This command helps reset hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0129",
    "title": "Hook - split aliases",
    "description": "Command to split aliases in Git hook",
    "category": "Hook",
    "goal": "Split aliases",
    "commands": [
      "git hook --split-aliases"
    ],
    "explanation": "This command helps split aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0130",
    "title": "Clone - clean patches",
    "description": "Command to clean patches in Git clone",
    "category": "Clone",
    "goal": "Clean patches",
    "commands": [
      "git clone --clean-patches"
    ],
    "explanation": "This command helps clean patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0131",
    "title": "Remote - export credentials",
    "description": "Command to export credentials in Git remote",
    "category": "Remote",
    "goal": "Export credentials",
    "commands": [
      "git remote --export-credentials"
    ],
    "explanation": "This command helps export credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0132",
    "title": "Stash - migrate notes",
    "description": "Command to migrate notes in Git stash",
    "category": "Stash",
    "goal": "Migrate notes",
    "commands": [
      "git stash --migrate-notes"
    ],
    "explanation": "This command helps migrate notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0133",
    "title": "Bisect - merge reflog",
    "description": "Command to merge reflog in Git bisect",
    "category": "Bisect",
    "goal": "Merge reflog",
    "commands": [
      "git bisect --merge-reflog"
    ],
    "explanation": "This command helps merge reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0134",
    "title": "Reflog - export submodules",
    "description": "Command to export submodules in Git reflog",
    "category": "Reflog",
    "goal": "Export submodules",
    "commands": [
      "git reflog --export-submodules"
    ],
    "explanation": "This command helps export submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0135",
    "title": "Cherry Pick - import credentials",
    "description": "Command to import credentials in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Import credentials",
    "commands": [
      "git cherry --import-credentials"
    ],
    "explanation": "This command helps import credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0136",
    "title": "Blame - export reflog",
    "description": "Command to export reflog in Git blame",
    "category": "Blame",
    "goal": "Export reflog",
    "commands": [
      "git blame --export-reflog"
    ],
    "explanation": "This command helps export reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0137",
    "title": "Revert - optimize archives",
    "description": "Command to optimize archives in Git revert",
    "category": "Revert",
    "goal": "Optimize archives",
    "commands": [
      "git revert --optimize-archives"
    ],
    "explanation": "This command helps optimize archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0138",
    "title": "Setup - configure files",
    "description": "Command to configure files in Git setup",
    "category": "Setup",
    "goal": "Configure files",
    "commands": [
      "git setup --configure-files"
    ],
    "explanation": "This command helps configure files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git setup --help"
    ]
  },
  {
    "id": "CMD-0139",
    "title": "Cherry Pick - update objects",
    "description": "Command to update objects in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Update objects",
    "commands": [
      "git cherry --update-objects"
    ],
    "explanation": "This command helps update objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0140",
    "title": "Rebase - upgrade stashes",
    "description": "Command to upgrade stashes in Git rebase",
    "category": "Rebase",
    "goal": "Upgrade stashes",
    "commands": [
      "git rebase --upgrade-stashes"
    ],
    "explanation": "This command helps upgrade stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0141",
    "title": "Push - split objects",
    "description": "Command to split objects in Git push",
    "category": "Push",
    "goal": "Split objects",
    "commands": [
      "git push --split-objects"
    ],
    "explanation": "This command helps split objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0142",
    "title": "Merge - optimize ignore patterns",
    "description": "Command to optimize ignore patterns in Git merge",
    "category": "Merge",
    "goal": "Optimize ignore patterns",
    "commands": [
      "git merge --optimize-ignore-patterns"
    ],
    "explanation": "This command helps optimize ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0143",
    "title": "Hook - configure commits",
    "description": "Command to configure commits in Git hook",
    "category": "Hook",
    "goal": "Configure commits",
    "commands": [
      "git hook --configure-commits"
    ],
    "explanation": "This command helps configure commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0144",
    "title": "Recovery - backup aliases",
    "description": "Command to backup aliases in Git recovery",
    "category": "Recovery",
    "goal": "Backup aliases",
    "commands": [
      "git recovery --backup-aliases"
    ],
    "explanation": "This command helps backup aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0145",
    "title": "Diff - track reflog",
    "description": "Command to track reflog in Git diff",
    "category": "Diff",
    "goal": "Track reflog",
    "commands": [
      "git diff --track-reflog"
    ],
    "explanation": "This command helps track reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0146",
    "title": "Push - split aliases",
    "description": "Command to split aliases in Git push",
    "category": "Push",
    "goal": "Split aliases",
    "commands": [
      "git push --split-aliases"
    ],
    "explanation": "This command helps split aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0147",
    "title": "Stash - merge archives",
    "description": "Command to merge archives in Git stash",
    "category": "Stash",
    "goal": "Merge archives",
    "commands": [
      "git stash --merge-archives"
    ],
    "explanation": "This command helps merge archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0148",
    "title": "Pull - scan branches",
    "description": "Command to scan branches in Git pull",
    "category": "Pull",
    "goal": "Scan branches",
    "commands": [
      "git pull --scan-branches"
    ],
    "explanation": "This command helps scan branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0149",
    "title": "Cherry Pick - validate branches",
    "description": "Command to validate branches in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Validate branches",
    "commands": [
      "git cherry --validate-branches"
    ],
    "explanation": "This command helps validate branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0150",
    "title": "Worktree - merge remotes",
    "description": "Command to merge remotes in Git worktree",
    "category": "Worktree",
    "goal": "Merge remotes",
    "commands": [
      "git worktree --merge-remotes"
    ],
    "explanation": "This command helps merge remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0151",
    "title": "Diff - import branches",
    "description": "Command to import branches in Git diff",
    "category": "Diff",
    "goal": "Import branches",
    "commands": [
      "git diff --import-branches"
    ],
    "explanation": "This command helps import branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0152",
    "title": "Config - update stashes",
    "description": "Command to update stashes in Git config",
    "category": "Config",
    "goal": "Update stashes",
    "commands": [
      "git config --update-stashes"
    ],
    "explanation": "This command helps update stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0153",
    "title": "Revert - optimize stashes",
    "description": "Command to optimize stashes in Git revert",
    "category": "Revert",
    "goal": "Optimize stashes",
    "commands": [
      "git revert --optimize-stashes"
    ],
    "explanation": "This command helps optimize stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0154",
    "title": "Archive - optimize attributes",
    "description": "Command to optimize attributes in Git archive",
    "category": "Archive",
    "goal": "Optimize attributes",
    "commands": [
      "git archive --optimize-attributes"
    ],
    "explanation": "This command helps optimize attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0155",
    "title": "Reflog - manage branches",
    "description": "Command to manage branches in Git reflog",
    "category": "Reflog",
    "goal": "Manage branches",
    "commands": [
      "git reflog --manage-branches"
    ],
    "explanation": "This command helps manage branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0156",
    "title": "Pull - verify attributes",
    "description": "Command to verify attributes in Git pull",
    "category": "Pull",
    "goal": "Verify attributes",
    "commands": [
      "git pull --verify-attributes"
    ],
    "explanation": "This command helps verify attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0157",
    "title": "Log - sync reflog",
    "description": "Command to sync reflog in Git log",
    "category": "Log",
    "goal": "Sync reflog",
    "commands": [
      "git log --sync-reflog"
    ],
    "explanation": "This command helps sync reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0158",
    "title": "Tag - clean stashes",
    "description": "Command to clean stashes in Git tag",
    "category": "Tag",
    "goal": "Clean stashes",
    "commands": [
      "git tag --clean-stashes"
    ],
    "explanation": "This command helps clean stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0159",
    "title": "Reset - backup archives",
    "description": "Command to backup archives in Git reset",
    "category": "Reset",
    "goal": "Backup archives",
    "commands": [
      "git reset --backup-archives"
    ],
    "explanation": "This command helps backup archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0160",
    "title": "Config - export hooks",
    "description": "Command to export hooks in Git config",
    "category": "Config",
    "goal": "Export hooks",
    "commands": [
      "git config --export-hooks"
    ],
    "explanation": "This command helps export hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0161",
    "title": "Pull - audit reflog",
    "description": "Command to audit reflog in Git pull",
    "category": "Pull",
    "goal": "Audit reflog",
    "commands": [
      "git pull --audit-reflog"
    ],
    "explanation": "This command helps audit reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0162",
    "title": "Remote - import config",
    "description": "Command to import config in Git remote",
    "category": "Remote",
    "goal": "Import config",
    "commands": [
      "git remote --import-config"
    ],
    "explanation": "This command helps import config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0163",
    "title": "Setup - merge ignore patterns",
    "description": "Command to merge ignore patterns in Git setup",
    "category": "Setup",
    "goal": "Merge ignore patterns",
    "commands": [
      "git setup --merge-ignore-patterns"
    ],
    "explanation": "This command helps merge ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git setup --help"
    ]
  },
  {
    "id": "CMD-0164",
    "title": "Setup - reset reflog",
    "description": "Command to reset reflog in Git setup",
    "category": "Setup",
    "goal": "Reset reflog",
    "commands": [
      "git setup --reset-reflog"
    ],
    "explanation": "This command helps reset reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git setup --help"
    ]
  },
  {
    "id": "CMD-0165",
    "title": "Diff - reset worktrees",
    "description": "Command to reset worktrees in Git diff",
    "category": "Diff",
    "goal": "Reset worktrees",
    "commands": [
      "git diff --reset-worktrees"
    ],
    "explanation": "This command helps reset worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0166",
    "title": "Hook - scan stashes",
    "description": "Command to scan stashes in Git hook",
    "category": "Hook",
    "goal": "Scan stashes",
    "commands": [
      "git hook --scan-stashes"
    ],
    "explanation": "This command helps scan stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0167",
    "title": "Log - upgrade submodules",
    "description": "Command to upgrade submodules in Git log",
    "category": "Log",
    "goal": "Upgrade submodules",
    "commands": [
      "git log --upgrade-submodules"
    ],
    "explanation": "This command helps upgrade submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0168",
    "title": "Stash - upgrade patches",
    "description": "Command to upgrade patches in Git stash",
    "category": "Stash",
    "goal": "Upgrade patches",
    "commands": [
      "git stash --upgrade-patches"
    ],
    "explanation": "This command helps upgrade patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0169",
    "title": "Cherry Pick - scan notes",
    "description": "Command to scan notes in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Scan notes",
    "commands": [
      "git cherry --scan-notes"
    ],
    "explanation": "This command helps scan notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0170",
    "title": "Stash - validate attributes",
    "description": "Command to validate attributes in Git stash",
    "category": "Stash",
    "goal": "Validate attributes",
    "commands": [
      "git stash --validate-attributes"
    ],
    "explanation": "This command helps validate attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0171",
    "title": "Revert - update archives",
    "description": "Command to update archives in Git revert",
    "category": "Revert",
    "goal": "Update archives",
    "commands": [
      "git revert --update-archives"
    ],
    "explanation": "This command helps update archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0172",
    "title": "Tag - backup config",
    "description": "Command to backup config in Git tag",
    "category": "Tag",
    "goal": "Backup config",
    "commands": [
      "git tag --backup-config"
    ],
    "explanation": "This command helps backup config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0173",
    "title": "Config - export archives",
    "description": "Command to export archives in Git config",
    "category": "Config",
    "goal": "Export archives",
    "commands": [
      "git config --export-archives"
    ],
    "explanation": "This command helps export archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0174",
    "title": "Revert - migrate notes",
    "description": "Command to migrate notes in Git revert",
    "category": "Revert",
    "goal": "Migrate notes",
    "commands": [
      "git revert --migrate-notes"
    ],
    "explanation": "This command helps migrate notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0175",
    "title": "Log - clean branches",
    "description": "Command to clean branches in Git log",
    "category": "Log",
    "goal": "Clean branches",
    "commands": [
      "git log --clean-branches"
    ],
    "explanation": "This command helps clean branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0176",
    "title": "Revert - reset reflog",
    "description": "Command to reset reflog in Git revert",
    "category": "Revert",
    "goal": "Reset reflog",
    "commands": [
      "git revert --reset-reflog"
    ],
    "explanation": "This command helps reset reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0177",
    "title": "Log - reset branches",
    "description": "Command to reset branches in Git log",
    "category": "Log",
    "goal": "Reset branches",
    "commands": [
      "git log --reset-branches"
    ],
    "explanation": "This command helps reset branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0178",
    "title": "Hook - clean credentials",
    "description": "Command to clean credentials in Git hook",
    "category": "Hook",
    "goal": "Clean credentials",
    "commands": [
      "git hook --clean-credentials"
    ],
    "explanation": "This command helps clean credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0179",
    "title": "Archive - sync attributes",
    "description": "Command to sync attributes in Git archive",
    "category": "Archive",
    "goal": "Sync attributes",
    "commands": [
      "git archive --sync-attributes"
    ],
    "explanation": "This command helps sync attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0180",
    "title": "Cherry Pick - upgrade notes",
    "description": "Command to upgrade notes in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Upgrade notes",
    "commands": [
      "git cherry --upgrade-notes"
    ],
    "explanation": "This command helps upgrade notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0181",
    "title": "Diff - manage hooks",
    "description": "Command to manage hooks in Git diff",
    "category": "Diff",
    "goal": "Manage hooks",
    "commands": [
      "git diff --manage-hooks"
    ],
    "explanation": "This command helps manage hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0182",
    "title": "Worktree - validate reflog",
    "description": "Command to validate reflog in Git worktree",
    "category": "Worktree",
    "goal": "Validate reflog",
    "commands": [
      "git worktree --validate-reflog"
    ],
    "explanation": "This command helps validate reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0183",
    "title": "Merge - import hooks",
    "description": "Command to import hooks in Git merge",
    "category": "Merge",
    "goal": "Import hooks",
    "commands": [
      "git merge --import-hooks"
    ],
    "explanation": "This command helps import hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0184",
    "title": "Push - sync objects",
    "description": "Command to sync objects in Git push",
    "category": "Push",
    "goal": "Sync objects",
    "commands": [
      "git push --sync-objects"
    ],
    "explanation": "This command helps sync objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0185",
    "title": "Recovery - merge tags",
    "description": "Command to merge tags in Git recovery",
    "category": "Recovery",
    "goal": "Merge tags",
    "commands": [
      "git recovery --merge-tags"
    ],
    "explanation": "This command helps merge tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0186",
    "title": "Remote - clean stashes",
    "description": "Command to clean stashes in Git remote",
    "category": "Remote",
    "goal": "Clean stashes",
    "commands": [
      "git remote --clean-stashes"
    ],
    "explanation": "This command helps clean stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0187",
    "title": "Recovery - import tags",
    "description": "Command to import tags in Git recovery",
    "category": "Recovery",
    "goal": "Import tags",
    "commands": [
      "git recovery --import-tags"
    ],
    "explanation": "This command helps import tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0188",
    "title": "Revert - configure patches",
    "description": "Command to configure patches in Git revert",
    "category": "Revert",
    "goal": "Configure patches",
    "commands": [
      "git revert --configure-patches"
    ],
    "explanation": "This command helps configure patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0189",
    "title": "Clone - configure worktrees",
    "description": "Command to configure worktrees in Git clone",
    "category": "Clone",
    "goal": "Configure worktrees",
    "commands": [
      "git clone --configure-worktrees"
    ],
    "explanation": "This command helps configure worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0190",
    "title": "Blame - restore aliases",
    "description": "Command to restore aliases in Git blame",
    "category": "Blame",
    "goal": "Restore aliases",
    "commands": [
      "git blame --restore-aliases"
    ],
    "explanation": "This command helps restore aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0191",
    "title": "Rebase - sync credentials",
    "description": "Command to sync credentials in Git rebase",
    "category": "Rebase",
    "goal": "Sync credentials",
    "commands": [
      "git rebase --sync-credentials"
    ],
    "explanation": "This command helps sync credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0192",
    "title": "Archive - reset worktrees",
    "description": "Command to reset worktrees in Git archive",
    "category": "Archive",
    "goal": "Reset worktrees",
    "commands": [
      "git archive --reset-worktrees"
    ],
    "explanation": "This command helps reset worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0193",
    "title": "Tag - manage stashes",
    "description": "Command to manage stashes in Git tag",
    "category": "Tag",
    "goal": "Manage stashes",
    "commands": [
      "git tag --manage-stashes"
    ],
    "explanation": "This command helps manage stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0194",
    "title": "Diff - sync tags",
    "description": "Command to sync tags in Git diff",
    "category": "Diff",
    "goal": "Sync tags",
    "commands": [
      "git diff --sync-tags"
    ],
    "explanation": "This command helps sync tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0195",
    "title": "Blame - validate index",
    "description": "Command to validate index in Git blame",
    "category": "Blame",
    "goal": "Validate index",
    "commands": [
      "git blame --validate-index"
    ],
    "explanation": "This command helps validate index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0196",
    "title": "Log - migrate attributes",
    "description": "Command to migrate attributes in Git log",
    "category": "Log",
    "goal": "Migrate attributes",
    "commands": [
      "git log --migrate-attributes"
    ],
    "explanation": "This command helps migrate attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0197",
    "title": "Log - manage index",
    "description": "Command to manage index in Git log",
    "category": "Log",
    "goal": "Manage index",
    "commands": [
      "git log --manage-index"
    ],
    "explanation": "This command helps manage index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0198",
    "title": "Revert - track submodules",
    "description": "Command to track submodules in Git revert",
    "category": "Revert",
    "goal": "Track submodules",
    "commands": [
      "git revert --track-submodules"
    ],
    "explanation": "This command helps track submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0199",
    "title": "Reset - configure index",
    "description": "Command to configure index in Git reset",
    "category": "Reset",
    "goal": "Configure index",
    "commands": [
      "git reset --configure-index"
    ],
    "explanation": "This command helps configure index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0200",
    "title": "Blame - backup hooks",
    "description": "Command to backup hooks in Git blame",
    "category": "Blame",
    "goal": "Backup hooks",
    "commands": [
      "git blame --backup-hooks"
    ],
    "explanation": "This command helps backup hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0201",
    "title": "Worktree - backup stashes",
    "description": "Command to backup stashes in Git worktree",
    "category": "Worktree",
    "goal": "Backup stashes",
    "commands": [
      "git worktree --backup-stashes"
    ],
    "explanation": "This command helps backup stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0202",
    "title": "Rebase - track aliases",
    "description": "Command to track aliases in Git rebase",
    "category": "Rebase",
    "goal": "Track aliases",
    "commands": [
      "git rebase --track-aliases"
    ],
    "explanation": "This command helps track aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0203",
    "title": "Hook - track objects",
    "description": "Command to track objects in Git hook",
    "category": "Hook",
    "goal": "Track objects",
    "commands": [
      "git hook --track-objects"
    ],
    "explanation": "This command helps track objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0204",
    "title": "Clone - validate branches",
    "description": "Command to validate branches in Git clone",
    "category": "Clone",
    "goal": "Validate branches",
    "commands": [
      "git clone --validate-branches"
    ],
    "explanation": "This command helps validate branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0205",
    "title": "Tag - split objects",
    "description": "Command to split objects in Git tag",
    "category": "Tag",
    "goal": "Split objects",
    "commands": [
      "git tag --split-objects"
    ],
    "explanation": "This command helps split objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0206",
    "title": "Worktree - scan stashes",
    "description": "Command to scan stashes in Git worktree",
    "category": "Worktree",
    "goal": "Scan stashes",
    "commands": [
      "git worktree --scan-stashes"
    ],
    "explanation": "This command helps scan stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0207",
    "title": "Config - export index",
    "description": "Command to export index in Git config",
    "category": "Config",
    "goal": "Export index",
    "commands": [
      "git config --export-index"
    ],
    "explanation": "This command helps export index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0208",
    "title": "Bisect - restore remotes",
    "description": "Command to restore remotes in Git bisect",
    "category": "Bisect",
    "goal": "Restore remotes",
    "commands": [
      "git bisect --restore-remotes"
    ],
    "explanation": "This command helps restore remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0209",
    "title": "Push - track notes",
    "description": "Command to track notes in Git push",
    "category": "Push",
    "goal": "Track notes",
    "commands": [
      "git push --track-notes"
    ],
    "explanation": "This command helps track notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0210",
    "title": "Tag - reset remotes",
    "description": "Command to reset remotes in Git tag",
    "category": "Tag",
    "goal": "Reset remotes",
    "commands": [
      "git tag --reset-remotes"
    ],
    "explanation": "This command helps reset remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0211",
    "title": "Revert - merge objects",
    "description": "Command to merge objects in Git revert",
    "category": "Revert",
    "goal": "Merge objects",
    "commands": [
      "git revert --merge-objects"
    ],
    "explanation": "This command helps merge objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0212",
    "title": "Bisect - reset hooks",
    "description": "Command to reset hooks in Git bisect",
    "category": "Bisect",
    "goal": "Reset hooks",
    "commands": [
      "git bisect --reset-hooks"
    ],
    "explanation": "This command helps reset hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0213",
    "title": "Hook - manage ignore patterns",
    "description": "Command to manage ignore patterns in Git hook",
    "category": "Hook",
    "goal": "Manage ignore patterns",
    "commands": [
      "git hook --manage-ignore-patterns"
    ],
    "explanation": "This command helps manage ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0214",
    "title": "Setup - verify patches",
    "description": "Command to verify patches in Git setup",
    "category": "Setup",
    "goal": "Verify patches",
    "commands": [
      "git setup --verify-patches"
    ],
    "explanation": "This command helps verify patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git setup --help"
    ]
  },
  {
    "id": "CMD-0215",
    "title": "Rebase - configure files",
    "description": "Command to configure files in Git rebase",
    "category": "Rebase",
    "goal": "Configure files",
    "commands": [
      "git rebase --configure-files"
    ],
    "explanation": "This command helps configure files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0216",
    "title": "Clone - import aliases",
    "description": "Command to import aliases in Git clone",
    "category": "Clone",
    "goal": "Import aliases",
    "commands": [
      "git clone --import-aliases"
    ],
    "explanation": "This command helps import aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0217",
    "title": "Hook - validate config",
    "description": "Command to validate config in Git hook",
    "category": "Hook",
    "goal": "Validate config",
    "commands": [
      "git hook --validate-config"
    ],
    "explanation": "This command helps validate config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0218",
    "title": "Diff - merge objects",
    "description": "Command to merge objects in Git diff",
    "category": "Diff",
    "goal": "Merge objects",
    "commands": [
      "git diff --merge-objects"
    ],
    "explanation": "This command helps merge objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0219",
    "title": "Recovery - merge tags",
    "description": "Command to merge tags in Git recovery",
    "category": "Recovery",
    "goal": "Merge tags",
    "commands": [
      "git recovery --merge-tags"
    ],
    "explanation": "This command helps merge tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0220",
    "title": "Archive - split patches",
    "description": "Command to split patches in Git archive",
    "category": "Archive",
    "goal": "Split patches",
    "commands": [
      "git archive --split-patches"
    ],
    "explanation": "This command helps split patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0221",
    "title": "Submodule - sync worktrees",
    "description": "Command to sync worktrees in Git submodule",
    "category": "Submodule",
    "goal": "Sync worktrees",
    "commands": [
      "git submodule --sync-worktrees"
    ],
    "explanation": "This command helps sync worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0222",
    "title": "Cherry Pick - migrate attributes",
    "description": "Command to migrate attributes in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Migrate attributes",
    "commands": [
      "git cherry --migrate-attributes"
    ],
    "explanation": "This command helps migrate attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0223",
    "title": "Push - configure hooks",
    "description": "Command to configure hooks in Git push",
    "category": "Push",
    "goal": "Configure hooks",
    "commands": [
      "git push --configure-hooks"
    ],
    "explanation": "This command helps configure hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0224",
    "title": "Diff - sync submodules",
    "description": "Command to sync submodules in Git diff",
    "category": "Diff",
    "goal": "Sync submodules",
    "commands": [
      "git diff --sync-submodules"
    ],
    "explanation": "This command helps sync submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0225",
    "title": "Tag - import ignore patterns",
    "description": "Command to import ignore patterns in Git tag",
    "category": "Tag",
    "goal": "Import ignore patterns",
    "commands": [
      "git tag --import-ignore-patterns"
    ],
    "explanation": "This command helps import ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0226",
    "title": "Archive - reset branches",
    "description": "Command to reset branches in Git archive",
    "category": "Archive",
    "goal": "Reset branches",
    "commands": [
      "git archive --reset-branches"
    ],
    "explanation": "This command helps reset branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0227",
    "title": "Branch - configure remotes",
    "description": "Command to configure remotes in Git branch",
    "category": "Branch",
    "goal": "Configure remotes",
    "commands": [
      "git branch --configure-remotes"
    ],
    "explanation": "This command helps configure remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0228",
    "title": "Bisect - track worktrees",
    "description": "Command to track worktrees in Git bisect",
    "category": "Bisect",
    "goal": "Track worktrees",
    "commands": [
      "git bisect --track-worktrees"
    ],
    "explanation": "This command helps track worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0229",
    "title": "Submodule - backup remotes",
    "description": "Command to backup remotes in Git submodule",
    "category": "Submodule",
    "goal": "Backup remotes",
    "commands": [
      "git submodule --backup-remotes"
    ],
    "explanation": "This command helps backup remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0230",
    "title": "Submodule - validate patches",
    "description": "Command to validate patches in Git submodule",
    "category": "Submodule",
    "goal": "Validate patches",
    "commands": [
      "git submodule --validate-patches"
    ],
    "explanation": "This command helps validate patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0231",
    "title": "Bisect - backup files",
    "description": "Command to backup files in Git bisect",
    "category": "Bisect",
    "goal": "Backup files",
    "commands": [
      "git bisect --backup-files"
    ],
    "explanation": "This command helps backup files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0232",
    "title": "Rebase - import stashes",
    "description": "Command to import stashes in Git rebase",
    "category": "Rebase",
    "goal": "Import stashes",
    "commands": [
      "git rebase --import-stashes"
    ],
    "explanation": "This command helps import stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0233",
    "title": "Hook - reset patches",
    "description": "Command to reset patches in Git hook",
    "category": "Hook",
    "goal": "Reset patches",
    "commands": [
      "git hook --reset-patches"
    ],
    "explanation": "This command helps reset patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0234",
    "title": "Push - reset credentials",
    "description": "Command to reset credentials in Git push",
    "category": "Push",
    "goal": "Reset credentials",
    "commands": [
      "git push --reset-credentials"
    ],
    "explanation": "This command helps reset credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0235",
    "title": "Tag - reset objects",
    "description": "Command to reset objects in Git tag",
    "category": "Tag",
    "goal": "Reset objects",
    "commands": [
      "git tag --reset-objects"
    ],
    "explanation": "This command helps reset objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0236",
    "title": "Bisect - export config",
    "description": "Command to export config in Git bisect",
    "category": "Bisect",
    "goal": "Export config",
    "commands": [
      "git bisect --export-config"
    ],
    "explanation": "This command helps export config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0237",
    "title": "Log - clean attributes",
    "description": "Command to clean attributes in Git log",
    "category": "Log",
    "goal": "Clean attributes",
    "commands": [
      "git log --clean-attributes"
    ],
    "explanation": "This command helps clean attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0238",
    "title": "Hook - configure submodules",
    "description": "Command to configure submodules in Git hook",
    "category": "Hook",
    "goal": "Configure submodules",
    "commands": [
      "git hook --configure-submodules"
    ],
    "explanation": "This command helps configure submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0239",
    "title": "Diff - manage worktrees",
    "description": "Command to manage worktrees in Git diff",
    "category": "Diff",
    "goal": "Manage worktrees",
    "commands": [
      "git diff --manage-worktrees"
    ],
    "explanation": "This command helps manage worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0240",
    "title": "Remote - validate worktrees",
    "description": "Command to validate worktrees in Git remote",
    "category": "Remote",
    "goal": "Validate worktrees",
    "commands": [
      "git remote --validate-worktrees"
    ],
    "explanation": "This command helps validate worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0241",
    "title": "Stash - update worktrees",
    "description": "Command to update worktrees in Git stash",
    "category": "Stash",
    "goal": "Update worktrees",
    "commands": [
      "git stash --update-worktrees"
    ],
    "explanation": "This command helps update worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0242",
    "title": "Reset - manage branches",
    "description": "Command to manage branches in Git reset",
    "category": "Reset",
    "goal": "Manage branches",
    "commands": [
      "git reset --manage-branches"
    ],
    "explanation": "This command helps manage branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0243",
    "title": "Clone - configure commits",
    "description": "Command to configure commits in Git clone",
    "category": "Clone",
    "goal": "Configure commits",
    "commands": [
      "git clone --configure-commits"
    ],
    "explanation": "This command helps configure commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0244",
    "title": "Cherry Pick - migrate branches",
    "description": "Command to migrate branches in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Migrate branches",
    "commands": [
      "git cherry --migrate-branches"
    ],
    "explanation": "This command helps migrate branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0245",
    "title": "Config - validate config",
    "description": "Command to validate config in Git config",
    "category": "Config",
    "goal": "Validate config",
    "commands": [
      "git config --validate-config"
    ],
    "explanation": "This command helps validate config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0246",
    "title": "Stash - clean remotes",
    "description": "Command to clean remotes in Git stash",
    "category": "Stash",
    "goal": "Clean remotes",
    "commands": [
      "git stash --clean-remotes"
    ],
    "explanation": "This command helps clean remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0247",
    "title": "Recovery - split patches",
    "description": "Command to split patches in Git recovery",
    "category": "Recovery",
    "goal": "Split patches",
    "commands": [
      "git recovery --split-patches"
    ],
    "explanation": "This command helps split patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0248",
    "title": "Revert - backup reflog",
    "description": "Command to backup reflog in Git revert",
    "category": "Revert",
    "goal": "Backup reflog",
    "commands": [
      "git revert --backup-reflog"
    ],
    "explanation": "This command helps backup reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0249",
    "title": "Recovery - split notes",
    "description": "Command to split notes in Git recovery",
    "category": "Recovery",
    "goal": "Split notes",
    "commands": [
      "git recovery --split-notes"
    ],
    "explanation": "This command helps split notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0250",
    "title": "Worktree - verify aliases",
    "description": "Command to verify aliases in Git worktree",
    "category": "Worktree",
    "goal": "Verify aliases",
    "commands": [
      "git worktree --verify-aliases"
    ],
    "explanation": "This command helps verify aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0251",
    "title": "Hook - audit tags",
    "description": "Command to audit tags in Git hook",
    "category": "Hook",
    "goal": "Audit tags",
    "commands": [
      "git hook --audit-tags"
    ],
    "explanation": "This command helps audit tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0252",
    "title": "Push - migrate patches",
    "description": "Command to migrate patches in Git push",
    "category": "Push",
    "goal": "Migrate patches",
    "commands": [
      "git push --migrate-patches"
    ],
    "explanation": "This command helps migrate patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0253",
    "title": "Reflog - split remotes",
    "description": "Command to split remotes in Git reflog",
    "category": "Reflog",
    "goal": "Split remotes",
    "commands": [
      "git reflog --split-remotes"
    ],
    "explanation": "This command helps split remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0254",
    "title": "Push - merge tags",
    "description": "Command to merge tags in Git push",
    "category": "Push",
    "goal": "Merge tags",
    "commands": [
      "git push --merge-tags"
    ],
    "explanation": "This command helps merge tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0255",
    "title": "Cherry Pick - export archives",
    "description": "Command to export archives in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Export archives",
    "commands": [
      "git cherry --export-archives"
    ],
    "explanation": "This command helps export archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0256",
    "title": "Rebase - restore worktrees",
    "description": "Command to restore worktrees in Git rebase",
    "category": "Rebase",
    "goal": "Restore worktrees",
    "commands": [
      "git rebase --restore-worktrees"
    ],
    "explanation": "This command helps restore worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0257",
    "title": "Merge - reset archives",
    "description": "Command to reset archives in Git merge",
    "category": "Merge",
    "goal": "Reset archives",
    "commands": [
      "git merge --reset-archives"
    ],
    "explanation": "This command helps reset archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0258",
    "title": "Tag - optimize archives",
    "description": "Command to optimize archives in Git tag",
    "category": "Tag",
    "goal": "Optimize archives",
    "commands": [
      "git tag --optimize-archives"
    ],
    "explanation": "This command helps optimize archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0259",
    "title": "Blame - merge stashes",
    "description": "Command to merge stashes in Git blame",
    "category": "Blame",
    "goal": "Merge stashes",
    "commands": [
      "git blame --merge-stashes"
    ],
    "explanation": "This command helps merge stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0260",
    "title": "Merge - import worktrees",
    "description": "Command to import worktrees in Git merge",
    "category": "Merge",
    "goal": "Import worktrees",
    "commands": [
      "git merge --import-worktrees"
    ],
    "explanation": "This command helps import worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0261",
    "title": "Pull - track stashes",
    "description": "Command to track stashes in Git pull",
    "category": "Pull",
    "goal": "Track stashes",
    "commands": [
      "git pull --track-stashes"
    ],
    "explanation": "This command helps track stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0262",
    "title": "Revert - reset commits",
    "description": "Command to reset commits in Git revert",
    "category": "Revert",
    "goal": "Reset commits",
    "commands": [
      "git revert --reset-commits"
    ],
    "explanation": "This command helps reset commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0263",
    "title": "Rebase - track patches",
    "description": "Command to track patches in Git rebase",
    "category": "Rebase",
    "goal": "Track patches",
    "commands": [
      "git rebase --track-patches"
    ],
    "explanation": "This command helps track patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0264",
    "title": "Tag - optimize reflog",
    "description": "Command to optimize reflog in Git tag",
    "category": "Tag",
    "goal": "Optimize reflog",
    "commands": [
      "git tag --optimize-reflog"
    ],
    "explanation": "This command helps optimize reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0265",
    "title": "Push - sync files",
    "description": "Command to sync files in Git push",
    "category": "Push",
    "goal": "Sync files",
    "commands": [
      "git push --sync-files"
    ],
    "explanation": "This command helps sync files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0266",
    "title": "Stash - track commits",
    "description": "Command to track commits in Git stash",
    "category": "Stash",
    "goal": "Track commits",
    "commands": [
      "git stash --track-commits"
    ],
    "explanation": "This command helps track commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0267",
    "title": "Stash - scan patches",
    "description": "Command to scan patches in Git stash",
    "category": "Stash",
    "goal": "Scan patches",
    "commands": [
      "git stash --scan-patches"
    ],
    "explanation": "This command helps scan patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0268",
    "title": "Config - backup submodules",
    "description": "Command to backup submodules in Git config",
    "category": "Config",
    "goal": "Backup submodules",
    "commands": [
      "git config --backup-submodules"
    ],
    "explanation": "This command helps backup submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0269",
    "title": "Submodule - configure remotes",
    "description": "Command to configure remotes in Git submodule",
    "category": "Submodule",
    "goal": "Configure remotes",
    "commands": [
      "git submodule --configure-remotes"
    ],
    "explanation": "This command helps configure remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0270",
    "title": "Reset - migrate config",
    "description": "Command to migrate config in Git reset",
    "category": "Reset",
    "goal": "Migrate config",
    "commands": [
      "git reset --migrate-config"
    ],
    "explanation": "This command helps migrate config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0271",
    "title": "Blame - scan attributes",
    "description": "Command to scan attributes in Git blame",
    "category": "Blame",
    "goal": "Scan attributes",
    "commands": [
      "git blame --scan-attributes"
    ],
    "explanation": "This command helps scan attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0272",
    "title": "Reflog - validate ignore patterns",
    "description": "Command to validate ignore patterns in Git reflog",
    "category": "Reflog",
    "goal": "Validate ignore patterns",
    "commands": [
      "git reflog --validate-ignore-patterns"
    ],
    "explanation": "This command helps validate ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0273",
    "title": "Pull - restore worktrees",
    "description": "Command to restore worktrees in Git pull",
    "category": "Pull",
    "goal": "Restore worktrees",
    "commands": [
      "git pull --restore-worktrees"
    ],
    "explanation": "This command helps restore worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0274",
    "title": "Cherry Pick - optimize ignore patterns",
    "description": "Command to optimize ignore patterns in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Optimize ignore patterns",
    "commands": [
      "git cherry --optimize-ignore-patterns"
    ],
    "explanation": "This command helps optimize ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0275",
    "title": "Merge - upgrade submodules",
    "description": "Command to upgrade submodules in Git merge",
    "category": "Merge",
    "goal": "Upgrade submodules",
    "commands": [
      "git merge --upgrade-submodules"
    ],
    "explanation": "This command helps upgrade submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0276",
    "title": "Reset - backup worktrees",
    "description": "Command to backup worktrees in Git reset",
    "category": "Reset",
    "goal": "Backup worktrees",
    "commands": [
      "git reset --backup-worktrees"
    ],
    "explanation": "This command helps backup worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0277",
    "title": "Cherry Pick - reset archives",
    "description": "Command to reset archives in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Reset archives",
    "commands": [
      "git cherry --reset-archives"
    ],
    "explanation": "This command helps reset archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0278",
    "title": "Log - optimize credentials",
    "description": "Command to optimize credentials in Git log",
    "category": "Log",
    "goal": "Optimize credentials",
    "commands": [
      "git log --optimize-credentials"
    ],
    "explanation": "This command helps optimize credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0279",
    "title": "Push - verify patches",
    "description": "Command to verify patches in Git push",
    "category": "Push",
    "goal": "Verify patches",
    "commands": [
      "git push --verify-patches"
    ],
    "explanation": "This command helps verify patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0280",
    "title": "Blame - reset stashes",
    "description": "Command to reset stashes in Git blame",
    "category": "Blame",
    "goal": "Reset stashes",
    "commands": [
      "git blame --reset-stashes"
    ],
    "explanation": "This command helps reset stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0281",
    "title": "Recovery - validate stashes",
    "description": "Command to validate stashes in Git recovery",
    "category": "Recovery",
    "goal": "Validate stashes",
    "commands": [
      "git recovery --validate-stashes"
    ],
    "explanation": "This command helps validate stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0282",
    "title": "Config - manage branches",
    "description": "Command to manage branches in Git config",
    "category": "Config",
    "goal": "Manage branches",
    "commands": [
      "git config --manage-branches"
    ],
    "explanation": "This command helps manage branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0283",
    "title": "Branch - reset branches",
    "description": "Command to reset branches in Git branch",
    "category": "Branch",
    "goal": "Reset branches",
    "commands": [
      "git branch --reset-branches"
    ],
    "explanation": "This command helps reset branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0284",
    "title": "Bisect - validate commits",
    "description": "Command to validate commits in Git bisect",
    "category": "Bisect",
    "goal": "Validate commits",
    "commands": [
      "git bisect --validate-commits"
    ],
    "explanation": "This command helps validate commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0285",
    "title": "Reflog - sync reflog",
    "description": "Command to sync reflog in Git reflog",
    "category": "Reflog",
    "goal": "Sync reflog",
    "commands": [
      "git reflog --sync-reflog"
    ],
    "explanation": "This command helps sync reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0286",
    "title": "Submodule - export remotes",
    "description": "Command to export remotes in Git submodule",
    "category": "Submodule",
    "goal": "Export remotes",
    "commands": [
      "git submodule --export-remotes"
    ],
    "explanation": "This command helps export remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0287",
    "title": "Log - configure archives",
    "description": "Command to configure archives in Git log",
    "category": "Log",
    "goal": "Configure archives",
    "commands": [
      "git log --configure-archives"
    ],
    "explanation": "This command helps configure archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0288",
    "title": "Config - clean credentials",
    "description": "Command to clean credentials in Git config",
    "category": "Config",
    "goal": "Clean credentials",
    "commands": [
      "git config --clean-credentials"
    ],
    "explanation": "This command helps clean credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0289",
    "title": "Blame - sync objects",
    "description": "Command to sync objects in Git blame",
    "category": "Blame",
    "goal": "Sync objects",
    "commands": [
      "git blame --sync-objects"
    ],
    "explanation": "This command helps sync objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0290",
    "title": "Hook - manage commits",
    "description": "Command to manage commits in Git hook",
    "category": "Hook",
    "goal": "Manage commits",
    "commands": [
      "git hook --manage-commits"
    ],
    "explanation": "This command helps manage commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0291",
    "title": "Config - split attributes",
    "description": "Command to split attributes in Git config",
    "category": "Config",
    "goal": "Split attributes",
    "commands": [
      "git config --split-attributes"
    ],
    "explanation": "This command helps split attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0292",
    "title": "Diff - update archives",
    "description": "Command to update archives in Git diff",
    "category": "Diff",
    "goal": "Update archives",
    "commands": [
      "git diff --update-archives"
    ],
    "explanation": "This command helps update archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0293",
    "title": "Cherry Pick - verify worktrees",
    "description": "Command to verify worktrees in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Verify worktrees",
    "commands": [
      "git cherry --verify-worktrees"
    ],
    "explanation": "This command helps verify worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0294",
    "title": "Blame - split commits",
    "description": "Command to split commits in Git blame",
    "category": "Blame",
    "goal": "Split commits",
    "commands": [
      "git blame --split-commits"
    ],
    "explanation": "This command helps split commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0295",
    "title": "Worktree - restore remotes",
    "description": "Command to restore remotes in Git worktree",
    "category": "Worktree",
    "goal": "Restore remotes",
    "commands": [
      "git worktree --restore-remotes"
    ],
    "explanation": "This command helps restore remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0296",
    "title": "Log - backup objects",
    "description": "Command to backup objects in Git log",
    "category": "Log",
    "goal": "Backup objects",
    "commands": [
      "git log --backup-objects"
    ],
    "explanation": "This command helps backup objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0297",
    "title": "Tag - sync hooks",
    "description": "Command to sync hooks in Git tag",
    "category": "Tag",
    "goal": "Sync hooks",
    "commands": [
      "git tag --sync-hooks"
    ],
    "explanation": "This command helps sync hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0298",
    "title": "Worktree - audit credentials",
    "description": "Command to audit credentials in Git worktree",
    "category": "Worktree",
    "goal": "Audit credentials",
    "commands": [
      "git worktree --audit-credentials"
    ],
    "explanation": "This command helps audit credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0299",
    "title": "Recovery - update config",
    "description": "Command to update config in Git recovery",
    "category": "Recovery",
    "goal": "Update config",
    "commands": [
      "git recovery --update-config"
    ],
    "explanation": "This command helps update config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0300",
    "title": "Hook - sync hooks",
    "description": "Command to sync hooks in Git hook",
    "category": "Hook",
    "goal": "Sync hooks",
    "commands": [
      "git hook --sync-hooks"
    ],
    "explanation": "This command helps sync hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0301",
    "title": "Tag - verify worktrees",
    "description": "Command to verify worktrees in Git tag",
    "category": "Tag",
    "goal": "Verify worktrees",
    "commands": [
      "git tag --verify-worktrees"
    ],
    "explanation": "This command helps verify worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0302",
    "title": "Branch - restore credentials",
    "description": "Command to restore credentials in Git branch",
    "category": "Branch",
    "goal": "Restore credentials",
    "commands": [
      "git branch --restore-credentials"
    ],
    "explanation": "This command helps restore credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0303",
    "title": "Reset - scan tags",
    "description": "Command to scan tags in Git reset",
    "category": "Reset",
    "goal": "Scan tags",
    "commands": [
      "git reset --scan-tags"
    ],
    "explanation": "This command helps scan tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0304",
    "title": "Config - optimize config",
    "description": "Command to optimize config in Git config",
    "category": "Config",
    "goal": "Optimize config",
    "commands": [
      "git config --optimize-config"
    ],
    "explanation": "This command helps optimize config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0305",
    "title": "Pull - track commits",
    "description": "Command to track commits in Git pull",
    "category": "Pull",
    "goal": "Track commits",
    "commands": [
      "git pull --track-commits"
    ],
    "explanation": "This command helps track commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0306",
    "title": "Diff - validate objects",
    "description": "Command to validate objects in Git diff",
    "category": "Diff",
    "goal": "Validate objects",
    "commands": [
      "git diff --validate-objects"
    ],
    "explanation": "This command helps validate objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0307",
    "title": "Hook - optimize branches",
    "description": "Command to optimize branches in Git hook",
    "category": "Hook",
    "goal": "Optimize branches",
    "commands": [
      "git hook --optimize-branches"
    ],
    "explanation": "This command helps optimize branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0308",
    "title": "Stash - manage worktrees",
    "description": "Command to manage worktrees in Git stash",
    "category": "Stash",
    "goal": "Manage worktrees",
    "commands": [
      "git stash --manage-worktrees"
    ],
    "explanation": "This command helps manage worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0309",
    "title": "Reflog - split credentials",
    "description": "Command to split credentials in Git reflog",
    "category": "Reflog",
    "goal": "Split credentials",
    "commands": [
      "git reflog --split-credentials"
    ],
    "explanation": "This command helps split credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0310",
    "title": "Clone - validate archives",
    "description": "Command to validate archives in Git clone",
    "category": "Clone",
    "goal": "Validate archives",
    "commands": [
      "git clone --validate-archives"
    ],
    "explanation": "This command helps validate archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0311",
    "title": "Merge - configure hooks",
    "description": "Command to configure hooks in Git merge",
    "category": "Merge",
    "goal": "Configure hooks",
    "commands": [
      "git merge --configure-hooks"
    ],
    "explanation": "This command helps configure hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0312",
    "title": "Cherry Pick - audit worktrees",
    "description": "Command to audit worktrees in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Audit worktrees",
    "commands": [
      "git cherry --audit-worktrees"
    ],
    "explanation": "This command helps audit worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0313",
    "title": "Branch - manage worktrees",
    "description": "Command to manage worktrees in Git branch",
    "category": "Branch",
    "goal": "Manage worktrees",
    "commands": [
      "git branch --manage-worktrees"
    ],
    "explanation": "This command helps manage worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0314",
    "title": "Archive - sync notes",
    "description": "Command to sync notes in Git archive",
    "category": "Archive",
    "goal": "Sync notes",
    "commands": [
      "git archive --sync-notes"
    ],
    "explanation": "This command helps sync notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0315",
    "title": "Push - track archives",
    "description": "Command to track archives in Git push",
    "category": "Push",
    "goal": "Track archives",
    "commands": [
      "git push --track-archives"
    ],
    "explanation": "This command helps track archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0316",
    "title": "Reset - update ignore patterns",
    "description": "Command to update ignore patterns in Git reset",
    "category": "Reset",
    "goal": "Update ignore patterns",
    "commands": [
      "git reset --update-ignore-patterns"
    ],
    "explanation": "This command helps update ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0317",
    "title": "Revert - merge submodules",
    "description": "Command to merge submodules in Git revert",
    "category": "Revert",
    "goal": "Merge submodules",
    "commands": [
      "git revert --merge-submodules"
    ],
    "explanation": "This command helps merge submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0318",
    "title": "Archive - update hooks",
    "description": "Command to update hooks in Git archive",
    "category": "Archive",
    "goal": "Update hooks",
    "commands": [
      "git archive --update-hooks"
    ],
    "explanation": "This command helps update hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0319",
    "title": "Rebase - reset index",
    "description": "Command to reset index in Git rebase",
    "category": "Rebase",
    "goal": "Reset index",
    "commands": [
      "git rebase --reset-index"
    ],
    "explanation": "This command helps reset index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0320",
    "title": "Recovery - verify archives",
    "description": "Command to verify archives in Git recovery",
    "category": "Recovery",
    "goal": "Verify archives",
    "commands": [
      "git recovery --verify-archives"
    ],
    "explanation": "This command helps verify archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0321",
    "title": "Tag - reset attributes",
    "description": "Command to reset attributes in Git tag",
    "category": "Tag",
    "goal": "Reset attributes",
    "commands": [
      "git tag --reset-attributes"
    ],
    "explanation": "This command helps reset attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0322",
    "title": "Archive - split ignore patterns",
    "description": "Command to split ignore patterns in Git archive",
    "category": "Archive",
    "goal": "Split ignore patterns",
    "commands": [
      "git archive --split-ignore-patterns"
    ],
    "explanation": "This command helps split ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0323",
    "title": "Pull - merge patches",
    "description": "Command to merge patches in Git pull",
    "category": "Pull",
    "goal": "Merge patches",
    "commands": [
      "git pull --merge-patches"
    ],
    "explanation": "This command helps merge patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0324",
    "title": "Setup - verify worktrees",
    "description": "Command to verify worktrees in Git setup",
    "category": "Setup",
    "goal": "Verify worktrees",
    "commands": [
      "git setup --verify-worktrees"
    ],
    "explanation": "This command helps verify worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git setup --help"
    ]
  },
  {
    "id": "CMD-0325",
    "title": "Clone - migrate hooks",
    "description": "Command to migrate hooks in Git clone",
    "category": "Clone",
    "goal": "Migrate hooks",
    "commands": [
      "git clone --migrate-hooks"
    ],
    "explanation": "This command helps migrate hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0326",
    "title": "Branch - validate aliases",
    "description": "Command to validate aliases in Git branch",
    "category": "Branch",
    "goal": "Validate aliases",
    "commands": [
      "git branch --validate-aliases"
    ],
    "explanation": "This command helps validate aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0327",
    "title": "Rebase - manage submodules",
    "description": "Command to manage submodules in Git rebase",
    "category": "Rebase",
    "goal": "Manage submodules",
    "commands": [
      "git rebase --manage-submodules"
    ],
    "explanation": "This command helps manage submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0328",
    "title": "Log - restore credentials",
    "description": "Command to restore credentials in Git log",
    "category": "Log",
    "goal": "Restore credentials",
    "commands": [
      "git log --restore-credentials"
    ],
    "explanation": "This command helps restore credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0329",
    "title": "Setup - backup config",
    "description": "Command to backup config in Git setup",
    "category": "Setup",
    "goal": "Backup config",
    "commands": [
      "git setup --backup-config"
    ],
    "explanation": "This command helps backup config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git setup --help"
    ]
  },
  {
    "id": "CMD-0330",
    "title": "Stash - backup worktrees",
    "description": "Command to backup worktrees in Git stash",
    "category": "Stash",
    "goal": "Backup worktrees",
    "commands": [
      "git stash --backup-worktrees"
    ],
    "explanation": "This command helps backup worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0331",
    "title": "Blame - audit stashes",
    "description": "Command to audit stashes in Git blame",
    "category": "Blame",
    "goal": "Audit stashes",
    "commands": [
      "git blame --audit-stashes"
    ],
    "explanation": "This command helps audit stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0332",
    "title": "Tag - export index",
    "description": "Command to export index in Git tag",
    "category": "Tag",
    "goal": "Export index",
    "commands": [
      "git tag --export-index"
    ],
    "explanation": "This command helps export index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0333",
    "title": "Diff - validate hooks",
    "description": "Command to validate hooks in Git diff",
    "category": "Diff",
    "goal": "Validate hooks",
    "commands": [
      "git diff --validate-hooks"
    ],
    "explanation": "This command helps validate hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0334",
    "title": "Submodule - update ignore patterns",
    "description": "Command to update ignore patterns in Git submodule",
    "category": "Submodule",
    "goal": "Update ignore patterns",
    "commands": [
      "git submodule --update-ignore-patterns"
    ],
    "explanation": "This command helps update ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0335",
    "title": "Hook - reset files",
    "description": "Command to reset files in Git hook",
    "category": "Hook",
    "goal": "Reset files",
    "commands": [
      "git hook --reset-files"
    ],
    "explanation": "This command helps reset files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0336",
    "title": "Hook - export ignore patterns",
    "description": "Command to export ignore patterns in Git hook",
    "category": "Hook",
    "goal": "Export ignore patterns",
    "commands": [
      "git hook --export-ignore-patterns"
    ],
    "explanation": "This command helps export ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0337",
    "title": "Diff - reset remotes",
    "description": "Command to reset remotes in Git diff",
    "category": "Diff",
    "goal": "Reset remotes",
    "commands": [
      "git diff --reset-remotes"
    ],
    "explanation": "This command helps reset remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0338",
    "title": "Pull - split tags",
    "description": "Command to split tags in Git pull",
    "category": "Pull",
    "goal": "Split tags",
    "commands": [
      "git pull --split-tags"
    ],
    "explanation": "This command helps split tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0339",
    "title": "Submodule - upgrade patches",
    "description": "Command to upgrade patches in Git submodule",
    "category": "Submodule",
    "goal": "Upgrade patches",
    "commands": [
      "git submodule --upgrade-patches"
    ],
    "explanation": "This command helps upgrade patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0340",
    "title": "Setup - optimize archives",
    "description": "Command to optimize archives in Git setup",
    "category": "Setup",
    "goal": "Optimize archives",
    "commands": [
      "git setup --optimize-archives"
    ],
    "explanation": "This command helps optimize archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git setup --help"
    ]
  },
  {
    "id": "CMD-0341",
    "title": "Worktree - track attributes",
    "description": "Command to track attributes in Git worktree",
    "category": "Worktree",
    "goal": "Track attributes",
    "commands": [
      "git worktree --track-attributes"
    ],
    "explanation": "This command helps track attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0342",
    "title": "Diff - backup attributes",
    "description": "Command to backup attributes in Git diff",
    "category": "Diff",
    "goal": "Backup attributes",
    "commands": [
      "git diff --backup-attributes"
    ],
    "explanation": "This command helps backup attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0343",
    "title": "Diff - import worktrees",
    "description": "Command to import worktrees in Git diff",
    "category": "Diff",
    "goal": "Import worktrees",
    "commands": [
      "git diff --import-worktrees"
    ],
    "explanation": "This command helps import worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0344",
    "title": "Revert - clean archives",
    "description": "Command to clean archives in Git revert",
    "category": "Revert",
    "goal": "Clean archives",
    "commands": [
      "git revert --clean-archives"
    ],
    "explanation": "This command helps clean archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0345",
    "title": "Hook - migrate files",
    "description": "Command to migrate files in Git hook",
    "category": "Hook",
    "goal": "Migrate files",
    "commands": [
      "git hook --migrate-files"
    ],
    "explanation": "This command helps migrate files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0346",
    "title": "Branch - split aliases",
    "description": "Command to split aliases in Git branch",
    "category": "Branch",
    "goal": "Split aliases",
    "commands": [
      "git branch --split-aliases"
    ],
    "explanation": "This command helps split aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0347",
    "title": "Recovery - split credentials",
    "description": "Command to split credentials in Git recovery",
    "category": "Recovery",
    "goal": "Split credentials",
    "commands": [
      "git recovery --split-credentials"
    ],
    "explanation": "This command helps split credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0348",
    "title": "Remote - update ignore patterns",
    "description": "Command to update ignore patterns in Git remote",
    "category": "Remote",
    "goal": "Update ignore patterns",
    "commands": [
      "git remote --update-ignore-patterns"
    ],
    "explanation": "This command helps update ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0349",
    "title": "Merge - restore ignore patterns",
    "description": "Command to restore ignore patterns in Git merge",
    "category": "Merge",
    "goal": "Restore ignore patterns",
    "commands": [
      "git merge --restore-ignore-patterns"
    ],
    "explanation": "This command helps restore ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0350",
    "title": "Remote - manage index",
    "description": "Command to manage index in Git remote",
    "category": "Remote",
    "goal": "Manage index",
    "commands": [
      "git remote --manage-index"
    ],
    "explanation": "This command helps manage index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0351",
    "title": "Reflog - migrate worktrees",
    "description": "Command to migrate worktrees in Git reflog",
    "category": "Reflog",
    "goal": "Migrate worktrees",
    "commands": [
      "git reflog --migrate-worktrees"
    ],
    "explanation": "This command helps migrate worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0352",
    "title": "Archive - import archives",
    "description": "Command to import archives in Git archive",
    "category": "Archive",
    "goal": "Import archives",
    "commands": [
      "git archive --import-archives"
    ],
    "explanation": "This command helps import archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0353",
    "title": "Rebase - clean attributes",
    "description": "Command to clean attributes in Git rebase",
    "category": "Rebase",
    "goal": "Clean attributes",
    "commands": [
      "git rebase --clean-attributes"
    ],
    "explanation": "This command helps clean attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0354",
    "title": "Diff - clean index",
    "description": "Command to clean index in Git diff",
    "category": "Diff",
    "goal": "Clean index",
    "commands": [
      "git diff --clean-index"
    ],
    "explanation": "This command helps clean index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0355",
    "title": "Cherry Pick - restore tags",
    "description": "Command to restore tags in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Restore tags",
    "commands": [
      "git cherry --restore-tags"
    ],
    "explanation": "This command helps restore tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0356",
    "title": "Merge - verify ignore patterns",
    "description": "Command to verify ignore patterns in Git merge",
    "category": "Merge",
    "goal": "Verify ignore patterns",
    "commands": [
      "git merge --verify-ignore-patterns"
    ],
    "explanation": "This command helps verify ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0357",
    "title": "Rebase - manage archives",
    "description": "Command to manage archives in Git rebase",
    "category": "Rebase",
    "goal": "Manage archives",
    "commands": [
      "git rebase --manage-archives"
    ],
    "explanation": "This command helps manage archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0358",
    "title": "Merge - update credentials",
    "description": "Command to update credentials in Git merge",
    "category": "Merge",
    "goal": "Update credentials",
    "commands": [
      "git merge --update-credentials"
    ],
    "explanation": "This command helps update credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0359",
    "title": "Revert - export worktrees",
    "description": "Command to export worktrees in Git revert",
    "category": "Revert",
    "goal": "Export worktrees",
    "commands": [
      "git revert --export-worktrees"
    ],
    "explanation": "This command helps export worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0360",
    "title": "Hook - upgrade config",
    "description": "Command to upgrade config in Git hook",
    "category": "Hook",
    "goal": "Upgrade config",
    "commands": [
      "git hook --upgrade-config"
    ],
    "explanation": "This command helps upgrade config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0361",
    "title": "Setup - manage ignore patterns",
    "description": "Command to manage ignore patterns in Git setup",
    "category": "Setup",
    "goal": "Manage ignore patterns",
    "commands": [
      "git setup --manage-ignore-patterns"
    ],
    "explanation": "This command helps manage ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git setup --help"
    ]
  },
  {
    "id": "CMD-0362",
    "title": "Log - configure config",
    "description": "Command to configure config in Git log",
    "category": "Log",
    "goal": "Configure config",
    "commands": [
      "git log --configure-config"
    ],
    "explanation": "This command helps configure config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0363",
    "title": "Blame - validate patches",
    "description": "Command to validate patches in Git blame",
    "category": "Blame",
    "goal": "Validate patches",
    "commands": [
      "git blame --validate-patches"
    ],
    "explanation": "This command helps validate patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0364",
    "title": "Branch - restore worktrees",
    "description": "Command to restore worktrees in Git branch",
    "category": "Branch",
    "goal": "Restore worktrees",
    "commands": [
      "git branch --restore-worktrees"
    ],
    "explanation": "This command helps restore worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0365",
    "title": "Cherry Pick - export tags",
    "description": "Command to export tags in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Export tags",
    "commands": [
      "git cherry --export-tags"
    ],
    "explanation": "This command helps export tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0366",
    "title": "Diff - update commits",
    "description": "Command to update commits in Git diff",
    "category": "Diff",
    "goal": "Update commits",
    "commands": [
      "git diff --update-commits"
    ],
    "explanation": "This command helps update commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0367",
    "title": "Log - export objects",
    "description": "Command to export objects in Git log",
    "category": "Log",
    "goal": "Export objects",
    "commands": [
      "git log --export-objects"
    ],
    "explanation": "This command helps export objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0368",
    "title": "Branch - sync submodules",
    "description": "Command to sync submodules in Git branch",
    "category": "Branch",
    "goal": "Sync submodules",
    "commands": [
      "git branch --sync-submodules"
    ],
    "explanation": "This command helps sync submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0369",
    "title": "Clone - restore patches",
    "description": "Command to restore patches in Git clone",
    "category": "Clone",
    "goal": "Restore patches",
    "commands": [
      "git clone --restore-patches"
    ],
    "explanation": "This command helps restore patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0370",
    "title": "Remote - manage reflog",
    "description": "Command to manage reflog in Git remote",
    "category": "Remote",
    "goal": "Manage reflog",
    "commands": [
      "git remote --manage-reflog"
    ],
    "explanation": "This command helps manage reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0371",
    "title": "Worktree - upgrade aliases",
    "description": "Command to upgrade aliases in Git worktree",
    "category": "Worktree",
    "goal": "Upgrade aliases",
    "commands": [
      "git worktree --upgrade-aliases"
    ],
    "explanation": "This command helps upgrade aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0372",
    "title": "Log - restore commits",
    "description": "Command to restore commits in Git log",
    "category": "Log",
    "goal": "Restore commits",
    "commands": [
      "git log --restore-commits"
    ],
    "explanation": "This command helps restore commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0373",
    "title": "Reset - configure tags",
    "description": "Command to configure tags in Git reset",
    "category": "Reset",
    "goal": "Configure tags",
    "commands": [
      "git reset --configure-tags"
    ],
    "explanation": "This command helps configure tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0374",
    "title": "Rebase - migrate branches",
    "description": "Command to migrate branches in Git rebase",
    "category": "Rebase",
    "goal": "Migrate branches",
    "commands": [
      "git rebase --migrate-branches"
    ],
    "explanation": "This command helps migrate branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0375",
    "title": "Cherry Pick - import archives",
    "description": "Command to import archives in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Import archives",
    "commands": [
      "git cherry --import-archives"
    ],
    "explanation": "This command helps import archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0376",
    "title": "Tag - sync config",
    "description": "Command to sync config in Git tag",
    "category": "Tag",
    "goal": "Sync config",
    "commands": [
      "git tag --sync-config"
    ],
    "explanation": "This command helps sync config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0377",
    "title": "Stash - optimize notes",
    "description": "Command to optimize notes in Git stash",
    "category": "Stash",
    "goal": "Optimize notes",
    "commands": [
      "git stash --optimize-notes"
    ],
    "explanation": "This command helps optimize notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0378",
    "title": "Clone - track reflog",
    "description": "Command to track reflog in Git clone",
    "category": "Clone",
    "goal": "Track reflog",
    "commands": [
      "git clone --track-reflog"
    ],
    "explanation": "This command helps track reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0379",
    "title": "Config - merge objects",
    "description": "Command to merge objects in Git config",
    "category": "Config",
    "goal": "Merge objects",
    "commands": [
      "git config --merge-objects"
    ],
    "explanation": "This command helps merge objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0380",
    "title": "Revert - export reflog",
    "description": "Command to export reflog in Git revert",
    "category": "Revert",
    "goal": "Export reflog",
    "commands": [
      "git revert --export-reflog"
    ],
    "explanation": "This command helps export reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0381",
    "title": "Hook - backup reflog",
    "description": "Command to backup reflog in Git hook",
    "category": "Hook",
    "goal": "Backup reflog",
    "commands": [
      "git hook --backup-reflog"
    ],
    "explanation": "This command helps backup reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0382",
    "title": "Worktree - export files",
    "description": "Command to export files in Git worktree",
    "category": "Worktree",
    "goal": "Export files",
    "commands": [
      "git worktree --export-files"
    ],
    "explanation": "This command helps export files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0383",
    "title": "Diff - clean branches",
    "description": "Command to clean branches in Git diff",
    "category": "Diff",
    "goal": "Clean branches",
    "commands": [
      "git diff --clean-branches"
    ],
    "explanation": "This command helps clean branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0384",
    "title": "Diff - backup patches",
    "description": "Command to backup patches in Git diff",
    "category": "Diff",
    "goal": "Backup patches",
    "commands": [
      "git diff --backup-patches"
    ],
    "explanation": "This command helps backup patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0385",
    "title": "Merge - sync notes",
    "description": "Command to sync notes in Git merge",
    "category": "Merge",
    "goal": "Sync notes",
    "commands": [
      "git merge --sync-notes"
    ],
    "explanation": "This command helps sync notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0386",
    "title": "Log - manage archives",
    "description": "Command to manage archives in Git log",
    "category": "Log",
    "goal": "Manage archives",
    "commands": [
      "git log --manage-archives"
    ],
    "explanation": "This command helps manage archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0387",
    "title": "Clone - track attributes",
    "description": "Command to track attributes in Git clone",
    "category": "Clone",
    "goal": "Track attributes",
    "commands": [
      "git clone --track-attributes"
    ],
    "explanation": "This command helps track attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0388",
    "title": "Rebase - scan archives",
    "description": "Command to scan archives in Git rebase",
    "category": "Rebase",
    "goal": "Scan archives",
    "commands": [
      "git rebase --scan-archives"
    ],
    "explanation": "This command helps scan archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0389",
    "title": "Tag - migrate notes",
    "description": "Command to migrate notes in Git tag",
    "category": "Tag",
    "goal": "Migrate notes",
    "commands": [
      "git tag --migrate-notes"
    ],
    "explanation": "This command helps migrate notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0390",
    "title": "Worktree - upgrade remotes",
    "description": "Command to upgrade remotes in Git worktree",
    "category": "Worktree",
    "goal": "Upgrade remotes",
    "commands": [
      "git worktree --upgrade-remotes"
    ],
    "explanation": "This command helps upgrade remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0391",
    "title": "Stash - validate reflog",
    "description": "Command to validate reflog in Git stash",
    "category": "Stash",
    "goal": "Validate reflog",
    "commands": [
      "git stash --validate-reflog"
    ],
    "explanation": "This command helps validate reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0392",
    "title": "Rebase - track hooks",
    "description": "Command to track hooks in Git rebase",
    "category": "Rebase",
    "goal": "Track hooks",
    "commands": [
      "git rebase --track-hooks"
    ],
    "explanation": "This command helps track hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0393",
    "title": "Blame - verify attributes",
    "description": "Command to verify attributes in Git blame",
    "category": "Blame",
    "goal": "Verify attributes",
    "commands": [
      "git blame --verify-attributes"
    ],
    "explanation": "This command helps verify attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0394",
    "title": "Clone - track commits",
    "description": "Command to track commits in Git clone",
    "category": "Clone",
    "goal": "Track commits",
    "commands": [
      "git clone --track-commits"
    ],
    "explanation": "This command helps track commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0395",
    "title": "Merge - verify files",
    "description": "Command to verify files in Git merge",
    "category": "Merge",
    "goal": "Verify files",
    "commands": [
      "git merge --verify-files"
    ],
    "explanation": "This command helps verify files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0396",
    "title": "Push - manage index",
    "description": "Command to manage index in Git push",
    "category": "Push",
    "goal": "Manage index",
    "commands": [
      "git push --manage-index"
    ],
    "explanation": "This command helps manage index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0397",
    "title": "Revert - manage remotes",
    "description": "Command to manage remotes in Git revert",
    "category": "Revert",
    "goal": "Manage remotes",
    "commands": [
      "git revert --manage-remotes"
    ],
    "explanation": "This command helps manage remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0398",
    "title": "Branch - split tags",
    "description": "Command to split tags in Git branch",
    "category": "Branch",
    "goal": "Split tags",
    "commands": [
      "git branch --split-tags"
    ],
    "explanation": "This command helps split tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0399",
    "title": "Hook - export remotes",
    "description": "Command to export remotes in Git hook",
    "category": "Hook",
    "goal": "Export remotes",
    "commands": [
      "git hook --export-remotes"
    ],
    "explanation": "This command helps export remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0400",
    "title": "Submodule - migrate ignore patterns",
    "description": "Command to migrate ignore patterns in Git submodule",
    "category": "Submodule",
    "goal": "Migrate ignore patterns",
    "commands": [
      "git submodule --migrate-ignore-patterns"
    ],
    "explanation": "This command helps migrate ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0401",
    "title": "Revert - optimize archives",
    "description": "Command to optimize archives in Git revert",
    "category": "Revert",
    "goal": "Optimize archives",
    "commands": [
      "git revert --optimize-archives"
    ],
    "explanation": "This command helps optimize archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0402",
    "title": "Bisect - sync index",
    "description": "Command to sync index in Git bisect",
    "category": "Bisect",
    "goal": "Sync index",
    "commands": [
      "git bisect --sync-index"
    ],
    "explanation": "This command helps sync index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0403",
    "title": "Diff - split archives",
    "description": "Command to split archives in Git diff",
    "category": "Diff",
    "goal": "Split archives",
    "commands": [
      "git diff --split-archives"
    ],
    "explanation": "This command helps split archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0404",
    "title": "Reflog - update config",
    "description": "Command to update config in Git reflog",
    "category": "Reflog",
    "goal": "Update config",
    "commands": [
      "git reflog --update-config"
    ],
    "explanation": "This command helps update config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0405",
    "title": "Reset - import objects",
    "description": "Command to import objects in Git reset",
    "category": "Reset",
    "goal": "Import objects",
    "commands": [
      "git reset --import-objects"
    ],
    "explanation": "This command helps import objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0406",
    "title": "Reflog - audit reflog",
    "description": "Command to audit reflog in Git reflog",
    "category": "Reflog",
    "goal": "Audit reflog",
    "commands": [
      "git reflog --audit-reflog"
    ],
    "explanation": "This command helps audit reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0407",
    "title": "Branch - sync ignore patterns",
    "description": "Command to sync ignore patterns in Git branch",
    "category": "Branch",
    "goal": "Sync ignore patterns",
    "commands": [
      "git branch --sync-ignore-patterns"
    ],
    "explanation": "This command helps sync ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0408",
    "title": "Clone - track submodules",
    "description": "Command to track submodules in Git clone",
    "category": "Clone",
    "goal": "Track submodules",
    "commands": [
      "git clone --track-submodules"
    ],
    "explanation": "This command helps track submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0409",
    "title": "Blame - scan submodules",
    "description": "Command to scan submodules in Git blame",
    "category": "Blame",
    "goal": "Scan submodules",
    "commands": [
      "git blame --scan-submodules"
    ],
    "explanation": "This command helps scan submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0410",
    "title": "Worktree - merge commits",
    "description": "Command to merge commits in Git worktree",
    "category": "Worktree",
    "goal": "Merge commits",
    "commands": [
      "git worktree --merge-commits"
    ],
    "explanation": "This command helps merge commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0411",
    "title": "Reflog - backup tags",
    "description": "Command to backup tags in Git reflog",
    "category": "Reflog",
    "goal": "Backup tags",
    "commands": [
      "git reflog --backup-tags"
    ],
    "explanation": "This command helps backup tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0412",
    "title": "Pull - verify worktrees",
    "description": "Command to verify worktrees in Git pull",
    "category": "Pull",
    "goal": "Verify worktrees",
    "commands": [
      "git pull --verify-worktrees"
    ],
    "explanation": "This command helps verify worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0413",
    "title": "Stash - scan patches",
    "description": "Command to scan patches in Git stash",
    "category": "Stash",
    "goal": "Scan patches",
    "commands": [
      "git stash --scan-patches"
    ],
    "explanation": "This command helps scan patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0414",
    "title": "Merge - sync worktrees",
    "description": "Command to sync worktrees in Git merge",
    "category": "Merge",
    "goal": "Sync worktrees",
    "commands": [
      "git merge --sync-worktrees"
    ],
    "explanation": "This command helps sync worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0415",
    "title": "Archive - audit config",
    "description": "Command to audit config in Git archive",
    "category": "Archive",
    "goal": "Audit config",
    "commands": [
      "git archive --audit-config"
    ],
    "explanation": "This command helps audit config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0416",
    "title": "Config - migrate reflog",
    "description": "Command to migrate reflog in Git config",
    "category": "Config",
    "goal": "Migrate reflog",
    "commands": [
      "git config --migrate-reflog"
    ],
    "explanation": "This command helps migrate reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0417",
    "title": "Log - backup config",
    "description": "Command to backup config in Git log",
    "category": "Log",
    "goal": "Backup config",
    "commands": [
      "git log --backup-config"
    ],
    "explanation": "This command helps backup config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0418",
    "title": "Stash - import hooks",
    "description": "Command to import hooks in Git stash",
    "category": "Stash",
    "goal": "Import hooks",
    "commands": [
      "git stash --import-hooks"
    ],
    "explanation": "This command helps import hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0419",
    "title": "Worktree - manage worktrees",
    "description": "Command to manage worktrees in Git worktree",
    "category": "Worktree",
    "goal": "Manage worktrees",
    "commands": [
      "git worktree --manage-worktrees"
    ],
    "explanation": "This command helps manage worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0420",
    "title": "Merge - backup index",
    "description": "Command to backup index in Git merge",
    "category": "Merge",
    "goal": "Backup index",
    "commands": [
      "git merge --backup-index"
    ],
    "explanation": "This command helps backup index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0421",
    "title": "Cherry Pick - track ignore patterns",
    "description": "Command to track ignore patterns in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Track ignore patterns",
    "commands": [
      "git cherry --track-ignore-patterns"
    ],
    "explanation": "This command helps track ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0422",
    "title": "Config - upgrade branches",
    "description": "Command to upgrade branches in Git config",
    "category": "Config",
    "goal": "Upgrade branches",
    "commands": [
      "git config --upgrade-branches"
    ],
    "explanation": "This command helps upgrade branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git config --help"
    ]
  },
  {
    "id": "CMD-0423",
    "title": "Archive - validate notes",
    "description": "Command to validate notes in Git archive",
    "category": "Archive",
    "goal": "Validate notes",
    "commands": [
      "git archive --validate-notes"
    ],
    "explanation": "This command helps validate notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0424",
    "title": "Log - optimize commits",
    "description": "Command to optimize commits in Git log",
    "category": "Log",
    "goal": "Optimize commits",
    "commands": [
      "git log --optimize-commits"
    ],
    "explanation": "This command helps optimize commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0425",
    "title": "Remote - track hooks",
    "description": "Command to track hooks in Git remote",
    "category": "Remote",
    "goal": "Track hooks",
    "commands": [
      "git remote --track-hooks"
    ],
    "explanation": "This command helps track hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0426",
    "title": "Stash - import worktrees",
    "description": "Command to import worktrees in Git stash",
    "category": "Stash",
    "goal": "Import worktrees",
    "commands": [
      "git stash --import-worktrees"
    ],
    "explanation": "This command helps import worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0427",
    "title": "Worktree - verify patches",
    "description": "Command to verify patches in Git worktree",
    "category": "Worktree",
    "goal": "Verify patches",
    "commands": [
      "git worktree --verify-patches"
    ],
    "explanation": "This command helps verify patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0428",
    "title": "Reset - configure submodules",
    "description": "Command to configure submodules in Git reset",
    "category": "Reset",
    "goal": "Configure submodules",
    "commands": [
      "git reset --configure-submodules"
    ],
    "explanation": "This command helps configure submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0429",
    "title": "Merge - audit hooks",
    "description": "Command to audit hooks in Git merge",
    "category": "Merge",
    "goal": "Audit hooks",
    "commands": [
      "git merge --audit-hooks"
    ],
    "explanation": "This command helps audit hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0430",
    "title": "Stash - backup hooks",
    "description": "Command to backup hooks in Git stash",
    "category": "Stash",
    "goal": "Backup hooks",
    "commands": [
      "git stash --backup-hooks"
    ],
    "explanation": "This command helps backup hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0431",
    "title": "Rebase - optimize notes",
    "description": "Command to optimize notes in Git rebase",
    "category": "Rebase",
    "goal": "Optimize notes",
    "commands": [
      "git rebase --optimize-notes"
    ],
    "explanation": "This command helps optimize notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0432",
    "title": "Diff - verify remotes",
    "description": "Command to verify remotes in Git diff",
    "category": "Diff",
    "goal": "Verify remotes",
    "commands": [
      "git diff --verify-remotes"
    ],
    "explanation": "This command helps verify remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0433",
    "title": "Merge - migrate reflog",
    "description": "Command to migrate reflog in Git merge",
    "category": "Merge",
    "goal": "Migrate reflog",
    "commands": [
      "git merge --migrate-reflog"
    ],
    "explanation": "This command helps migrate reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0434",
    "title": "Pull - validate patches",
    "description": "Command to validate patches in Git pull",
    "category": "Pull",
    "goal": "Validate patches",
    "commands": [
      "git pull --validate-patches"
    ],
    "explanation": "This command helps validate patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0435",
    "title": "Recovery - validate ignore patterns",
    "description": "Command to validate ignore patterns in Git recovery",
    "category": "Recovery",
    "goal": "Validate ignore patterns",
    "commands": [
      "git recovery --validate-ignore-patterns"
    ],
    "explanation": "This command helps validate ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0436",
    "title": "Push - track credentials",
    "description": "Command to track credentials in Git push",
    "category": "Push",
    "goal": "Track credentials",
    "commands": [
      "git push --track-credentials"
    ],
    "explanation": "This command helps track credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0437",
    "title": "Tag - configure submodules",
    "description": "Command to configure submodules in Git tag",
    "category": "Tag",
    "goal": "Configure submodules",
    "commands": [
      "git tag --configure-submodules"
    ],
    "explanation": "This command helps configure submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git tag --help"
    ]
  },
  {
    "id": "CMD-0438",
    "title": "Cherry Pick - manage submodules",
    "description": "Command to manage submodules in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Manage submodules",
    "commands": [
      "git cherry --manage-submodules"
    ],
    "explanation": "This command helps manage submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0439",
    "title": "Merge - update stashes",
    "description": "Command to update stashes in Git merge",
    "category": "Merge",
    "goal": "Update stashes",
    "commands": [
      "git merge --update-stashes"
    ],
    "explanation": "This command helps update stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0440",
    "title": "Log - configure objects",
    "description": "Command to configure objects in Git log",
    "category": "Log",
    "goal": "Configure objects",
    "commands": [
      "git log --configure-objects"
    ],
    "explanation": "This command helps configure objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0441",
    "title": "Revert - scan remotes",
    "description": "Command to scan remotes in Git revert",
    "category": "Revert",
    "goal": "Scan remotes",
    "commands": [
      "git revert --scan-remotes"
    ],
    "explanation": "This command helps scan remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git revert --help"
    ]
  },
  {
    "id": "CMD-0442",
    "title": "Worktree - scan stashes",
    "description": "Command to scan stashes in Git worktree",
    "category": "Worktree",
    "goal": "Scan stashes",
    "commands": [
      "git worktree --scan-stashes"
    ],
    "explanation": "This command helps scan stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0443",
    "title": "Diff - upgrade index",
    "description": "Command to upgrade index in Git diff",
    "category": "Diff",
    "goal": "Upgrade index",
    "commands": [
      "git diff --upgrade-index"
    ],
    "explanation": "This command helps upgrade index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0444",
    "title": "Hook - split commits",
    "description": "Command to split commits in Git hook",
    "category": "Hook",
    "goal": "Split commits",
    "commands": [
      "git hook --split-commits"
    ],
    "explanation": "This command helps split commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0445",
    "title": "Merge - verify commits",
    "description": "Command to verify commits in Git merge",
    "category": "Merge",
    "goal": "Verify commits",
    "commands": [
      "git merge --verify-commits"
    ],
    "explanation": "This command helps verify commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0446",
    "title": "Stash - configure submodules",
    "description": "Command to configure submodules in Git stash",
    "category": "Stash",
    "goal": "Configure submodules",
    "commands": [
      "git stash --configure-submodules"
    ],
    "explanation": "This command helps configure submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0447",
    "title": "Worktree - manage config",
    "description": "Command to manage config in Git worktree",
    "category": "Worktree",
    "goal": "Manage config",
    "commands": [
      "git worktree --manage-config"
    ],
    "explanation": "This command helps manage config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0448",
    "title": "Merge - manage notes",
    "description": "Command to manage notes in Git merge",
    "category": "Merge",
    "goal": "Manage notes",
    "commands": [
      "git merge --manage-notes"
    ],
    "explanation": "This command helps manage notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0449",
    "title": "Remote - audit objects",
    "description": "Command to audit objects in Git remote",
    "category": "Remote",
    "goal": "Audit objects",
    "commands": [
      "git remote --audit-objects"
    ],
    "explanation": "This command helps audit objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0450",
    "title": "Recovery - merge attributes",
    "description": "Command to merge attributes in Git recovery",
    "category": "Recovery",
    "goal": "Merge attributes",
    "commands": [
      "git recovery --merge-attributes"
    ],
    "explanation": "This command helps merge attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0451",
    "title": "Reset - update branches",
    "description": "Command to update branches in Git reset",
    "category": "Reset",
    "goal": "Update branches",
    "commands": [
      "git reset --update-branches"
    ],
    "explanation": "This command helps update branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0452",
    "title": "Bisect - verify aliases",
    "description": "Command to verify aliases in Git bisect",
    "category": "Bisect",
    "goal": "Verify aliases",
    "commands": [
      "git bisect --verify-aliases"
    ],
    "explanation": "This command helps verify aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0453",
    "title": "Reflog - sync remotes",
    "description": "Command to sync remotes in Git reflog",
    "category": "Reflog",
    "goal": "Sync remotes",
    "commands": [
      "git reflog --sync-remotes"
    ],
    "explanation": "This command helps sync remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0454",
    "title": "Diff - scan aliases",
    "description": "Command to scan aliases in Git diff",
    "category": "Diff",
    "goal": "Scan aliases",
    "commands": [
      "git diff --scan-aliases"
    ],
    "explanation": "This command helps scan aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0455",
    "title": "Cherry Pick - verify objects",
    "description": "Command to verify objects in Git cherry pick",
    "category": "Cherry Pick",
    "goal": "Verify objects",
    "commands": [
      "git cherry --verify-objects"
    ],
    "explanation": "This command helps verify objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git cherry --help"
    ]
  },
  {
    "id": "CMD-0456",
    "title": "Diff - validate worktrees",
    "description": "Command to validate worktrees in Git diff",
    "category": "Diff",
    "goal": "Validate worktrees",
    "commands": [
      "git diff --validate-worktrees"
    ],
    "explanation": "This command helps validate worktrees in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git diff --help"
    ]
  },
  {
    "id": "CMD-0457",
    "title": "Setup - configure patches",
    "description": "Command to configure patches in Git setup",
    "category": "Setup",
    "goal": "Configure patches",
    "commands": [
      "git setup --configure-patches"
    ],
    "explanation": "This command helps configure patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git setup --help"
    ]
  },
  {
    "id": "CMD-0458",
    "title": "Remote - split stashes",
    "description": "Command to split stashes in Git remote",
    "category": "Remote",
    "goal": "Split stashes",
    "commands": [
      "git remote --split-stashes"
    ],
    "explanation": "This command helps split stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0459",
    "title": "Stash - restore index",
    "description": "Command to restore index in Git stash",
    "category": "Stash",
    "goal": "Restore index",
    "commands": [
      "git stash --restore-index"
    ],
    "explanation": "This command helps restore index in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0460",
    "title": "Log - reset objects",
    "description": "Command to reset objects in Git log",
    "category": "Log",
    "goal": "Reset objects",
    "commands": [
      "git log --reset-objects"
    ],
    "explanation": "This command helps reset objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0461",
    "title": "Merge - optimize notes",
    "description": "Command to optimize notes in Git merge",
    "category": "Merge",
    "goal": "Optimize notes",
    "commands": [
      "git merge --optimize-notes"
    ],
    "explanation": "This command helps optimize notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git merge --help"
    ]
  },
  {
    "id": "CMD-0462",
    "title": "Push - update commits",
    "description": "Command to update commits in Git push",
    "category": "Push",
    "goal": "Update commits",
    "commands": [
      "git push --update-commits"
    ],
    "explanation": "This command helps update commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0463",
    "title": "Branch - import stashes",
    "description": "Command to import stashes in Git branch",
    "category": "Branch",
    "goal": "Import stashes",
    "commands": [
      "git branch --import-stashes"
    ],
    "explanation": "This command helps import stashes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0464",
    "title": "Archive - scan hooks",
    "description": "Command to scan hooks in Git archive",
    "category": "Archive",
    "goal": "Scan hooks",
    "commands": [
      "git archive --scan-hooks"
    ],
    "explanation": "This command helps scan hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git archive --help"
    ]
  },
  {
    "id": "CMD-0465",
    "title": "Branch - clean commits",
    "description": "Command to clean commits in Git branch",
    "category": "Branch",
    "goal": "Clean commits",
    "commands": [
      "git branch --clean-commits"
    ],
    "explanation": "This command helps clean commits in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0466",
    "title": "Branch - migrate attributes",
    "description": "Command to migrate attributes in Git branch",
    "category": "Branch",
    "goal": "Migrate attributes",
    "commands": [
      "git branch --migrate-attributes"
    ],
    "explanation": "This command helps migrate attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0467",
    "title": "Recovery - audit submodules",
    "description": "Command to audit submodules in Git recovery",
    "category": "Recovery",
    "goal": "Audit submodules",
    "commands": [
      "git recovery --audit-submodules"
    ],
    "explanation": "This command helps audit submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0468",
    "title": "Reset - migrate submodules",
    "description": "Command to migrate submodules in Git reset",
    "category": "Reset",
    "goal": "Migrate submodules",
    "commands": [
      "git reset --migrate-submodules"
    ],
    "explanation": "This command helps migrate submodules in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0469",
    "title": "Branch - manage tags",
    "description": "Command to manage tags in Git branch",
    "category": "Branch",
    "goal": "Manage tags",
    "commands": [
      "git branch --manage-tags"
    ],
    "explanation": "This command helps manage tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0470",
    "title": "Clone - clean objects",
    "description": "Command to clean objects in Git clone",
    "category": "Clone",
    "goal": "Clean objects",
    "commands": [
      "git clone --clean-objects"
    ],
    "explanation": "This command helps clean objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0471",
    "title": "Push - update objects",
    "description": "Command to update objects in Git push",
    "category": "Push",
    "goal": "Update objects",
    "commands": [
      "git push --update-objects"
    ],
    "explanation": "This command helps update objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0472",
    "title": "Log - backup objects",
    "description": "Command to backup objects in Git log",
    "category": "Log",
    "goal": "Backup objects",
    "commands": [
      "git log --backup-objects"
    ],
    "explanation": "This command helps backup objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0473",
    "title": "Reflog - verify credentials",
    "description": "Command to verify credentials in Git reflog",
    "category": "Reflog",
    "goal": "Verify credentials",
    "commands": [
      "git reflog --verify-credentials"
    ],
    "explanation": "This command helps verify credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reflog --help"
    ]
  },
  {
    "id": "CMD-0474",
    "title": "Rebase - export patches",
    "description": "Command to export patches in Git rebase",
    "category": "Rebase",
    "goal": "Export patches",
    "commands": [
      "git rebase --export-patches"
    ],
    "explanation": "This command helps export patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0475",
    "title": "Worktree - sync objects",
    "description": "Command to sync objects in Git worktree",
    "category": "Worktree",
    "goal": "Sync objects",
    "commands": [
      "git worktree --sync-objects"
    ],
    "explanation": "This command helps sync objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0476",
    "title": "Pull - optimize credentials",
    "description": "Command to optimize credentials in Git pull",
    "category": "Pull",
    "goal": "Optimize credentials",
    "commands": [
      "git pull --optimize-credentials"
    ],
    "explanation": "This command helps optimize credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git pull --help"
    ]
  },
  {
    "id": "CMD-0477",
    "title": "Rebase - export aliases",
    "description": "Command to export aliases in Git rebase",
    "category": "Rebase",
    "goal": "Export aliases",
    "commands": [
      "git rebase --export-aliases"
    ],
    "explanation": "This command helps export aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0478",
    "title": "Hook - audit credentials",
    "description": "Command to audit credentials in Git hook",
    "category": "Hook",
    "goal": "Audit credentials",
    "commands": [
      "git hook --audit-credentials"
    ],
    "explanation": "This command helps audit credentials in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0479",
    "title": "Submodule - clean remotes",
    "description": "Command to clean remotes in Git submodule",
    "category": "Submodule",
    "goal": "Clean remotes",
    "commands": [
      "git submodule --clean-remotes"
    ],
    "explanation": "This command helps clean remotes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0480",
    "title": "Branch - track hooks",
    "description": "Command to track hooks in Git branch",
    "category": "Branch",
    "goal": "Track hooks",
    "commands": [
      "git branch --track-hooks"
    ],
    "explanation": "This command helps track hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0481",
    "title": "Hook - upgrade objects",
    "description": "Command to upgrade objects in Git hook",
    "category": "Hook",
    "goal": "Upgrade objects",
    "commands": [
      "git hook --upgrade-objects"
    ],
    "explanation": "This command helps upgrade objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git hook --help"
    ]
  },
  {
    "id": "CMD-0482",
    "title": "Push - migrate archives",
    "description": "Command to migrate archives in Git push",
    "category": "Push",
    "goal": "Migrate archives",
    "commands": [
      "git push --migrate-archives"
    ],
    "explanation": "This command helps migrate archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0483",
    "title": "Remote - audit objects",
    "description": "Command to audit objects in Git remote",
    "category": "Remote",
    "goal": "Audit objects",
    "commands": [
      "git remote --audit-objects"
    ],
    "explanation": "This command helps audit objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git remote --help"
    ]
  },
  {
    "id": "CMD-0484",
    "title": "Log - backup archives",
    "description": "Command to backup archives in Git log",
    "category": "Log",
    "goal": "Backup archives",
    "commands": [
      "git log --backup-archives"
    ],
    "explanation": "This command helps backup archives in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git log --help"
    ]
  },
  {
    "id": "CMD-0485",
    "title": "Blame - export patches",
    "description": "Command to export patches in Git blame",
    "category": "Blame",
    "goal": "Export patches",
    "commands": [
      "git blame --export-patches"
    ],
    "explanation": "This command helps export patches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0486",
    "title": "Worktree - optimize aliases",
    "description": "Command to optimize aliases in Git worktree",
    "category": "Worktree",
    "goal": "Optimize aliases",
    "commands": [
      "git worktree --optimize-aliases"
    ],
    "explanation": "This command helps optimize aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0487",
    "title": "Worktree - configure reflog",
    "description": "Command to configure reflog in Git worktree",
    "category": "Worktree",
    "goal": "Configure reflog",
    "commands": [
      "git worktree --configure-reflog"
    ],
    "explanation": "This command helps configure reflog in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  },
  {
    "id": "CMD-0488",
    "title": "Push - verify hooks",
    "description": "Command to verify hooks in Git push",
    "category": "Push",
    "goal": "Verify hooks",
    "commands": [
      "git push --verify-hooks"
    ],
    "explanation": "This command helps verify hooks in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0489",
    "title": "Rebase - export tags",
    "description": "Command to export tags in Git rebase",
    "category": "Rebase",
    "goal": "Export tags",
    "commands": [
      "git rebase --export-tags"
    ],
    "explanation": "This command helps export tags in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git rebase --help"
    ]
  },
  {
    "id": "CMD-0490",
    "title": "Recovery - optimize branches",
    "description": "Command to optimize branches in Git recovery",
    "category": "Recovery",
    "goal": "Optimize branches",
    "commands": [
      "git recovery --optimize-branches"
    ],
    "explanation": "This command helps optimize branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git recovery --help"
    ]
  },
  {
    "id": "CMD-0491",
    "title": "Bisect - restore config",
    "description": "Command to restore config in Git bisect",
    "category": "Bisect",
    "goal": "Restore config",
    "commands": [
      "git bisect --restore-config"
    ],
    "explanation": "This command helps restore config in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git bisect --help"
    ]
  },
  {
    "id": "CMD-0492",
    "title": "Push - migrate notes",
    "description": "Command to migrate notes in Git push",
    "category": "Push",
    "goal": "Migrate notes",
    "commands": [
      "git push --migrate-notes"
    ],
    "explanation": "This command helps migrate notes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git push --help"
    ]
  },
  {
    "id": "CMD-0493",
    "title": "Submodule - sync objects",
    "description": "Command to sync objects in Git submodule",
    "category": "Submodule",
    "goal": "Sync objects",
    "commands": [
      "git submodule --sync-objects"
    ],
    "explanation": "This command helps sync objects in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0494",
    "title": "Branch - merge aliases",
    "description": "Command to merge aliases in Git branch",
    "category": "Branch",
    "goal": "Merge aliases",
    "commands": [
      "git branch --merge-aliases"
    ],
    "explanation": "This command helps merge aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git branch --help"
    ]
  },
  {
    "id": "CMD-0495",
    "title": "Blame - clean branches",
    "description": "Command to clean branches in Git blame",
    "category": "Blame",
    "goal": "Clean branches",
    "commands": [
      "git blame --clean-branches"
    ],
    "explanation": "This command helps clean branches in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git blame --help"
    ]
  },
  {
    "id": "CMD-0496",
    "title": "Submodule - optimize files",
    "description": "Command to optimize files in Git submodule",
    "category": "Submodule",
    "goal": "Optimize files",
    "commands": [
      "git submodule --optimize-files"
    ],
    "explanation": "This command helps optimize files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git submodule --help"
    ]
  },
  {
    "id": "CMD-0497",
    "title": "Clone - update ignore patterns",
    "description": "Command to update ignore patterns in Git clone",
    "category": "Clone",
    "goal": "Update ignore patterns",
    "commands": [
      "git clone --update-ignore-patterns"
    ],
    "explanation": "This command helps update ignore patterns in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git clone --help"
    ]
  },
  {
    "id": "CMD-0498",
    "title": "Stash - backup attributes",
    "description": "Command to backup attributes in Git stash",
    "category": "Stash",
    "goal": "Backup attributes",
    "commands": [
      "git stash --backup-attributes"
    ],
    "explanation": "This command helps backup attributes in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git stash --help"
    ]
  },
  {
    "id": "CMD-0499",
    "title": "Reset - configure files",
    "description": "Command to configure files in Git reset",
    "category": "Reset",
    "goal": "Configure files",
    "commands": [
      "git reset --configure-files"
    ],
    "explanation": "This command helps configure files in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git reset --help"
    ]
  },
  {
    "id": "CMD-0500",
    "title": "Worktree - scan aliases",
    "description": "Command to scan aliases in Git worktree",
    "category": "Worktree",
    "goal": "Scan aliases",
    "commands": [
      "git worktree --scan-aliases"
    ],
    "explanation": "This command helps scan aliases in the repository.",
    "risks": [
      "Test in a safe environment first",
      "Some operations can affect team members"
    ],
    "alternatives": [
      "Check Git documentation for more options"
    ],
    "examples": [
      "git worktree --help"
    ]
  }
];
