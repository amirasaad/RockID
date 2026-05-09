# Friends Beta — Invite Packet

Last updated: May 9, 2026

Purpose: provide one copy/paste packet for the trusted Friends Beta Wave 1 Android invite. The one-tester pilot was intentionally skipped on May 9, 2026 to move faster with a trusted group.

## Launch Decision

The one-tester pilot is skipped for Wave 1. Invite the trusted Android tester group directly, then use daily GitHub triage to catch access or install problems quickly.

During the first day of Wave 1, confirm testers can:
- access the private GitHub repo
- access the beta docs/wiki
- open GitHub Issues
- create one issue from a structured template
- upload a screenshot to that issue
- install the Android preview build
- complete one scan/save/reopen/reanalyze mission

If any access step fails, label it `beta-install` or `beta-ux`, assign the Wave 1 milestone, and fix or document the workaround in triage.

## Links To Include

- Android preview build: https://expo.dev/accounts/amirasaad/projects/rock-id/builds/cb22e5f0-8ae0-4914-a03a-63a21a7026f0
- Tester guide: `docs/beta/Friends-Beta-Getting-Started.md`
- Test missions: `docs/beta/Test-Missions.md`
- Feedback guide: `docs/beta/How-To-Report-Feedback.md`
- GitHub issues: https://github.com/amirasaad/RockID/issues

## Message To Testers

```text
Rock ID Friends Beta Wave 1 is ready for Android testing.

Scope: Android only, offline app flow only. No account, no cloud sync, and iOS is not available yet.

Please first confirm you can access GitHub Issues and upload a screenshot. Then try the app:
1. Install the Android preview build.
2. Upload or capture a rock-like photo.
3. Run analysis and read the confidence message.
4. Save the result.
5. Reopen it from Collection.
6. Try Re-analyze.
7. Try one tricky low-confidence photo.
8. Try one non-rock confuser, like glass, concrete, or brick-like material.

Android build:
https://expo.dev/accounts/amirasaad/projects/rock-id/builds/cb22e5f0-8ae0-4914-a03a-63a21a7026f0

Feedback goes through GitHub Issues only:
https://github.com/amirasaad/RockID/issues

If Android says the app cannot install because a previous version exists, uninstall the old Rock ID app first, then install this preview build again.

Please include screenshots when possible. For wrong results, include expected vs shown result, confidence shown, and photo conditions.

What I care about most:
- Did install work?
- Did the first scan flow make sense?
- Was low-confidence wording understandable?
- Did save/reopen/reanalyze feel reliable?
- If the result looked wrong, can you report expected vs shown result, confidence shown, and photo conditions?
```

## Optional Short Reminder

Use this after the first invite when nudging testers to complete missions.

```text
Quick reminder for Rock ID Friends Beta Wave 1: Android only, offline app flow only. No account, no cloud sync, and iOS is not available yet.

Please try:
1. First scan flow.
2. Low-confidence handling with a tricky photo.
3. Save, reopen, and reanalyze.
4. One non-rock confuser attempt, like glass, concrete, or brick-like material.

Android build:
https://expo.dev/accounts/amirasaad/projects/rock-id/builds/cb22e5f0-8ae0-4914-a03a-63a21a7026f0

Feedback goes through GitHub Issues only:
https://github.com/amirasaad/RockID/issues

Please include screenshots when possible. For wrong results, include expected vs shown result, confidence shown, and photo conditions.
```

## Triage Follow-Up

- Apply one category label and one priority label to every incoming issue.
- Assign the Wave 1 milestone before fix work starts.
- Reply within 24h with either a next action, repro request, fix plan, or explicit deferral.
