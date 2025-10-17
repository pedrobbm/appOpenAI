// server/embeddings.js
import OpenAI from "openai";
import fs from "fs";
import { spawnSync } from "child_process";
import { cosineSimilarity } from "./utils.js";

// --- Step 1: Load schema info ---
const schema = JSON.parse(fs.readFileSync("./schema.json", "utf8"));
let schemaEmbeddings = [];
const CACHE_PATH = "./schema_embeddings.json"; // keep consistent naming

// --- Helper: create OpenAI client dynamically ---
function createOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// --- Step 2: Generate embeddings (run once at startup) ---
export async function initSchemaEmbeddings() {
  console.log("🧠 Generating schema embeddings... (using python script for now)");

  // const openai = createOpenAIClient();

  // const descriptions = schema.map((t) => t.description);
  // console.log(descriptions)
  // const res = await openai.embeddings.create({
  //   model: "text-embedding-3-small",
  //   input: descriptions,
  // });

  // schemaEmbeddings = schema.map((t, i) => ({
  //   table: t.table,
  //   description: t.description,
  //   embedding: res.data[i].embedding,
  // }));

  // ======================================================
  //              V LATER TAKE OUT V and uncomment
  // ======================================================
  // 🐍 Run Python script to generate embeddings locally
  const result = spawnSync("python", ["./generateEmbeddings.py"], {
    encoding: "utf-8",
    stdio: "inherit", // show Python output in Node console
  });

  if (result.error) {
    console.error("❌ Python embedding script failed:", result.error);
    throw result.error;
  }

  // ✅ Use consistent lowercase underscore naming
  if (!fs.existsSync(CACHE_PATH)) {
    throw new Error("❌ schema_embeddings.json not found after Python run.");
  }

  schemaEmbeddings = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  console.log("✅ Schema embeddings initialized (from local file).");
}

// ======================================================
//              ^ LATER TAKE OUT  ^
// ======================================================

// --- Step 3: Find top-k relevant tables ---
export async function getRelevantTables(userPrompt, topK = 3) {
  // const openai = createOpenAIClient();

  // const userEmbedding = (
  //   await openai.embeddings.create({
  //     model: "text-embedding-3-small",
  //     input: userPrompt,
  //   })
  // ).data[0].embedding;

  // ======================================================
  //              V LATER TAKE OUT V and uncomment
  // ======================================================

  console.log("🔍 Getting relevant tables for user prompt...");

  // 🐍 Use Python again to embed the user prompt
  const py = spawnSync("python", ["./encodePrompt.py", userPrompt], {
    encoding: "utf-8",
  });

  if (py.error) {
    console.error("❌ Failed to run encodePrompt.py:", py.error);
    throw py.error;
  }

  const userEmbedding = JSON.parse(py.stdout);

  // ======================================================
  //              ^ LATER TAKE OUT  ^
  // ======================================================

  const similarities = schemaEmbeddings.map((t) => ({
    table: t.table,
    description: t.description,
    score: cosineSimilarity(userEmbedding, t.embedding),
  }));

  const topTables = similarities
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return topTables;
}
