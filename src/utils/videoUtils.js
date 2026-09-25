export function createVideoId() {
  return `vid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function formatDuration(seconds = 0) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function titleFromAsset(asset, fallbackIndex = 0) {
  if (asset?.fileName) {
    return asset.fileName.replace(/\.[^/.]+$/, '');
  }
  if (asset?.uri) {
    const part = asset.uri.split('/').pop() || '';
    const cleaned = decodeURIComponent(part).replace(/\.[^/.]+$/, '');
    if (cleaned && cleaned !== 'null') {
      return cleaned.slice(0, 48);
    }
  }
  return `Video ${fallbackIndex + 1}`;
}

export function durationFromAsset(asset) {
  if (typeof asset?.duration === 'number') {
    // image-picker often returns seconds on iOS and ms on some Android builds
    return asset.duration > 1000 ? asset.duration / 1000 : asset.duration;
  }
  return 0;
}

export function normalizeLocalUri(uri) {
  if (!uri) {
    return null;
  }
  if (uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('ph://') || uri.startsWith('assets-library://')) {
    return uri;
  }
  if (uri.startsWith('/')) {
    return `file://${uri}`;
  }
  return uri;
}
