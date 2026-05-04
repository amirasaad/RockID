import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
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

  const [query, setQuery] = useState('');
  const lastTrackedQueryRef = useRef<string>('');

  const viewModel = useMemo(() => createLearnTopicsViewModel(learnTopics), []);
  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return viewModel.items;
    return viewModel.items.filter((item) => item.title.toLowerCase().includes(trimmed));
  }, [query, viewModel.items]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (lastTrackedQueryRef.current === trimmed) return;
    track('learn_search_used', { queryLength: trimmed.length });
    lastTrackedQueryRef.current = trimmed;
  }, [query]);

  return (
    <Screen title="Learn" subtitle="Short, approachable geology primers for beginners in the field.">
      <Card>
        <Text style={styles.searchLabel}>Search</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search topics"
          placeholderTextColor={palette.slate}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <Text style={styles.topic}>No topics found</Text>
          <Text style={styles.summary}>Try a different keyword.</Text>
        </Card>
      ) : null}

      {filtered.map((topic) => (
        <Link href={topic.href as never} key={topic.slug} asChild>
          <Card>
            <View style={styles.row}>
              <Text style={styles.topic}>{topic.title}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
            <Text style={styles.summary}>Tap to open a short field-friendly overview.</Text>
          </Card>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchLabel: {
    color: palette.slate,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  searchInput: {
    borderColor: palette.border,
    borderRadius: 14,
    borderWidth: 1,
    color: palette.ink,
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  topic: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  chevron: {
    color: palette.slate,
    fontSize: 22,
    fontWeight: '700',
  },
  summary: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
});
