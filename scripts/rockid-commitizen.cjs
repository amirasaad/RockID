const ROCKID_COMMIT_TYPES = [
  { type: 'feat', emoji: '✨', description: 'User-facing feature implementation when intentionally release-notable' },
  { type: 'fix', emoji: '🐛', description: 'Bug fix' },
  { type: 'docs', emoji: '📝', description: 'Documentation only changes' },
  { type: 'style', emoji: '🎨', description: 'Formatting or styling changes that do not affect behavior' },
  { type: 'refactor', emoji: '📦', description: 'Code change that neither fixes a bug nor adds a feature' },
  { type: 'perf', emoji: '🚀', description: 'Performance improvement' },
  { type: 'test', emoji: '🧪', description: 'Passing or maintenance test changes' },
  { type: 'build', emoji: '👷', description: 'Build system or dependency changes' },
  { type: 'ci', emoji: '♻️', description: 'Continuous integration workflow changes' },
  { type: 'chore', emoji: '✏️', description: 'Repository maintenance' },
  { type: 'revert', emoji: '⏪', description: 'Revert a previous commit' },
  { type: 'test-fail', emoji: '🧪', description: 'Red ATDD/TDD commit that intentionally adds a failing test' },
  { type: 'agile', emoji: '📋', description: 'Sprint docs, Kanban, DoD evidence, or retro notes' },
  { type: 'bump', emoji: '🔖', description: 'Version, changelog, or release bump commit' },
  { type: 'qa', emoji: '✅', description: 'Manual QA evidence, smoke validation, or device-test notes' },
  { type: 'spike', emoji: '🧐', description: 'Time-boxed exploration with no product behavior change' },
  { type: 'config', emoji: '🔧', description: 'Tooling/config changes not best described as build or ci' },
];

function prompter(cz, commit) {
  cz.prompt([
    {
      type: 'list',
      name: 'changeType',
      message: 'Select the type of change that you are committing:',
      choices: ROCKID_COMMIT_TYPES.map((entry) => ({
        name: `${entry.emoji} ${entry.type}: ${entry.description}`,
        value: entry,
      })),
    },
    {
      type: 'input',
      name: 'scope',
      message: 'Scope, such as results, s22, or release (optional):',
    },
    {
      type: 'input',
      name: 'subject',
      message: 'Short imperative subject:',
      validate: (value) => value.trim().length > 0 || 'subject is required',
      filter: (value) => stripTrailingPeriod(lowercaseFirst(value.trim())),
    },
    {
      type: 'confirm',
      name: 'hasBody',
      message: 'Add a longer body?',
      default: false,
    },
    {
      type: 'editor',
      name: 'body',
      message: 'Commit body:',
      when: (answers) => answers.hasBody,
    },
  ]).then((answers) => {
    const { emoji, type } = answers.changeType;
    const scope = answers.scope.trim() ? `(${answers.scope.trim()})` : '';
    const header = `${emoji} ${type}${scope}: ${answers.subject}`;
    const body = answers.body?.trim();

    commit(body ? `${header}\n\n${body}` : header);
  });
}

function lowercaseFirst(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function stripTrailingPeriod(value) {
  return value.replace(/\.+$/u, '');
}

module.exports = {
  ROCKID_COMMIT_TYPES,
  prompter,
};
