import { Pressable, StyleSheet, Text } from 'react-native';

import { palette } from '@/constants/theme';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.selected]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selected: {
    backgroundColor: '#f0dfcf',
    borderColor: palette.accent,
  },
  label: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedLabel: {
    color: palette.accentDark,
  },
});
