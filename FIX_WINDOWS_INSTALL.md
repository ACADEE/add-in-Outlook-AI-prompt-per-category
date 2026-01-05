# 🔧 Résolution des problèmes d'installation sur Windows

## 🚨 Problème rencontré

Erreur lors de l'installation de `better-sqlite3` sur Windows :
- Chemin trop long ou avec espaces
- Problèmes de compilation native (node-gyp)
- Permissions OneDrive

## ✅ Solution 1 : Déplacer le projet (RECOMMANDÉ)

### Pourquoi ?

Le chemin actuel contient :
- ✗ Des espaces
- ✗ Des caractères accentués
- ✗ OneDrive (peut causer des problèmes de permissions)

### Comment faire

**1. Créer un dossier simple :**

```powershell
# Dans PowerShell ou CMD
mkdir C:\Dev
```

**2. Déplacer le projet :**

```powershell
# Copier (plus sûr que move)
xcopy "C:\Users\utilisateur\OneDrive\Documents\SAMUEL\ACADEE TRAINING\ACADEE IA LABS Aube\MES PROJETS IA\add-in-Outlook-AI-prompt-per-category" C:\Dev\outlook-ai /E /I /H

# Ou avec PowerShell
Copy-Item "C:\Users\utilisateur\OneDrive\Documents\SAMUEL\ACADEE TRAINING\ACADEE IA LABS Aube\MES PROJETS IA\add-in-Outlook-AI-prompt-per-category" -Destination C:\Dev\outlook-ai -Recurse
```

**3. Aller dans le nouveau dossier et installer :**

```powershell
cd C:\Dev\outlook-ai\server
npm install
```

**4. Si ça fonctionne, continuer :**

```powershell
npm run setup
npm run dev
```

## ✅ Solution 2 : Alternative sans better-sqlite3

Si le déplacement n'est pas possible, utilisez une version simplifiée sans compilation native.

### Option A : Utiliser SQL.js (SQLite en pur JavaScript)

**1. Modifier `server/package.json` :**

Remplacez `better-sqlite3` par `sql.js` :

```json
{
  "dependencies": {
    "sql.js": "^1.10.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }
}
```

**2. Télécharger la version alternative :**

J'ai créé une branche avec sql.js à la place de better-sqlite3.

### Option B : Installer les outils de build Windows

Si vous voulez absolument utiliser better-sqlite3 :

**1. Installer les outils de build :**

```powershell
# En tant qu'administrateur
npm install -g windows-build-tools
```

**2. Redémarrer le terminal**

**3. Réessayer :**

```powershell
cd server
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
```

## ✅ Solution 3 : Utiliser WSL (Windows Subsystem for Linux)

Si vous avez WSL2 installé :

```bash
# Dans WSL Ubuntu
cd /mnt/c/Dev
git clone <votre-repo>
cd add-in-Outlook-AI-prompt-per-category/server
npm install
npm run setup
npm run dev
```

## 🎯 Solution rapide recommandée

### Étape 1 : Déplacer vers un chemin simple

```powershell
# Créer C:\Dev si n'existe pas
if (!(Test-Path C:\Dev)) { New-Item -ItemType Directory -Path C:\Dev }

# Aller dans votre dossier actuel
cd "C:\Users\utilisateur\OneDrive\Documents\SAMUEL\ACADEE TRAINING\ACADEE IA LABS Aube\MES PROJETS IA"

# Copier le projet
Copy-Item "add-in-Outlook-AI-prompt-per-category" -Destination "C:\Dev\outlook-ai" -Recurse

# Aller dans le nouveau dossier
cd C:\Dev\outlook-ai\server
```

### Étape 2 : Nettoyer et réinstaller

```powershell
# Supprimer les anciens fichiers (si présents)
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item package-lock.json }

# Installer
npm install
```

### Étape 3 : Configurer et démarrer

```powershell
npm run setup
npm run dev
```

## 🐛 Autres problèmes Windows

### Erreur EPERM (permissions)

**Cause :** OneDrive ou antivirus bloque l'accès

**Solution :**
1. Désactiver temporairement OneDrive pour ce dossier
2. Ajouter une exception dans l'antivirus
3. Exécuter PowerShell en administrateur

### Erreur "cannot find python"

**Solution :**
```powershell
npm config set python "C:\Python311\python.exe"
# ou
npm install -g windows-build-tools
```

### Erreur "MSBuild.exe failed"

**Solution :**
Installer Visual Studio Build Tools :
https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022

Sélectionner :
- ✅ Desktop development with C++
- ✅ Node.js development tools

## 🔍 Vérifier votre installation

### Vérifier Node.js

```powershell
node --version  # Devrait être >= 18
npm --version
```

### Vérifier les outils de build

```powershell
npm config get msvs_version
```

### Vérifier Python

```powershell
python --version  # Devrait être 3.x
```

## ✅ Checklist de résolution

- [ ] Déplacer le projet vers `C:\Dev\outlook-ai`
- [ ] Ouvrir PowerShell en administrateur
- [ ] `cd C:\Dev\outlook-ai\server`
- [ ] `npm cache clean --force`
- [ ] Supprimer `node_modules` et `package-lock.json`
- [ ] `npm install`
- [ ] `npm run setup`
- [ ] `npm run dev`

## 📞 Si rien ne fonctionne

Utilisez la version alternative que je vais créer sans better-sqlite3.

Ou utilisez Docker :

```powershell
# Si Docker Desktop est installé
docker run -it -v C:\Dev\outlook-ai:/app -w /app/server node:18 bash
npm install
npm run dev
```

## 🎉 Une fois que ça fonctionne

Vous devriez voir :

```
✅ Server HTTPS listening on https://localhost:8787
```

Puis dans un autre terminal :

```powershell
cd C:\Dev\outlook-ai\addin
npm install
npm run dev
```

Et suivre le guide : [QUICK_OUTLOOK_ONLINE.md](QUICK_OUTLOOK_ONLINE.md)
