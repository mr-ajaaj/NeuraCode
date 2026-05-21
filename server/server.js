import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral",
        prompt: message,
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