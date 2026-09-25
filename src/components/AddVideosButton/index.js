import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, radii, shadows, spacing, typography} from '../../theme';

export function AddVideosButton({
  onPress,
  loading = false,
  label = 'Add Videos',
  compact = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel="Add videos"
      accessibilityHint="Opens your device video library"
      style={({pressed}) => [
        compact ? styles.compact : styles.button,
        pressed && styles.pressed,
        loading && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.textOnDark} />
      ) : (
        <View style={styles.row}>
          {!compact ? <Text style={styles.plus}>+</Text> : null}
          <Text style={[styles.label, compact && styles.compactLabel]}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    minWidth: 180,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  compact: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  plus: {
    color: colors.textOnDark,
    fontSize: 22,
    fontWeight: '700',
    marginRight: 4,
  },
  label: {
    ...typography.button,
    color: colors.textOnDark,
  },
  compactLabel: {
    fontSize: 14,
  },
  pressed: {
    opacity: 0.9,
    transform: [{scale: 0.98}],
  },
  disabled: {
    opacity: 0.7,
  },
});
