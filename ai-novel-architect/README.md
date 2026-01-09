# 📚 AI Novel Architect

**La référence mondiale de l'assistance à l'écriture de romans**

AI Novel Architect est une application complète qui vous aide à écrire des romans cohérents et captivants en utilisant l'intelligence artificielle de pointe (Google Gemini).

## ✨ Fonctionnalités Principales

### 🎯 Onboarding Flexible
- **Mode Guidé (Wizard)**: Répondez à des questions simples pour structurer votre roman étape par étape
- **Mode Import Rapide**: Collez vos notes existantes et laissez l'IA structurer automatiquement votre projet

### 🤖 4 Agents IA Spécialisés

1. **The Architect** - Planificateur
   - Transforme vos idées en structure narrative cohérente
   - Crée le plan des chapitres et les fiches personnages

2. **The Ghostwriter** - Écrivain
   - Rédige vos chapitres en respectant votre style
   - Maintient la cohérence narrative

3. **The Auditor** - Vérificateur
   - Analyse la cohérence de chaque chapitre
   - Identifie les incohérences et problèmes

4. **The Archivist** - Gestionnaire d'État
   - Met à jour automatiquement l'état des personnages
   - Maintient une "Bible" vivante de votre univers

### 🔥 Fonctionnalités Avancées

- **Gestion d'État Vivante**: Les personnages évoluent au fil des chapitres
- **Context Caching**: Utilisation intelligente de l'API Gemini pour des performances optimales
- **Authentification Firebase**: Connexion sécurisée et gestion des utilisateurs
- **Interface Moderne**: UI claire et "Writer-focused" avec TailwindCSS
- **Indicateur d'État API**: Visualisation en temps réel de la connexion à l'API

## 🛠️ Stack Technique

### Frontend
- **React 18+** avec TypeScript
- **Vite** pour un développement rapide
- **TailwindCSS** pour le styling
- **React Router** pour la navigation
- **Firebase** pour l'authentification et Firestore

### Backend
- **Node.js** avec TypeScript
- **Express.js** pour l'API REST
- **Google Gemini 1.5 Pro** (API)
- **PostgreSQL** (base de données recommandée)

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm
- Compte Firebase (gratuit)
- Clé API Google Gemini (chaque utilisateur fournit la sienne)

### 1. Cloner le Repository

```bash
git clone <repository-url>
cd ai-novel-architect
```

### 2. Installation du Frontend

```bash
cd frontend
npm install
```

### 3. Installation du Backend

```bash
cd ../backend
npm install
```

### 4. Configuration Firebase

Le projet est déjà configuré avec Firebase. Les credentials sont dans `frontend/src/config/firebase.ts`.

### 5. Variables d'Environnement

Backend - Créez un fichier `.env`:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/ai_novel_architect
```

Frontend - Les variables sont déjà configurées dans le code.

## 🎮 Utilisation

### Lancer le Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:3001`

### Lancer le Frontend

```bash
cd frontend
npm run dev
```

L'application est accessible sur `http://localhost:5173`

### Créer un Compte

1. Accédez à l'application
2. Cliquez sur "Créer un compte"
3. Remplissez le formulaire d'inscription
4. Vous serez automatiquement connecté

### Configurer votre Clé API Gemini

1. Obtenez une clé API sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Dans l'application, allez dans les paramètres
3. Entrez votre clé API (stockée en local uniquement)

### Créer votre Premier Roman

#### Option 1: Mode Guidé
1. Cliquez sur "Nouveau Projet"
2. Choisissez "Création Guidée"
3. Répondez aux questions (titre, genre, personnages...)
4. L'IA génère automatiquement votre plan

#### Option 2: Import Rapide
1. Cliquez sur "Nouveau Projet"
2. Choisissez "Import Rapide"
3. Collez toutes vos notes dans la zone de texte
4. L'IA analyse et structure automatiquement

### Écrire un Chapitre

1. Dans votre projet, sélectionnez un chapitre
2. Cliquez sur "Générer"
3. L'IA écrit le chapitre en respectant le contexte
4. Analysez avec l'Auditor
5. Validez ou demandez des corrections

## 📖 Architecture

```
ai-novel-architect/
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants UI réutilisables
│   │   ├── contexts/      # Contexts React (Auth, API)
│   │   ├── pages/         # Pages (Login, Dashboard, etc.)
│   │   ├── config/        # Configuration Firebase
│   │   └── lib/           # Utilitaires
│   └── package.json
│
├── backend/               # API Node.js
│   ├── src/
│   │   ├── controllers/  # Contrôleurs API
│   │   ├── services/     # Services métier
│   │   │   └── agents/   # 4 Agents IA
│   │   ├── routes/       # Routes Express
│   │   ├── types/        # Types TypeScript
│   │   └── index.ts      # Point d'entrée
│   └── package.json
│
└── README.md
```

## 🔐 Sécurité

- **API Keys**: Les clés Gemini sont stockées côté client uniquement (localStorage)
- **Authentification**: Gérée par Firebase Authentication
- **Données**: Stockées dans Firestore avec règles de sécurité
- **CORS**: Configuré pour accepter uniquement les origines autorisées

## 📊 Roadmap

- [ ] Implémentation complète de PostgreSQL
- [ ] Context Caching avec Gemini Files API
- [ ] Export du roman (PDF, EPUB, DOCX)
- [ ] Collaboration multi-utilisateurs
- [ ] Versions et historique des chapitres
- [ ] Analyses statistiques (nombre de mots, progression)
- [ ] Thèmes personnalisés
- [ ] Mode hors-ligne

## 🤝 Contribution

Les contributions sont les bienvenues!

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 🙏 Remerciements

- Google Gemini pour l'API d'IA
- Firebase pour l'infrastructure
- La communauté open-source

## 📧 Contact

Pour toute question ou suggestion: [votre-email]

---

**Note pour le développeur**: La clé de voûte de ce projet est l'utilisation intelligente du Context Caching de Gemini 1.5. Ne pas renvoyer tout le texte brut à chaque requête dans le prompt. Upload le contexte comme un fichier, cache-le, et fais référence à ce fichier. Cela rendra l'app ultra-rapide et beaucoup moins coûteuse en tokens pour l'utilisateur.
