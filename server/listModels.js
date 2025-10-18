import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function listModels() {
  const response = await client.models.list();
  for (const model of response.data) {
    console.log(model.id);
  }
}

listModels().catch(console.error);
