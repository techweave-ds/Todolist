import type { RepoAnalysis } from "@/types";

const frameworks: Record<string, RegExp[]> = {
  React: [/react/i, /create-react-app/i],
  Vue: [/vue/i, /nuxt/i],
  Angular: [/angular/i, /@angular\//i],
  "Next.js": [/next/i, /next\.js/i],
  Express: [/express/i],
  FastAPI: [/fastapi/i],
  Flask: [/flask/i],
  Django: [/django/i],
  Laravel: [/laravel/i],
  Spring: [/spring/i, /spring-boot/i],
  Go: [/go module/i, /go\.mod/i],
  Rust: [/cargo/i, /rust/i],
};

const setupGuides: Record<string, (name: string) => string> = {
  React: (n) => `# Setup ${n}\n\n\`\`\`bash\nnpx create-react-app ${n}\ncd ${n}\nnpm start\n\`\`\``,
  Vue: (n) => `# Setup ${n}\n\n\`\`\`bash\nnpm create vue@latest ${n}\ncd ${n}\nnpm install\nnpm run dev\n\`\`\``,
  "Next.js": (n) => `# Setup ${n}\n\n\`\`\`bash\nnpx create-next-app@latest ${n}\ncd ${n}\nnpm run dev\n\`\`\``,
  Express: (n) => `# Setup ${n}\n\n\`\`\`bash\nmkdir ${n} && cd ${n}\nnpm init -y\nnpm install express\nnode index.js\n\`\`\``,
  Django: (n) => `# Setup ${n}\n\n\`\`\`bash\npip install django\ndjango-admin startproject ${n}\ncd ${n}\npython manage.py runserver\n\`\`\``,
};

export function analyzeRepo(data: {
  name: string;
  description: string;
  url: string;
  languages: Record<string, number>;
  branches: number;
  stars: number;
  forks: number;
  topics: string[];
  issues: number;
  releases: number;
  readme?: string;
  packageJson?: string;
}): RepoAnalysis {
  const detectedFramework = detectFramework(data);

  const folderExplanation = generateFolderExplanation(detectedFramework);

  const missingFiles = detectMissingFiles(data, detectedFramework);

  return {
    ...data,
    detectedFramework,
    overview: generateOverview(data, detectedFramework),
    setupGuide: detectedFramework && setupGuides[detectedFramework]
      ? setupGuides[detectedFramework](data.name)
      : `# Setup ${data.name}\n\nClone and install dependencies as described in the repository's README.`,
    folderExplanation,
    missingFiles,
    healthScore: calculateHealthScore(data),
    documentationScore: calculateDocScore(data),
    maintainabilityScore: calculateMaintainabilityScore(data),
  };
}

function detectFramework(data: { packageJson?: string; readme?: string; topics?: string[] }): string | null {
  const content = `${data.packageJson || ""} ${data.readme || ""} ${(data.topics || []).join(" ")}`;
  for (const [name, patterns] of Object.entries(frameworks)) {
    if (patterns.some((p) => p.test(content))) return name;
  }
  return null;
}

function generateOverview(data: { name: string; description: string; stars: number; languages: Record<string, number> }, framework: string | null): string {
  const langDesc = Object.keys(data.languages).slice(0, 3).join(", ") || "Multiple languages";
  return `${data.name} is a ${framework || "software"} project built primarily with ${langDesc}. It has ${data.stars} stars on GitHub. ${data.description || "No description available."}`;
}

function generateFolderExplanation(framework: string | null): string {
  const explanations: Record<string, string> = {
    React: "- `src/components/`: Reusable React components\n- `src/pages/`: Page-level components\n- `public/`: Static assets\n- `package.json`: Dependencies and scripts",
    "Next.js": "- `app/`: App Router pages and layouts\n- `components/`: Shared UI components\n- `public/`: Static assets\n- `lib/`: Utility functions",
    Vue: "- `src/components/`: Vue single-file components\n- `src/views/`: Page views\n- `src/router/`: Vue Router config\n- `src/store/`: State management",
  };
  return explanations[framework || ""] || "- `src/`: Source code\n- `tests/`: Test files\n- `docs/`: Documentation\n- `config/`: Configuration files";
}

function detectMissingFiles(data: { readme?: string; packageJson?: string }, framework: string | null): string[] {
  const missing: string[] = [];
  if (!data.readme) missing.push("README.md");
  if (!data.packageJson && (framework === "React" || framework === "Next.js" || framework === "Vue")) missing.push("package.json");
  if (!data.readme?.includes("test")) missing.push("Test configuration");
  if (!data.readme?.includes("contributing")) missing.push("CONTRIBUTING.md");
  return missing;
}

function calculateHealthScore(data: { stars: number; forks: number; issues: number; releases: number }): number {
  let score = 50;
  if (data.stars > 100) score += 10;
  if (data.stars > 1000) score += 10;
  if (data.forks > 10) score += 10;
  if (data.releases > 5) score += 10;
  if (data.issues < 50) score += 10;
  return Math.min(100, score);
}

function calculateDocScore(data: { readme?: string; topics?: string[] }): number {
  let score = 30;
  if (data.readme) score += 30;
  if (data.readme && data.readme.length > 500) score += 20;
  if (data.topics && data.topics.length > 3) score += 20;
  return Math.min(100, score);
}

function calculateMaintainabilityScore(data: { branches: number; releases: number; issues: number }): number {
  let score = 50;
  if (data.branches > 1 && data.branches < 10) score += 15;
  if (data.releases > 3) score += 15;
  if (data.issues < 20) score += 20;
  return Math.min(100, score);
}
