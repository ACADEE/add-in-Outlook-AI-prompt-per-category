# 🔐 Configuration du fichier .env

Guide complet pour configurer les variables d'environnement de l'application.

## 📍 Localisation du fichier

Le fichier `.env` se trouve dans le dossier `server/` :

```
add-in-Outlook-AI-prompt-per-category/
└── server/
    ├── .env.example    ← Modèle (ne pas modifier)
    └── .env            ← Votre configuration (à créer)
```

## 🆕 Créer le fichier .env

### Méthode 1 : Copier le modèle (recommandée)

```bash
cd server
cp .env.example .env
```

### Méthode 2 : Créer manuellement

Créez un fichier nommé `.env` dans le dossier `server/` avec ce contenu :

```env
PORT=8787
MASTER_KEY=CHANGEZ_CETTE_CLE_ICI
ADMIN_TOKEN=CHANGEZ_CE_TOKEN_ICI
OPENAI_MODEL=gpt-4o-mini

# Chemins des certificats HTTPS
SSL_KEY_PATH=../certs/localhost.key
SSL_CERT_PATH=../certs/localhost.crt
```

## 🔑 Générer les valeurs sécurisées

### 1️⃣ MASTER_KEY (clé de chiffrement)

Cette clé sert à **chiffrer votre clé API OpenAI** dans la base de données. Elle doit avoir **minimum 32 caractères**.

#### Option A : Générer avec Node.js (recommandée)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Exemple de résultat :
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

#### Option B : Générer avec OpenSSL

```bash
openssl rand -hex 32
```

#### Option C : Générer en ligne

Utilisez un générateur de mots de passe sécurisé : https://passwordsgenerator.net/
- Longueur : 64 caractères
- Inclure : lettres, chiffres

#### Option D : Pour le développement uniquement

Vous pouvez utiliser une chaîne de caractères de votre choix (minimum 32 caractères) :

```
MASTER_KEY=mon_projet_outlook_ai_secret_key_2024_very_secure_32chars_min
```

⚠️ **Important** : En production, utilisez une clé aléatoire générée (Option A ou B).

### 2️⃣ ADMIN_TOKEN (token d'administration)

Ce token protège l'accès à l'interface d'administration et aux API sensibles.

#### Option A : Générer avec Node.js (recommandée)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Exemple de résultat :
```
X7Yz9mN3pQr5tWv8xAb2cDe4fGh6iJk8lMn0oPq2rSt4uVw6xYz8
```

#### Option B : Générer avec OpenSSL

```bash
openssl rand -base64 32
```

#### Option C : Pour le développement uniquement

Vous pouvez utiliser un mot de passe simple :

```
ADMIN_TOKEN=MonMotDePasseAdmin2024
```

⚠️ **Important** : En production, utilisez un token aléatoire généré (Option A ou B).

## 📝 Exemple de fichier .env complet

Voici un exemple de fichier `.env` correctement configuré :

```env
PORT=8787
MASTER_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
ADMIN_TOKEN=X7Yz9mN3pQr5tWv8xAb2cDe4fGh6iJk8lMn0oPq2rSt4uVw6xYz8
OPENAI_MODEL=gpt-4o-mini

# Chemins des certificats HTTPS
SSL_KEY_PATH=../certs/localhost.key
SSL_CERT_PATH=../certs/localhost.crt
```

## 🚀 Configuration pour développement local

Si vous testez en local uniquement, vous pouvez utiliser des valeurs simples :

```env
PORT=8787
MASTER_KEY=dev_master_key_local_testing_32_chars_minimum_length_ok
ADMIN_TOKEN=dev_admin_token_local
OPENAI_MODEL=gpt-4o-mini

SSL_KEY_PATH=../certs/localhost.key
SSL_CERT_PATH=../certs/localhost.crt
```

## 🔐 Configuration pour production

Pour un environnement de production, **TOUJOURS** générer des valeurs aléatoires :

### Script complet de génération

Créez un fichier `generate-secrets.sh` :

```bash
#!/bin/bash

echo "Génération des secrets..."
echo ""

MASTER_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ADMIN_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")

echo "PORT=8787"
echo "MASTER_KEY=$MASTER_KEY"
echo "ADMIN_TOKEN=$ADMIN_TOKEN"
echo "OPENAI_MODEL=gpt-4o-mini"
echo ""
echo "SSL_KEY_PATH=../certs/localhost.key"
echo "SSL_CERT_PATH=../certs/localhost.crt"
echo ""
echo "Copiez ces valeurs dans votre fichier .env"
```

Puis exécutez :

```bash
chmod +x generate-secrets.sh
./generate-secrets.sh
```

Ou directement en une ligne :

```bash
echo "MASTER_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
echo "ADMIN_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
```

## 📖 Explication des variables

| Variable | Description | Exemple | Obligatoire |
|----------|-------------|---------|-------------|
| `PORT` | Port du serveur HTTPS | `8787` | Oui |
| `MASTER_KEY` | Clé de chiffrement pour la clé OpenAI (min 32 chars) | `a1b2c3...` | **Oui** |
| `ADMIN_TOKEN` | Token pour accéder à l'admin | `X7Yz9m...` | **Oui** |
| `OPENAI_MODEL` | Modèle OpenAI à utiliser | `gpt-4o-mini` | Oui |
| `SSL_KEY_PATH` | Chemin vers la clé SSL | `../certs/localhost.key` | Oui |
| `SSL_CERT_PATH` | Chemin vers le certificat SSL | `../certs/localhost.crt` | Oui |

## 🔄 Utilisation des valeurs

### 1. MASTER_KEY

Cette clé est utilisée **uniquement côté serveur** pour chiffrer votre clé API OpenAI avant de la stocker dans la base de données.

**Vous n'avez PAS besoin de la retaper** - elle est automatiquement utilisée par le serveur au démarrage.

### 2. ADMIN_TOKEN

Ce token est utilisé pour accéder à l'interface d'administration.

**Vous devrez le saisir une seule fois** dans l'interface admin : `https://localhost:3000/src/admin.html`

![Screenshot de l'admin](https://via.placeholder.com/600x200?text=Interface+Admin+-+Champ+Admin+Token)

## 📋 Procédure complète

### Étape 1 : Créer le fichier .env

```bash
cd server
cp .env.example .env
```

### Étape 2 : Générer les secrets

```bash
# Générer MASTER_KEY
node -e "console.log('MASTER_KEY=' + require('crypto').randomBytes(32).toString('hex'))"

# Générer ADMIN_TOKEN
node -e "console.log('ADMIN_TOKEN=' + require('crypto').randomBytes(32).toString('base64'))"
```

### Étape 3 : Éditer .env

Ouvrez le fichier `server/.env` avec un éditeur de texte :

```bash
# Linux/Mac
nano server/.env

# Windows
notepad server\.env
```

Remplacez les valeurs :

```env
PORT=8787
MASTER_KEY=<COLLEZ_ICI_LA_MASTER_KEY_GENEREE>
ADMIN_TOKEN=<COLLEZ_ICI_L_ADMIN_TOKEN_GENERE>
OPENAI_MODEL=gpt-4o-mini

SSL_KEY_PATH=../certs/localhost.key
SSL_CERT_PATH=../certs/localhost.crt
```

### Étape 4 : Sauvegarder

- Avec `nano` : `Ctrl + O`, puis `Enter`, puis `Ctrl + X`
- Avec `notepad` : `Fichier` → `Enregistrer`

### Étape 5 : Vérifier

```bash
cat server/.env
```

Vous devriez voir vos valeurs affichées.

### Étape 6 : Démarrer le serveur

```bash
cd server
npm run dev
```

Si le serveur démarre sans erreur, votre configuration est correcte ! ✅

## 🔍 Où utiliser ces valeurs ?

### MASTER_KEY
- ✅ **Déjà utilisée automatiquement** par le serveur
- ❌ **Ne jamais la partager**
- ❌ **Ne jamais la commiter dans Git** (le fichier .env est ignoré par Git)

### ADMIN_TOKEN
- ✅ **À saisir dans l'interface admin** : `https://localhost:3000/src/admin.html`
- ✅ Dans le champ "Admin token (Bearer)"
- ❌ **Ne jamais la partager**

## ⚠️ Sécurité

### ✅ À FAIRE
- Générer des valeurs aléatoires pour la production
- Ne jamais commiter le fichier `.env` dans Git
- Changer les valeurs si vous pensez qu'elles ont été compromises
- Utiliser des valeurs différentes pour chaque environnement (dev, prod)

### ❌ À NE PAS FAIRE
- Utiliser les valeurs par défaut de `.env.example` en production
- Partager votre fichier `.env`
- Commiter le fichier `.env` dans Git (il est déjà ignoré par `.gitignore`)
- Utiliser des valeurs trop courtes (<32 caractères pour MASTER_KEY)

## 🐛 Dépannage

### Erreur "MASTER_KEY must be at least 32 chars"

**Solution** : Votre MASTER_KEY est trop courte. Régénérez-la :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Erreur "Unauthorized" dans l'admin

**Cause** : Le ADMIN_TOKEN saisi ne correspond pas à celui du fichier `.env`

**Solution** :
1. Vérifiez la valeur dans `server/.env`
2. Copiez-la exactement (attention aux espaces)
3. Collez-la dans l'interface admin

### Le serveur ne démarre pas

**Solution** : Vérifiez que le fichier `.env` existe :

```bash
ls -la server/.env
```

S'il n'existe pas :

```bash
cp server/.env.example server/.env
```

Puis configurez-le selon ce guide.

## 📞 Besoin d'aide ?

Si vous avez des questions sur la configuration :

1. Vérifiez que le fichier `.env` existe : `ls server/.env`
2. Vérifiez le contenu : `cat server/.env`
3. Assurez-vous que MASTER_KEY a au moins 32 caractères
4. Consultez les logs du serveur pour voir les erreurs exactes

## ✅ Checklist de configuration

- [ ] Fichier `.env` créé dans `server/`
- [ ] MASTER_KEY générée (≥32 caractères)
- [ ] ADMIN_TOKEN généré
- [ ] PORT défini (8787 par défaut)
- [ ] OPENAI_MODEL défini (gpt-4o-mini recommandé)
- [ ] Chemins des certificats SSL configurés
- [ ] Fichier sauvegardé
- [ ] Serveur démarre sans erreur
- [ ] ADMIN_TOKEN noté quelque part (vous en aurez besoin pour l'admin)

Une fois cette configuration terminée, passez à l'étape suivante : **[Configuration de l'admin](QUICK_OUTLOOK_ONLINE.md#étape-3--configuration-1-fois)**
