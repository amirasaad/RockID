import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card, Screen } from '@/components/Layout';
import { palette } from '@/constants/theme';
import { track } from '@/lib/analytics';
import { learnTopics } from '@/lib/mock-data';

export default function LearnScreen() {
  useEffect(() => {
    track('learn_tab_viewed');
  }, []);

  return (
    <Screen title="Learn" subtitle="Short, approachable geology primers for beginners in the field.">
      {learnTopics.map((topic) => (
        <Card key={topic}>
          <Text style={styles.topic}>{topic}</Text>
          <Text style={styles.summary}>
            This topic is ready for deeper content once we wire the educational detail pages.
          </Text>
        </Card>
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
