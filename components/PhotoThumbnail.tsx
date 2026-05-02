import { Image, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

type PhotoThumbnailProps = {
  uri?: string;
  size: number;
  borderRadius: number;
  fallbackText: string;
  fallbackFontSize: number;
};

export function PhotoThumbnail({
  uri,
  size,
  borderRadius,
  fallbackText,
  fallbackFontSize,
}: PhotoThumbnailProps) {
  const hasImage = typeof uri === 'string' && uri.length > 0;

  return (
    <View style={[styles.thumbnail, { height: size, width: size, borderRadius }]}>
      {hasImage ? (
        <Image source={{ uri }} style={styles.thumbnailImage} resizeMode="cover" />
      ) : (
        <Text style={[styles.thumbnailFallback, { fontSize: fallbackFontSize }]}>{fallbackText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    alignItems: 'center',
    backgroundColor: '#e7ddcf',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnailImage: {
    height: '100%',
    width: '100%',
  },
  thumbnailFallback: {
    color: palette.accentDark,
    fontWeight: '800',
  },
});

