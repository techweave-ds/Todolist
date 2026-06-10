import type { PROptions, PROutput } from "@/types";

export function generatePR(opts: PROptions): PROutput {
  const changes = opts.changes;
  const summary = opts.summary || changes.split("\n").slice(0, 3).join("; ");

  const lines = changes.split("\n").filter(Boolean);

  const testingSteps = [
    `Verify that ${lines[0]?.toLowerCase() || "the changes"} work as expected`,
    "Run the existing test suite to ensure no regressions",
    lines.length > 1 ? `Test ${lines[1].toLowerCase()} in isolation` : "Check edge cases and error handling",
    "Review any console errors or warnings",
    "Confirm the changes integrate with existing functionality",
  ];

  const checklist = [
    "Code follows project style guidelines",
    "Self-reviewed the code changes",
    "Added/updated tests for the changes",
    "All new and existing tests pass",
    "Documentation is updated (if needed)",
    "No sensitive information (secrets, keys) exposed",
    "Changes are backward compatible",
  ];

  const reviewNotes = [
    `Focus on the ${lines[0]?.split(" ")[0] || "core"} logic changes`,
    `Consider edge cases in the ${lines[1]?.split(" ")[1] || "implementation"}`,
    "Check for potential performance implications",
    "Verify error handling covers all states",
  ];

  const hasBreaking = changes.toLowerCase().includes("breaking") || changes.toLowerCase().includes("major");
  const breakingChanges = hasBreaking ? changes : "None";

  const markdown = `## Summary

${summary}

## Changes

${lines.map((l) => `- ${l}`).join("\n")}

## Testing

${testingSteps.map((s) => `- [ ] ${s}`).join("\n")}

## Checklist

${checklist.map((c) => `- [ ] ${c}`).join("\n")}

${breakingChanges !== "None" ? `## ⚠️ Breaking Changes\n\n${breakingChanges}\n\n` : ""}
## Review Notes

${reviewNotes.map((n) => `- ${n}`).join("\n")}
`;

  return {
    summary,
    testingSteps,
    checklist,
    breakingChanges,
    reviewNotes,
    markdown,
  };
}
