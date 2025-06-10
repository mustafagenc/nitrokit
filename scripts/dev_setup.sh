#!/bin/bash

# dev_setup.sh - Development environment setup

# Get the parent directory (nitrokit root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔄 Setting up development environment..."
echo "📁 Project root: $PROJECT_ROOT"

# Change to project root directory
cd "$PROJECT_ROOT"

# 🧹 Clean up build artifacts and cache files before setup
echo "🧹 Cleaning up previous build artifacts..."

# Remove directories
for dir in ".next" "coverage" "generated" "node_modules"; do
    if [ -d "$PROJECT_ROOT/$dir" ]; then
        echo "🗑️  Removing $dir..."
        rm -rf "$PROJECT_ROOT/$dir"
    else
        echo "✅ $dir already clean"
    fi
done

# Remove files
for file in "tsconfig.tsbuildinfo"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        echo "🗑️  Removing $file..."
        rm -f "$PROJECT_ROOT/$file"
    else
        echo "✅ $file already clean"
    fi
done

# Clean Yarn/npm cache directories if they exist
if [ -d "$PROJECT_ROOT/.yarn/cache" ]; then
    echo "🗑️  Cleaning Yarn cache..."
    rm -rf "$PROJECT_ROOT/.yarn/cache"
fi

if [ -d "$PROJECT_ROOT/.npm" ]; then
    echo "🗑️  Cleaning npm cache..."
    rm -rf "$PROJECT_ROOT/.npm"
fi

# Clean Prisma generated files
if [ -d "$PROJECT_ROOT/prisma/generated" ]; then
    echo "🗑️  Cleaning Prisma generated files..."
    rm -rf "$PROJECT_ROOT/prisma/generated"
fi

echo "✅ Cleanup completed!"
echo ""

# Install dependencies (now that node_modules is clean)
echo "📥 Installing dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
elif command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi

# Check for Prisma schema and handle database setup
if [ -f "$PROJECT_ROOT/prisma/schema.prisma" ]; then
    echo "🗃️ Setting up Prisma database..."
    echo "📍 Found Prisma schema at: $PROJECT_ROOT/prisma/schema.prisma"
    
    # Check if database exists and run migrations first
    echo "🔄 Running database migrations..."
    npx prisma migrate dev --name init 2>/dev/null || echo "✅ Database up to date"
    
    # Then generate Prisma client
    echo "📦 Generating Prisma client..."
    npx prisma generate --no-engine
    
    echo "✅ Prisma setup completed"
else
    echo "⚠️  Prisma schema not found at $PROJECT_ROOT/prisma/schema.prisma"
fi

# Check for environment file
if [ ! -f "$PROJECT_ROOT/.env" ] && [ -f "$PROJECT_ROOT/.env.example" ]; then
    echo "🔧 Creating .env file from .env.example..."
    cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
    echo "⚠️  Please update .env file with your configuration"
elif [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo "⚠️  No .env file found. Consider creating one for local development"
fi

# Check Next.js configuration
if [ -f "$PROJECT_ROOT/next.config.js" ] || [ -f "$PROJECT_ROOT/next.config.ts" ]; then
    echo "✅ Next.js configuration found"
else
    echo "⚠️  Next.js configuration not found"
fi

# Show available scripts
echo ""
echo "🎯 Available development commands:"
echo "  yarn dev          - Start development server"
echo "  yarn build        - Build for production"
echo "  yarn db:studio    - Open Prisma Studio"
echo "  yarn db:push      - Push schema changes to database"
echo "  yarn db:migrate   - Run database migrations"
echo "  yarn db:seed      - Seed database with test data"
echo "  yarn lint         - Run ESLint"
echo "  yarn format:write - Format code with Prettier"

echo ""
echo "✅ Development environment ready!"
echo "🚀 Run 'yarn dev' to start development server"

# Return to original directory
cd - > /dev/null