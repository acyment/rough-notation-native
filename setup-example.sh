#!/bin/bash

echo "🚀 Setting up Rough Notation Native Example"
echo "============================================"

# Clean any existing installs
echo "🧹 Cleaning up..."
rm -rf node_modules package-lock.json bun.lockb
rm -rf example/node_modules example/package-lock.json example/bun.lockb

# Install main library dependencies with legacy peer deps
echo "📦 Installing main library dependencies..."
npm install --legacy-peer-deps

# Build the library
echo "🔨 Building the library..."
bun run build

# Navigate to example and install with bun
echo "📦 Installing example dependencies..."
cd example
bun install

echo "✅ Setup complete! Now you can run:"
echo "   cd example"
echo "   bun run start"
echo ""
echo "Or from the root directory:"
echo "   bun run example:start"