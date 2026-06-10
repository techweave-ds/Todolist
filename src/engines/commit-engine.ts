import type { CommitOptions, CommitOutput, CommitType } from "@/types";

const commitTypes: Record<CommitType, { title: string; semver: "patch" | "minor" | "major"; examples: string[] }> = {
  feat: { title: "Features", semver: "minor", examples: ["feat(auth): add OAuth2 login", "feat(api): implement rate limiting"] },
  fix: { title: "Bug Fixes", semver: "patch", examples: ["fix(parser): handle null input", "fix(cache): invalidate on write"] },
  docs: { title: "Documentation", semver: "patch", examples: ["docs(readme): update installation guide", "docs(api): add endpoint examples"] },
  style: { title: "Styles", semver: "patch", examples: ["style(components): format with prettier", "style: fix indentation"] },
  refactor: { title: "Code Refactoring", semver: "patch", examples: ["refactor(auth): extract validation logic", "refactor(db): simplify queries"] },
  perf: { title: "Performance Improvements", semver: "patch", examples: ["perf(render): optimize virtual DOM diff", "perf(db): add query indexes"] },
  test: { title: "Tests", semver: "patch", examples: ["test(auth): add login flow tests", "test(api): cover edge cases"] },
  chore: { title: "Chores", semver: "patch", examples: ["chore(deps): update dependencies", "chore: configure CI pipeline"] },
  build: { title: "Builds", semver: "patch", examples: ["build(webpack): update config", "build: add production optimizations"] },
  ci: { title: "Continuous Integration", semver: "patch", examples: ["ci: add GitHub Actions workflow", "ci: fix deployment script"] },
  revert: { title: "Reverts", semver: "patch", examples: ["revert: feat(auth): add OAuth2 login"] },
};

const scopeSuggestions = [
  "auth", "api", "ui", "db", "config", "deps", "docs", "test",
  "build", "ci", "cli", "server", "client", "hooks", "utils",
  "components", "pages", "styles", "types", "state", "router",
  "cache", "queue", "worker", "middleware", "seo", "analytics",
  "notifications", "search", "forms", "validation", "error",
  "logging", "monitoring", "backup", "migration", "schema",
];

export function generateCommits(options: CommitOptions): CommitOutput {
  const typeInfo = commitTypes[options.type];
  const scope = options.scope || "";
  const desc = options.description;
  const scopePart = scope ? `(${scope})` : "";
  const breakingPart = options.breaking ? "!" : "";
  const conventional = `${options.type}${scopePart}${breakingPart}: ${desc}`;

  const short = options.breaking
    ? `${options.type.toUpperCase()}: ${options.breaking}`
    : `${options.type}: ${desc.slice(0, 50)}`;

  const longParts = [`${conventional}`];
  if (options.body) longParts.push(``, options.body);
  if (options.breaking) longParts.push(``, `BREAKING CHANGE: ${options.breaking}`);
  if (options.issues?.length) longParts.push(``, `Closes: ${options.issues.join(", ")}`);
  const long = longParts.join("\n");

  const enterprise = `${options.type}${scopePart}${breakingPart}: ${desc}${options.breaking ? `\n\nBREAKING CHANGE: ${options.breaking}` : ""}${options.body ? `\n\n${options.body}` : ""}`;

  return {
    conventional,
    short,
    long,
    enterprise,
    semverBump: options.breaking ? "major" : typeInfo.semver,
    examples: typeInfo.examples,
  };
}

export function getCommitTypes() {
  return Object.entries(commitTypes).map(([value, info]) => ({
    value: value as CommitType,
    ...info,
  }));
}

export function getScopeSuggestions() {
  return scopeSuggestions;
}
