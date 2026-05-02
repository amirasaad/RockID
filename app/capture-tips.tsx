import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Card, Screen, SectionTitle } from '@/components/Layout';
import { palette } from '@/constants/theme';
import { track } from '@/lib/analytics';
import { useIdentificationSession } from '@/lib/identification-session-context';
import { selectRockPhotoFromCamera } from '@/lib/photo-input';

const tips = [
  'Use bright, even light',
  'Fill most of the frame',
  'Show texture clearly',
  'Add scale if possible',
];

export default function CaptureTipsScreen() {
  const { startSession } = useIdentificationSession();

  React.useEffect(() => {
    track('capture_tips_viewed');
  }, []);

  async function handleOpenCamera() {
    track('capture_tips_open_camera');

    const result = await selectRockPhotoFromCamera({
      requestCameraPermission: ImagePicker.requestCameraPermissionsAsync,
      launchCamera: async (options) => {
        const selection = await ImagePicker.launchCameraAsync(options);
        return {
          canceled: selection.canceled,
          assets: selection.assets ?? undefined,
        };
      },
    });

    if (result.kind === 'permission-denied') {
      Alert.alert('Camera access needed', 'Allow camera access to capture a rock photo.');
      return;
    }

    if (result.kind === 'cancelled') {
      return;
    }

    const session = startSession({
      source: result.source,
      uri: result.uri,
      width: result.width,
      height: result.height,
    });

    router.push({
      pathname: '/review',
      params: {
        sessionId: session.id,
      },
    });
  }

  return (
    <Screen
      title="Before You Snap"
      subtitle="A sharp, well-lit photo produces clearer matches and higher confidence. Next, you’ll review photo quality before analysis.">
      <Card>
        {tips.map((tip, index) => (
          <View key={tip} style={styles.row}>
            <Text style={styles.index}>{index + 1}</Text>
            <Text style={styles.tip}>{tip}</Text>
          </View>
        ))}
      </Card>
      <Card>
        <SectionTitle>Why this matters</SectionTitle>
        <Text style={styles.bodyText}>
          Strong input makes the model’s job easier—so you’re more likely to get a clear result you can trust and act on.
        </Text>
        <SectionTitle>What happens next</SectionTitle>
        <Text style={styles.bodyText}>
          After you take the photo, the review step checks sharpness, lighting, and framing. If anything looks off, you can retake
          before running the analysis.
        </Text>
      </Card>
      <ActionButton label="Open Camera" onPress={handleOpenCamera} />
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
  bodyText: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
});
