function backend() {
  return document.getElementById("backendUrl").value.trim();
}
function token() {
  return document.getElementById("adminToken").value.trim();
}
function setStatus(t) {
  document.getElementById("status").textContent = t;
}

async function authedFetch(url, options = {}) {
  const headers = options.headers || {};
  headers["Authorization"] = `Bearer ${token()}`;
  options.headers = headers;

  const r = await fetch(url, options);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || (await r.text()));
  return data;
}

async function saveKey() {
  const apiKey = document.getElementById("openaiKey").value.trim();
  await authedFetch(`${backend()}/admin/openai-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey })
  });
  setStatus("Clé enregistrée.");
}

async function createPrompt() {
  const body = {
    category: document.getElementById("pCategory").value.trim(),
    name: document.getElementById("pName").value.trim(),
    priority: Number(document.getElementById("pPriority").value || 100),
    is_active: document.getElementById("pActive").value === "1",
    template: document.getElementById("pTemplate").value
  };
  await authedFetch(`${backend()}/prompts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  setStatus("Prompt créé.");
  await reloadTable();
}

async function deletePrompt(id) {
  await authedFetch(`${backend()}/prompts/${id}`, { method: "DELETE" });
  setStatus("Supprimé.");
  await reloadTable();
}

async function reloadTable() {
  const r = await fetch(`${backend()}/prompts`);
  const data = await r.json();
  const prompts = data.prompts || [];

  const rows = prompts.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${escapeHtml(p.category)}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>${p.priority}</td>
      <td>${p.is_active ? "1" : "0"}</td>
      <td><pre style="white-space:pre-wrap;margin:0">${escapeHtml(p.template)}</pre></td>
      <td><button data-del="${p.id}">Delete</button></td>
    </tr>
  `).join("");

  document.getElementById("table").innerHTML = `
    <table>
      <thead>
        <tr><th>ID</th><th>Catégorie</th><th>Nom</th><th>Prio</th><th>Actif</th><th>Template</th><th>Action</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  document.querySelectorAll("button[data-del]").forEach(b => {
    b.onclick = () => deletePrompt(b.getAttribute("data-del"));
  });

  setStatus(`Chargé: ${prompts.length} prompts.`);
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

document.getElementById("btnSaveKey").onclick = () => saveKey().catch(e => setStatus(`Erreur: ${e.message}`));
document.getElementById("btnCreatePrompt").onclick = () => createPrompt().catch(e => setStatus(`Erreur: ${e.message}`));
document.getElementById("btnReload").onclick = () => reloadTable().catch(e => setStatus(`Erreur: ${e.message}`));

reloadTable().catch(() => {});
