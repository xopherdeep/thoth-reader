import { useState, useEffect, useRef, useCallback } from 'react';
import { ThothCard } from '../types';
import { FourPilesCut, cutDeckWithCustomRatios } from '../utils/thothSpread';
import { useHapticFeedback } from './useHapticFeedback';

export const useElementalCutMinigame = (deck: ThothCard[], onCustomCutPiles?: (result: FourPilesCut) => void) => {
  // Minigame Cut Stages: 1 = Main Cut (2 Stacks), 2 = Cut Stack A (Yod/Vau), 3 = Cut Stack B (Heh/Heh Final), 'done' = Final Piles
  const [cutStage, setCutStage] = useState<1 | 2 | 3 | 'done'>(1);
  const [markerPos, setMarkerPos] = useState<number>(50);
  const [isCutMoving, setIsCutMoving] = useState<boolean>(true);
  const [isSlicingAnimation, setIsSlicingAnimation] = useState<boolean>(false);

  // Stored cut ratios (bounded 0.30 - 0.70)
  const [ratio1, setRatio1] = useState<number>(0.5);
  const [ratio2, setRatio2] = useState<number>(0.5);
  const [ratio3, setRatio3] = useState<number>(0.5);

  const speedRef = useRef<number>(1.4);
  const dirRef = useRef<number>(1);
  
  const { triggerHaptic } = useHapticFeedback();

  // Oscillating pendulum timing loop for video-game marker
  useEffect(() => {
    if (!isCutMoving || cutStage === 'done') return;
    let animId: number;
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const delta = (now - lastTime) / 16.66;
      lastTime = now;

      setMarkerPos((prev) => {
        let next = prev + dirRef.current * speedRef.current * delta;
        if (next >= 100) {
          next = 100;
          dirRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          dirRef.current = 1;
        }
        return next;
      });

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [isCutMoving, cutStage]);

  // Execute the cut tap action
  const handleExecuteCut = useCallback(() => {
    if (!isCutMoving || cutStage === 'done') return;

    triggerHaptic([30, 50, 30]);
    setIsCutMoving(false);
    setIsSlicingAnimation(true);

    // Map marker 0..100 to 0.30..0.70 ratio
    const currentRatio = 0.3 + (markerPos / 100) * 0.4;

    setTimeout(() => {
      setIsSlicingAnimation(false);

      if (cutStage === 1) {
        setRatio1(currentRatio);
        setCutStage(2);
        setMarkerPos(50);
        setIsCutMoving(true);
      } else if (cutStage === 2) {
        setRatio2(currentRatio);
        setCutStage(3);
        setMarkerPos(50);
        setIsCutMoving(true);
      } else if (cutStage === 3) {
        setRatio3(currentRatio);
        const finalResult = cutDeckWithCustomRatios(deck, ratio1, ratio2, currentRatio);
        if (onCustomCutPiles) {
          onCustomCutPiles(finalResult);
        }
        setCutStage('done');
      }
    }, 600);
  }, [isCutMoving, cutStage, markerPos, ratio1, ratio2, deck, onCustomCutPiles, triggerHaptic]);

  // Handle Spacebar / Enter keypress for cutting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && isCutMoving && cutStage !== 'done') {
        e.preventDefault();
        handleExecuteCut();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCutMoving, cutStage, handleExecuteCut]);

  // Reset interactive minigame
  const handleRestartMinigame = useCallback(() => {
    setCutStage(1);
    setMarkerPos(50);
    setRatio1(0.5);
    setRatio2(0.5);
    setRatio3(0.5);
    setIsCutMoving(true);
    setIsSlicingAnimation(false);
  }, []);

  return {
    cutStage,
    markerPos,
    isCutMoving,
    isSlicingAnimation,
    ratio1,
    ratio2,
    ratio3,
    handleExecuteCut,
    handleRestartMinigame,
  };
};
