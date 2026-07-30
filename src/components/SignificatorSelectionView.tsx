import React, { useState } from 'react';
import { ThothCard } from '../types';
import { TetragrammatonPile } from '../utils/thothSpread';
import { THOTH_CARD_BACK_IMAGE } from '../utils/cardImageUrls';
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
    <div className="bg-[#0e0e11] border border-[#c5a059]/40 rounded-sm p-5 sm:p-7 shadow-2xl space-y-6">
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
            The counting process will originate from your chosen card and loop continuously through all {selectedPile.cards.length} cards in this bounded elemental stack.
          </p>
        </div>

        {/* Selected Stack Pill & Change Button */}
        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-2 rounded-sm border ${badge.border} ${badge.bg} flex items-center gap-2.5 shadow-lg`}>
            {badge.icon}
            <div>
              <span className="text-[10px] font-mono text-stone-400 block uppercase">Selected Stack</span>
              <span className={`text-xs font-mono font-bold ${badge.color}`}>
                {selectedPile.letter} • {selectedPile.cards.length} Cards
              </span>
            </div>
          </div>

          <button
            onClick={onChangePileStep}
            className="px-3 py-2 bg-[#050505] hover:bg-black text-stone-300 border border-white/15 text-xs font-mono uppercase tracking-wider rounded-sm transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Change Stack
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#050505] p-3 rounded-sm border border-white/10">
        <span className="text-xs font-mono text-stone-300 flex items-center gap-2 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          Browse {selectedPile.cards.length} Cards in {selectedPile.name} Stack:
        </span>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search card by name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0e0e11] border border-white/15 focus:border-[#c5a059] rounded-sm text-xs text-stone-200 outline-none font-mono"
          />
        </div>
      </div>

      {/* Cards Grid in Selected Stack */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-80 overflow-y-auto p-1 bg-[#050505] rounded-sm border border-white/10">
        {filteredCards.map((card, idx) => {
          const isSelected = chosenCard?.id === card.id;

          return (
            <div
              key={card.id}
              onClick={() => {
                triggerHaptic(12);
                onSelectSignificator(card.id);
              }}
              className={`p-3 rounded-sm border transition cursor-pointer flex flex-col justify-between text-left select-none relative group ${
                isSelected
                  ? 'bg-[#181510] border-[#c5a059] ring-2 ring-[#c5a059]/60 text-white shadow-xl scale-[1.02]'
                  : 'bg-[#0e0e11] border-white/10 hover:border-[#c5a059]/60 text-stone-300 hover:bg-[#121116]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] fill-[#c5a059]/20" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-1 pr-4">
                  <span>#{idx + 1}</span>
                  <span className="text-[#c5a059] font-bold">+{card.numerologyCount}</span>
                </div>

                <div className="atu-font text-xs font-bold text-stone-100 group-hover:text-[#c5a059] transition-colors line-clamp-2">
                  {card.name}
                </div>
              </div>

              <div className="text-[9px] text-[#c5a059]/80 font-sans italic truncate mt-2 border-t border-white/10 pt-1">
                {card.thothTitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Control Bar */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-[#050505] px-4 py-2.5 rounded-sm border border-[#c5a059]/30 text-xs font-mono w-full sm:w-auto">
          <div className="w-6 h-9 rounded-xs border border-[#c5a059]/60 overflow-hidden shrink-0">
            <img src={THOTH_CARD_BACK_IMAGE} alt="Back" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase block">Active Significator:</span>
            <strong className="text-[#c5a059] atu-font text-sm font-bold block">
              {chosenCard ? chosenCard.name : 'First Card'}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onChangePileStep}
            className="px-4 py-3 bg-[#050505] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={() => {
              triggerHaptic([20, 30, 20]);
              onRunSpread(chosenCard?.id || selectedPile.cards[0]?.id || '');
            }}
            className="flex-1 sm:flex-initial px-8 py-3.5 bg-gradient-to-r from-[#c5a059] via-amber-400 to-[#c5a059] hover:brightness-110 text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-sm shadow-2xl flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Begin Continuous Loop Count</span>
          </button>
        </div>
      </div>
    </div>
  );
};
