import {createThumbnail} from 'react-native-create-thumbnail';
import {normalizeLocalUri} from '../utils/videoUtils';

/**
 * Generate a local thumbnail file for Library grid display.
 * Thumbnails are small cached JPEGs; source videos are never copied.
 */
export async function generateThumbnail(uri, timeStamp = 1000) {
  const source = normalizeLocalUri(uri);
  if (!source) {
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
      const thumbnailUri = await generateThumbnail(video.uri);
      updated.push({...video, thumbnailUri});
    }
    if (onProgress) {
      onProgress(index + 1, videos.length);
    }
  }
  return updated;
}
