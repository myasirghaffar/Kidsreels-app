import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as videoStorage from '../storage/videoStorage';
import {pickLocalVideos} from '../services/mediaPicker';
import {consumePendingVideoPick} from '../utils/permissions';

const VideosContext = createContext(null);

export function VideosProvider({children}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const [error, setError] = useState(null);
  const pickingRef = useRef(false);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const next = await videoStorage.getVideos();
      setVideos(next);
      // Backfill Library previews for default/bundled clips in the background.
      videoStorage
        .ensureMissingThumbnails()
        .then(withThumbs => {
          if (withThumbs?.length) {
            setVideos(withThumbs);
          }
        })
        .catch(() => {});
      return next;
    } catch (err) {
      setError(err.message || 'Failed to load videos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addFromPicker = useCallback(async ({fromPendingResume = false} = {}) => {
    if (pickingRef.current) {
      return {added: 0, cancelled: true};
    }
    pickingRef.current = true;
    try {
      setImporting(true);
      setImportMessage('Opening your videos…');
      const result = await pickLocalVideos({fromPendingResume});
      if (result.cancelled || !result.videos.length) {
        setImportMessage('');
        return {added: 0, cancelled: true, denied: result.denied};
      }

      setImportMessage(`Adding ${result.videos.length} videos…`);
      const next = await videoStorage.addVideos(result.videos);
      setVideos(next);
      setImportMessage(
        `${result.videos.length} video${result.videos.length === 1 ? '' : 's'} added`,
      );
      setTimeout(() => setImportMessage(''), 1800);
      return {added: result.videos.length, cancelled: false};
    } catch (err) {
      setImportMessage('');
      setError(err.message || 'Could not add videos');
      return {added: 0, cancelled: false, error: err};
    } finally {
      pickingRef.current = false;
      setImporting(false);
    }
  }, []);

  // After first-time permission, Android may remount the Activity. Resume pick.
  useEffect(() => {
    let cancelled = false;

    const resumeIfNeeded = async () => {
      const pending = await consumePendingVideoPick();
      if (!pending || cancelled || pickingRef.current) {
        return;
      }
      setTimeout(() => {
        if (!cancelled && !pickingRef.current) {
          addFromPicker({fromPendingResume: true});
        }
      }, 600);
    };

    resumeIfNeeded();

    return () => {
      cancelled = true;
    };
  }, [addFromPicker]);

  const removeVideo = useCallback(async id => {
    const next = await videoStorage.removeVideo(id);
    setVideos(next);
    return next;
  }, []);

  const removeVideos = useCallback(async ids => {
    const next = await videoStorage.removeVideos(ids);
    setVideos(next);
    return next;
  }, []);

  const updateVideo = useCallback(async (id, patch) => {
    const next = await videoStorage.updateVideo(id, patch);
    setVideos(next);
    return next;
  }, []);

  const toggleFavorite = useCallback(async id => {
    const current = (await videoStorage.getVideos()).find(item => item.id === id);
    const next = await videoStorage.toggleFavorite(id);
    setVideos(next);
    const nowFav = next.find(item => item.id === id)?.isFavorite;
    if (nowFav) {
      setImportMessage('Added to Favorites ♥');
    } else if (current) {
      setImportMessage('Removed from Favorites');
    }
    setTimeout(() => setImportMessage(''), 1600);
    return next;
  }, []);

  const reorderVideos = useCallback(async orderedIds => {
    const next = await videoStorage.reorderVideos(orderedIds);
    setVideos(next);
    return next;
  }, []);

  const clearVideos = useCallback(async () => {
    const next = await videoStorage.clearVideos();
    setVideos(next);
    return next;
  }, []);

  const value = useMemo(
    () => ({
      videos,
      loading,
      importing,
      importMessage,
      error,
      refresh,
      addFromPicker,
      removeVideo,
      removeVideos,
      updateVideo,
      toggleFavorite,
      reorderVideos,
      clearVideos,
    }),
    [
      videos,
      loading,
      importing,
      importMessage,
      error,
      refresh,
      addFromPicker,
      removeVideo,
      removeVideos,
      updateVideo,
      toggleFavorite,
      reorderVideos,
      clearVideos,
    ],
  );

  return (
    <VideosContext.Provider value={value}>{children}</VideosContext.Provider>
  );
}

export function useVideos() {
  const ctx = useContext(VideosContext);
  if (!ctx) {
    throw new Error('useVideos must be used within VideosProvider');
  }
  return ctx;
}
