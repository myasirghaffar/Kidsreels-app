import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {EmptyState} from '../../components/EmptyState';
import {LibraryGrid} from '../../components/LibraryGrid';
import {useVideos} from '../../hooks/useVideos';
import {colors, spacing, typography} from '../../theme';

export function FavoritesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {videos} = useVideos();

  const favorites = useMemo(
    () => videos.filter(video => video.isFavorite),
    [videos],
  );

  if (!favorites.length) {
    return (
      <View style={[styles.flex, {paddingTop: insets.top}]}>
        <EmptyState
          icon="heart"
          title="No favorites yet"
          subtitle="Open Home, watch a video, and tap the ♥ heart on the right to save it here."
          primaryLabel="Go to Home"
          onAdd={() => navigation.navigate('Home')}
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
      <Text style={styles.hint}>
        Tip: tap ♥ on the Home feed to add or remove favorites
      </Text>
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
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
});
