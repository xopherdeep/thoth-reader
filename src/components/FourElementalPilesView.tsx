import React from 'react';
import { FourPilesCut } from '../utils/thothSpread';
import { THOTH_CARD_BACK_IMAGE } from '../utils/cardImageUrls';
import {
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface FourElementalPilesViewProps {
  fourPilesCut: FourPilesCut;
  selectedPileId: string | null;
  onSelectPile: (pileId: string) => void;
  onNextStep: () => void;
  onBackToShuffle: () => void;
  onPerformCutAgain: () => void;
}

export const FourElementalPilesView: React.FC<FourElementalPilesViewProps> = ({
  fourPilesCut,
  selectedPileId,
  onSelectPile,
  onNextStep,
  onBackToShuffle,
  onPerformCutAgain,
}) => {
  const triggerHaptic = (pattern: number | number[] = 15) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe fallback
      }
    }
  };

  const getPileVisualConfig = (id: string) => {
    switch (id) {
      case 'yod':
        return {
          icon: <Flame className="w-5 h-5 text-amber-400" />,
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.35)] border-amber-500/70 ring-1 ring-amber-500/40',
          gradient: 'from-amber-950/80 via-stone-900/90 to-[#08080a]',
          accentColor: '#f59e0b',
          bgBadge: 'bg-amber-950/90 text-amber-300 border-amber-500/40',
          symbol: '🜂',
          title: 'Yod Pile • Creative Will',
        };
      case 'heh':
        return {
          icon: <Droplets className="w-5 h-5 text-sky-400" />,
          glow: 'shadow-[0_0_30px_rgba(56,189,248,0.35)] border-sky-500/70 ring-1 ring-sky-500/40',
          gradient: 'from-blue-950/80 via-stone-900/90 to-[#08080a]',
          accentColor: '#38bdf8',
          bgBadge: 'bg-sky-950/90 text-sky-300 border-sky-500/40',
          symbol: '🜄',
          title: 'Heh Pile • Emotional Cup',
        };
      case 'vau':
        return {
          icon: <Wind className="w-5 h-5 text-yellow-400" />,
          glow: 'shadow-[0_0_30px_rgba(250,204,21,0.35)] border-yellow-500/70 ring-1 ring-yellow-500/40',
          gradient: 'from-yellow-950/80 via-stone-900/90 to-[#08080a]',
          accentColor: '#facc15',
          bgBadge: 'bg-yellow-950/90 text-yellow-300 border-yellow-500/40',
          symbol: '🜁',
          title: 'Vau Pile • Rational Intellect',
        };
      case 'heh_final':
        return {
          icon: <Mountain className="w-5 h-5 text-emerald-400" />,
          glow: 'shadow-[0_0_30px_rgba(52,211,153,0.35)] border-emerald-500/70 ring-1 ring-emerald-500/40',
          gradient: 'from-emerald-950/80 via-stone-900/90 to-[#08080a]',
          accentColor: '#34d399',
          bgBadge: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
          symbol: '🜃',
          title: 'Heh Final • Material Earth',
        };
      default:
        return {
          icon: <Layers className="w-5 h-5 text-[#c5a059]" />,
          glow: 'border-[#c5a059]/40',
          gradient: 'from-stone-900 to-black',
          accentColor: '#c5a059',
          bgBadge: 'bg-black/60 text-[#c5a059] border-white/10',
          symbol: '✡',
          title: 'Elemental Stack',
        };
    }
  };

  const selectedPile =
    fourPilesCut.piles.find((p) => p.id === selectedPileId) || fourPilesCut.piles[0];

  return (
    <div className="bg-[#0e0e11] border border-[#c5a059]/40 rounded-sm p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#c5a059] tracking-wide font-bold">
            <Sparkles className="w-4 h-4 text-[#c5a059]" /> Step 4 • Tetragrammaton 4-Pile Deck Cut
          </div>
          <h3 className="atu-font text-2xl font-bold text-stone-100 tracking-wide mt-1">
            Choose Your Elemental Inquiry Stack
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            The 78 cards are cut into four elemental stacks representing Will (Fire), Emotion (Water), Intellect (Air), and Material Reality (Earth).
          </p>
        </div>

        <div className="bg-[#050505] px-4 py-2 rounded-sm border border-[#c5a059]/30 flex items-center gap-3">
          <span className="text-[10px] text-stone-400 font-mono uppercase block">YHVH Name:</span>
          <span className="text-base font-serif text-[#c5a059] font-bold tracking-widest">
            י • ה • ו • ה
          </span>
        </div>
      </div>

      {/* 2X2 GRID OF 4 STYLIZED PHYSICAL DECK STACKS (TWO TO A ROW) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-4xl mx-auto">
        {fourPilesCut.piles.map((pile) => {
          const visual = getPileVisualConfig(pile.id);
          const isSelected = selectedPileId === pile.id;
          const topCard = pile.cards[0];

          return (
            <div
              key={pile.id}
              onClick={() => {
                triggerHaptic([15, 25, 15]);
                onSelectPile(pile.id);
              }}
              className={`group relative bg-gradient-to-b ${visual.gradient} p-3 sm:p-5 rounded-sm border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? `${visual.glow} bg-opacity-100 scale-[1.02]`
                  : 'border-white/15 opacity-85 hover:opacity-100 hover:border-white/40 hover:-translate-y-1'
              }`}
            >
              {/* Top Header Row */}
              <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-[#050505] border border-[#c5a059]/50 flex items-center justify-center shadow-inner shrink-0">
                    <span className="text-lg sm:text-2xl font-serif font-bold text-[#c5a059] drop-shadow">
                      {pile.letter}
                    </span>
                  </div>
                  <div>
                    <h4 className="atu-font text-xs sm:text-base font-bold text-stone-100 tracking-wider line-clamp-1">
                      {pile.name}
                    </h4>
                    <span className="text-[9px] sm:text-[11px] font-mono text-stone-400 flex items-center gap-1 truncate">
                      {visual.symbol} {visual.title}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-sm border ${visual.bgBadge} font-bold shadow-sm shrink-0`}
                >
                  {pile.cards.length} CARDS
                </span>
              </div>

              {/* Physical 3D Card Stack Visual */}
              <div className="relative h-32 sm:h-48 flex items-center justify-center my-2 sm:my-3 select-none">
                {/* Ambient glow behind stack */}
                <div
                  className={`absolute w-20 sm:w-28 h-28 sm:h-40 bg-black/90 blur-xl rounded-sm translate-y-3 sm:translate-y-4`}
                />

                {/* Layered 3D stacked physical card edges */}
                <div className="absolute w-20 sm:w-28 h-28 sm:h-40 rounded-sm border border-white/10 bg-[#08080a] -translate-x-2 sm:-translate-x-3 -translate-y-2 sm:-translate-y-2.5 shadow-md" />
                <div className="absolute w-20 sm:w-28 h-28 sm:h-40 rounded-sm border border-white/15 bg-[#0e0e11] -translate-x-1 sm:-translate-x-1.5 -translate-y-1 sm:-translate-y-1.5 shadow-md" />

                {/* Top Card Back Art Frame */}
                <div className="relative w-20 sm:w-28 h-28 sm:h-40 rounded-sm border border-[#c5a059]/70 bg-[#0e0e11] overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
                  <img
                    src={THOTH_CARD_BACK_IMAGE}
                    alt="Thoth Card Back"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Top card label on stack */}
                  <div className="absolute bottom-1 sm:bottom-1.5 inset-x-1 sm:inset-x-1.5 text-center bg-black/80 backdrop-blur-xs py-0.5 sm:py-1 px-1 rounded-xs border border-white/10">
                    <span className="text-[7px] sm:text-[8px] font-mono text-stone-400 block uppercase">
                      Top Card
                    </span>
                    <span className="atu-font text-[9px] sm:text-[10px] font-bold text-[#c5a059] truncate block">
                      {topCard ? topCard.name : 'Empty'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stack Description */}
              <p className="text-[10px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed font-sans mb-2 sm:mb-3 text-center">
                {pile.description}
              </p>

              {/* Bottom Selected Indicator Row */}
              <div className="pt-2 sm:pt-3 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs font-mono">
                <span className="text-stone-400 text-[9px] sm:text-[11px] truncate">
                  {isSelected ? 'Active Stack Selected' : 'Click to select'}
                </span>
                {isSelected ? (
                  <div className="flex items-center gap-1 text-[#c5a059] font-bold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#c5a059]/20" /> Selected
                  </div>
                ) : (
                  <span className="text-stone-500 group-hover:text-stone-300 transition-colors shrink-0">
                    Select →
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM ACTION BAR FOR STEP 4 */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToShuffle}
            className="px-4 py-2.5 bg-[#050505] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shuffle
          </button>

          <button
            onClick={onPerformCutAgain}
            className="px-3.5 py-2.5 bg-[#050505] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#c5a059]" /> Cut Again
          </button>
        </div>

        <button
          onClick={() => {
            triggerHaptic(20);
            onNextStep();
          }}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#c5a059] via-amber-400 to-[#c5a059] hover:brightness-110 text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-sm shadow-xl flex items-center justify-center gap-2 transition transform active:scale-95"
        >
          <span>Next: Pick Significator in {selectedPile ? selectedPile.name : 'Selected'} Stack</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
