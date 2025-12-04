import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/smsbomb", async (req, res) => {
  const number = req.query.number;
  const amount = req.query.amount;

  if (!number || !amount) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const target = `https://sms-tanginamoka-api-ryujin.vercel.app/api/smsbomb?number=${number}&amount=${amount}`;

  try {
    const response = await fetch(target);
    let data;

    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      data = { raw: text };
    }

    res.json(data);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => {
  console.log("Proxy running on http://localhost:3000");
});
