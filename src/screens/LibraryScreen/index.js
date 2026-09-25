import React, {useCallback, useMemo, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AddVideosButton} from '../../components/AddVideosButton';
import {EmptyState} from '../../components/EmptyState';
import {ImportBanner} from '../../components/ImportBanner';
import {LibraryGrid} from '../../components/LibraryGrid';
import {useVideos} from '../../hooks/useVideos';
import {colors, spacing, typography} from '../../theme';

export function LibraryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    videos,
    importing,
    importMessage,
    addFromPicker,
    removeVideos,
    reorderVideos,
  } = useVideos();

  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [reorderMode, setReorderMode] = useState(false);

  const selectedCount = selectedIds.size;

  const orderedIds = useMemo(() => videos.map(v => v.id), [videos]);

  const toggleSelect = useCallback(video => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(video.id)) {
        next.delete(video.id);
      } else {
        next.add(video.id);
      }
      return next;
    });
  }, []);

  const onPressItem = useCallback(
    video => {
      if (selecting) {
        toggleSelect(video);
        return;
      }
      if (reorderMode) {
        return;
      }
      const index = videos.findIndex(item => item.id === video.id);
      navigation.navigate('Home', {startIndex: Math.max(index, 0)});
    },
    [navigation, reorderMode, selecting, toggleSelect, videos],
  );

  const onLongPressItem = useCallback(video => {
    setSelecting(true);
    setSelectedIds(new Set([video.id]));
  }, []);

  const exitSelection = useCallback(() => {
    setSelecting(false);
    setSelectedIds(new Set());
  }, []);

  const deleteSelected = useCallback(() => {
    if (!selectedCount) {
      return;
    }
    Alert.alert(
      'Remove videos?',
      `Remove ${selectedCount} video${selectedCount === 1 ? '' : 's'} from KidsReels? Original files stay on your device.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeVideos([...selectedIds]);
            exitSelection();
          },
        },
      ],
    );
  }, [exitSelection, removeVideos, selectedCount, selectedIds]);

  const moveSelected = useCallback(
    async direction => {
      if (selectedIds.size !== 1) {
        Alert.alert('Select one video', 'Pick a single video to reorder.');
        return;
      }
      const id = [...selectedIds][0];
      const index = orderedIds.indexOf(id);
      if (index < 0) {
        return;
      }
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= orderedIds.length) {
        return;
      }
      const next = [...orderedIds];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      await reorderVideos(next);
    },
    [orderedIds, reorderVideos, selectedIds],
  );

  if (!videos.length) {
    return (
      <View style={[styles.flex, {paddingTop: insets.top}]}>
        <ImportBanner message={importMessage} />
        <EmptyState
          title="No videos yet"
          subtitle="Add your favorite videos to start watching."
          onAdd={addFromPicker}
          loading={importing}
        />
      </View>
    );
  }

  return (
    <View style={[styles.flex, {paddingTop: insets.top}]}>
      <ImportBanner message={importMessage} />
      <View style={styles.header}>
        <Text style={styles.brand}>KidsReels</Text>
        <AddVideosButton
          compact
          label="+ Add"
          onPress={addFromPicker}
          loading={importing}
        />
      </View>

      {selecting ? (
        <View style={styles.toolbar}>
          <Text style={styles.toolbarText}>{selectedCount} selected</Text>
          <View style={styles.toolbarActions}>
            <Pressable onPress={() => moveSelected('up')} style={styles.toolBtn}>
              <Text style={styles.toolLabel}>Up</Text>
            </Pressable>
            <Pressable onPress={() => moveSelected('down')} style={styles.toolBtn}>
              <Text style={styles.toolLabel}>Down</Text>
            </Pressable>
            <Pressable onPress={deleteSelected} style={[styles.toolBtn, styles.danger]}>
              <Text style={styles.toolLabelLight}>Delete</Text>
            </Pressable>
            <Pressable onPress={exitSelection} style={styles.toolBtn}>
              <Text style={styles.toolLabel}>Done</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.hintRow}>
          <Text style={styles.hint}>Tap to play · Long press to select</Text>
          <Pressable
            onPress={() => {
              setReorderMode(true);
              setSelecting(true);
            }}>
            <Text style={styles.link}>Reorder</Text>
          </Pressable>
        </View>
      )}

      <LibraryGrid
        videos={videos}
        selecting={selecting}
        selectedIds={selectedIds}
        onPressItem={onPressItem}
        onLongPressItem={onLongPressItem}
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
  hintRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  link: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  toolbar: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  toolbarText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  toolbarActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  toolBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  toolLabel: {
    ...typography.small,
    color: colors.text,
  },
  toolLabelLight: {
    ...typography.small,
    color: colors.textOnDark,
  },
});
