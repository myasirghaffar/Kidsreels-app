import React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {MainTabs} from './MainTabs';
import {colors} from '../theme';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.tabBar,
    text: colors.text,
    border: colors.border,
    notification: colors.favorite,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <MainTabs />
    </NavigationContainer>
  );
}
