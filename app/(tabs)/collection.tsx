import { Link } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { Card, Screen, SectionTitle } from '@/components/Layout';
import { PhotoThumbnail } from '@/components/PhotoThumbnail';
import { palette } from '@/constants/theme';
import { track } from '@/lib/analytics';
import { createCollectionViewModel } from '@/lib/collection-view-model';
import { useSavedFinds } from '@/lib/saved-finds-context';

export default function CollectionScreen() {
  const { savedFinds } = useSavedFinds();
  const viewModel = createCollectionViewModel(savedFinds);

  useEffect(() => {
    track('collection_viewed');
  }, []);

  return (
    <Screen title="Collection" subtitle="Saved samples, quick filters, and room to grow into sync later.">
      <SectionTitle>Filters</SectionTitle>
      <Card>
        <Text style={styles.search}>Search saved finds</Text>
        <Card>
          <Chip label="All" selected />
          <Chip label="Igneous" />
          <Chip label="Sedimentary" />
          <Chip label="Metamorphic" />
        </Card>
      </Card>

      {viewModel.kind === 'empty' ? (
        <Card>
          <Text style={styles.emptyTitle}>{viewModel.title}</Text>
          <Text style={styles.meta}>{viewModel.message}</Text>
        </Card>
      ) : (
        viewModel.items.map((find) => (
          <Link href={`/saved/${find.id}`} key={find.id} asChild>
            <Card>
              <View style={styles.row}>
                <PhotoThumbnail uri={find.imageUri} size={72} borderRadius={18} fallbackText="No photo" fallbackFontSize={12} />
                <View style={styles.textCol}>
                  <Text style={styles.title}>{find.title}</Text>
                  <Text style={styles.meta}>{find.savedAtLabel}</Text>
                  <Text style={styles.meta}>{find.confidenceLabel}</Text>
                </View>
              </View>
            </Card>
          </Link>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    color: palette.muted,
    fontSize: 15,
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
