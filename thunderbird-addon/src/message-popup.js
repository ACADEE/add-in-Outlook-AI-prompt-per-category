/**
 * Message popup script for Thunderbird AI Draft
 */

async function displayCategories() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    const message = await browser.messageDisplay.getDisplayedMessage(tab.id);

    const categoriesDiv = document.getElementById('categories');

    if (message && message.tags && message.tags.length > 0) {
      categoriesDiv.innerHTML = message.tags
        .map(tag => `<span class="categories">${tag}</span>`)
        .join('');
    } else {
      categoriesDiv.innerHTML = '<span style="color: #999;">(aucune catégorie)</span>';
    }
  } catch (error) {
    console.error('Error displaying categories:', error);
    document.getElementById('categories').innerHTML = '<span style="color: #c00;">(erreur)</span>';
  }
}

// Reply button handler
document.getElementById('btnReply').addEventListener('click', async () => {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    const message = await browser.messageDisplay.getDisplayedMessage(tab.id);

    if (message) {
      // Open compose window to reply
      await browser.compose.beginReply(message.id);
      // Close the popup
      window.close();
    }
  } catch (error) {
    console.error('Error opening reply:', error);
    alert('Erreur lors de l\'ouverture de la réponse');
  }
});

// Admin link
document.getElementById('linkAdmin').addEventListener('click', (e) => {
  e.preventDefault();
  browser.tabs.create({ url: 'https://localhost:3000/src/admin.html' });
});

// Initialize
document.addEventListener('DOMContentLoaded', displayCategories);
