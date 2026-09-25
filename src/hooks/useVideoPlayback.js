import {useCallback, useRef, useState} from 'react';

/**
 * Tracks which feed index is active and ephemeral play/pause overlays.
 */
export function useVideoPlayback(initialIndex = 0) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);
  const hintTimer = useRef(null);

  const setActive = useCallback(index => {
    setActiveIndex(index);
    setPausedByUser(false);
    setShowPlayHint(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    setPausedByUser(prev => {
      const next = !prev;
      setShowPlayHint(true);
      if (hintTimer.current) {
        clearTimeout(hintTimer.current);
      }
      hintTimer.current = setTimeout(() => setShowPlayHint(false), 700);
      return next;
    });
  }, []);

  return {
    activeIndex,
    setActive,
    pausedByUser,
    showPlayHint,
    togglePlayPause,
  };
}
