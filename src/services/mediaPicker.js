import {Alert, Platform} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  isPermissionGranted,
  requestMediaPermission,
  showPermissionDeniedAlert,
} from '../utils/permissions';
import {
  createVideoId,
  durationFromAsset,
  normalizeLocalUri,
  titleFromAsset,
} from '../utils/videoUtils';
import {takePersistableReadPermission} from './uriPermission';
import {generateThumbnail} from './thumbnailService';

/**
 * Open the native media picker for local videos only.
 * Returns metadata with URI references — videos are not copied into app storage.
 */
export async function pickLocalVideos() {
  const permission = await requestMediaPermission();
  if (!isPermissionGranted(permission)) {
    showPermissionDeniedAlert();
    return {cancelled: true, videos: [], denied: true};
  }

  const response = await launchImageLibrary({
    mediaType: 'video',
    selectionLimit: 0,
    includeExtra: true,
    assetRepresentationMode: 'current',
  });

  if (response.didCancel) {
    return {cancelled: true, videos: []};
  }

  if (response.errorCode) {
    Alert.alert(
      'Could not open videos',
      response.errorMessage || 'Please try again.',
    );
    return {cancelled: true, videos: [], error: response.errorCode};
  }

  const assets = response.assets || [];
  if (!assets.length) {
    return {cancelled: true, videos: []};
  }

  const videos = [];
  for (let index = 0; index < assets.length; index += 1) {
    const asset = assets[index];
    const uri = normalizeLocalUri(asset.uri);
    if (!uri) {
      continue;
    }

    await takePersistableReadPermission(uri);

    const thumbnailUri = await generateThumbnail(uri);
    videos.push({
      id: createVideoId(),
      uri,
      title: titleFromAsset(asset, index),
      thumbnailUri,
      duration: durationFromAsset(asset),
      addedAt: Date.now(),
      isFavorite: false,
      platform: Platform.OS,
    });
  }

  return {cancelled: false, videos};
}
