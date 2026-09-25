import {Platform} from 'react-native';

export const typography = {
  brand: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontFamily: Platform.select({ios: 'Avenir Next', android: 'sans-serif-medium'}),
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
  },
  small: {
    fontSize: 11,
    fontWeight: '600',
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
  },
};
