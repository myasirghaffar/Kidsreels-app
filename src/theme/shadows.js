import {Platform} from 'react-native';

export const shadows = {
  soft: Platform.select({
    ios: {
      shadowColor: '#1A1A2E',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: {
      elevation: 6,
    },
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#1A1A2E',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    android: {
      elevation: 3,
    },
  }),
  button: Platform.select({
    ios: {
      shadowColor: '#FF6B4A',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.28,
      shadowRadius: 12,
    },
    android: {
      elevation: 5,
    },
  }),
};
