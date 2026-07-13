export const bundleDefinitions = [
  {
    title: "Beginner Programming Starter Kit",
    includedProductAliases: [
      ["python", "python handbook", "python-handbook"],
      ["javascript", "javascript handbook", "javascript-handbook"],
      ["c++", "cpp", "c++ handbook", "cpp-handbook"],
      ["git & github", "git github", "git-github-handbook"]
    ],
    idealAudience: "Beginners who want a structured introduction to programming foundations and developer workflow.",
    prerequisites: "No prior programming experience is assumed. A computer and regular practice time are helpful.",
    outcomes: [
      "Build a foundation in programming concepts and syntax.",
      "Understand core JavaScript and C++ ideas alongside Python.",
      "Start using Git and GitHub in a practical learning workflow."
    ]
  },
  {
    title: "Programming Interview & Placement Bundle",
    includedProductAliases: [
      ["dsa", "dsa handbook", "dsa-handbook"],
      ["system design", "system design handbook", "system-design-handbook"],
      ["sql", "sql handbook", "sql-handbook"],
      ["git & github", "git github", "git-github-handbook"]
    ],
    idealAudience: "Students preparing for programming interviews, placement rounds, and focused technical revision.",
    prerequisites: "Basic familiarity with at least one programming language helps learners apply the interview material.",
    outcomes: [
      "Review common data-structure and algorithm patterns.",
      "Build a clearer foundation in SQL and system design discussions.",
      "Organize interview preparation with practical developer workflow notes."
    ]
  },
  {
    title: "MERN Stack Developer Bundle",
    includedProductAliases: [
      ["typescript handbook", "typescript"],
      ["react.js handbook", "react js handbook", "react handbook", "react.js"],
      ["node.js handbook", "node js handbook", "node handbook", "node.js"]
    ],
    idealAudience: "Learners building a practical JavaScript and MERN-stack development foundation.",
    prerequisites: "A working understanding of JavaScript fundamentals is recommended before starting the React and Node.js material.",
    outcomes: [
      "Use TypeScript more confidently in modern JavaScript projects.",
      "Build stronger frontend foundations with React.js.",
      "Understand Node.js concepts for server-side development."
    ]
  }
];

function normalizeBundleTitle(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getBundleDefinition(bundle = {}) {
  const title = normalizeBundleTitle(bundle.title || bundle.name);
  return bundleDefinitions.find((definition) => normalizeBundleTitle(definition.title) === title) || null;
}
