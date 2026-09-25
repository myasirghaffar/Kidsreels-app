import {Alert, Linking, Platform} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';

function photoPermission() {
  if (Platform.OS === 'ios') {
    return PERMISSIONS.IOS.PHOTO_LIBRARY;
  }
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      return PERMISSIONS.ANDROID.READ_MEDIA_VIDEO;
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

export async function requestMediaPermission() {
  const permission = photoPermission();
  if (!permission) {
    return RESULTS.GRANTED;
  }

  const current = await check(permission);
  if (current === RESULTS.GRANTED || current === RESULTS.LIMITED) {
    return current;
  }

  return request(permission);
}

export function isPermissionGranted(status) {
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
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
