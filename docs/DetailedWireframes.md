# **Detailed Wireframes**

Below is a mobile-first screen set for `Rock ID`, focused on MVP plus a few near-term extensions. The intent is to give product, design, and engineering a clear shared blueprint.

## **1. Onboarding / Welcome**

*Purpose:
Explain what the app does, set expectations, and get the user to first scan quickly.

Key elements:

- App logo / wordmark
- Headline: `Identify rocks from a photo`
- Short subtext: `Get likely matches, confidence levels, and field tips`
- 3 value cards:
  - `Photo-based ID`
  - `Geology explanations`
  - `Save your finds`
- Disclaimer link: `Educational tool, not lab confirmation`
- Primary CTA: `Get Started`
- Secondary CTA: `Browse Sample Rocks`

Wireframe:

```text
------------------------------------------------
| Rock ID                                       |
|                                               |
|       [ rock icon ]                           |
|                                               |
|   Identify rocks from a photo                 |
|   Likely matches, confidence, and tips        |
|                                               |
|  [ Photo-based ID ]                           |
|  [ Geology explanations ]                     |
|  [ Save your finds ]                          |
|                                               |
|  Educational tool, not lab confirmation       |
|                                               |
|            [ Get Started ]                    |
|         [ Browse Sample Rocks ]               |
------------------------------------------------
```

Behavior:

- First-time users land here.
- Returning users skip to home.
- Tapping disclaimer opens a short modal.

## **2. Permission Intro**

Purpose:
Request permissions with context before system prompts.

Key elements:

- Camera explanation
- Optional location explanation
- Primary CTA: `Continue`
- Secondary CTA: `Not Now`

Wireframe:

```text
------------------------------------------------
| Camera Access                                 |
|                                               |
| We use your camera to photograph the rock     |
| and improve identification quality.           |
|                                               |
| [ Camera helps capture clear field images ]   |
| [ Location is optional for saved finds ]      |
|                                               |
|            [ Continue ]                       |
|             [ Not Now ]                       |
------------------------------------------------
```

Behavior:

- Ask for camera first.
- Ask for location only when saving or when user enables it.

## **3. Home Screen**

Purpose:
Fast entry into identification flow and saved collection.

Key elements:

- Header with app name
- Primary CTA: `Take Photo`
- Secondary CTA: `Upload Photo`
- Small educational shortcut: `How to photograph a rock`
- Recent finds carousel/list
- Bottom nav:
  - `Identify`
  - `Collection`
  - `Learn`
  - `Settings`

Wireframe:

```text
------------------------------------------------
| Rock ID                              [profile]|
|                                               |
|  What would you like to do?                   |
|                                               |
|        [ Take Photo ]                         |
|        [ Upload Photo ]                       |
|                                               |
|  How to photograph a rock                     |
|                                               |
|  Recent Finds                                 |
|  -------------------------------------------  |
|  [ Granite ]   [ Sandstone ]   [ Marble ]     |
|                                               |
|------------------------------------------------
| Identify | Collection | Learn | Settings      |
------------------------------------------------
```

Behavior:

- `Take Photo` launches camera flow.
- `Upload Photo` opens photo picker.
- `How to photograph a rock` opens capture tips.

## **4. Capture Tips Overlay**

Purpose:
Improve image quality before the user shoots.

Key elements:

- Checklist:
  - `Use natural light`
  - `Fill the frame`
  - `Include a close-up`
  - `Add a coin or ruler for scale`
- Sample image thumbnail or illustration
- CTA: `Open Camera`

Wireframe:

```text
------------------------------------------------
| Before You Snap                               |
|                                               |
|  1. Use bright, even light                    |
|  2. Fill most of the frame                    |
|  3. Show texture clearly                      |
|  4. Add scale if possible                     |
|                                               |
|     [ example rock photo ]                    |
|                                               |
|             [ Open Camera ]                   |
------------------------------------------------
```

## **5. Camera Capture Screen**

Purpose:
Capture a usable rock image with live guidance.

Key elements:

- Camera viewfinder
- Overlay frame guidance
- Flash toggle
- Gallery shortcut
- Capture button
- Prompt text: `Center the rock and hold steady`
- Optional chip: `Add scale reference`

Wireframe:

```text
------------------------------------------------
| [x]                                  [flash]  |
|                                               |
|        -----------------------------          |
|        |                           |          |
|        |      camera preview       |          |
|        |                           |          |
|        -----------------------------          |
|                                               |
|   Center the rock and hold steady             |
|   [ Add scale reference ]                     |
|                                               |
| [gallery]            ( capture )      [flip]  |
------------------------------------------------
```

Behavior:

- Live blur / lighting detection.
- If rock is too small in frame, prompt user to move closer.
- Default to rear camera.

## **6. Image Quality Review Screen**

Purpose:
Let the user confirm or retake before analysis.

Key elements:

- Captured image preview
- Quality indicators:
  - `Sharpness`
  - `Lighting`
  - `Rock fills frame`
- If poor quality, show warnings
- Buttons:
  - `Retake`
  - `Use Photo`

Wireframe:

```text
------------------------------------------------
| Review Photo                                  |
|                                               |
|     [ captured rock image preview ]           |
|                                               |
|  Quality Check                                |
|  Sharpness: Good                              |
|  Lighting: Fair                               |
|  Framing: Good                                |
|                                               |
|  Tip: Brighter light may improve accuracy     |
|                                               |
|    [ Retake ]          [ Use Photo ]          |
------------------------------------------------
```

Behavior:

- If quality is very poor, app strongly recommends retake.
- Still allow continue if user insists.

## **7. Optional Observation Input Screen**

Purpose:
Improve model accuracy with easy structured inputs.

Key elements:

- Chips / selectors for:
  - Color
  - Grain size
  - Layers present?
  - Glassy appearance?
  - Holes/vesicles?
  - Sparkly crystals?
- Optional text note
- Optional location
- CTA: `Analyze Rock`
- Skip option

Wireframe:

```text
------------------------------------------------
| Add Details (Optional)                        |
|                                               |
| Color                                         |
| [Light] [Dark] [Red] [Green] [Mixed]          |
|                                               |
| Grain Size                                    |
| [Fine] [Medium] [Coarse]                      |
|                                               |
| Features                                      |
| [Layered] [Glassy] [Vesicles] [Banding]       |
| [Visible Crystals]                            |
|                                               |
| Notes                                         |
| [______________________________]              |
|                                               |
|      [ Skip ]        [ Analyze Rock ]         |
------------------------------------------------
```

Behavior:

- Entire screen optional.
- Keep to fast taps, not heavy forms.

## **8. Analysis / Loading Screen**

Purpose:
Show that the app is processing and reinforce what it is evaluating.

Key elements:

- Captured thumbnail
- Animated progress / spinner
- Text: `Analyzing texture, grain size, and visible structure`
- Short note on uncertainty

Wireframe:

```text
------------------------------------------------
| Identifying...                                |
|                                               |
|      [ rock thumbnail ]                       |
|                                               |
|        [ animated loader ]                    |
|                                               |
|  Analyzing texture, grain size,               |
|  and visible structure                        |
|                                               |
|  Results may include multiple likely matches  |
------------------------------------------------
```

## **9. Results Screen**

Purpose:
Deliver likely matches clearly, with explanation and next steps.

Key elements:

- Hero result card:
  - Rock name
  - Category
  - Confidence badge
- Reasoning summary
- Top 3 matches list with confidence bars
- Look-alikes
- Next best check
- Actions:
  - `Save`
  - `Retake`
  - `Compare`
  - `Learn More`

Wireframe:

```text
------------------------------------------------
| Results                                       |
|                                               |
|  Likely Match                                 |
|  GRANITE                        [Medium]      |
|  Igneous intrusive                            |
|                                               |
|  Why this match                               |
|  Coarse grains, interlocking crystals,        |
|  light feldspar and quartz visible            |
|                                               |
|  Other likely matches                         |
|  1. Granite          72%                      |
|  2. Granitic Gneiss  18%                      |
|  3. Quartz Diorite   10%                      |
|                                               |
|  Look-alikes                                  |
|  Gneiss, quartz diorite                       |
|                                               |
|  Check next                                   |
|  Look for foliation to rule out gneiss        |
|                                               |
| [ Save ] [ Retake ] [ Compare ] [ Learn More ]|
------------------------------------------------
```

Behavior:

- If confidence is low, reorder emphasis:
  - show uncertainty banner near top
  - suggest another photo angle or fresh surface photo
- Confidence colors should be accessible, not red/green only.

## **10. Low Confidence Result Variant**

Purpose:
Handle ambiguous IDs honestly.

Key elements:

- Banner: `Low confidence`
- Message: `This sample needs another view or extra observations`
- Top 3 close matches
- CTA: `Add Another Photo`
- CTA: `Add Field Notes`

Wireframe:

```text
------------------------------------------------
| Results                                       |
|                                               |
|  [ Low Confidence ]                           |
|  This rock is difficult to identify from      |
|  one photo alone                              |
|                                               |
|  Most likely matches                          |
|  1. Slate            34%                      |
|  2. Shale            31%                      |
|  3. Phyllite         21%                      |
|                                               |
|  Best next step                               |
|  Photograph a fresh broken surface or         |
|  check whether the sample splits into sheets  |
|                                               |
|   [ Add Another Photo ]  [ Add Field Notes ]  |
------------------------------------------------
```

## **11. Compare Matches Screen**

Purpose:
Help users understand close alternatives.

Key elements:

- Side-by-side comparison cards
- Attributes table:
  - Texture
  - Grain size
  - Layering
  - Reaction clues
- “What to check next” section

Wireframe:

```text
------------------------------------------------
| Compare Matches                               |
|                                               |
| Granite              | Granitic Gneiss        |
| Igneous              | Metamorphic            |
|--------------------- | ---------------------- |
| Coarse crystals      | Coarse crystals        |
| No foliation         | Banded / foliated      |
| Massive texture      | Layered appearance     |
|                                               |
| What to check next                           |
| Look for alternating light/dark mineral bands |
------------------------------------------------
```

## **12. Learn More Screen**

Purpose:
Teach the user about the selected rock.

Key elements:

- Rock photo / illustration
- Name and classification
- Plain-language description
- Formation environment
- Common look-alikes
- Typical uses
- Quick field tips

Wireframe:

```text
------------------------------------------------
| Granite                                       |
|                                               |
|     [ rock image ]                            |
|                                               |
|  Classification                               |
|  Igneous intrusive                            |
|                                               |
|  Description                                  |
|  A coarse-grained rock formed by slow         |
|  cooling of magma underground                 |
|                                               |
|  Look-alikes                                  |
|  Granitic gneiss, quartz diorite              |
|                                               |
|  Field Tip                                    |
|  Granite usually lacks foliation              |
------------------------------------------------
```

## **13. Save Result Modal**

Purpose:
Quickly store the find without interrupting flow.

Key elements:

- Thumbnail
- Editable title
- Auto-filled date
- Optional location toggle
- Optional notes
- CTA: `Save to Collection`

Wireframe:

```text
------------------------------------------------
| Save Find                                     |
|                                               |
| [ thumbnail ]                                 |
| Title                                         |
| [ Granite near trail __________________ ]     |
|                                               |
| Date: Apr 23, 2026                            |
| [x] Include location                          |
| Notes                                         |
| [______________________________]              |
|                                               |
|          [ Save to Collection ]               |
------------------------------------------------
```

## **14. Collection Screen**

Purpose:
Let users browse saved finds.

Key elements:

- Search bar
- Filter chips:
  - `All`
  - `Igneous`
  - `Sedimentary`
  - `Metamorphic`
  - `Low confidence`
- Card list with thumbnail, name, date, confidence
- Empty state for new users

Wireframe:

```text
------------------------------------------------
| Collection                                    |
| [ Search saved finds ____________ ]           |
| [All] [Igneous] [Sedimentary] [Metamorphic]   |
|                                               |
| [img] Granite                Medium           |
|       Apr 23, 2026                            |
|                                               |
| [img] Sandstone              High             |
|       Apr 21, 2026                            |
------------------------------------------------
```

## **15. Saved Find Detail Screen**

Purpose:
Review a past identification.

Key elements:

- Full image
- Saved result info
- Notes
- Location map snippet if enabled
- Re-run analysis button
- Delete action in overflow menu

Wireframe:

```text
------------------------------------------------
| Saved Find                                    |
|                                               |
|     [ saved rock image ]                      |
|                                               |
| Granite                                       |
| Igneous intrusive                             |
| Confidence: Medium                            |
|                                               |
| Notes                                         |
| Found near stream bed                         |
|                                               |
| Location                                      |
| [ mini map ]                                  |
|                                               |
|         [ Re-analyze ]                        |
------------------------------------------------
```

## **16. Learn Tab**

Purpose:
Provide beginner geology content outside the scan flow.

Key elements:

- Search
- Topic cards:
  - `Igneous Rocks`
  - `Sedimentary Rocks`
  - `Metamorphic Rocks`
  - `How to Spot Grain Size`
  - `Common Look-alikes`

Wireframe:

```text
------------------------------------------------
| Learn                                         |
| [ Search topics __________ ]                  |
|                                               |
| [ Igneous Rocks ]                             |
| [ Sedimentary Rocks ]                         |
| [ Metamorphic Rocks ]                         |
| [ Grain Size Guide ]                          |
| [ Common Look-alikes ]                        |
------------------------------------------------
```

## **17. Settings Screen**

Purpose:
Manage permissions, storage, and trust settings.

Key elements:

- Camera permission status
- Location permission status
- Units / preferences
- Data/privacy
- Feedback
- Version info

Wireframe:

```text
------------------------------------------------
| Settings                                      |
|                                               |
| Camera Access            Enabled              |
| Location Access          Ask When Saving      |
| Save Photos Locally      On                   |
| Privacy & Data           >                    |
| Send Feedback            >                    |
| About Rock ID            >                    |
------------------------------------------------
```

## **Design Notes**

- Primary navigation:
  - Bottom nav with `Identify`, `Collection`, `Learn`, `Settings`
- Primary CTA pattern:
  - Solid button for main next action
  - Outline button for retry/secondary
- Result emphasis:
  - Put `confidence` near the top, not buried
- Tone:
  - Plain, educational, calm
  - Never imply certainty when evidence is weak
- Accessibility:
  - Large touch targets
  - High contrast
  - VoiceOver / TalkBack labels
  - Confidence not communicated by color alone

## **Critical States To Design**

- First-time empty collection
- Camera permission denied
- No internet / slow connection
- Analysis failed
- Image too blurry
- Object may not be a rock
- Low-confidence ambiguous result

## **Recommended MVP Screen List**

1. Welcome
2. Home
3. Capture Tips
4. Camera
5. Image Review
6. Optional Inputs
7. Loading
8. Results
9. Save Modal
10. Collection
11. Saved Find Detail
12. Learn
13. Settings

## **Roadmap Alignment**

This document is MVP-first. The recommended MVP screen list above defines the core launch set, while later-phase enhancements such as richer compare experiences, expanded learning content, expert workflows, account sync, and advanced field tools are sequenced in [Roadmap.md](<Roadmap.md>).
