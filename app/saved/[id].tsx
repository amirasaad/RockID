import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Card, Screen, SectionTitle } from '@/components/Layout';
import { PhotoThumbnail } from '@/components/PhotoThumbnail';
import { DetailRow } from '@/components/Row';
import { palette } from '@/constants/theme';
import { track } from '@/lib/analytics';
import { useIdentificationSession } from '@/lib/identification-session-context';
import { createSavedFindDetailViewModel } from '@/lib/saved-find-detail-view-model';
import { useSavedFinds } from '@/lib/saved-finds-context';

export default function SavedFindScreen() {
  const { id: rawId } = useLocalSearchParams<{ id?: string | string[] }>();
  const { savedFinds, deleteFind } = useSavedFinds();
  const { resetSession } = useIdentificationSession();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const savedFind = savedFinds.find((find) => find.id === id);
  const [wasDeleted, setWasDeleted] = useState(false);

  useEffect(() => {
    if (!id || !savedFind) return;
    track('saved_find_viewed', { id });
  }, [id, savedFind]);

  if (wasDeleted) {
    return (
      <Screen title="Saved Find" subtitle="Deleted">
        <Card>
          <Text style={styles.body}>This saved find was deleted.</Text>
        </Card>
        <Card>
          <SectionTitle>Next</SectionTitle>
          <ActionButton label="Back to Collection" variant="secondary" onPress={() => router.replace('/collection')} />
          <ActionButton label="Identify Another" variant="secondary" onPress={() => router.replace('/')} />
        </Card>
      </Screen>
    );
  }

  if (!id || !savedFind) {
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

      <Card>
        <SectionTitle>Actions</SectionTitle>
        <ActionButton
          label="Re-analyze"
          onPress={() => {
            if (!savedFind.imageUri) {
              Alert.alert('Photo missing', 'This saved find has no photo to analyze.');
              return;
            }
            track('saved_find_reanalyze_tapped', { id });
            resetSession();
            router.replace({
              pathname: '/review',
              params: { imageUri: savedFind.imageUri, source: 'upload' },
            });
          }}
        />
        <ActionButton label="Back to Collection" variant="secondary" onPress={() => router.replace('/collection')} />
        <ActionButton label="Identify Another" variant="secondary" onPress={() => router.replace('/')} />
        <ActionButton
          label="Delete Saved Find"
          variant="secondary"
          onPress={() => {
            Alert.alert('Delete saved find?', 'This cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  track('saved_find_deleted', { id });
                  deleteFind(id);
                  setWasDeleted(true);
                },
              },
            ]);
          }}
        />
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
