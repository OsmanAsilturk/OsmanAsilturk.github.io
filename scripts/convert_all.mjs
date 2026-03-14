import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

// Ham görseller üst klasördeki raw_rars altında:
// c:\Users\feyza\OneDrive\Music\Desktop\raw_rars
const RAW_ROOT = path.join(projectRoot, "..", "raw_rars");
const OUT_ROOT = path.join(projectRoot, "images", "projects");

const PROJECTS = {
  moritanya: { coverIndex: 11 },
  "istanbul-hastane": { coverIndex: 4 },
  "istanbul-hastane-2": { coverIndex: 2 },
  "karadag-santiye": { coverIndex: 8 },
  "mock-up": { coverIndex: 12 },
  "arnavutluk-mock-up": { coverIndex: 7 },
  "dubai-villa-montaj": { coverIndex: 8 },
  "hilton-jeddah": { coverIndex: 1 }
};

const VALID_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".PNG", ".JPG", ".JPEG", ".WEBP"]);

function parseIndexFromName(filename) {
  const base = path.basename(filename, path.extname(filename));
  const num = parseInt(base, 10);
  return Number.isNaN(num) ? null : num;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function convertImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outputPath);
}

async function processProject(slug, config) {
  const rawDir = path.join(RAW_ROOT, slug);
  const outDir = path.join(OUT_ROOT, slug);

  try {
    const stat = await fs.stat(rawDir);
    if (!stat.isDirectory()) {
      console.warn(`[skip] ${slug}: raw_rars/${slug} is not a directory`);
      return;
    }
  } catch {
    console.warn(`[skip] ${slug}: raw_rars/${slug} not found`);
    return;
  }

  const entries = await fs.readdir(rawDir, { withFileTypes: true });

  const imageFiles = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => VALID_EXT.has(path.extname(name)))
    .map((name) => ({ name, index: parseIndexFromName(name) }))
    .filter(({ index }) => index !== null)
    .sort((a, b) => a.index - b.index);

  if (!imageFiles.length) {
    console.warn(`[warn] ${slug}: no numbered images found`);
    return;
  }

  await ensureDir(outDir);

  // Convert all images to NN.webp
  for (const { name, index } of imageFiles) {
    const src = path.join(rawDir, name);
    const outName = `${String(index).padStart(2, "0")}.webp`;
    const dest = path.join(outDir, outName);
    console.log(`[convert] ${slug}: ${name} -> ${outName}`);
    await convertImage(src, dest);
  }

  // Cover image
  const coverIdx = config.coverIndex;
  if (coverIdx != null) {
    const coverCandidate = imageFiles.find(({ index }) => index === coverIdx);
    if (!coverCandidate) {
      console.warn(`[warn] ${slug}: cover index ${coverIdx} not found among images`);
    } else {
      const src = path.join(rawDir, coverCandidate.name);
      const coverOut = path.join(outDir, "cover.webp");
      console.log(`[cover] ${slug}: ${coverCandidate.name} -> cover.webp`);
      await convertImage(src, coverOut);
    }
  }
}

async function main() {
  console.log("Starting project image conversion...");
  await ensureDir(OUT_ROOT);

  for (const [slug, config] of Object.entries(PROJECTS)) {
    // eslint-disable-next-line no-await-in-loop
    await processProject(slug, config);
  }

  console.log("Image conversion completed.");
}

main().catch((err) => {
  console.error("Image conversion failed:", err);
  process.exitCode = 1;
});

