import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {spacing} from '../../theme';
import {LibraryItem} from '../LibraryItem';

export function LibraryGrid({
  videos,
  selecting,
  selectedIds,
  onPressItem,
  onLongPressItem,
}) {
  const renderItem = useCallback(
    ({item}) => (
      <LibraryItem
        video={item}
        selecting={selecting}
        selected={selectedIds?.has(item.id)}
        onPress={() => onPressItem?.(item)}
        onLongPress={() => onLongPressItem?.(item)}
      />
    ),
    [onLongPressItem, onPressItem, selectedIds, selecting],
  );

  return (
    <FlatList
      data={videos}
      keyExtractor={item => item.id}
      numColumns={3}
      renderItem={renderItem}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View style={{height: spacing.xxxl}} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
});
