import { getVerifiedUsdPrice, PRICE_VERIFICATION_NOTE } from "./pricing";

const rawProducts = [
  {
    id: "python-handbook",
    title: "Python",
    subtitle: "Complete Handbook",
    tagline: "Build your Python foundation with clean notes, examples, and projects.",
    edition: "2026 Edition",
    category: "Programming",
    audience: "regular",
    legacyPrice: 99,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/python_handbook",
    coverImage: "/images/covers/python-handbook.png",
    accentColor: "#2563EB",
    logoText: "PY",
    topics: ["Syntax", "Functions", "OOP", "Projects", "Interview Prep"],
    description: "A practical Python handbook for CSE students and self-learners who want clear explanations, useful examples, and revision-friendly notes. It covers the fundamentals and helps you move toward projects and interviews with confidence.",
    pages: "120+",
    badge: "Python",
    chapters: [
      { title: "Python Foundations", topics: 8 },
      { title: "Control Flow & Functions", topics: 7 },
      { title: "Data Structures", topics: 9 },
      { title: "OOP & Files", topics: 6 },
      { title: "Projects & Interview Practice", topics: 5 }
    ],
    faqs: [
      { q: "Is this beginner-friendly?", a: "Yes. It starts from basic concepts and gradually moves toward practical examples." },
      { q: "Is this a PDF I can download immediately?", a: "Yes. Gumroad delivers the PDF instantly after purchase." },
      { q: "Can I read it on mobile?", a: "Yes. The PDF works on mobile, tablet, laptop, and desktop." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "Python Complete Handbook 2026 | LearnStack",
    metaDescription: "Learn Python with a beginner-friendly PDF handbook for students, developers, projects, examples, revision notes, and interview prep."
  },
  {
    id: "numpy-pandas-handbook",
    title: "NumPy & Pandas",
    subtitle: "Data Analysis Handbook",
    tagline: "Turn raw data into useful insights with Python's data stack.",
    edition: "2026 Edition",
    category: "Data Science",
    audience: "regular",
    legacyPrice: 99,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/numpy-pandas-handbook",
    coverImage: "/images/covers/numpy-pandas-handbook.png",
    accentColor: "#15AABF",
    logoText: "NP",
    topics: ["Arrays", "DataFrames", "Cleaning", "Grouping", "Analysis"],
    description: "A clean PDF handbook for learning NumPy and Pandas from the ground up. It is designed for students who want practical examples, fast revision, and confidence while working with real data.",
    pages: "100+",
    badge: "Data Skills",
    chapters: [
      { title: "NumPy Foundations", topics: 6 },
      { title: "Pandas Series & DataFrames", topics: 7 },
      { title: "Cleaning & Transformations", topics: 8 },
      { title: "Grouping & Aggregation", topics: 5 },
      { title: "Practical Data Workflows", topics: 5 }
    ],
    faqs: [
      { q: "Do I need advanced Python?", a: "No. Basic Python knowledge is enough to start." },
      { q: "Is this useful for data science beginners?", a: "Yes. It focuses on practical data analysis concepts used by beginners." },
      { q: "How do I get the file?", a: "The PDF is delivered automatically through Gumroad after purchase." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "NumPy and Pandas Data Analysis Handbook | LearnStack",
    metaDescription: "Master NumPy and Pandas with a practical PDF handbook for Python data analysis, examples, revision, cleaning, and DataFrames."
  },
  {
    id: "javascript-handbook",
    title: "JavaScript",
    subtitle: "Modern JS Handbook",
    tagline: "Learn the language that powers modern web development.",
    edition: "2026 Edition",
    category: "Web Development",
    audience: "regular",
    legacyPrice: 99,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/javascript_handbook",
    coverImage: "/images/covers/javascript-handbook.png",
    accentColor: "#F5C842",
    logoText: "JS",
    topics: ["DOM", "Functions", "Objects", "Async JS", "Projects"],
    description: "A modern JavaScript handbook for students and aspiring web developers. Learn the core concepts, browser fundamentals, and practical patterns needed to build real-world web projects.",
    pages: "110+",
    badge: "Web Dev",
    chapters: [
      { title: "JavaScript Basics", topics: 8 },
      { title: "Functions & Scope", topics: 7 },
      { title: "Objects & Arrays", topics: 6 },
      { title: "DOM & Events", topics: 7 },
      { title: "Async JavaScript", topics: 5 }
    ],
    faqs: [
      { q: "Is this for complete beginners?", a: "Yes. It starts with fundamentals and builds up to practical browser concepts." },
      { q: "Does it include projects?", a: "Yes. It includes project-style learning sections and examples." },
      { q: "Can I use it for revision?", a: "Yes. It is structured for fast revision and repeated reference." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "JavaScript Modern Handbook 2026 | LearnStack",
    metaDescription: "Learn JavaScript with a modern PDF handbook for students, web developers, DOM, async JS, projects, and fast revision."
  },
  {
    id: "cpp-handbook",
    title: "C++",
    subtitle: "Complete Handbook",
    tagline: "Understand C++ fundamentals, OOP, STL, and interview concepts.",
    edition: "2026 Edition",
    category: "Programming",
    audience: "regular",
    legacyPrice: 99,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/cpp_handbook",
    coverImage: "/images/covers/cpp-handbook.png",
    accentColor: "#3B82F6",
    logoText: "C++",
    topics: ["OOP", "STL", "Pointers", "Files", "Interview Prep"],
    description: "A student-friendly C++ handbook designed to explain core programming concepts, object-oriented programming, STL usage, and interview-level foundations in a clean PDF format.",
    pages: "130+",
    badge: "Programming",
    chapters: [
      { title: "C++ Fundamentals", topics: 7 },
      { title: "Functions & Arrays", topics: 6 },
      { title: "Object-Oriented Programming", topics: 8 },
      { title: "STL Essentials", topics: 7 },
      { title: "Interview Practice", topics: 5 }
    ],
    faqs: [
      { q: "Does it cover OOP?", a: "Yes. It covers classes, objects, inheritance, polymorphism, and related concepts." },
      { q: "Is STL included?", a: "Yes. The handbook includes essential STL concepts for students." },
      { q: "Is this instantly delivered?", a: "Yes. Gumroad delivers the PDF instantly." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "C++ Complete Handbook 2026 | LearnStack",
    metaDescription: "Learn C++ with a complete PDF handbook covering fundamentals, OOP, STL, examples, revision notes, and interview preparation."
  },
  {
    id: "dsa-handbook",
    title: "DSA",
    subtitle: "Interview Handbook",
    tagline: "Learn patterns, data structures, algorithms, and problem-solving basics.",
    edition: "2026 Edition",
    category: "Career & Interview Prep",
    audience: "regular",
    legacyPrice: 99,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/dsa_handbook",
    coverImage: "/images/covers/dsa-handbook.png",
    accentColor: "#7C3AED",
    logoText: "DSA",
    topics: ["Arrays", "Stacks", "Trees", "Graphs", "Patterns"],
    description: "A practical DSA handbook for students preparing for coding rounds and interviews. It explains important structures, problem-solving patterns, and revision notes in a focused PDF format.",
    pages: "140+",
    badge: "Interview Prep",
    chapters: [
      { title: "DSA Foundations", topics: 5 },
      { title: "Linear Data Structures", topics: 8 },
      { title: "Trees & Graphs", topics: 7 },
      { title: "Algorithms & Patterns", topics: 8 },
      { title: "Practice Roadmap", topics: 4 }
    ],
    faqs: [
      { q: "Is this suitable for beginners?", a: "Yes. It explains concepts clearly before moving into problem patterns." },
      { q: "Can it help for interviews?", a: "Yes. It is designed for revision and interview preparation." },
      { q: "Does it include patterns?", a: "Yes. It includes important problem-solving patterns and notes." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "DSA Interview Handbook for Students | LearnStack",
    metaDescription: "Prepare for DSA interviews with a practical PDF handbook covering arrays, stacks, trees, graphs, algorithms, and patterns."
  },
  {
    id: "sql-handbook",
    title: "SQL",
    subtitle: "Database Handbook",
    tagline: "Learn queries, joins, functions, and database thinking.",
    edition: "2026 Edition",
    category: "Data Science",
    audience: "regular",
    legacyPrice: 99,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/learnstack_sql_handbook",
    coverImage: "/images/covers/sql-handbook.png",
    accentColor: "#0EA5E9",
    logoText: "SQL",
    topics: ["Queries", "Joins", "Functions", "Subqueries", "Practice"],
    description: "A clear SQL handbook for beginners who want to understand database queries, joins, aggregate functions, filtering, and real examples for projects and interviews.",
    pages: "100+",
    badge: "Database",
    chapters: [
      { title: "SQL Basics", topics: 6 },
      { title: "Filtering & Sorting", topics: 5 },
      { title: "Joins & Relationships", topics: 7 },
      { title: "Functions & Groups", topics: 6 },
      { title: "Interview Practice", topics: 5 }
    ],
    faqs: [
      { q: "Do I need a database installed?", a: "No. You can read the concepts first and practice later using any SQL environment." },
      { q: "Are joins covered?", a: "Yes. Joins are explained with beginner-friendly examples." },
      { q: "Is it useful for data roles?", a: "Yes. SQL is useful for data analysis, backend, and interview preparation." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "SQL Database Handbook for Beginners | LearnStack",
    metaDescription: "Learn SQL with a beginner-friendly PDF handbook covering queries, joins, functions, subqueries, examples, and interview revision."
  },
  {
    id: "git-github-handbook",
    title: "Git & GitHub",
    subtitle: "Version Control Handbook",
    tagline: "Learn the workflow developers use to build and collaborate.",
    edition: "2026 Edition",
    category: "Developer Tools",
    audience: "regular",
    legacyPrice: 99,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/learnstack_git_github_handbook",
    coverImage: "/images/covers/git-github-handbook.png",
    accentColor: "#F97316",
    logoText: "GIT",
    topics: ["Commits", "Branches", "Merge", "GitHub", "Workflow"],
    description: "A practical Git and GitHub handbook for students and developers who want to understand version control, branches, commits, collaboration workflows, and project publishing.",
    pages: "90+",
    badge: "Developer Tool",
    chapters: [
      { title: "Version Control Basics", topics: 4 },
      { title: "Git Commands", topics: 9 },
      { title: "Branches & Merging", topics: 6 },
      { title: "GitHub Workflow", topics: 7 },
      { title: "Project Publishing", topics: 4 }
    ],
    faqs: [
      { q: "Is GitHub included?", a: "Yes. It includes GitHub workflow and project publishing basics." },
      { q: "Is this practical?", a: "Yes. It focuses on commands and workflows developers actually use." },
      { q: "Can beginners use it?", a: "Yes. It starts from the meaning of version control." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "Git and GitHub Handbook for Developers | LearnStack",
    metaDescription: "Learn Git and GitHub with a practical PDF handbook covering commits, branches, merge, workflows, and project publishing."
  },
  {
    id: "system-design-handbook",
    title: "System Design",
    subtitle: "Interview Handbook",
    tagline: "Understand scalable systems with beginner-friendly architecture notes.",
    edition: "2026 Edition",
    category: "Career & Interview Prep",
    audience: "regular",
    legacyPrice: 99,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/system_design_handbook",
    coverImage: "/images/covers/system-design-handbook.png",
    accentColor: "#0D1B2A",
    logoText: "SYS",
    topics: ["Scalability", "Caching", "Databases", "APIs", "Design"],
    description: "A beginner-friendly system design handbook for students and developers who want to understand architecture, scalability, caching, databases, and interview-ready design concepts.",
    pages: "120+",
    badge: "Architecture",
    chapters: [
      { title: "System Design Foundations", topics: 5 },
      { title: "Scalability Concepts", topics: 7 },
      { title: "Databases & Caching", topics: 8 },
      { title: "APIs & Services", topics: 6 },
      { title: "Interview Patterns", topics: 5 }
    ],
    faqs: [
      { q: "Is this only for experienced engineers?", a: "No. It is written for students and beginners who want a simple starting point." },
      { q: "Does it include interview concepts?", a: "Yes. It includes interview-oriented notes and system thinking." },
      { q: "Is it a downloadable PDF?", a: "Yes. It is delivered instantly through Gumroad." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "System Design Handbook for Beginners | LearnStack",
    metaDescription: "Learn system design with a beginner-friendly PDF handbook covering scalability, caching, databases, APIs, and interviews."
  },
  {
    id: "api-development-guide",
    title: "API Development",
    subtitle: "Practical Guide",
    tagline: "Learn REST, requests, responses, auth, and backend workflows.",
    edition: "2026 Edition",
    category: "Web Development",
    audience: "regular",
    legacyPrice: 99,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/learnstack_api_handbook",
    coverImage: "/images/covers/api-development-guide.png",
    accentColor: "#10B981",
    logoText: "API",
    topics: ["REST", "HTTP", "Auth", "JSON", "Backend"],
    description: "A practical API development guide for students and developers learning backend concepts. It explains REST APIs, HTTP methods, request-response flow, authentication, and real development workflows.",
    pages: "95+",
    badge: "Backend",
    chapters: [
      { title: "API Foundations", topics: 5 },
      { title: "HTTP & REST", topics: 7 },
      { title: "Requests & Responses", topics: 6 },
      { title: "Authentication", topics: 5 },
      { title: "Backend Workflows", topics: 5 }
    ],
    faqs: [
      { q: "Is this good for backend beginners?", a: "Yes. It explains API concepts in a beginner-friendly way." },
      { q: "Does it cover REST?", a: "Yes. REST concepts and HTTP methods are included." },
      { q: "How is it delivered?", a: "The PDF is delivered instantly by Gumroad." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "API Development Practical Guide | LearnStack",
    metaDescription: "Learn API development with a practical PDF guide covering REST, HTTP, authentication, JSON, backend workflows, and examples."
  },
  {
    id: "seaborn-python-handbook",
    title: "Seaborn Python",
    subtitle: "Visualization Handbook",
    tagline: "Create better plots and understand data visualization faster.",
    edition: "2026 Edition",
    category: "Data Science",
    audience: "regular",
    legacyPrice: 99,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/seaborn_python",
    coverImage: "/images/covers/seaborn-python-handbook.png",
    accentColor: "#14B8A6",
    logoText: "SEA",
    topics: ["Plots", "Styling", "Categories", "Distributions", "Data Viz"],
    description: "A Seaborn Python handbook for learning practical data visualization. It explains common plot types, styling, categorical plots, distribution plots, and useful patterns for data analysis.",
    pages: "80+",
    badge: "Visualization",
    chapters: [
      { title: "Seaborn Basics", topics: 5 },
      { title: "Relational Plots", topics: 4 },
      { title: "Categorical Plots", topics: 6 },
      { title: "Distribution Plots", topics: 5 },
      { title: "Practical Visualization", topics: 5 }
    ],
    faqs: [
      { q: "Do I need Matplotlib knowledge?", a: "Basic plotting knowledge helps, but the handbook explains Seaborn directly." },
      { q: "Is this useful for data analysis?", a: "Yes. It focuses on plots used in practical data analysis." },
      { q: "Is it delivered instantly?", a: "Yes. Gumroad delivers the PDF after purchase." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "Seaborn Python Visualization Handbook | LearnStack",
    metaDescription: "Learn Seaborn Python with a practical PDF handbook for plots, styling, distribution charts, categorical plots, and data visualization."
  },
  {
    id: "kids-coding-adventures",
    title: "Coding Adventures",
    subtitle: "Python Stories for Kids",
    tagline: "Story-based coding activities for curious 8-12 year olds.",
    edition: "Kids Edition",
    category: "Kids Coding",
    audience: "kids",
    legacyPrice: 149,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/kids-coding-adventures",
    accentColor: "#FF8FAB",
    logoText: "K1",
    topics: ["Logic", "Stories", "Puzzles", "Python"],
    description: "A friendly coding workbook that introduces children to programming ideas through short stories, puzzles, and guided Python-style activities parents can follow along with.",
    pages: "70+",
    badge: "Ages 8-12",
    chapters: [
      { title: "Meet the Coding Crew", topics: 4 },
      { title: "Patterns and Instructions", topics: 5 },
      { title: "Tiny Python Ideas", topics: 6 },
      { title: "Logic Puzzles", topics: 5 },
      { title: "Build a Mini Adventure", topics: 4 }
    ],
    faqs: [
      { q: "Does my child need coding experience?", a: "No. The activities start with simple logic and guided examples." },
      { q: "Can parents help without coding knowledge?", a: "Yes. The explanations are written to be parent-friendly." },
      { q: "How is the book delivered?", a: "Gumroad delivers the PDF instantly after purchase." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "Coding Adventures for Kids | LearnStack",
    metaDescription: "A friendly LearnStack kids coding PDF with stories, puzzles, and beginner programming activities for ages 8-12."
  },
  {
    id: "scratch-projects-for-kids",
    title: "Scratch Projects",
    subtitle: "Creative Coding Workbook",
    tagline: "Colorful project prompts for games, animations, and creative logic.",
    edition: "Kids Edition",
    category: "Kids Coding",
    audience: "kids",
    legacyPrice: 129,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/scratch-projects-for-kids",
    accentColor: "#7CDEDC",
    logoText: "K2",
    topics: ["Scratch", "Games", "Animation", "Creativity"],
    description: "A project-first workbook that helps kids plan simple Scratch games and animations while learning loops, events, conditions, and creative problem solving.",
    pages: "65+",
    badge: "Creative",
    chapters: [
      { title: "Project Planning", topics: 4 },
      { title: "Sprites and Scenes", topics: 5 },
      { title: "Events and Motion", topics: 6 },
      { title: "Game Rules", topics: 5 },
      { title: "Share Your Project", topics: 3 }
    ],
    faqs: [
      { q: "Is Scratch required?", a: "The workbook is designed around Scratch-style projects and planning." },
      { q: "Is it suitable for school projects?", a: "Yes. The project prompts are clear and presentation-friendly." },
      { q: "Is this a downloadable PDF?", a: "Yes. Gumroad provides instant PDF delivery." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "Scratch Projects for Kids | LearnStack",
    metaDescription: "A LearnStack kids workbook for Scratch projects, games, animations, loops, events, and creative coding practice."
  },
  {
    id: "computer-basics-for-kids",
    title: "Computer Basics",
    subtitle: "Friendly Tech Handbook",
    tagline: "A gentle introduction to computers, internet safety, and digital habits.",
    edition: "Kids Edition",
    category: "Kids Digital Skills",
    audience: "kids",
    legacyPrice: 119,
    legacyPriceSource: "pre-usd-catalog",
    price: null,
    currency: "USD",
    priceDisplay: "",
    gumroadUrl: "https://learnstacks.gumroad.com/l/computer-basics-for-kids",
    accentColor: "#FFD166",
    logoText: "K3",
    topics: ["Computers", "Internet Safety", "Files", "Digital Habits"],
    description: "A warm, parent-friendly handbook that teaches kids basic computer vocabulary, safe internet habits, file organization, and responsible digital learning.",
    pages: "60+",
    badge: "Parent Pick",
    chapters: [
      { title: "What Is a Computer?", topics: 5 },
      { title: "Keyboard and Mouse Basics", topics: 4 },
      { title: "Files and Folders", topics: 5 },
      { title: "Internet Safety", topics: 6 },
      { title: "Healthy Digital Habits", topics: 4 }
    ],
    faqs: [
      { q: "Is this about coding?", a: "It focuses on computer basics and safe digital learning before coding." },
      { q: "Can younger kids use it?", a: "Yes, with parent guidance. It is written in a gentle, simple style." },
      { q: "Where do I download it?", a: "Gumroad sends the PDF download immediately after purchase." }
    ],
    previewImages: [
      "/images/previews/preview-placeholder-1.png",
      "/images/previews/preview-placeholder-2.png",
      "/images/previews/preview-placeholder-3.png"
    ],
    metaTitle: "Computer Basics for Kids | LearnStack",
    metaDescription: "A friendly LearnStack digital skills handbook for kids covering computers, internet safety, files, folders, and healthy digital habits."
  }
];

const products = rawProducts.map((product) => {
  const verifiedPrice = getVerifiedUsdPrice(product);

  return {
    ...product,
    legacyPrice: product.legacyPrice ?? product.price,
    legacyCurrency: product.legacyCurrency || (product.legacyPrice ? "pre-usd-catalog" : null),
    legacyPriceDisplay: product.priceDisplay,
    price: verifiedPrice,
    priceCents: verifiedPrice ? Math.round(verifiedPrice * 100) : 0,
    currency: "USD",
    pricingType: verifiedPrice ? "fixed" : "verification-required",
    priceDisplay: verifiedPrice ? `$${verifiedPrice.toFixed(2)}` : "",
    priceVerification: verifiedPrice ? null : PRICE_VERIFICATION_NOTE,
    productType: product.productType || ((product.audience || "regular") === "kids" ? "kids-book" : "handbook"),
    status: product.status || "published",
    featured: Boolean(product.featured),
    relatedProductIds: Array.isArray(product.relatedProductIds) ? product.relatedProductIds : []
  };
});

export const categories = [
  "Programming",
  "Web Development",
  "Data Science",
  "Career & Interview Prep",
  "Developer Tools",
  "AI & Productivity",
  "Roadmaps",
  "Kids Coding",
  "Kids Digital Skills"
];

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getLocalProducts() {
  return products;
}

export function getLocalProductById(id) {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category) {
  return products.filter((product) => product.category === category);
}

export function getProductsByAudience(audience) {
  return products.filter((product) => (product.audience || "regular") === audience);
}

export default products;
