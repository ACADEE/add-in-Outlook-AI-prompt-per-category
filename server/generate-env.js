#!/usr/bin/env node

/**
 * Script de génération automatique du fichier .env
 * Génère des valeurs sécurisées pour MASTER_KEY et ADMIN_TOKEN
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔐 Génération du fichier .env avec des valeurs sécurisées...\n');

// Générer les secrets
const MASTER_KEY = crypto.randomBytes(32).toString('hex');
const ADMIN_TOKEN = crypto.randomBytes(32).toString('base64').replace(/[/+=]/g, '').substring(0, 40);

// Contenu du fichier .env
const envContent = `PORT=8787
MASTER_KEY=${MASTER_KEY}
ADMIN_TOKEN=${ADMIN_TOKEN}
OPENAI_MODEL=gpt-4o-mini

# Chemins des certificats HTTPS
SSL_KEY_PATH=../certs/localhost.key
SSL_CERT_PATH=../certs/localhost.crt
`;

const envPath = path.join(__dirname, '.env');

// Vérifier si .env existe déjà
if (fs.existsSync(envPath)) {
  console.log('⚠️  Le fichier .env existe déjà !');
  console.log('');
  console.log('Options :');
  console.log('1. Sauvegarder l\'ancien : mv .env .env.backup');
  console.log('2. Supprimer l\'ancien : rm .env');
  console.log('3. Puis relancer : node generate-env.js');
  console.log('');
  process.exit(1);
}

// Écrire le fichier
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ Fichier .env créé avec succès !\n');
console.log('📄 Contenu généré :\n');
console.log('─────────────────────────────────────────────────────────');
console.log(envContent);
console.log('─────────────────────────────────────────────────────────\n');

console.log('🔑 IMPORTANT - Notez votre ADMIN_TOKEN :');
console.log('');
console.log(`   ${ADMIN_TOKEN}`);
console.log('');
console.log('Vous en aurez besoin pour accéder à l\'interface d\'administration :');
console.log('👉 https://localhost:3000/src/admin.html\n');

console.log('🚀 Prochaines étapes :');
console.log('1. Démarrez le serveur : npm run dev');
console.log('2. Ouvrez l\'admin : https://localhost:3000/src/admin.html');
console.log('3. Utilisez l\'ADMIN_TOKEN ci-dessus pour vous connecter');
console.log('4. Configurez votre clé OpenAI\n');

console.log('⚠️  SÉCURITÉ :');
console.log('- Ne partagez JAMAIS ces valeurs');
console.log('- Ne commitez JAMAIS le fichier .env dans Git');
console.log('- Changez les valeurs si compromises\n');
