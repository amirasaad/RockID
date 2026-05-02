import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Card, Screen, SectionTitle } from '@/components/Layout';
import { PhotoThumbnail } from '@/components/PhotoThumbnail';
import { DetailRow } from '@/components/Row';
import { palette } from '@/constants/theme';
import { createSavedFindDetailViewModel } from '@/lib/saved-find-detail-view-model';
import { useSavedFinds } from '@/lib/saved-finds-context';

export default function SavedFindScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { savedFinds } = useSavedFinds();
  const savedFind = savedFinds.find((find) => find.id === id);

  if (!savedFind) {
    return (
      <Screen title="Saved Find" subtitle="This saved find could not be loaded.">
        <Card>
          <Text style={styles.body}>The saved find may have been removed or hasn’t been created in this session.</Text>
        </Card>
      </Screen>
    );
  }

  const viewModel = createSavedFindDetailViewModel(savedFind);

  return (
    <Screen title="Saved Find" subtitle={`Entry: ${id}`}>
      <Card>
        <PhotoThumbnail
          uri={viewModel.preview.kind === 'image' ? viewModel.preview.imageUri : undefined}
          size={140}
          borderRadius={24}
          fallbackText={viewModel.preview.kind === 'missing-image' ? viewModel.preview.fallbackText : 'Photo'}
          fallbackFontSize={16}
        />
        <Text style={styles.title}>{viewModel.title}</Text>
        <Text style={styles.meta}>{viewModel.category}</Text>
        <Text style={styles.meta}>{viewModel.confidenceLabel}</Text>
      </Card>

      <Card>
        <SectionTitle>Notes</SectionTitle>
        <Text style={styles.body}>{viewModel.notes}</Text>
      </Card>

      <Card>
        <SectionTitle>Saved Metadata</SectionTitle>
        <DetailRow label="Date" value={viewModel.savedAtLabel} />
        <DetailRow label="Source" value="Local saved find" />
        <DetailRow label="Location" value="Planned next" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  meta: {
    color: palette.muted,
    fontSize: 15,
  },
  body: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
});
