#!/bin/bash
# ============================================
# AI-POWERED MIND - Full Project Setup Script
# ============================================
# Run this script to create the entire project
# Usage: chmod +x setup.sh && ./setup.sh
# ============================================

set -e

echo "Creating AI-Powered Mind project..."

# Create directory structure
mkdir -p ai-powered-mind/backend
mkdir -p ai-powered-mind/frontend/src/pages
mkdir -p ai-powered-mind/frontend/src/components
mkdir -p ai-powered-mind/frontend/src/context
mkdir -p ai-powered-mind/frontend/public

echo "Directory structure created."
echo ""
echo "============================================"
echo "IMPORTANT: The project files are too large"
echo "to include in a single script (seed_data.py"
echo "alone is 2000+ lines with 204 mental models)."
echo ""
echo "Please copy each file from the chat messages"
echo "into the corresponding paths listed below."
echo "============================================"
echo ""
echo "FILES TO COPY:"
echo ""
echo "BACKEND (2 files):"
echo "  ai-powered-mind/backend/server.py"
echo "  ai-powered-mind/backend/seed_data.py"
echo ""
echo "FRONTEND CONFIG (4 files):"
echo "  ai-powered-mind/frontend/package.json"
echo "  ai-powered-mind/frontend/tailwind.config.js"
echo "  ai-powered-mind/frontend/postcss.config.js"
echo "  ai-powered-mind/frontend/craco.config.js"
echo ""
echo "FRONTEND SRC (15 files):"
echo "  ai-powered-mind/frontend/src/index.js"
echo "  ai-powered-mind/frontend/src/index.css"
echo "  ai-powered-mind/frontend/src/App.js"
echo "  ai-powered-mind/frontend/src/App.css"
echo "  ai-powered-mind/frontend/src/context/ProgressContext.js"
echo "  ai-powered-mind/frontend/src/components/Navigation.js"
echo "  ai-powered-mind/frontend/src/components/CopyablePrompt.js"
echo "  ai-powered-mind/frontend/src/pages/LandingPage.js"
echo "  ai-powered-mind/frontend/src/pages/ExplorePage.js"
echo "  ai-powered-mind/frontend/src/pages/DomainPage.js"
echo "  ai-powered-mind/frontend/src/pages/ModelDetailPage.js"
echo "  ai-powered-mind/frontend/src/pages/SearchPage.js"
echo "  ai-powered-mind/frontend/src/pages/JournalPage.js"
echo "  ai-powered-mind/frontend/src/pages/MindMapPage.js"
echo "  ai-powered-mind/frontend/src/pages/ConclusionPage.js"
echo "  ai-powered-mind/frontend/src/pages/ChallengePage.js"
echo "  ai-powered-mind/frontend/src/pages/BookmarksPage.js"
echo ""
echo "Done! After copying files, run:"
echo "  cd ai-powered-mind/backend && pip install -r requirements.txt"
echo "  cd ai-powered-mind/frontend && yarn install && yarn start"
