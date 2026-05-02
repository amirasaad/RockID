import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Card, Screen, SectionTitle } from '@/components/Layout';
import { PhotoThumbnail } from '@/components/PhotoThumbnail';
import { palette } from '@/constants/theme';
import { useIdentificationSession } from '@/lib/identification-session-context';
import { analyzeIdentificationSession } from '@/lib/mock-analysis';

export default function ResultsScreen() {
  const { session } = useIdentificationSession();
  const analysis = analyzeIdentificationSession(session);
  const { topMatch, matches } = analysis;
  const alternatives = matches.slice(1);

  return (
    <Screen title="Results" subtitle="This is mocked data, but the screen structure follows the MVP output contract from the spec.">
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
        <SectionTitle>Why this match</SectionTitle>
        <Text style={styles.bodyText}>
          {analysis.reasoning}
        </Text>
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
        <SectionTitle>Check next</SectionTitle>
        <Text style={styles.bodyText}>{analysis.nextCheck}</Text>
      </Card>

      <Link href="/saved/granite-trail" asChild>
        <ActionButton label="Save Result" onPress={() => undefined} />
      </Link>
      <Link href="/capture-tips" asChild>
        <ActionButton label="Retake" variant="secondary" onPress={() => undefined} />
      </Link>
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
});
