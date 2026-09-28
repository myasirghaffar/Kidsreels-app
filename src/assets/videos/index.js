const BUNDLED_ASSETS = {
  video1: require('./video1.mp4'),
  video2: require('./video2.mp4'),
  video3: require('./video3.mp4'),
  video4: require('./video4.mp4'),
  video5: require('./video5.mp4'),
};

export const DEFAULT_VIDEOS = Object.keys(BUNDLED_ASSETS).map((key, index) => ({
  id: `default-${key}`,
  uri: `bundled://${key}`,
  bundledAssetKey: key,
  title: `Short ${index + 1}`,
  thumbnailUri: null,
  duration: 0,
  addedAt: 0,
  position: index,
  isFavorite: false,
}));

export function getBundledVideoAsset(key) {
  return BUNDLED_ASSETS[key] || null;
}
