import React, {useCallback, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {EmptyState} from '../../components/EmptyState';
import {ImportBanner} from '../../components/ImportBanner';
import {VideoFeed} from '../../components/VideoFeed';
import {useVideos} from '../../hooks/useVideos';
import {useSettings} from '../../context/SettingsContext';
import {colors} from '../../theme';

export function HomeScreen() {
  const route = useRoute();
  const {videos, loading, importing, importMessage, addFromPicker, toggleFavorite, removeVideo} =
    useVideos();
  const {settings} = useSettings();
  const [startIndex, setStartIndex] = useState(0);
  const focusToken = route.params?.focusToken;

  useFocusEffect(
    useCallback(() => {
      const index = route.params?.startIndex;
      if (typeof index === 'number') {
        setStartIndex(index);
      } else if (focusToken) {
        setStartIndex(0);
      }
    }, [route.params?.startIndex, focusToken]),
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!videos.length) {
    return (
      <View style={styles.flex}>
        <ImportBanner message={importMessage} />
        <EmptyState onAdd={addFromPicker} loading={importing} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <ImportBanner message={importMessage} />
      <VideoFeed
        videos={videos}
        initialIndex={startIndex}
        autoplay={settings.autoplay}
        muted={settings.muteByDefault}
        onFavorite={toggleFavorite}
        onRemove={removeVideo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
});
