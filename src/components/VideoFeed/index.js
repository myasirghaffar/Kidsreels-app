import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useVideoPlayback} from '../../hooks/useVideoPlayback';
import {VideoCard} from '../VideoCard';

const WRAP_KEY = '__kidsreels_wrap__';

export function VideoFeed({
  videos,
  initialIndex = 0,
  autoplay = true,
  muted = false,
  onFavorite,
  onRemove,
}) {
  const listRef = useRef(null);
  // Must match the FlatList viewport (area above tab bar), NOT window height —
  // otherwise bottom TikTok controls render off-screen and the player layout breaks.
  const [pageHeight, setPageHeight] = useState(0);
  const {
    activeIndex,
    setActive,
    pausedByUser,
    showPlayHint,
    togglePlayPause,
  } = useVideoPlayback(initialIndex);

  const data = useMemo(() => {
    if (!videos.length) {
      return [];
    }
    return [...videos, {id: WRAP_KEY, __wrap: true}];
  }, [videos]);

  const topVideoId = videos[0]?.id;

  useEffect(() => {
    if (!videos.length || pageHeight <= 0) {
      return;
    }
    const clamped = Math.min(Math.max(initialIndex, 0), videos.length - 1);
    setActive(clamped);
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({index: clamped, animated: false});
    });
  }, [initialIndex, pageHeight, setActive, videos.length, topVideoId]);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (!viewableItems?.length) {
      return;
    }
    // Prefer the most visible non-wrap item so the player mounts on-screen.
    const visible = viewableItems
      .filter(item => item.isViewable && !item.item?.__wrap)
      .sort(
        (a, b) =>
          (b.percentVisible || 0) - (a.percentVisible || 0) ||
          (a.index ?? 0) - (b.index ?? 0),
      );
    const top = visible[0];
    if (!top) {
      const wrap = viewableItems.find(item => item.isViewable && item.item?.__wrap);
      if (wrap) {
        listRef.current?.scrollToIndex({index: 0, animated: false});
        setActive(0);
      }
      return;
    }
    if (typeof top.index === 'number') {
      setActive(top.index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
    waitForInteraction: false,
  }).current;

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: pageHeight,
      offset: pageHeight * index,
      index,
    }),
    [pageHeight],
  );

  const onLayout = useCallback(event => {
    const next = Math.round(event.nativeEvent.layout.height);
    if (next > 0) {
      setPageHeight(prev => (prev === next ? prev : next));
    }
  }, []);

  const renderItem = useCallback(
    ({item, index}) => {
      if (item.__wrap) {
        return <View style={[styles.wrapPage, {height: pageHeight}]} />;
      }

      const isActive = index === activeIndex;

      return (
        <VideoCard
          video={item}
          height={pageHeight}
          isActive={isActive}
          shouldMountPlayer={isActive}
          autoplay={autoplay}
          muted={muted}
          pausedByUser={isActive ? pausedByUser : true}
          showPlayHint={isActive && showPlayHint}
          onTogglePlayPause={togglePlayPause}
          onFavorite={onFavorite}
          onRemove={onRemove}
        />
      );
    },
    [
      activeIndex,
      autoplay,
      muted,
      onFavorite,
      onRemove,
      pageHeight,
      pausedByUser,
      showPlayHint,
      togglePlayPause,
    ],
  );

  const keyExtractor = useCallback(item => item.id, []);

  if (!videos.length) {
    return null;
  }

  return (
    <View style={styles.host} onLayout={onLayout}>
      {pageHeight > 0 ? (
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          bounces={false}
          overScrollMode="never"
          decelerationRate="fast"
          snapToInterval={pageHeight}
          snapToAlignment="start"
          disableIntervalMomentum
          getItemLayout={getItemLayout}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews={false}
          initialScrollIndex={Math.min(
            initialIndex,
            Math.max(videos.length - 1, 0),
          )}
          onScrollToIndexFailed={info => {
            setTimeout(() => {
              listRef.current?.scrollToIndex({
                index: info.index,
                animated: false,
              });
            }, 100);
          }}
          style={styles.list}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: '#000',
  },
  list: {
    flex: 1,
    backgroundColor: '#000',
  },
  wrapPage: {
    backgroundColor: '#000',
  },
});
