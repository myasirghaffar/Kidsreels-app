const BUNDLED_ASSETS = {
  video1: require('./video1.mp4'),
  video2: require('./video2.mp4'),
  video3: require('./video3.mp4'),
  video4: require('./video4.mp4'),
  video5: require('./video5.mp4'),
  video6: require('./video6.mp4'),
  video7: require('./video7.mp4'),
};

const BUNDLED_THUMBS = {
  video1: require('./thumbs/video1.jpg'),
  video2: require('./thumbs/video2.jpg'),
  video3: require('./thumbs/video3.jpg'),
  video4: require('./thumbs/video4.jpg'),
  video5: require('./thumbs/video5.jpg'),
  video6: require('./thumbs/video6.jpg'),
  video7: require('./thumbs/video7.jpg'),
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

export function getBundledThumbAsset(key) {
  return BUNDLED_THUMBS[key] || null;
}
