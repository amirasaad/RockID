import { StyleSheet, Switch, Text, View } from 'react-native';

import { Card, Screen } from '@/components/Layout';
import { DetailRow } from '@/components/Row';
import { palette } from '@/constants/theme';
import { useAppSettings } from '@/lib/app-settings-context';

export default function SettingsScreen() {
  const { settings, setSavePhotosLocally } = useAppSettings();

  return (
    <Screen title="Settings" subtitle="Preferences and storage controls for your device.">
      <Card>
        <DetailRow label="Camera Access" value="Not requested" />
        <DetailRow label="Location Access" value="Ask when saving" />
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleLabel}>Save Photos Locally</Text>
            <Text style={styles.toggleHint}>Keeps saved finds usable offline. Uses device storage.</Text>
          </View>
          <Switch value={settings.savePhotosLocally} onValueChange={setSavePhotosLocally} />
        </View>
        <DetailRow label="Privacy & Data" value="Next milestone" />
      </Card>
      <Card>
        <Text style={styles.version}>Prototype settings</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
  },
  toggleText: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  toggleHint: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  version: {
    color: palette.muted,
  },
});
