export const USD_PRICE_OVERRIDES = {
  "Conflict Resolution & Peer Relationships": 4.99,
  "Communication Playbook for Couples": 5.99,
  "30-Minute MBA Part 1": 4.99,
  "30-Minute MBA Part 2": 4.99,
  "30-Minute MBA Part 3": 4.99,
  "The Boy Who Collected Kindness": 4.99,
  "The Girl Who Painted the Wall": 4.99,
  "The Boy Who Said Sorry First": 3.99,
  "The Mango Tree Secret": 3.99,
  "I Don't Want to Try": 4.99,
  "Festival of the Long Boat": 3.99,
  "Beginner Programming Starter Kit": 16.99,
  "Programming Interview & Placement Bundle": 21.99,
  "MERN Stack Developer Bundle": 24.99,
  "TypeScript Handbook": 6.99,
  "React.js Handbook": 9.99,
  "Node.js Handbook": 9.99
};

export const PRICE_VERIFICATION_NOTE = "USD Gumroad price needs verification before it can be displayed publicly.";

function normalizeTitle(value) {
  return String(value || "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, "");
}

export function getVerifiedUsdPrice(product = {}) {
  const title = normalizeTitle(product.title || product.name);
  const match = Object.entries(USD_PRICE_OVERRIDES).find(([name]) => normalizeTitle(name) === title);

  return match ? match[1] : null;
}
