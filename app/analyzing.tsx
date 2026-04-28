import { router } from 'expo-router';
import { startTransition, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

export default function AnalyzingScreen() {
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
        <Text style={styles.thumbnailText}>Sample</Text>
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
    width: 140,
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
