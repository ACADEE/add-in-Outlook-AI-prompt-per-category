import "dotenv/config";
import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js";
import { encryptString } from "./crypto.js";
import { generateDraft } from "./openai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 8787);
const MASTER_KEY = process.env.MASTER_KEY || "";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const SSL_KEY_PATH = process.env.SSL_KEY_PATH || path.join(__dirname, "../../certs/localhost.key");
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || path.join(__dirname, "../../certs/localhost.crt");

const db = initDb(path.join(__dirname, "..", "data", "app.sqlite"));

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

function requireAdmin(req, res, next) {
  const tok = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!ADMIN_TOKEN || tok !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// --- Admin: set OpenAI key (encrypted at rest)
app.post("/admin/openai-key", requireAdmin, (req, res) => {
  const { apiKey } = req.body || {};
  if (!apiKey || typeof apiKey !== "string" || apiKey.length < 20) {
    return res.status(400).json({ error: "Invalid apiKey" });
  }
  if (!MASTER_KEY) return res.status(500).json({ error: "MASTER_KEY missing on server" });

  const enc = encryptString(apiKey, MASTER_KEY);
  db.prepare(`
    INSERT INTO settings(key, value) VALUES ('openai_api_key_enc', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(enc);

  res.json({ ok: true });
});

// --- Prompts CRUD
app.get("/prompts", (req, res) => {
  const rows = db.prepare(`
    SELECT id, category, name, priority, template, is_active
    FROM prompts
    ORDER BY category ASC, priority ASC, id ASC
  `).all();
  res.json({ prompts: rows });
});

app.post("/prompts", requireAdmin, (req, res) => {
  const { category, name, priority = 100, template, is_active = 1 } = req.body || {};
  if (!category || !name || !template) return res.status(400).json({ error: "Missing fields" });

  const info = db.prepare(`
    INSERT INTO prompts(category, name, priority, template, is_active)
    VALUES (?, ?, ?, ?, ?)
  `).run(category, name, Number(priority), template, is_active ? 1 : 0);

  res.json({ ok: true, id: info.lastInsertRowid });
});

app.put("/prompts/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { category, name, priority, template, is_active } = req.body || {};
  const row = db.prepare("SELECT id FROM prompts WHERE id=?").get(id);
  if (!row) return res.status(404).json({ error: "Not found" });

  db.prepare(`
    UPDATE prompts
    SET category = COALESCE(?, category),
        name = COALESCE(?, name),
        priority = COALESCE(?, priority),
        template = COALESCE(?, template),
        is_active = COALESCE(?, is_active),
        updated_at = datetime('now')
    WHERE id = ?
  `).run(category ?? null, name ?? null, priority ?? null, template ?? null,
         (is_active === undefined ? null : (is_active ? 1 : 0)), id);

  res.json({ ok: true });
});

app.delete("/prompts/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.prepare("DELETE FROM prompts WHERE id=?").run(id);
  res.json({ ok: true });
});

// --- Draft endpoint called by add-in
app.post("/draft", async (req, res) => {
  try {
    const { email, categories = [], promptId, language = "fr" } = req.body || {};
    const subject = email?.subject || "";
    const from = email?.from || "";
    const body = email?.body || "";
    if (!body && !subject) return res.status(400).json({ error: "Email content missing" });

    // Resolve prompt:
    let prompt;
    if (promptId) {
      prompt = db.prepare(`
        SELECT * FROM prompts WHERE id=? AND is_active=1
      `).get(Number(promptId));
    } else {
      // Choose by best category+priority
      const cats = Array.isArray(categories) ? categories : [];
      if (cats.length) {
        const placeholders = cats.map(() => "?").join(",");
        prompt = db.prepare(`
          SELECT * FROM prompts
          WHERE is_active=1 AND category IN (${placeholders})
          ORDER BY priority ASC, id ASC
          LIMIT 1
        `).get(...cats);
      }
      // Fallback: category = "*"
      if (!prompt) {
        prompt = db.prepare(`
          SELECT * FROM prompts
          WHERE is_active=1 AND category='*'
          ORDER BY priority ASC, id ASC
          LIMIT 1
        `).get();
      }
      if (!prompt) {
        return res.status(400).json({ error: "No prompt found. Create one (category='*' recommended as fallback)." });
      }
    }

    const systemText =
      language === "fr"
        ? "Tu rédiges une réponse email professionnelle, factuelle, concise. Interdiction d'inventer des faits. Si une info manque, formule une demande claire. Pas de blabla."
        : "Write a professional email reply. Do not invent facts. Ask for missing info clearly. Be concise.";

    const inputText = `
EMAIL (source)
From: ${from}
Subject: ${subject}

Body:
${body}

CATEGORIES:
${(categories || []).join(", ")}

INSTRUCTIONS (template):
${prompt.template}

OUTPUT:
Rédige uniquement le corps de la réponse email (pas d'objet, pas de signature).`.trim();

    const { text } = await generateDraft({
      db,
      masterKey: MASTER_KEY,
      model: MODEL,
      inputText,
      systemText
    });

    res.json({ ok: true, draft: text, usedPrompt: { id: prompt.id, name: prompt.name, category: prompt.category } });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

// Créer le serveur HTTPS
try {
  const httpsOptions = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH)
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`✅ Server HTTPS listening on https://localhost:${PORT}`);
  });
} catch (error) {
  console.error("❌ Error starting HTTPS server:", error.message);
  console.error("Make sure certificates exist. Run: npm run generate-certs");
  process.exit(1);
}
