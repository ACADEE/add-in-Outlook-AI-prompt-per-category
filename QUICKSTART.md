# 🚀 Guide de démarrage rapide

Ce guide vous permet de démarrer en 5 minutes.

## ⚡ Étape 1 : Démarrer les serveurs

### Terminal 1 : Backend (HTTPS)
```bash
cd server
npm run dev
```

✅ Le serveur démarre sur `https://localhost:8787`

### Terminal 2 : Add-in (HTTPS)
```bash
cd addin
npm run dev
```

✅ L'interface est disponible sur `https://localhost:3000`

## 🔐 Étape 2 : Accepter les certificats HTTPS

Dans votre navigateur, visitez et acceptez les certificats :

1. **Backend** : `https://localhost:8787/health`
   - Cliquez sur "Avancé" → "Accepter le risque"

2. **Add-in** : `https://localhost:3000/src/taskpane.html`
   - Cliquez sur "Avancé" → "Accepter le risque"

## ⚙️ Étape 3 : Configuration (Interface Admin)

### 1. Ouvrir l'admin
`https://localhost:3000/src/admin.html`

### 2. Remplir les champs
- **Backend** : `https://localhost:8787` (déjà rempli)
- **Admin token** : `my_admin_token_change_this_in_production`
- **Clé OpenAI** : votre clé API (commence par `sk-...`)

### 3. Enregistrer la clé
Cliquez sur **Enregistrer la clé**

### 4. Créer un prompt par défaut

| Champ | Valeur |
|-------|--------|
| Catégorie | `*` |
| Nom | `Réponse générique` |
| Priorité | `100` |
| Actif | `Actif` |
| Template | `Réponds de manière professionnelle et concise. Rappelle le point clé de l'email. Propose 2 options si nécessaire. Termine par une question fermée.` |

Cliquez sur **Créer**

## 📱 Étape 4 : Installer dans Outlook

### Outlook Desktop

1. **Fichier** → **Gérer les compléments** → **Mes compléments**
2. **Ajouter un complément personnalisé** → **Ajouter à partir d'un fichier**
3. Sélectionner : `addin/manifest.xml`
4. Confirmer

### Outlook Web

1. ⚙️ **Paramètres** → **Afficher tous les paramètres Outlook**
2. **Personnaliser** → **Gérer les compléments**
3. **+ Ajouter un complément** → **Ajouter à partir d'un fichier**
4. Sélectionner : `addin/manifest.xml`

## ✅ Étape 5 : Tester

1. Ouvrez un email dans Outlook
2. Cliquez sur **AI Draft** dans le ruban
3. Cliquez sur **Générer le brouillon**
4. Attendez quelques secondes
5. Le brouillon s'affiche
6. Cliquez sur **Insérer dans la réponse**

## 🎉 C'est terminé !

Votre add-in est opérationnel !

## 📚 Pour aller plus loin

- Consultez le [README.md](README.md) pour la documentation complète
- Créez des prompts pour vos catégories Outlook spécifiques
- Personnalisez les templates selon vos besoins

## ❓ Problèmes courants

### Le serveur ne démarre pas
```bash
# Régénérer les certificats
npm run generate-certs
```

### L'add-in ne charge pas
1. Vérifiez que les deux serveurs sont démarrés
2. Acceptez les certificats HTTPS
3. Redémarrez Outlook

### Erreur "OpenAI API key not set"
1. Retournez dans l'interface admin
2. Vérifiez que la clé est bien enregistrée
3. Rechargez l'add-in

## 🆘 Support

Pour plus d'informations, consultez :
- [README.md](README.md) - Documentation complète
- [Issues GitHub](../../issues) - Signaler un problème
