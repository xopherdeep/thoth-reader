import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, PenLine, Trash2, Eye, Quote, Check, Compass, ArrowRight, Feather } from 'lucide-react';
import { ThothCard } from '../../types';
import { MagicianFannedDeck } from '../MagicianFannedDeck';

interface WizardStepInquiryProps {
  totalSteps: number;
  question: string;
  setQuestion: (q: string) => void;
  step1Phase: 'question' | 'significator';
  setStep1Phase: (phase: 'question' | 'significator') => void;
  deck: ThothCard[];
  selectedSignificatorId: string | null;
  setSelectedSignificatorId: (id: string | null) => void;
  onNextStep: () => void;
}

const promptSuggestions = [
  'What alchemical transformation is required for my career path right now?',
  'What guidance does the Book of Thoth hold for my spiritual awakening?',
  'How can I integrate my shadow aspect in my personal relationships?',
  'What hidden forces are at play in my current life direction?',
];

export const WizardStepInquiry: React.FC<WizardStepInquiryProps> = ({
  totalSteps,
  question,
  setQuestion,
  step1Phase,
  setStep1Phase,
  deck,
  selectedSignificatorId,
  setSelectedSignificatorId,
  onNextStep,
}) => {
  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {step1Phase === 'question' ? (
          <motion.div
            key="question-phase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 relative z-10"
          >
            {/* HEADER SECTION */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/12 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/25 shadow-[0_0_16px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Step 1 of {totalSteps}</span>
                <span className="w-1 h-1 rounded-full bg-[#c5a059]/60" />
                <span>Set Your Narrative Intention</span>
              </motion.div>

              <h2 className="atu-font text-2xl sm:text-[2rem] font-extrabold tracking-wide leading-[1.15]">
                <span className="bg-gradient-to-br from-[#f5ecd4] via-[#c5a059] to-[#8a6520] bg-clip-text text-transparent animate-shimmer" style={{ backgroundImage: 'linear-gradient(105deg, #f5ecd4 0%, #c5a059 30%, #d6b77b 50%, #c5a059 70%, #8a6520 100%)' }}>
                  Write Your Chapter:
                </span>
                <br />
                <span className="text-stone-100/90 text-xl sm:text-2xl font-bold">
                  What Question Do You Bring to the Book?
                </span>
              </h2>

              <p className="text-[13px] sm:text-sm text-stone-400 font-serif leading-[1.7] max-w-2xl">
                The Book of Thoth speaks in timeless parables, unfolding a narrative through archetypes, symbols, and trials. The cards you pull weave the narrative arc of your query. By bringing your question into this symbolic journey, you can view your situation as a personal parable, illuminated by profound self-insight.
              </p>

              <div className="animate-line-reveal h-px bg-gradient-to-r from-[#c5a059]/40 via-[#c5a059]/15 to-transparent" />
            </div>

            {/* QUESTION INPUT SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 text-xs font-mono text-stone-200/90 uppercase tracking-[0.12em] font-semibold">
                  <div className="w-6 h-6 rounded-md bg-[#c5a059]/10 border border-[#c5a059]/25 flex items-center justify-center">
                    <PenLine className="w-3.5 h-3.5 text-[#c5a059]" />
                  </div>
                  <span>Querent's Question / Focus Intention</span>
                </label>
                {question && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setQuestion('')}
                    className="text-[10px] font-mono text-stone-500 hover:text-[#c5a059] transition-all duration-200 flex items-center gap-1.5 bg-white/[0.03] hover:bg-[#c5a059]/10 px-2.5 py-1 rounded-md border border-white/8 hover:border-[#c5a059]/30"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </motion.button>
                )}
              </div>

              <div className="relative group/input">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#c5a059]/20 via-[#d6b77b]/15 to-[#936e2d]/20 rounded-2xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="wizard-textarea-glow relative bg-[#050508]/95 border border-white/10 group-focus-within/input:border-[#c5a059]/60 rounded-xl transition-all duration-300 overflow-hidden">
                  <div className="flex items-start">
                    <div className="pl-4 pt-4 shrink-0 transition-colors duration-200 text-stone-600 group-focus-within/input:text-[#c5a059]">
                      <Eye className="w-5 h-5" />
                    </div>
                    <textarea
                      rows={3}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g., What alchemical transformation is required for my creative path right now?"
                      className="w-full bg-transparent pl-3 pr-5 py-4 text-stone-100 placeholder-stone-600 text-sm outline-none font-sans italic resize-none leading-relaxed"
                    />
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300" />
                </div>
                {question.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-2 right-3 text-[10px] font-mono text-stone-600"
                  >
                    {question.length} chars
                  </motion.div>
                )}
              </div>

              {/* QUICK INQUIRY SUGGESTIONS */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 uppercase tracking-[0.12em]">
                  <Quote className="w-3.5 h-3.5 text-[#c5a059]/60" />
                  <span>Quick Inquiry Suggestions</span>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-stone-600 normal-case tracking-normal text-[10px]">Click to set</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {promptSuggestions.map((prompt, idx) => {
                    const isSelected = question === prompt;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setQuestion(prompt)}
                        className={`group/chip text-left text-[12.5px] p-3.5 rounded-xl border transition-all duration-250 flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#c5a059]/10 border-[#c5a059]/60 text-stone-100 shadow-[0_0_20px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-[#c5a059]/30'
                            : 'bg-[#08080c]/80 hover:bg-[#0e0e14] text-stone-400 hover:text-stone-200 border-white/[0.06] hover:border-[#c5a059]/30'
                        }`}
                      >
                        <div
                          className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isSelected
                              ? 'bg-[#c5a059] text-stone-950 shadow-[0_0_8px_rgba(197,160,89,0.4)]'
                              : 'bg-white/[0.04] text-stone-500 border border-white/10 group-hover/chip:text-[#c5a059] group-hover/chip:border-[#c5a059]/30 group-hover/chip:bg-[#c5a059]/10'
                          }`}
                        >
                          {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Compass className="w-3 h-3" />}
                        </div>
                        <span className="italic font-sans leading-snug">"{prompt}"</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 1 QUESTION FOOTER */}
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-stone-500">
                <Feather className="w-3.5 h-3.5 text-[#c5a059]/50" />
                <span className="italic">Formulate your question to proceed to Significator draw</span>
              </div>
              <button
                disabled={!question.trim()}
                onClick={() => setStep1Phase('significator')}
                className={`ml-auto group relative px-7 py-4 font-bold text-[11px] font-mono uppercase tracking-[0.15em] rounded-xl flex items-center gap-3 transition-all duration-300 active:scale-[0.97] overflow-hidden ${
                  question.trim()
                    ? 'bg-gradient-to-r from-[#c5a059] via-[#b89845] to-[#a37d35] hover:from-[#d6b77b] text-stone-950 shadow-[0_4px_24px_rgba(197,160,89,0.2)] animate-ring-pulse cursor-pointer'
                    : 'bg-white/5 text-stone-600 border border-white/10 opacity-50 cursor-not-allowed'
                }`}
              >
                <span>Next: Draw Significator Bookmark</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="significator-phase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 relative z-10"
          >
            {/* QUESTION SUMMARY BANNER */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#08080d]/90 border border-[#c5a059]/30 shadow-md">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center shrink-0">
                  <PenLine className="w-4 h-4 text-[#c5a059]" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-wider block">Your Narrative Inquiry</span>
                  <span className="text-sm font-serif italic text-stone-200 truncate block">"{question}"</span>
                </div>
              </div>
              <button
                onClick={() => setStep1Phase('question')}
                className="px-3.5 py-1.5 bg-white/[0.04] hover:bg-[#c5a059]/15 text-stone-300 hover:text-[#c5a059] border border-white/10 hover:border-[#c5a059]/40 rounded-lg text-xs font-mono transition shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Edit Question</span>
              </button>
            </div>

            <MagicianFannedDeck
              selectedSignificatorId={selectedSignificatorId}
              onSelectSignificator={(cardId) => setSelectedSignificatorId(cardId)}
              onConfirm={onNextStep}
              onBackToQuestion={() => setStep1Phase('question')}
              deck={deck}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
