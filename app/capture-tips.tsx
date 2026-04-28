import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Card, Screen } from '@/components/Layout';
import { palette } from '@/constants/theme';

const tips = [
  'Use bright, even light',
  'Fill most of the frame',
  'Show texture clearly',
  'Add scale if possible',
];

export default function CaptureTipsScreen() {
  return (
    <Screen
      title="Before You Snap"
      subtitle="We have not wired the live camera yet, so this prototype flows into a review screen with a mock sample.">
      <Card>
        {tips.map((tip, index) => (
          <View key={tip} style={styles.row}>
            <Text style={styles.index}>{index + 1}</Text>
            <Text style={styles.tip}>{tip}</Text>
          </View>
        ))}
      </Card>
      <Link href="/review?source=camera" asChild>
        <ActionButton label="Use Demo Capture" onPress={() => undefined} />
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  index: {
    color: palette.accentDark,
    fontSize: 20,
    fontWeight: '800',
    width: 24,
  },
  tip: {
    color: palette.ink,
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
});
