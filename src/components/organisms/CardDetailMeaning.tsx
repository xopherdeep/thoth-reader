import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { ThothCard } from '../../types';

interface CardDetailMeaningProps {
  currentCard: ThothCard;
}

export const CardDetailMeaning: React.FC<CardDetailMeaningProps> = ({ currentCard }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Harmonious Dignity (Light) */}
      <div className="bg-emerald-950/30 border-2 border-emerald-500/50 p-6 rounded-lg space-y-3">
        <div className="flex items-center gap-2.5 text-emerald-400 font-mono text-sm font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Harmonious Dignity (Light / Upright Position)</span>
        </div>
        <p className="text-stone-100 text-sm sm:text-base leading-relaxed font-serif bg-[#050505]/80 p-5 rounded-md border border-emerald-500/30">
          {currentCard.lightInterpretation}
        </p>
      </div>

      {/* Ill-Dignified (Shadow) */}
      <div className="bg-rose-950/30 border-2 border-rose-500/50 p-6 rounded-lg space-y-3">
        <div className="flex items-center gap-2.5 text-rose-400 font-mono text-sm font-bold uppercase tracking-wider">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Ill-Dignified (Shadow / Warning / Reversed Position)</span>
        </div>
        <p className="text-stone-100 text-sm sm:text-base leading-relaxed font-serif bg-[#050505]/80 p-5 rounded-md border border-rose-500/30">
          {currentCard.shadowInterpretation}
        </p>
      </div>
    </div>
  );
};
