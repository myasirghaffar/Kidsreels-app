import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, typography} from '../../theme';
import {Icon} from '../Icon';

function VideoOverlayComponent({
  visible,
  paused,
  unavailable,
  buffering,
  errorMessage,
}) {
  if (unavailable) {
    return (
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.errorTitle}>Video unavailable</Text>
        <Text style={styles.errorBody}>
          {errorMessage || 'This video can no longer be opened from your device.'}
        </Text>
      </View>
    );
  }

  if (buffering) {
    return (
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.hint}>Loading…</Text>
      </View>
    );
  }

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.center} pointerEvents="none">
      <View style={styles.badge}>
        <Icon
          name={paused ? 'play' : 'pause'}
          size={28}
          color={colors.textOnDark}
        />
      </View>
    </View>
  );
}

export const VideoOverlay = memo(VideoOverlayComponent);

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.overlayStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    ...typography.subtitle,
    color: colors.textOnDark,
  },
  errorTitle: {
    ...typography.title,
    color: colors.textOnDark,
    marginBottom: 8,
  },
  errorBody: {
    ...typography.body,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
