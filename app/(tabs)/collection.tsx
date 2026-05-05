import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { Card, Screen, SectionTitle } from '@/components/Layout';
import { PhotoThumbnail } from '@/components/PhotoThumbnail';
import { palette } from '@/constants/theme';
import { track } from '@/lib/analytics';
import { type CollectionFilterChip, createCollectionViewModel } from '@/lib/collection-view-model';
import { useSavedFinds } from '@/lib/saved-finds-context';

/**
 * Renders the saved-find Collection screen with local search and chip filters.
 */
export default function CollectionScreen() {
  const router = useRouter();
  const { savedFinds } = useSavedFinds();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CollectionFilterChip>('All');
  const viewModel = useMemo(() => createCollectionViewModel(savedFinds, { query, filter }), [savedFinds, query, filter]);
  const lastTrackedRef = useRef<{ queryLength: number; filter: CollectionFilterChip } | null>(null);
  const isDefaultFilters = query.trim().length === 0 && filter === 'All';

  useEffect(() => {
    track('collection_viewed');
  }, []);

  useEffect(() => {
    const queryLength = query.trim().length;
    const shouldTrack = queryLength > 0 || filter !== 'All';
    if (!shouldTrack) {
      lastTrackedRef.current = null;
      return;
    }

    const previous = lastTrackedRef.current;
    if (previous && previous.queryLength === queryLength && previous.filter === filter) return;

    lastTrackedRef.current = { queryLength, filter };
    track('collection_search_used', { queryLength, filter });
  }, [query, filter]);

  return (
    <Screen title="Collection" subtitle="Saved samples, quick filters, and room to grow into sync later.">
      <SectionTitle>Filters</SectionTitle>
      <Card>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search saved finds"
            placeholderTextColor={palette.muted}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
          {query.trim().length > 0 ? (
            <Pressable accessibilityRole="button" onPress={() => setQuery('')} style={styles.actionButton}>
              <Text style={styles.actionLabel}>Clear</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.chips}>
          {(['All', 'Igneous', 'Sedimentary', 'Metamorphic', 'Low confidence'] as const).map((chip) => (
            <Chip key={chip} label={chip} selected={filter === chip} onPress={() => setFilter(chip)} />
          ))}
        </View>
        {!isDefaultFilters ? (
          <View style={styles.resetRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setQuery('');
                setFilter('All');
              }}
              style={styles.actionButton}
            >
              <Text style={styles.actionLabel}>Reset</Text>
            </Pressable>
          </View>
        ) : null}
      </Card>

      {viewModel.kind === 'empty' ? (
        <Card>
          <Text style={styles.emptyTitle}>{viewModel.title}</Text>
          <Text style={styles.meta}>{viewModel.message}</Text>
        </Card>
      ) : (
        viewModel.items.map((find) => (
          <Pressable
            key={find.id}
            accessibilityRole="button"
            onPress={() => {
              track('collection_item_opened');
              router.push(`/saved/${find.id}`);
            }}
          >
            <Card>
              <View style={styles.row}>
                <PhotoThumbnail uri={find.imageUri} size={72} borderRadius={18} fallbackText="No photo" fallbackFontSize={12} />
                <View style={styles.textCol}>
                  <Text style={styles.title}>{find.title}</Text>
                  <Text style={styles.meta}>{find.categoryLabel}</Text>
                  <Text style={styles.meta}>{find.savedAtLabel}</Text>
                  <Text style={styles.meta}>{find.confidenceLabel}</Text>
                </View>
              </View>
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  searchInput: {
    backgroundColor: palette.background,
    borderColor: palette.border,
    borderRadius: 16,
    borderWidth: 1,
    color: palette.ink,
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  resetRow: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionLabel: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  emptyTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  title: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: palette.muted,
    fontSize: 14,
  },
});
