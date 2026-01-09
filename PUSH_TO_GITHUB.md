# Push AI Novel Architect to GitHub

This guide will help you push the AI Novel Architect code to the dedicated GitHub repository at https://github.com/ACADEE/AI-Novel-Architect

## Prerequisites

1. Make sure you have a GitHub Personal Access Token or SSH key configured
2. Ensure the repository https://github.com/ACADEE/AI-Novel-Architect exists on GitHub
   - If it doesn't exist, create it on GitHub first (empty repository)

## Option 1: Automatic Script (Recommended)

Run the provided script:

```bash
cd /home/user/add-in-Outlook-AI-prompt-per-category
bash push-to-ai-novel-architect-repo.sh
```

The script will:
1. Create a clean copy of the ai-novel-architect directory
2. Initialize a new git repository
3. Add a proper .gitignore
4. Create an initial commit with all the code
5. Push to GitHub (you'll be prompted for authentication)

## Option 2: Manual Steps

### Step 1: Create Clean Repository

```bash
# Navigate to your workspace
cd /home/user/add-in-Outlook-AI-prompt-per-category

# Create a new directory for the standalone repository
mkdir -p ../AI-Novel-Architect-Standalone
cd ../AI-Novel-Architect-Standalone

# Copy all AI Novel Architect files (excluding node_modules)
rsync -av --exclude='node_modules' --exclude='.DS_Store' \
  /home/user/add-in-Outlook-AI-prompt-per-category/ai-novel-architect/ ./
```

### Step 2: Initialize Git

```bash
# Initialize git repository
git init

# Configure git (use your own name and email)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Create proper .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
*.log
.DS_Store

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db
EOF
```

### Step 3: Create Initial Commit

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete AI Novel Architect application

Full-stack SaaS platform for AI-assisted novel writing with:
- Scene-level granularity (Beat Sheet Mode)
- Multi-language support (FR, EN, ES, DE, IT, PT)
- Brain Dump import with intelligent extraction
- 4 specialized AI agents (Architect, Beatsheet, Ghostwriter, Auditor)
- Firebase authentication and Firestore database
- Google Gemini 1.5 Pro integration with Context Caching
- WORD export functionality
- Project management with progress tracking
- Professional marketing homepage

Backend: Node.js + TypeScript + Express
Frontend: React + Vite + TypeScript + TailwindCSS
AI: Google Gemini 1.5 Pro (2M context window)

Version: 2.1.0"
```

### Step 4: Push to GitHub

#### Option A: Using HTTPS (with Personal Access Token)

```bash
# Add remote repository
git remote add origin https://github.com/ACADEE/AI-Novel-Architect.git

# Push to GitHub (you'll be prompted for username and token)
git push -u origin master
```

When prompted:
- **Username**: Your GitHub username
- **Password**: Your Personal Access Token (NOT your GitHub password)

#### Option B: Using SSH (if you have SSH keys configured)

```bash
# Add remote repository
git remote add origin git@github.com:ACADEE/AI-Novel-Architect.git

# Push to GitHub
git push -u origin master
```

### Step 5: Verify on GitHub

Visit https://github.com/ACADEE/AI-Novel-Architect to verify all files were pushed successfully.

## What's Included

The repository contains:

```
AI-Novel-Architect/
├── README.md                       # Project overview and setup instructions
├── FEATURES_V2.md                  # Detailed feature documentation
├── IMPLEMENTATION_STATUS.md        # Development status and roadmap
├── SCENE_WORKFLOW.md              # Complete scene-level workflow guide
├── package.json                    # Root package configuration
├── backend/                        # Node.js backend
│   ├── src/
│   │   ├── server.ts              # Express server
│   │   ├── types/index.ts         # TypeScript interfaces
│   │   ├── config/firebase.admin.ts
│   │   ├── controllers/           # API endpoints
│   │   │   └── project.controller.ts
│   │   └── services/
│   │       ├── gemini.service.ts
│   │       └── agents/
│   │           ├── architect.agent.ts    # Structure generator
│   │           ├── beatsheet.agent.ts    # Scene list generator (NEW)
│   │           ├── ghostwriter.agent.ts  # Content writer
│   │           └── auditor.agent.ts      # Coherence checker
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── frontend/                       # React frontend
    ├── src/
    │   ├── App.tsx                # Main application
    │   ├── main.tsx
    │   ├── config/firebase.ts     # Firebase client config
    │   ├── contexts/
    │   │   └── AuthContext.tsx    # Authentication provider
    │   ├── pages/
    │   │   ├── Homepage.tsx       # Marketing landing page
    │   │   ├── Login.tsx
    │   │   ├── Signup.tsx
    │   │   ├── Dashboard.tsx      # Project management
    │   │   └── Onboarding.tsx     # Wizard/Brain Dump
    │   ├── components/
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── PublicRoute.tsx
    │   │   └── Footer.tsx
    │   └── services/
    │       ├── project.service.ts  # Firestore CRUD
    │       └── export.service.ts   # WORD export
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── index.html
```

## Recent Commits

The code includes all recent development:

1. ✅ **Scene-Level Granularity System** (Latest)
   - Scene interface with beat and instructions
   - BeatsheetAgent for scene generation
   - Enhanced Architect for Brain Dump scene extraction
   - Enhanced Ghostwriter for scene writing
   - Complete documentation in SCENE_WORKFLOW.md

2. ✅ **Multi-Language & Subchapters**
   - Language selection (FR, EN, ES, DE, IT, PT)
   - Subchapter system (3-5 per chapter)
   - Enhanced Brain Dump extraction
   - Writing settings (wordCount, style, detailLevel)

3. ✅ **Project Management & Export**
   - Multiple projects per user (Firestore)
   - CRUD operations
   - WORD export with docx library
   - Progress tracking and status badges

4. ✅ **Professional Homepage**
   - Marketing landing page
   - TypeAnimation effect
   - Dark theme with gradient backgrounds
   - Feature showcase and social proof

5. ✅ **Initial Application**
   - Complete full-stack architecture
   - Firebase authentication
   - 4 AI agents
   - Two onboarding modes

## Troubleshooting

### Error: Repository not found

Make sure the repository exists on GitHub:
1. Go to https://github.com/ACADEE
2. Click "New repository"
3. Name it "AI-Novel-Architect"
4. Create repository (do NOT initialize with README)
5. Try pushing again

### Error: Authentication failed

**For HTTPS:**
- Use a Personal Access Token, not your password
- Generate one at: https://github.com/settings/tokens
- Select scopes: `repo` (full control of private repositories)

**For SSH:**
- Make sure SSH keys are configured: https://github.com/settings/keys
- Test connection: `ssh -T git@github.com`

### Error: Updates were rejected

If you get "failed to push some refs":
```bash
# Force push (only if it's a new empty repository)
git push -u origin master --force
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/ACADEE/AI-Novel-Architect/issues
- Documentation: See README.md, FEATURES_V2.md, IMPLEMENTATION_STATUS.md
- Scene Workflow: See SCENE_WORKFLOW.md

---

**Last Updated**: 2026-01-09
**Version**: 2.1.0
