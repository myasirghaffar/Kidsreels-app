import {Image} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {getBundledVideoAsset} from '../assets/videos';
import {normalizeLocalUri} from '../utils/videoUtils';

/**
 * Resolve a playable file/content URI for gallery clips or bundled shorts.
 */
export function resolveVideoSourceUri(videoOrUri) {
  if (videoOrUri && typeof videoOrUri === 'object') {
    if (videoOrUri.bundledAssetKey) {
      const asset = getBundledVideoAsset(videoOrUri.bundledAssetKey);
      if (asset == null) {
        return null;
      }
      const resolved = Image.resolveAssetSource(asset);
      return resolved?.uri || null;
    }
    return normalizeLocalUri(videoOrUri.uri);
  }
  return normalizeLocalUri(videoOrUri);
}

/**
 * Generate a local thumbnail file for Library grid display.
 * Thumbnails are small cached JPEGs; source videos are never copied.
 */
export async function generateThumbnail(videoOrUri, timeStamp = 800) {
  // Bundled packager assets crash MediaMetadataRetriever on Android.
  if (
    videoOrUri &&
    typeof videoOrUri === 'object' &&
    videoOrUri.bundledAssetKey
  ) {
    return null;
  }

  const source = resolveVideoSourceUri(videoOrUri);
  if (!source || source.startsWith('bundled://')) {
    return null;
  }

  try {
    const result = await createThumbnail({
      url: source,
      timeStamp,
      format: 'jpeg',
      maxWidth: 480,
      maxHeight: 480,
    });
    return result?.path ? normalizeLocalUri(result.path) : null;
  } catch (error) {
    console.warn('Thumbnail generation failed', error);
    return null;
  }
}

export async function generateThumbnailsForVideos(videos, onProgress) {
  const updated = [];
  for (let index = 0; index < videos.length; index += 1) {
    const video = videos[index];
    if (video.thumbnailUri) {
      updated.push(video);
    } else {
      const thumbnailUri = await generateThumbnail(video);
      updated.push({...video, thumbnailUri});
    }
    if (onProgress) {
      onProgress(index + 1, videos.length);
    }
  }
  return updated;
}
