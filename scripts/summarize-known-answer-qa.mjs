import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DEFAULT_LOG_PATH = 'docs/beta/Known-Answer-Attempt-Log.md';

function cleanCell(cell) {
  return cell.trim().replace(/^`|`$/g, '').trim();
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function isAffirmative(value) {
  return normalize(value) === 'yes';
}

function isNonRockAttempt(attempt) {
  return normalize(attempt.sampleGroup).includes('non-rock') || normalize(attempt.expectedAnswer).startsWith('non-rock');
}

function isKnownRockAttempt(attempt) {
  return attempt.completed && !isNonRockAttempt(attempt);
}

function isHighConfidence(attempt) {
  return normalize(attempt.confidenceBand) === 'high';
}

function isCompletedAttempt(attempt) {
  return Boolean(attempt.expectedAnswer && attempt.shownTopMatch && attempt.confidenceBand && attempt.status);
}

function topMatchMatchesExpected(attempt) {
  const topMatch = normalize(attempt.shownTopMatch);
  const expected = normalize(attempt.expectedAnswer);
  return topMatch === expected || topMatch.includes(expected) || expected.includes(topMatch);
}

function isRockClaim(attempt) {
  const topMatch = normalize(attempt.shownTopMatch);
  if (!topMatch) return false;
  return !['non-rock', 'not rock', 'unknown', 'uncertain', 'no confident match'].some((safeLabel) => topMatch.includes(safeLabel));
}

export function parseAttemptLog(markdown) {
  return markdown
    .split(/\r?\n/u)
    .filter((line) => /^\|\s*\d+\s*\|/u.test(line))
    .map((line) => line.split('|').slice(1, -1).map(cleanCell))
    .map((cells) => {
      const attempt = {
        attempt: Number(cells[0]),
        date: cells[1] ?? '',
        tester: cells[2] ?? '',
        sampleGroup: cells[3] ?? '',
        expectedAnswer: cells[4] ?? '',
        shownTopMatch: cells[5] ?? '',
        top3IncludesExpected: cells[6] ?? '',
        confidenceBand: cells[7] ?? '',
        photoConditions: cells[8] ?? '',
        useful: cells[9] ?? '',
        savedReopened: cells[10] ?? '',
        issue: cells[11] ?? '',
        status: cells[12] ?? '',
        notes: cells[13] ?? '',
      };
      return { ...attempt, completed: isCompletedAttempt(attempt) };
    });
}

export function summarizeAttempts(attempts) {
  const completed = attempts.filter((attempt) => attempt.completed);
  const knownRock = completed.filter(isKnownRockAttempt);
  const nonRock = completed.filter(isNonRockAttempt);
  const top3UsefulKnownRock = knownRock.filter((attempt) => isAffirmative(attempt.top3IncludesExpected));
  const highConfidenceWrongRockIds = knownRock.filter(
    (attempt) => isHighConfidence(attempt) && !topMatchMatchesExpected(attempt),
  );
  const highConfidenceNonRockClaims = nonRock.filter((attempt) => isHighConfidence(attempt) && isRockClaim(attempt));
  const triagedReports = completed.filter((attempt) => attempt.issue && attempt.status);

  return {
    completedAttempts: completed.length,
    knownRockAttempts: knownRock.length,
    nonRockConfuserAttempts: nonRock.length,
    top3UsefulKnownRockAttempts: top3UsefulKnownRock.length,
    top3UsefulnessRate: knownRock.length === 0 ? 0 : top3UsefulKnownRock.length / knownRock.length,
    highConfidenceWrongRockIds: highConfidenceWrongRockIds.length,
    highConfidenceNonRockClaims: highConfidenceNonRockClaims.length,
    reportsWithIssueAndStatus: triagedReports.length,
    gates: {
      completedAttempts: completed.length >= 20,
      top3Usefulness: knownRock.length > 0 && top3UsefulKnownRock.length / knownRock.length >= 0.7,
      confidentWrong: highConfidenceWrongRockIds.length === 0,
      nonRockRejection: highConfidenceNonRockClaims.length === 0,
    },
    failures: {
      highConfidenceWrongRockIds: highConfidenceWrongRockIds.map((attempt) => attempt.attempt),
      highConfidenceNonRockClaims: highConfidenceNonRockClaims.map((attempt) => attempt.attempt),
    },
  };
}

export function formatSummary(summary) {
  const percent = Math.round(summary.top3UsefulnessRate * 100);
  return [
    '# Known-Answer QA Summary',
    '',
    '- Completed attempts: ' + summary.completedAttempts + ' / 20',
    '- Known rock attempts: ' + summary.knownRockAttempts,
    '- Non-rock confuser attempts: ' + summary.nonRockConfuserAttempts,
    '- Top-3 usefulness on known rocks: ' + percent + '% (' + summary.top3UsefulKnownRockAttempts + '/' + summary.knownRockAttempts + ')',
    '- High-confidence wrong rock IDs: ' + summary.highConfidenceWrongRockIds,
    '- High-confidence rock claims on non-rock: ' + summary.highConfidenceNonRockClaims,
    '',
    '| Gate | Target | Status |',
    '| --- | --- | --- |',
    '| Completed attempts | 20+ | ' + (summary.gates.completedAttempts ? 'PASS' : 'PENDING') + ' |',
    '| Top-3 usefulness | 70%+ | ' + (summary.gates.top3Usefulness ? 'PASS' : 'PENDING') + ' |',
    '| Confident wrong | 0 | ' + (summary.gates.confidentWrong ? 'PASS' : 'FAIL') + ' |',
    '| Non-rock rejection | 0 high-confidence rock claims | ' + (summary.gates.nonRockRejection ? 'PASS' : 'FAIL') + ' |',
    '',
  ].join('\n');
}

export function summarizeMarkdown(markdown) {
  return summarizeAttempts(parseAttemptLog(markdown));
}

function runCli(argv) {
  const json = argv.includes('--json');
  const logPath = argv.find((arg) => !arg.startsWith('--')) ?? DEFAULT_LOG_PATH;
  const markdown = readFileSync(logPath, 'utf8');
  const summary = summarizeMarkdown(markdown);
  process.stdout.write(json ? JSON.stringify(summary, null, 2) + '\n' : formatSummary(summary) + '\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli(process.argv.slice(2));
}
