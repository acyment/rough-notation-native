# Running the Example App with Bun

## Quick Start (Recommended)

1. **Run the automated script:**
   ```bash
   bun run example
   ```
   This will build the library, install dependencies, and start the Expo dev server.

## Manual Setup

If you prefer to run the steps manually:

1. **Install Expo CLI (if not already installed):**
   ```bash
   bun add -g @expo/cli
   ```

2. **Build the main library:**
   ```bash
   bun run build
   ```

3. **Install example dependencies:**
   ```bash
   bun run example:install
   ```

4. **Start the development server:**
   ```bash
   cd example
   bun run start
   ```

## Using the Development Server

Once the server starts, you'll see a QR code and options:

- **📱 Mobile Device:** Scan the QR code with Expo Go app
- **🍎 iOS Simulator:** Press `i` (requires Xcode)
- **🤖 Android Emulator:** Press `a` (requires Android Studio)
- **🌐 Web Browser:** Press `w`

## Alternative Commands

- **Build and start in one command:**
  ```bash
  bun run example:start
  ```

- **Just install example dependencies:**
  ```bash
  bun run example:install
  ```

## Troubleshooting

**If you get dependency errors:**
```bash
# Clear bun cache and reinstall
rm -rf node_modules bun.lockb
bun install
```

**If Expo CLI is missing:**
```bash
bun add -g @expo/cli
# or using npm
npm install -g @expo/cli
```

**If the library build fails:**
```bash
# Make sure TypeScript is available
bun add -D typescript
bun run build
```

## What You'll See

The example app demonstrates all annotation types:
- Underline
- Box
- Circle  
- Highlight
- Strike-through
- Crossed-off
- Bracket

You can toggle between different annotation types and see the hand-drawn animations in action!