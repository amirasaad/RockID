import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';

import { Card, Screen } from '@/components/Layout';
import { palette } from '@/constants/theme';
import { track } from '@/lib/analytics';
import { createLearnTopicsViewModel } from '@/lib/learn-view-model';
import { learnTopics } from '@/lib/mock-data';

export default function LearnScreen() {
  useEffect(() => {
    track('learn_tab_viewed');
  }, []);

  const viewModel = createLearnTopicsViewModel(learnTopics);

  return (
    <Screen title="Learn" subtitle="Short, approachable geology primers for beginners in the field.">
      {viewModel.items.map((topic) => (
        <Link href={topic.href as never} key={topic.slug} asChild>
          <Card>
            <Text style={styles.topic}>{topic.title}</Text>
            <Text style={styles.summary}>Tap to open a short field-friendly overview.</Text>
          </Card>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topic: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  summary: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
});
