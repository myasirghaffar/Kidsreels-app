import React, {useMemo} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {EmptyState} from '../../components/EmptyState';
import {LibraryGrid} from '../../components/LibraryGrid';
import {useVideos} from '../../hooks/useVideos';
import {colors, spacing, typography} from '../../theme';

export function FavoritesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {videos, addFromPicker, importing} = useVideos();

  const favorites = useMemo(
    () => videos.filter(video => video.isFavorite),
    [videos],
  );

  if (!favorites.length) {
    return (
      <View style={[styles.flex, {paddingTop: insets.top}]}>
        <EmptyState
          title="No favorites yet"
          subtitle="Tap the heart on a video in the feed to save it here."
          onAdd={addFromPicker}
          loading={importing}
        />
      </View>
    );
  }

  return (
    <View style={[styles.flex, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Text style={styles.brand}>Favorites</Text>
        <Text style={styles.count}>
          {favorites.length} saved
        </Text>
      </View>
      <LibraryGrid
        videos={favorites}
        selecting={false}
        selectedIds={new Set()}
        onPressItem={video => {
          const index = videos.findIndex(item => item.id === video.id);
          navigation.navigate('Home', {startIndex: Math.max(index, 0)});
        }}
        onLongPressItem={() => {}}
      />
      <Pressable
        onPress={() => navigation.navigate('Home')}
        style={styles.linkBtn}
        accessibilityRole="button"
        accessibilityLabel="Open home feed">
        <Text style={styles.linkText}>Watch in feed</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    ...typography.brand,
    color: colors.text,
  },
  count: {
    ...typography.caption,
    color: colors.textMuted,
  },
  linkBtn: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  linkText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
});
