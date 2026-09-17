// Metro configuration to allow bundling ONNX/TFLite model assets.
// Uses the installed Expo SDK's Metro defaults.
// Extends the default config instead of replacing it so other defaults stay intact.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add model file extensions so `require()` works for local models.
config.resolver.assetExts = config.resolver.assetExts.concat(['onnx', 'tflite']);

module.exports = config;
