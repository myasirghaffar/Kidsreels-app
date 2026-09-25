import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as settingsStorage from '../storage/settingsStorage';

const SettingsContext = createContext(null);

export function SettingsProvider({children}) {
  const [settings, setSettings] = useState(settingsStorage.DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    settingsStorage.getSettings().then(next => {
      if (mounted) {
        setSettings(next);
        setReady(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const updateSettings = useCallback(async patch => {
    const next = await settingsStorage.updateSettings(patch);
    setSettings(next);
    return next;
  }, []);

  const value = useMemo(
    () => ({
      settings,
      ready,
      updateSettings,
      setAutoplay: enabled => updateSettings({autoplay: Boolean(enabled)}),
      setMuteByDefault: enabled =>
        updateSettings({muteByDefault: Boolean(enabled)}),
    }),
    [settings, ready, updateSettings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
