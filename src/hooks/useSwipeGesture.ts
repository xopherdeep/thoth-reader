import { useState, useCallback } from 'react';

interface UseSwipeGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeThreshold?: number;
}

export const useSwipeGesture = ({ onSwipeLeft, onSwipeRight, swipeThreshold = 40 }: UseSwipeGestureProps) => {
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [touchEndPos, setTouchEndPos] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
    setTouchEndPos(null);
    setTouchStartPos({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    setTouchEndPos({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartPos || !touchEndPos) return;
    const diffX = touchStartPos.x - touchEndPos.x;
    const diffY = touchStartPos.y - touchEndPos.y;

    // Minimum swipe distance threshold & horizontal dominance check
    if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY) * 1.25) {
      if (diffX > 0) {
        // Swiped Left (right to left gesture)
        onSwipeLeft?.();
      } else {
        // Swiped Right (left to right gesture)
        onSwipeRight?.();
      }
    }
    setTouchStartPos(null);
    setTouchEndPos(null);
  }, [touchStartPos, touchEndPos, onSwipeLeft, onSwipeRight, swipeThreshold]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
