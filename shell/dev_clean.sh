#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Nitrokit Clean Script${NC}"
echo -e "${BLUE}=========================${NC}"
echo

# Function to check if file/directory exists and delete it
clean_item() {
    local item=$1
    if [ -e "$item" ]; then
        echo -e "${YELLOW}🗑️  Removing: $item${NC}"
        rm -rf "$item"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Successfully removed: $item${NC}"
        else
            echo -e "${RED}❌ Failed to remove: $item${NC}"
        fi
    else
        echo -e "${BLUE}ℹ️  Not found: $item${NC}"
    fi
}

# List of items to clean
items_to_clean=(
    ".next"
    ".vercel"
    "generated"
    "node_modules"
    "storybook-static"
    "tsconfig.tsbuildinfo"
    "yarn.lock"
)

echo -e "${YELLOW}🎯 Items to clean:${NC}"
for item in "${items_to_clean[@]}"; do
    echo "  - $item"
done
echo

# Ask for confirmation
read -p "Are you sure you want to delete these items? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚫 Operation cancelled.${NC}"
    exit 0
fi

echo -e "${YELLOW}🚀 Starting cleanup...${NC}"
echo

# Clean each item
for item in "${items_to_clean[@]}"; do
    clean_item "$item"
    echo
done

echo -e "${GREEN}🎉 Cleanup completed!${NC}"
echo -e "${BLUE}💡 Next steps:${NC}"
echo "   1. Run: yarn install"
echo "   2. Run: yarn build"
echo