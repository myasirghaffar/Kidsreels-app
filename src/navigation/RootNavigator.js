import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {MainTabs} from './MainTabs';
import {colors} from '../theme';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.surfaceMuted,
    primary: colors.primary,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <MainTabs />
    </NavigationContainer>
  );
}
