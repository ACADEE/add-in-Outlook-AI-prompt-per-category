# Thunderbird AI Draft Extension

Extension Thunderbird pour générer des brouillons de réponse email via OpenAI basés sur les catégories (étiquettes).

## 🚀 Installation rapide

1. **Démarrer le backend** (dans le dossier racine) :
   ```bash
   cd ../server
   npm install
   npm run setup
   npm run dev
   ```

2. **Charger l'extension dans Thunderbird** :
   - Ouvrir Thunderbird
   - Menu → Modules complémentaires (`Ctrl+Shift+A`)
   - ⚙️ → "Déboguer les modules complémentaires"
   - "Charger un module complémentaire temporaire..."
   - Sélectionner `manifest.json` dans ce dossier

3. **Configurer** :
   - Ouvrir `https://localhost:3000/src/admin.html` dans votre navigateur
   - Enregistrer votre clé OpenAI
   - Créer au moins un prompt (catégorie `*`)

## 📖 Guide complet

Consultez [THUNDERBIRD_INSTALL.md](../THUNDERBIRD_INSTALL.md) pour le guide détaillé.

## 📁 Structure

```
thunderbird-addon/
├── manifest.json          # Manifest WebExtension
├── src/
│   ├── background.js      # Script d'arrière-plan
│   ├── compose-popup.html # Interface de composition
│   ├── compose-popup.js   # Logique de composition
│   ├── message-popup.html # Interface de lecture
│   └── message-popup.js   # Logique de lecture
└── icons/                 # Icônes de l'extension
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

## 🎯 Fonctionnalités

- ✅ Détection automatique des étiquettes Thunderbird
- ✅ Sélection de prompt basée sur les étiquettes
- ✅ Génération de brouillon via OpenAI
- ✅ Insertion dans la fenêtre de composition
- ✅ Interface admin pour gérer les prompts
- ✅ Multi-plateforme (Windows, macOS, Linux)

## 🔧 Backend partagé

Cette extension utilise le **même backend** que la version Outlook :
- Serveur Node.js/Express
- Base de données SQLite
- Gestion des prompts
- Intégration OpenAI

## 🆚 Avantages vs Outlook

- ✅ Installation plus simple
- ✅ Pas de certificats HTTPS complexes pour l'extension
- ✅ Fonctionne sur Linux
- ✅ Gratuit et open-source
- ✅ APIs WebExtension standard

## 📝 Licence

MIT
