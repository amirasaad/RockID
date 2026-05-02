import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card, Screen, SectionTitle } from '@/components/Layout';
import { palette } from '@/constants/theme';
import { track } from '@/lib/analytics';

export default function LearnTopicScreen() {
  const { slug: rawSlug } = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  useEffect(() => {
    if (!slug) return;
    track('learn_topic_opened', { slug });
  }, [slug]);

  return (
    <Screen title="Learn" subtitle={slug ? `Topic: ${slug}` : 'Topic'}>
      <Card>
        <SectionTitle>Overview</SectionTitle>
        <Text style={styles.body}>
          This topic page is a placeholder for MVP learning content. It will be expanded with short, field-friendly guidance and
          common look-alikes.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
});
