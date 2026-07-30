import React from 'react';
import { Sparkles, BookOpen, Flame, Droplets, Wind, Mountain } from 'lucide-react';
import { ThothCard } from '../../types';

interface CardDetailOverviewProps {
  currentCard: ThothCard;
}

export const CardDetailOverview: React.FC<CardDetailOverviewProps> = ({ currentCard }) => {
  const getElementIcon = (element: string) => {
    switch (element) {
      case 'Fire':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Water':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'Air':
        return <Wind className="w-5 h-5 text-indigo-300" />;
      case 'Earth':
        return <Mountain className="w-5 h-5 text-emerald-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-300" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Themes Badges */}
      <div className="bg-[#0e0e11] p-5 rounded-lg border border-white/10 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Core Esoteric Themes & Archetypes
        </h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {currentCard.keyThemes.map((theme, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 bg-[#050505] text-stone-200 border border-[#c5a059]/40 rounded-md text-xs sm:text-sm font-medium font-serif shadow-sm"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* 2x2 Bento Grid of Attributions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Astrological / Cosmic Decan */}
        <div className="bg-[#0e0e11] p-5 rounded-lg border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#c5a059] font-bold">
              Astrology / Decan
            </span>
            <span className="text-2xl text-[#c5a059]">
              {currentCard.astrology?.symbol || '✨'}
            </span>
          </div>
          <div className="text-base font-bold text-stone-100 font-serif">
            {currentCard.astrology?.name || 'Cosmic Synthesis'}
          </div>
          {currentCard.astrology?.decanDetails && (
            <p className="text-xs text-stone-400 font-sans leading-relaxed">
              {currentCard.astrology.decanDetails}
            </p>
          )}
        </div>

        {/* Alchemical Process */}
        <div className="bg-[#0e0e11] p-5 rounded-lg border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#c5a059] font-bold">
              Alchemical Operation
            </span>
            <div className="flex items-center gap-1">
              {getElementIcon(currentCard.alchemy.element)}
              <span className="text-xl text-[#c5a059]">{currentCard.alchemy.symbol}</span>
            </div>
          </div>
          <div className="text-base font-bold text-stone-100 font-serif">
            {currentCard.alchemy.process}
          </div>
          <p className="text-xs text-stone-400 font-sans">
            Element: <strong className="text-stone-200">{currentCard.alchemy.element}</strong>
            {currentCard.alchemy.metalOrQuality && ` • Quality: ${currentCard.alchemy.metalOrQuality}`}
          </p>
        </div>

        {/* Tree of Life Path */}
        <div className="bg-[#0e0e11] p-5 rounded-lg border border-white/10 space-y-2">
          <div className="text-xs font-mono uppercase text-[#c5a059] font-bold">
            Tree of Life Sephira / Path
          </div>
          <div className="text-base font-bold text-stone-100 font-serif">
            {currentCard.treeOfLife.sephiraOrPath}
          </div>
          <p className="text-xs text-stone-400 font-sans italic">
            "{currentCard.treeOfLife.title}"
          </p>
        </div>

        {/* Golden Dawn Numerology Step */}
        <div className="bg-[#0e0e11] p-5 rounded-lg border border-white/10 space-y-2">
          <div className="text-xs font-mono uppercase text-[#c5a059] font-bold">
            Golden Dawn Spread Step
          </div>
          <div className="text-2xl font-mono font-bold text-[#c5a059]">
            +{currentCard.numerologyCount} Count
          </div>
          <p className="text-xs text-stone-400 font-sans">
            Jump interval used in Crowley’s First Operation counting sequence.
          </p>
        </div>
      </div>

      {/* Core Crowley Occult Meaning Paragraph */}
      <div className="bg-[#0e0e11] p-6 rounded-lg border border-[#c5a059]/40 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#c5a059]" /> Aleister Crowley's Book of Thoth Commentary
        </h3>
        <p className="text-stone-200 text-sm sm:text-base leading-relaxed font-serif bg-[#050505] p-5 rounded-md border border-white/10">
          {currentCard.occultMeaning}
        </p>
      </div>
    </div>
  );
};
