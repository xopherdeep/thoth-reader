import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThothCard } from '../types';
import { THOTH_CARD_BACK_IMAGE } from '../utils/cardImageUrls';
import {
  Shuffle,
  Sparkles,
  Check,
  RotateCcw,
  ArrowRight,
  Flame,
  Layers,
  Droplets,
} from 'lucide-react';

interface DeckShuffleVisualProps {
  deck: ThothCard[];
  shuffleCount: number;
  onShuffle: () => void;
  onReset: () => void;
  onNextStep: () => void;
  onSetDeck?: (newDeck: ThothCard[]) => void;
}

type ShuffleStyle = 'riffle' | 'overhand' | 'wash';
type ShufflePhase = 'idle' | 'split' | 'riffle' | 'bridge' | 'waterfall' | 'square';

interface BentCardBackProps {
  bendAmount: number; // -1 to 1 (-1 = convex bridge arch, +1 = concave thumb lift)
}

const CARD_COUNT = 32;
const SLICE_COUNT = 8;
const SLICE_INDICES = Array.from({ length: SLICE_COUNT }, (_, i) => i);

const BentCardBack: React.FC<BentCardBackProps> = ({ bendAmount }) => {
  const absBend = Math.abs(bendAmount);

  if (absBend < 0.02) {
    return (
      <div className="w-32 h-48 sm:w-36 sm:h-56 rounded-sm bg-[#0e0e11] border border-[#c5a059]/70 shadow-xl overflow-hidden select-none relative transition-all duration-200">
        <img
          src={THOTH_CARD_BACK_IMAGE}
          alt="Thoth Card Back"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-xs"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 border border-[#c5a059]/30 rounded-xs pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      className="w-32 h-48 sm:w-36 sm:h-56 rounded-sm relative select-none shadow-xl border border-[#c5a059]/60"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {SLICE_INDICES.map((sliceIndex) => {
        const progress = (sliceIndex + 0.5) / SLICE_COUNT;
        const archSin = Math.sin(progress * Math.PI);
        const archCos = Math.cos(progress * Math.PI);

        // Convex arch: middle rises UP (+Z towards viewer), slice edges tilt downward
        const direction = bendAmount >= 0 ? 1 : -1;
        const rotateX = -archCos * bendAmount * 32;
        const translateZ = archSin * absBend * 28 * direction;

        const sliceHeightPercent = 100 / SLICE_COUNT + 0.5; // +0.5% overlap prevents slice gap seams
        const sliceTopPercent = (sliceIndex / SLICE_COUNT) * 100;

        return (
          <div
            key={sliceIndex}
            className="absolute left-0 right-0 overflow-hidden bg-[#0e0e11]"
            style={{
              top: `${sliceTopPercent}%`,
              height: `${sliceHeightPercent}%`,
              transformStyle: 'preserve-3d',
              transform: `translateZ(${translateZ}px) rotateX(${rotateX}deg)`,
              backfaceVisibility: 'hidden',
              willChange: 'transform',
            }}
          >
            <div
              className="absolute left-0 right-0 w-full"
              style={{
                top: `-${sliceIndex * 100}%`,
                height: `${SLICE_COUNT * 100}%`,
              }}
            >
              <img
                src={THOTH_CARD_BACK_IMAGE}
                alt="Thoth Card Back Slice"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 border border-[#c5a059]/30 pointer-events-none" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const DeckShuffleVisual: React.FC<DeckShuffleVisualProps> = ({
  shuffleCount,
  onShuffle,
  onReset,
  onNextStep,
}) => {
  const [shufflePhase, setShufflePhase] = useState<ShufflePhase>('idle');
  const [shuffleStyle, setShuffleStyle] = useState<ShuffleStyle>('riffle');

  const [shuffleState, setShuffleState] = useState<{
    stack: number[];
    leftPile: number[];
    rightPile: number[];
    reversedCards: Record<number, boolean>;
  }>({
    stack: Array.from({ length: CARD_COUNT }, (_, i) => i),
    leftPile: Array.from({ length: CARD_COUNT / 2 }, (_, i) => i),
    rightPile: Array.from({ length: CARD_COUNT / 2 }, (_, i) => i + CARD_COUNT / 2),
    reversedCards: {},
  });

  const triggerHaptic = (pattern: number | number[] = 15) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe fallback
      }
    }
  };

  const isAnimating = shufflePhase !== 'idle';

  const generatePokerRiffleHaptics = () => {
    return Array.from({ length: 38 }, () => [5, 8]).flat();
  };

  const generateBridgeWaterfallHaptics = () => {
    return Array.from({ length: 16 }, () => [10, 15]).flat();
  };

  const handleShuffleClick = (styleOverride?: ShuffleStyle) => {
    if (isAnimating) return;

    const activeStyle = styleOverride || shuffleStyle;
    if (styleOverride) setShuffleStyle(styleOverride);

    onShuffle();

    const currentStack = shuffleState.stack;
    let leftPile: number[] = [];
    let rightPile: number[] = [];
    let nextStack: number[] = [];

    if (activeStyle === 'riffle') {
      const splitPoint = Math.floor(currentStack.length / 2) + (Math.random() > 0.5 ? 1 : -1);
      leftPile = currentStack.slice(0, splitPoint);
      rightPile = currentStack.slice(splitPoint);

      let l = [...leftPile];
      let r = [...rightPile];

      while (l.length > 0 || r.length > 0) {
        if (l.length > 0 && r.length > 0) {
          if (Math.random() > 0.5) nextStack.push(l.shift()!);
          else nextStack.push(r.shift()!);
        } else if (l.length > 0) {
          nextStack.push(l.shift()!);
        } else {
          nextStack.push(r.shift()!);
        }
      }
    } else if (activeStyle === 'overhand') {
      leftPile = currentStack.filter((_, i) => i % 2 === 0);
      rightPile = currentStack.filter((_, i) => i % 2 !== 0);

      let remaining = [...currentStack];
      while (remaining.length > 0) {
        const chunkSize = Math.min(remaining.length, Math.floor(Math.random() * 3) + 2);
        const chunk = remaining.splice(0, chunkSize);
        nextStack.unshift(...chunk);
      }
    } else {
      leftPile = currentStack.filter(() => Math.random() > 0.5);
      rightPile = currentStack.filter((x) => !leftPile.includes(x));
      nextStack = [...currentStack].sort(() => Math.random() - 0.5);
    }

    // Randomize 180° tarot card reversals during shuffle
    const newReversedCards = { ...shuffleState.reversedCards };
    const flipRightPile = Math.random() > 0.45;
    if (flipRightPile) {
      rightPile.forEach((cardId) => {
        newReversedCards[cardId] = !newReversedCards[cardId];
      });
    } else {
      leftPile.forEach((cardId) => {
        if (Math.random() > 0.35) {
          newReversedCards[cardId] = !newReversedCards[cardId];
        }
      });
    }

    setShuffleState({
      stack: nextStack,
      leftPile,
      rightPile,
      reversedCards: newReversedCards,
    });

    // Phase 1: Split (0ms - 500ms)
    triggerHaptic(activeStyle === 'riffle' ? [20, 25, 15, 30] : [35, 40, 30]);
    setShufflePhase('split');

    // Phase 2: Riffle Card Interlace (500ms - 1200ms)
    setTimeout(() => {
      setShufflePhase('riffle');
      if (activeStyle === 'riffle') {
        triggerHaptic(generatePokerRiffleHaptics());
      } else {
        triggerHaptic([12, 18, 12, 18, 12]);
      }
    }, 500);

    // Phase 3: Pressing Halves into 3D Bridge Arch (1200ms - 1700ms)
    setTimeout(() => {
      if (activeStyle === 'riffle') {
        setShufflePhase('bridge');
        triggerHaptic([25, 30, 20]);
      } else {
        setShufflePhase('square');
        triggerHaptic([25, 35, 25]);
      }
    }, 1200);

    // Phase 3b: Waterfall Release (1700ms - 2450ms) - Cards drop bottom-to-top underneath the arch to form pile!
    setTimeout(() => {
      if (activeStyle === 'riffle') {
        setShufflePhase('waterfall');
        triggerHaptic(generateBridgeWaterfallHaptics());
      }
    }, 1700);

    // Phase 4: Square Deck (2450ms - 2850ms)
    setTimeout(() => {
      setShufflePhase('square');
      triggerHaptic([30, 20, 45]);
    }, 2450);

    // Phase 5: Complete & Idle (2850ms)
    setTimeout(() => {
      triggerHaptic(25);
      setShufflePhase('idle');
    }, 2850);
  };

  const cardIndices = Array.from({ length: CARD_COUNT }, (_, i) => i);

  const getPhaseDescription = () => {
    switch (shufflePhase) {
      case 'split':
        return 'Dealer Split (Fire & Air / Water & Earth)';
      case 'riffle':
        return 'Card-by-Card 15% Tip Interlace';
      case 'bridge':
        return 'Pressing Halves into 3D Bridge Arch';
      case 'waterfall':
        return 'Waterfall Cascade Release (Cards Dropping Underneath Arch)';
      case 'square':
        return 'Squaring Deck Edges';
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#050505] border border-[#c5a059]/40 p-5 sm:p-8 rounded-sm text-center space-y-6 relative shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-[#c5a059]/10 via-transparent to-transparent pointer-events-none" />

      <div className="space-y-2 relative z-10">
        <span className="text-[10px] sm:text-xs font-mono text-[#c5a059] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Ritual Stage I: Randomize & Charge
        </span>
        <h3 className="atu-font text-2xl sm:text-3xl font-bold text-[#c5a059] tracking-wide">
          Shuffle the 78-Card Thoth Deck
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto font-serif">
          Select your preferred shuffling style below to randomize the deck with tactile haptic energy before moving into the 4-elemental pile cut.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 relative z-10">
        <button
          onClick={() => {
            triggerHaptic(12);
            setShuffleStyle('riffle');
          }}
          disabled={isAnimating}
          className={`px-4 py-2 rounded-sm border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            shuffleStyle === 'riffle'
              ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] shadow-lg scale-105'
              : 'bg-[#0e0e11] hover:bg-black text-stone-300 border-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Classic Poker Riffle & Bridge</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic(12);
            setShuffleStyle('overhand');
          }}
          disabled={isAnimating}
          className={`px-4 py-2 rounded-sm border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            shuffleStyle === 'overhand'
              ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] shadow-lg scale-105'
              : 'bg-[#0e0e11] hover:bg-black text-stone-300 border-white/10'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Overhand Cascade</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic(12);
            setShuffleStyle('wash');
          }}
          disabled={isAnimating}
          className={`px-4 py-2 rounded-sm border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            shuffleStyle === 'wash'
              ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] shadow-lg scale-105'
              : 'bg-[#0e0e11] hover:bg-black text-stone-300 border-white/10'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Alchemical Chaos Wash</span>
        </button>
      </div>

      {/* 3D Stage Viewport - Expanded dimensions & zero clipping */}
      <div
        className="relative h-[440px] sm:h-[500px] flex items-center justify-center my-2 select-none rounded-sm bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#14121a] via-[#09090c] to-[#030304] border border-[#c5a059]/30 p-4 shadow-2xl overflow-visible"
        style={{ perspective: '1100px', perspectiveOrigin: '50% 38%' }}
      >
        <AnimatePresence>
          {isAnimating && getPhaseDescription() && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-mono text-[#c5a059] bg-[#0e0e11]/95 border border-[#c5a059]/50 px-4 py-1.5 rounded-sm shadow-2xl z-50 tracking-wider uppercase font-semibold flex items-center gap-2"
            >
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              <span>{getPhaseDescription()}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(shufflePhase === 'split' || shufflePhase === 'riffle') && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-3 sm:left-10 top-12 text-[11px] font-mono text-[#c5a059] bg-[#0e0e11]/90 border border-[#c5a059]/40 px-3 py-1 rounded-sm shadow-xl z-40 hidden sm:block"
              >
                Fire & Air Books (~39 Cards)
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-3 sm:right-10 top-12 text-[11px] font-mono text-[#c5a059] bg-[#0e0e11]/90 border border-[#c5a059]/40 px-3 py-1 rounded-sm shadow-xl z-40 hidden sm:block"
              >
                Water & Earth Books (~39 Cards)
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 3D Tabletop Stage Frame */}
        <div
          className="relative w-32 h-48 sm:w-36 sm:h-56 flex items-center justify-center scale-90 sm:scale-95"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(34deg) rotateZ(-6deg)',
          }}
        >
          {/* Tabletop Surface Shadow */}
          <div className="absolute w-52 h-72 sm:w-64 sm:h-80 bg-black/90 rounded-full blur-2xl translate-y-12 pointer-events-none" />

          {cardIndices.map((id) => {
            const isLeft = shuffleState.leftPile.includes(id);
            const targetIndex = shuffleState.stack.indexOf(id);
            const pileIndex = isLeft
              ? shuffleState.leftPile.indexOf(id)
              : shuffleState.rightPile.indexOf(id);

            // Stacking order in 3D: Ensure strict Z separation to prevent depth z-fighting
            const stackingZ = targetIndex * 2.2;
            const visualZIndex = 50 + targetIndex;

            let targetX = 0;
            let targetY = 0;
            let targetZ = stackingZ;
            let targetRotateX = 0;
            let targetRotateY = 0;
            let targetRotateZ = 0;
            let targetScale = 1;
            let bendAmount = 0;

            if (shufflePhase === 'split') {
              if (shuffleStyle === 'riffle') {
                // Horizontal Dealer split: Turn cards 90deg so short horizontal ends face center
                targetX = isLeft ? -120 : 120;
                targetY = 0;
                targetZ = pileIndex * 2.2 + 10;
                targetRotateX = 12;
                targetRotateY = isLeft ? -15 : 15;
                targetRotateZ = isLeft ? 90 : -90; // Turned landscape so short horizontal ends face center!
                bendAmount = 0; // Flat cards during split
              } else if (shuffleStyle === 'overhand') {
                targetX = isLeft ? -95 : 95;
                targetY = isLeft ? -15 : 15;
                targetZ = pileIndex * 2.5 + 10;
                targetRotateY = isLeft ? -16 : 16;
                targetRotateZ = isLeft ? 85 : -85;
                bendAmount = 0;
              } else {
                // Wash split
                const washAngle = (id / CARD_COUNT) * Math.PI * 2;
                targetX = Math.cos(washAngle) * 125;
                targetY = Math.sin(washAngle) * 55;
                targetZ = id * 1.8;
                targetRotateZ = ((id * 30) % 180) - 90;
                bendAmount = 0;
              }
            } else if (shufflePhase === 'riffle') {
              if (shuffleStyle === 'riffle') {
                // Short-edge 15% tip interlace: Short horizontal ends overlap by only ~15% at center line
                targetX = (isLeft ? -1 : 1) * (62 + (targetIndex % 3) * 1.5);
                targetY = (targetIndex % 2 === 0 ? -3 : 3);
                targetZ = targetIndex * 2.4;
                targetRotateX = 10;
                targetRotateY = (isLeft ? -1 : 1) * Math.max(0, 12 - targetIndex * 0.4);
                targetRotateZ = isLeft ? 90 : -90; // Short ends facing center with 15% edge overlap
                bendAmount = 0; // Flat cards during 15% tip interlace
              } else if (shuffleStyle === 'overhand') {
                targetX = isLeft ? -40 : 40;
                targetY = -targetIndex * 1.2;
                targetZ = targetIndex * 2.2;
                targetRotateY = isLeft ? -5 : 5;
                targetRotateZ = isLeft ? 85 : -85;
                bendAmount = 0;
              } else {
                targetX = Math.sin(id) * 30;
                targetY = Math.cos(id) * 18;
                targetZ = targetIndex * 2.2;
                targetRotateZ = Math.cos(id) * 10;
                bendAmount = 0;
              }
            } else if (shufflePhase === 'bridge') {
              if (shuffleStyle === 'riffle') {
                // Casino Bridge Arch: Hands compress piles inward, arching cards UP in 3D
                const archNormalized = Math.sin((targetIndex / (CARD_COUNT - 1)) * Math.PI);
                const archZ = archNormalized * 85;
                targetX = (isLeft ? -1 : 1) * Math.max(6, 18 - (CARD_COUNT - 1 - targetIndex) * 0.4);
                targetY = 0;
                targetZ = 40 + archZ + targetIndex * 1.5;
                targetRotateX = archNormalized * -32;
                targetRotateY = (isLeft ? -1 : 1) * (6 - targetIndex * 0.2);
                targetRotateZ = isLeft ? 90 : -90;
                targetScale = 1.04;
                bendAmount = 0.95; // Convex bridge arch UP in mid-air
              } else {
                targetX = 0;
                targetY = 0;
                targetZ = targetIndex * 2.2;
                bendAmount = 0;
              }
            } else if (shufflePhase === 'waterfall') {
              if (shuffleStyle === 'riffle') {
                // Waterfall Cascade Release: Bottom cards release FIRST, dropping straight down
                // UNDERNEATH the arch into a single neat stack on the table surface!
                targetX = 0;
                targetY = 0;
                targetZ = targetIndex * 2.2;
                targetRotateX = 0;
                targetRotateY = 0;
                targetRotateZ = isLeft ? 90 : -90;
                targetScale = 1.0;
                bendAmount = 0; // Flattens as it lands on the stack underneath!
              } else {
                targetX = 0;
                targetY = 0;
                targetZ = targetIndex * 2.2;
                bendAmount = 0;
              }
            } else if (shufflePhase === 'square') {
              targetX = 0;
              targetY = 0;
              targetZ = targetIndex * 2.2;
              targetRotateX = 0;
              targetRotateY = 0;
              targetRotateZ = 0;
              targetScale = 1.01;
              bendAmount = 0;
            }

            // Apply 180° reversal rotation if card was turned upside down during shuffle
            const isCardReversed = !!shuffleState.reversedCards[id];
            if (isCardReversed) {
              targetRotateZ += 180;
            }

            return (
              <motion.div
                key={id}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  zIndex: visualZIndex,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
                animate={{
                  x: targetX,
                  y: targetY,
                  z: targetZ,
                  rotateX: targetRotateX,
                  rotateY: targetRotateY,
                  rotateZ: targetRotateZ,
                  scale: targetScale,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 26,
                  delay: isAnimating
                    ? shufflePhase === 'waterfall'
                      ? targetIndex * 0.016 // Bottom cards release FIRST, dropping to pile underneath!
                      : shufflePhase === 'bridge'
                      ? (CARD_COUNT - 1 - targetIndex) * 0.008
                      : targetIndex * 0.012
                    : 0,
                }}
              >
                <BentCardBack bendAmount={bendAmount} />
              </motion.div>
            );
          })}

          {isAnimating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.75, scale: 1.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#c5a059]/20 rounded-full blur-3xl pointer-events-none"
            />
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#0e0e11] border border-[#c5a059]/40 px-3.5 py-2 rounded-sm flex items-center gap-2 text-xs font-mono text-[#c5a059]">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>
              {shuffleCount === 0
                ? 'Deck Ready'
                : `Shuffled ${shuffleCount} ${shuffleCount === 1 ? 'time' : 'times'}`}
            </span>
          </div>

          <button
            onClick={() => {
              triggerHaptic(15);
              setShuffleState((prev) => ({ ...prev, reversedCards: {} }));
              onReset();
            }}
            disabled={isAnimating}
            className="px-3 py-2 bg-[#0e0e11] hover:bg-black text-stone-400 border border-white/10 text-xs font-mono rounded-sm transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Deck
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleShuffleClick()}
            disabled={isAnimating}
            className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-[#c5a059] via-amber-400 to-[#c5a059] text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 hover:brightness-110"
          >
            <Shuffle className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
            <span>{shuffleCount === 0 ? 'Shuffle Cards Now' : 'Shuffle Again'}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic(15);
              onNextStep();
            }}
            disabled={isAnimating}
            className="flex-1 sm:flex-initial px-6 py-3 bg-[#0e0e11] hover:bg-black text-stone-100 border border-[#c5a059]/60 font-mono text-xs font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition hover:bg-[#181612]"
          >
            <span>Proceed to 4-Pile Cut</span>
            <ArrowRight className="w-4 h-4 text-[#c5a059]" />
          </button>
        </div>
      </div>
    </div>
  );
};




