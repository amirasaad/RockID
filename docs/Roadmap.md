# **Rock ID Product Roadmap**

This roadmap is the source of truth for release sequencing across the `Rock ID` product docs. The PRD defines product intent, the flow map defines MVP navigation, the wireframes define MVP-first UX, the screen requirements define implementation detail, and this roadmap defines the order of delivery, major dependencies, and release readiness across milestones.

## **Milestone Summary**

| Phase | Goal | Target Outcomes |
| --- | --- | --- |
| `MVP` | Deliver a trustworthy first rock-ID experience | Users can capture or upload a photo, receive top 3 likely matches with confidence and explanation, and save results |
| `V1` | Improve identification quality and learning value | Users can provide more evidence, compare close matches more clearly, and manage a stronger collection |
| `V2` | Expand retention, robustness, and model assistance | Users get sync, broader coverage, stronger metadata-aware guidance, and improved non-rock detection |
| `Future` | Extend the app into expert, classroom, and community use cases | The product supports advanced validation, collaboration, and richer field workflows |

## **MVP**

### **Objective**

Launch a useful, beginner-friendly rock identification flow that is fast, transparent about uncertainty, and good enough to support repeated use in the field.

### **User-Facing Features**

- Photo capture and gallery upload
- Guided capture tips and image quality checks
- Top 3 likely matches
- Confidence display using `High`, `Medium`, and `Low`
- Plain-language reasoning summary
- Suggested next check for ambiguous results
- Save to collection
- Basic educational pages for supported rock types

### **Enabling Technical Work**

- Mobile camera and image picker integration
- Image quality heuristics for blur, lighting, and framing
- Initial rock classification service and taxonomy
- Result payload with confidence, reasoning, alternatives, and look-alikes
- Local persistence for saved finds
- Basic analytics for scan completion and save behavior

### **Dependencies And Risks**

- Model accuracy may be constrained by limited field-photo training data
- Similar-looking rocks may create user trust issues if uncertainty is not surfaced clearly
- Photo quality can strongly affect result usefulness
- Educational content must align with supported taxonomy and result language

### **Release Readiness Criteria**

- Users can reach first result quickly and without confusion
- The app returns top 3 likely matches with clear confidence and explanation
- Poor images are detected and prompted for improvement
- Saved finds persist reliably across sessions
- The app clearly states that photo-based identification has limits

## **V1**

### **Objective**

Increase result confidence and user value by supporting richer evidence, better comparison, and stronger post-result learning and organization.

### **User-Facing Features**

- Multi-photo analysis for one specimen
- Stronger compare flow for close alternatives
- Better collection search and filtering
- Richer learn content and look-alike guidance
- User correction feedback loop for wrong or uncertain identifications

### **Enabling Technical Work**

- Multi-image upload and specimen session model
- Updated inference flow that accepts multiple photos and structured metadata together
- Enhanced comparison content for common confusion pairs
- Search and filter support for saved items
- Feedback capture pipeline for mislabeled or corrected results

### **Dependencies And Risks**

- Multi-photo UX can become slow or confusing if capture prompts are too heavy
- Comparison content must stay consistent with model output and supported rock set
- Feedback loops need moderation or labeling review before retraining use

### **Release Readiness Criteria**

- Multi-photo flow improves ambiguous-result handling without adding major friction
- Comparison screens clearly help users distinguish common look-alikes
- Collection filtering works across confidence and rock-group dimensions
- Correction feedback is stored cleanly and usable for future model evaluation

## **V2**

### **Objective**

Improve retention and robustness by expanding content coverage, adding continuity across devices, and making the model more context-aware.

### **User-Facing Features**

- Account sync for saved finds
- Better offline saved-library behavior
- Improved model assistance using optional metadata and notes
- Broader rock coverage beyond the MVP starter set
- Stronger non-rock detection for slag, glass, concrete, and brick

### **Enabling Technical Work**

- Authentication and cloud-backed collection storage
- Sync model for photos, notes, and result metadata
- Expanded taxonomy and content pipeline
- Better metadata ingestion for location, notes, and observations
- Hardening of non-rock classification and fallback messaging

### **Dependencies And Risks**

- Account features introduce privacy, permissions, and support complexity
- Broader taxonomy raises risk of lower confidence unless data quality scales with it
- Metadata-aware guidance must remain optional and privacy-safe

### **Release Readiness Criteria**

- Saved finds sync reliably across sessions and devices
- Expanded taxonomy does not regress core common-rock experience
- Non-rock detection reduces misleading identifications for artificial materials
- Privacy messaging remains clear for synced data and optional metadata

## **Future**

### **Objective**

Extend the app into higher-trust, collaborative, and specialized workflows once the core identification experience is strong.

### **User-Facing Features**

- Expert verification or review workflows
- Community and sharing features
- Advanced field-test prompts and specimen workflows
- Possible on-device inference for limited offline identification
- Classroom and education features for guided learning

### **Enabling Technical Work**

- Expert review queue and verification model
- Shared collections, comments, or classroom workspace design
- On-device model evaluation and performance tuning
- Expanded curriculum-style content and lesson packaging

### **Dependencies And Risks**

- Community features require moderation and abuse handling
- Expert review requires operational processes, not only product UI
- On-device inference may be limited by model size and device performance
- Classroom workflows may require role management and content administration

### **Release Readiness Criteria**

- Core single-user product is already trusted and stable
- Operational support exists for expert or community workflows
- Offline/on-device performance is acceptable on target devices
- Education features integrate cleanly with the consumer app experience

## **Cross-Document Alignment**

- [PRD.md](<PRD.md>) defines product intent, goals, scope, and success metrics.
- [ClickableFlowMap.md](<ClickableFlowMap.md>) describes the MVP navigation and user paths.
- [DetailedWireframes.md](<DetailedWireframes.md>) describes MVP-first screen concepts and future-facing UI opportunities.
- [Screen-By-ScreenRequirements.md](<Screen-By-ScreenRequirements.md>) defines implementation-ready MVP requirements.
- `Roadmap.md` owns milestone sequencing and release progression across the document set.

## **Shared Dependencies And Risks**

- Model accuracy depends on representative field-photo training data
- Ambiguous rock visuals require strong confidence messaging and follow-up guidance
- Photo quality directly affects usefulness and trust
- Educational content, taxonomy, and model output must stay aligned
- Broader coverage increases maintenance burden across content, training data, and UX
