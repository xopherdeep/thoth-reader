export function triggerHaptic(pattern: number | number[] = 15) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Safe fallback for devices without vibration support
    }
  }
}
