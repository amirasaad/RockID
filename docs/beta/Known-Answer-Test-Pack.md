# Known-Answer Test Pack

Last updated: May 12, 2026

## Purpose
Prepare a small, deliberate Android beta sample pack for Sprint 38. The goal is to test useful and honest behavior on samples where the expected answer is known before scanning.

This pack should be physical samples or trusted labeled photos. Do not use internet images unless the source/license is clear and the expected answer is reliable.

## Minimum Pack Shape
| Slot | Group | Target Sample | Expected Answer | Why It Matters | Ready? | Notes |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Clear rock | Quartz-like sample | quartz | Common beginner-recognizable mineral/rock-adjacent target. | No | |
| 2 | Clear rock | Granite-like sample | granite | Common speckled intrusive rock. | No | |
| 3 | Clear rock | Sandstone-like sample | sandstone | Sprint 37 added sandstone index coverage. | No | |
| 4 | Clear rock | Basalt-like sample | basalt | Dark fine-grained rock; useful confusion check. | No | |
| 5 | Clear rock | Limestone-like sample | limestone | Common pale sedimentary target. | No | |
| 6 | Clear rock | Marble-like sample | marble | Common metamorphic target. | No | |
| 7 | Clear rock | Obsidian-like sample | obsidian | Glassy rock vs glass confuser boundary. | No | |
| 8 | Clear rock | Slate-like sample | slate | Dark layered metamorphic target. | No | |
| 9 | Ambiguous rock | Clear rock in poor light | known rock label | Should lower confidence if evidence is weak. | No | |
| 10 | Ambiguous rock | Clear rock on mixed gravel background | known rock label | Background-confuser stress test. | No | |
| 11 | Ambiguous rock | Clear rock from far distance | known rock label | Distance/detail stress test. | No | |
| 12 | Ambiguous rock | Partial/wet/dirty sample | known rock label | Surface-condition stress test. | No | |
| 13 | Non-rock confuser | Glass | non-rock glass | Must avoid confident rock claim. | No | |
| 14 | Non-rock confuser | Concrete | non-rock concrete | Must avoid confident rock claim. | No | |
| 15 | Non-rock confuser | Brick | non-rock brick | Must avoid confident rock claim. | No | |
| 16 | Non-rock confuser | Slag | non-rock slag | Rock-like industrial material. | No | |
| 17 | Non-rock confuser | Asphalt | non-rock asphalt | Common outdoor confuser. | No | |
| 18 | Non-rock confuser | Plastic/ceramic | non-rock plastic/ceramic | Non-geologic material boundary. | No | |
| 19 | Non-rock confuser | Mixed material scene | non-rock mixed material | Background and object-boundary stress test. | No | |
| 20 | Non-rock confuser | Tile/countertop/engineered stone | non-rock engineered material | Polished/stone-like false-positive risk. | No | |

## Photo Capture Rules
- Capture each sample once in reasonable light before trying tricky conditions.
- Avoid cropping so tightly that texture context is lost.
- Include one object or surface cue only if it does not reveal private information.
- Record lighting, distance, background, blur, and wet/dry surface in the attempt log.
- For non-rock confusers, expected answer should be `non-rock <material>`.

## Run Order
1. Run Slots 1-8 first to establish clear-rock Top-3 usefulness.
2. Run Slots 13-20 second to test non-rock rejection before we celebrate anything.
3. Run Slots 9-12 last to see if uncertainty copy behaves honestly on weak evidence.
4. Save/reopen/reanalyze at least one clear rock, one ambiguous rock, and one non-rock confuser.

## Promotion To Eval Fixtures
Promote a sample into eval only when:
- The expected answer is trustworthy.
- The app behavior is reproduced or clearly captured.
- The issue includes top match, alternatives, confidence band, and photo conditions.
- The case represents a cluster or a high-severity safety miss, not just a one-off curiosity.

## Links
- [Known-Answer Detection QA](Known-Answer-Detection-QA.md)
- [Known-Answer Attempt Log](Known-Answer-Attempt-Log.md)
- [Wave 1 Trust Summary](Wave-1-Trust-Summary.md)
