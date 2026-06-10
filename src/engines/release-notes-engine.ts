import type { ReleaseNotesOptions, ReleaseNotesOutput } from "@/types";

export function generateReleaseNotes(opts: ReleaseNotesOptions): ReleaseNotesOutput {
  const version = opts.version || "1.0.0";
  const date = new Date().toISOString().split("T")[0];

  const featureBullets = opts.features.map((f) => `- ✨ ${f}`).join("\n");
  const fixBullets = opts.fixes.map((f) => `- 🐛 ${f}`).join("\n");
  const breakingBullets = (opts.breaking || []).map((b) => `- ⚠️ ${b}`).join("\n");

  const notes = [
    `## Version ${version}`,
    `*Released: ${date}*`,
    "",
    opts.features.length ? `### 🚀 Features\n\n${featureBullets}\n` : "",
    opts.fixes.length ? `### 🐛 Bug Fixes\n\n${fixBullets}\n` : "",
    opts.breaking?.length ? `### ⚠️ Breaking Changes\n\n${breakingBullets}\n` : "",
    opts.commits.length ? `### 📝 Commits\n\n${opts.commits.map((c) => `- ${c}`).join("\n")}` : "",
    opts.contributors?.length ? `\n### 👏 Contributors\n\n${opts.contributors.map((c) => `- @${c}`).join("\n")}` : "",
  ].join("\n");

  const githubRelease = `## 🎉 ${version}

${opts.features.length ? `### What's New\n\n${featureBullets}\n` : ""}
${opts.fixes.length ? `### Bug Fixes\n\n${fixBullets}\n` : ""}
${opts.breaking?.length ? `### Breaking Changes\n\n${breakingBullets}\n` : ""}
**Full Changelog**: https://github.com/owner/repo/compare/v${version}`;

  const changelog = `## [${version}] - ${date}

${opts.features.map((f) => `### Added\n- ${f}`).join("\n")}
${opts.fixes.map((f) => `### Fixed\n- ${f}`).join("\n")}
${(opts.breaking || []).map((b) => `### Changed\n- ${b}`).join("\n")}
`;

  return {
    version,
    date,
    notes,
    githubRelease,
    changelog,
  };
}
