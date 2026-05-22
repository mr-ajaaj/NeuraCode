import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, mode } = req.body;

  let systemPrompt = "";

  if (mode === "Explain") {
    systemPrompt = `
    You are NeuraCode AI.

    Explain programming concepts clearly for beginners.

    Use simple language.
    Give examples when possible.
    `;
  } else if (mode === "Debug") {
    systemPrompt = `
    You are NeuraCode AI.

    Find programming errors and explain how to fix them.

    Show:
    - The problem
    - Why it happens
    - The corrected code
    `;
  } else if (mode === "Refactor") {
    systemPrompt = `
    You are NeuraCode AI.

    Refactor code using best practices.

    Improve:
    - readability
    - structure
    - performance

    Explain the improvements.
    `;
  } else {
    systemPrompt = `
    You are NeuraCode AI.

    You are an expert programming assistant.

    Help the user with programming tasks.
    `;
  }

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral",
        prompt: `
        ${systemPrompt}

        User request:
        ${message}
        `,
        stream: false,
      }),
    });

    const data = await response.json();

    res.json({ reply: data.response });
  } catch (error) {
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});