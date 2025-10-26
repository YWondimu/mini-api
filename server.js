import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

// must listen on process.env.PORT for Render
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Hello from the internet 👋" });
});

app.get("/status", (req, res) => {
  res.json({ uptime: process.uptime(), now: new Date().toISOString() });
});

app.post("/echo", (req, res) => {
  res.json({ youSent: req.body });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// DATABASE

// one-time init (idempotent)
await pool.query(`
  CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  );
`);

app.post("/notes", async (req, res) => {
  const { text } = req.body ?? {};
  if (!text) return res.status(400).json({ error: "text required" });
  await pool.query("INSERT INTO notes(text) VALUES($1)", [text]);
  res.json({ ok: true });
});

app.get("/notes", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM notes ORDER BY id DESC");
  res.json(rows);
});

