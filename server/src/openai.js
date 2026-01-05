import { decryptString } from "./crypto.js";

export async function generateDraft({ db, masterKey, model, inputText, systemText }) {
  const row = db.prepare("SELECT value FROM settings WHERE key='openai_api_key_enc'").get();
  if (!row?.value) throw new Error("OpenAI API key not set. Go to /admin and save it.");
  const apiKey = decryptString(row.value, masterKey);

  // Responses API: https://platform.openai.com/docs/api-reference/responses
  const payload = {
    model,
    input: [
      { role: "system", content: [{ type: "text", text: systemText }] },
      { role: "user", content: [{ type: "text", text: inputText }] }
    ],
    // optionnel: limiter la longueur
    // max_output_tokens: 500
  };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }

  const data = await res.json();

  // On extrait le texte de sortie (forme courante)
  const out = data.output?.[0];
  const parts = out?.content || [];
  const text = parts
    .filter(p => p.type === "output_text")
    .map(p => p.text)
    .join("\n")
    .trim();

  return { text: text || "" };
}
