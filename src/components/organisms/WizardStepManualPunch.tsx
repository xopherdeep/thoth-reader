import React, { useMemo } from 'react';
import { Search, Maximize2, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { ThothCard } from '../../types';
import { THOTH_DECK } from '../../data/thothCards';

interface WizardStepManualPunchProps {
  totalSteps: number;
  manualPulledCards: ThothCard[];
  manualCardSearch: string;
  setManualCardSearch: (query: string) => void;
  onAddManualCard: (card: ThothCard) => void;
  onRemoveManualCard: (index: number) => void;
  onClearSequence: () => void;
  onOpenFullScreenPunch: () => void;
  onBack: () => void;
  onNext: () => void;
}

export const WizardStepManualPunch: React.FC<WizardStepManualPunchProps> = ({
  totalSteps,
  manualPulledCards,
  manualCardSearch,
  setManualCardSearch,
  onAddManualCard,
  onRemoveManualCard,
  onClearSequence,
  onOpenFullScreenPunch,
  onBack,
  onNext,
}) => {
  const filteredManualCards = useMemo(() => {
    if (!manualCardSearch) return THOTH_DECK;
    return THOTH_DECK.filter(
      (c) =>
        c.name.toLowerCase().includes(manualCardSearch.toLowerCase()) ||
        c.thothTitle.toLowerCase().includes(manualCardSearch.toLowerCase())
    );
  }, [manualCardSearch]);

  return (
    <div className="bg-[#0e0e11] border border-white/10 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
      <div>
        <span className="text-xs font-mono text-[#c5a059] uppercase tracking-widest block mb-1">
          Step 3 of {totalSteps} • Punch Physical Deck Sequence
        </span>
        <h2 className="atu-font text-2xl font-bold text-[#c5a059] tracking-wide">
          Select Cards Pulled From Physical Deck
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <p className="text-xs text-stone-400">
          Search cards below or launch the 78-card matrix studio.
        </p>

        <button
          onClick={onOpenFullScreenPunch}
          className="px-4 py-2.5 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs font-mono uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition"
        >
          <Maximize2 className="w-4 h-4" /> Fullscreen Matrix (78 Cards)
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search card by name to punch in..."
          value={manualCardSearch}
          onChange={(e) => setManualCardSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 bg-[#050505] border border-white/15 focus:border-[#c5a059] rounded-sm text-stone-200 text-sm outline-none font-mono"
        />
      </div>

      {/* Quick Cards Grid */}
      <div className="max-h-56 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-2 bg-[#050505] rounded-sm border border-white/10">
        {filteredManualCards.map((card) => {
          const isAlreadySelected = manualPulledCards.some((c) => c.id === card.id);
          return (
            <button
              key={card.id}
              disabled={isAlreadySelected}
              onClick={() => onAddManualCard(card)}
              className={`p-2 rounded-sm text-left text-xs transition border flex flex-col justify-between ${
                isAlreadySelected
                  ? 'opacity-30 bg-[#050505] border-white/5 cursor-not-allowed'
                  : 'bg-[#0e0e11] hover:bg-black border-white/10 hover:border-[#c5a059]/50 text-stone-200'
              }`}
            >
              <span className="atu-font font-bold truncate">{card.name}</span>
              <span className="text-[10px] text-[#c5a059] font-mono mt-1">
                +{card.numerologyCount} Count
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Sequence List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest font-bold">
            Punched Sequence ({manualPulledCards.length} Cards)
          </span>
          {manualPulledCards.length > 0 && (
            <button
              onClick={onClearSequence}
              className="text-[10px] font-mono text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {manualPulledCards.length === 0 ? (
          <div className="p-6 text-center text-xs text-stone-500 bg-[#050505] rounded-sm border border-dashed border-white/10">
            No cards punched in yet. Select cards above or open the Fullscreen Matrix.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {manualPulledCards.map((card, idx) => (
              <div
                key={`${card.id}-${idx}`}
                className="bg-[#050505] border border-[#c5a059]/40 px-3 py-2 rounded-sm flex items-center gap-2 text-xs text-stone-100"
              >
                <span className="w-5 h-5 rounded-sm bg-[#c5a059] text-stone-950 font-mono text-[10px] font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>
                <span className="atu-font font-bold">{card.name}</span>
                <button
                  onClick={() => onRemoveManualCard(idx)}
                  className="ml-1 text-stone-500 hover:text-rose-400 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NAVIGATION BAR */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 bg-[#050505] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Method
        </button>

        <button
          disabled={manualPulledCards.length === 0}
          onClick={onNext}
          className="px-6 py-3.5 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-sm shadow-xl flex items-center gap-2 transition transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Next: Review Spread ({manualPulledCards.length} Cards)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
