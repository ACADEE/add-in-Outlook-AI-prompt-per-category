# 💻 Installation depuis Git

Guide complet pour cloner le projet et le démarrer sur votre PC.

## 📥 Cloner le repository

### Option 1 : Via GitHub (ou votre service Git)

Si le repository est hébergé sur **GitHub** :

```bash
git clone https://github.com/ACADEE/add-in-Outlook-AI-prompt-per-category.git
cd add-in-Outlook-AI-prompt-per-category
```

### Option 2 : Via HTTPS (générique)

```bash
git clone <URL_DU_REPOSITORY>
cd add-in-Outlook-AI-prompt-per-category
```

### Option 3 : Via SSH

```bash
git clone git@github.com:ACADEE/add-in-Outlook-AI-prompt-per-category.git
cd add-in-Outlook-AI-prompt-per-category
```

## 🔧 Installation après clonage

### Étape 1 : Vérifier Node.js

Assurez-vous d'avoir Node.js installé :

```bash
node --version
npm --version
```

Si non installé, téléchargez-le depuis [nodejs.org](https://nodejs.org) (version 18 ou supérieure recommandée).

### Étape 2 : Installer les dépendances

Vous avez deux options :

**Option A : Installation automatique (recommandée)**
```bash
npm run install:all
```

**Option B : Installation manuelle**
```bash
# Backend
cd server
npm install

# Add-in
cd ../addin
npm install
```

### Étape 3 : Configurer l'environnement

```bash
cd server
cp .env.example .env
```

Éditez le fichier `.env` et changez les valeurs par défaut :

```env
PORT=8787
MASTER_KEY=CHANGEZ_CETTE_CLE_32_CARACTERES_MINIMUM_SECURISE
ADMIN_TOKEN=CHANGEZ_CE_TOKEN_ADMIN_SECURISE
OPENAI_MODEL=gpt-4o-mini

# Chemins des certificats HTTPS
SSL_KEY_PATH=../certs/localhost.key
SSL_CERT_PATH=../certs/localhost.crt
```

⚠️ **IMPORTANT** : Changez `MASTER_KEY` et `ADMIN_TOKEN` !

### Étape 4 : Générer les certificats HTTPS

Les certificats sont déjà dans le repository, mais si vous voulez les régénérer :

```bash
cd ..  # retour à la racine
npm run generate-certs
```

Ou manuellement :

```bash
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/localhost.key -out certs/localhost.crt \
  -days 365 -subj "/CN=localhost"
```

## 🚀 Démarrer le projet

### Terminal 1 : Backend

```bash
cd server
npm run dev
```

Vous devriez voir :
```
✅ Server HTTPS listening on https://localhost:8787
```

### Terminal 2 : Add-in

Dans un **nouveau terminal** :

```bash
cd addin
npm run dev
```

Vous devriez voir :
```
Starting up http-server, serving ./ on port: 3000
Hit CTRL-C to stop the server
```

## ✅ Vérifier l'installation

### 1. Tester le backend

Ouvrez dans votre navigateur : `https://localhost:8787/health`

Vous devriez voir :
```json
{"ok":true}
```

### 2. Tester l'add-in

Ouvrez dans votre navigateur : `https://localhost:3000/src/taskpane.html`

Vous devriez voir l'interface de l'add-in.

### 3. Tester l'admin

Ouvrez : `https://localhost:3000/src/admin.html`

Vous devriez voir l'interface d'administration.

⚠️ **Note** : Vous devrez accepter les certificats auto-signés dans votre navigateur (cliquez "Avancé" → "Accepter le risque").

## ⚙️ Configuration initiale

Une fois les serveurs démarrés, suivez ces étapes :

### 1. Configurer la clé OpenAI

1. Ouvrez `https://localhost:3000/src/admin.html`
2. Remplissez :
   - Backend : `https://localhost:8787`
   - Admin token : (celui de votre fichier `.env`)
   - Clé OpenAI : `sk-...` (votre clé API)
3. Cliquez "Enregistrer la clé"

### 2. Créer un prompt par défaut

Dans la même page admin, créez un prompt :

| Champ | Valeur |
|-------|--------|
| Catégorie | `*` |
| Nom | `Réponse générique` |
| Priorité | `100` |
| Actif | `Actif` |
| Template | `Réponds de manière professionnelle et concise en français. Rappelle le point clé de l'email. Si des informations manquent, demande-les clairement.` |

Cliquez "Créer".

## 📱 Installer dans Outlook

Maintenant que tout est configuré, installez l'add-in dans Outlook :

### Outlook 365 Online (Web)

Consultez le guide : **[QUICK_OUTLOOK_ONLINE.md](QUICK_OUTLOOK_ONLINE.md)**

### Outlook Desktop

Consultez le guide : **[QUICKSTART.md](QUICKSTART.md)**

## 📂 Structure du projet cloné

Après clonage, vous aurez :

```
add-in-Outlook-AI-prompt-per-category/
├── server/                 # Backend
│   ├── src/
│   ├── data/              # Créé automatiquement au démarrage
│   ├── package.json
│   ├── .env.example
│   └── .env               # À créer
├── addin/                 # Add-in frontend
│   ├── src/
│   ├── assets/
│   ├── manifest.xml
│   └── package.json
├── certs/                 # Certificats HTTPS
│   ├── localhost.crt
│   └── localhost.key
├── README.md              # Documentation principale
├── QUICKSTART.md          # Guide démarrage rapide
├── QUICK_OUTLOOK_ONLINE.md      # Guide Outlook Online rapide
├── OUTLOOK_ONLINE_INSTALL.md    # Guide Outlook Online détaillé
└── package.json           # Scripts racine
```

## 🔄 Mettre à jour depuis Git

Pour récupérer les dernières modifications :

```bash
git pull origin main  # ou le nom de votre branche
```

Puis réinstaller les dépendances si nécessaire :

```bash
npm run install:all
```

Et redémarrer les serveurs.

## 🐛 Problèmes courants

### Erreur "npm install" échoue

**Solution** : Vérifiez votre version de Node.js
```bash
node --version  # Doit être >= 18
```

### Erreur "Cannot find module"

**Solution** : Réinstaller les dépendances
```bash
cd server && rm -rf node_modules && npm install
cd ../addin && rm -rf node_modules && npm install
```

### Erreur certificats HTTPS

**Solution** : Régénérer les certificats
```bash
npm run generate-certs
```

### Port déjà utilisé

**Solution** : Changer le port dans `.env` ou arrêter le processus qui utilise le port

```bash
# Sur Linux/Mac
lsof -i :8787
kill -9 <PID>

# Sur Windows (PowerShell)
netstat -ano | findstr :8787
taskkill /PID <PID> /F
```

## 📚 Documentation complète

Après installation, consultez :

- **[README.md](README.md)** - Documentation complète
- **[QUICKSTART.md](QUICKSTART.md)** - Guide de démarrage rapide
- **[QUICK_OUTLOOK_ONLINE.md](QUICK_OUTLOOK_ONLINE.md)** - Installation Outlook Online (3 min)
- **[OUTLOOK_ONLINE_INSTALL.md](OUTLOOK_ONLINE_INSTALL.md)** - Installation Outlook Online détaillée

## 🎯 Récapitulatif des commandes

```bash
# 1. Cloner
git clone <URL_DU_REPOSITORY>
cd add-in-Outlook-AI-prompt-per-category

# 2. Installer
npm run install:all

# 3. Configurer
cd server
cp .env.example .env
# Éditer .env avec vos clés

# 4. Démarrer (2 terminaux)
# Terminal 1
cd server && npm run dev

# Terminal 2
cd addin && npm run dev

# 5. Configurer l'admin
# Ouvrir https://localhost:3000/src/admin.html
# Enregistrer la clé OpenAI et créer un prompt

# 6. Installer dans Outlook
# Voir guides QUICK_OUTLOOK_ONLINE.md ou QUICKSTART.md
```

## ✅ Checklist post-installation

- [ ] Node.js installé (>= 18)
- [ ] Repository cloné
- [ ] Dépendances installées (`npm run install:all`)
- [ ] Fichier `.env` créé et configuré
- [ ] Certificats HTTPS générés
- [ ] Backend démarre (`https://localhost:8787/health` → `{"ok":true}`)
- [ ] Add-in démarre (`https://localhost:3000` accessible)
- [ ] Certificats acceptés dans le navigateur
- [ ] Clé OpenAI enregistrée dans l'admin
- [ ] Au moins un prompt créé (catégorie `*`)
- [ ] Add-in installé dans Outlook

## 🎉 Prêt !

Votre installation est terminée. Vous pouvez maintenant :

1. Utiliser l'add-in dans Outlook
2. Créer des prompts personnalisés
3. Générer des réponses automatiques

**Besoin d'aide ?** Consultez les guides ou ouvrez une issue sur GitHub !
