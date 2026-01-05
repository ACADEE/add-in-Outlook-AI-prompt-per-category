import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

export function initDb(dbFilePath) {
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  const db = new Database(dbFilePath);

  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS prompts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      priority INTEGER NOT NULL DEFAULT 100,
      template TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
  `);

  const up = db.prepare(`
    UPDATE prompts SET updated_at = datetime('now') WHERE id = ?
  `);

  db.function("touch_prompt", (id) => {
    up.run(id);
    return 1;
  });

  return db;
}
