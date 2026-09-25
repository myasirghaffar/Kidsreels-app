import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing, typography} from '../../theme';
import {Icon} from '../Icon';

const TAB_BAR_CONTENT = 68;

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
  const bottomPad = Math.max(insets.bottom, 8) + TAB_BAR_CONTENT + 28;
  const topPad = Math.max(insets.top, 12);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, {paddingBottom: bottomPad, paddingTop: topPad}]}>
      <View
        style={[styles.rightRail, {bottom: bottomPad + 72}]}
        pointerEvents="box-none">
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
            style={[styles.actionCaption, isFavorite && styles.actionCaptionOn]}>
            {isFavorite ? 'Saved' : 'Fav'}
          </Text>
        </Pressable>
        <Pressable
          onPress={onMore}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="More options"
          style={({pressed}) => [styles.action, pressed && styles.actionPressed]}>
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

      <View style={styles.bottomMeta} pointerEvents="none">
        <Text style={styles.title} numberOfLines={2}>
          {title || 'Local video'}
        </Text>
        <Text style={styles.subtitle}>Local video</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {width: `${Math.min(100, progress * 100)}%`},
            ]}
          />
        </View>
        <Text style={styles.credit} numberOfLines={1}>
          Orhan Zain App by Yasir
        </Text>
      </View>
    </View>
  );
}

export const VideoControls = memo(VideoControlsComponent);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 20,
    elevation: 20,
  },
  rightRail: {
    position: 'absolute',
    right: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
    zIndex: 30,
    elevation: 30,
  },
  action: {
    minWidth: 56,
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  actionFavorite: {
    backgroundColor: 'rgba(255,90,122,0.22)',
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
  bottomMeta: {
    paddingHorizontal: spacing.lg,
    maxWidth: '78%',
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
