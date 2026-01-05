# Outlook AI Add-in - Réponse automatique par catégorie

Add-in Outlook qui lit les catégories d'un email, sélectionne automatiquement un prompt basé sur ces catégories, et génère une proposition de réponse via OpenAI.

## 📖 Guides d'installation

### 🆕 Première installation (clonage depuis Git)

- 💻 **[Guide d'installation depuis Git](INSTALLATION_CLONE.md)** - Cloner le projet et l'installer sur votre PC

### 🚀 Installation dans Outlook

Choisissez le guide adapté à votre plateforme :

- 🌐 **[Outlook 365 Online (Web)](QUICK_OUTLOOK_ONLINE.md)** - Guide rapide 3 minutes
- 🌐 **[Outlook 365 Online - Détaillé](OUTLOOK_ONLINE_INSTALL.md)** - Guide complet avec dépannage
- 🖥️ **Outlook Desktop** - Voir la section "Installation dans Outlook" ci-dessous
- ⚡ **[Guide de démarrage rapide](QUICKSTART.md)** - Pour tous les environnements

## 🎯 Fonctionnalités

- ✅ Lecture automatique des catégories Outlook
- ✅ Sélection de prompt basée sur les catégories
- ✅ Génération de réponse via OpenAI Responses API
- ✅ Interface d'administration pour gérer les prompts
- ✅ Stockage sécurisé de la clé API OpenAI (chiffrée)
- ✅ Support HTTPS pour le backend et l'add-in
- ✅ Base de données SQLite

## 📁 Structure du projet

```
outlook-ai-addon/
├── server/              # Backend Node.js/Express
│   ├── src/
│   │   ├── index.js    # Serveur principal (HTTPS)
│   │   ├── db.js       # Configuration SQLite
│   │   ├── crypto.js   # Chiffrement de la clé API
│   │   └── openai.js   # Intégration OpenAI
│   ├── data/           # Base de données (auto-créée)
│   ├── package.json
│   └── .env            # Configuration
├── addin/              # Add-in Outlook (frontend)
│   ├── src/
│   │   ├── taskpane.html   # Interface principale
│   │   ├── taskpane.js
│   │   ├── admin.html      # Interface d'administration
│   │   └── admin.js
│   ├── assets/
│   │   ├── icon-16.png
│   │   ├── icon-32.png
│   │   └── icon-80.png
│   ├── manifest.xml    # Manifest Outlook
│   └── package.json
└── certs/              # Certificats HTTPS
    ├── localhost.crt
    └── localhost.key
```

## 🚀 Installation

### 1. Prérequis

- Node.js 18+ installé
- Outlook Desktop (Windows, Mac) ou Outlook sur le Web
- Clé API OpenAI

### 2. Installation des dépendances

Les dépendances sont déjà installées. Si besoin, lancez :

```bash
# Backend
cd server
npm install

# Add-in
cd ../addin
npm install
```

### 3. Configuration du backend

Le fichier `server/.env` est déjà configuré avec des valeurs par défaut :

```env
PORT=8787
MASTER_KEY=my_super_secret_master_key_32chars_minimum_length_12345
ADMIN_TOKEN=my_admin_token_change_this_in_production
OPENAI_MODEL=gpt-4o-mini
SSL_KEY_PATH=../certs/localhost.key
SSL_CERT_PATH=../certs/localhost.crt
```

**⚠️ IMPORTANT** : Changez `MASTER_KEY` et `ADMIN_TOKEN` en production !

### 4. Certificats HTTPS

Les certificats sont déjà générés dans `certs/`. Pour les régénérer :

```bash
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/localhost.key -out certs/localhost.crt \
  -days 365 -subj "/CN=localhost"
```

**⚠️ Important** : Vous devez accepter le certificat auto-signé dans votre navigateur et système d'exploitation.

## 🏃 Démarrage

### 1. Lancer le backend (HTTPS)

```bash
cd server
npm run dev
```

Le serveur démarre sur `https://localhost:8787`

### 2. Lancer l'add-in (HTTPS)

Dans un nouveau terminal :

```bash
cd addin
npm run dev
```

L'interface est disponible sur `https://localhost:3000`

### 3. Accepter les certificats HTTPS

Avant de charger l'add-in dans Outlook :

1. Ouvrez `https://localhost:8787/health` dans votre navigateur
2. Acceptez le certificat (cliquez sur "Avancé" puis "Accepter le risque")
3. Ouvrez `https://localhost:3000/src/taskpane.html`
4. Acceptez le certificat

## 📱 Installation dans Outlook

### Outlook Desktop (Windows/Mac)

1. Ouvrez Outlook
2. Allez dans **Fichier** → **Gérer les compléments** → **Mes compléments**
3. Cliquez sur **Ajouter un complément personnalisé**
4. Sélectionnez **Ajouter à partir d'un fichier**
5. Choisissez le fichier `addin/manifest.xml`
6. Confirmez l'installation

### Outlook sur le Web

1. Ouvrez Outlook sur le Web
2. Cliquez sur l'icône des paramètres (⚙️)
3. Allez dans **Afficher tous les paramètres Outlook** → **Personnaliser** → **Gérer les compléments**
4. Cliquez sur **+ Ajouter un complément**
5. Sélectionnez **Ajouter à partir d'un fichier**
6. Choisissez `addin/manifest.xml`

## ⚙️ Configuration initiale

### 1. Accéder à l'interface d'administration

Ouvrez dans votre navigateur : `https://localhost:3000/src/admin.html`

### 2. Configurer la clé OpenAI

1. Backend : `https://localhost:8787`
2. Admin token : `my_admin_token_change_this_in_production` (valeur de `.env`)
3. Clé OpenAI : collez votre clé API OpenAI (commence par `sk-...`)
4. Cliquez sur **Enregistrer la clé**

### 3. Créer des prompts

#### Exemple 1 : Prompt par défaut (fallback)

- **Catégorie** : `*`
- **Nom** : `Réponse générique`
- **Priorité** : `100`
- **Actif** : `Actif`
- **Template** :
  ```
  Réponds de manière professionnelle et concise.
  Rappelle le point clé de l'email.
  Propose 2 options si nécessaire.
  Termine par une question fermée pour obtenir une confirmation.
  ```

#### Exemple 2 : Prompt pour catégorie "Urgent"

- **Catégorie** : `Urgent`
- **Nom** : `Réponse urgente`
- **Priorité** : `10` (plus prioritaire)
- **Actif** : `Actif`
- **Template** :
  ```
  Réponds rapidement et efficacement.
  Confirme la prise en compte de l'urgence.
  Propose une solution immédiate ou un délai précis.
  Demande des clarifications si nécessaire.
  ```

#### Exemple 3 : Prompt pour catégorie "Client VIP"

- **Catégorie** : `Client VIP`
- **Nom** : `Réponse VIP`
- **Priorité** : `5`
- **Actif** : `Actif`
- **Template** :
  ```
  Réponds avec un ton très professionnel et personnalisé.
  Valorise la relation client.
  Propose des solutions premium.
  Assure un suivi personnalisé.
  ```

## 📖 Utilisation

### Dans Outlook

1. Ouvrez un email
2. Cliquez sur le bouton **AI Draft** dans le ruban Outlook
3. L'add-in s'ouvre dans un panneau latéral
4. Les catégories de l'email sont automatiquement détectées
5. Sélectionnez un prompt (ou laissez la sélection automatique)
6. Cliquez sur **Générer le brouillon**
7. Attendez quelques secondes
8. Le brouillon s'affiche dans la zone de texte
9. Cliquez sur **Insérer dans la réponse** pour l'insérer dans votre email

### Sélection automatique des prompts

Le système sélectionne automatiquement le prompt selon cette logique :

1. Si un prompt avec une catégorie correspondante existe → utilise celui avec la priorité la plus basse (ex: priorité 5 avant priorité 10)
2. Sinon → utilise le prompt avec catégorie `*` (fallback)
3. Vous pouvez forcer un prompt en le sélectionnant manuellement

## 🔧 API Endpoints

### Backend (`https://localhost:8787`)

#### Health check
```
GET /health
```

#### Récupérer tous les prompts
```
GET /prompts
```

#### Créer un prompt (admin)
```
POST /prompts
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "category": "Urgent",
  "name": "Réponse urgente",
  "priority": 10,
  "template": "...",
  "is_active": 1
}
```

#### Générer un brouillon
```
POST /draft
Content-Type: application/json

{
  "email": {
    "subject": "...",
    "from": "...",
    "body": "..."
  },
  "categories": ["Urgent", "Client VIP"],
  "promptId": 1,  // optionnel
  "language": "fr"
}
```

## 🔒 Sécurité

- ✅ Clé API OpenAI stockée chiffrée (AES-256-GCM)
- ✅ Authentification admin via Bearer token
- ✅ Communication HTTPS uniquement
- ✅ Clé API jamais exposée côté client
- ✅ Base de données locale (SQLite)

## 🐛 Dépannage

### Le serveur ne démarre pas (erreur certificats)

```bash
cd /path/to/project
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/localhost.key -out certs/localhost.crt \
  -days 365 -subj "/CN=localhost"
```

### L'add-in ne charge pas dans Outlook

1. Vérifiez que les deux serveurs (backend et add-in) sont démarrés
2. Acceptez les certificats HTTPS dans votre navigateur
3. Vérifiez que le manifest.xml pointe vers `https://localhost:3000`
4. Redémarrez Outlook

### Erreur "OpenAI API key not set"

1. Ouvrez l'interface d'administration
2. Configurez la clé OpenAI
3. Rechargez l'add-in

### Les catégories ne sont pas détectées

Les catégories Outlook ne sont pas toujours accessibles selon le client (Outlook Desktop vs Web).
Si les catégories ne sont pas détectées, sélectionnez manuellement le prompt à utiliser.

## 📝 Notes importantes

### OpenAI Responses API

Ce projet utilise l'API Responses d'OpenAI qui est une API moderne et efficace.
Si vous rencontrez des erreurs, vérifiez que votre clé API a accès à cette API.

Alternative : vous pouvez modifier `server/src/openai.js` pour utiliser l'API Chat Completions classique.

### Modèle par défaut

Le modèle par défaut est `gpt-4o-mini` (rapide et économique).
Vous pouvez le changer dans `server/.env` :

```env
OPENAI_MODEL=gpt-4o
```

## 🎨 Personnalisation

### Modifier les icônes

Remplacez les fichiers dans `addin/assets/` :
- `icon-16.png` (16x16 pixels)
- `icon-32.png` (32x32 pixels)
- `icon-80.png` (80x80 pixels)

### Modifier l'interface

Éditez les fichiers HTML/CSS dans `addin/src/` :
- `taskpane.html` / `taskpane.js` : interface principale
- `admin.html` / `admin.js` : interface d'administration

## 📚 Ressources

- [Documentation Office Add-ins](https://learn.microsoft.com/en-us/office/dev/add-ins/)
- [API OpenAI Responses](https://platform.openai.com/docs/api-reference/responses)
- [Outlook Add-ins](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/)

## 🤝 Contribution

Ce projet est un MVP. N'hésitez pas à l'améliorer !

## 📄 Licence

MIT
