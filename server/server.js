import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, mode, task } = req.body;

  let systemPrompt = "";

  if (task === "project-analysis") {
    systemPrompt = `
      You are a senior software architect.

      Analyze the provided software project.

      Provide:

      # Project Overview
      Explain what the project does.

      # Technologies Used
      Identify languages, frameworks and tools.

      # File Responsibilities
      Explain the role of each file.

      # Architecture Review
      Evaluate the project structure.

      # Bugs and Risks
      Identify potential issues.

      # Code Quality
      Evaluate readability and maintainability.

      # Improvements
      Suggest practical improvements.

      # Final Score
      Give a score from 1 to 10 with justification.

      If some project files are missing,
      mention the limitations of your analysis.
      `;
  } else if (mode === "Explain") {
    systemPrompt = `
    You are NeuraCode AI.

    Explain programming concepts clearly for beginners.

    Use simple language.
    Give examples when possible.

    Always format code using markdown code blocks.
    Specify the programming language.
    `;
  } else if (mode === "Debug") {
    systemPrompt = `
    You are NeuraCode AI.

    Find programming errors and explain how to fix them.

    Show:
    - The problem
    - Why it happens
    - The corrected code

    Always format code using markdown code blocks.
    Specify the programming language.
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

    Always format code using markdown code blocks.
    Specify the programming language.
    `;
  } else {
    systemPrompt = `
    You are NeuraCode AI.

    You are an expert programming assistant.

    Help the user with programming tasks.

    Always format code using markdown code blocks.
    Specify the programming language.
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
        stream: true,
      }),
    });

    res.setHeader("Content-Type", "text/plain");

    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);

      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line) continue;

        try {
          const parsed = JSON.parse(line);

          res.write(parsed.response || "");
        } catch (err) {
          console.log(err);
        }
      }
    }

    res.end();
  } catch (error) {
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
