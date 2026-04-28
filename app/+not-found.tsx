import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Card, Screen } from '@/components/Layout';
import { palette } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <Screen title="That sample slipped away" subtitle="This route does not exist in the prototype yet.">
      <Card>
        <Text style={styles.text}>
          The good news is the main MVP flow is in place, so you can head back to the Identify tab and keep moving.
        </Text>
      </Card>
      <Link href="/" asChild>
        <ActionButton label="Go Home" onPress={() => undefined} />
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: {
    color: palette.muted,
    fontSize: 16,
    lineHeight: 23,
  },
});
