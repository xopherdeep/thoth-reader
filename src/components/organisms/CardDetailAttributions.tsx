import React from 'react';
import { Compass, Flame } from 'lucide-react';
import { ThothCard } from '../../types';

interface CardDetailAttributionsProps {
  currentCard: ThothCard;
}

export const CardDetailAttributions: React.FC<CardDetailAttributionsProps> = ({ currentCard }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hebrew Deep Dive */}
      {currentCard.hebrewLetter && (
        <div className="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
            <span className="text-lg">א</span> Hebrew Letter & Kabbalistic Path
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#050505] p-4 rounded-md border border-white/10">
            <div>
              <div className="text-xs font-mono text-stone-400 uppercase">Glyph & Name</div>
              <div className="text-xl font-bold text-[#c5a059] font-serif">
                {currentCard.hebrewLetter.letter} ({currentCard.hebrewLetter.name})
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-stone-400 uppercase">Literal Translation</div>
              <div className="text-base font-bold text-stone-200 font-serif">
                "{currentCard.hebrewLetter.meaning}"
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-stone-400 uppercase">Gematria Value</div>
              <div className="text-xl font-mono font-bold text-stone-100">
                {currentCard.hebrewLetter.value}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Astrological Deep Dive */}
      <div className="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
          <Compass className="w-4 h-4" /> Astrological & Astronomical Correspondences
        </h3>
        <div className="space-y-3 bg-[#050505] p-5 rounded-md border border-white/10 text-sm">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-stone-400 font-mono">Attribution Type:</span>
            <span className="font-bold text-stone-200">{currentCard.astrology?.type || 'Cosmic'}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-stone-400 font-mono">Astrological Name:</span>
            <span className="font-bold text-[#c5a059] font-serif">
              {currentCard.astrology?.name} {currentCard.astrology?.symbol}
            </span>
          </div>
          {currentCard.astrology?.decanDetails && (
            <div className="pt-1">
              <span className="text-stone-400 font-mono text-xs uppercase block mb-1">
                Golden Dawn Decan Rulership & Dates:
              </span>
              <p className="text-stone-200 font-serif leading-relaxed">
                {currentCard.astrology.decanDetails}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alchemical Operations */}
      <div className="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" /> Hermetic Alchemical Operation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#050505] p-5 rounded-md border border-white/10 text-sm">
          <div>
            <span className="text-xs font-mono text-stone-400 uppercase block">Operation:</span>
            <strong className="text-base text-[#c5a059] font-serif">{currentCard.alchemy.process}</strong>
          </div>
          <div>
            <span className="text-xs font-mono text-stone-400 uppercase block">Element & Symbol:</span>
            <strong className="text-base text-stone-200">
              {currentCard.alchemy.element} ({currentCard.alchemy.symbol})
            </strong>
          </div>
          {currentCard.alchemy.metalOrQuality && (
            <div className="sm:col-span-2 border-t border-white/10 pt-2">
              <span className="text-xs font-mono text-stone-400 uppercase block">Alchemical Quality / Metal:</span>
              <span className="text-stone-300 font-serif">{currentCard.alchemy.metalOrQuality}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
