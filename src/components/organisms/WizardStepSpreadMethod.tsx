import React from 'react';
import { motion } from 'motion/react';
import { Zap, CheckCircle2, Layers, Maximize2, ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardStepSpreadMethodProps {
  totalSteps: number;
  spreadMode: 'auto' | 'manual';
  setSpreadMode: (mode: 'auto' | 'manual') => void;
  onBack: () => void;
  onNext: () => void;
}

export const WizardStepSpreadMethod: React.FC<WizardStepSpreadMethodProps> = ({
  totalSteps,
  spreadMode,
  setSpreadMode,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-8 relative z-10">
      {/* HEADER SECTION */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/12 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/25 shadow-[0_0_16px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Step 2 of {totalSteps}</span>
          <span className="w-1 h-1 rounded-full bg-[#c5a059]/60" />
          <span>Select Execution Method</span>
        </motion.div>

        <h2 className="atu-font text-2xl sm:text-[2rem] font-extrabold tracking-wide leading-[1.15]">
          <span className="bg-gradient-to-br from-[#f5ecd4] via-[#c5a059] to-[#8a6520] bg-clip-text text-transparent animate-shimmer" style={{ backgroundImage: 'linear-gradient(105deg, #f5ecd4 0%, #c5a059 30%, #d6b77b 50%, #c5a059 70%, #8a6520 100%)' }}>
            How Will You Consult
          </span>
          <br />
          <span className="text-stone-100/90 text-xl sm:text-2xl font-bold">
            the Book of Thoth?
          </span>
        </h2>

        <p className="text-[13px] sm:text-sm text-stone-400 font-serif leading-[1.7] max-w-2xl">
          Choose between the automated Golden Dawn counting loop ritual or manually entering cards drawn from your physical deck.
        </p>
        <div className="animate-line-reveal h-px bg-gradient-to-r from-[#c5a059]/40 via-[#c5a059]/15 to-transparent" />
      </div>

      {/* SPREAD METHOD SELECTOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Method A: Auto */}
        <motion.div
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => setSpreadMode('auto')}
          className={`group/card relative p-6 sm:p-7 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden ${
            spreadMode === 'auto'
              ? 'bg-[#0e0e14]/90 border-[#c5a059]/60 ring-1 ring-[#c5a059]/30 shadow-[0_0_30px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.04)]'
              : 'bg-[#08080c]/80 border-white/[0.06] hover:border-[#c5a059]/25 hover:bg-[#0c0c12]'
          }`}
        >
          {spreadMode === 'auto' && (
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] pointer-events-none bg-[#c5a059]/8 animate-ambient-pulse" />
          )}
          <div className="relative flex items-start justify-between gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              spreadMode === 'auto'
                ? 'bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.2)]'
                : 'bg-white/[0.03] border border-white/10 text-stone-500 group-hover/card:text-[#c5a059] group-hover/card:border-[#c5a059]/25'
            }`}>
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold tracking-wider transition-all duration-200 ${
              spreadMode === 'auto'
                ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_8px_rgba(197,160,89,0.15)]'
                : 'bg-white/[0.04] text-stone-500 border border-white/[0.06]'
            }`}>
              RECOMMENDED
            </span>
          </div>
          <div className="relative">
            <h3 className={`atu-font text-lg font-bold transition-colors duration-200 ${
              spreadMode === 'auto' ? 'text-stone-50' : 'text-stone-200 group-hover/card:text-stone-100'
            }`}>
              Automatic Thoth Counting Loop
            </h3>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              Shuffle the 78 cards, cut into 4 elemental piles (YHVH), pick a Significator, and let Crowley's Golden Dawn jump count generate the sequence.
            </p>
          </div>
          <div className={`text-[11px] font-mono font-bold flex items-center gap-2 pt-1 transition-colors duration-200 ${
            spreadMode === 'auto' ? 'text-[#c5a059]' : 'text-stone-500 group-hover/card:text-[#c5a059]/70'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>Golden Dawn Mathematical Engine</span>
          </div>
        </motion.div>

        {/* Method B: Manual */}
        <motion.div
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => setSpreadMode('manual')}
          className={`group/card relative p-6 sm:p-7 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden ${
            spreadMode === 'manual'
              ? 'bg-[#0e0e14]/90 border-[#c5a059]/60 ring-1 ring-[#c5a059]/30 shadow-[0_0_30px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.04)]'
              : 'bg-[#08080c]/80 border-white/[0.06] hover:border-[#c5a059]/25 hover:bg-[#0c0c12]'
          }`}
        >
          {spreadMode === 'manual' && (
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] pointer-events-none bg-[#c5a059]/8 animate-ambient-pulse" />
          )}
          <div className="relative flex items-start justify-between gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              spreadMode === 'manual'
                ? 'bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.2)]'
                : 'bg-white/[0.03] border border-white/10 text-stone-500 group-hover/card:text-[#c5a059] group-hover/card:border-[#c5a059]/25'
            }`}>
              <Layers className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold tracking-wider transition-all duration-200 ${
              spreadMode === 'manual'
                ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_8px_rgba(197,160,89,0.15)]'
                : 'bg-white/[0.04] text-stone-500 border border-white/[0.06]'
            }`}>
              PHYSICAL DECK
            </span>
          </div>
          <div className="relative">
            <h3 className={`atu-font text-lg font-bold transition-colors duration-200 ${
              spreadMode === 'manual' ? 'text-stone-50' : 'text-stone-200 group-hover/card:text-stone-100'
            }`}>
              Manual Physical Deck Punch-In
            </h3>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              Select cards drawn from your physical real-world Thoth deck in exact sequence using our interactive search & 78-card matrix punch studio.
            </p>
          </div>
          <div className={`text-[11px] font-mono font-bold flex items-center gap-2 pt-1 transition-colors duration-200 ${
            spreadMode === 'manual' ? 'text-[#c5a059]' : 'text-stone-500 group-hover/card:text-[#c5a059]/70'
          }`}>
            <Maximize2 className="w-4 h-4" />
            <span>Fullscreen 78-Card Punch Studio</span>
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="group relative px-5 py-3 bg-transparent hover:bg-white/[0.03] text-stone-400 hover:text-stone-200 border border-white/10 hover:border-white/20 text-xs font-mono uppercase tracking-[0.12em] rounded-xl flex items-center gap-2 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Intention</span>
        </button>

        <button
          onClick={onNext}
          className="group relative px-7 py-4 bg-gradient-to-r from-[#c5a059] via-[#b89845] to-[#a37d35] hover:from-[#d6b77b] hover:via-[#c5a059] hover:to-[#b08940] text-stone-950 font-bold text-[11px] font-mono uppercase tracking-[0.15em] rounded-xl shadow-[0_4px_24px_rgba(197,160,89,0.2),_inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_32px_rgba(197,160,89,0.35)] flex items-center gap-3 transition-all duration-300 active:scale-[0.97] overflow-hidden animate-ring-pulse"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
          <span className="relative z-10">
            {spreadMode === 'auto' ? 'Next: Shuffle the Deck' : 'Next: Punch In Cards'}
          </span>
          <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
