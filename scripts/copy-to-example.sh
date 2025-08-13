#!/bin/bash

echo "📦 Copying built library to example node_modules..."

# Make sure the library is built
bun run build

# Copy the built library to example node_modules
rm -rf example/node_modules/rough-notation-native
mkdir -p example/node_modules/rough-notation-native
cp package.json example/node_modules/rough-notation-native/
cp -r lib/* example/node_modules/rough-notation-native/

# Create a simple index.js in the node_modules version
cat > example/node_modules/rough-notation-native/index.js << 'EOF'
module.exports = require('./index.js');
EOF

echo "✅ Library copied to example/node_modules/rough-notation-native"