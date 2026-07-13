function key(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/^the\s+/, "");
}

export const productOutcomes = {
  "python": [
    ["Write core Python programs", "Use syntax, control flow, functions, and data structures with confidence."],
    ["Organize object-oriented code", "Apply classes, files, and practical patterns in small programs."],
    ["Move from notes to practice", "Use projects and interview-focused revision to keep learning active."]
  ],
  "numpy pandas": [
    ["Work with arrays and DataFrames", "Use the foundations of NumPy and Pandas for structured data."],
    ["Clean and group data", "Apply common transformations, filtering, and aggregation workflows."],
    ["Read data with more confidence", "Practice the patterns used in practical data-analysis tasks."]
  ],
  "javascript": [
    ["Understand modern JavaScript", "Work with functions, objects, arrays, and browser fundamentals."],
    ["Build interactive pages", "Use the DOM, events, and asynchronous JavaScript in practical UI work."],
    ["Recognize project-ready patterns", "Apply core language concepts in real-world web development exercises."]
  ],
  "c": [
    ["Build a C++ foundation", "Understand core syntax, functions, arrays, and file handling."],
    ["Use object-oriented programming", "Work with classes and common OOP concepts in C++."],
    ["Apply STL essentials", "Use standard-library tools while preparing for programming practice."]
  ],
  "dsa": [
    ["Recognize key data structures", "Study linear structures, trees, graphs, and their common uses."],
    ["Approach coding patterns", "Practice structured problem-solving patterns for technical rounds."],
    ["Plan interview revision", "Use a focused roadmap to organize data-structure practice."]
  ],
  "sql": [
    ["Write useful SQL queries", "Use filtering, sorting, functions, and subqueries to work with data."],
    ["Understand joins and relationships", "Connect tables and reason about common database queries."],
    ["Practice for projects and interviews", "Build confidence with practical SQL examples and revision."]
  ],
  "git github": [
    ["Use version control confidently", "Understand commits, repositories, and everyday Git commands."],
    ["Work with branches and merges", "Handle common collaboration workflows without losing track of changes."],
    ["Publish projects with GitHub", "Use a clear workflow for sharing and maintaining code online."]
  ],
  "system design": [
    ["Understand system-design foundations", "Learn the role of services, APIs, data stores, and architecture choices."],
    ["Reason about scalability", "Explore caching, databases, and growth-focused design concepts."],
    ["Prepare for design discussions", "Use common patterns to structure interview and project conversations."]
  ],
  "api development": [
    ["Understand REST and HTTP", "Follow requests, responses, methods, and JSON in backend workflows."],
    ["Design clearer APIs", "Connect authentication and request-response patterns in practical services."],
    ["Work through backend concepts", "Use common development workflows to build confidence with APIs."]
  ],
  "seaborn python": [
    ["Choose useful plot types", "Use relational, categorical, and distribution plots for data exploration."],
    ["Improve chart readability", "Apply styling and practical visualization patterns with Seaborn."],
    ["Communicate data more clearly", "Use visual analysis to support everyday data work."]
  ],
  "typescript handbook": [
    ["Understand types and inference", "Use TypeScript to describe values and catch common mistakes earlier."],
    ["Type practical application code", "Work with functions, objects, arrays, classes, interfaces, and unions."],
    ["Use generics and utility types", "Build safer, more maintainable JavaScript applications."]
  ],
  "react js handbook": [
    ["Understand React foundations", "Work with components, props, state, and hooks."],
    ["Build reusable interfaces", "Structure forms and state into maintainable UI building blocks."],
    ["Connect apps to APIs", "Organize practical React projects around real data and interactions."]
  ],
  "node js handbook": [
    ["Understand Node.js workflows", "Learn asynchronous programming and server-side JavaScript basics."],
    ["Build backend APIs", "Work with Express-style routing, databases, and request handling."],
    ["Cover production foundations", "Explore authentication and deployment concepts for backend projects."]
  ],
  "coding adventures": [
    ["Explore programming through stories", "Connect simple coding ideas with friendly story-led activities."],
    ["Practice logic and patterns", "Use puzzles and guided prompts to build early problem-solving confidence."],
    ["Learn together", "Give parents and teachers simple moments for discussion and practice."]
  ],
  "scratch projects": [
    ["Plan creative Scratch projects", "Turn a game or animation idea into manageable project steps."],
    ["Explore events and motion", "Use core Scratch ideas such as sprites, scenes, loops, and conditions."],
    ["Build creative confidence", "Practice problem-solving through games and animations."]
  ],
  "computer basics": [
    ["Understand everyday computer tools", "Learn child-friendly vocabulary for devices, files, and folders."],
    ["Practice safer internet habits", "Explore responsible online behavior with parent-friendly guidance."],
    ["Build healthy digital routines", "Encourage thoughtful, confident use of technology."]
  ],
  "boy who collected kindness": [
    ["Explore everyday kindness", "Notice small choices that can make others feel seen and supported."],
    ["Build empathy", "Encourage children to think about how actions affect other people."],
    ["Start caring conversations", "Support reflection with parents, teachers, and families."]
  ],
  "girl who painted the wall": [
    ["Encourage self-expression", "Explore the feelings and choices behind creative expression."],
    ["Reflect on consequences", "Help children consider how their actions affect shared spaces."],
    ["Talk through choices", "Create a gentle opening for family or classroom discussion."]
  ],
  "boy who said sorry first": [
    ["Understand taking responsibility", "Explore why acknowledging a mistake can matter."],
    ["Practice empathy", "Consider another person's feelings after a disagreement."],
    ["Support healthy repair", "Use the story to start conversations about apology and trust."]
  ],
  "mango tree secret": [
    ["Encourage curiosity", "Explore questions, discovery, and careful observation through story."],
    ["Build reflective thinking", "Give children space to talk about what they notice and learn."],
    ["Share story-led discussion", "Support gentle reading conversations at home or in class."]
  ],
  "i don t want to try": [
    ["Explore resilience", "Talk about the feelings that can make a new task feel difficult."],
    ["Encourage confidence", "Help children notice small steps they can take when trying feels hard."],
    ["Support reflection", "Use the story to discuss effort, setbacks, and encouragement."]
  ],
  "festival of the long boat": [
    ["Explore culture and community", "Use story to learn about shared traditions and celebrations."],
    ["Encourage curiosity", "Invite children to ask questions about people, places, and customs."],
    ["Support discussion", "Create an accessible prompt for family or classroom conversation."]
  ],
  "conflict resolution peer relationships": [
    ["Recognize common conflict patterns", "Understand how everyday disagreements can affect relationships."],
    ["Practice clearer communication", "Explore constructive ways to respond, listen, and repair."],
    ["Build healthier peer connections", "Use practical reflection to support respectful relationships."]
  ],
  "communication playbook for couples": [
    ["Reflect on communication habits", "Notice patterns that can make important conversations harder."],
    ["Practice clearer conversations", "Explore ways to listen, express needs, and respond thoughtfully."],
    ["Support relationship reflection", "Use practical prompts to consider healthier communication choices."]
  ],
  "30 minute mba part 1": [
    ["Build practical business foundations", "Explore core ideas through a focused, accessible learning format."],
    ["Connect concepts to decisions", "Use structured material to think through everyday business questions."],
    ["Support self-directed learning", "Create a manageable path for continued business study."]
  ],
  "30 minute mba part 2": [
    ["Extend business understanding", "Build on core concepts with focused, practical study."],
    ["Think through business choices", "Use structured material to connect ideas with decisions."],
    ["Continue a guided learning path", "Keep progressing through concise self-study material."]
  ],
  "30 minute mba part 3": [
    ["Explore strategy and leadership", "Use focused material to consider teams, strategy, and business thinking."],
    ["Connect ideas across business topics", "Build a broader view of practical decision-making."],
    ["Continue structured self-study", "Use the resource as part of a clear learning sequence."]
  ],
  "beginner programming starter kit": [
    ["Build programming foundations", "Develop core concepts across the included beginner resources."],
    ["Follow a connected learning path", "Move from fundamentals into everyday developer workflow skills."],
    ["Practice with multiple perspectives", "Use connected books to support projects and continued learning."]
  ],
  "programming interview placement bundle": [
    ["Organize technical interview preparation", "Review connected data structures, SQL, system design, and workflow topics."],
    ["Strengthen technical foundations", "Practice common concepts used in coding and placement conversations."],
    ["Follow a focused revision path", "Use the included resources to structure regular preparation."]
  ],
  "mern stack developer bundle": [
    ["Connect modern JavaScript skills", "Build foundations across TypeScript, React, and Node.js."],
    ["Understand frontend and backend roles", "See how reusable UI and server-side concepts fit together."],
    ["Prepare for practical projects", "Follow a structured path toward full-stack development work."]
  ]
};

export function getProductOutcomes(product = {}) {
  const productKey = key(product.title || product.name || product.slug || product.id);
  const matchedKey = Object.keys(productOutcomes)
    .filter((outcomeKey) => productKey.includes(outcomeKey))
    .sort((left, right) => right.length - left.length)[0];
  const matches = productOutcomes[productKey] || productOutcomes[matchedKey] || [];

  return matches.map(([title, description]) => ({ title, description }));
}
