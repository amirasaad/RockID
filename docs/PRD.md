# **Rock Identification App PRD**

## **Product Name**

`Rock ID`

## **Overview**

`Rock ID` is a mobile app that helps users identify rocks by taking or uploading photos. The app uses image analysis plus optional user observations to return likely matches, explain the reasoning, and guide the user toward a more reliable identification. The product is designed as an educational field tool, not a laboratory-grade determination system.

## **Problem**

Most people cannot reliably identify rocks from appearance alone. Existing resources are often too technical, too slow to use in the field, or too confident despite ambiguity. Users need a fast, beginner-friendly tool that can narrow possibilities, explain key features, and show when more evidence is needed.

**Goal**
Help users go from “I found this rock” to “here are the most likely IDs and why” in less than one minute.

## **Objectives**

- Provide fast photo-based rock identification on mobile.
- Improve result quality through guided image capture.
- Teach users what geological traits matter.
- Make uncertainty visible instead of pretending every result is exact.
- Let users save and organize findings.

## **Non-Goals**

- Certified geological or commercial appraisal.
- Full mineral lab replacement.
- Precise chemical composition analysis from photo alone.
- Safety advice for collecting in dangerous locations.
- Advanced petrology workflows in MVP.

## **Target Users**

- Hobbyists and collectors
- Students
- Hikers and outdoor users
- Parents and teachers
- Beginner geology enthusiasts

## **Primary User Stories**

- As a user, I want to photograph a rock and get likely identifications quickly.
- As a beginner, I want the app to tell me why it chose a result in simple language.
- As a user, I want to know when the app is unsure.
- As a collector, I want to save identified samples with notes and photos.
- As a learner, I want suggestions for follow-up checks to improve confidence.

## **Core User Flow**

1. User opens the app.
2. User taps `Take Photo` or `Upload`.
3. App guides the user to capture a clear image.
4. User optionally adds notes such as location or visible traits.
5. App returns top likely matches with confidence and explanation.
6. User saves, retries, or compares results.

## **Key Features**

### **1. Photo Capture and Upload**

- Capture image from device camera.
- Upload image from photo library.
- Support multiple photos per specimen in later iterations.

#### **Guided Capture**

- Prompt user to use good lighting.
- Prompt user to fill frame with rock.
- Prompt for close-up and whole-sample views.
- Encourage including a size reference.
- Detect blur, darkness, and poor framing.

### **2. Rock Identification**

- Return top 3 likely rock types.
- Show broad category:
  - Igneous
  - Sedimentary
  - Metamorphic
- Include confidence level:
  - High
  - Medium
  - Low

### **3. Reasoning and Education**

- Explain the visible features used.
- Show likely look-alikes.
- Suggest next checks to improve certainty.
- Provide short educational summaries for each result.

1. `Save and Organize`

- Save photo, result, date, notes, and location if enabled.
- View previous identifications in a personal collection.

## **Functional Requirements**

### **Capture**

- The app must support rear-camera photo capture.
- The app must support gallery upload.
- The app must preview the image before submission.
- The app must detect and warn on low-quality images.

### **Identification**

- The app must classify common rocks at launch.
- The app must provide top 3 predictions.
- The app must provide confidence for each result.
- The app must explain the most relevant visual traits.
- The app must handle “not sure” cases gracefully.

### **Optional Inputs**

- The app should allow user-entered notes for:
  - Color
  - Grain size
  - Layering
  - Glassy look
  - Vesicles
  - Magnetic response
  - Acid reaction
  - Find location

### **Results**

- The app must show:
  - Likely rock name
  - Rock group
  - Confidence
  - Reasoning summary
  - Similar rocks
  - Next best check
- The app must clearly warn that photo-only identification has limits.

### **Storage**

- The app must save prior identifications locally or via account.
- The app should support offline viewing of saved entries.

### **Initial Supported Rock Set**
MVP should prioritize common and visually distinctive rocks:

- Granite
- Basalt
- Obsidian
- Sandstone
- Limestone
- Shale
- Conglomerate
- Marble
- Slate
- Gneiss
- Quartzite

### **Geology-Specific Product Rules**

- The app must consider texture, grain size, banding, foliation, vesicles, clasts, crystal visibility, and weathering.
- The app must not present certainty when multiple rock types plausibly match.
- The app must be able to suggest that an object may be mineral, slag, glass, brick, or concrete rather than a natural rock.
- The app should recommend follow-up observations for ambiguous results.

### **UX Requirements**

- First result should be reachable in under 3 taps after app open.
- Identification flow should be understandable by a beginner with no geology background.
- Language should be plain and educational, not overly technical.
- The app should use visual examples and short tips where possible.
- The results screen should emphasize confidence and uncertainty clearly.

## **Non-Functional Requirements**

- Response time target: under 5 seconds on a normal mobile connection.
- Supported platforms: iOS and Android.
- App should remain usable on mid-range devices.
- Saved data must persist across sessions.
- Photos and personal data must be handled securely.
- Permission prompts must be contextual and clear.

### **Accuracy and Trust Requirements**

- The app must describe itself as an educational field aid.
- The app must disclose when the image is insufficient.
- The app should improve recommendations if the user adds more photos or observations.
- The app should collect correction feedback for future model improvement.

## **Success Metrics**

- `% of users who complete first identification`
- `Median time to first result`
- `% of results saved`
- `% of low-quality captures successfully retaken`
- `User-rated usefulness of result`
- `Correction rate by rock class`
- `Top-1 and Top-3 model accuracy on evaluation set`

**MVP Scope**
Included:

- Camera capture
- Gallery upload
- Basic image quality checks
- Top 3 predictions
- Confidence labels
- Reasoning summary
- Save results
- Educational rock summary pages

Excluded from MVP:

- Community sharing
- Expert verification
- AR overlays
- Advanced mineral testing workflows
- Full offline inference if model size is too large

**Dependencies**

- Mobile app frontend
- Image classification service
- Rock taxonomy/content dataset
- Storage for saved identifications
- Analytics and feedback logging

### **Risks**

- Many rocks are visually similar in photos.
- Weathering can make correct classification difficult.
- Users may assume the app is more certain than it is.
- Dataset bias may reduce performance on field photos vs curated images.

### **Mitigations**

- Guided photo capture
- Top-3 instead of forced single answer
- Strong uncertainty messaging
- Follow-up prompts for extra evidence
- Continuous retraining from corrected cases

### **Release Criteria**

- Users can capture or upload a rock image without confusion.
- The app rejects obviously poor photos.
- The app returns top 3 likely matches with explanation.
- Results can be saved and revisited.
- Uncertainty and limitations are clearly communicated.
- MVP model performs acceptably on a predefined common-rock benchmark.

## **Roadmap**

Release sequencing for `MVP`, `V1`, `V2`, and `Future` lives in [Roadmap.md](<Roadmap.md>). This PRD defines product intent and scope, while the roadmap defines milestone order, major deliverables, dependencies, and readiness criteria across releases.
