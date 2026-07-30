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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#c5a059] text-xs font-mono uppercase tracking-[0.2em]">
            <Zap className="w-4 h-4 text-[#c5a059] animate-pulse" /> Proof of Non-Random Synchronicity
          </div>
          <h2 className="atu-font text-xl font-bold text-[#c5a059] tracking-wider">
            Card Set & Elemental Combination Matrix
          </h2>
        </div>

        {/* Resonance Score Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-[#050505] border border-[#c5a059]/50 px-3.5 py-1.5 rounded-sm flex items-center gap-2 shadow-inner">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <div>
              <span className="text-[9px] font-mono text-stone-400 uppercase block tracking-widest leading-none">
                Synchronicity Score
              </span>
              <span className="text-sm font-mono font-bold text-[#c5a059]">
                {analysis.resonanceScore}% Non-Random
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 bg-[#050505] hover:bg-black border border-white/10 text-stone-300 rounded-sm text-xs transition"
            title={expanded ? 'Collapse Matrix' : 'Expand Matrix'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Summary Quote */}
      <div className="bg-[#050505] border-l-3 border-[#c5a059] p-3.5 rounded-r-sm text-xs text-stone-200 font-serif italic">
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
        <div className="space-y-4 pt-2 border-t border-white/10 animate-fade-in">
          {/* Active Detected Patterns */}
          {analysis.patterns.length > 0 ? (
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-[0.2em] font-bold block">
                Detected Esoteric Combinations & Non-Random Proofs ({analysis.patterns.length})
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {analysis.patterns.map((pat) => (
                  <div
                    key={pat.id}
                    className="bg-[#050505] border border-white/10 hover:border-[#c5a059]/40 p-4 rounded-sm space-y-2.5 transition"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{pat.icon}</span>
                        <h4 className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider">
                          {pat.title}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 bg-[#0e0e11] border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-mono rounded-sm">
                        {pat.badgeLabel}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 font-serif leading-relaxed">
                      {pat.description}
                    </p>

                    <div className="bg-[#0e0e11] p-2.5 rounded-sm border border-white/5 space-y-1 text-[11px]">
                      <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block font-bold">
                        Esoteric Significance:
                      </span>
                      <p className="text-stone-300 font-serif">{pat.esotericMeaning}</p>
                    </div>

                    <div className="bg-[#0e0e11] p-2.5 rounded-sm border border-[#c5a059]/20 space-y-1 text-[11px]">
                      <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-widest block font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#c5a059]" /> Proof of Non-Randomness:
                      </span>
                      <p className="text-stone-300 font-serif italic">{pat.nonRandomProof}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#050505] p-4 rounded-sm border border-white/10 text-xs text-stone-400 font-serif text-center">
              A balanced, nuanced distribution of individual cards across your counting sequence.
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
