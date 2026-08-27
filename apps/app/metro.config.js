// Expo detecta o monorepo (npm workspaces) sozinho desde o SDK 52;
// aqui só entra o NativeWind.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/global.css' });
