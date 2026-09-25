import {Platform} from 'react-native';

/**
 * Revopush OTA config for KidsReels / Orhan.
 *
 * Separate Revopush apps per platform (required — shared apps overwrite bundles):
 * - Android: "kidsreels App android"
 * - iOS: "kidsreels App Ios"
 *
 * Native defaults embed Production keys (strings.xml / Info.plist).
 * JS sync uses ACTIVE_DEPLOYMENT_KEY so channel switches stay in one place.
 */

export const REVOPUSH_SERVER_URL = 'https://api.revopush.org';

export const OTA_APP_NAMES = {
  android: 'kidsreels App android',
  ios: 'kidsreels App Ios',
};

export const DEPLOYMENT_KEYS = {
  production: {
    android: 'STLNON_R7IaPHdFEEktfzdQtCG4OVJBIloS14l',
    ios: 'qL3fr3d9s5STaMPh3MrqA7ABDv15VJBIloS14l',
  },
  staging: {
    android: 'TJgmKnUQdfDnl-UyTvefTBfwItilVJBIloS14l',
    ios: 'TE2wj1dRnusyY2N1lP5Q3gpPgm6iVJBIloS14l',
  },
};

/** Default channel for release binaries. Change to 'staging' for staging APKs. */
export const ACTIVE_DEPLOYMENT = 'staging';

const ACTIVE_PLATFORM = Platform.OS === 'ios' ? 'ios' : 'android';

export const ACTIVE_DEPLOYMENT_KEY =
  DEPLOYMENT_KEYS[ACTIVE_DEPLOYMENT][ACTIVE_PLATFORM];
