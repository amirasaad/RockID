import { router } from 'expo-router';
import { startTransition, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PhotoThumbnail } from '@/components/PhotoThumbnail';
import { palette } from '@/constants/theme';
import { track } from '@/lib/analytics';
import { getConfiguredAnalyzerKind } from '@/lib/analyzer-kind';
import { analyzeIdentificationSessionWithConfiguredAnalyzerAsync } from '@/lib/configured-analysis';
import { useIdentificationSession } from '@/lib/identification-session-context';

export default function AnalyzingScreen() {
  const { session, setAnalysis } = useIdentificationSession();

  useEffect(() => {
    const analyzerKind = getConfiguredAnalyzerKind();
    track('analysis_started', { analyzerKind });

    const timer = setTimeout(() => {
      void analyzeIdentificationSessionWithConfiguredAnalyzerAsync(session)
        .then((analysis) => {
          if (__DEV__) {
            console.log('rockid.analysis_completed', { analyzerKind, mode: session?.analysisMode, ...analysis.diagnostics });
          }
          startTransition(() => {
            setAnalysis(analysis);
            track('analysis_completed', { analyzerKind, ...analysis.diagnostics });
            router.replace('/results');
          });
        })
        .catch((err) => {
          if (__DEV__) {
            console.warn('rockid.analysis_failed', {
              analyzerKind,
              mode: session?.analysisMode,
              message: err instanceof Error ? err.message : String(err),
            });
          }
          track('analysis_failed');
          router.replace('/results');
        });
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <PhotoThumbnail uri={session?.selectedPhoto?.uri} size={140} borderRadius={24} fallbackText="Sample" fallbackFontSize={22} />
      <ActivityIndicator color={palette.accent} size="large" />
      <Text style={styles.title}>Analyzing texture, grain size, and visible structure</Text>
      <Text style={styles.subtitle}>Results may include multiple likely matches when the evidence is mixed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: palette.background,
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
