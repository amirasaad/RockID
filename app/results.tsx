import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Card, Screen, SectionTitle } from '@/components/Layout';
import { PhotoThumbnail } from '@/components/PhotoThumbnail';
import { palette } from '@/constants/theme';
import { track } from '@/lib/analytics';
import { useIdentificationSession } from '@/lib/identification-session-context';
import { analyzeIdentificationSession } from '@/lib/mock-analysis';
import { type ResultFeedbackChoice } from '@/lib/result-feedback';
import { useResultFeedback } from '@/lib/result-feedback-context';
import { isLowConfidenceVariant } from '@/lib/results-clarity';
import { saveIdentificationResult } from '@/lib/saved-finds-actions';
import { useSavedFinds } from '@/lib/saved-finds-context';

export default function ResultsScreen() {
  const { session } = useIdentificationSession();
  const { saveFind } = useSavedFinds();
  const { getFeedbackForSession, saveFeedback } = useResultFeedback();
  const analysis = analyzeIdentificationSession(session);
  const { topMatch, matches } = analysis;
  const alternatives = matches.slice(1);
  const resultFeedback = getFeedbackForSession(analysis.sessionId);
  const isLowConfidence = isLowConfidenceVariant(topMatch.confidence);
  const lastTrackedLowConfidenceSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLowConfidence) return;
    if (lastTrackedLowConfidenceSessionRef.current === analysis.sessionId) return;

    track('low_confidence_result_viewed', {
      sessionId: analysis.sessionId,
      topMatch: topMatch.name,
    });
    lastTrackedLowConfidenceSessionRef.current = analysis.sessionId;
  }, [analysis.sessionId, isLowConfidence, topMatch.name]);

  function handleSaveResult() {
    if (!session) {
      Alert.alert('No result to save', 'Capture or upload a photo before saving a result.');
      return;
    }

    const savedFind = saveIdentificationResult({
      session,
      analysis,
      saveFind,
    });

    router.replace({
      pathname: '/saved/[id]',
      params: { id: savedFind.id },
    });
  }

  function handleRetake() {
    router.replace('/capture-tips');
  }

  function handleAddAnotherPhoto() {
    track('low_confidence_add_photo_tapped', {
      sessionId: analysis.sessionId,
      topMatch: topMatch.name,
    });
    router.replace('/capture-tips');
  }

  function handleResultFeedback(choice: ResultFeedbackChoice) {
    saveFeedback({ sessionId: analysis.sessionId, choice });
    track('result_feedback_submitted', {
      sessionId: analysis.sessionId,
      choice,
    });
  }

  return (
    <Screen title="Results" subtitle="This is mocked data, but the screen structure follows the MVP output contract from the spec.">
      {isLowConfidence ? (
        <Card>
          <View style={styles.lowConfidenceBanner}>
            <Text style={styles.lowConfidenceTitle}>Low confidence</Text>
            <Text style={styles.bodyText}>
              One photo may not be enough. Add another photo to improve confidence before saving.
            </Text>
          </View>
        </Card>
      ) : null}

      <Card>
        <View style={styles.thumbnailRow}>
          <PhotoThumbnail
            uri={session?.selectedPhoto?.uri}
            size={88}
            borderRadius={18}
            fallbackText="Sample"
            fallbackFontSize={16}
          />
          <View style={styles.thumbnailMeta}>
            <Text style={styles.metaTitle}>Session</Text>
            <Text style={styles.metaValue}>{session?.observations?.grainSize ?? '—'} grain</Text>
            <Text style={styles.metaValue}>{session?.observations?.color ?? '—'} color</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.kicker}>Likely match</Text>
        <View style={styles.headlineRow}>
          <Text style={styles.rockName}>{topMatch.name}</Text>
          <Text style={styles.badge}>{topMatch.confidence}</Text>
        </View>
        <Text style={styles.category}>{topMatch.category}</Text>
      </Card>

      <Card>
        <SectionTitle>Other likely matches</SectionTitle>
        {alternatives.map((match) => (
          <View key={match.name} style={styles.matchRow}>
            <Text style={styles.bodyText}>{match.name}</Text>
            <Text style={styles.score}>{match.score}%</Text>
          </View>
        ))}
      </Card>

      <Card>
        <SectionTitle>What to check next</SectionTitle>
        <Text style={styles.bodyText}>{analysis.nextCheck}</Text>
      </Card>

      <Card>
        <SectionTitle>Why this match</SectionTitle>
        <Text style={styles.bodyText}>{analysis.reasoning}</Text>
      </Card>

      <Card>
        <SectionTitle>Was this result useful?</SectionTitle>
        {resultFeedback ? (
          <Text style={styles.bodyText}>
            Thanks for the feedback. You marked this result as {resultFeedback.choice === 'useful' ? 'useful' : 'not useful'}.
          </Text>
        ) : (
          <View style={styles.feedbackButtons}>
            <Pressable
              accessibilityRole="button"
              onPress={() => handleResultFeedback('useful')}
              style={({ pressed }) => [styles.feedbackButton, pressed && styles.feedbackButtonPressed]}>
              <Text style={styles.feedbackButtonLabel}>Useful</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => handleResultFeedback('not_useful')}
              style={({ pressed }) => [styles.feedbackButton, pressed && styles.feedbackButtonPressed]}>
              <Text style={styles.feedbackButtonLabel}>Not useful</Text>
            </Pressable>
          </View>
        )}
      </Card>

      {isLowConfidence ? (
        <>
          <ActionButton label="Add Another Photo" onPress={handleAddAnotherPhoto} />
          <ActionButton label="Save Result" variant="secondary" onPress={handleSaveResult} />
          <ActionButton label="Retake" variant="secondary" onPress={handleRetake} />
        </>
      ) : (
        <>
          <ActionButton label="Save Result" onPress={handleSaveResult} />
          <ActionButton label="Retake" variant="secondary" onPress={handleRetake} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  thumbnailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  thumbnailMeta: {
    flex: 1,
    gap: 4,
  },
  metaTitle: {
    color: palette.slate,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  kicker: {
    color: palette.accentDark,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rockName: {
    color: palette.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  badge: {
    backgroundColor: '#f0dfcf',
    borderRadius: 999,
    color: palette.accentDark,
    fontSize: 14,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  category: {
    color: palette.slate,
    fontSize: 16,
    fontWeight: '600',
  },
  bodyText: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  matchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  score: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackButton: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  feedbackButtonPressed: {
    opacity: 0.86,
  },
  feedbackButtonLabel: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  lowConfidenceBanner: {
    backgroundColor: '#fff4e5',
    borderColor: '#f8d7a8',
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    padding: 12,
  },
  lowConfidenceTitle: {
    color: '#8b4a00',
    fontSize: 16,
    fontWeight: '800',
  },
});
