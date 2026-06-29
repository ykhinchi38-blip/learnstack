#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const { v2: cloudinary } = require("cloudinary");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const TEMP_DIR = path.join(PROJECT_ROOT, "temp-samples");
const MANIFEST_PATH = path.join(PROJECT_ROOT, "src", "data", "sampleManifest.json");
const FAILURES_PATH = path.join(PROJECT_ROOT, "src", "data", "sampleFailures.json");
const ENV_PATH = path.join(PROJECT_ROOT, ".env.local");
const MAX_TOTAL_SAMPLE_PAGES = 14;
const DEFAULT_SOURCE_PAGES = 12;
const MAX_SAMPLE_UPLOAD_BYTES = Math.floor(9.5 * 1024 * 1024);
const PREVIEW_PAGE_ATTEMPTS = [12, 10, 8, 6, 4, 2, 1];
const FOOTER_TEXT = "LearnStack Free Preview - Get the full book at learnstack.co.in";
const CTA_LINES = [
  "This was a free preview. Get the full book on LearnStack.",
  "Visit: https://www.learnstack.co.in",
  "Digital PDF delivery is handled through Gumroad email after purchase."
];

const FOLDER_CATEGORY_MAP = new Map([
  ["learnstack_handbook", "handbooks"],
  ["learnstack_handbooks", "handbooks"],
  ["learnstack_kids", "kids"],
  ["learnstack_other", "other"]
]);

const LIFE_CAREER_TERMS = [
  "learnstacklife",
  "life",
  "career",
  "communication",
  "conflict",
  "homesickness",
  "independence",
  "personal brand",
  "friends",
  "family",
  "etiquette",
  "side hustle",
  "presentation",
  "clarity",
  "relationship"
];

const BUSINESS_TERMS = ["mba", "business", "strategy", "marketing", "branding", "entrepreneur"];

const GENERIC_MATCH_WORDS = [
  "learnstackkids",
  "learnstack-kids",
  "learnstack",
  "kids",
  "handbooks",
  "handbook",
  "book",
  "pdf",
  "final",
  "kdp",
  "printready",
  "v1",
  "v2",
  "copy"
];

function parseArgs(argv) {
  const fileArg = argv.find((arg) => arg.startsWith("--file="));
  const limitArg = argv.find((arg) => arg.startsWith("--limit="));
  const limitValue = limitArg ? Number.parseInt(limitArg.slice("--limit=".length), 10) : null;

  if (limitArg && (!Number.isInteger(limitValue) || limitValue < 1)) {
    throw new Error("--limit must be a positive number, for example: --limit=1");
  }

  return {
    dryRun: argv.includes("--dry-run"),
    debug: argv.includes("--debug"),
    failedOnly: argv.includes("--failed-only"),
    missingOnly: argv.includes("--missing-only"),
    file: fileArg ? fileArg.slice("--file=".length).replace(/^["']|["']$/g, "").trim() : "",
    limit: limitValue
  };
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 0) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key && !Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key] = value;
    }
  });
}

function getMissingEnvNames(names) {
  return names.filter((name) => !process.env[name]);
}

function assertRequiredEnv(names) {
  const missing = getMissingEnvNames(names);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

function readEnv(name) {
  return process.env[name];
}

function normalizePath(value) {
  return path.resolve(String(value || "").replace(/^["']|["']$/g, ""));
}

function isSameOrInside(childPath, parentPath) {
  const child = path.resolve(childPath);
  const parent = path.resolve(parentPath);
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function assertSafeFullBooksDir(fullBooksDir) {
  if (!fs.existsSync(fullBooksDir)) {
    throw new Error(`FULL_BOOKS_DIR does not exist: ${fullBooksDir}`);
  }

  if (!fs.statSync(fullBooksDir).isDirectory()) {
    throw new Error("FULL_BOOKS_DIR must point to a directory.");
  }

  const blockedProjectDirs = [
    PROJECT_ROOT,
    path.join(PROJECT_ROOT, "public"),
    path.join(PROJECT_ROOT, "src"),
    path.join(PROJECT_ROOT, "app"),
    path.join(PROJECT_ROOT, ".next"),
    path.join(PROJECT_ROOT, "components"),
    path.join(PROJECT_ROOT, "data"),
    path.join(PROJECT_ROOT, "lib"),
    path.join(PROJECT_ROOT, "styles"),
    path.join(PROJECT_ROOT, "pages")
  ];

  const blockedMatch = blockedProjectDirs.find((blockedDir) => fs.existsSync(blockedDir) && isSameOrInside(fullBooksDir, blockedDir));
  if (blockedMatch) {
    throw new Error(`FULL_BOOKS_DIR must not be inside a deployable website folder: ${blockedMatch}`);
  }
}

function warnAboutPublicPdfs() {
  const publicDir = path.join(PROJECT_ROOT, "public");
  if (!fs.existsSync(publicDir)) return [];

  const pdfs = scanPdfFiles(publicDir);
  const warnings = pdfs.filter((filePath) => {
    const name = path.basename(filePath).toLowerCase();
    return !name.includes("sample") || name.includes("full");
  });

  warnings.forEach((filePath) => {
    console.warn(`Warning: PDF found in public/. Confirm it is not a paid full PDF: ${path.relative(PROJECT_ROOT, filePath)}`);
  });

  return warnings;
}

function scanPdfFiles(rootDir) {
  const files = [];
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  entries.forEach((entry) => {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanPdfFiles(entryPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
      files.push(entryPath);
    }
  });

  return files;
}

function isSecureCloudinaryUrl(value = "") {
  return /^https:\/\/res\.cloudinary\.com\//i.test(value || "") && !/collection\.cloudinary\.com/i.test(value || "");
}

function hasSuccessfulManifestEntry(item) {
  return Boolean(item?.sampleUrl && isSecureCloudinaryUrl(item.sampleUrl));
}

function selectPdfFiles(pdfFiles, args, manifestBySourceSlug, failuresBySourceSlug) {
  let selectedFiles = [...pdfFiles].sort((a, b) => a.localeCompare(b));

  if (args.file) {
    const wanted = args.file.toLowerCase();
    const exactMatches = selectedFiles.filter((filePath) => path.basename(filePath).toLowerCase() === wanted);
    const partialMatches = exactMatches.length
      ? exactMatches
      : selectedFiles.filter((filePath) => path.basename(filePath).toLowerCase().includes(wanted));

    if (!partialMatches.length) {
      const available = selectedFiles.slice(0, 12).map((filePath) => path.basename(filePath)).join(", ");
      throw new Error(`No PDF matched --file="${args.file}". Available examples: ${available || "none"}`);
    }

    selectedFiles = partialMatches;
  }

  if (args.missingOnly) {
    selectedFiles = selectedFiles.filter((filePath) => {
      const sourceSlug = normalizeSourceSlug(path.basename(filePath));
      return !hasSuccessfulManifestEntry(manifestBySourceSlug.get(sourceSlug));
    });
  }

  if (args.failedOnly) {
    selectedFiles = selectedFiles.filter((filePath) => {
      const sourceSlug = normalizeSourceSlug(path.basename(filePath));
      return failuresBySourceSlug.has(sourceSlug) || !hasSuccessfulManifestEntry(manifestBySourceSlug.get(sourceSlug));
    });
  }

  if (args.limit) {
    selectedFiles = selectedFiles.slice(0, args.limit);
  }

  return selectedFiles;
}

function normalizeSourceSlug(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/&/g, " and ")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeMatchSlug(value = "") {
  let slug = normalizeSourceSlug(value);

  GENERIC_MATCH_WORDS.forEach((word) => {
    const normalizedWord = normalizeSourceSlug(word);
    slug = slug.replace(new RegExp(`(^|-)${normalizedWord}(?=-|$)`, "g"), "$1");
  });

  return slug.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function titleFromFileName(fileName) {
  return path.basename(fileName, path.extname(fileName))
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  const file = fs.readFileSync(filePath);
  hash.update(file);
  return hash.digest("hex");
}

function normalizeFolderName(value = "") {
  return String(value || "").toLowerCase();
}

function detectBaseCategory(filePath, fullBooksDir) {
  const relativeParts = path.relative(fullBooksDir, filePath).split(path.sep);
  const folderMatch = relativeParts
    .slice(0, -1)
    .map(normalizeFolderName)
    .find((folderName) => FOLDER_CATEGORY_MAP.has(folderName));

  return folderMatch ? FOLDER_CATEGORY_MAP.get(folderMatch) : "other";
}

function containsAnyTerm(value, terms) {
  const text = String(value || "").toLowerCase().replace(/[_-]+/g, " ");
  return terms.some((term) => text.includes(term));
}

function detectCategory(filePath, fullBooksDir) {
  const baseCategory = detectBaseCategory(filePath, fullBooksDir);
  const fileName = path.basename(filePath);

  if (baseCategory === "kids") return "kids";
  if (baseCategory === "handbooks") return "handbooks";
  if (containsAnyTerm(fileName, BUSINESS_TERMS)) return "business-mba";
  if (containsAnyTerm(fileName, LIFE_CAREER_TERMS)) return "life-career";

  return "other";
}

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return [];

  const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  return Array.isArray(parsed) ? parsed : [];
}

function readFailures() {
  if (!fs.existsSync(FAILURES_PATH)) return [];

  const parsed = JSON.parse(fs.readFileSync(FAILURES_PATH, "utf8"));
  return Array.isArray(parsed) ? parsed : [];
}

function writeManifest(items) {
  const safeItems = items.map((item) => ({
    sourceSlug: item.sourceSlug,
    matchSlug: item.matchSlug,
    category: item.category,
    title: item.title,
    sampleUrl: item.sampleUrl,
    cloudinaryPublicId: item.cloudinaryPublicId,
    sourceFileName: item.sourceFileName,
    sourceHash: item.sourceHash,
    generatedAt: item.generatedAt,
    samplePageCount: item.samplePageCount
  }));

  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(safeItems, null, 2)}\n`, "utf8");
}

function writeFailures(items) {
  const safeItems = items.map((item) => ({
    sourceFileName: item.sourceFileName,
    sourceSlug: item.sourceSlug,
    category: item.category,
    reason: item.reason,
    lastAttemptedSizeMB: item.lastAttemptedSizeMB,
    generatedAt: item.generatedAt
  }));

  fs.writeFileSync(FAILURES_PATH, `${JSON.stringify(safeItems, null, 2)}\n`, "utf8");
}

function assertSafeSampleUrl(url) {
  if (!/^https:\/\/res\.cloudinary\.com\//i.test(url || "")) {
    throw new Error("Cloudinary upload did not return a valid res.cloudinary.com secure_url.");
  }

  if (/collection\.cloudinary\.com/i.test(url)) {
    throw new Error("Cloudinary collection links are not allowed as sample URLs.");
  }
}

function assertGeneratedSampleForUpload(samplePath) {
  const resolved = path.resolve(samplePath);
  if (!isSameOrInside(resolved, TEMP_DIR)) {
    throw new Error("Refusing upload because sample file is outside temp-samples/.");
  }

  if (!resolved.endsWith(".tmp.pdf")) {
    throw new Error("Refusing upload because generated sample file does not use .tmp.pdf suffix.");
  }
}

function fitText(text, maxChars = 120) {
  const value = String(text || "");
  return value.length <= maxChars ? value : `${value.slice(0, maxChars - 3)}...`;
}

function bytesToMB(bytes) {
  return Number((bytes / (1024 * 1024)).toFixed(2));
}

function formatMB(bytes) {
  return `${bytesToMB(bytes)} MB`;
}

async function generateSamplePdf(sourcePdfPath, outputPdfPath, requestedPreviewPages = DEFAULT_SOURCE_PAGES) {
  const sourceBytes = fs.readFileSync(sourcePdfPath);
  const sourcePdf = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
  const sourcePageCount = sourcePdf.getPageCount();
  const samplePageLimit = Math.min(requestedPreviewPages, sourcePageCount, MAX_TOTAL_SAMPLE_PAGES - 1);
  const outputPdf = await PDFDocument.create();
  const font = await outputPdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await outputPdf.embedFont(StandardFonts.HelveticaBold);
  let copiedPages = 0;

  for (let index = 0; index < samplePageLimit; index += 1) {
    try {
      const [page] = await outputPdf.copyPages(sourcePdf, [index]);
      outputPdf.addPage(page);
      copiedPages += 1;
    } catch (error) {
      console.warn(`Warning: skipped invalid page ${index + 1} in ${path.basename(sourcePdfPath)}: ${error.message}`);
    }
  }

  if (copiedPages === 0) {
    throw new Error("No readable pages could be copied from source PDF.");
  }

  outputPdf.getPages().forEach((page, index) => {
    const { width } = page.getSize();
    const footer = `${FOOTER_TEXT} | Page ${index + 1}`;
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height: 28,
      color: rgb(1, 1, 1),
      opacity: 0.86
    });
    page.drawText(fitText(footer, 110), {
      x: 28,
      y: 10,
      size: 8,
      font,
      color: rgb(0.05, 0.1, 0.22)
    });
  });

  const ctaPage = outputPdf.addPage();
  const { width, height } = ctaPage.getSize();
  ctaPage.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.96, 0.9)
  });
  ctaPage.drawText("LearnStack Free Preview", {
    x: 52,
    y: height - 120,
    size: 28,
    font: boldFont,
    color: rgb(0.05, 0.1, 0.22)
  });
  CTA_LINES.forEach((line, index) => {
    ctaPage.drawText(line, {
      x: 52,
      y: height - 175 - (index * 30),
      size: index === 0 ? 14 : 12,
      font: index === 0 ? boldFont : font,
      color: rgb(0.05, 0.1, 0.22)
    });
  });
  ctaPage.drawText(FOOTER_TEXT, {
    x: 52,
    y: 48,
    size: 9,
    font,
    color: rgb(0.05, 0.1, 0.22)
  });

  const samplePageCount = outputPdf.getPageCount();
  if (samplePageCount > MAX_TOTAL_SAMPLE_PAGES) {
    throw new Error(`Generated sample has ${samplePageCount} pages, exceeding the 14-page limit.`);
  }

  const outputBytes = await outputPdf.save();
  fs.writeFileSync(outputPdfPath, outputBytes);

  return {
    samplePageCount,
    previewPageCount: copiedPages
  };
}

async function generateAdaptiveSamplePdf(sourcePdfPath, outputPdfPath) {
  let lastAttempt = null;

  for (const previewPages of PREVIEW_PAGE_ATTEMPTS) {
    if (fs.existsSync(outputPdfPath)) fs.unlinkSync(outputPdfPath);

    const result = await generateSamplePdf(sourcePdfPath, outputPdfPath, previewPages);
    const sampleBytes = fs.statSync(outputPdfPath).size;
    const totalLabel = `${result.samplePageCount}-page sample`;
    const attempt = {
      ...result,
      sampleBytes,
      sampleSizeMB: bytesToMB(sampleBytes)
    };

    lastAttempt = attempt;

    if (sampleBytes <= MAX_SAMPLE_UPLOAD_BYTES) {
      console.log(`${totalLabel} = ${formatMB(sampleBytes)}, uploading`);
      return attempt;
    }

    console.log(`${totalLabel} = ${formatMB(sampleBytes)}, too large`);
    if (previewPages !== PREVIEW_PAGE_ATTEMPTS.at(-1)) {
      const nextPreviewPages = PREVIEW_PAGE_ATTEMPTS[PREVIEW_PAGE_ATTEMPTS.indexOf(previewPages) + 1];
      console.log(`Reducing preview pages to ${nextPreviewPages}.`);
    }
  }

  const error = new Error("Sample still larger than 9.5 MB even at 1 preview page + CTA");
  error.lastAttemptedSizeMB = lastAttempt?.sampleSizeMB || 0;
  throw error;
}

async function uploadSample({ samplePath, sourceSlug, category, cloudinaryFolder }) {
  assertGeneratedSampleForUpload(samplePath);

  const result = await cloudinary.uploader.upload(samplePath, {
    resource_type: "raw",
    folder: `${cloudinaryFolder}/${category}`,
    public_id: `${sourceSlug}-sample`,
    overwrite: true,
    use_filename: false,
    unique_filename: false
  });

  assertSafeSampleUrl(result.secure_url);

  return {
    sampleUrl: result.secure_url,
    cloudinaryPublicId: result.public_id || `${cloudinaryFolder}/${category}/${sourceSlug}-sample`
  };
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: readEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: readEnv("CLOUDINARY_API_KEY"),
    api_secret: readEnv("CLOUDINARY_API_SECRET"),
    secure: true
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  loadEnvFile(ENV_PATH);

  assertRequiredEnv(args.dryRun
    ? ["FULL_BOOKS_DIR"]
    : ["FULL_BOOKS_DIR", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "CLOUDINARY_SAMPLE_FOLDER"]);

  const fullBooksDir = normalizePath(readEnv("FULL_BOOKS_DIR"));
  const cloudinaryFolder = readEnv("CLOUDINARY_SAMPLE_FOLDER") || "learnstack/samples";

  assertSafeFullBooksDir(fullBooksDir);
  if (!args.dryRun) configureCloudinary();

  fs.mkdirSync(TEMP_DIR, { recursive: true });
  warnAboutPublicPdfs();

  const existingManifest = readManifest();
  const existingFailures = readFailures();
  const manifestBySourceSlug = new Map(existingManifest.map((item) => [item.sourceSlug, item]));
  const nextManifestBySourceSlug = new Map(existingManifest.map((item) => [item.sourceSlug, item]));
  const failuresBySourceSlug = new Map(existingFailures.map((item) => [item.sourceSlug, item]));
  const nextFailuresBySourceSlug = new Map(existingFailures.map((item) => [item.sourceSlug, item]));
  const pdfFiles = scanPdfFiles(fullBooksDir);
  const selectedPdfFiles = selectPdfFiles(pdfFiles, args, manifestBySourceSlug, failuresBySourceSlug);
  const summary = {
    found: pdfFiles.length,
    selected: selectedPdfFiles.length,
    generated: 0,
    skipped: 0,
    uploaded: 0,
    errors: 0
  };

  console.log(`Scanning: FULL_BOOKS_DIR (${fullBooksDir})`);
  console.log(`Found PDFs: ${pdfFiles.length}`);
  if (args.file) console.log(`File filter: ${args.file}`);
  if (args.limit) console.log(`Limit: ${args.limit}`);
  if (args.failedOnly) console.log("Mode: failed-only");
  if (args.missingOnly) console.log("Mode: missing-only");
  console.log(`Selected PDFs: ${selectedPdfFiles.length}`);

  for (const sourcePdfPath of selectedPdfFiles) {
    const sourceFileName = path.basename(sourcePdfPath);
    const sourceSlug = normalizeSourceSlug(sourceFileName);
    const matchSlug = makeMatchSlug(sourceSlug);
    const category = detectCategory(sourcePdfPath, fullBooksDir);
    const title = titleFromFileName(sourceFileName);
    const sourceHash = sha256File(sourcePdfPath);
    const existing = manifestBySourceSlug.get(sourceSlug);
    const unchanged = existing?.sourceHash === sourceHash && hasSuccessfulManifestEntry(existing);
    const tempSamplePath = path.join(TEMP_DIR, `${sourceSlug}.tmp.pdf`);

    console.log("");
    console.log(`Selected PDF: ${sourceFileName}`);
    console.log(`Detected category: ${category}`);
    console.log(`sourceSlug: ${sourceSlug}`);
    console.log(`matchSlug: ${matchSlug}`);

    if (unchanged) {
      summary.skipped += 1;
      console.log("Action: skipped unchanged sample already in manifest.");
      nextFailuresBySourceSlug.delete(sourceSlug);
      continue;
    }

    console.log(args.dryRun ? "Action: would generate sample; upload skipped by dry-run." : "Action: generate sample and upload generated preview PDF.");

    try {
      const sampleResult = await generateAdaptiveSamplePdf(sourcePdfPath, tempSamplePath);
      const samplePageCount = sampleResult.samplePageCount;
      summary.generated += 1;

      if (args.dryRun) {
        console.log(`[dry-run] Generated sample for ${sourceFileName} (${samplePageCount} pages, ${formatMB(sampleResult.sampleBytes)}); upload skipped.`);
        if (!args.debug && fs.existsSync(tempSamplePath)) fs.unlinkSync(tempSamplePath);
        continue;
      }

      const upload = await uploadSample({
        samplePath: tempSamplePath,
        sourceSlug,
        category,
        cloudinaryFolder
      });

      summary.uploaded += 1;
      nextFailuresBySourceSlug.delete(sourceSlug);
      nextManifestBySourceSlug.set(sourceSlug, {
        sourceSlug,
        matchSlug,
        category,
        title,
        sampleUrl: upload.sampleUrl,
        cloudinaryPublicId: upload.cloudinaryPublicId,
        sourceFileName,
        sourceHash,
        generatedAt: new Date().toISOString(),
        samplePageCount
      });

      console.log(`Uploaded sample: ${sourceFileName} -> ${upload.sampleUrl}`);
    } catch (error) {
      summary.errors += 1;
      nextFailuresBySourceSlug.set(sourceSlug, {
        sourceFileName,
        sourceSlug,
        category,
        reason: error.message,
        lastAttemptedSizeMB: error.lastAttemptedSizeMB || null,
        generatedAt: new Date().toISOString()
      });
      console.error(`Error: ${sourceFileName}: ${error.message}`);
    } finally {
      if (!args.debug && fs.existsSync(tempSamplePath)) {
        fs.unlinkSync(tempSamplePath);
      }
    }
  }

  if (!args.dryRun) {
    const sortedManifest = Array.from(nextManifestBySourceSlug.values())
      .sort((a, b) => `${a.category}:${a.title}`.localeCompare(`${b.category}:${b.title}`));
    writeManifest(sortedManifest);
    const sortedFailures = Array.from(nextFailuresBySourceSlug.values())
      .sort((a, b) => `${a.category}:${a.sourceFileName}`.localeCompare(`${b.category}:${b.sourceFileName}`));
    writeFailures(sortedFailures);
  }

  console.log("");
  console.log(`Scanning: FULL_BOOKS_DIR`);
  console.log(`Found PDFs: ${summary.found}`);
  console.log(`Selected PDFs: ${summary.selected}`);
  console.log(`Generated samples: ${summary.generated}`);
  console.log(`Skipped unchanged: ${summary.skipped}`);
  console.log(`Uploaded to Cloudinary: ${summary.uploaded}`);
  console.log(`Manifest updated: ${args.dryRun ? "not written in dry-run" : "src/data/sampleManifest.json"}`);
  console.log(`Errors: ${summary.errors}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
