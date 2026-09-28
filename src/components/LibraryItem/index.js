import React, {memo} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, radii, shadows, spacing, typography} from '../../theme';
import {getBundledThumbAsset} from '../../assets/videos';
import {formatDuration} from '../../utils/videoUtils';
import {Icon} from '../Icon';

function LibraryItemComponent({
  video,
  selected,
  selecting,
  onPress,
  onLongPress,
}) {
  const bundledThumb = getBundledThumbAsset(video.bundledAssetKey);
  const thumbSource = video.thumbnailUri
    ? {uri: video.thumbnailUri}
    : bundledThumb;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={280}
      accessibilityRole="button"
      accessibilityLabel={`Play ${video.title || 'video'}`}
      accessibilityHint="Long press to select"
      style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.thumbWrap}>
        {thumbSource ? (
          <Image source={thumbSource} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbFallback]}>
            <Icon name="film" size={28} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.durationChip}>
          <Text style={styles.duration}>{formatDuration(video.duration)}</Text>
        </View>
        {selecting ? (
          <View style={[styles.check, selected && styles.checkOn]}>
            {selected ? (
              <Icon name="check" size={14} color={colors.textOnDark} />
            ) : null}
          </View>
        ) : null}
        {video.isFavorite && !selecting ? (
          <View style={styles.fav}>
            <Icon name="heart" size={14} color={colors.favorite} />
          </View>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {video.title || 'Local video'}
      </Text>
    </Pressable>
  );
}

export const LibraryItem = memo(LibraryItemComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.xs,
    maxWidth: '33.33%',
  },
  pressed: {
    opacity: 0.88,
    transform: [{scale: 0.98}],
  },
  thumbWrap: {
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    aspectRatio: 9 / 14,
    ...shadows.card,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  durationChip: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: colors.overlayStrong,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  duration: {
    ...typography.small,
    color: colors.textOnDark,
  },
  title: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs,
    minHeight: 34,
  },
  check: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textOnDark,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  fav: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
