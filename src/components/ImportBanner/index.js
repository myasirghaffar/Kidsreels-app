import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, radii, spacing, typography} from '../../theme';

export function ImportBanner({message}) {
  const insets = useSafeAreaInsets();

  if (!message) {
    return null;
  }

  return (
    <View
      style={[styles.banner, {top: Math.max(insets.top, 12) + 8}]}
      pointerEvents="none">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 50,
    backgroundColor: colors.overlayStrong,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  text: {
    ...typography.caption,
    color: colors.textOnDark,
    fontWeight: '700',
  },
});
