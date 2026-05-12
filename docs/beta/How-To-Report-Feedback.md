# Friends Beta — How To Report Feedback

Last updated: May 12, 2026

## Required Intake Path
- All feedback must be submitted through GitHub Issue Templates.
- Do not use chat-only feedback as final intake; convert to an issue.

## Which Template To Use
- **Wrong Result Report**
  - Use when output label/confidence appears incorrect or misleading.
  - For Sprint 38 known-answer QA, include expected answer, shown top match, alternatives, Top-3 status, confidence, and photo conditions.
- **Bug / Crash Report**
  - Use for crashes, freezes, broken actions, install/runtime blockers.
- **UX Friction Report**
  - Use for confusion, awkward flow, unclear copy, interaction pain.

## Good Report Examples
- Wrong result:
  - “Known sample: basalt. Top match: granite (High). Alternatives: diorite, basalt. Top-3 included expected: yes. Outdoor shade, 30cm, mixed gravel background.”
- Bug:
  - “App crashes after tapping Analyze on iPhone 13 iOS 18.5, v0.30.2.”
- UX:
  - “Low-confidence banner text was unclear; expected clearer next action.”

## Triage Contract
- Every issue gets:
  - one category label (`beta-bug` / `beta-ux` / `beta-wrong-result` / `beta-install`)
  - one priority label (`beta-priority-high` / `beta-priority-normal` / `beta-priority-low`)
- Wave milestone assignment is required before fix work begins.
