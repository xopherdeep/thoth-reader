import React, { useState, useMemo } from 'react';
import { ThothCard } from '../types';
import { TarotCardView } from './TarotCardView';
import { getThothCardImageUrl } from '../utils/cardImageUrls';
import {
  X,
  Search,
  Maximize2,
  Trash2,
  Sparkles,
  Play,
  Layers,
  Flame,
  Droplet,
  Wind,
  Globe,
  Award,
  Hash,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface FullScreenManualPunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCards: ThothCard[];
  pulledCards: ThothCard[];
  onAddCard: (card: ThothCard) => void;
  onRemoveCard: (index: number) => void;
  onClearSequence: () => void;
  onFinishAndInterpret: () => void;
}

export const FullScreenManualPunchModal: React.FC<FullScreenManualPunchModalProps> = ({
  isOpen,
  onClose,
  allCards,
  pulledCards,
  onAddCard,
  onRemoveCard,
  onClearSequence,
  onFinishAndInterpret,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'disks' | 'court' | 'pip'>('all');

  const triggerHaptic = (pattern: number | number[] = 15) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe fallback
      }
    }
  };

  if (!isOpen) return null;

  // Filter cards by search and category
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        card.name.toLowerCase().includes(query) ||
        card.thothTitle.toLowerCase().includes(query) ||
        (card.hebrewLetter?.name && card.hebrewLetter.name.toLowerCase().includes(query)) ||
        (card.astrology?.name && card.astrology.name.toLowerCase().includes(query)) ||
        (card.category && card.category.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Category filter match
      switch (categoryFilter) {
        case 'major':
          return card.type === 'major';
        case 'wands':
          return card.suit === 'Wands';
        case 'cups':
          return card.suit === 'Cups';
        case 'swords':
          return card.suit === 'Swords';
        case 'disks':
          return card.suit === 'Disks';
        case 'court':
          return ['Knight', 'Queen', 'Prince', 'Princess'].includes(card.rank || '');
        case 'pip':
          return card.type === 'minor' && !['Knight', 'Queen', 'Prince', 'Princess'].includes(card.rank || '');
        default:
          return true;
      }
    });
  }, [allCards, searchQuery, categoryFilter]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/98 text-stone-100 flex flex-col backdrop-blur-xl animate-fade-in overflow-hidden">
      {/* TOP HEADER BAR */}
      <div className="bg-[#0e0e11] border-b border-[#c5a059]/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#c5a059]/10 border border-[#c5a059] flex items-center justify-center text-[#c5a059]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a059] font-bold">
                Book of Thoth 78-Card Matrix
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#c5a059]/20 text-[#c5a059] text-[10px] font-mono font-bold">
                FULLSCREEN PUNCH STUDIO
              </span>
            </div>
            <h2 className="atu-font text-xl sm:text-2xl font-bold text-[#c5a059] tracking-wider">
              MANUAL CARD PUNCH-IN STUDIO
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {pulledCards.length > 0 && (
            <>
              <button
                onClick={onClearSequence}
                className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All ({pulledCards.length})
              </button>

              <button
                onClick={() => {
                  onFinishAndInterpret();
                  onClose();
                }}
                className="px-4 py-2 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs uppercase tracking-widest rounded-sm shadow-xl flex items-center gap-2 transition transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-current" /> Finish & Interpret Reading
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="p-2 bg-[#18181c] hover:bg-white/10 text-stone-300 hover:text-white rounded-sm border border-white/10 transition"
            title="Close Fullscreen View"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* SELECTED CARDS TRAY / STRIP */}
      <div className="bg-[#0b0b0e] border-b border-white/10 p-3 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Punched Card Sequence ({pulledCards.length} Cards Selected)
          </span>
          <span className="text-[10px] text-stone-400 font-mono">
            Click card to remove from sequence
          </span>
        </div>

        {pulledCards.length === 0 ? (
          <div className="p-4 bg-[#050505] rounded-sm border border-dashed border-white/10 text-center text-xs text-stone-400 font-mono">
            No cards punched yet. Tap any card tile below to add it to your reading sequence in order.
          </div>
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {pulledCards.map((card, idx) => (
              <div
                key={`punched-${card.id}-${idx}`}
                onClick={() => onRemoveCard(idx)}
                className="group relative bg-[#050505] border border-[#c5a059]/60 hover:border-rose-500 rounded-sm p-2 shrink-0 w-28 aspect-[9/16] cursor-pointer transition transform hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-sm bg-[#c5a059] text-stone-950 text-[10px] font-mono font-bold">
                  #{idx + 1}
                </div>
                <div className="absolute top-1 right-1 z-10 w-5 h-5 rounded-full bg-rose-900/80 border border-rose-500 text-rose-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <X className="w-3 h-3" />
                </div>

                <div className="flex-1 w-full my-1 flex items-center justify-center overflow-hidden rounded-sm bg-[#0e0e11]">
                  {getThothCardImageUrl(card) ? (
                    <img
                      src={getThothCardImageUrl(card)}
                      alt={card.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-xl font-sans text-[#c5a059]">
                      {card.hebrewLetter?.letter || card.astrology?.symbol || '🜂'}
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-bold text-stone-200 truncate atu-font text-center">
                  {card.name}
                </div>
                <div className="text-[9px] text-[#c5a059] text-center font-mono">
                  +{card.numerologyCount} Jump
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="bg-[#0e0e11] p-3 border-b border-white/10 shrink-0 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c5a059]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 78 cards by name (e.g., 'The Fool', 'Knight of Wands', 'Ace of Cups', 'Aleph')..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#050505] border border-white/15 focus:border-[#c5a059] rounded-sm text-stone-100 text-sm outline-none font-mono transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono pb-1 scrollbar-none">
          {[
            { id: 'all', label: `All Deck (${allCards.length})`, icon: Layers },
            { id: 'major', label: 'Major Arcana (22)', icon: Sparkles },
            { id: 'wands', label: 'Wands / Fire (14)', icon: Flame },
            { id: 'cups', label: 'Cups / Water (14)', icon: Droplet },
            { id: 'swords', label: 'Swords / Air (14)', icon: Wind },
            { id: 'disks', label: 'Disks / Earth (14)', icon: Globe },
            { id: 'court', label: 'Court Cards (16)', icon: Award },
            { id: 'pip', label: 'Pip Cards 1-10 (40)', icon: Hash },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = categoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-sm border whitespace-nowrap flex items-center gap-1.5 transition ${
                  isSelected
                    ? 'bg-[#c5a059] text-stone-950 font-bold border-[#c5a059] shadow'
                    : 'bg-[#050505] text-stone-400 hover:text-stone-100 border-white/10 hover:border-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 78-CARD PUNCH GRID */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#050505]">
        {filteredCards.length === 0 ? (
          <div className="p-12 text-center text-stone-400 font-mono text-sm space-y-2">
            <div>No cards matched your filter query "{searchQuery}".</div>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059] rounded-sm text-xs uppercase"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
            {filteredCards.map((card) => {
              // Check if card is punched
              const punchIndex = pulledCards.findIndex((c) => c.id === card.id);
              const isPunched = punchIndex !== -1;

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    triggerHaptic([15, 30]);
                    onAddCard(card);
                  }}
                  className={`group relative aspect-[1/1.62] rounded-sm border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between bg-[#0e0e11] p-2 shadow-md ${
                    isPunched
                      ? 'border-[#c5a059] ring-2 ring-[#c5a059] bg-[#121217]'
                      : 'border-white/10 hover:border-[#c5a059]/70 hover:-translate-y-1'
                  }`}
                >
                  {/* Selected Badge Indicator */}
                  {isPunched && (
                    <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-sm bg-[#c5a059] text-stone-950 text-[10px] font-mono font-bold shadow-lg">
                      PUNCHED #{punchIndex + 1}
                    </div>
                  )}

                  {/* Numerology Jump Count */}
                  <div className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded-sm bg-[#050505]/90 border border-[#c5a059]/40 text-[#c5a059] font-mono text-[10px] font-bold">
                    +{card.numerologyCount}
                  </div>

                  {/* Card Thumbnail */}
                  <div className="flex-1 w-full rounded-sm overflow-hidden bg-[#050505] flex items-center justify-center relative my-1">
                    {getThothCardImageUrl(card) ? (
                      <img
                        src={getThothCardImageUrl(card)}
                        alt={card.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <div className="text-4xl font-sans text-[#c5a059]">
                          {card.hebrewLetter?.letter || card.astrology?.symbol || '🜂'}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono mt-1">
                          {card.hebrewLetter?.name || card.astrology?.name || card.alchemy.element}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Card Title Bar */}
                  <div className="pt-1">
                    <div className="atu-font text-xs font-bold text-stone-100 truncate group-hover:text-[#c5a059] transition">
                      {card.name}
                    </div>
                    <div className="text-[10px] text-stone-400 italic truncate">
                      {card.thothTitle}
                    </div>
                  </div>

                  {/* Punch Button Action Overlay */}
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-stone-400">
                      {card.atuNumber !== null ? `ATU ${card.atuNumber}` : card.suit || card.category}
                    </span>
                    <span className="text-[#c5a059] font-bold flex items-center gap-0.5">
                      <Plus className="w-3 h-3" /> Punch
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
