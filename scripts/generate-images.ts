/**
 * Image Generation Script for FinLit
 *
 * Reads all seed JSON files, extracts image blocks with `prompt` fields,
 * generates images via Gemini API, and saves them to /public/illustrations/ch{N}/
 *
 * Usage:
 *   npx tsx scripts/generate-images.ts              # Generate all
 *   npx tsx scripts/generate-images.ts --chapter 0   # Generate for chapter 0 only
 *   npx tsx scripts/generate-images.ts --dry-run      # Just list what would be generated
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("ERROR: GEMINI_API_KEY not set in .env.local");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash-image";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const CONTENT_DIR = path.resolve(__dirname, "../src/seed/content");
const OUTPUT_DIR = path.resolve(__dirname, "../public/illustrations");

const STYLE_PREFIX =
  "Flat vector illustration, bold flat shapes, no outlines, clean simple composition, educational style for Indian teens, solid background color #F7F7F4 (warm off-white), warm and friendly, ";

const JSON_FILES: string[] = [
  "chapter_0_seed_fixed.json",
  "chapter1_stock_market.json",
  "chapter_2_investing_101.json",
  "chapter3_your_money_psychology.json",
  "chapter4_managing_your_money.json",
  "chapter_5_credit_and_debt_fixed.json",
  "chapter6_the_shield_fixed.json",
];

interface ImageTask {
  chapterNum: number;
  lessonTitle: string;
  filePath: string;
  prompt: string;
  alt: string;
}

function unwrapChapterData(raw: any, chapterNum: number): any {
  if (chapterNum === 4 && raw.chapter) return raw.chapter;
  return raw;
}

function extractImageTasks(): ImageTask[] {
  const tasks: ImageTask[] = [];

  for (let chapterNum = 0; chapterNum < JSON_FILES.length; chapterNum++) {
    const filePath = path.join(CONTENT_DIR, JSON_FILES[chapterNum]);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const data = unwrapChapterData(raw, chapterNum);
    const lessons = data.lessons || [];

    for (const lesson of lessons) {
      const blocks = lesson.contentBlocks || lesson.content || [];
      for (const block of blocks) {
        if (block.type === "image" && block.data?.prompt) {
          const src = block.data.src || "";
          // Only generate if src points to our illustrations dir
          if (src.startsWith("/illustrations/")) {
            const absPath = path.resolve(__dirname, "..", "public" + src);
            tasks.push({
              chapterNum,
              lessonTitle: lesson.title || "unknown",
              filePath: absPath,
              prompt: block.data.prompt,
              alt: block.data.alt || "",
            });
          }
        }
      }
    }
  }

  return tasks;
}

async function generateImage(prompt: string): Promise<Buffer | null> {
  const fullPrompt = STYLE_PREFIX + prompt;

  const body = {
    contents: [{ parts: [{ text: fullPrompt }] }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.error) {
      console.error(`  API Error: ${data.error.message}`);
      return null;
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return Buffer.from(part.inlineData.data, "base64");
      }
    }

    console.error("  No image in response");
    return null;
  } catch (err: any) {
    console.error(`  Fetch error: ${err.message}`);
    return null;
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const chapterIdx = args.indexOf("--chapter");
  const onlyChapter = chapterIdx !== -1 ? parseInt(args[chapterIdx + 1]) : null;

  let tasks = extractImageTasks();

  if (onlyChapter !== null) {
    tasks = tasks.filter((t) => t.chapterNum === onlyChapter);
  }

  // Skip already-generated images
  const pending = tasks.filter((t) => !fs.existsSync(t.filePath));
  const skipped = tasks.length - pending.length;

  console.log(`\n=== FinLit Image Generator ===`);
  console.log(`Total image tasks: ${tasks.length}`);
  console.log(`Already exist (skip): ${skipped}`);
  console.log(`To generate: ${pending.length}\n`);

  if (dryRun) {
    for (const task of pending) {
      console.log(`  [ch${task.chapterNum}] ${task.lessonTitle}`);
      console.log(`    Path: ${task.filePath}`);
      console.log(`    Prompt: ${task.prompt.slice(0, 100)}...`);
      console.log();
    }
    return;
  }

  let generated = 0;
  let failed = 0;

  for (const task of pending) {
    console.log(
      `[${generated + failed + 1}/${pending.length}] ch${task.chapterNum} - ${task.alt.slice(0, 60)}`
    );

    const imgBuffer = await generateImage(task.prompt);

    if (imgBuffer) {
      // Ensure directory exists
      const dir = path.dirname(task.filePath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(task.filePath, imgBuffer);
      console.log(`  Saved (${(imgBuffer.length / 1024).toFixed(0)} KB)`);
      generated++;
    } else {
      console.log(`  FAILED`);
      failed++;
    }

    // Rate limit: ~2 seconds between requests
    if (generated + failed < pending.length) {
      await sleep(2000);
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Generated: ${generated}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped (already exist): ${skipped}`);
}

main().catch(console.error);
