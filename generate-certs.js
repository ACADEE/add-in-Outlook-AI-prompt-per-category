#!/usr/bin/env node

/**
 * Script de génération de certificats SSL auto-signés pour localhost
 * Alternative à OpenSSL pour Windows
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔐 Génération des certificats SSL pour localhost...\n');

const certsDir = path.join(__dirname, '..', 'certs');

// Créer le dossier certs s'il n'existe pas
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
  console.log('✅ Dossier certs/ créé\n');
}

const keyPath = path.join(certsDir, 'localhost.key');
const certPath = path.join(certsDir, 'localhost.crt');

// Vérifier si les certificats existent déjà
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('⚠️  Les certificats existent déjà !');
  console.log('   - ' + keyPath);
  console.log('   - ' + certPath);
  console.log('');
  console.log('Pour les régénérer, supprimez-les d\'abord :');
  console.log('   rm certs/localhost.key certs/localhost.crt');
  console.log('');
  process.exit(0);
}

console.log('🔍 Recherche d\'OpenSSL...\n');

// Liste des commandes OpenSSL possibles
const opensslCommands = [
  'openssl',                                                    // OpenSSL dans PATH
  'C:\\Program Files\\Git\\usr\\bin\\openssl.exe',            // Git Bash
  'C:\\Program Files (x86)\\Git\\usr\\bin\\openssl.exe',      // Git Bash (x86)
  '"C:\\Program Files\\OpenSSL-Win64\\bin\\openssl.exe"',     // OpenSSL Win64
  '"C:\\Program Files\\OpenSSL\\bin\\openssl.exe"',           // OpenSSL
];

let opensslCmd = null;

// Tester chaque commande
for (const cmd of opensslCommands) {
  try {
    await execAsync(`${cmd} version`);
    opensslCmd = cmd;
    console.log(`✅ OpenSSL trouvé : ${cmd}\n`);
    break;
  } catch (error) {
    // Continuer avec la prochaine commande
  }
}

if (opensslCmd) {
  // Générer avec OpenSSL
  console.log('📝 Génération des certificats avec OpenSSL...\n');

  const command = `${opensslCmd} req -x509 -newkey rsa:2048 -nodes -keyout "${keyPath}" -out "${certPath}" -days 365 -subj "/CN=localhost"`;

  try {
    await execAsync(command);
    console.log('✅ Certificats générés avec succès !\n');
  } catch (error) {
    console.error('❌ Erreur lors de la génération :', error.message);
    process.exit(1);
  }
} else {
  // OpenSSL non trouvé - utiliser une approche alternative
  console.log('⚠️  OpenSSL non trouvé. Génération avec node-forge...\n');

  try {
    // Essayer d'importer node-forge (si disponible)
    const forge = await import('node-forge').catch(() => null);

    if (forge) {
      generateWithForge(forge.default, keyPath, certPath);
    } else {
      console.log('📦 Installation de node-forge pour générer les certificats...\n');
      await execAsync('npm install node-forge --no-save');
      const forgeModule = await import('node-forge');
      generateWithForge(forgeModule.default, keyPath, certPath);
    }
  } catch (error) {
    console.error('❌ Impossible de générer les certificats automatiquement.');
    console.log('');
    console.log('📖 Solutions :');
    console.log('');
    console.log('1. Installer Git pour Windows (recommandé) :');
    console.log('   https://git-scm.com/download/win');
    console.log('   Git Bash inclut OpenSSL');
    console.log('');
    console.log('2. Installer OpenSSL pour Windows :');
    console.log('   https://slproweb.com/products/Win32OpenSSL.html');
    console.log('');
    console.log('3. Utiliser WSL (Windows Subsystem for Linux)');
    console.log('');
    process.exit(1);
  }
}

function generateWithForge(forge, keyPath, certPath) {
  console.log('🔧 Génération avec node-forge...\n');

  const pki = forge.pki;
  const keys = pki.rsa.generateKeyPair(2048);
  const cert = pki.createCertificate();

  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  const attrs = [{
    name: 'commonName',
    value: 'localhost'
  }];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    keyEncipherment: true
  }, {
    name: 'subjectAltName',
    altNames: [{
      type: 2, // DNS
      value: 'localhost'
    }, {
      type: 7, // IP
      ip: '127.0.0.1'
    }]
  }]);

  cert.sign(keys.privateKey, forge.md.sha256.create());

  const pem = {
    privateKey: pki.privateKeyToPem(keys.privateKey),
    certificate: pki.certificateToPem(cert)
  };

  fs.writeFileSync(keyPath, pem.privateKey);
  fs.writeFileSync(certPath, pem.certificate);

  console.log('✅ Certificats générés avec succès !\n');
}

console.log('📄 Fichiers créés :');
console.log('   - ' + keyPath);
console.log('   - ' + certPath);
console.log('');
console.log('⚠️  IMPORTANT :');
console.log('Vous devrez accepter ces certificats dans votre navigateur :');
console.log('   1. Ouvrez https://localhost:8787/health');
console.log('   2. Cliquez sur "Avancé" puis "Accepter le risque"');
console.log('   3. Ouvrez https://localhost:3000/src/taskpane.html');
console.log('   4. Acceptez le certificat à nouveau');
console.log('');
console.log('🚀 Vous pouvez maintenant démarrer les serveurs :');
console.log('   cd server && npm run dev');
console.log('   cd addin && npm run dev');
console.log('');
