import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEFAULT_VIDEOS} from '../assets/videos';

const STORAGE_KEY = '@kidsreels/videos_v1';
const DEFAULTS_SEEDED_KEY = '@kidsreels/default_videos_seeded_v1';

async function readAll() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('videoStorage.readAll failed', error);
    throw new Error('Could not load your video library.');
  }
}

async function writeAll(videos) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    return videos;
  } catch (error) {
    console.warn('videoStorage.writeAll failed', error);
    throw new Error('Could not save your video library.');
  }
}

function sortByPosition(videos) {
  return [...videos].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

export async function getVideos() {
  const existing = await readAll();
  const defaultsSeeded = await AsyncStorage.getItem(DEFAULTS_SEEDED_KEY);

  if (defaultsSeeded === 'true') {
    return sortByPosition(existing);
  }

  const existingIds = new Set(existing.map(item => item.id));
  const missingDefaults = DEFAULT_VIDEOS.filter(
    item => !existingIds.has(item.id),
  );
  const next = [...missingDefaults, ...sortByPosition(existing)].map(
    (item, index) => ({...item, position: index}),
  );

  await writeAll(next);
  await AsyncStorage.setItem(DEFAULTS_SEEDED_KEY, 'true');
  return next;
}

export async function addVideos(newVideos = []) {
  if (!newVideos.length) {
    return getVideos();
  }

  const existing = await readAll();
  const existingUris = new Set(existing.map(item => item.uri));
  const basePosition =
    existing.reduce((max, item) => Math.max(max, item.position ?? 0), -1) + 1;

  const uniqueIncoming = newVideos.filter(item => item?.uri && !existingUris.has(item.uri));

  const stamped = uniqueIncoming.map((item, index) => ({
    id: item.id,
    uri: item.uri,
    bundledAssetKey: item.bundledAssetKey || null,
    title: item.title || `Video ${basePosition + index + 1}`,
    thumbnailUri: item.thumbnailUri || null,
    duration: typeof item.duration === 'number' ? item.duration : 0,
    addedAt: item.addedAt || Date.now(),
    position: basePosition + index,
    isFavorite: Boolean(item.isFavorite),
  }));

  const next = sortByPosition([...existing, ...stamped]);
  await writeAll(next);
  return next;
}

export async function removeVideo(id) {
  const existing = await readAll();
  const next = sortByPosition(existing.filter(item => item.id !== id)).map(
    (item, index) => ({...item, position: index}),
  );
  await writeAll(next);
  return next;
}

export async function removeVideos(ids = []) {
  const idSet = new Set(ids);
  const existing = await readAll();
  const next = sortByPosition(existing.filter(item => !idSet.has(item.id))).map(
    (item, index) => ({...item, position: index}),
  );
  await writeAll(next);
  return next;
}

export async function updateVideo(id, patch = {}) {
  const existing = await readAll();
  const next = existing.map(item =>
    item.id === id
      ? {
          ...item,
          ...patch,
          id: item.id,
          uri: patch.uri || item.uri,
        }
      : item,
  );
  await writeAll(sortByPosition(next));
  return sortByPosition(next);
}

export async function reorderVideos(orderedIds = []) {
  const existing = await readAll();
  const byId = new Map(existing.map(item => [item.id, item]));
  const reordered = orderedIds
    .map((id, index) => {
      const video = byId.get(id);
      if (!video) {
        return null;
      }
      byId.delete(id);
      return {...video, position: index};
    })
    .filter(Boolean);

  const leftovers = [...byId.values()].map((item, index) => ({
    ...item,
    position: reordered.length + index,
  }));

  const next = [...reordered, ...leftovers];
  await writeAll(next);
  return next;
}

export async function clearVideos() {
  await writeAll([]);
  return [];
}

export async function toggleFavorite(id) {
  const existing = await readAll();
  const target = existing.find(item => item.id === id);
  if (!target) {
    return sortByPosition(existing);
  }
  return updateVideo(id, {isFavorite: !target.isFavorite});
}
