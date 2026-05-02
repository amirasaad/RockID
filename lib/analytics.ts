export type AnalyticsEvent =
  | 'home_viewed'
  | 'take_photo_tapped'
  | 'upload_photo_tapped'
  | 'capture_tips_opened'
  | 'capture_tips_viewed'
  | 'capture_tips_open_camera'
  | 'camera_opened'
  | 'photo_captured'
  | 'gallery_opened_from_camera'
  | 'camera_quality_warning_shown'
  | 'image_review_viewed'
  | 'image_review_retake'
  | 'image_review_use_photo'
  | 'observations_viewed'
  | 'observations_skipped'
  | 'observations_submitted'
  | 'analysis_started'
  | 'analysis_completed'
  | 'analysis_failed'
  | 'analysis_timeout'
  | 'collection_viewed'
  | 'collection_item_opened'
  | 'collection_search_used'
  | 'learn_tab_viewed'
  | 'learn_topic_opened'
  | 'learn_search_used'
  | 'saved_find_viewed'
  | 'saved_find_reanalyze_tapped';

export type AnalyticsProperties = Record<string, unknown>;

export type AnalyticsSink = (event: AnalyticsEvent, properties?: AnalyticsProperties) => void;

let sink: AnalyticsSink | null = null;

/**
 * Tracks an analytics event through the configured sink (no-op by default).
 * @param event - A stable, app-level event name aligned with the screen requirements.
 * @param properties - Optional event metadata.
 */
export function track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
  sink?.(event, properties);
}

/**
 * Overrides the analytics sink for tests.
 * @param nextSink - Sink used to receive track() calls during tests.
 */
export function __setAnalyticsSinkForTesting(nextSink: AnalyticsSink | null): void {
  sink = nextSink;
}
