import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { Link, router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Card, Screen, SectionTitle } from '@/components/Layout';
import { palette, spacing } from '@/constants/theme';
import { recentFinds } from '@/lib/mock-data';
import { selectRockPhotoFromLibrary } from '@/lib/photo-input';

export default function IdentifyScreen() {
  async function handleUploadPhoto() {
    const result = await selectRockPhotoFromLibrary({
      requestMediaLibraryPermission: ImagePicker.requestMediaLibraryPermissionsAsync,
      launchImageLibrary: async (options) => {
        const selection = await ImagePicker.launchImageLibraryAsync(options);
        return {
          canceled: selection.canceled,
          assets: selection.assets ?? undefined,
        };
      },
    });

    if (result.kind === 'permission-denied') {
      Alert.alert('Photo access needed', 'Allow photo library access to upload a rock image.');
      return;
    }

    if (result.kind === 'cancelled') {
      return;
    }

    router.push({
      pathname: '/review',
      params: {
        source: result.source,
        imageUri: result.uri,
        width: result.width?.toString(),
        height: result.height?.toString(),
      },
    });
  }

  return (
    <Screen
      title="Rock ID"
      subtitle="Capture a rock, narrow the likely matches, and keep the geology honest about uncertainty.">
      <Card>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.kicker}>Field-ready MVP</Text>
            <Text style={styles.heroTitle}>Start a new identification</Text>
          </View>
          <FontAwesome name="diamond" size={28} color={palette.accent} />
        </View>
        <Link href="/capture-tips" asChild>
          <ActionButton label="Take Photo" onPress={() => undefined} />
        </Link>
        <ActionButton label="Upload Photo" variant="secondary" onPress={handleUploadPhoto} />
      </Card>

      <Card>
        <SectionTitle>How to photograph a rock</SectionTitle>
        <Text style={styles.bodyText}>
          Use bright light, fill most of the frame, include one close-up, and show a fresh surface when you can.
        </Text>
      </Card>

      <SectionTitle>Recent Finds</SectionTitle>
      {recentFinds.map((find) => (
        <Link href={`/saved/${find.id}`} key={find.id} asChild>
          <Card>
            <Text style={styles.findTitle}>{find.title}</Text>
            <Text style={styles.meta}>{find.date}</Text>
            <Text style={styles.confidence}>{find.confidence} confidence</Text>
          </Card>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kicker: {
    color: palette.accentDark,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  bodyText: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  findTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: palette.muted,
    fontSize: 14,
  },
  confidence: {
    color: palette.success,
    fontSize: 14,
    fontWeight: '700',
  },
});
