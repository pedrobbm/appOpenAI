// server/openaiFlow.js
import OpenAI from "openai";
import { dbQuery } from "./db.js"; // optional: your DB access helper

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Main orchestrator for handling natural-language business data queries
 * @param {string} userPrompt
 * @returns {Promise<string>} natural-language GPT analysis
 */
export async function runOpenAIBusinessFlow(userPrompt) {
  try {
    // 1️⃣ INTENT / PLAN GENERATION
    const planRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that converts business questions into structured query plans. Be concise.",
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const planText = planRes.choices[0].message.content;
    console.log("🧩 Plan:", planText);

    // 2️⃣ SQL GENERATION (mock schema for example)
    const sqlRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert SQL generator. 
            Use only these tables: sales(region, total_sales, date), customers(id, region).
            Output ONLY the SQL query text.`,
        },
        { role: "user", content: planText },
      ],
      temperature: 0,
    });

    const sqlQuery = sqlRes.choices[0].message.content.trim();
    console.log("🧠 SQL Query:", sqlQuery);

    // 3️⃣ EXECUTE QUERY (mock DB)
    // Replace this with your real DB call:
    const result = await dbQuery(sqlQuery);
    console.log("📊 Query Result:", result);

    // 4️⃣ ANALYSIS / EXPLANATION (GPT-4)
    const analysisRes = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a business analyst. Analyze the provided SQL result and explain insights clearly for non-technical users.",
        },
        { role: "user", content: `User asked: ${userPrompt}` },
        { role: "assistant", content: `SQL result:\n${JSON.stringify(result)}` },
      ],
      temperature: 0.5,
    });

    const analysis = analysisRes.choices[0].message.content;
    return analysis;
  } catch (error) {
    console.error("❌ OpenAI Flow Error:", error);
    throw new Error("Error running OpenAI business flow");
  }
}
