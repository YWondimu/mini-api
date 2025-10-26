import "dotenv/config";
import express from "express";
import cors from "cors";
import { supabase } from "./supabaseClient.js";

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


// 📝 create note
app.post("/notes", async (req, res) => {
  const { text } = req.body ?? {};
  if (!text) return res.status(400).json({ error: "text required" });

  const { error } = await supabase.from("notes").insert({ text });
  if (error) return res.status(500).json({ error: error.message });

  res.json({ ok: true });
});

// 📄 list notes
app.get("/notes", async (_req, res) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
