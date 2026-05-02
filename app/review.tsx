import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Card, Screen } from '@/components/Layout';
import { DetailRow } from '@/components/Row';
import { palette } from '@/constants/theme';
import { useIdentificationSession } from '@/lib/identification-session-context';
import { evaluateImageQuality } from '@/lib/image-quality';

export default function ReviewScreen() {
  const { session, setSelectedPhoto } = useIdentificationSession();
  const { imageUri, source, width, height } = useLocalSearchParams<{
    imageUri?: string;
    source?: string;
    width?: string;
    height?: string;
  }>();

  React.useEffect(() => {
    if (session?.selectedPhoto) return;
    if (typeof imageUri !== 'string' || imageUri.length === 0) return;
    if (source !== 'upload' && source !== 'camera') return;
    setSelectedPhoto({
      source,
      uri: imageUri,
      width: width ? Number(width) : undefined,
      height: height ? Number(height) : undefined,
    });
  }, [height, imageUri, session?.selectedPhoto, setSelectedPhoto, source, width]);

  const selectedPhoto = session?.selectedPhoto;
  const hasSelectedImage = typeof selectedPhoto?.uri === 'string' && selectedPhoto.uri.length > 0;
  const sourceLabel = selectedPhoto?.source === 'upload' ? 'uploaded' : 'captured';
  const quality = evaluateImageQuality(selectedPhoto);

  return (
    <Screen
      title="Review Photo"
      subtitle={`Review the ${sourceLabel} rock photo before moving into observations and analysis.`}>
      <Card>
        <View style={styles.preview}>
          {hasSelectedImage ? (
            <Image source={{ uri: selectedPhoto?.uri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <Text style={styles.previewText}>Rock preview</Text>
          )}
        </View>
        <DetailRow label="Sharpness" value={quality.sharpness} />
        <DetailRow label="Lighting" value={quality.lighting} />
        <DetailRow label="Framing" value={quality.framing} />
        <Text style={styles.tip}>{quality.tip}</Text>
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
    overflow: 'hidden',
  },
  previewImage: {
    height: '100%',
    width: '100%',
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
