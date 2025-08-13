const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Include the parent directory so Metro can find the library
config.watchFolders = [path.resolve(__dirname, '..')];

// Configure Metro to resolve packages from both locations
config.resolver.nodeModulesPath = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '..', 'node_modules'),
];

// Ensure React packages are resolved from example's node_modules
config.resolver.alias = {
  'react': path.resolve(__dirname, 'node_modules/react'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  'react-native-svg': path.resolve(__dirname, 'node_modules/react-native-svg'),
};

// Fix MIME type for web bundles
config.server = config.server || {};
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    if (req.url && req.url.includes('.bundle')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    return middleware(req, res, next);
  };
};

module.exports = config;