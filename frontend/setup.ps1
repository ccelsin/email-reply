#!/usr/bin/env pwsh

Write-Host "🚀 Setup Email Reply Extension" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
Write-Host "✓ Vérification de Node.js..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js non trouvé. Veuillez installer Node.js 16+ depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}
$nodeVersion = node -v
Write-Host "✓ Node.js $nodeVersion trouvé" -ForegroundColor Green

# Naviguer dans le dossier frontend si on est à la racine
if (Test-Path "./frontend/package.json") {
    Set-Location "./frontend"
    Write-Host "✓ Entrée dans le dossier /frontend" -ForegroundColor Green
} elseif (-not (Test-Path "./package.json")) {
    Write-Host "❌ Erreur: Exécuter ce script depuis la racine du projet (email-reply/)" -ForegroundColor Red
    exit 1
}

# Installer les dépendances
Write-Host ""
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dépendances installées" -ForegroundColor Green

# Builder l'extension
Write-Host ""
Write-Host "🔨 Compilation de l'extension..." -ForegroundColor Yellow
npm run build:extension
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la compilation" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Extension compilée dans le dossier /dist" -ForegroundColor Green

# Instructions finales
Write-Host ""
Write-Host "✅ Setup terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Ouvrir Chrome → chrome://extensions/" -ForegroundColor White
Write-Host "2. Activer 'Mode développeur' (bouton en haut à droite)" -ForegroundColor White
Write-Host "3. Cliquer 'Charger l'extension non empaquetée'" -ForegroundColor White
Write-Host "4. Sélectionner le dossier: ./frontend/dist/" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Tester:" -ForegroundColor Cyan
Write-Host "1. Aller sur https://gmail.com" -ForegroundColor White
Write-Host "2. Ouvrir un email" -ForegroundColor White
Write-Host "3. Vous devriez voir le bouton '💌 Générer réponse IA'" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Assurez-vous que le backend Java est lancé sur localhost:8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 Documentation complète: ./README.md" -ForegroundColor Cyan
Write-Host "⚡ Guide rapide: ./QUICKSTART.md" -ForegroundColor Cyan
