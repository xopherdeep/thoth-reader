import React from 'react';
import { Flame, Droplets, Layers } from 'lucide-react';

interface ElementalCutTrackerProps {
  cutStage: 1 | 2 | 3 | 'done';
  stackACount: number;
  stackBCount: number;
  yodCount: number;
  vauCount: number;
  hehCount: number;
  hehFinalCount: number;
}

export const ElementalCutTracker: React.FC<ElementalCutTrackerProps> = ({
  cutStage,
  stackACount,
  stackBCount,
  yodCount,
  vauCount,
  hehCount,
  hehFinalCount,
}) => {
  return (
    <div className="lg:col-span-4 bg-[#050509]/90 border border-[#c5a059]/30 rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center gap-2 pb-2 border-b border-white/10">
        <Layers className="w-4 h-4 text-[#c5a059]" />
        <h4 className="text-xs font-mono uppercase tracking-wider text-stone-200 font-bold">
          Elemental Books & Card Counts
        </h4>
      </div>

      <div className="space-y-3">
        {/* Stage 1 Main Deck Tracker */}
        <div
          className={`p-3 rounded-lg border transition-all ${cutStage === 1 ? "bg-[#c5a059]/15 border-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.15)]" : "bg-white/[0.03] border-white/10 opacity-70"}`}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-stone-200">Main Thoth Deck</span>
            <span className="px-2 py-0.5 rounded bg-black/60 text-[#c5a059] font-bold border border-white/10">
              78 CARDS
            </span>
          </div>
          <p className="text-[10px] font-serif text-stone-400 mt-1">
            {cutStage === 1
              ? "Ready to cut into Fire/Air & Water/Earth Books"
              : "Cut into Fire/Air & Water/Earth Books"}
          </p>
        </div>

        {/* Fire & Air Books */}
        <div
          className={`p-3 rounded-lg border transition-all ${cutStage === 2 ? "bg-rose-950/40 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.15)]" : "bg-white/[0.03] border-white/10"}`}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-rose-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Fire & Air Books
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-500/30">
              {stackACount} CARDS
            </span>
          </div>
          {cutStage !== 'done' && cutStage >= 2 && (
            <div className="mt-2 text-[10px] font-mono text-stone-400 space-y-1 pl-2 border-l border-rose-500/30">
              <div>
                Fire Book (Will):{" "}
                <strong className="text-rose-300">{yodCount} cards</strong>
              </div>
              <div>
                Air Book (Intellect):{" "}
                <strong className="text-amber-300">{vauCount} cards</strong>
              </div>
            </div>
          )}
        </div>

        {/* Water & Earth Books */}
        <div
          className={`p-3 rounded-lg border transition-all ${cutStage === 3 ? "bg-sky-950/40 border-sky-500/60 shadow-[0_0_12px_rgba(56,189,248,0.15)]" : "bg-white/[0.03] border-white/10"}`}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-sky-300 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" /> Water & Earth Books
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-500/30">
              {stackBCount} CARDS
            </span>
          </div>
          {cutStage !== 'done' && cutStage === 3 && (
            <div className="mt-2 text-[10px] font-mono text-stone-400 space-y-1 pl-2 border-l border-sky-500/30">
              <div>
                Water Book (Emotion):{" "}
                <strong className="text-sky-300">{hehCount} cards</strong>
              </div>
              <div>
                Earth Book (Material):{" "}
                <strong className="text-emerald-300">{hehFinalCount} cards</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
