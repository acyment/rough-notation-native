#!/bin/bash

echo "🚀 Running Rough Notation Native Example with Bun"
echo "================================================"

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install it first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Check if expo is installed
if ! command -v expo &> /dev/null; then
    echo "📦 Installing Expo CLI..."
    bun add -g @expo/cli
fi

# Build the main library
echo "🔨 Building the main library..."
bun run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build the main library"
    exit 1
fi

# Navigate to example directory
cd example

# Install dependencies
echo "📦 Installing example dependencies..."
bun install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Start the development server
echo "🎉 Starting the development server..."
echo "   - Press 'i' for iOS simulator"
echo "   - Press 'a' for Android emulator"  
echo "   - Press 'w' for web browser"
echo "   - Press 'q' to quit"
echo ""

bun run start