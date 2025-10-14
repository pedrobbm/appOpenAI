import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { runOpenAIBusinessFlow } from "./openaiFlow.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const result = await runOpenAIBusinessFlow(message);
    res.json({ reply: result });
  } catch (err) {
    res.status(500).json({ error: "Failed to process request" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
