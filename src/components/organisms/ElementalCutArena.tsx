import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crosshair, ArrowLeft, Scissors } from 'lucide-react';
import { THOTH_CARD_BACK_IMAGE } from '../../utils/cardImageUrls';

interface ElementalCutArenaProps {
  cutStage: 1 | 2 | 3 | 'done';
  stackACount: number;
  stackBCount: number;
  pileAPercent: number;
  pileBPercent: number;
  isSlicingAnimation: boolean;
  accuracyScore: number;
  markerPos: number;
  isCutMoving: boolean;
  handleExecuteCut: () => void;
  onBackToShuffle: () => void;
}

export const ElementalCutArena: React.FC<ElementalCutArenaProps> = ({
  cutStage,
  stackACount,
  stackBCount,
  pileAPercent,
  pileBPercent,
  isSlicingAnimation,
  accuracyScore,
  markerPos,
  isCutMoving,
  handleExecuteCut,
  onBackToShuffle,
}) => {
  if (cutStage === 'done') return null;

  return (
    <div className="lg:col-span-8 bg-[#050509]/90 border border-[#c5a059]/30 rounded-xl p-6 space-y-6 shadow-2xl overflow-hidden">
      {/* CARD DECK VISUAL SLICING ARENA (3D SIDE PROFILE PERSPECTIVE) */}
      <div
        className="relative py-8 px-4 flex flex-col items-center justify-center select-none overflow-hidden bg-black/50 rounded-xl border border-white/10"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 35%" }}
      >
        {/* 3D Stack Stage Container */}
        <div
          className="relative flex items-center justify-center h-72 sm:h-80 w-full max-w-xs my-2 transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(44deg) rotateZ(-12deg)"
          }}
        >
          <div className="absolute w-44 sm:w-52 h-64 sm:h-72 bg-black/95 rounded-xl blur-2xl translate-y-8" />

          {/* Laser Slice Beam Line */}
          <AnimatePresence>
            {isSlicingAnimation && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent shadow-[0_0_20px_#c5a059] z-50 pointer-events-none"
                style={{ top: `${100 - pileAPercent}%` }}
              />
            )}
          </AnimatePresence>

          {/* BOTTOM DECK STACK (Remaining Stack B) */}
          <motion.div
            animate={{
              x: isSlicingAnimation ? 70 : 0,
              y: isSlicingAnimation ? 12 : 0,
              rotateZ: isSlicingAnimation ? 4 : 0
            }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="relative w-44 sm:w-52 h-64 sm:h-72 rounded-xl border border-[#c5a059]/70 bg-[#0e0e11] shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Layered Card Edge Rims for Realistic 78-Card Deck Thickness */}
            {Array.from({ length: Math.max(3, Math.min(12, Math.round((stackBCount / 78) * 12))) }).map((_, idx) => (
              <div
                key={`bottom-rim-${idx}`}
                className="absolute inset-0 rounded-xl border-b border-r border-[#c5a059]/40 bg-[#0c0c10] pointer-events-none"
                style={{
                  transform: `translate3d(0px, ${(idx + 1) * 2.2}px, -${(idx + 1) * 2.2}px)`,
                  background: 'linear-gradient(135deg, #14121a 0%, #070709 100%)',
                }}
              />
            ))}

            <img
              src={THOTH_CARD_BACK_IMAGE}
              alt="Bottom Deck Stack"
              className="w-full h-full object-cover opacity-95 rounded-xl relative z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0e]/70 via-transparent to-transparent pointer-events-none z-10" />
            
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#c5a059] font-bold bg-black/90 px-3 py-1 rounded-md border border-[#c5a059]/40 shadow-xl z-20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
              <span>
                {cutStage === 1
                  ? "Water & Earth"
                  : cutStage === 2
                    ? "Air Book"
                    : "Earth Book"}
              </span>
              <span className="text-white/60">({stackBCount} Cards)</span>
            </div>
          </motion.div>

          {/* TOP DECK STACK (Lifting Cut Stack A) */}
          <motion.div
            animate={{
              x: isSlicingAnimation ? -90 : 0,
              y: isSlicingAnimation ? -35 : 0,
              z: isSlicingAnimation ? 90 : Math.round((stackBCount / 78) * 28) + 6,
              rotateX: isSlicingAnimation ? -12 : 0,
              rotateY: isSlicingAnimation ? -16 : 0
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute w-44 sm:w-52 h-64 sm:h-72 rounded-xl border border-[#c5a059]/90 bg-[#0e0e11] shadow-2xl z-30"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Layered Card Edge Rims for Top Cut Stack */}
            {Array.from({ length: Math.max(3, Math.min(12, Math.round((stackACount / 78) * 12))) }).map((_, idx) => (
              <div
                key={`top-rim-${idx}`}
                className="absolute inset-0 rounded-xl border-b border-r border-[#c5a059]/50 bg-[#0e0e12] pointer-events-none"
                style={{
                  transform: `translate3d(0px, ${(idx + 1) * 2.2}px, -${(idx + 1) * 2.2}px)`,
                  background: 'linear-gradient(135deg, #181622 0%, #09090d 100%)',
                }}
              />
            ))}

            <img
              src={THOTH_CARD_BACK_IMAGE}
              alt="Top Deck Stack"
              className="w-full h-full object-cover opacity-95 rounded-xl relative z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-tl from-[#0a0a0e]/70 via-transparent to-transparent pointer-events-none z-10" />
            
            <div className="absolute top-3 left-3 text-[10px] font-mono text-amber-300 font-bold bg-black/90 px-3 py-1 rounded-md border border-amber-400/50 shadow-xl z-20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{cutStage === 1 ? "Fire & Air" : cutStage === 2 ? "Fire Book" : "Water Book"}</span>
              <span className="text-white/60">({stackACount} Cards)</span>
            </div>
          </motion.div>
        </div>

        {/* Live Cut Ratio & Card Count Readout */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono text-stone-300 relative z-20">
          <span className="bg-black/60 px-3 py-1 rounded-md border border-white/10">
            Stack A: <strong className="text-amber-400">{stackACount} Cards ({pileAPercent}%)</strong>
          </span>
          <span className="text-stone-600">•</span>
          <span className="bg-black/60 px-3 py-1 rounded-md border border-white/10">
            Stack B: <strong className="text-[#c5a059]">{stackBCount} Cards ({pileBPercent}%)</strong>
          </span>
          <span className="text-stone-600">•</span>
          <span>
            Accuracy: <strong className="text-amber-400">{accuracyScore}%</strong>
          </span>
        </div>
      </div>

      {/* INTERACTIVE PENDULUM SLIDER TIMING TRACK BAR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
          <span className="flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-[#c5a059]" /> 30% Threshold
          </span>
          <span className="text-amber-400 font-bold">50% Center Target</span>
          <span className="flex items-center gap-1.5">
            70% Threshold <Crosshair className="w-3.5 h-3.5 text-[#c5a059]" />
          </span>
        </div>

        {/* Pendulum Track Bar */}
        <div
          onClick={handleExecuteCut}
          className="relative h-6 bg-[#030305] border border-white/15 rounded-full overflow-hidden cursor-pointer shadow-inner group/track"
        >
          {/* Center Target Indicator Bar */}
          <div className="absolute top-0 bottom-0 left-[48%] right-[48%] bg-[#c5a059]/30 border-x border-[#c5a059]/60" />

          {/* Threshold Zone (30% to 70%) */}
          <div className="absolute top-0 bottom-0 left-[30%] right-[30%] bg-gradient-to-r from-[#c5a059]/10 via-[#c5a059]/20 to-[#c5a059]/10 pointer-events-none" />

          {/* Oscillation Marker Indicator */}
          <div
            className="absolute top-0 bottom-0 w-4 -ml-2 bg-gradient-to-r from-[#d6b77b] via-[#c5a059] to-[#936e2d] rounded-full shadow-[0_0_15px_#c5a059] transition-transform duration-75"
            style={{ left: `${markerPos}%` }}
          />
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onBackToShuffle}
          className="px-4 py-2.5 bg-[#050505] hover:bg-black text-stone-400 hover:text-stone-200 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Back
        </button>

        <button
          onClick={handleExecuteCut}
          disabled={!isCutMoving}
          className="w-full sm:w-auto relative group px-8 py-4 bg-gradient-to-r from-[#c5a059] via-[#b89845] to-[#a37d35] hover:from-[#d6b77b] hover:via-[#c5a059] hover:to-[#b08940] text-stone-950 font-bold text-xs font-mono uppercase tracking-[0.15em] rounded-xl shadow-[0_4px_24px_rgba(197,160,89,0.25)] flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 animate-ring-pulse disabled:opacity-50"
        >
          <Scissors className="w-4 h-4" />
          <span>
            {cutStage === 1
              ? "TAP TO CUT DECK (SPACE)"
              : cutStage === 2
                ? "TAP TO CUT FIRE & AIR BOOKS (SPACE)"
                : "TAP TO CUT WATER & EARTH BOOKS (SPACE)"}
          </span>
        </button>
      </div>
    </div>
  );
};
