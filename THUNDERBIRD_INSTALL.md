# 📧 Installation sur Mozilla Thunderbird

Guide complet pour installer et utiliser l'extension Thunderbird AI Draft.

## 🎯 Avantages Thunderbird

- ✅ **Plus simple** qu'Outlook : pas besoin de certificats HTTPS complexes
- ✅ **Installation directe** : glisser-déposer le dossier
- ✅ **Multi-plateforme** : Windows, macOS, Linux
- ✅ **Gratuit et open-source**
- ✅ **Même backend** que la version Outlook

## 📋 Prérequis

- Mozilla Thunderbird 102 ou supérieur
- Node.js installé (pour le backend)
- Clé API OpenAI

## 🚀 Installation rapide (5 minutes)

### Étape 1 : Démarrer le backend

Le backend est **le même** que pour Outlook.

#### Windows

```powershell
cd server
npm install
npm run setup
npm run dev
```

#### Linux/macOS

```bash
cd server
npm install
npm run setup
npm run dev
```

✅ Le serveur démarre sur `https://localhost:8787`

### Étape 2 : Installer l'extension dans Thunderbird

#### Méthode 1 : Mode développeur (recommandé pour tester)

1. Ouvrez Thunderbird
2. Allez dans **☰ Menu** → **Modules complémentaires et thèmes** (ou `Ctrl+Shift+A`)
3. Cliquez sur l'icône **⚙️** (roue dentée) à côté de "Modules complémentaires"
4. Sélectionnez **"Déboguer les modules complémentaires"**
5. Cliquez sur **"Charger un module complémentaire temporaire..."**
6. Naviguez vers le dossier `thunderbird-addon/`
7. Sélectionnez le fichier **`manifest.json`**
8. Cliquez sur **"Ouvrir"**

✅ L'extension est installée !

#### Méthode 2 : Installer comme extension permanente

1. Compresser le dossier `thunderbird-addon/` en ZIP :

   **Windows :**
   ```powershell
   Compress-Archive -Path thunderbird-addon\* -DestinationPath thunderbird-ai-draft.xpi
   ```

   **Linux/macOS :**
   ```bash
   cd thunderbird-addon
   zip -r ../thunderbird-ai-draft.xpi *
   cd ..
   ```

2. Dans Thunderbird : **☰ Menu** → **Modules complémentaires**
3. Cliquez sur l'icône **⚙️** → **"Installer un module depuis un fichier..."**
4. Sélectionnez `thunderbird-ai-draft.xpi`
5. Confirmez l'installation

### Étape 3 : Configuration initiale

#### 1. Configurer le backend

1. Ouvrez votre navigateur
2. Allez sur `https://localhost:3000/src/admin.html`
3. Acceptez le certificat auto-signé
4. Remplissez :
   - **Backend** : `https://localhost:8787`
   - **Admin token** : (celui de votre fichier `.env`)
   - **Clé OpenAI** : `sk-...` (votre clé)
5. Cliquez **"Enregistrer la clé"**

#### 2. Créer un prompt par défaut

Dans la même page admin :

| Champ | Valeur |
|-------|--------|
| Catégorie | `*` |
| Nom | `Réponse générique` |
| Priorité | `100` |
| Template | `Réponds de manière professionnelle et concise en français. Rappelle le point clé de l'email. Demande des clarifications si nécessaire.` |

Cliquez **"Créer"**

## 📖 Utilisation

### 1️⃣ Quand vous lisez un email

1. Ouvrez un email
2. Cliquez sur l'icône **AI Draft** dans la barre d'outils
3. Le popup affiche les catégories de l'email
4. Cliquez sur **"Répondre avec IA"**
5. Une fenêtre de composition s'ouvre

### 2️⃣ Quand vous composez une réponse

1. Cliquez sur **"Répondre"** à un email
2. Dans la fenêtre de composition, cliquez sur l'icône **AI Draft**
3. Le popup s'ouvre :
   - Les catégories sont détectées automatiquement
   - Le prompt est sélectionné selon les catégories
4. Cliquez sur **"Générer le brouillon"**
5. Attendez quelques secondes
6. Le brouillon s'affiche dans la zone de texte
7. Cliquez sur **"Insérer dans le message"**
8. Le texte est inséré dans votre email
9. Modifiez si nécessaire et envoyez !

## 🏷️ Utiliser les catégories (Tags)

Dans Thunderbird, les catégories s'appellent **"Étiquettes"** (Tags).

### Créer des étiquettes

1. Clic droit sur un email → **"Étiquette"** → **"Nouvelle étiquette..."**
2. Donnez un nom : `Urgent`, `Client VIP`, `Support`, etc.
3. Choisissez une couleur

### Créer des prompts par étiquette

Dans l'interface admin (`https://localhost:3000/src/admin.html`) :

**Exemple 1 : Urgent**
```
Catégorie : Urgent
Nom : Réponse urgente
Priorité : 10
Template : Réponds rapidement. Confirme la prise en compte de l'urgence. Propose une solution immédiate.
```

**Exemple 2 : Support**
```
Catégorie : Support
Nom : Réponse support
Priorité : 50
Template : Réponds avec empathie. Résume le problème pour confirmer. Propose une solution étape par étape.
```

## 🔧 Configuration avancée

### Changer l'URL du backend

Dans le popup de l'extension, modifiez le champ "Backend Server" si votre serveur n'est pas sur `https://localhost:8787`.

### Désactiver les certificats auto-signés (Production)

Pour la production, utilisez des certificats valides ou déployez le backend sur un serveur avec HTTPS.

## 🐛 Dépannage

### L'extension n'apparaît pas

**Vérification :**
1. Allez dans **☰ Menu** → **Modules complémentaires**
2. Vérifiez que "Thunderbird AI Draft" est listé et **activé**
3. Si non, activez-le

### Erreur "Failed to fetch"

**Causes possibles :**
1. Le backend n'est pas démarré → Lancez `npm run dev` dans `server/`
2. L'URL du backend est incorrecte → Vérifiez dans le popup
3. Certificat HTTPS non accepté → Ouvrez `https://localhost:8787/health` dans votre navigateur et acceptez

### Les catégories ne sont pas détectées

**Solution :**
1. Vérifiez que l'email a des **étiquettes** (tags)
2. Les étiquettes s'affichent en haut de l'email
3. Si aucune étiquette, sélectionnez manuellement le prompt

### Erreur "OpenAI API key not set"

**Solution :**
1. Ouvrez l'interface admin : `https://localhost:3000/src/admin.html`
2. Enregistrez votre clé OpenAI
3. Créez au moins un prompt avec catégorie `*`

## 🆚 Différences avec la version Outlook

| Aspect | Thunderbird | Outlook |
|--------|-------------|---------|
| Installation | ✅ Simple (glisser-déposer) | ❌ Complexe (manifest XML) |
| Certificats HTTPS | ✅ Pas nécessaires pour l'extension | ❌ Requis |
| Catégories | Étiquettes (Tags) | Catégories Outlook |
| API | WebExtensions (browser.*) | Office.js |
| Plateformes | Windows, macOS, Linux | Windows, macOS, Web |

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│          Mozilla Thunderbird             │
│  ┌───────────────────────────────────┐  │
│  │   Extension AI Draft              │  │
│  │   - Détection des étiquettes      │  │
│  │   - Interface popup               │  │
│  │   - Insertion dans l'email        │  │
│  └──────────────┬────────────────────┘  │
└─────────────────┼───────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────┐
│    Backend Node.js (partagé)            │
│    https://localhost:8787                │
│  ┌───────────────────────────────────┐  │
│  │  - API REST                       │  │
│  │  - Base SQLite                    │  │
│  │  - Gestion des prompts            │  │
│  │  - Intégration OpenAI             │  │
│  └───────────────────────────────────┘  │
└─────────────────┬───────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────┐
│          OpenAI API                      │
│          api.openai.com                  │
└─────────────────────────────────────────┘
```

## 📝 Développement

### Modifier l'extension

1. Éditez les fichiers dans `thunderbird-addon/src/`
2. Dans Thunderbird : **Déboguer les modules** → Cliquez sur **"Recharger"**
3. Les changements sont appliqués immédiatement

### Console de débogage

1. **Déboguer les modules** → Cliquez sur **"Inspecter"** à côté de l'extension
2. La console s'ouvre pour voir les logs

### Tester sans backend

Vous pouvez tester l'interface sans le backend :
```javascript
// Dans compose-popup.js, commentez l'appel au backend
// et utilisez des données mockées
```

## 🚀 Déploiement

### 1. Backend en production

Déployez le backend sur un serveur avec un vrai certificat HTTPS :
- Heroku
- DigitalOcean
- AWS
- Votre propre serveur

### 2. Extension signée

Pour distribuer l'extension :
1. Créez un compte sur [addons.thunderbird.net](https://addons.thunderbird.net)
2. Soumettez votre extension pour signature
3. Une fois signée, elle peut être installée sans mode développeur

## 🔐 Sécurité

- ✅ Clé OpenAI stockée côté serveur (chiffrée)
- ✅ Jamais exposée dans l'extension
- ✅ Communication HTTPS uniquement
- ✅ Authentification admin par token

## ✅ Checklist d'installation

- [ ] Backend installé (`cd server && npm install`)
- [ ] Fichier `.env` configuré (`npm run setup`)
- [ ] Backend démarré (`npm run dev`)
- [ ] Certificats HTTPS acceptés dans le navigateur
- [ ] Clé OpenAI configurée (interface admin)
- [ ] Au moins un prompt créé (catégorie `*`)
- [ ] Extension installée dans Thunderbird
- [ ] Test avec un email : lecture → réponse → génération

## 📚 Ressources

- [Documentation Thunderbird WebExtensions](https://webextension-api.thunderbird.net/)
- [API MailExtension](https://thunderbird-webextensions.readthedocs.io/)
- [Exemples d'extensions Thunderbird](https://github.com/thunderbird/sample-extensions)

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez la console de débogage de l'extension
2. Vérifiez les logs du backend
3. Consultez le fichier [FIX_WINDOWS_INSTALL.md](FIX_WINDOWS_INSTALL.md) pour les problèmes backend
4. Ouvrez une issue sur GitHub

## 🎉 C'est tout !

Vous avez maintenant une extension Thunderbird fonctionnelle qui génère des réponses email avec l'IA ! 🚀

**Avantage Thunderbird** : Installation beaucoup plus simple qu'Outlook, et ça fonctionne sur Linux ! 🐧
