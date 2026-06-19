#!/usr/bin/env bash
# Hermes Migration Script: Docker → VPS Host (Root)
# Migrates all data (memory, skills, sessions, config) without losing anything
# Run this script on your VPS host (not inside Docker container)

set -euo pipefail

BACKUP_DIR="$HOME/hermes-backup-$(date +%Y%m%d-%H%M%S)"
DOCKER_CONTAINER="hermes"  # Change this if your Hermes container has a different name

echo "========================================="
echo "🚀 Hermes Migration: Docker → VPS Host"
echo "========================================="
echo ""
echo "⚠️  This script will:"
echo "   1. Backup all Hermes data from Docker container"
echo "   2. Install Hermes on VPS host (outside Docker)"
echo "   3. Restore all data to new Hermes installation"
echo ""
read -p "Continue? (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "❌ Migration cancelled."
  exit 0
fi

# ============================================
# STEP 1: Backup from Docker Container
# ============================================
echo ""
echo "📦 Step 1: Backing up data from Docker container..."
mkdir -p "$BACKUP_DIR"

# Check if container exists and is running
if ! docker ps --format '{{.Names}}' | grep -q "^${DOCKER_CONTAINER}$"; then
  echo "⚠️  Container '$DOCKER_CONTAINER' not found or not running."
  echo "Available containers:"
  docker ps --format '{{.Names}}'
  echo ""
  read -p "Enter your Hermes container name: " DOCKER_CONTAINER
fi

# Backup Hermes data directories
echo "  → Copying ~/.hermes/ from container..."
docker cp "${DOCKER_CONTAINER}:/root/.hermes" "$BACKUP_DIR/" 2>/dev/null || {
  echo "⚠️  Could not find /root/.hermes in container. Trying /home/ubuntu/.hermes..."
  docker cp "${DOCKER_CONTAINER}:/home/ubuntu/.hermes" "$BACKUP_DIR/" 2>/dev/null || {
    echo "❌ Could not find Hermes data in container. Please check container path manually."
    exit 1
  }
}

echo "✅ Backup completed: $BACKUP_DIR"
echo ""

# ============================================
# STEP 2: Install Hermes on VPS Host
# ============================================
echo "🔧 Step 2: Installing Hermes on VPS host..."

# Check Python version
if ! command -v python3 &>/dev/null; then
  echo "❌ Python 3 not found. Installing..."
  sudo apt update
  sudo apt install -y python3 python3-pip python3-venv git curl
fi

PYTHON_VERSION=$(python3 --version | awk '{print $2}' | cut -d. -f1,2)
echo "  → Python version: $PYTHON_VERSION"

# Clone Hermes repository
HERMES_DIR="$HOME/hermes-agent"
if [ -d "$HERMES_DIR" ]; then
  echo "  → Hermes directory already exists at $HERMES_DIR"
  read -p "  Remove and reinstall? (y/N): " reinstall
  if [[ "$reinstall" =~ ^[Yy]$ ]]; then
    rm -rf "$HERMES_DIR"
  else
    echo "  → Skipping Hermes installation. Using existing directory."
  fi
fi

if [ ! -d "$HERMES_DIR" ]; then
  echo "  → Cloning Hermes repository..."
  git clone https://github.com/NousResearch/hermes-agent.git "$HERMES_DIR"
  
  echo "  → Installing Hermes..."
  cd "$HERMES_DIR"
  pip3 install -e . --user
fi

# Add Hermes to PATH if not already there
if ! grep -q 'export PATH="$HOME/.local/bin:$PATH"' ~/.bashrc; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
  export PATH="$HOME/.local/bin:$PATH"
fi

echo "✅ Hermes installed at: $HERMES_DIR"
echo ""

# ============================================
# STEP 3: Restore Data to New Hermes
# ============================================
echo "📂 Step 3: Restoring data to new Hermes installation..."

TARGET_HERMES_DIR="$HOME/.hermes"

# Create target directory if it doesn't exist
mkdir -p "$TARGET_HERMES_DIR"

# Restore all subdirectories
echo "  → Restoring memories..."
cp -r "$BACKUP_DIR/.hermes/memories" "$TARGET_HERMES_DIR/" 2>/dev/null || echo "  ⚠️  No memories found"

echo "  → Restoring skills..."
cp -r "$BACKUP_DIR/.hermes/skills" "$TARGET_HERMES_DIR/" 2>/dev/null || echo "  ⚠️  No skills found"

echo "  → Restoring session database..."
cp "$BACKUP_DIR/.hermes/sessions.db" "$TARGET_HERMES_DIR/" 2>/dev/null || echo "  ⚠️  No session database found"

echo "  → Restoring config..."
cp "$BACKUP_DIR/.hermes/config.yaml" "$TARGET_HERMES_DIR/" 2>/dev/null || echo "  ⚠️  No config.yaml found"
cp "$BACKUP_DIR/.hermes/.env" "$TARGET_HERMES_DIR/" 2>/dev/null || echo "  ⚠️  No .env found"

echo "  → Restoring cron jobs..."
cp -r "$BACKUP_DIR/.hermes/cron" "$TARGET_HERMES_DIR/" 2>/dev/null || echo "  ⚠️  No cron jobs found"

echo "  → Restoring plugins..."
cp -r "$BACKUP_DIR/.hermes/plugins" "$TARGET_HERMES_DIR/" 2>/dev/null || echo "  ⚠️  No plugins found"

echo "✅ Data restored to: $TARGET_HERMES_DIR"
echo ""

# ============================================
# STEP 4: Verify Installation
# ============================================
echo "🩺 Step 4: Verifying installation..."

if command -v hermes &>/dev/null; then
  HERMES_VERSION=$(hermes --version 2>/dev/null || echo "unknown")
  echo "✅ Hermes CLI found: $HERMES_VERSION"
else
  echo "⚠️  Hermes CLI not found in PATH. You may need to restart your shell:"
  echo "    source ~/.bashrc"
fi

# Check restored data
echo ""
echo "📊 Restored Data Summary:"
echo "  - Memories: $(find "$TARGET_HERMES_DIR/memories" -type f 2>/dev/null | wc -l) files"
echo "  - Skills: $(find "$TARGET_HERMES_DIR/skills" -type d -name "*.md" 2>/dev/null | wc -l) skills"
echo "  - Session DB: $([ -f "$TARGET_HERMES_DIR/sessions.db" ] && echo "✅ Found" || echo "❌ Not found")"
echo "  - Config: $([ -f "$TARGET_HERMES_DIR/config.yaml" ] && echo "✅ Found" || echo "❌ Not found")"
echo ""

# ============================================
# STEP 5: Final Instructions
# ============================================
echo "========================================="
echo "✅ Migration Complete!"
echo "========================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Restart your shell to load Hermes CLI:"
echo "   source ~/.bashrc"
echo ""
echo "2. Verify API keys in config:"
echo "   cat ~/.hermes/.env"
echo "   # Make sure your ANTHROPIC_API_KEY or OPENROUTER_API_KEY is set"
echo ""
echo "3. Start Hermes:"
echo "   hermes"
echo ""
echo "4. (Optional) Stop old Docker Hermes container:"
echo "   docker stop $DOCKER_CONTAINER"
echo "   docker rm $DOCKER_CONTAINER"
echo ""
echo "🗂️  Backup saved at: $BACKUP_DIR"
echo "   (Keep this until you confirm new Hermes works correctly)"
echo ""
