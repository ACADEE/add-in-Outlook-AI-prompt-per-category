# 🚀 Clonage rapide

## 📥 Commande de clonage

### Si le repository est sur GitHub :

```bash
git clone https://github.com/ACADEE/add-in-Outlook-AI-prompt-per-category.git
cd add-in-Outlook-AI-prompt-per-category
```

### Si vous avez une URL différente :

```bash
git clone <VOTRE_URL_GIT>
cd add-in-Outlook-AI-prompt-per-category
```

### Via SSH :

```bash
git clone git@github.com:ACADEE/add-in-Outlook-AI-prompt-per-category.git
cd add-in-Outlook-AI-prompt-per-category
```

## ⚡ Démarrage rapide après clonage

```bash
# 1. Installer les dépendances
npm run install:all

# 2. Configurer
cd server
cp .env.example .env
# Éditez .env et changez MASTER_KEY et ADMIN_TOKEN

# 3. Démarrer le backend (terminal 1)
npm run dev

# 4. Démarrer l'add-in (terminal 2)
cd ../addin
npm run dev
```

## 📚 Suite de l'installation

Consultez le guide complet : **[INSTALLATION_CLONE.md](INSTALLATION_CLONE.md)**

Ou suivez directement un guide spécifique :
- **[Outlook 365 Online](QUICK_OUTLOOK_ONLINE.md)** - 3 minutes
- **[Guide complet](QUICKSTART.md)** - Tous environnements
