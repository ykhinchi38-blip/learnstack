const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const MATCHER_PATH = path.join(PROJECT_ROOT, "lib", "sampleMatching.js");
const MANIFEST_PATH = path.join(PROJECT_ROOT, "src", "data", "sampleManifest.json");
const ALIASES_PATH = path.join(PROJECT_ROOT, "src", "data", "sampleAliases.json");
const EXPECTED_SAMPLE_URL = "https://res.cloudinary.com/duehkebqg/raw/upload/v1782713268/learnstack/samples/handbooks/learnstack-ai-tools-handbook-sample.pdf";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadMatcher(sampleManifest, sampleAliases) {
  const matcherSource = fs.readFileSync(MATCHER_PATH, "utf8")
    .replace(/^import sampleManifest from .*?;\r?\n/, "")
    .replace(/^import sampleAliases from .*?;\r?\n/, "")
    .replace(/export function /g, "function ");

  const createMatcher = new Function(
    "sampleManifest",
    "sampleAliases",
    `${matcherSource}\nreturn { findSampleForProduct };`
  );

  return createMatcher(sampleManifest, sampleAliases);
}

function assertCurrentSample(sampleManifest) {
  const sample = sampleManifest.find((item) => item.sourceSlug === "learnstack-ai-tools-handbook");

  if (!sample) {
    throw new Error("Missing sampleManifest entry for sourceSlug: learnstack-ai-tools-handbook");
  }

  if (sample.matchSlug !== "ai-tools") {
    throw new Error(`Expected matchSlug ai-tools, found: ${sample.matchSlug}`);
  }

  if (sample.sampleUrl !== EXPECTED_SAMPLE_URL) {
    throw new Error("AI Tools sampleUrl does not match the expected Cloudinary secure_url.");
  }

  if (!sample.sampleUrl.startsWith("https://res.cloudinary.com/")) {
    throw new Error("AI Tools sampleUrl is not a Cloudinary secure_url.");
  }

  if (sample.sampleUrl.includes("collection.cloudinary.com")) {
    throw new Error("AI Tools sampleUrl is a Cloudinary collection URL, which is not allowed.");
  }

  return sample;
}

function resultForProduct(findSampleForProduct, product) {
  const result = findSampleForProduct(product);
  const sample = result.sample;

  return {
    productTitle: product.title,
    matched: Boolean(sample),
    matchedSourceSlug: sample?.sourceSlug || null,
    matchingMethod: sample ? result.level : "none",
    sampleUrl: sample?.sampleUrl || null,
    display: sample ? "View Free Sample" : "Sample preview coming soon"
  };
}

async function main() {
  process.env.NODE_ENV = "production";

  const sampleManifest = readJson(MANIFEST_PATH);
  const sampleAliases = readJson(ALIASES_PATH);
  const currentSample = assertCurrentSample(sampleManifest);
  const { findSampleForProduct } = loadMatcher(sampleManifest, sampleAliases);

  const testProducts = [
    { title: "LearnStack AI Tools Handbook" },
    { title: "AI Tools Handbook" },
    { title: "AI Tools Handbook: Learn Faster with Modern AI Tools" },
    { title: "Random Cooking Book for Beginners" }
  ];

  const results = testProducts.map((product) => resultForProduct(findSampleForProduct, product));

  console.log("Validated sampleManifest entry:");
  console.log(JSON.stringify({
    sourceSlug: currentSample.sourceSlug,
    matchSlug: currentSample.matchSlug,
    sampleUrl: currentSample.sampleUrl
  }, null, 2));

  console.log("");
  console.log("Sample matching results:");
  results.forEach((result) => {
    console.log(JSON.stringify(result, null, 2));
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
