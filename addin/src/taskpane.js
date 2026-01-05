/* global Office */

async function httpGet(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function httpPost(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || (await r.text()));
  return data;
}

function getBackend() {
  return document.getElementById("backendUrl").value.trim();
}

function setDetectedCategories(cats) {
  document.getElementById("detectedCategories").value = cats.length ? cats.join(", ") : "(aucune)";
}

function getSelectedPromptId() {
  const v = document.getElementById("promptSelect").value;
  return v ? Number(v) : null;
}

function getLanguage() {
  return document.getElementById("languageSelect").value;
}

async function loadPrompts() {
  const backend = getBackend();
  const data = await httpGet(`${backend}/prompts`);
  const select = document.getElementById("promptSelect");
  select.innerHTML = "";

  for (const p of data.prompts) {
    if (!p.is_active) continue;
    const opt = document.createElement("option");
    opt.value = String(p.id);
    opt.textContent = `[${p.category}] ${p.name} (prio ${p.priority})`;
    select.appendChild(opt);
  }
}

function getEmailFromOffice() {
  return new Promise((resolve, reject) => {
    try {
      const item = Office.context.mailbox.item;
      const subject = item.subject || "";

      // From
      const from = item.from?.emailAddress || item.from?.displayName || "";

      // Categories: selon hôte, peut ne pas être exposé. On tente plusieurs accès.
      const cats = [];
      try {
        const c1 = item.categories;
        if (Array.isArray(c1)) cats.push(...c1);
      } catch {}
      try {
        const c2 = item?.itemClass; // no-op, juste éviter crash
      } catch {}

      // Body (texte)
      item.body.getAsync(Office.CoercionType.Text, (result) => {
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
          return reject(new Error(result.error?.message || "body.getAsync failed"));
        }
        resolve({
          subject,
          from,
          body: result.value || "",
          categories: cats
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function generateDraft() {
  const backend = getBackend();
  const { subject, from, body, categories } = await getEmailFromOffice();
  setDetectedCategories(categories);

  const promptId = getSelectedPromptId();
  const language = getLanguage();

  const res = await httpPost(`${backend}/draft`, {
    email: { subject, from, body },
    categories,
    promptId,
    language
  });

  document.getElementById("draft").value = res.draft || "";
}

function insertDraftIntoReply() {
  return new Promise((resolve, reject) => {
    const item = Office.context.mailbox.item;
    const draft = document.getElementById("draft").value || "";

    // En compose : on remplace le body. Variante : prependAsync.
    item.body.setAsync(draft, { coercionType: Office.CoercionType.Text }, (result) => {
      if (result.status !== Office.AsyncResultStatus.Succeeded) {
        return reject(new Error(result.error?.message || "body.setAsync failed"));
      }
      resolve(true);
    });
  });
}

Office.onReady(async (info) => {
  try {
    await loadPrompts();
    // tentative d'affichage des catégories sans bloquer
    try {
      const mail = await getEmailFromOffice();
      setDetectedCategories(mail.categories || []);
    } catch {
      setDetectedCategories([]);
    }

    document.getElementById("btnGenerate").onclick = async () => {
      document.getElementById("btnGenerate").disabled = true;
      try { await generateDraft(); }
      finally { document.getElementById("btnGenerate").disabled = false; }
    };

    document.getElementById("btnInsert").onclick = async () => {
      document.getElementById("btnInsert").disabled = true;
      try { await insertDraftIntoReply(); }
      finally { document.getElementById("btnInsert").disabled = false; }
    };
  } catch (e) {
    document.getElementById("draft").value = `Erreur init: ${e.message || e}`;
  }
});
