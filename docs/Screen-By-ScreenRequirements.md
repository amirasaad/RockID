# **Screen-By-Screen Requirements**

This document is written so product, design, mobile, and backend can implement the MVP directly.

## **1. Welcome**

Purpose:
Introduce the app and move the user into identification quickly.

UI Elements:

- App logo
- Title: `Identify rocks from a photo`
- Subtitle: `Get likely matches, confidence levels, and field tips`
- Benefit cards:
  - `Photo-based ID`
  - `Geology explanations`
  - `Save your finds`
- Disclaimer link: `Educational tool, not lab confirmation`
- Primary button: `Get Started`
- Secondary button: `Browse Sample Rocks`

Actions:

- `Get Started` -> `Permission Intro`
- `Browse Sample Rocks` -> `Learn Tab`

States:

- Default
- First launch only

Validation:

- None

Analytics:

- `welcome_viewed`
- `welcome_get_started_tapped`
- `welcome_browse_tapped`

## **2. Permission Intro**

Purpose:
Explain permissions before native OS prompts.

UI Elements:

- Title: `Camera Access`
- Body copy explaining camera usage
- Optional location explanation
- Primary button: `Continue`
- Secondary button: `Not Now`

Actions:

- `Continue` -> trigger camera permission prompt
- `Not Now` -> skip to `Home`

States:

- Camera not requested
- Camera granted
- Camera denied

Validation:

- None

Rules:

- Do not ask for location here unless product explicitly wants location during onboarding.
- Location permission should be deferred until save flow.

Analytics:

- `permission_intro_viewed`
- `camera_permission_requested`
- `camera_permission_granted`
- `camera_permission_denied`

## **3. Home / Identify**

Purpose:
Serve as the main launch point for scanning.

UI Elements:

- Header: `Rock ID`
- Primary CTA: `Take Photo`
- Secondary CTA: `Upload Photo`
- Text link: `How to photograph a rock`
- Recent finds section
- Bottom nav:
  - `Identify`
  - `Collection`
  - `Learn`
  - `Settings`

Actions:

- `Take Photo` -> `Capture Tips` or `Camera`
- `Upload Photo` -> image picker
- `How to photograph a rock` -> `Capture Tips`
- Tap recent item -> `Saved Find Detail`

States:

- Default with recent finds
- Empty state with no finds
- Camera permission denied
- Upload unavailable error

Validation:

- None

Rules:

- If no recent finds exist, replace section with onboarding empty state.

Analytics:

- `home_viewed`
- `take_photo_tapped`
- `upload_photo_tapped`
- `capture_tips_opened`

## **4. Capture Tips**

Purpose:
Improve input quality before analysis.

UI Elements:

- Title: `Before You Snap`
- Tips list:
  - `Use bright, even light`
  - `Fill most of the frame`
  - `Show texture clearly`
  - `Add scale if possible`
- Example image
- Primary button: `Open Camera`
- Optional secondary text button: `Skip Tips`

Actions:

- `Open Camera` -> `Camera Capture`
- `Skip Tips` -> `Camera Capture`

States:

- First-time version
- Returning-user compact version

Validation:

- None

Rules:

- Show automatically only on first capture unless user reopens manually.

Analytics:

- `capture_tips_viewed`
- `capture_tips_open_camera`

## **5. Camera Capture**

Purpose:
Capture a usable rock photo.

UI Elements:

- Live camera preview
- Back button
- Flash toggle
- Gallery shortcut
- Capture button
- Instruction text: `Center the rock and hold steady`
- Optional chip: `Add scale reference`

Actions:

- Capture photo -> `Image Review`
- Open gallery -> `Image Review` after selection
- Back -> `Home`

States:

- Default
- Low light warning
- Blur warning
- Subject too small warning
- Permission denied
- Camera unavailable

Validation:

- A photo is required to continue.
- If no image is captured or selected, user cannot proceed.

Rules:

- Default to rear camera.
- Live guidance should detect blur, exposure, and subject size if feasible.

Analytics:

- `camera_opened`
- `photo_captured`
- `gallery_opened_from_camera`
- `camera_quality_warning_shown`

## **6. Image Review**

Purpose:
Let the user confirm the photo before analysis.

UI Elements:

- Captured image preview
- Section: `Quality Check`
- Rows:
  - `Sharpness`
  - `Lighting`
  - `Framing`
- Tip text if needed
- Secondary button: `Retake`
- Primary button: `Use Photo`

Actions:

- `Retake` -> `Camera Capture`
- `Use Photo` -> `Optional Observations`

States:

- Good quality
- Fair quality
- Poor quality with warning
- Image load error

Validation:

- Photo must exist.
- If photo is severely corrupted, block continue and require retake/upload again.

Rules:

- Warn but do not hard-block on most poor images.
- Hard-block only if image is unreadable.

Analytics:

- `image_review_viewed`
- `image_review_retake`
- `image_review_use_photo`

## **7. Optional Observations**

Purpose:
Collect extra clues that improve classification.

UI Elements:

- Title: `Add Details (Optional)`
- Multi-select or single-select chips:
  - Color: `Light`, `Dark`, `Red`, `Green`, `Mixed`
  - Grain size: `Fine`, `Medium`, `Coarse`
  - Features: `Layered`, `Glassy`, `Vesicles`, `Banding`, `Visible Crystals`
- Notes text field
- Optional location toggle
- Secondary button: `Skip`
- Primary button: `Analyze Rock`

Actions:

- `Skip` -> `Analyzing`
- `Analyze Rock` -> `Analyzing`

States:

- Default
- With selected chips
- Notes entered
- Location enabled

Validation:

- No field required.
- Notes max length should be defined, e.g. 300 characters.

Rules:

- Keep interaction lightweight.
- Avoid technical geology jargon unless tooltips are added.

API Input Payload:

- `photo_id` or image blob reference
- `color`
- `grain_size`
- `features[]`
- `notes`
- `location` if authorized

Analytics:

- `observations_viewed`
- `observations_skipped`
- `observations_submitted`

## **8. Analyzing**

Purpose:
Show progress while the model processes the specimen.

UI Elements:

- Thumbnail preview
- Loader / progress animation
- Copy: `Analyzing texture, grain size, and visible structure`

Actions:

- None during normal flow
- Optional cancel icon if product wants interrupt support

States:

- Loading
- Slow response
- Network failure
- Analysis failure
- Timeout

Validation:

- Valid image reference required before entering this screen.

Rules:

- If analysis exceeds 5 seconds, show retry or wait messaging.
- If request fails, route to recoverable error state with retry.

Analytics:

- `analysis_started`
- `analysis_completed`
- `analysis_failed`
- `analysis_timeout`

## **9. Results**

Purpose:
Present the identification clearly and honestly.

UI Elements:

- Header: `Results`
- Top result card:
  - `Likely Match`
  - rock name
  - confidence badge
  - category label
- Section: `Why this match`
- Section: `Other likely matches`
- Section: `Look-alikes`
- Section: `Check next`
- Actions:
  - `Save`
  - `Retake`
  - `Compare`
  - `Learn More`

Actions:

- `Save` -> `Save Result Modal`
- `Retake` -> `Camera Capture`
- `Compare` -> `Compare Matches`
- `Learn More` -> `Learn More`
- Tap alternative result -> update detail or open compare

States:

- High confidence
- Medium confidence
- Low confidence
- Non-rock suspected
- No confident classification

Validation:

- Results payload must include at least one candidate.
- If no result is available, show failure state and retry path.

Required API Output:

- `top_match`
- `top_match.category`
- `top_match.confidence_band`
- `top_match.reasoning_summary`
- `alternatives[]` minimum 2 when available
- `look_alikes[]`
- `next_best_check`
- `educational_summary`
- `possible_non_rock_flag`

Rules:

- Confidence must appear above the fold.
- If confidence is low, alternatives and next steps must be prominent.
- If `possible_non_rock_flag = true`, show a clear note such as `This may be slag, glass, concrete, or another non-rock material.`

Analytics:

- `results_viewed`
- `results_save_tapped`
- `results_compare_tapped`
- `results_learn_more_tapped`
- `results_retake_tapped`

## **10. Low-Confidence Variant**

Purpose:
Support ambiguity without losing user trust.

UI Elements:

- Banner: `Low Confidence`
- Explanatory message
- Top 3 likely matches
- Best next step
- Primary button: `Add Another Photo`
- Secondary button: `Add Field Notes`

Actions:

- `Add Another Photo` -> `Camera Capture`
- `Add Field Notes` -> `Optional Observations`

States:

- Low confidence standard
- Very low confidence / insufficient evidence

Rules:

- This is a result variant, not a separate backend flow.
- The copy should explicitly say one photo may not be enough.

Analytics:

- `low_confidence_result_viewed`
- `low_confidence_add_photo_tapped`

## **11. Compare Matches**

Purpose:
Help users understand close alternatives.

UI Elements:

- Header: `Compare Matches`
- Side-by-side cards for 2 or 3 candidates
- Trait comparison rows:
  - Texture
  - Grain size
  - Layering / foliation
  - Visible crystals
  - Typical distinguishing clue
- Section: `What to check next`

Actions:

- Back -> `Results`
- Tap candidate -> `Learn More`

States:

- Compare 2
- Compare 3

Validation:

- At least 2 candidates required.

Rules:

- Show only field-observable traits in MVP.

Analytics:

- `compare_viewed`
- `compare_candidate_selected`

## **12. Learn More**

Purpose:
Provide educational context on the selected match.

UI Elements:

- Rock image or illustration
- Name
- Classification
- Description
- Formation environment
- Look-alikes
- Field tip

Actions:

- Back -> `Results` or `Learn`
- Save to favorites if desired in later versions

States:

- From result flow
- From learn tab

Validation:

- Content payload required for selected rock type.

Content Model:

- `name`
- `category`
- `description`
- `formation_environment`
- `look_alikes[]`
- `field_tip`
- `common_uses` optional

Analytics:

- `learn_more_viewed`

## **13. Save Result Modal**

Purpose:
Store a find quickly.

UI Elements:

- Thumbnail
- Editable title field
- Date label
- Include location toggle
- Notes field
- Primary button: `Save to Collection`
- Close button

Actions:

- `Save to Collection` -> persist item -> `Collection` or dismiss to `Results`
- Close -> `Results`

States:

- Default
- Saving
- Save success
- Save failure
- Location permission required

Validation:

- Title optional if default title is auto-generated
- Notes max length e.g. 500 characters

Saved Record Schema:

- `id`
- `photo_uri`
- `created_at`
- `user_title`
- `top_match`
- `alternatives`
- `confidence`
- `reasoning_summary`
- `notes`
- `location`
- `source_image_metadata`

Analytics:

- `save_modal_viewed`
- `save_completed`
- `save_failed`

## **14. Collection**

Purpose:
Browse saved items.

UI Elements:

- Search field
- Filter chips:
  - `All`
  - `Igneous`
  - `Sedimentary`
  - `Metamorphic`
  - `Low confidence`
- Saved item cards with thumbnail, name, date, confidence

Actions:

- Search text -> filter results
- Tap card -> `Saved Find Detail`

States:

- Populated list
- Empty collection
- Empty search result
- Storage load failure

Validation:

- None

Rules:

- Sort by most recent by default.

Analytics:

- `collection_viewed`
- `collection_item_opened`
- `collection_search_used`

## **15. Saved Find Detail**

Purpose:
Review a saved identification.

UI Elements:

- Large image
- Rock name
- Category
- Confidence
- Reasoning summary
- Notes
- Location block if present
- Primary button: `Re-analyze`

Actions:

- `Re-analyze` -> `Analyzing` with current image
- Edit notes if enabled
- Delete from overflow menu if included

States:

- Standard
- Missing image asset
- Re-analysis failed

Validation:

- Saved record must exist.
- If referenced image is missing, show metadata-only fallback.

Analytics:

- `saved_find_viewed`
- `saved_find_reanalyze_tapped`

## **16. Learn Tab**

Purpose:
Provide browseable educational content.

UI Elements:

- Search bar
- Topic cards:
  - `Igneous Rocks`
  - `Sedimentary Rocks`
  - `Metamorphic Rocks`
  - `Grain Size Guide`
  - `Common Look-alikes`

Actions:

- Tap card -> topic detail page
- Search -> filter topics and rock pages

States:

- Default
- Search result
- No result

Validation:

- None

Analytics:

- `learn_tab_viewed`
- `learn_topic_opened`
- `learn_search_used`

## **17. Settings**

Purpose:
Manage preferences and permissions.

UI Elements:

- Camera access status
- Location access status
- Save photos locally toggle
- Privacy & Data
- Send Feedback
- About

Actions:

- Tap permission row -> OS settings handoff if needed
- Tap privacy -> privacy page
- Tap feedback -> feedback form/mail

States:

- Default
- Permission denied indicators
- Offline

Validation:

- None

Analytics:

- `settings_viewed`
- `settings_permission_opened`
- `feedback_opened`

## **Shared System Requirements**

### **Navigation**

- Bottom nav visible on `Home`, `Collection`, `Learn`, `Settings`
- Hidden on focused flow screens like `Camera` and `Analyzing`

### **Accessibility**

- All controls need screen-reader labels
- Confidence must be text-based, not color-only
- Minimum tap target should meet mobile accessibility guidelines
- Dynamic type support preferred

### **Error States**

Every major screen should define:

- loading
- empty
- recoverable error
- fatal error where applicable

### **Offline Behavior**

- Saved collection must remain viewable offline
- New analysis requires network unless on-device model is added later
- If offline during analysis request, show retry state with clear explanation

### **Core API Contract For Identification**

Request:

- `image`
- optional `observations`
- optional `location`
- device/app metadata if needed

Response:

- `request_id`
- `top_match`
- `alternatives[]`
- `confidence_band`
- `reasoning_summary`
- `look_alikes[]`
- `next_best_check`
- `educational_summary`
- `possible_non_rock_flag`
- `quality_feedback` optional

### **Acceptance Criteria**

- User can reach first analysis from home in 3 taps or fewer
- App supports capture and upload
- Results always show confidence and explanation
- Low-confidence cases present clear next steps
- Saved finds persist and reopen correctly
- Permission denial does not dead-end the app
- Non-rock possibilities are communicated explicitly

### **Roadmap Alignment**

These requirements are MVP-first and are intended to be implementation-ready for the launch scope. Future screens, extensions, and deeper workflows are tracked in [Roadmap.md](<Roadmap.md>), which owns release sequencing across `MVP`, `V1`, `V2`, and `Future`.
