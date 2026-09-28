import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, spacing, typography} from '../../theme';
import {Icon} from '../Icon';

/**
 * TikTok-style overlay pinned to the bottom of the current page.
 * Uses an explicit height so Android Fabric does not collapse absoluteFill to 0.
 */
function VideoControlsComponent({
  height,
  title,
  isFavorite,
  progress = 0,
  onFavorite,
  onMore,
  onRemoveUnavailable,
  unavailable,
}) {
  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, {height: height || '100%'}]}>
      <View style={styles.spacer} pointerEvents="none" />

      <View style={styles.bottomRow} pointerEvents="box-none">
        <View style={styles.bottomMeta} pointerEvents="none">
          <Text style={styles.title} numberOfLines={2}>
            {title || 'Local video'}
          </Text>
          <Text style={styles.subtitle}>Local video</Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {width: `${Math.min(100, Math.max(0, progress * 100))}%`},
              ]}
            />
          </View>
          <Text style={styles.credit} numberOfLines={1}>
            Orhan Zain App by Yasir
          </Text>
        </View>

        <View style={styles.rightRail} pointerEvents="box-none">
          <Pressable
            onPress={onFavorite}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
            accessibilityHint="Saves this video to your Favorites tab"
            style={({pressed}) => [
              styles.action,
              isFavorite && styles.actionFavorite,
              pressed && styles.actionPressed,
            ]}>
            <Icon
              name={isFavorite ? 'heart' : 'heartOutline'}
              size={30}
              color={isFavorite ? colors.favorite : colors.textOnDark}
            />
            <Text
              style={[
                styles.actionCaption,
                isFavorite && styles.actionCaptionOn,
              ]}>
              {isFavorite ? 'Saved' : 'Fav'}
            </Text>
          </Pressable>
          <Pressable
            onPress={onMore}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="More options"
            style={({pressed}) => [
              styles.action,
              pressed && styles.actionPressed,
            ]}>
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
      </View>
    </View>
  );
}

export const VideoControls = memo(VideoControlsComponent);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 20,
    justifyContent: 'flex-end',
  },
  spacer: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  bottomMeta: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  rightRail: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  action: {
    minWidth: 56,
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  actionFavorite: {
    backgroundColor: 'rgba(255,90,122,0.35)',
  },
  actionPressed: {
    transform: [{scale: 0.92}],
    opacity: 0.9,
  },
  actionCaption: {
    ...typography.small,
    color: colors.textOnDarkMuted,
    marginTop: 2,
    fontWeight: '700',
  },
  actionCaptionOn: {
    color: colors.favorite,
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
  title: {
    ...typography.subtitle,
    color: colors.textOnDark,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
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
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.progressFill,
  },
  credit: {
    ...typography.caption,
    color: colors.textOnDark,
    fontWeight: '700',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
});
