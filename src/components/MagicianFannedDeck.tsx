import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ThothCard } from '../types';
import { THOTH_DECK } from '../data/thothCards';
import { THOTH_CARD_BACK_IMAGE, getThothCardImageUrl } from '../utils/cardImageUrls';
import { Sparkles, Compass, Check, Shuffle, Eye, ArrowLeft, ArrowRight } from 'lucide-react';

interface MagicianFannedDeckProps {
  selectedSignificatorId: string | null;
  onSelectSignificator: (cardId: string) => void;
  onConfirm: () => void;
  onBackToQuestion?: () => void;
  deck?: ThothCard[];
}

export const MagicianFannedDeck: React.FC<MagicianFannedDeckProps> = ({
  selectedSignificatorId,
  onSelectSignificator,
  onConfirm,
  onBackToQuestion,
  deck = THOTH_DECK,
}) => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Selected card object
  const selectedCard = useMemo(
    () => deck.find((c) => c.id === selectedSignificatorId) || null,
    [deck, selectedSignificatorId]
  );

  // Handle selecting a card from fan
  const handleCardClick = (card: ThothCard) => {
    onSelectSignificator(card.id);
  };

  // Handle random pick ("Let Fate Choose")
  const handleRandomPick = () => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const chosen = deck[randomIndex];
    onSelectSignificator(chosen.id);
  };

  const totalFanCards = deck.length;

  return (
    <div className="space-y-6 w-full">
      {/* RITUAL TITLE */}
      <div className="text-center space-y-1.5 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-[10px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/20 via-[#c5a059]/10 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_20px_rgba(197,160,89,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059] animate-pulse" />
          <span>The Magician's Opening Ritual • Liber T Protocol</span>
        </motion.div>

        <h2 className="atu-font text-2xl sm:text-3xl font-extrabold tracking-wide text-stone-100">
          <span className="bg-gradient-to-r from-[#f5ecd4] via-[#c5a059] to-[#d6b77b] bg-clip-text text-transparent">
            Pick Your Significator Bookmark
          </span>
        </h2>
      </div>

      {/* CONTROL BAR */}
      <div className="flex items-center justify-between gap-3 bg-[#08080c]/90 border border-white/10 rounded-2xl p-2.5 px-4 backdrop-blur-xl">
        <span className="text-[11px] font-mono text-[#c5a059] uppercase tracking-[0.15em] flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>Blind Draw • Hover across the fan to feel your card, click to draw</span>
        </span>

        <button
          onClick={handleRandomPick}
          className="ml-auto px-4 py-2 bg-[#c5a059]/15 hover:bg-[#c5a059]/25 text-[#c5a059] border border-[#c5a059]/40 hover:border-[#c5a059] rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 flex items-center gap-2 shadow-[0_0_15px_rgba(197,160,89,0.1)] active:scale-95 shrink-0 cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Let Fate Choose</span>
        </button>
      </div>

      {/* PARABOLIC ARC DECK CONTAINER */}
      <div className="relative w-full h-[300px] sm:h-[360px] bg-[#050508]/95 border border-[#c5a059]/30 rounded-2xl overflow-hidden shadow-[inset_0_0_90px_rgba(0,0,0,0.95)]">
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[120px] pointer-events-none bg-[#c5a059]/10" />

        {/* FANNED DECK MATH SPREAD */}
        <div className="relative w-full h-full pt-8 pb-4">
          {deck.map((card, idx) => {
            const isSelected = selectedSignificatorId === card.id;
            const isHovered = hoveredCardId === card.id;

            // Parametric Math Spread: 8% to 92% width
            const ratio = idx / (totalFanCards - 1); // 0.0 to 1.0
            const leftPercent = 8 + ratio * 84;
            const archPeakHeight = 100;
            const yOffset = Math.sin(ratio * Math.PI) * archPeakHeight;
            const angle = (ratio - 0.5) * 84; // -42deg to +42deg

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => handleCardClick(card)}
                style={{
                  left: `${leftPercent}%`,
                  bottom: `${20 + yOffset}px`,
                  transformOrigin: '50% 100%',
                  rotate: `${angle}deg`,
                  // ALWAYS respect natural stacking Z-index (even when selected!)
                  zIndex: idx,
                }}
                animate={{
                  scale: isSelected ? 1.06 : 1,
                  // Both hovered and selected pull out by 75% distance (-55px)
                  y: isHovered || isSelected ? -55 : 0,
                  filter: isHovered || isSelected ? 'brightness(1.3)' : 'brightness(0.88)',
                }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className={`absolute -translate-x-1/2 w-12 sm:w-16 md:w-20 h-20 sm:h-26 md:h-30 rounded-xl border cursor-pointer select-none shadow-[0_8px_25px_rgba(0,0,0,0.85)] transition-all ${
                  isSelected
                    ? 'border-[#c5a059] ring-2 ring-[#c5a059] ring-offset-2 ring-offset-black shadow-[0_0_30px_rgba(197,160,89,0.9)]'
                    : isHovered
                    ? 'border-[#c5a059]/90 shadow-[0_0_22px_rgba(197,160,89,0.6)]'
                    : 'border-white/15 hover:border-white/40'
                }`}
              >
                {/* Card Back on hover, Card Front when clicked (selected) */}
                <img
                  src={isSelected ? getThothCardImageUrl(card) : THOTH_CARD_BACK_IMAGE}
                  alt={isSelected ? card.name : 'Tarot Card Back'}
                  className="w-full h-full object-cover rounded-xl pointer-events-none"
                />

                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#c5a059] text-stone-950 flex items-center justify-center shadow-lg z-20">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CONSOLIDATED SINGLE ACTION & CONFIRMATION BAR */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0b0b10] border border-[#c5a059]/40 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onBackToQuestion && (
            <button
              onClick={onBackToQuestion}
              className="px-4 py-3 bg-[#050508] hover:bg-black text-stone-300 hover:text-stone-100 border border-white/10 hover:border-[#c5a059]/40 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Question
            </button>
          )}

          {selectedCard ? (
            <div className="flex items-center gap-3.5 pl-2 border-l border-white/10">
              <div className="w-12 h-18 rounded-lg border border-[#c5a059]/60 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(197,160,89,0.25)]">
                <img
                  src={getThothCardImageUrl(selectedCard)}
                  alt={selectedCard.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-0.5 text-left">
                <span className="text-[9.5px] font-mono text-[#c5a059] uppercase tracking-[0.15em] flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#c5a059]" /> Active Significator
                </span>
                <h3 className="atu-font text-sm sm:text-base font-bold text-stone-100 truncate">
                  {selectedCard.name}: <span className="text-[#c5a059] font-serif font-normal italic">{selectedCard.thothTitle}</span>
                </h3>
              </div>
            </div>
          ) : (
            <span className="text-xs font-mono text-stone-500 italic pl-2 hidden sm:inline">
              Click any card above or press "Let Fate Choose" to pick your Significator bookmark.
            </span>
          )}
        </div>

        <button
          disabled={!selectedCard}
          onClick={onConfirm}
          className={`w-full sm:w-auto px-7 py-3.5 font-bold text-xs font-mono uppercase tracking-[0.15em] rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shrink-0 ${
            selectedCard
              ? 'bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 shadow-[0_4px_24px_rgba(197,160,89,0.3)] hover:shadow-[0_8px_32px_rgba(197,160,89,0.5)] active:scale-95 cursor-pointer animate-ring-pulse'
              : 'bg-white/5 text-stone-600 border border-white/10 opacity-50 cursor-not-allowed'
          }`}
        >
          <span>Confirm Significator & Proceed</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
