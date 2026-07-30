export interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeThreshold?: number;
}

export function createSwipeHandlers(options: SwipeGestureOptions) {
  const { onSwipeLeft, onSwipeRight, swipeThreshold = 40 } = options;
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  function handleTouchStart(e: TouchEvent) {
    startX = e.targetTouches[0].clientX;
    startY = e.targetTouches[0].clientY;
    endX = startX;
    endY = startY;
  }

  function handleTouchMove(e: TouchEvent) {
    endX = e.targetTouches[0].clientX;
    endY = e.targetTouches[0].clientY;
  }

  function handleTouchEnd() {
    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY) * 1.25) {
      if (diffX > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
