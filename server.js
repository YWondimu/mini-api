import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { supabase } from "./supabaseClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// must listen on process.env.PORT for Render
const PORT = process.env.PORT || 3000;

const app = express();

// CORS: keep open in dev; tighten in prod
app.use(cors());
//// allow your frontends; keep wide-open during dev if needed
// app.use(cors({ origin: ["http://localhost:3000", "https://your-frontend.vercel.app"], methods: ["GET","POST"] }));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Root page
app.get("/", (req, res) => {
  //res.json({ ok: true, message: "Hello from the internet 👋" });
    res.sendFile(path.join(__dirname, "index.html"));
});

// Health/status
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    hasUrl: !!process.env.SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_PUBLISHABLE_KEY
  });
});

app.get("/status", (req, res) => {
  res.json({ uptime: process.uptime(), now: new Date().toISOString() });
});

// Echo
app.get("/echo", (req, res) => {
  res.json({ youSent: req.body });
});

app.post("/echo", (req, res) => {
  res.json({ youSent: req.body });
});


// Notes
// create note
app.post("/notes", async (req, res) => {
  const { text } = req.body ?? {};
  if (!text || typeof text !== "string") return res.status(400).json({ error: "text required" });

  const { error } = await supabase.from("notes").insert({ text });
  if (error) return res.status(500).json({ error: error.message });

  res.json({ ok: true });
});

// list notes
app.get("/notes", async (_req, res) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Start last
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

