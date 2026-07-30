import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Menu, X, BookOpen, ImageIcon, Sparkles, Compass, Feather, Layers } from 'lucide-react';
import { ThothCard } from '../../types';

interface CardDetailHeaderProps {
  currentCard: ThothCard;
  currentIndex: number;
  totalCards: number;
  isDetailMenuOpen: boolean;
  setIsDetailMenuOpen: (open: boolean) => void;
  visualMode: 'thoth' | 'renaissance' | 'sigil';
  setVisualMode: (mode: 'thoth' | 'renaissance' | 'sigil') => void;
  activeTab: 'overview' | 'esoteric' | 'crowley' | 'traditional';
  setActiveTab: (tab: 'overview' | 'esoteric' | 'crowley' | 'traditional') => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export const CardDetailHeader: React.FC<CardDetailHeaderProps> = ({
  currentCard,
  currentIndex,
  totalCards,
  isDetailMenuOpen,
  setIsDetailMenuOpen,
  visualMode,
  setVisualMode,
  activeTab,
  setActiveTab,
  onPrev,
  onNext,
  onClose,
}) => {
  return (
    <header className="shrink-0 z-40 bg-[#09090d]/95 backdrop-blur-md border-b border-[#c5a059]/40 shadow-2xl px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
      {/* Left: Return Button */}
      <button
        onClick={onClose}
        className="h-10 sm:h-12 px-3 sm:px-5 bg-[#0e0e11] hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/60 rounded-md font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95 shrink-0 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span className="tracking-wide uppercase font-mono hidden xs:inline">Back</span>
      </button>

      {/* Center: Title & Card Index Counter */}
      <div className="flex flex-col items-center text-center mx-1 overflow-hidden">
        <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#c5a059] font-semibold truncate">
          Card {currentIndex + 1} of {totalCards} • {currentCard.category}
        </div>
        <h1 className="atu-font text-base sm:text-xl md:text-2xl font-bold tracking-wider text-stone-100 truncate">
          {currentCard.name}
        </h1>
        <p className="text-[11px] sm:text-xs font-serif italic text-stone-400 truncate hidden md:block">
          "{currentCard.thothTitle}"
        </p>
      </div>

      {/* Right Actions: Desktop Prev/Next + Mobile Hamburger Button */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onPrev}
            title="Previous Card"
            className="h-10 sm:h-12 px-3 sm:px-4 bg-[#0e0e11] hover:bg-[#1c1c24] text-stone-200 hover:text-[#c5a059] border border-white/20 hover:border-[#c5a059] rounded-md font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-mono uppercase">Prev</span>
          </button>
          <button
            onClick={onNext}
            title="Next Card"
            className="h-10 sm:h-12 px-3 sm:px-4 bg-[#0e0e11] hover:bg-[#1c1c24] text-stone-200 hover:text-[#c5a059] border border-white/20 hover:border-[#c5a059] rounded-md font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <span className="font-mono uppercase">Next</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsDetailMenuOpen(!isDetailMenuOpen)}
          className="h-10 sm:h-12 px-2.5 sm:px-3 bg-[#0e0e11] hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/60 rounded-md flex items-center gap-1.5 font-bold text-xs transition active:scale-95 cursor-pointer shadow-md"
          aria-label="Toggle Card Menu"
        >
          {isDetailMenuOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
          <span className="hidden xs:inline font-mono uppercase text-[11px]">Menu</span>
        </button>
      </div>

      {/* Mobile Detail Menu Drawer */}
      <AnimatePresence>
        {isDetailMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute top-full left-0 right-0 z-50 bg-[#09090d]/98 backdrop-blur-xl border-b border-[#c5a059]/40 shadow-2xl overflow-hidden p-4 space-y-4"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#c5a059] uppercase tracking-widest pb-2 border-b border-white/10">
              <span>Card Controls & Modes</span>
              <span>{currentCard.name}</span>
            </div>

            {/* Quick Card Nav Buttons in Drawer */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onPrev();
                  setIsDetailMenuOpen(false);
                }}
                className="p-2.5 bg-[#0e0e11] hover:bg-[#c5a059] text-stone-200 hover:text-stone-950 border border-white/15 rounded-md text-xs font-bold font-mono flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Card</span>
              </button>
              <button
                onClick={() => {
                  onNext();
                  setIsDetailMenuOpen(false);
                }}
                className="p-2.5 bg-[#0e0e11] hover:bg-[#c5a059] text-stone-200 hover:text-stone-950 border border-white/15 rounded-md text-xs font-bold font-mono flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>Next Card</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Modes Selection */}
            <div>
              <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-2">Visual Rendering Mode</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setVisualMode('thoth');
                    setIsDetailMenuOpen(false);
                  }}
                  className={`p-2 rounded-md text-xs font-bold border flex flex-col items-center gap-1 cursor-pointer transition ${
                    visualMode === 'thoth'
                      ? 'bg-[#c5a059] text-stone-950 border-[#c5a059]'
                      : 'bg-[#0e0e11] text-stone-300 border-white/10'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Thoth Art</span>
                </button>
                <button
                  onClick={() => {
                    setVisualMode('renaissance');
                    setIsDetailMenuOpen(false);
                  }}
                  className={`p-2 rounded-md text-xs font-bold border flex flex-col items-center gap-1 cursor-pointer transition ${
                    visualMode === 'renaissance'
                      ? 'bg-[#c5a059] text-stone-950 border-[#c5a059]'
                      : 'bg-[#0e0e11] text-stone-300 border-white/10'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Renaissance</span>
                </button>
                <button
                  onClick={() => {
                    setVisualMode('sigil');
                    setIsDetailMenuOpen(false);
                  }}
                  className={`p-2 rounded-md text-xs font-bold border flex flex-col items-center gap-1 cursor-pointer transition ${
                    visualMode === 'sigil'
                      ? 'bg-[#c5a059] text-stone-950 border-[#c5a059]'
                      : 'bg-[#0e0e11] text-stone-300 border-white/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sigil Wheel</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs Quick Jump */}
            <div>
              <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-2">Jump to Section</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setIsDetailMenuOpen(false);
                  }}
                  className={`p-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border cursor-pointer transition ${
                    activeTab === 'overview'
                      ? 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]'
                      : 'bg-[#0e0e11] text-stone-300 border-white/10'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('esoteric');
                    setIsDetailMenuOpen(false);
                  }}
                  className={`p-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border cursor-pointer transition ${
                    activeTab === 'esoteric'
                      ? 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]'
                      : 'bg-[#0e0e11] text-stone-300 border-white/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Attributions</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('crowley');
                    setIsDetailMenuOpen(false);
                  }}
                  className={`p-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border cursor-pointer transition ${
                    activeTab === 'crowley'
                      ? 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]'
                      : 'bg-[#0e0e11] text-stone-300 border-white/10'
                  }`}
                >
                  <Feather className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Meaning</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('traditional');
                    setIsDetailMenuOpen(false);
                  }}
                  className={`p-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border cursor-pointer transition ${
                    activeTab === 'traditional'
                      ? 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]'
                      : 'bg-[#0e0e11] text-stone-300 border-white/10'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Bridge</span>
                </button>
              </div>
            </div>

            {/* Close Detail Button */}
            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-500/40 rounded-md text-xs font-bold font-mono transition cursor-pointer"
              >
                Exit Detail View
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
