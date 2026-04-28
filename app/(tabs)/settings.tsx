import { Text } from 'react-native';

import { Card, Screen } from '@/components/Layout';
import { DetailRow } from '@/components/Row';

export default function SettingsScreen() {
  return (
    <Screen title="Settings" subtitle="Permissions and storage are still mocked, but the information architecture is in place.">
      <Card>
        <DetailRow label="Camera Access" value="Not requested" />
        <DetailRow label="Location Access" value="Ask when saving" />
        <DetailRow label="Save Photos Locally" value="Planned" />
        <DetailRow label="Privacy & Data" value="Next milestone" />
      </Card>
      <Card>
        <Text>Version 0.1.0 prototype</Text>
      </Card>
    </Screen>
  );
}
