import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing, typography} from '../../theme';
import {Icon} from '../Icon';

function VideoControlsComponent({
  title,
  isFavorite,
  progress = 0,
  onFavorite,
  onMore,
  onRemoveUnavailable,
  unavailable,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, {paddingBottom: Math.max(insets.bottom, 12) + 64}]}>
      <View style={styles.rightRail}>
        <Pressable
          onPress={onFavorite}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Unfavorite video' : 'Favorite video'}
          style={styles.action}>
          <Icon
            name={isFavorite ? 'heart' : 'heartOutline'}
            size={28}
            color={isFavorite ? colors.favorite : colors.textOnDark}
          />
        </Pressable>
        <Pressable
          onPress={onMore}
          accessibilityRole="button"
          accessibilityLabel="More options"
          style={styles.action}>
          <Icon name="more" size={28} color={colors.textOnDark} />
        </Pressable>
        {unavailable ? (
          <Pressable
            onPress={onRemoveUnavailable}
            accessibilityRole="button"
            accessibilityLabel="Remove from library"
            style={[styles.action, styles.removeChip]}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.bottomMeta}>
        <Text style={styles.title} numberOfLines={2}>
          {title || 'Local video'}
        </Text>
        <Text style={styles.subtitle}>Local video</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${Math.min(100, progress * 100)}%`}]} />
        </View>
      </View>
    </View>
  );
}

export const VideoControls = memo(VideoControlsComponent);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  rightRail: {
    position: 'absolute',
    right: spacing.md,
    bottom: 160,
    alignItems: 'center',
    gap: spacing.md,
  },
  action: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeChip: {
    width: 'auto',
    paddingHorizontal: 14,
    backgroundColor: colors.danger,
  },
  removeText: {
    color: colors.textOnDark,
    fontWeight: '700',
    fontSize: 13,
  },
  bottomMeta: {
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.subtitle,
    color: colors.textOnDark,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    marginBottom: spacing.sm,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.progressTrack,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.progressFill,
  },
});
