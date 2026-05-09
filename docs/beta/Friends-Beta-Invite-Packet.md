# Friends Beta — Invite Packet

Last updated: May 9, 2026

Purpose: provide one copy/paste packet for the first trusted Android tester, then reuse it for the wider Wave 1 invite after access validation passes.

## First Tester Validation

Invite only one trusted tester first.

Before inviting the wider group, confirm they can:
- access the private GitHub repo
- access the beta docs/wiki
- open GitHub Issues
- create one issue from a structured template
- upload a screenshot to that issue
- install the Android preview build
- complete one scan/save/reopen/reanalyze mission

If any access step fails, fix the GitHub permission or invite flow before expanding Wave 1.

## Links To Include

- Android preview build: https://expo.dev/accounts/amirasaad/projects/rock-id/builds/cb22e5f0-8ae0-4914-a03a-63a21a7026f0
- Tester guide: `docs/beta/Friends-Beta-Getting-Started.md`
- Test missions: `docs/beta/Test-Missions.md`
- Feedback guide: `docs/beta/How-To-Report-Feedback.md`
- GitHub issues: https://github.com/amirasaad/RockID/issues

## Message To First Tester

```text
Hey! I’m starting a tiny private Android beta for Rock ID and would love your help as the first tester.

Scope: Android only, offline app flow only. No account, no cloud sync, and iOS is not available yet.

What I need you to validate first:
1. You can access the private GitHub repo/docs.
2. You can open GitHub Issues.
3. You can create one issue from a template.
4. You can attach/upload a screenshot to that issue.

Then please try the app:
1. Install the Android preview build.
2. Upload or capture a rock-like photo.
3. Run analysis and read the confidence message.
4. Save the result.
5. Reopen it from Collection.
6. Try Re-analyze.

Android build:
https://expo.dev/accounts/amirasaad/projects/rock-id/builds/cb22e5f0-8ae0-4914-a03a-63a21a7026f0

Feedback goes through GitHub Issues only:
https://github.com/amirasaad/RockID/issues

If Android says the app cannot install because a previous version exists, uninstall the old Rock ID app first, then install this preview build again.

What I care about most:
- Did install work?
- Did the first scan flow make sense?
- Was low-confidence wording understandable?
- Did save/reopen/reanalyze feel reliable?
- If the result looked wrong, can you report expected vs shown result, confidence shown, and photo conditions?
```

## Message For Wider Wave 1

Send this only after first tester validation passes.

```text
Rock ID Friends Beta Wave 1 is ready for Android testing.

Scope: Android only, offline app flow only. No account, no cloud sync, and iOS is not available yet.

Please try these missions:
1. First scan flow.
2. Low-confidence handling with a tricky photo.
3. Save, reopen, and reanalyze.
4. Three non-rock confuser attempts, like glass, concrete, or brick-like material.

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
