import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { FourPilesCut } from '../utils/thothSpread';
import { ThothCard } from '../types';
import { THOTH_DECK } from '../data/thothCards';
import { useElementalCutMinigame } from '../hooks/useElementalCutMinigame';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

// Atoms / Molecules / Organisms
import { GlassContainer } from './atoms/GlassContainer';
import { ElementalCutTracker } from './organisms/ElementalCutTracker';
import { ElementalCutArena } from './organisms/ElementalCutArena';
import { ElementalPilesResultGrid } from './organisms/ElementalPilesResultGrid';

interface FourElementalPilesViewProps {
  fourPilesCut: FourPilesCut;
  selectedPileId: string | null;
  onSelectPile: (pileId: string) => void;
  onNextStep: () => void;
  onBackToShuffle: () => void;
  onPerformCutAgain: () => void;
  deck?: ThothCard[];
  onCustomCutPiles?: (result: FourPilesCut) => void;
  selectedSignificatorId?: string | null;
}

export const FourElementalPilesView: React.FC<FourElementalPilesViewProps> = ({
  fourPilesCut,
  selectedPileId,
  onSelectPile,
  onNextStep,
  onBackToShuffle,
  onPerformCutAgain,
  deck = THOTH_DECK,
  onCustomCutPiles,
  selectedSignificatorId
}) => {
  const { triggerHaptic } = useHapticFeedback();
  
  const {
    cutStage,
    markerPos,
    isCutMoving,
    isSlicingAnimation,
    ratio1,
    ratio2,
    ratio3,
    handleExecuteCut,
    handleRestartMinigame,
  } = useElementalCutMinigame(deck, onCustomCutPiles);

  // Math helper for real-time cut accuracy & pile card calculations
  const totalDeckCount = deck.length || 78;
  const currentRatio = 0.3 + (markerPos / 100) * 0.4;
  const pileAPercent = Math.round(currentRatio * 100);
  const pileBPercent = 100 - pileAPercent;
  const deviationFromCenter = Math.abs(markerPos - 50);
  const accuracyScore = Math.max(0, Math.round(100 - deviationFromCenter * 2));

  // Dynamic stack counts calculation for Left-side tracker
  const stackACount = Math.round(totalDeckCount * (cutStage > 1 ? ratio1 : currentRatio));
  const stackBCount = totalDeckCount - stackACount;

  const yodCount =
    cutStage > 2
      ? Math.round(stackACount * ratio2)
      : Math.round(stackACount * (cutStage === 2 ? currentRatio : 0.5));
  const vauCount = stackACount - yodCount;

  const hehCount =
    cutStage === 3 ? Math.round(stackBCount * currentRatio) : Math.round(stackBCount * 0.5);
  const hehFinalCount = stackBCount - hehCount;

  const getAccuracyBadge = () => {
    if (accuracyScore >= 95) {
      return {
        label: "PERFECT CENTER CUT!",
        color: "text-amber-400 border-amber-500/50 bg-amber-950/80 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
      };
    } else if (accuracyScore >= 80) {
      return {
        label: "BALANCED SACRED CUT",
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/60"
      };
    } else {
      return {
        label: "ASYMMETRIC HERMETIC CUT",
        color: "text-[#c5a059] border-[#c5a059]/40 bg-[#c5a059]/10"
      };
    }
  };

  const accuracyBadge = getAccuracyBadge();
  const selectedPile = fourPilesCut.piles.find((p) => p.id === selectedPileId) || fourPilesCut.piles[0];

  return (
    <GlassContainer withOrnament className="space-y-7">
      {/* Background Ambient Glow */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none animate-ambient-pulse"
        style={{
          background: "radial-gradient(ellipse at center, rgba(197,160,89,0.12) 0%, transparent 70%)"
        }}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_12px_rgba(197,160,89,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Step 4 • Elemental Interactive
              4-Pile Cut
            </span>
          </div>
          <h3 className="atu-font text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#f3e7c4] via-[#c5a059] to-[#a37d35] bg-clip-text text-transparent tracking-wide">
            {cutStage === "done"
              ? "Choose Your Elemental Book of Inquiry"
              : cutStage === 1
                ? "First Cut: Slice 78-Card Deck into Fire/Air & Water/Earth Books"
                : cutStage === 2
                  ? "Second Cut: Split Fire & Air Books"
                  : "Third Cut: Split Water & Earth Books"}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300/90 font-serif leading-relaxed max-w-2xl mt-1">
            {cutStage === "done"
              ? "The 78 cards are cut into four elemental books representing Will (Fire), Emotion (Water), Intellect (Air), and Material Reality (Earth)."
              : "Time your cut! Tap the button or press Spacebar when the marker aligns with your intended elemental cut ratio."}
          </p>
        </div>

        <div className="bg-[#050508]/90 px-4 py-2.5 rounded-xl border border-[#c5a059]/30 flex items-center gap-3 shrink-0 shadow-inner">
          <span className="text-[10px] text-stone-400 font-mono uppercase block">Sacred Name:</span>
          <span className="text-sm sm:text-base font-serif text-[#c5a059] font-bold tracking-[0.25em] drop-shadow">
            י • ה • ו • ה
          </span>
        </div>
      </div>

      {/* INTERACTIVE TIMING MINIGAME (STAGES 1, 2, 3) */}
      {cutStage !== "done" && (
        <motion.div
          key={`cut-stage-${cutStage}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 relative z-10"
        >
          {/* Stage Progress Indicator & Precision Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                Cut Sequence Progress:
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${cutStage === 1 ? "bg-[#c5a059] text-stone-950 border-[#c5a059]" : "bg-white/5 text-stone-400 border-white/10"}`}>1. Deck</span>
                <span className="text-stone-600">→</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${cutStage === 2 ? "bg-[#c5a059] text-stone-950 border-[#c5a059]" : "bg-white/5 text-stone-400 border-white/10"}`}>2. Fire / Air</span>
                <span className="text-stone-600">→</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${cutStage === 3 ? "bg-[#c5a059] text-stone-950 border-[#c5a059]" : "bg-white/5 text-stone-400 border-white/10"}`}>3. Water / Earth</span>
              </div>
            </div>

            <span className={`text-[10px] font-mono px-3 py-1 rounded-full border font-bold uppercase ${accuracyBadge.color}`}>
              {accuracyBadge.label}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <ElementalCutTracker 
              cutStage={cutStage}
              stackACount={stackACount}
              stackBCount={stackBCount}
              yodCount={yodCount}
              vauCount={vauCount}
              hehCount={hehCount}
              hehFinalCount={hehFinalCount}
            />

            <ElementalCutArena 
              cutStage={cutStage}
              stackACount={stackACount}
              stackBCount={stackBCount}
              pileAPercent={pileAPercent}
              pileBPercent={pileBPercent}
              isSlicingAnimation={isSlicingAnimation}
              accuracyScore={accuracyScore}
              markerPos={markerPos}
              isCutMoving={isCutMoving}
              handleExecuteCut={handleExecuteCut}
              onBackToShuffle={onBackToShuffle}
            />
          </div>
        </motion.div>
      )}

      {/* FINAL 4 ELEMENTAL PILES SELECTION VIEW (STAGE 'DONE') */}
      {cutStage === "done" && (
        <div className="relative z-10">
          <ElementalPilesResultGrid 
            fourPilesCut={fourPilesCut}
            selectedPileId={selectedPileId}
            selectedSignificatorId={selectedSignificatorId}
            deck={deck}
            onSelectPile={onSelectPile}
          />
          
          {/* BOTTOM ACTION BAR */}
          <div className="pt-5 mt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onBackToShuffle}
                className="px-4 py-3 bg-[#050508] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Shuffle
              </button>

              <button
                onClick={handleRestartMinigame}
                className="px-4 py-3 bg-[#050508] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#c5a059]" /> Re-Cut Books
              </button>
            </div>

            <button
              onClick={() => {
                triggerHaptic(20);
                onNextStep();
              }}
              className="w-full sm:w-auto relative group px-8 py-4 bg-gradient-to-r from-[#c5a059] via-[#b89845] to-[#a37d35] hover:from-[#d6b77b] hover:via-[#c5a059] text-stone-950 font-bold text-xs font-mono uppercase tracking-[0.15em] rounded-xl shadow-[0_4px_24px_rgba(197,160,89,0.25)] flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 animate-ring-pulse overflow-hidden"
            >
              <span>
                Next: Pick Significator in {selectedPile ? selectedPile.name : "Selected Book"}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </GlassContainer>
  );
};
