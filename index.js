import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); 

app.get("/api/smsbomb", async (req, res) => {
  const { number, amount } = req.query;

  if (!number || !amount) {
    return res.status(400).json({ error: "Missing number or amount" });
  }

  const target = `https://sms-tanginamoka-api-ryujin.vercel.app/api/smsbomb?number=${encodeURIComponent(number)}&amount=${encodeURIComponent(amount)}`;

  try {
    const response = await fetch(target, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      data = { raw: text };
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error: " + err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
