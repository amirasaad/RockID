import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Card, Screen, SectionTitle } from '@/components/Layout';
import { palette } from '@/constants/theme';
import { topMatches } from '@/lib/mock-data';

export default function ResultsScreen() {
  const [topMatch, ...alternatives] = topMatches;

  return (
    <Screen title="Results" subtitle="This is mocked data, but the screen structure follows the MVP output contract from the spec.">
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
          Coarse interlocking grains, visible feldspar and quartz, and a massive texture all point toward granite.
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
        <Text style={styles.bodyText}>Look for foliation or mineral banding to rule out granitic gneiss.</Text>
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
