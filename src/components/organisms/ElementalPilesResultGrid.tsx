import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Crown, Flame, Droplets, Wind, Mountain, Layers } from 'lucide-react';
import { FourPilesCut } from '../../utils/thothSpread';
import { ThothCard } from '../../types';
import { THOTH_CARD_BACK_IMAGE, getThothCardImageUrl } from '../../utils/cardImageUrls';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

interface ElementalPilesResultGridProps {
  fourPilesCut: FourPilesCut;
  selectedPileId: string | null;
  selectedSignificatorId?: string | null;
  deck: ThothCard[];
  onSelectPile: (pileId: string) => void;
}

export const ElementalPilesResultGrid: React.FC<ElementalPilesResultGridProps> = ({
  fourPilesCut,
  selectedPileId,
  selectedSignificatorId,
  deck,
  onSelectPile,
}) => {
  const { triggerHaptic } = useHapticFeedback();
  
  const significatorCard = selectedSignificatorId ? deck.find((c) => c.id === selectedSignificatorId) : undefined;
  const pileWithSignificator = fourPilesCut.piles.find((p) =>
    p.cards.some((c) => c.id === selectedSignificatorId)
  );

  const getPileVisualConfig = (id: string) => {
    switch (id) {
      case "yod":
        return {
          icon: <Flame className="w-5 h-5 text-rose-400" />,
          glow: "shadow-[0_0_30px_rgba(244,63,94,0.35)] border-rose-500/70 ring-1 ring-rose-500/40",
          accentColor: "#f43f5e",
          bgBadge: "bg-rose-950/90 text-rose-300 border-rose-500/40",
          bottomGradient: "from-rose-600/30 via-rose-950/15 to-transparent",
          symbol: "Fire",
          letterSymbol: "F",
          hebrewLabel: "Yod (Hand)",
          answersText: "Passion, Will & Creative Energy"
        };
      case "heh":
        return {
          icon: <Droplets className="w-5 h-5 text-sky-400" />,
          glow: "shadow-[0_0_30px_rgba(56,189,248,0.35)] border-sky-500/70 ring-1 ring-sky-500/40",
          accentColor: "#38bdf8",
          bgBadge: "bg-sky-950/90 text-sky-300 border-sky-500/40",
          bottomGradient: "from-sky-600/30 via-sky-950/15 to-transparent",
          symbol: "Water",
          letterSymbol: "W",
          hebrewLabel: "Heh (Window)",
          answersText: "Relationships, Emotion & Intuition"
        };
      case "vau":
        return {
          icon: <Wind className="w-5 h-5 text-amber-300" />,
          glow: "shadow-[0_0_30px_rgba(252,211,77,0.35)] border-amber-400/70 ring-1 ring-amber-400/40",
          accentColor: "#fcd34d",
          bgBadge: "bg-amber-950/90 text-amber-300 border-amber-400/40",
          bottomGradient: "from-amber-500/30 via-amber-950/15 to-transparent",
          symbol: "Air",
          letterSymbol: "A",
          hebrewLabel: "Vau (Nail)",
          answersText: "Education, Career, Strategy & Intellect"
        };
      case "heh_final":
        return {
          icon: <Mountain className="w-5 h-5 text-emerald-400" />,
          glow: "shadow-[0_0_30px_rgba(52,211,153,0.35)] border-emerald-500/70 ring-1 ring-emerald-500/40",
          accentColor: "#34d399",
          bgBadge: "bg-emerald-950/90 text-emerald-300 border-emerald-500/40",
          bottomGradient: "from-emerald-600/30 via-emerald-950/15 to-transparent",
          symbol: "Earth",
          letterSymbol: "E",
          hebrewLabel: "Heh Final (Window)",
          answersText: "Physical, Material & Monetary Realities"
        };
      default:
        return {
          icon: <Layers className="w-5 h-5 text-[#c5a059]" />,
          glow: "border-[#c5a059]/40",
          accentColor: "#c5a059",
          bgBadge: "bg-black/60 text-[#c5a059] border-white/10",
          bottomGradient: "from-[#c5a059]/20 via-[#c5a059]/5 to-transparent",
          symbol: "Elemental",
          letterSymbol: "B",
          hebrewLabel: "Tetragrammaton Book",
          answersText: "General Inquiry"
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-7"
    >
      {/* LIBER T SIGNIFICATOR ALIGNMENT REVEAL BANNER */}
      {significatorCard && pileWithSignificator && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[#0c0a06] via-[#1a1409] to-[#0c0a06] border border-[#c5a059]/50 rounded-2xl p-4 sm:p-5 shadow-[0_0_40px_rgba(197,160,89,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-20 rounded-lg border border-[#c5a059] overflow-hidden shrink-0 shadow-[0_0_15px_rgba(197,160,89,0.4)]">
              <img
                src={getThothCardImageUrl(significatorCard)}
                alt={significatorCard.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c5a059] animate-pulse" />
                <span className="text-xs font-mono text-[#c5a059] font-bold uppercase tracking-[0.15em]">
                  Is this your card? Is this your pile?
                </span>
              </div>
              <h4 className="atu-font text-base sm:text-lg font-bold text-stone-100">
                Significator <span className="text-[#c5a059]">{significatorCard.name}</span> Discovered in <span className="text-[#c5a059]">Book of {pileWithSignificator.element.toUpperCase()}</span>!
              </h4>
              <p className="text-xs text-stone-400 font-sans">
                Liber T Alignment Confirmed: Your bookmark card landed in stack {pileWithSignificator.letter} ({pileWithSignificator.hebrewName}), attuning your inquiry directly with Divine Source.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectPile(pileWithSignificator.id)}
            className="px-4 py-2.5 bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#c5a059] border border-[#c5a059]/60 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            <span>Select Aligned Book</span>
          </button>
        </motion.div>
      )}

      {/* 4 COLUMNS ACROSS GRID OF 4 STYLIZED PHYSICAL DECK STACKS */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full"
        dir="rtl"
      >
        {fourPilesCut.piles.map((pile) => {
          const visual = getPileVisualConfig(pile.id);
          const isSelected = selectedPileId === pile.id;
          const cardCount = pile.cards.length;
          const hasSignificator = Boolean(
            selectedSignificatorId &&
              pile.cards.some((c) => c.id === selectedSignificatorId)
          );

          // Stack offset depth layers based on actual card count
          const stackDepthLayers = Math.min(5, Math.max(2, Math.floor(cardCount / 4)));

          return (
            <div
              key={pile.id}
              className="relative group text-left"
              dir="ltr"
            >
              {/* Physical 3D Stack Offset Edge Layers representing exact card pile height */}
              {Array.from({ length: stackDepthLayers }).map((_, idx) => (
                <div
                  key={`stack-depth-${idx}`}
                  className="absolute inset-0 rounded-2xl border border-white/10 bg-[#08080c] pointer-events-none shadow-md transition-transform duration-300"
                  style={{
                    transform: `translate(${(idx + 1) * 2.5}px, ${(idx + 1) * 2.5}px)`,
                    zIndex: 5 - idx
                  }}
                />
              ))}

              {/* Main Full-Size Tarot Card Container */}
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  triggerHaptic([15, 25, 15]);
                  onSelectPile(pile.id);
                }}
                className={`relative z-10 aspect-[1/1.62] p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none overflow-hidden shadow-2xl ${
                  isSelected
                    ? `${visual.glow} ring-2 ring-[#c5a059] shadow-[0_0_45px_rgba(197,160,89,0.35)]`
                    : hasSignificator
                    ? "border-[#c5a059]/70 ring-1 ring-[#c5a059]/40 opacity-100 shadow-[0_0_25px_rgba(197,160,89,0.2)]"
                    : "border-white/20 hover:border-white/45 opacity-95 hover:opacity-100"
                }`}
              >
                {/* Full-Color Thoth Card Back Background Image */}
                <img
                  src={THOTH_CARD_BACK_IMAGE}
                  alt="Thoth Card Back Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/95 pointer-events-none" />
                <div className={`absolute inset-0 bg-gradient-to-t ${visual.bottomGradient} pointer-events-none`} />

                {/* TOP HEADER ROW */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-black/70 border border-[#c5a059]/40 flex items-center justify-center shadow-inner backdrop-blur-md">
                      <span className="text-base font-serif font-bold text-[#c5a059]">
                        {pile.letter}
                      </span>
                    </div>
                    <span className="atu-font text-xs font-bold text-stone-200 tracking-wider">
                      {visual.hebrewLabel}
                    </span>
                  </div>
                </div>

                {/* SIGNIFICATOR BADGE IF CARDS CONTAINS SIGNIFICATOR */}
                {hasSignificator && (
                  <div className="relative z-10 my-1 px-2.5 py-1 bg-[#c5a059] text-stone-950 text-[10px] font-mono font-bold uppercase rounded-full flex items-center justify-between shadow-[0_0_12px_rgba(197,160,89,0.6)]">
                    <span className="flex items-center gap-1 truncate">
                      <Sparkles className="w-3 h-3 shrink-0" /> Significator Inside
                    </span>
                    <Crown className="w-3 h-3 shrink-0" />
                  </div>
                )}

                {/* CENTER NAKED ELEMENTAL ICON & SPACIOUS TITLE LAYOUT */}
                <div className="relative z-10 py-4 my-auto flex flex-col items-center justify-center text-center space-y-1.5 select-none">
                  <div className="p-2 transition-transform duration-300 group-hover:scale-110">
                    <div className="scale-[1.85] filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                      {visual.icon}
                    </div>
                  </div>
                  <h3 className="atu-font text-xl sm:text-2xl font-extrabold tracking-[0.15em] uppercase text-stone-100 drop-shadow-md">
                    BOOK OF {pile.element.toUpperCase()}
                  </h3>
                </div>

                <p className="relative z-10 text-[11px] text-stone-200 leading-relaxed font-sans text-center line-clamp-2 px-1 mb-2 drop-shadow">
                  {pile.description}
                </p>

                {/* BOTTOM CARD COUNT */}
                <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-stone-300">Book of {pile.element}</span>
                  <strong className="text-[#c5a059]">{pile.cards.length} Cards</strong>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
