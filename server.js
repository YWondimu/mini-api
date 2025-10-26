import express from "express";
import cors from "cors";

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

