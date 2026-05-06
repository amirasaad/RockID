const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const promiseAliases = new Map([
  ['promise/setimmediate/es6-extensions', 'promise/lib/es6-extensions.js'],
  ['promise/setimmediate/rejection-tracking', 'promise/lib/rejection-tracking.js'],
  ['promise/setimmediate/synchronous', 'promise/lib/synchronous.js'],
]);

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const alias = promiseAliases.get(moduleName);
  if (alias) {
    return {
      type: 'sourceFile',
      filePath: path.join(__dirname, 'node_modules', alias),
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
