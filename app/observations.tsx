import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '@/components/Buttons';
import { Chip } from '@/components/Chip';
import { Card, Screen, SectionTitle } from '@/components/Layout';
import { palette, spacing } from '@/constants/theme';
import { track } from '@/lib/analytics';
import { useIdentificationSession } from '@/lib/identification-session-context';

const colorOptions = ['Light', 'Dark', 'Red', 'Green', 'Mixed'];
const grainOptions = ['Fine', 'Medium', 'Coarse'];
const featureOptions = ['Layered', 'Glassy', 'Vesicles', 'Banding', 'Visible Crystals'];

export default function ObservationsScreen() {
  const { setObservations } = useIdentificationSession();
  const [selectedColor, setSelectedColor] = useState<string>('Mixed');
  const [selectedGrain, setSelectedGrain] = useState<string>('Coarse');
  const [notes, setNotes] = useState('Coarse grains with light feldspar and darker minerals.');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Visible Crystals']);

  useEffect(() => {
    track('observations_viewed');
  }, []);

  function toggleFeature(feature: string) {
    setSelectedFeatures((current) =>
      current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]
    );
  }

  return (
    <Screen title="Add Details" subtitle="These inputs stay local for now, but they mirror the MVP data model from the spec.">
      <Card>
        <SectionTitle>Color</SectionTitle>
        <View style={styles.wrap}>
          {colorOptions.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={selectedColor === option}
              onPress={() => setSelectedColor(option)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle>Grain Size</SectionTitle>
        <View style={styles.wrap}>
          {grainOptions.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={selectedGrain === option}
              onPress={() => setSelectedGrain(option)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle>Features</SectionTitle>
        <View style={styles.wrap}>
          {featureOptions.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={selectedFeatures.includes(option)}
              onPress={() => toggleFeature(option)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle>Notes</SectionTitle>
        <TextInput
          multiline
          onChangeText={setNotes}
          placeholder="Optional field notes"
          placeholderTextColor={palette.muted}
          style={styles.input}
          value={notes}
        />
        <Text style={styles.helper}>Field notes, magnetism, and acid reaction can plug into the backend later.</Text>
      </Card>

      <Link
        href="/analyzing"
        asChild>
        <ActionButton
          label="Analyze Rock"
          onPress={() => {
            track('observations_submitted');
            setObservations({
              color: selectedColor,
              grainSize: selectedGrain,
              features: selectedFeatures,
              notes,
            });
          }}
        />
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: palette.border,
    borderRadius: 16,
    borderWidth: 1,
    color: palette.ink,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 120,
    padding: spacing.md,
    textAlignVertical: 'top',
  },
  helper: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});
