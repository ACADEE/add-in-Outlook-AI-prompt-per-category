# ⚡ Installation rapide - Outlook 365 Online

## 🎯 En 3 minutes chrono

### 1️⃣ Démarrer (2 terminaux)

**Terminal 1 :**
```bash
cd server
npm run dev
```

**Terminal 2 :**
```bash
cd addin
npm run dev
```

### 2️⃣ Accepter les certificats

Dans votre navigateur, ouvrez ces URLs et cliquez "Accepter le risque" :

1. `https://localhost:8787/health` ✅
2. `https://localhost:3000/src/taskpane.html` ✅

### 3️⃣ Configurer (1 seule fois)

Ouvrez : `https://localhost:3000/src/admin.html`

| Champ | Valeur |
|-------|--------|
| Backend | `https://localhost:8787` |
| Admin token | `my_admin_token_change_this_in_production` |
| Clé OpenAI | `sk-...` (votre clé) |

Cliquez "Enregistrer la clé" ✅

**Créer un prompt :**

- Catégorie : `*`
- Nom : `Réponse générique`
- Priorité : `100`
- Template : `Réponds professionnellement et concisément en français.`

Cliquez "Créer" ✅

### 4️⃣ Installer dans Outlook Online

1. Ouvrez `https://outlook.office.com`
2. Cliquez sur **⚙️** (paramètres, en haut à droite)
3. Cliquez sur **"Afficher tous les paramètres Outlook"**
4. **Général** → **Gérer les compléments**
5. **"+ Mes compléments"** → **"Ajouter un complément personnalisé"** → **"Ajouter à partir d'un fichier"**
6. Sélectionnez le fichier : `addin/manifest.xml`
7. Cliquez **"Installer"**
8. Fermez les paramètres

### 5️⃣ Utiliser

1. Ouvrez un email
2. Cliquez **"Répondre"**
3. Cherchez le bouton **"AI Draft"** dans le ruban (ou menu **...**)
4. Cliquez **"Générer le brouillon"**
5. Cliquez **"Insérer dans la réponse"**

## 🆘 Ça ne marche pas ?

### L'add-in n'apparaît pas
```
Ctrl + F5 pour recharger Outlook
```

### Erreur "Unable to load"
Acceptez à nouveau les certificats :
- `https://localhost:8787/health`
- `https://localhost:3000/src/taskpane.html`

Puis : `Ctrl + F5` dans Outlook

### Erreur "OpenAI API key not set"
Retournez dans l'admin et enregistrez à nouveau la clé

## 📍 Où trouver l'add-in dans Outlook Online ?

L'add-in apparaît quand vous êtes en mode "Répondre" ou "Nouveau message" :

**Option 1 : Ruban en haut**
```
[Message] [Insérer] [Options] [AI Draft] ← ICI
```

**Option 2 : Menu "..."**
```
[...] → AI Draft
```

## ✅ Tout fonctionne !

Maintenant vous pouvez :
- Créer des prompts personnalisés par catégorie
- Générer des réponses en 1 clic
- Gagner du temps sur vos emails !

Pour plus de détails, consultez [OUTLOOK_ONLINE_INSTALL.md](OUTLOOK_ONLINE_INSTALL.md)
