import type { ReadmeOptions, ReadmeTemplate } from "@/types";

const templates: Record<ReadmeTemplate, (opts: ReadmeOptions) => string> = {
  "Open Source": (o) => `# ${o.projectName}

${o.description}

## Features

${o.features.map((f) => `- ${f}`).join("\n")}

## Installation

\`\`\`bash
${o.installation}
\`\`\`

## Usage

\`\`\`bash
${o.usage}
\`\`\`

${o.screenshots.length ? `## Screenshots\n\n${o.screenshots.map((s) => `![Screenshot](${s})`).join("\n\n")}\n\n` : ""}

## Tech Stack

${o.techStack.map((t) => `- ${t}`).join("\n")}

## Contributing

${o.contributing}

## License

${o.license}

---

Made with ❤️ by the ${o.projectName} team`,
  SaaS: (o) => `# ${o.projectName}

> ${o.description}

## ✨ Features

${o.features.map((f) => `- ✨ ${f}`).join("\n")}

## 🚀 Quick Start

\`\`\`bash
${o.installation}
\`\`\`

## 📖 Usage

\`\`\`bash
${o.usage}
\`\`\`

## 🛠 Tech Stack

${o.techStack.map((t) => `- ${t}`).join("\n")}

## 🤝 Contributing

${o.contributing}

## 📄 License

${o.license}`,
  CLI: (o) => `# ${o.projectName}

\`\`\`
${o.description}
\`\`\`

## Installation

\`\`\`bash
${o.installation}
\`\`\`

## Usage

\`\`\`bash
${o.usage}
\`\`\`

## Commands

${o.features.map((f) => `- \`${f}\``).join("\n")}

## Tech Stack

${o.techStack.map((t) => `- ${t}`).join("\n")}

## License

${o.license}`,
  Library: (o) => `# ${o.projectName}

${o.description}

## Installation

\`\`\`bash
${o.installation}
\`\`\`

## API

${o.features.map((f) => `- **${f}**`).join("\n")}

## Usage

\`\`\`typescript
${o.usage}
\`\`\`

## Tech Stack

${o.techStack.map((t) => `- ${t}`).join("\n")}

## Contributing

${o.contributing}

## License

${o.license}`,
  API: (o) => `# ${o.projectName}

${o.description}

## Base URL

\`\`\`
https://api.example.com/v1
\`\`\`

## Authentication

\`\`\`bash
${o.installation}
\`\`\`

## Endpoints

${o.features.map((f) => `### \`${f}\``).join("\n\n")}

## Tech Stack

${o.techStack.map((t) => `- ${t}`).join("\n")}

## License

${o.license}`,
  "Mobile App": (o) => `# ${o.projectName}

${o.description}

## Features

${o.features.map((f) => `- 📱 ${f}`).join("\n")}

## Screenshots

${o.screenshots.length ? o.screenshots.map((s) => `![App Screenshot](${s})`).join("\n\n") : "*Coming soon*"}

## Tech Stack

${o.techStack.map((t) => `- ${t}`).join("\n")}

## Contributing

${o.contributing}

## License

${o.license}`,
};

export function generateReadme(opts: ReadmeOptions): string {
  const generator = templates[opts.template] || templates["Open Source"];
  return generator(opts);
}
