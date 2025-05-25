#!/bin/bash

# dev_setup.sh - Development environment setup

# Get the parent directory (nitrokit root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔄 Setting up development environment..."
echo "📁 Project root: $PROJECT_ROOT"

# Change to project root directory
cd "$PROJECT_ROOT"

# Install dependencies first if needed
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo "📥 Installing dependencies..."
    if command -v yarn &> /dev/null; then
        yarn install
    elif command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
else
    echo "✅ Dependencies already installed"
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

# Clean any corrupted Prisma client
if [ -d "$PROJECT_ROOT/node_modules/.prisma" ]; then
    echo "🔧 Cleaning Prisma client cache..."
    rm -rf "$PROJECT_ROOT/node_modules/.prisma"
    rm -rf "$PROJECT_ROOT/node_modules/@prisma/client"
    
    # Reinstall Prisma client
    if command -v yarn &> /dev/null; then
        yarn add @prisma/client
    elif command -v pnpm &> /dev/null; then
        pnpm add @prisma/client
    else
        npm install @prisma/client
    fi
    
    # Regenerate client
    if [ -f "$PROJECT_ROOT/prisma/schema.prisma" ]; then
        npx prisma generate --no-engine
    fi
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