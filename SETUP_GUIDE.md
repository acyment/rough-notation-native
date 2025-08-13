# Setup Guide for Rough Notation Native Example

Due to React Native dependency conflicts, here's the recommended setup process:

## Step 1: Clean Setup

```bash
# Clean any existing installations
rm -rf node_modules package-lock.json bun.lockb
rm -rf example/node_modules example/package-lock.json example/bun.lockb
```

## Step 2: Install Main Library Dependencies

```bash
# Install with legacy peer deps to avoid conflicts
npm install --legacy-peer-deps
```

## Step 3: Build the Library

```bash
bun run build
```

## Step 4: Setup Example App

```bash
cd example
# Use npm for better compatibility with Expo
npm install --legacy-peer-deps
```

## Step 5: Run the Example

```bash
# From the example directory
npm run start

# Or from root directory  
cd .. && npm run example:start
```

## Alternative: Use the Setup Script

```bash
# Run the automated setup script
./setup-example.sh
```

## Troubleshooting

**If you still get peer dependency errors:**
1. Make sure you have `.npmrc` with `legacy-peer-deps=true`
2. Delete all `node_modules` and lock files
3. Use `npm` instead of `bun` for the initial setup
4. After setup, you can use `bun` for running scripts

**If Expo gives version errors:**
```bash
# Update to latest Expo CLI
npm install -g @expo/cli@latest
```

**For web development specifically:**
The example includes `react-native-web` and `react-dom` dependencies for running in the browser via Expo's web support.

## What's Included

The example demonstrates:
- All annotation types (underline, box, circle, highlight, strike-through, crossed-off, bracket)
- Interactive type switching
- Animation controls
- Color customization
- Real-time preview