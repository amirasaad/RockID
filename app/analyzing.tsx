import { router } from 'expo-router';
import { startTransition, useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import { useIdentificationSession } from '@/lib/identification-session-context';

export default function AnalyzingScreen() {
  const { session } = useIdentificationSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        router.replace('/results');
      });
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.thumbnail}>
        {session?.selectedPhoto?.uri ? (
          <Image source={{ uri: session.selectedPhoto.uri }} style={styles.thumbnailImage} resizeMode="cover" />
        ) : (
          <Text style={styles.thumbnailText}>Sample</Text>
        )}
      </View>
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
  thumbnail: {
    alignItems: 'center',
    backgroundColor: '#e7ddcf',
    borderRadius: 24,
    height: 140,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 140,
  },
  thumbnailImage: {
    height: '100%',
    width: '100%',
  },
  thumbnailText: {
    color: palette.accentDark,
    fontSize: 22,
    fontWeight: '800',
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
