import Fuse from "fuse.js";
import type { SearchResult, GitError, CommandRecipe, CheatSheet, Article, Workflow } from "@/types";

let fuseInstance: Fuse<SearchResult> | null = null;

const searchableData: SearchResult[] = [];

export function addToSearchIndex(items: SearchResult[]) {
  searchableData.push(...items);
  fuseInstance = null;
}

export function createSearchIndex() {
  fuseInstance = new Fuse(searchableData, {
    keys: [
      { name: "title", weight: 2 },
      { name: "description", weight: 1 },
      { name: "content", weight: 0.5 },
    ],
    threshold: 0.4,
    includeScore: true,
  });
}

export function search(query: string): SearchResult[] {
  if (!fuseInstance) createSearchIndex();
  if (!query.trim() || !fuseInstance) return [];
  const results = fuseInstance.search(query);
  return results.map((r) => r.item).slice(0, 20);
}

export function buildSearchIndex(
  errors: GitError[],
  commands: CommandRecipe[],
  cheatsheets: CheatSheet[],
  articles: Article[],
  workflows: Workflow[]
): SearchResult[] {
  const results: SearchResult[] = [];

  errors.forEach((e) => {
    results.push({
      id: e.id,
      title: e.title,
      description: e.description.slice(0, 200),
      category: "error",
      url: `/errors/${e.id}`,
      content: `${e.rootCause} ${e.symptoms.join(" ")}`,
    });
  });

  commands.forEach((c) => {
    results.push({
      id: c.id,
      title: c.title,
      description: c.description,
      category: "command",
      url: `/commands/${c.id}`,
      content: c.commands.join(" "),
    });
  });

  cheatsheets.forEach((c) => {
    results.push({
      id: c.id,
      title: c.title,
      description: c.description,
      category: "cheatsheet",
      url: `/cheat-sheets/${c.id}`,
      content: c.content.slice(0, 300),
    });
  });

  articles.forEach((a) => {
    results.push({
      id: a.id,
      title: a.title,
      description: a.description,
      category: "article",
      url: `/learn/${a.id}`,
      content: a.content.slice(0, 300),
    });
  });

  workflows.forEach((w) => {
    results.push({
      id: w.id,
      title: w.title,
      description: w.description,
      category: "workflow",
      url: `/workflow-builder/${w.id}`,
    });
  });

  return results;
}
