import React, {memo, useCallback, useState} from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Video from 'react-native-video';
import {colors} from '../../theme';
import {VideoControls} from '../VideoControls';
import {VideoOverlay} from '../VideoOverlay';

function VideoCardComponent({
  video,
  height,
  isActive,
  shouldMountPlayer,
  autoplay,
  muted,
  pausedByUser,
  showPlayHint,
  onTogglePlayPause,
  onFavorite,
  onRemove,
}) {
  const [buffering, setBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const paused = !isActive || !autoplay || pausedByUser || unavailable;

  const onProgress = useCallback(data => {
    if (data?.seekableDuration > 0) {
      setProgress(data.currentTime / data.seekableDuration);
    } else if (data?.playableDuration > 0) {
      setProgress(data.currentTime / data.playableDuration);
    }
  }, []);

  const onError = useCallback(error => {
    setUnavailable(true);
    setErrorMessage(
      error?.error?.errorString ||
        error?.error?.localizedDescription ||
        'This video cannot be played.',
    );
  }, []);

  const openMore = useCallback(() => {
    const options = ['Remove from library', 'Cancel'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
          title: video.title || 'Video options',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            onRemove?.(video.id);
          }
        },
      );
      return;
    }

    Alert.alert(video.title || 'Video options', undefined, [
      {
        text: 'Remove from library',
        style: 'destructive',
        onPress: () => onRemove?.(video.id),
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  }, [onRemove, video.id, video.title]);

  return (
    <View style={[styles.container, {height}]}>
      {shouldMountPlayer && !unavailable ? (
        <Video
          source={{uri: video.uri}}
          style={styles.video}
          resizeMode="cover"
          paused={paused}
          repeat
          muted={muted}
          ignoreSilentSwitch="ignore"
          playInBackground={false}
          playWhenInactive={false}
          onProgress={onProgress}
          onBuffer={({isBuffering}) => setBuffering(Boolean(isBuffering))}
          onError={onError}
          progressUpdateInterval={250}
          poster={video.thumbnailUri || undefined}
          posterResizeMode="cover"
        />
      ) : (
        <View style={styles.fallback}>
          {video.thumbnailUri ? (
            <Image source={{uri: video.thumbnailUri}} style={styles.video} />
          ) : (
            <View style={[styles.video, styles.placeholder]} />
          )}
        </View>
      )}

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onTogglePlayPause}
        accessibilityRole="button"
        accessibilityLabel={pausedByUser ? 'Play video' : 'Pause video'}
      />

      <VideoOverlay
        visible={isActive && showPlayHint}
        paused={pausedByUser}
        unavailable={unavailable}
        buffering={isActive && buffering}
        errorMessage={errorMessage}
      />

      <VideoControls
        title={video.title}
        isFavorite={video.isFavorite}
        progress={progress}
        unavailable={unavailable}
        onFavorite={() => onFavorite?.(video.id)}
        onMore={openMore}
        onRemoveUnavailable={() => onRemove?.(video.id)}
      />
    </View>
  );
}

function areEqual(prev, next) {
  return (
    prev.video.id === next.video.id &&
    prev.video.uri === next.video.uri &&
    prev.video.isFavorite === next.video.isFavorite &&
    prev.video.title === next.video.title &&
    prev.video.thumbnailUri === next.video.thumbnailUri &&
    prev.height === next.height &&
    prev.isActive === next.isActive &&
    prev.shouldMountPlayer === next.shouldMountPlayer &&
    prev.autoplay === next.autoplay &&
    prev.muted === next.muted &&
    prev.pausedByUser === next.pausedByUser &&
    prev.showPlayHint === next.showPlayHint
  );
}

export const VideoCard = memo(VideoCardComponent, areEqual);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  placeholder: {
    backgroundColor: colors.backgroundElevated,
  },
});
