import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Card, Screen } from '@/components/Layout';
import { DetailRow } from '@/components/Row';
import { palette } from '@/constants/theme';

export default function ReviewScreen() {
  const { source } = useLocalSearchParams<{ source?: string }>();

  return (
    <Screen
      title="Review Photo"
      subtitle={`This is a mock ${source === 'upload' ? 'upload' : 'camera'} review state so we can build the full flow before wiring native modules.`}>
      <Card>
        <View style={styles.preview}>
          <Text style={styles.previewText}>Rock preview</Text>
        </View>
        <DetailRow label="Sharpness" value="Good" />
        <DetailRow label="Lighting" value="Fair" />
        <DetailRow label="Framing" value="Good" />
        <Text style={styles.tip}>Tip: brighter light may improve accuracy.</Text>
      </Card>
      <Link href="/capture-tips" asChild>
        <ActionButton label="Retake" variant="secondary" onPress={() => undefined} />
      </Link>
      <Link href="/observations" asChild>
        <ActionButton label="Use Photo" onPress={() => undefined} />
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: {
    alignItems: 'center',
    backgroundColor: '#e7ddcf',
    borderRadius: 20,
    height: 220,
    justifyContent: 'center',
  },
  previewText: {
    color: palette.accentDark,
    fontSize: 18,
    fontWeight: '700',
  },
  tip: {
    color: palette.warning,
    fontSize: 14,
    lineHeight: 20,
  },
});
