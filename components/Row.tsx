import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

type RowProps = {
  label: string;
  value: string;
};

export function DetailRow({ label, value }: RowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    color: palette.muted,
    flex: 1,
    fontSize: 15,
  },
  value: {
    color: palette.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
  },
});
