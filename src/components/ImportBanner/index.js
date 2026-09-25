import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radii, spacing, typography} from '../../theme';

export function ImportBanner({message}) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.banner} pointerEvents="none">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 56,
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
