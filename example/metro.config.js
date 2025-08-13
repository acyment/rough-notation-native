const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Watch and resolve our local package
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Map rough-notation-native to the parent lib folder
config.resolver.alias = {
  'rough-notation-native': path.resolve(monorepoRoot, 'lib'),
};

// Blacklist react-native-reanimated to avoid loading it
config.resolver.blacklistRE = /.*react-native-reanimated.*/;

module.exports = config;