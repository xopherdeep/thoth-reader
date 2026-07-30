import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THOTH_DECK } from '../data/thothCards';
import { ThothCard } from '../types';
import { useThothCardSearch } from '../hooks/useThothCardSearch';
import { SearchInput } from './atoms/SearchInput';
import { FilterBar } from './molecules/FilterBar';
import { TarotCardView } from './TarotCardView';
import { TarotCardDetailView } from './TarotCardDetailView';
import { BookOpen, Sparkles, Layers } from 'lucide-react';

interface CompendiumProps {
  selectedCardId?: string | null;
  onSelectCard?: (card: ThothCard | null) => void;
}

export const Compendium: React.FC<CompendiumProps> = ({ selectedCardId, onSelectCard }) => {
  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    selectedNumber,
    setSelectedNumber,
    sortBy,
    setSortBy,
    groupBy,
    setGroupBy,
    filteredCards,
    groupedCards,
    categories,
    totalCards,
  } = useThothCardSearch();

  const [internalSelectedCard, setInternalSelectedCard] = useState<ThothCard | null>(null);

  // Sync prop selectedCardId with ThothCard object
  const selectedCard = useMemo(() => {
    if (selectedCardId) {
      return THOTH_DECK.find((c) => c.id === selectedCardId) || null;
    }
    return internalSelectedCard;
  }, [selectedCardId, internalSelectedCard]);

  const handleCardClick = (card: ThothCard | null) => {
    if (onSelectCard) {
      onSelectCard(card);
    } else {
      setInternalSelectedCard(card);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#141419] via-[#0d0d12] to-[#08080c] p-6 sm:p-8 rounded-xl border border-[#c5a059]/35 shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_15px_rgba(197,160,89,0.12)] backdrop-blur-md">
        {/* Esoteric Radial Light Bleeds */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        {/* Top Gold Horizon Beam */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/60 to-transparent" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] font-mono text-[11px] uppercase tracking-widest backdrop-blur-sm">
                <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>The Book of Thoth Compendium</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
              </div>
              <h2 className="atu-font text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#f5e4bc] via-[#c5a059] to-[#936e2d] bg-clip-text text-transparent">
                Esoteric Database & Attributions
              </h2>
              <p className="text-stone-300/90 text-xs sm:text-sm max-w-3xl leading-relaxed font-sans">
                Complete catalog of all <span className="text-[#c5a059] font-semibold">78 Thoth Tarot cards</span> with Crowley’s Golden Dawn numerology counts, Hebrew letters, alchemical processes, astrological decans, and Tree of Life paths.
              </p>
            </div>

            {/* Catalog Counter HUD Box */}
            <div className="relative group shrink-0 self-start lg:self-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#c5a059]/30 to-amber-600/30 rounded-xl blur opacity-50 group-hover:opacity-80 transition duration-300" />
              <div className="relative flex items-center gap-4 bg-[#0a0a0e]/90 px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl border border-[#c5a059]/40 backdrop-blur-md">
                <div className="p-2.5 rounded-lg bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#c5a059]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">Total Catalog</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#f0d8a4] font-mono tracking-tight flex items-baseline gap-1">
                    <span>{filteredCards.length}</span>
                    <span className="text-xs text-[#c5a059] font-normal">/ {totalCards} Cards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Golden Gradient Divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/25 to-transparent" />

          {/* Search & Filter Bar Section */}
          <div className="space-y-4">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search by title, Hebrew letter, Zodiac sign, Alchemy..."
            />
            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedNumber={selectedNumber}
              onSelectNumber={setSelectedNumber}
              sortBy={sortBy}
              onSelectSort={setSortBy}
              groupBy={groupBy}
              onSelectGroup={setGroupBy}
            />
          </div>
        </div>
      </div>

      {/* Grouped or Single Grid of Cards with Motion Animations */}
      <div className="space-y-8 w-full max-w-6xl mx-auto">
        {groupedCards.map((group) => (
          <div key={group.id} className="space-y-3">
            {groupBy !== 'none' && (
              <div className="flex items-center gap-3 px-2">
                <div className="p-1.5 rounded-md bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#c5a059]">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="atu-font text-lg font-bold text-[#f0d8a4] tracking-wide flex items-center gap-2">
                  <span>{group.title}</span>
                  <span className="text-xs font-mono text-stone-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    {group.count}
                  </span>
                </h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#c5a059]/30 to-transparent ml-2" />
              </div>
            )}

            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5 justify-items-center"
            >
              <AnimatePresence mode="popLayout">
                {group.cards.map((card) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <TarotCardView
                      card={card}
                      displayMode="thoth"
                      size="lg"
                      showDetailsOnClick={true}
                      onSelect={(c) => handleCardClick(c)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12 bg-[#0e0e11] rounded-sm border border-white/10 space-y-3">
          <BookOpen className="w-8 h-8 text-stone-500 mx-auto" />
          <p className="text-stone-300 font-medium text-sm">No Thoth cards matched your search or filter criteria.</p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
              setSelectedNumber('all');
              setSortBy('deck');
              setGroupBy('none');
            }}
            className="px-3 py-1.5 bg-[#c5a059]/20 text-[#c5a059] hover:bg-[#c5a059]/30 border border-[#c5a059]/40 text-xs font-mono uppercase tracking-widest rounded-sm transition cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

      {/* Full-Screen Card Detail View */}
      {selectedCard && (
        <TarotCardDetailView
          card={selectedCard}
          cardList={filteredCards}
          onClose={() => handleCardClick(null)}
          onSelectCard={(newCard) => handleCardClick(newCard)}
        />
      )}
    </div>
  );
};

