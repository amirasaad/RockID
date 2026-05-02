const expoAppVersion = {
  filename: 'app.json',
  updater: require('./scripts/expo-version-updater.cjs'),
};

module.exports = {
  preset: require.resolve('conventional-changelog-gitmoji-config'),
  tagPrefix: 'v',
  releaseCommitMessageFormat: '🔖 chore(release): v{{currentTag}}',
  packageFiles: [
    { filename: 'package.json', type: 'json' },
    expoAppVersion,
  ],
  bumpFiles: [
    { filename: 'package.json', type: 'json' },
    expoAppVersion,
  ],
};
