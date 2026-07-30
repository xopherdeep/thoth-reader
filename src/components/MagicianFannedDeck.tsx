import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThothCard } from '../types';
import { THOTH_DECK } from '../data/thothCards';
import { THOTH_CARD_BACK_IMAGE, getThothCardImageUrl } from '../utils/cardImageUrls';
import { Sparkles, Compass, Check, Shuffle, Crown, Flame, Filter, Eye } from 'lucide-react';

interface MagicianFannedDeckProps {
  selectedSignificatorId: string | null;
  onSelectSignificator: (cardId: string) => void;
  onConfirm: () => void;
  deck?: ThothCard[];
}

type FilterCategory = 'fan' | 'court' | 'major' | 'all';

export const MagicianFannedDeck: React.FC<MagicianFannedDeckProps> = ({
  selectedSignificatorId,
  onSelectSignificator,
  onConfirm,
  deck = THOTH_DECK,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('fan');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Selected card object
  const selectedCard = useMemo(
    () => deck.find((c) => c.id === selectedSignificatorId) || null,
    [deck, selectedSignificatorId]
  );

  // Filtered cards list for grid views
  const filteredCards = useMemo(() => {
    if (activeFilter === 'court') {
      return deck.filter((c) => c.category === 'Court' || c.type === 'court');
    }
    if (activeFilter === 'major') {
      return deck.filter(
        (c) =>
          c.category === 'Elemental' ||
          c.category === 'Planetary' ||
          c.category === 'Zodiac' ||
          c.type === 'major'
      );
    }
    return deck;
  }, [deck, activeFilter]);

  // Handle selecting a card from fan or grid
  const handleCardClick = (card: ThothCard) => {
    onSelectSignificator(card.id);
  };

  // Handle random pick ("Let Fate Choose")
  const handleRandomPick = () => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const chosen = deck[randomIndex];
    onSelectSignificator(chosen.id);
  };

  // Calculations for fanning out cards in a magician arc
  const fanCards = deck;
  const totalFanCards = fanCards.length;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/20 via-[#c5a059]/10 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_20px_rgba(197,160,89,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059] animate-pulse" />
          <span>The Magician's Opening Ritual</span>
          <span className="w-1 h-1 rounded-full bg-[#c5a059]/60" />
          <span>Liber T Protocol</span>
        </motion.div>

        <h2 className="atu-font text-3xl sm:text-4xl font-extrabold tracking-wide text-stone-100">
          <span className="bg-gradient-to-r from-[#f5ecd4] via-[#c5a059] to-[#d6b77b] bg-clip-text text-transparent">
            Pick a Card, Any Card!
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-stone-400 font-serif leading-relaxed">
          Before the deck is shuffled and cut into the 4 Elemental Books, choose your Significator card to act as your narrative bookmark placer. In Liber T, when your card lands in the pile matching your inquiry, divine alignment is confirmed.
        </p>
      </div>

      {/* FILTER & RANDOM CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#08080c]/90 border border-white/10 rounded-2xl p-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveFilter('fan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeFilter === 'fan'
                ? 'bg-[#c5a059] text-stone-950 font-bold shadow-[0_0_12px_rgba(197,160,89,0.4)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-stone-400 border border-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Fanned Deck</span>
          </button>

          <button
            onClick={() => setActiveFilter('court')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeFilter === 'court'
                ? 'bg-[#c5a059] text-stone-950 font-bold shadow-[0_0_12px_rgba(197,160,89,0.4)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-stone-400 border border-white/5'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Court Cards (16 Querents)</span>
          </button>

          <button
            onClick={() => setActiveFilter('major')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeFilter === 'major'
                ? 'bg-[#c5a059] text-stone-950 font-bold shadow-[0_0_12px_rgba(197,160,89,0.4)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-stone-400 border border-white/5'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Major Atu (22 Archetypes)</span>
          </button>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeFilter === 'all'
                ? 'bg-[#c5a059] text-stone-950 font-bold shadow-[0_0_12px_rgba(197,160,89,0.4)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-stone-400 border border-white/5'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>All 78 Cards</span>
          </button>
        </div>

        <button
          onClick={handleRandomPick}
          className="ml-auto px-4 py-2 bg-[#c5a059]/15 hover:bg-[#c5a059]/25 text-[#c5a059] border border-[#c5a059]/40 hover:border-[#c5a059] rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 flex items-center gap-2 shadow-[0_0_15px_rgba(197,160,89,0.1)] active:scale-95 shrink-0"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Let Fate Choose</span>
        </button>
      </div>

      {/* ACTIVE VIEW AREA */}
      {activeFilter === 'fan' ? (
        /* MAGICIAN FANNED DECK INTERACTIVE VIEW */
        <div className="relative min-h-[340px] sm:min-h-[420px] bg-[#050508]/80 border border-[#c5a059]/20 rounded-2xl p-4 flex flex-col items-center justify-end overflow-hidden shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
          {/* Ambient Background Light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none bg-[#c5a059]/10" />

          {/* Instruction hint */}
          <div className="absolute top-4 text-center z-10 space-y-1">
            <span className="text-[11px] font-mono text-[#c5a059] uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Hover across the fan to inspect, click to draw
            </span>
            {hoveredCardId && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-serif text-stone-200 italic font-bold"
              >
                {deck.find((c) => c.id === hoveredCardId)?.name} (
                {deck.find((c) => c.id === hoveredCardId)?.thothTitle})
              </motion.div>
            )}
          </div>

          {/* FANNED DECK CONTAINER */}
          <div className="relative w-full max-w-4xl h-[260px] sm:h-[320px] flex items-end justify-center pt-8">
            {fanCards.map((card, idx) => {
              const isSelected = selectedSignificatorId === card.id;
              const isHovered = hoveredCardId === card.id;

              // Arc math: spread across -65deg to +65deg
              const angleRange = 130;
              const startAngle = -65;
              const angleStep = angleRange / (totalFanCards - 1);
              const angle = startAngle + idx * angleStep;

              // Offset Y for arc curve
              const arcRad = (angle * Math.PI) / 180;
              const offsetY = Math.abs(Math.sin(arcRad)) * 32;

              return (
                <motion.div
                  key={card.id}
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => handleCardClick(card)}
                  style={{
                    transformOrigin: '50% 120%',
                    rotate: `${angle}deg`,
                    y: isHovered ? -48 : isSelected ? -36 : -offsetY,
                    zIndex: isHovered || isSelected ? 100 : idx,
                  }}
                  animate={{
                    scale: isHovered ? 1.25 : isSelected ? 1.15 : 1,
                    filter: isHovered || isSelected ? 'brightness(1.2)' : 'brightness(0.95)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`absolute bottom-6 w-14 sm:w-20 h-24 sm:h-32 rounded-lg border cursor-pointer select-none shadow-[0_8px_24px_rgba(0,0,0,0.8)] transition-shadow ${
                    isSelected
                      ? 'border-[#c5a059] ring-2 ring-[#c5a059] ring-offset-2 ring-offset-black shadow-[0_0_25px_rgba(197,160,89,0.8)]'
                      : isHovered
                      ? 'border-[#c5a059]/80 shadow-[0_0_20px_rgba(197,160,89,0.5)]'
                      : 'border-white/15 hover:border-white/40'
                  }`}
                >
                  {/* Card Back or Front depending on hover/selected state */}
                  <img
                    src={isSelected || isHovered ? getThothCardImageUrl(card) : THOTH_CARD_BACK_IMAGE}
                    alt={card.name}
                    className="w-full h-full object-cover rounded-lg"
                  />

                  {/* Selected Indicator Badge */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#c5a059] text-stone-950 flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* GRID SELECTION VIEW FOR FILTERED CARDS */
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#c5a059]/30">
          {filteredCards.map((card) => {
            const isSelected = selectedSignificatorId === card.id;
            return (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card)}
                className={`relative bg-[#08080c] border rounded-xl p-2 cursor-pointer transition-all flex flex-col items-center justify-between group ${
                  isSelected
                    ? 'border-[#c5a059] bg-[#c5a059]/10 ring-1 ring-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.3)]'
                    : 'border-white/10 hover:border-[#c5a059]/50 hover:bg-[#0f0f16]'
                }`}
              >
                <div className="w-full aspect-[2/3] rounded-lg overflow-hidden relative mb-2">
                  <img
                    src={getThothCardImageUrl(card)}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#c5a059]/20 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-[#c5a059] text-stone-950 flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center w-full">
                  <h4 className="text-[11px] font-bold text-stone-200 truncate group-hover:text-[#c5a059]">
                    {card.name}
                  </h4>
                  <p className="text-[9px] font-serif text-stone-400 italic truncate">
                    {card.thothTitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* SELECTED SIGNIFICATOR PREVIEW & CONFIRMATION BOX */}
      {selectedCard ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0b0b10] border border-[#c5a059]/40 rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-24 rounded-xl border border-[#c5a059]/60 overflow-hidden shrink-0 shadow-[0_0_20px_rgba(197,160,89,0.25)]">
              <img
                src={getThothCardImageUrl(selectedCard)}
                alt={selectedCard.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 text-left">
              <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-[0.15em] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#c5a059]" /> Active Significator Card
              </span>
              <h3 className="atu-font text-lg font-bold text-stone-100">
                {selectedCard.name}: <span className="text-[#c5a059] font-serif font-normal italic">{selectedCard.thothTitle}</span>
              </h3>
              <p className="text-xs text-stone-400 max-w-md font-sans">
                {selectedCard.keyThemes.slice(0, 3).join(' • ')}
              </p>
            </div>
          </div>

          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#c5a059] via-[#b89845] to-[#a37d35] hover:from-[#d6b77b] hover:via-[#c5a059] text-stone-950 font-bold text-xs font-mono uppercase tracking-[0.15em] rounded-xl shadow-[0_4px_24px_rgba(197,160,89,0.3)] hover:shadow-[0_8px_32px_rgba(197,160,89,0.5)] flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 shrink-0"
          >
            <span>Confirm Significator & Proceed</span>
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        </motion.div>
      ) : (
        <div className="text-center py-3 text-xs font-mono text-stone-500 italic">
          Click any card above or press "Let Fate Choose" to pick your Significator bookmark.
        </div>
      )}
    </div>
  );
};
