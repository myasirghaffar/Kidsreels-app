import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Linking, Platform} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';

export const PENDING_VIDEO_PICK_KEY = '@kidsreels/pending_video_pick_v1';

function photoPermission() {
  if (Platform.OS === 'ios') {
    return PERMISSIONS.IOS.PHOTO_LIBRARY;
  }
  if (Platform.OS === 'android') {
    // Android 13+ uses the system photo picker — no runtime permission needed.
    if (Platform.Version >= 33) {
      return null;
    }
    return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  }
  return null;
}

export async function checkMediaPermission() {
  const permission = photoPermission();
  if (!permission) {
    return RESULTS.GRANTED;
  }
  return check(permission);
}

/**
 * @returns {{status: string, justGranted: boolean}}
 */
export async function requestMediaPermission() {
  const permission = photoPermission();
  if (!permission) {
    return {status: RESULTS.GRANTED, justGranted: false};
  }

  const current = await check(permission);
  if (current === RESULTS.GRANTED || current === RESULTS.LIMITED) {
    return {status: current, justGranted: false};
  }

  const next = await request(permission);
  const granted = next === RESULTS.GRANTED || next === RESULTS.LIMITED;
  return {status: next, justGranted: granted};
}

export function isPermissionGranted(status) {
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
}

export async function markPendingVideoPick() {
  try {
    await AsyncStorage.setItem(PENDING_VIDEO_PICK_KEY, '1');
  } catch (_) {
    // ignore
  }
}

export async function clearPendingVideoPick() {
  try {
    await AsyncStorage.removeItem(PENDING_VIDEO_PICK_KEY);
  } catch (_) {
    // ignore
  }
}

export async function consumePendingVideoPick() {
  try {
    const value = await AsyncStorage.getItem(PENDING_VIDEO_PICK_KEY);
    if (value !== '1') {
      return false;
    }
    await AsyncStorage.removeItem(PENDING_VIDEO_PICK_KEY);
    return true;
  } catch (_) {
    return false;
  }
}

export function showPermissionDeniedAlert() {
  Alert.alert(
    'Photos access needed',
    Platform.OS === 'ios'
      ? 'KidsReels needs access to your photo library to play videos you choose. You can enable access in Settings.'
      : 'KidsReels needs access to videos on this device. You can enable access in Settings.',
    [
      {text: 'Not now', style: 'cancel'},
      {
        text: 'Open Settings',
        onPress: () => {
          openSettings().catch(() => Linking.openSettings());
        },
      },
    ],
  );
}
