import { useCallback } from 'react';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((pattern: number | number[] = 15) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe fallback for browsers/devices that don't support or allow vibration
      }
    }
  }, []);

  return { triggerHaptic };
};
