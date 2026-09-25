import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@kidsreels/settings_v1';

export const DEFAULT_SETTINGS = {
  autoplay: true,
  muteByDefault: false,
};

async function readSettings() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {...DEFAULT_SETTINGS};
    }
    return {...DEFAULT_SETTINGS, ...JSON.parse(raw)};
  } catch (error) {
    console.warn('settingsStorage.read failed', error);
    return {...DEFAULT_SETTINGS};
  }
}

async function writeSettings(settings) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  return settings;
}

export async function getSettings() {
  return readSettings();
}

export async function updateSettings(patch = {}) {
  const current = await readSettings();
  return writeSettings({...current, ...patch});
}

export async function setAutoplay(enabled) {
  return updateSettings({autoplay: Boolean(enabled)});
}

export async function setMuteByDefault(enabled) {
  return updateSettings({muteByDefault: Boolean(enabled)});
}
