# Friends Beta — Test Missions

Last updated: May 12, 2026

## Mission A — First Scan Flow
1. Open app.
2. Capture or upload a rock-like photo.
3. Complete analysis.
4. Confirm results screen is understandable.

Success:
- No blocker crash.
- You can interpret top match and confidence band.

## Mission B — Low-Confidence Handling
1. Use a tricky photo (poor light, mixed background, far distance).
2. Run analysis.
3. Read uncertainty/low-confidence guidance.

Success:
- Guidance does not overpromise certainty.
- Next action is clear.

## Mission C — Save / Reopen / Reanalyze
1. Save one result.
2. Open it from Collection.
3. Reanalyze from saved item.

Success:
- Data persists and flow remains stable.

## Mission D — Non-Rock Confusers
Try three non-rock-adjacent samples:
- glass-like
- concrete-like
- brick-like

Success:
- Report outcome quality using Wrong Result template when misleading.
- Include photo condition context in every report.

## Mission E — Known-Answer Detection Trust
1. Pick a sample where you already know the expected answer before scanning.
2. Run the normal scan flow.
3. Record expected answer, shown top match, alternatives, confidence band, and photo conditions.
4. Mark whether the result felt useful, misleading, unclear, or blocked.
5. Repeat with both clear rocks and non-rock confusers.

Success:
- Known rocks are useful in Top-3 often enough to guide a beginner.
- Ambiguous cases do not sound overconfident.
- Non-rock confusers do not receive high-confidence rock claims.
- Any wrong or misleading result becomes a GitHub issue with enough detail to reproduce.

Reference: [Known-Answer Detection QA](<Known-Answer-Detection-QA.md>) and [Known-Answer Attempt Log](<Known-Answer-Attempt-Log.md>).
