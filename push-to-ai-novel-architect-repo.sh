#!/bin/bash

# Script to push AI Novel Architect to dedicated GitHub repository
# Repository: https://github.com/ACADEE/AI-Novel-Architect

set -e  # Exit on error

echo "=================================================="
echo "AI Novel Architect - GitHub Push Script"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SOURCE_DIR="/home/user/add-in-Outlook-AI-prompt-per-category/ai-novel-architect"
TEMP_DIR="/tmp/AI-Novel-Architect-Clean"
GITHUB_REPO="https://github.com/ACADEE/AI-Novel-Architect.git"

echo -e "${BLUE}Step 1: Creating clean copy of AI Novel Architect...${NC}"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Copy files excluding node_modules
echo "Copying source files..."
rsync -av --exclude='node_modules' --exclude='.DS_Store' --exclude='*.log' "$SOURCE_DIR/" ./

echo -e "${GREEN}✓ Files copied${NC}"
echo ""

echo -e "${BLUE}Step 2: Initializing git repository...${NC}"
git init
git config user.email "ai-novel-architect@example.com"
git config user.name "AI Novel Architect"
git config commit.gpgsign false

# Create .gitignore
cat > .gitignore << 'GITIGNORE_EOF'
# Dependencies
node_modules/
*/node_modules/
package-lock.json
*/package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment variables
.env
.env.local
.env.production
.env.*.local
backend/.env
frontend/.env

# Build outputs
dist/
build/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.cache/

# Editor directories and files
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
.cache

# Testing
coverage/
.nyc_output/

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
database-rules.json
firestore.rules
firestore.indexes.json

# Misc
.temp/
.tmp/
GITIGNORE_EOF

echo -e "${GREEN}✓ Repository initialized${NC}"
echo ""

echo -e "${BLUE}Step 3: Creating initial commit...${NC}"
git add .
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

Features:
✅ Scene-Level Granularity (Beat Sheet Mode)
✅ Multi-language support (6 languages)
✅ Brain Dump extraction with scene detection
✅ Subchapter system (3-5 per chapter)
✅ Writing settings (wordCount, style, detailLevel, paragraphLength)
✅ Chapter & scene manipulation (add, insert, delete, reorder)
✅ WORD export with professional formatting
✅ Firebase authentication & Firestore database
✅ Context Caching with Gemini 1.5 Pro
✅ Living Bible (character state management)
✅ Real-time API connection status

Version: 2.1.0
Date: 2026-01-09"

echo -e "${GREEN}✓ Initial commit created${NC}"
echo ""

echo -e "${BLUE}Step 4: Adding GitHub remote...${NC}"
git remote add origin "$GITHUB_REPO"
echo -e "${GREEN}✓ Remote added${NC}"
echo ""

echo -e "${BLUE}Step 5: Pushing to GitHub...${NC}"
echo -e "${YELLOW}You may be prompted for GitHub credentials:${NC}"
echo "  - Username: Your GitHub username"
echo "  - Password: Your Personal Access Token (NOT your GitHub password)"
echo ""
echo "If you don't have a token, create one at:"
echo "  https://github.com/settings/tokens"
echo "  (Select scope: repo)"
echo ""

# Try to push
if git push -u origin master; then
    echo ""
    echo -e "${GREEN}✓ Successfully pushed to GitHub!${NC}"
    echo ""
    echo "=================================================="
    echo -e "${GREEN}SUCCESS!${NC}"
    echo "=================================================="
    echo ""
    echo "Your code is now available at:"
    echo "  https://github.com/ACADEE/AI-Novel-Architect"
    echo ""
    echo "Next steps:"
    echo "  1. Visit the repository on GitHub"
    echo "  2. Review the README.md"
    echo "  3. Set up repository settings (description, topics, etc.)"
    echo "  4. Configure GitHub Pages if desired"
    echo ""
else
    echo ""
    echo -e "${YELLOW}Push failed. This could be due to:${NC}"
    echo "  1. Repository doesn't exist on GitHub yet"
    echo "     → Create it at: https://github.com/new"
    echo "  2. Authentication failed"
    echo "     → Check your credentials"
    echo "  3. Network issues"
    echo "     → Check your internet connection"
    echo ""
    echo "The repository is ready at: $TEMP_DIR"
    echo "You can try pushing manually:"
    echo "  cd $TEMP_DIR"
    echo "  git push -u origin master"
    echo ""
    exit 1
fi

# Cleanup prompt
echo ""
read -p "Do you want to remove the temporary directory? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$TEMP_DIR"
    echo -e "${GREEN}✓ Temporary directory removed${NC}"
else
    echo "Temporary directory kept at: $TEMP_DIR"
fi

echo ""
echo "Done!"
