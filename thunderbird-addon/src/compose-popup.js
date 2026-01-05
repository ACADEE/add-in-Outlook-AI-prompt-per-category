/**
 * Compose popup script for Thunderbird AI Draft
 */

// Get current compose tab
let currentTab = null;

// Helper functions
function showStatus(message, type = 'info') {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
}

function hideStatus() {
  const status = document.getElementById('status');
  status.className = 'status';
}

function getBackend() {
  return document.getElementById('backendUrl').value.trim();
}

async function httpGet(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return response.json();
}

async function httpPost(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

// Load prompts from backend
async function loadPrompts() {
  try {
    const backend = getBackend();
    const data = await httpGet(`${backend}/prompts`);

    const select = document.getElementById('promptSelect');
    select.innerHTML = '<option value="">Auto (par catégorie)</option>';

    for (const p of data.prompts) {
      if (!p.is_active) continue;
      const opt = document.createElement('option');
      opt.value = String(p.id);
      opt.textContent = `[${p.category}] ${p.name}`;
      select.appendChild(opt);
    }
  } catch (error) {
    showStatus(`Erreur chargement prompts: ${error.message}`, 'error');
  }
}

// Get email info from the compose window
async function getEmailInfo() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    currentTab = tabs[0];

    const composeDetails = await browser.compose.getComposeDetails(currentTab.id);

    // Get the original message if replying
    let originalMessage = null;
    let categories = [];

    if (composeDetails.relatedMessageId) {
      originalMessage = await browser.messages.get(composeDetails.relatedMessageId);
      // Tags in Thunderbird are similar to categories
      if (originalMessage.tags) {
        categories = originalMessage.tags;
      }
    }

    return {
      subject: composeDetails.subject || '',
      to: composeDetails.to ? composeDetails.to.join(', ') : '',
      from: originalMessage ? originalMessage.author : '',
      body: composeDetails.plainTextBody || '',
      categories: categories
    };
  } catch (error) {
    console.error('Error getting email info:', error);
    return {
      subject: '',
      to: '',
      from: '',
      body: '',
      categories: []
    };
  }
}

// Generate draft using backend
async function generateDraft() {
  const btnGenerate = document.getElementById('btnGenerate');
  btnGenerate.disabled = true;
  btnGenerate.textContent = 'Génération en cours...';
  hideStatus();

  try {
    const backend = getBackend();
    const emailInfo = await getEmailInfo();

    // Display detected categories
    const categoriesInput = document.getElementById('detectedCategories');
    categoriesInput.value = emailInfo.categories.length > 0
      ? emailInfo.categories.join(', ')
      : '(aucune)';

    const promptId = document.getElementById('promptSelect').value;
    const language = document.getElementById('languageSelect').value;

    const response = await httpPost(`${backend}/draft`, {
      email: {
        subject: emailInfo.subject,
        from: emailInfo.from,
        body: emailInfo.body
      },
      categories: emailInfo.categories,
      promptId: promptId ? Number(promptId) : null,
      language: language
    });

    document.getElementById('draft').value = response.draft || '';
    showStatus(`✓ Brouillon généré avec le prompt: ${response.usedPrompt.name}`, 'success');
  } catch (error) {
    showStatus(`Erreur: ${error.message}`, 'error');
    console.error('Generation error:', error);
  } finally {
    btnGenerate.disabled = false;
    btnGenerate.textContent = 'Générer le brouillon';
  }
}

// Insert draft into compose window
async function insertDraft() {
  const btnInsert = document.getElementById('btnInsert');
  btnInsert.disabled = true;
  hideStatus();

  try {
    const draft = document.getElementById('draft').value;
    if (!draft) {
      showStatus('Aucun brouillon à insérer', 'error');
      return;
    }

    if (!currentTab) {
      showStatus('Aucune fenêtre de composition active', 'error');
      return;
    }

    // Get current compose details
    const details = await browser.compose.getComposeDetails(currentTab.id);

    // Set the body with the draft
    await browser.compose.setComposeDetails(currentTab.id, {
      plainTextBody: draft
    });

    showStatus('✓ Brouillon inséré !', 'success');
  } catch (error) {
    showStatus(`Erreur insertion: ${error.message}`, 'error');
    console.error('Insert error:', error);
  } finally {
    btnInsert.disabled = false;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadPrompts();
  await getEmailInfo().then(info => {
    const categoriesInput = document.getElementById('detectedCategories');
    categoriesInput.value = info.categories.length > 0
      ? info.categories.join(', ')
      : '(aucune)';
  });

  document.getElementById('btnGenerate').addEventListener('click', generateDraft);
  document.getElementById('btnInsert').addEventListener('click', insertDraft);

  document.getElementById('linkAdmin').addEventListener('click', (e) => {
    e.preventDefault();
    const backend = getBackend();
    const adminUrl = backend.replace(/:\d+$/, ':3000') + '/src/admin.html';
    browser.tabs.create({ url: adminUrl });
  });
});
