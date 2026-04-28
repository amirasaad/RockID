import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Card, Screen, SectionTitle } from '@/components/Layout';
import { DetailRow } from '@/components/Row';
import { palette } from '@/constants/theme';

export default function SavedFindScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen title="Saved Find" subtitle={`Entry: ${id}`}>
      <Card>
        <Text style={styles.title}>Granite near trail</Text>
        <Text style={styles.meta}>Igneous intrusive</Text>
        <Text style={styles.meta}>Confidence: Medium</Text>
      </Card>

      <Card>
        <SectionTitle>Notes</SectionTitle>
        <Text style={styles.body}>
          Found near a dry stream bed. Coarse grains and clear feldspar crystals on a fresh-looking surface.
        </Text>
      </Card>

      <Card>
        <SectionTitle>Saved Metadata</SectionTitle>
        <DetailRow label="Date" value="Apr 28, 2026" />
        <DetailRow label="Source" value="Prototype mock" />
        <DetailRow label="Location" value="Planned next" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  meta: {
    color: palette.muted,
    fontSize: 15,
  },
  body: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
});
