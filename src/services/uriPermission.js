import {NativeModules, Platform} from 'react-native';

const {UriPermissionModule} = NativeModules;

/**
 * Ask Android to keep a content:// URI readable after app restarts.
 * No-op on iOS and for non-content URIs. Does not copy video files.
 */
export async function takePersistableReadPermission(uri) {
  if (Platform.OS !== 'android' || !uri || !uri.startsWith('content://')) {
    return false;
  }
  if (!UriPermissionModule?.takePersistableReadPermission) {
    return false;
  }
  try {
    return await UriPermissionModule.takePersistableReadPermission(uri);
  } catch (error) {
    console.warn('Could not persist URI permission', uri, error);
    return false;
  }
}
