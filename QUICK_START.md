# Quick Start Guide - Fixed Metro Resolution

The Metro bundler has trouble resolving local packages. Here's the working solution:

## Step 1: Build and Setup

```bash
# Build the library
bun run build

# Navigate to example directory
cd example

# Install dependencies
npm install --legacy-peer-deps
```

## Step 2: Start Development Server

```bash
# From the example directory
npm run start
```

## Step 3: Access the App

Once the server starts:
- Press `w` for **web browser** (recommended for testing)
- Press `i` for iOS simulator  
- Press `a` for Android emulator

## If You Still Get Import Errors

Run this command to copy the built library directly:

```bash
# From root directory
./scripts/copy-to-example.sh
cd example
npm run start
```

## Web Browser Preview

The web version should load at `http://localhost:8081` and show:
- Interactive annotation type selector
- Live preview of rough-notation effects
- All annotation types working: underline, box, circle, highlight, etc.

## Alternative: Simplified Test

If the full example doesn't work, you can create a minimal test:

```tsx
// Create example/SimpleTest.tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function SimpleTest() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Simple Test - Library should work!</Text>
    </View>
  );
}
```

Then modify `App.tsx` to import and render `SimpleTest` instead.

The Metro configuration and package setup should now work correctly!