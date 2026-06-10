import type { NavigationItem } from "@/types";

export const mainNavigation: (NavigationItem & { children?: NavigationItem[] })[] = [
  {
    label: "Home",
    href: "/",
    icon: "home",
    description: "Dashboard and overview",
  },
  {
    label: "Errors",
    href: "/errors",
    icon: "alert-triangle",
    description: "Browse Git error database",
  },
  {
    label: "Commands",
    href: "/commands",
    icon: "terminal",
    description: "Generate Git commands",
  },
  {
    label: "Tools",
    href: "#",
    icon: "wrench",
    description: "Developer tools suite",
    children: [
      { label: "Commit Generator", href: "/commit-generator", icon: "git-commit", description: "Generate commit messages" },
      { label: "README Generator", href: "/readme-generator", icon: "file-text", description: "Create README files" },
      { label: "PR Generator", href: "/pr-generator", icon: "git-pull-request", description: "Generate PR descriptions" },
      { label: "Release Notes", href: "/release-notes-generator", icon: "package", description: "Generate release notes" },
      { label: "Repo Analyzer", href: "/repo-analyzer", icon: "search", description: "Analyze GitHub repos" },
      { label: "Workflow Builder", href: "/workflow-builder", icon: "git-branch", description: "Build Git workflows" },
      { label: "Troubleshooter", href: "/troubleshooter", icon: "life-buoy", description: "Fix Git problems" },
    ],
  },
  {
    label: "Cheat Sheets",
    href: "/cheat-sheets",
    icon: "book-open",
    description: "Quick reference guides",
  },
  {
    label: "Learn",
    href: "/learn",
    icon: "graduation-cap",
    description: "Git tutorials and guides",
  },
  {
    label: "Resources",
    href: "/resources",
    icon: "folder",
    description: "Additional resources",
  },
  {
    label: "About",
    href: "/about",
    icon: "info",
    description: "About CommitKit",
  },
];
