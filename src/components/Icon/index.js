import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme';

const GLYPHS = {
  home: '⌂',
  library: '▦',
  add: '+',
  heart: '♥',
  heartOutline: '♡',
  more: '⋯',
  play: '▶',
  pause: '❚❚',
  settings: '⚙',
  close: '✕',
  check: '✓',
  trash: '🗑',
  film: '🎬',
  mute: '🔇',
  unmute: '🔊',
  grip: '☰',
  update: '↻',
};

export function Icon({name, size = 22, color = colors.text, style}) {
  return (
    <View style={[styles.wrap, style]} accessibilityElementsHidden>
      <Text style={{fontSize: size, color, lineHeight: size + 4}}>
        {GLYPHS[name] || '•'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
