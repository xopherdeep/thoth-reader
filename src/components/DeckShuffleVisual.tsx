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

export const DeckShuffleVisual: React.FC<DeckShuffleVisualProps> = ({
  shuffleCount,
  onShuffle,
  onReset,
  onNextStep,
}) => {
  const [shufflePhase, setShufflePhase] = useState<'idle' | 'split' | 'riffle' | 'bridge' | 'square'>('idle');
  const [shuffleStyle, setShuffleStyle] = useState<ShuffleStyle>('riffle');
  
  const [shuffleState, setShuffleState] = useState<{
    stack: number[],
    leftPile: number[],
    rightPile: number[]
  }>({
    stack: Array.from({length: 12}, (_, i) => i),
    leftPile: Array.from({length: 6}, (_, i) => i),
    rightPile: Array.from({length: 6}, (_, i) => i + 6),
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

  // Generate 30+ rapid micro-impulses for realistic card-by-card riffle interlace
  const generatePokerRiffleHaptics = () => {
    return Array.from({ length: 38 }, () => [5, 8]).flat();
  };

  const generateBridgeWaterfallHaptics = () => {
    return Array.from({ length: 16 }, () => [10, 15]).flat();
  };

  // Handle Shuffle Trigger
  const handleShuffleClick = (styleOverride?: ShuffleStyle) => {
    if (isAnimating) return;

    const activeStyle = styleOverride || shuffleStyle;
    if (styleOverride) setShuffleStyle(styleOverride);

    onShuffle();

    // Compute realistic shuffle interleaving
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
      
      // Real riffle leaves top card dependent on which pile finishes last
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
      // Overhand: Chunks from top dropped to the bottom
      leftPile = currentStack.filter((_, i) => i % 2 === 0);
      rightPile = currentStack.filter((_, i) => i % 2 !== 0);
      
      let remaining = [...currentStack];
      while (remaining.length > 0) {
        const chunkSize = Math.min(remaining.length, Math.floor(Math.random() * 3) + 2);
        const chunk = remaining.splice(0, chunkSize);
        nextStack.unshift(...chunk); // Drop chunks on top of the new pile (which reverses chunk order macroscopically)
      }
    } else {
      // Wash: Chaotic spread
      leftPile = currentStack.filter(() => Math.random() > 0.5);
      rightPile = currentStack.filter(x => !leftPile.includes(x));
      nextStack = [...currentStack].sort(() => Math.random() - 0.5);
    }

    setShuffleState({
      stack: nextStack,
      leftPile,
      rightPile
    });

    // Phase 1: Eyeball Split (0ms - 450ms)
    if (activeStyle === 'riffle') {
      triggerHaptic([20, 25, 15, 30]);
    } else if (activeStyle === 'overhand') {
      triggerHaptic([35, 40, 30]);
    } else {
      triggerHaptic([12, 18, 12, 18, 12]);
    }

    setShufflePhase('split');

    // Phase 2: Riffle Card-by-Card Interlace (450ms - 1100ms)
    setTimeout(() => {
      setShufflePhase('riffle');
      if (activeStyle === 'riffle') {
        triggerHaptic(generatePokerRiffleHaptics());
      } else if (activeStyle === 'overhand') {
        triggerHaptic([35, 45, 40, 45, 45, 45, 35, 40]);
      } else {
        triggerHaptic([8, 12, 8, 12, 8, 12, 8, 12, 8, 12, 8, 12, 8, 12, 8, 12, 8, 12]);
      }
    }, 450);

    // Phase 3: Casino Bridge Waterfall Cascade (1100ms - 1700ms)
    setTimeout(() => {
      if (activeStyle === 'riffle') {
        setShufflePhase('bridge');
        triggerHaptic(generateBridgeWaterfallHaptics());
      } else {
        setShufflePhase('square');
        triggerHaptic([25, 35, 25]);
      }
    }, 1150);

    // Phase 4: Square Deck Edges (1700ms - 2100ms)
    setTimeout(() => {
      setShufflePhase('square');
      triggerHaptic([30, 20, 45]);
    }, 1700);

    // Phase 5: Deck Rested (2100ms)
    setTimeout(() => {
      triggerHaptic(25);
      setShufflePhase('idle');
    }, 2150);
  };

  const renderCardBack = (index: number) => (
    <div
      key={index}
      className="w-36 h-56 sm:w-44 sm:h-64 rounded-sm bg-[#0e0e11] border border-[#c5a059]/70 shadow-2xl overflow-hidden select-none relative transition-all duration-300 group"
    >
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

  const cardIndices = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="bg-[#050505] border border-[#c5a059]/40 p-5 sm:p-8 rounded-sm text-center space-y-6 relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-[#c5a059]/10 via-transparent to-transparent pointer-events-none" />

      <div className="space-y-2 relative z-10">
        <span className="text-[10px] sm:text-xs font-mono text-[#c5a059] uppercase tracking-[0.2em] font-bold block flex items-center justify-center gap-1.5">
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

      <div className="relative h-72 sm:h-80 flex items-center justify-center my-4 select-none overflow-hidden rounded-sm bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#121016] via-[#08080a] to-[#030304] border border-[#c5a059]/20 p-6 shadow-2xl">
        <AnimatePresence>
          {(shufflePhase === 'split' || shufflePhase === 'riffle') && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-4 sm:left-12 top-6 text-xs font-mono text-[#c5a059] bg-[#0e0e11]/90 border border-[#c5a059]/40 px-3 py-1.5 rounded-sm shadow-xl"
              >
                Left Stack (~39 Cards)
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-4 sm:right-12 top-6 text-xs font-mono text-[#c5a059] bg-[#0e0e11]/90 border border-[#c5a059]/40 px-3 py-1.5 rounded-sm shadow-xl"
              >
                Right Stack (~39 Cards)
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="relative w-36 h-56 sm:w-44 sm:h-64 flex items-center justify-center">
          <div className="absolute w-36 h-56 sm:w-44 sm:h-64 bg-black/90 rounded-sm blur-xl translate-y-6" />

          {cardIndices.map((id) => {
            const isLeft = shuffleState.leftPile.includes(id);
            const targetIndex = shuffleState.stack.indexOf(id);
            const pileIndex = isLeft 
              ? shuffleState.leftPile.indexOf(id) 
              : shuffleState.rightPile.indexOf(id);

            // Z-index reflects the calculated new physical stack order
            // This ensures cards interleave properly without visual popping
            const zIndex = 30 - targetIndex;

            let targetX = 0;
            let targetY = -targetIndex * 1.5;
            let targetRotate = 0;
            let targetScale = 1;

            if (shufflePhase === 'split') {
              if (shuffleStyle === 'riffle') {
                targetX = isLeft ? -140 : 140;
                targetY = -pileIndex * 4;
                targetRotate = isLeft ? -12 : 12;
              } else if (shuffleStyle === 'overhand') {
                targetX = isLeft ? -85 : 85;
                targetY = -pileIndex * 8;
                targetRotate = isLeft ? -15 : 15;
              } else {
                targetX = Math.sin(id * 1.3) * 160;
                targetY = Math.cos(id * 1.5) * 60;
                targetRotate = ((id * 30) % 180) - 90;
              }
            } else if (shufflePhase === 'riffle') {
              if (shuffleStyle === 'riffle') {
                // Cards move inwards and interlace
                targetX = (isLeft ? -1 : 1) * Math.max(0, 45 - targetIndex * 4);
                targetY = -targetIndex * 3;
                targetRotate = (isLeft ? -1 : 1) * (12 - targetIndex);
              } else if (shuffleStyle === 'overhand') {
                targetX = isLeft ? -30 : 30;
                targetY = -targetIndex * 4;
                targetRotate = isLeft ? -5 : 5;
              } else {
                targetX = Math.sin(id) * 40;
                targetY = -targetIndex * 3;
                targetRotate = Math.cos(id) * 14;
              }
            } else if (shufflePhase === 'bridge') {
              if (shuffleStyle === 'riffle') {
                // Bridge waterfall arch - cards spring up then fall
                const archY = Math.sin((targetIndex / 11) * Math.PI) * 45;
                targetX = (isLeft ? -1 : 1) * (12 - targetIndex);
                targetY = -archY - targetIndex * 2;
                targetRotate = (isLeft ? -1 : 1) * (8 - targetIndex * 0.5);
                targetScale = 1.05;
              } else {
                targetX = 0;
                targetY = -targetIndex * 1.5;
              }
            } else if (shufflePhase === 'square') {
              targetX = 0;
              targetY = -targetIndex * 1.5;
              targetRotate = 0;
              targetScale = 1.04;
            }

            return (
              <motion.div
                key={id}
                className="absolute inset-0"
                style={{ zIndex }}
                animate={{
                  x: targetX,
                  y: targetY,
                  rotate: targetRotate,
                  scale: targetScale,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 22,
                  delay: isAnimating ? (shufflePhase === 'bridge' ? (11 - targetIndex) * 0.03 : targetIndex * 0.02) : 0,
                }}
              >
                {renderCardBack(id)}
              </motion.div>
            );
          })}

          {isAnimating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.7, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#c5a059]/25 rounded-full blur-3xl pointer-events-none"
            />
          )}
        </div>
      </div>

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




