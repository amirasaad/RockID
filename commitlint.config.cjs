const rockIdTypes = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
  'test-fail',
  'agile',
  'bump',
  'qa',
  'spike',
  'config',
];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\S+)\s([\w-]+)(?:\(([^)]+)\))?(!)?: (.+)$/,
      headerCorrespondence: ['emoji', 'type', 'scope', 'breaking', 'subject'],
    },
  },
  rules: {
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', rockIdTypes],
    'subject-empty': [2, 'never'],
  },
};
