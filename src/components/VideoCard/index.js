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
import Video, {ViewType} from 'react-native-video';
import {getBundledThumbAsset, getBundledVideoAsset} from '../../assets/videos';
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
  const [ready, setReady] = useState(false);
  const bundledSource = getBundledVideoAsset(video.bundledAssetKey);
  const frameStyle = {width: '100%', height};

  React.useEffect(() => {
    setReady(false);
    setUnavailable(false);
    setErrorMessage('');
    setProgress(0);
  }, [video.id, video.uri]);

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
    <View style={[styles.container, frameStyle]} collapsable={false}>
      {/* Explicit width/height — absoluteFill collapses to 0 on Android Fabric. */}
      {shouldMountPlayer && !unavailable ? (
        <Video
          key={`player-${video.id}`}
          source={bundledSource || {uri: video.uri}}
          style={frameStyle}
          resizeMode="cover"
          paused={paused}
          repeat
          muted={muted}
          ignoreSilentSwitch="ignore"
          playInBackground={false}
          playWhenInactive={false}
          useTextureView={Platform.OS === 'android'}
          viewType={Platform.OS === 'android' ? ViewType.TEXTURE : undefined}
          shutterColor="transparent"
          disableFocus
          controls={false}
          onReadyForDisplay={() => setReady(true)}
          onProgress={onProgress}
          onBuffer={({isBuffering}) => setBuffering(Boolean(isBuffering))}
          onError={onError}
          progressUpdateInterval={250}
        />
      ) : null}

      {(!shouldMountPlayer || !ready || unavailable) &&
      (video.thumbnailUri || getBundledThumbAsset(video.bundledAssetKey)) ? (
        <Image
          source={
            video.thumbnailUri
              ? {uri: video.thumbnailUri}
              : getBundledThumbAsset(video.bundledAssetKey)
          }
          style={[styles.layer, frameStyle]}
          resizeMode="cover"
          pointerEvents="none"
        />
      ) : null}

      {!shouldMountPlayer &&
      !video.thumbnailUri &&
      !getBundledThumbAsset(video.bundledAssetKey) ? (
        <View style={[frameStyle, styles.placeholder]} />
      ) : null}

      <Pressable
        style={[styles.tapLayer, {height}]}
        onPress={onTogglePlayPause}
        accessibilityRole="button"
        accessibilityLabel={pausedByUser ? 'Play video' : 'Pause video'}
      />

      <VideoOverlay
        visible={isActive && (showPlayHint || pausedByUser)}
        paused={pausedByUser}
        unavailable={unavailable}
        buffering={isActive && buffering && !ready}
        errorMessage={errorMessage}
        height={height}
      />

      <VideoControls
        height={height}
        title={video.title}
        isFavorite={Boolean(video.isFavorite)}
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
    prev.video.bundledAssetKey === next.video.bundledAssetKey &&
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
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  tapLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 72,
    zIndex: 5,
    elevation: 5,
  },
  placeholder: {
    backgroundColor: colors.backgroundElevated,
  },
});
