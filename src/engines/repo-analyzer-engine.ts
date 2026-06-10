import { RepoAnalysis } from "@/types";

interface GitHubRepoResponse {
  name: string;
  description: string | null;
  html_url: string;
  forks_count: number;
  stargazers_count: number;
  open_issues_count: number;
  topics: string[];
  default_branch: string;
  language: string | null;
}

interface GitHubLanguagesResponse {
  [language: string]: number;
}

interface GitHubBranchResponse {
  name: string;
}

interface GitHubReleaseResponseItem {
  tag_name: string;
}

function detectFramework(languages: Record<string, number>, topics: string[]): string | null {
  const langBytes = Object.entries(languages);
  if (langBytes.length === 0) return null;
  langBytes.sort((a, b) => b[1] - a[1]);
  const topLang = langBytes[0][0];

  const langFrameworkMap: Record<string, string[]> = {
    TypeScript: ["Next.js", "NestJS", "Angular", "Vue.js", "Svelte", "Deno"],
    JavaScript: ["React", "Vue.js", "Express", "Next.js", "Svelte", "Node.js"],
    Python: ["Django", "Flask", "FastAPI", "PyTorch", "TensorFlow"],
    Java: ["Spring Boot", "Spring", "Micronaut", "Quarkus"],
    Go: ["Gin", "Echo", "Fiber", "Chi"],
    Rust: ["Actix", "Rocket", "Axum", "Tauri"],
    Ruby: ["Ruby on Rails", "Sinatra"],
    PHP: ["Laravel", "Symfony", "WordPress"],
    Kotlin: ["Ktor", "Spring Boot"],
    Swift: ["Vapor", "SwiftUI"],
    CSharp: [".NET Core", "ASP.NET", "Blazor"],
    Dart: ["Flutter"],
  };

  for (const [topic] of topics) {
    for (const frameworks of Object.values(langFrameworkMap)) {
      const match = frameworks.find((f) => f.toLowerCase().replace(/[\s.-]/g, "") === topic.toLowerCase().replace(/[\s.-]/g, ""));
      if (match) return match;
    }
  }

  const detectedFrameworks = langFrameworkMap[topLang];
  return detectedFrameworks ? detectedFrameworks[0] : null;
}

function generateOverview(name: string, description: string | null, language: string | null, stars: number, forks: number, topics: string[]): string {
  const desc = description || "No description provided.";
  const lang = language || "Unknown";
  const topicStr = topics.length > 0 ? topics.slice(0, 5).join(", ") : "general";

  return `${name} is a ${lang} project with ${stars} stars and ${forks} forks. ${desc} It covers topics including: ${topicStr}.`;
}

function generateSetupGuide(language: string | null, topics: string[]): string {
  const topicsLower = topics.map((t) => t.toLowerCase());
  const hasDocker = topicsLower.includes("docker");
  const hasNode = topicsLower.includes("node") || topicsLower.includes("nodejs") || language === "TypeScript" || language === "JavaScript";
  const hasPython = language === "Python";
  const hasJava = language === "Java";
  const hasGo = language === "Go";
  const hasRust = language === "Rust";

  const steps: string[] = [];

  if (hasNode) {
    steps.push("1. Install Node.js (v18 or higher recommended)");
    steps.push("2. Run `npm install` or `yarn install` to install dependencies");
    steps.push("3. Copy `.env.example` to `.env` and fill in required values");
    steps.push("4. Run `npm run dev` to start the development server");
    steps.push("5. Run `npm test` to verify everything is working");
  } else if (hasPython) {
    steps.push("1. Install Python 3.10+ and pip");
    steps.push("2. Create a virtual environment: `python -m venv venv`");
    steps.push("3. Activate the environment and run `pip install -r requirements.txt`");
    steps.push("4. Run `python manage.py migrate` (if Django) or `python main.py`");
    steps.push("5. Run `pytest` to verify the setup");
  } else if (hasJava) {
    steps.push("1. Install JDK 17+ and Maven/Gradle");
    steps.push("2. Run `mvn install` or `gradle build` to build the project");
    steps.push("3. Configure database connection in `application.properties` or `application.yml`");
    steps.push("4. Run `mvn spring-boot:run` or `gradle bootRun`");
    steps.push("5. Run `mvn test` or `gradle test` to verify");
  } else if (hasGo) {
    steps.push("1. Install Go 1.21+");
    steps.push("2. Run `go mod download` to download dependencies");
    steps.push("3. Copy `.env.example` to `.env` and configure");
    steps.push("4. Run `go run .` to start the application");
    steps.push("5. Run `go test ./...` to verify");
  } else if (hasRust) {
    steps.push("1. Install Rust via rustup (rustup.rs)");
    steps.push("2. Run `cargo build` to compile the project");
    steps.push("3. Configure environment variables as needed");
    steps.push("4. Run `cargo run` to start the application");
    steps.push("5. Run `cargo test` to verify");
  } else if (hasDocker) {
    steps.push("1. Install Docker and Docker Compose");
    steps.push("2. Run `docker-compose up` to start all services");
    steps.push("3. Verify services are running with `docker ps`");
  } else {
    steps.push("1. Clone the repository");
    steps.push("2. Check the README for specific setup instructions");
    steps.push("3. Install the required runtime for the project's language");
    steps.push("4. Look for Makefile, package.json, or Dockerfile for build instructions");
  }

  return steps.join("\n");
}

function generateFolderExplanation(data: GitHubRepoResponse): string {
  return `The repository "${data.name}" uses ${data.default_branch} as its default branch and contains ${
    data.topics.length > 0 ? "code related to: " + data.topics.slice(0, 4).join(", ") : "various source files"
  }. The project structure typically follows standard conventions for a ${data.language || "programming"} project. Common directories include:

- \`src/\` or \`lib/\` — Source code
- \`tests/\` or \`spec/\` — Test files
- \`docs/\` — Documentation
- \`config/\` — Configuration files
- \`scripts/\` — Build and utility scripts
- \`public/\` or \`static/\` — Static assets

Use \`tree\` or explore the repository on GitHub to understand its structure.`;
}

function suggestMissingFiles(data: GitHubRepoResponse): string[] {
  const missing: string[] = [];
  const topicsLower = data.topics.map((t) => t.toLowerCase());

  if (!topicsLower.some((t) => t.includes("license") || t === "mit" || t === "apache" || t === "gpl")) {
    missing.push("LICENSE — Add a license file to specify usage terms");
  }
  if (!topicsLower.includes("contributing")) {
    missing.push("CONTRIBUTING.md — Guide for contributors on how to participate");
  }
  if (!topicsLower.includes("code of conduct")) {
    missing.push("CODE_OF_CONDUCT.md — Establish community standards");
  }
  if (!topicsLower.includes("changelog")) {
    missing.push("CHANGELOG.md — Track version history and changes");
  }
  if (!topicsLower.includes("docker")) {
    missing.push("Dockerfile — Containerize the application for consistent deployments");
  }
  if (!topicsLower.includes("ci") && !topicsLower.includes("github actions")) {
    missing.push(".github/workflows/ci.yml — Set up continuous integration");
  }
  if (data.language === "TypeScript" || data.language === "JavaScript") {
    if (!topicsLower.includes("eslint")) {
      missing.push(".eslintrc.js — Add linting configuration");
    }
    if (!topicsLower.includes("prettier")) {
      missing.push(".prettierrc — Add code formatting configuration");
    }
  }

  return missing;
}

function calculateHealthScore(data: GitHubRepoResponse): number {
  let score = 50;

  if (data.description) score += 10;
  if (data.topics.length > 0) score += Math.min(data.topics.length * 2, 10);
  if (data.stargazers_count > 10) score += 5;
  if (data.stargazers_count > 100) score += 5;
  if (data.forks_count > 5) score += 5;
  if (data.open_issues_count < 10) score += 5;
  if (data.open_issues_count < 50) score += 5;

  return Math.min(Math.max(score, 0), 100);
}

function calculateDocumentationScore(data: GitHubRepoResponse, topics: string[]): number {
  let score = 40;
  const topicsLower = topics.map((t) => t.toLowerCase());

  if (data.description) score += 15;
  if (topicsLower.includes("documentation") || topicsLower.includes("docs")) score += 15;
  if (topicsLower.includes("readme")) score += 10;
  if (data.stargazers_count > 50) score += 10;
  if (data.open_issues_count > 0) score += 5;

  return Math.min(Math.max(score, 0), 100);
}

function calculateMaintainabilityScore(data: GitHubRepoResponse): number {
  let score = 50;

  if (data.forks_count > 0) score += 10;
  if (data.stargazers_count > 10) score += 5;
  if (data.open_issues_count < 20) score += 10;
  if (data.open_issues_count === 0) score += 5;
  if (data.topics.length > 0) score += 5;

  return Math.min(Math.max(score, 0), 100);
}

function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.replace(/\.git$/, "").split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    return null;
  } catch {
    return null;
  }
}

export async function analyzeRepo(url: string): Promise<RepoAnalysis> {
  const parsed = parseGithubUrl(url);
  if (!parsed) {
    throw new Error(`Invalid GitHub URL: ${url}. Expected format: https://github.com/owner/repo`);
  }

  const { owner, repo } = parsed;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "CommitKit",
  };

  const [repoRes, languagesRes, branchesRes, releasesRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=1`, { headers }),
  ]);

  if (!repoRes.ok) {
    throw new Error(`GitHub API error: ${repoRes.status} ${repoRes.statusText}. Check that the repository exists and is accessible.`);
  }

  const repoData: GitHubRepoResponse = await repoRes.json();
  const languages: GitHubLanguagesResponse = languagesRes.ok ? await languagesRes.json() : {};
  const branches: GitHubBranchResponse[] = branchesRes.ok ? await branchesRes.json() : [];
  const releases: GitHubReleaseResponseItem[] = releasesRes.ok ? await releasesRes.json() : [];
  const topics = repoData.topics || [];

  const detectedFramework = detectFramework(languages, topics);
  const overview = generateOverview(repoData.name, repoData.description, repoData.language, repoData.stargazers_count, repoData.forks_count, topics);
  const setupGuide = generateSetupGuide(repoData.language, topics);
  const folderExplanation = generateFolderExplanation(repoData);
  const missingFiles = suggestMissingFiles({ ...repoData, topics });

  return {
    name: repoData.name,
    description: repoData.description || "",
    url: repoData.html_url,
    languages,
    branches: branches.length,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    topics,
    issues: repoData.open_issues_count,
    releases: releases.length,
    detectedFramework,
    overview,
    setupGuide,
    folderExplanation,
    missingFiles,
    healthScore: calculateHealthScore(repoData),
    documentationScore: calculateDocumentationScore(repoData, topics),
    maintainabilityScore: calculateMaintainabilityScore(repoData),
  };
}
