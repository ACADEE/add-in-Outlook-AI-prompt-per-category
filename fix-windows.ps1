# Script PowerShell pour résoudre les problèmes d'installation sur Windows
# Déplace le projet vers C:\Dev\outlook-ai et installe les dépendances

Write-Host "🔧 Résolution des problèmes d'installation Windows..." -ForegroundColor Cyan
Write-Host ""

# Vérifier si on est dans le bon dossier
$currentPath = Get-Location
Write-Host "📍 Dossier actuel : $currentPath" -ForegroundColor Yellow

# Créer C:\Dev si nécessaire
$targetPath = "C:\Dev\outlook-ai"

if (!(Test-Path "C:\Dev")) {
    Write-Host "📁 Création du dossier C:\Dev..." -ForegroundColor Green
    New-Item -ItemType Directory -Path "C:\Dev" | Out-Null
}

# Vérifier si le dossier cible existe déjà
if (Test-Path $targetPath) {
    Write-Host "⚠️  Le dossier $targetPath existe déjà !" -ForegroundColor Yellow
    $response = Read-Host "Voulez-vous le supprimer et recommencer ? (o/n)"
    if ($response -eq "o" -or $response -eq "O") {
        Write-Host "🗑️  Suppression de l'ancien dossier..." -ForegroundColor Red
        Remove-Item -Recurse -Force $targetPath
    } else {
        Write-Host "❌ Opération annulée." -ForegroundColor Red
        exit 1
    }
}

# Copier le projet
Write-Host "📦 Copie du projet vers $targetPath..." -ForegroundColor Green
Write-Host "   Cela peut prendre quelques minutes..." -ForegroundColor Gray

try {
    Copy-Item -Path $currentPath -Destination $targetPath -Recurse -Force
    Write-Host "✅ Projet copié avec succès !" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la copie : $_" -ForegroundColor Red
    exit 1
}

# Aller dans le dossier serveur
Set-Location "$targetPath\server"
Write-Host ""
Write-Host "📍 Dossier actuel : $targetPath\server" -ForegroundColor Yellow

# Nettoyer les anciens fichiers
Write-Host ""
Write-Host "🧹 Nettoyage des anciens fichiers..." -ForegroundColor Cyan

if (Test-Path "node_modules") {
    Write-Host "   Suppression de node_modules..." -ForegroundColor Gray
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
}

if (Test-Path "package-lock.json") {
    Write-Host "   Suppression de package-lock.json..." -ForegroundColor Gray
    Remove-Item "package-lock.json" -ErrorAction SilentlyContinue
}

# Nettoyer le cache npm
Write-Host "   Nettoyage du cache npm..." -ForegroundColor Gray
npm cache clean --force 2>$null

# Installer les dépendances
Write-Host ""
Write-Host "📥 Installation des dépendances..." -ForegroundColor Cyan
Write-Host "   Cela peut prendre quelques minutes..." -ForegroundColor Gray
Write-Host ""

$installOutput = npm install 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dépendances installées avec succès !" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    Write-Host $installOutput -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Essayez manuellement :" -ForegroundColor Yellow
    Write-Host "   cd $targetPath\server" -ForegroundColor Gray
    Write-Host "   npm install --verbose" -ForegroundColor Gray
    exit 1
}

# Générer le fichier .env
Write-Host ""
Write-Host "🔐 Génération du fichier .env..." -ForegroundColor Cyan

if (!(Test-Path ".env")) {
    $setupOutput = npm run setup 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Fichier .env créé !" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Vous devrez créer le fichier .env manuellement" -ForegroundColor Yellow
        Write-Host "   npm run setup" -ForegroundColor Gray
    }
} else {
    Write-Host "✅ Fichier .env existe déjà" -ForegroundColor Green
}

# Installer les dépendances de l'add-in
Write-Host ""
Write-Host "📥 Installation des dépendances de l'add-in..." -ForegroundColor Cyan
Set-Location "$targetPath\addin"

$addinInstall = npm install 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dépendances de l'add-in installées !" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erreur lors de l'installation de l'add-in" -ForegroundColor Yellow
}

# Résumé
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Installation terminée !" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📂 Nouveau dossier du projet : $targetPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Pour démarrer :" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Terminal 1 (Backend) :" -ForegroundColor White
Write-Host "   cd $targetPath\server" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "   Terminal 2 (Add-in) :" -ForegroundColor White
Write-Host "   cd $targetPath\addin" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Consultez ensuite : QUICK_OUTLOOK_ONLINE.md" -ForegroundColor Cyan
Write-Host ""
