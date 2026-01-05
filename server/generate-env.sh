#!/bin/bash

# Script de génération automatique du fichier .env
# Génère des valeurs sécurisées pour MASTER_KEY et ADMIN_TOKEN

echo "🔐 Génération du fichier .env avec des valeurs sécurisées..."
echo ""

# Vérifier si .env existe déjà
if [ -f .env ]; then
  echo "⚠️  Le fichier .env existe déjà !"
  echo ""
  echo "Options :"
  echo "1. Sauvegarder l'ancien : mv .env .env.backup"
  echo "2. Supprimer l'ancien : rm .env"
  echo "3. Puis relancer : ./generate-env.sh"
  echo ""
  exit 1
fi

# Vérifier que Node.js est installé pour générer les secrets
if ! command -v node &> /dev/null; then
  echo "❌ Node.js n'est pas installé !"
  echo "Installez Node.js depuis https://nodejs.org"
  exit 1
fi

# Générer les secrets
MASTER_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ADMIN_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64').replace(/[\/+=]/g, '').substring(0, 40))")

# Créer le fichier .env
cat > .env << EOF
PORT=8787
MASTER_KEY=${MASTER_KEY}
ADMIN_TOKEN=${ADMIN_TOKEN}
OPENAI_MODEL=gpt-4o-mini

# Chemins des certificats HTTPS
SSL_KEY_PATH=../certs/localhost.key
SSL_CERT_PATH=../certs/localhost.crt
EOF

echo "✅ Fichier .env créé avec succès !"
echo ""
echo "📄 Contenu généré :"
echo ""
echo "─────────────────────────────────────────────────────────"
cat .env
echo "─────────────────────────────────────────────────────────"
echo ""

echo "🔑 IMPORTANT - Notez votre ADMIN_TOKEN :"
echo ""
echo "   ${ADMIN_TOKEN}"
echo ""
echo "Vous en aurez besoin pour accéder à l'interface d'administration :"
echo "👉 https://localhost:3000/src/admin.html"
echo ""

echo "🚀 Prochaines étapes :"
echo "1. Démarrez le serveur : npm run dev"
echo "2. Ouvrez l'admin : https://localhost:3000/src/admin.html"
echo "3. Utilisez l'ADMIN_TOKEN ci-dessus pour vous connecter"
echo "4. Configurez votre clé OpenAI"
echo ""

echo "⚠️  SÉCURITÉ :"
echo "- Ne partagez JAMAIS ces valeurs"
echo "- Ne commitez JAMAIS le fichier .env dans Git"
echo "- Changez les valeurs si compromises"
echo ""
