# Rough Notation Native Example

This is an example Expo app demonstrating the rough-notation-native library.

## Setup with Bun

1. **Install Expo CLI globally:**
   ```bash
   bun add -g @expo/cli
   ```

2. **Navigate to the example directory:**
   ```bash
   cd example
   ```

3. **Install dependencies:**
   ```bash
   bun install
   ```

4. **Build the main library first:**
   ```bash
   cd ..
   bun run build
   cd example
   ```

5. **Start the development server:**
   ```bash
   bun run start
   ```

## Running on Different Platforms

- **iOS Simulator:** `bun run ios`
- **Android Emulator:** `bun run android`  
- **Web Browser:** `bun run web`

## Notes

- Make sure you have the iOS Simulator (Xcode) or Android Emulator set up
- For web development, the app will open in your default browser
- The parent library must be built before running the example