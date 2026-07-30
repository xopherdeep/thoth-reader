import React, { useState } from 'react';
import { ThothCard } from '../types';
import { TetragrammatonPile } from '../utils/thothSpread';
import { THOTH_CARD_BACK_IMAGE, getThothCardImageUrl } from '../utils/cardImageUrls';
import {
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sparkles,
  Play,
  Search,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Compass,
} from 'lucide-react';

interface SignificatorSelectionViewProps {
  selectedPile: TetragrammatonPile;
  selectedSignificatorId: string | null;
  onSelectSignificator: (cardId: string) => void;
  onRunSpread: (significatorId: string) => void;
  onChangePileStep: () => void;
}

export const SignificatorSelectionView: React.FC<SignificatorSelectionViewProps> = ({
  selectedPile,
  selectedSignificatorId,
  onSelectSignificator,
  onRunSpread,
  onChangePileStep,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const triggerHaptic = (pattern: number | number[] = 15) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe fallback
      }
    }
  };

  const getPileBadge = (id: string) => {
    switch (id) {
      case 'yod':
        return {
          icon: <Flame className="w-4 h-4 text-amber-400" />,
          color: 'text-amber-400',
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/60',
          symbol: '🜂',
        };
      case 'heh':
        return {
          icon: <Droplets className="w-4 h-4 text-sky-400" />,
          color: 'text-sky-400',
          border: 'border-sky-500/40',
          bg: 'bg-sky-950/60',
          symbol: '🜄',
        };
      case 'vau':
        return {
          icon: <Wind className="w-4 h-4 text-yellow-400" />,
          color: 'text-yellow-400',
          border: 'border-yellow-500/40',
          bg: 'bg-yellow-950/60',
          symbol: '🜁',
        };
      case 'heh_final':
        return {
          icon: <Mountain className="w-4 h-4 text-emerald-400" />,
          color: 'text-emerald-400',
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/60',
          symbol: '🜃',
        };
      default:
        return {
          icon: <Layers className="w-4 h-4 text-[#c5a059]" />,
          color: 'text-[#c5a059]',
          border: 'border-[#c5a059]/40',
          bg: 'bg-black/60',
          symbol: '✡',
        };
    }
  };

  const badge = getPileBadge(selectedPile.id);

  const filteredCards = selectedPile.cards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.thothTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chosenCard =
    selectedPile.cards.find((c) => c.id === selectedSignificatorId) || selectedPile.cards[0];

  return (
    <div className="relative bg-[#0a0a0e]/95 backdrop-blur-2xl border border-[#c5a059]/20 rounded-2xl p-5 sm:p-8 shadow-[0_16px_60px_rgba(0,0,0,0.9)] overflow-hidden space-y-6">
      {/* Header Banner with Stack Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#c5a059] tracking-wide font-bold">
            <Compass className="w-4 h-4 text-[#c5a059]" /> Step 5 • Pick Significator Card
          </div>
          <h3 className="atu-font text-2xl font-bold text-stone-100 tracking-wide mt-1 flex items-center gap-2">
            Select Starting Significator in <span className="text-[#c5a059]">{selectedPile.name}</span>
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            The counting process will originate from your chosen card and loop continuously through all {selectedPile.cards.length} cards in this bounded elemental book.
          </p>
        </div>

        {/* Selected Book Pill & Change Button */}
        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-2 rounded-xl border ${badge.border} ${badge.bg} flex items-center gap-2.5 shadow-lg`}>
            {badge.icon}
            <div>
              <span className="text-[10px] font-mono text-stone-400 block uppercase">Selected Book</span>
              <span className={`text-xs font-mono font-bold ${badge.color}`}>
                {selectedPile.element} Book • {selectedPile.cards.length} Cards
              </span>
            </div>
          </div>

          <button
            onClick={onChangePileStep}
            className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 border border-white/15 text-xs font-mono uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Change Book
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.03] p-3 rounded-2xl border border-white/10">
        <span className="text-xs font-mono text-stone-300 flex items-center gap-2 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          Browse {selectedPile.cards.length} Cards in {selectedPile.name}:
        </span>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search card by name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/[0.04] border border-white/15 focus:border-[#c5a059] rounded-xl text-xs text-stone-200 outline-none font-mono"
          />
        </div>
      </div>

      {/* Cards Grid in Selected Stack - 2:3 Ratio Card Aspect View */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 max-h-[460px] overflow-y-auto p-2 bg-white/[0.02] rounded-2xl border border-white/10 scrollbar-thin scrollbar-thumb-[#c5a059]/30">
        {filteredCards.map((card, idx) => {
          const isSelected = chosenCard?.id === card.id;

          return (
            <div
              key={card.id}
              onClick={() => {
                triggerHaptic(12);
                onSelectSignificator(card.id);
              }}
              className={`group relative aspect-[2/3] rounded-xl border cursor-pointer select-none transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg ${
                isSelected
                  ? 'border-[#c5a059] ring-2 ring-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.8)] scale-[1.03] z-10'
                  : 'border-white/15 hover:border-[#c5a059]/70 hover:scale-[1.02] bg-[#050508]'
              }`}
            >
              {/* Card Back for non-selected cards, Card Front image for selected Significator */}
              <img
                src={isSelected ? getThothCardImageUrl(card) : THOTH_CARD_BACK_IMAGE}
                alt={card.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isSelected ? 'brightness-110 group-hover:scale-105' : 'brightness-90 group-hover:brightness-110'
                }`}
              />

              {/* Index Badge (Top Left) */}
              <div className="absolute top-0 left-0 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-br-lg border-b border-r border-[#c5a059]/40 text-[10px] font-mono text-[#c5a059] font-bold z-10">
                #{idx + 1}
              </div>

              {/* Numerology Count Badge (Top Right) */}
              <div className="absolute top-0 right-0 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-bl-lg border-b border-l border-[#c5a059]/40 text-[10px] font-mono text-[#c5a059] font-bold z-10">
                +{card.numerologyCount}
              </div>

              {/* Selected Significator Highlight Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-[#c5a059]/15 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-8 h-8 rounded-full bg-[#c5a059] text-stone-950 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              )}

              {/* Card Label Bottom Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2 pt-6 text-center z-10">
                <div className={`atu-font text-[11px] font-bold truncate ${isSelected ? 'text-[#c5a059]' : 'text-stone-200 group-hover:text-[#c5a059]'}`}>
                  {card.name}
                </div>
                <div className="text-[9px] font-serif text-stone-400 italic truncate">
                  {card.thothTitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Control Bar */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white/[0.04] px-4 py-2.5 rounded-2xl border border-[#c5a059]/25 text-xs font-mono w-full sm:w-auto shadow-md">
          <div className="w-7 h-10 rounded-md border border-[#c5a059]/60 overflow-hidden shrink-0 shadow-sm">
            <img
              src={chosenCard ? getThothCardImageUrl(chosenCard) : THOTH_CARD_BACK_IMAGE}
              alt="Active Significator"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase block">Active Significator:</span>
            <strong className="text-[#c5a059] atu-font text-sm font-bold block">
              {chosenCard ? chosenCard.name : 'Select a Card'}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onChangePileStep}
            className="px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={() => {
              triggerHaptic([20, 30, 20]);
              onRunSpread(chosenCard?.id || selectedPile.cards[0]?.id || '');
            }}
            className="flex-1 sm:flex-initial px-8 py-3.5 bg-gradient-to-r from-[#c5a059] via-amber-400 to-[#c5a059] hover:brightness-110 text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-xl shadow-[0_0_32px_rgba(197,160,89,0.4)] flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Begin Continuous Loop Count</span>
          </button>
        </div>
      </div>
    </div>
  );
};
