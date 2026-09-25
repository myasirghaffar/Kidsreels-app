import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Dimensions, FlatList, Platform, StyleSheet, View} from 'react-native';
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
  const screenHeight = Dimensions.get('window').height;
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

  useEffect(() => {
    if (!videos.length) {
      return;
    }
    const clamped = Math.min(Math.max(initialIndex, 0), videos.length - 1);
    setActive(clamped);
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({index: clamped, animated: false});
    });
  }, [initialIndex, setActive, videos.length]);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (!viewableItems?.length) {
      return;
    }
    const top = viewableItems.find(item => item.isViewable);
    if (!top) {
      return;
    }
    if (top.item?.__wrap) {
      listRef.current?.scrollToIndex({index: 0, animated: false});
      setActive(0);
      return;
    }
    if (typeof top.index === 'number') {
      setActive(top.index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
    }),
    [screenHeight],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      if (item.__wrap) {
        return <View style={[styles.wrapPage, {height: screenHeight}]} />;
      }

      const isActive = index === activeIndex;
      const shouldMountPlayer = Math.abs(index - activeIndex) <= 1;

      return (
        <VideoCard
          video={item}
          height={screenHeight}
          isActive={isActive}
          shouldMountPlayer={shouldMountPlayer}
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
      pausedByUser,
      screenHeight,
      showPlayHint,
      togglePlayPause,
    ],
  );

  const keyExtractor = useCallback(item => item.id, []);

  if (!videos.length) {
    return null;
  }

  return (
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
      snapToInterval={screenHeight}
      snapToAlignment="start"
      disableIntervalMomentum
      getItemLayout={getItemLayout}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      windowSize={3}
      removeClippedSubviews={Platform.OS !== 'android'}
      initialScrollIndex={Math.min(initialIndex, Math.max(videos.length - 1, 0))}
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
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#000',
  },
  wrapPage: {
    backgroundColor: '#000',
  },
});
