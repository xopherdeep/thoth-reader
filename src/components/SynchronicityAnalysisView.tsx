import React, { useState } from 'react';
import { ThothCard } from '../types';
import { analyzeSynchronicity } from '../utils/synchronicityAnalysis';
import {
  Sparkles,
  Zap,
  Crown,
  Flame,
  Droplets,
  Wind,
  Mountain,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Compass,
  Trophy,
  Activity,
} from 'lucide-react';

interface SynchronicityAnalysisViewProps {
  pulledCards: ThothCard[];
  compact?: boolean;
}

export const SynchronicityAnalysisView: React.FC<SynchronicityAnalysisViewProps> = ({
  pulledCards,
  compact = false,
}) => {
  const [expanded, setExpanded] = useState<boolean>(!compact);
  const analysis = analyzeSynchronicity(pulledCards);

  if (!pulledCards || pulledCards.length === 0) return null;

  return (
    <div className="bg-[#0e0e11] border border-[#c5a059]/40 rounded-sm p-5 sm:p-6 shadow-2xl space-y-5 relative overflow-hidden">
      {/* Gamified Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 text-[#c5a059] text-xs font-mono uppercase tracking-[0.2em] font-bold">
            <Trophy className="w-4 h-4 text-[#c5a059] animate-pulse" /> 
            <span>{analysis.patterns.length} Synchronicity Badges Unlocked</span>
          </div>
          <h2 className="atu-font text-2xl font-bold text-stone-100 tracking-wider">
            Esoteric Achievement Board
          </h2>
          <p className="text-xs text-stone-400 font-mono flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Transmuting Randomness into Mathematical Order
          </p>
        </div>

        {/* Global Rarity & Score Badges */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {analysis.highestRarity && (
            <div className="bg-[#050505] border border-fuchsia-500/50 px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.15)]">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-mono text-stone-400 uppercase block tracking-widest leading-none">
                  Highest Rarity
                </span>
                <span className="text-sm font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-400">
                  {analysis.highestRarity}
                </span>
              </div>
            </div>
          )}

          <div className="bg-[#050505] border border-[#c5a059]/50 px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-inner">
            <Zap className="w-4 h-4 text-[#c5a059]" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-mono text-stone-400 uppercase block tracking-widest leading-none">
                Resonance Score
              </span>
              <span className="text-sm font-mono font-bold text-[#c5a059]">
                {analysis.resonanceScore}%
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2.5 bg-[#050505] hover:bg-black border border-white/10 text-stone-300 rounded-sm text-xs transition"
            title={expanded ? 'Collapse Achievements' : 'Expand Achievements'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Summary Quote */}
      <div className="bg-[#050505] border-l-3 border-[#c5a059] p-3.5 rounded-r-sm text-sm text-stone-200 font-serif italic shadow-inner">
        "{analysis.summaryQuote}"
      </div>

      {/* Suit & Archetype Quick Distribution Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-mono">
        <div className="bg-[#050505] border border-red-900/40 p-2 rounded-sm text-center">
          <span className="text-[10px] text-red-400 uppercase tracking-wider block flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-red-400" /> Wands
          </span>
          <span className="text-base font-bold text-stone-100">{analysis.suitCounts.Wands}</span>
        </div>

        <div className="bg-[#050505] border border-blue-900/40 p-2 rounded-sm text-center">
          <span className="text-[10px] text-blue-400 uppercase tracking-wider block flex items-center justify-center gap-1">
            <Droplets className="w-3 h-3 text-blue-400" /> Cups
          </span>
          <span className="text-base font-bold text-stone-100">{analysis.suitCounts.Cups}</span>
        </div>

        <div className="bg-[#050505] border border-amber-900/40 p-2 rounded-sm text-center">
          <span className="text-[10px] text-amber-300 uppercase tracking-wider block flex items-center justify-center gap-1">
            <Wind className="w-3 h-3 text-amber-300" /> Swords
          </span>
          <span className="text-base font-bold text-stone-100">{analysis.suitCounts.Swords}</span>
        </div>

        <div className="bg-[#050505] border border-emerald-900/40 p-2 rounded-sm text-center">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider block flex items-center justify-center gap-1">
            <Mountain className="w-3 h-3 text-emerald-400" /> Disks
          </span>
          <span className="text-base font-bold text-stone-100">{analysis.suitCounts.Disks}</span>
        </div>

        <div className="bg-[#050505] border border-purple-900/40 p-2 rounded-sm text-center">
          <span className="text-[10px] text-purple-300 uppercase tracking-wider block flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-300" /> Major Atu
          </span>
          <span className="text-base font-bold text-purple-200">{analysis.majorCount}</span>
        </div>

        <div className="bg-[#050505] border border-[#c5a059]/40 p-2 rounded-sm text-center">
          <span className="text-[10px] text-[#c5a059] uppercase tracking-wider block flex items-center justify-center gap-1">
            <Crown className="w-3 h-3 text-[#c5a059]" /> Royal Court
          </span>
          <span className="text-base font-bold text-[#c5a059]">{analysis.courtCount}</span>
        </div>
      </div>

      {/* Expanded Pattern Details */}
      {expanded && (
        <div className="space-y-5 pt-2 border-t border-white/10 animate-fade-in">
          
          <div className="flex items-center justify-between text-[10px] font-mono text-[#c5a059] uppercase tracking-[0.2em] font-bold">
            <span>Unlocked Synchronicity Badges ({analysis.patterns.length})</span>
            <span className="text-fuchsia-400">Cumulative Rarity: {analysis.cumulativeOddsText}</span>
          </div>

          {/* Active Detected Patterns */}
          {analysis.patterns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.patterns.map((pat) => (
                <div
                  key={pat.id}
                  className={`bg-[#050505] border p-4 rounded-sm space-y-3 transition group relative overflow-hidden ${pat.rarityColor.split(' ').filter(c => c.startsWith('border')).join(' ')} ${pat.rarityColor.split(' ').filter(c => c.startsWith('shadow')).join(' ')}`}
                >
                  {/* Subtle Background Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${pat.rarityColor} opacity-5 blur-2xl pointer-events-none group-hover:opacity-10 transition-opacity duration-500`} />

                  {/* Badge Header Row */}
                  <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-sm flex items-center justify-center bg-[#0a0a0c] border border-white/10 shadow-inner text-lg`}>
                        {pat.icon}
                      </div>
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block mb-0.5 bg-clip-text text-transparent bg-gradient-to-r ${pat.rarityColor.split(' ').filter(c => c.startsWith('from-') || c.startsWith('via-') || c.startsWith('to-')).join(' ')}`}>
                          [ UNLOCKED: {pat.rarityLabel} ]
                        </span>
                        <h4 className="text-xs font-mono font-bold text-stone-200 uppercase tracking-wider">
                          {pat.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 font-serif leading-relaxed relative z-10">
                    {pat.description}
                  </p>

                  <div className="bg-[#0e0e11] p-2.5 rounded-sm border border-white/5 space-y-1.5 text-[11px] relative z-10">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block font-bold">
                      Esoteric Significance:
                    </span>
                    <p className="text-stone-300 font-serif">{pat.esotericMeaning}</p>
                  </div>

                  <div className="bg-[#0e0e11] p-2.5 rounded-sm border border-white/10 space-y-1.5 text-[11px] relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-widest font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#c5a059]" /> Mathematical Proof:
                      </span>
                      <span className="text-[9px] font-mono font-bold text-stone-400 bg-black/40 px-2 py-0.5 rounded-sm border border-white/5">
                        {pat.probabilityOdds}
                      </span>
                    </div>
                    <p className="text-stone-300 font-serif italic opacity-90">{pat.nonRandomProof}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#050505] p-6 rounded-sm border border-white/10 text-xs text-stone-400 font-serif text-center flex flex-col items-center justify-center space-y-3">
              <HelpCircle className="w-6 h-6 text-stone-600" />
              <p>A balanced, nuanced distribution of individual cards across your counting sequence.</p>
              <p className="text-[10px] font-mono uppercase tracking-widest">No Rare Patterns Detected</p>
            </div>
          )}

          {/* Empowerment Philosophy Callout */}
          <div className="bg-[#050505] border border-[#c5a059]/30 p-4 rounded-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c5a059] uppercase tracking-wider font-bold">
              <Compass className="w-4 h-4 text-[#c5a059]" /> Why Tarot Is Empowered & Non-Random
            </div>
            <p className="text-xs text-stone-300 font-serif leading-relaxed">
              {analysis.synchronicityInsight}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
