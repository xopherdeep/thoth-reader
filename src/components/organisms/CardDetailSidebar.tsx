import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, RotateCw, BookOpen, Layers, Sparkles, Compass, ImageIcon, Flame } from 'lucide-react';
import { ThothCard } from '../../types';
import { getClassicCardImageUrl, getThothCardImageUrl, THOTH_CARD_BACK_IMAGE } from '../../utils/cardImageUrls';
import { BookOfThothCardVisual } from '../BookOfThothCardVisual';
import { ThothAwesomeSigilCard } from '../ThothAwesomeSigilCard';

interface CardDetailSidebarProps {
  currentCard: ThothCard;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  visualMode: 'thoth' | 'renaissance' | 'sigil';
  setVisualMode: (mode: 'thoth' | 'renaissance' | 'sigil') => void;
  slideDirection: 'next' | 'prev' | null;
  traditionalInfo: { traditionalName: string; comparisonNote: string };
  onPrev: (e?: React.MouseEvent) => void;
  onNext: (e?: React.MouseEvent) => void;
  onOpenLightbox: (e?: React.MouseEvent) => void;
}

const cardSlideVariants = {
  enter: (dir: 'next' | 'prev' | null) => ({
    x: dir === 'next' ? 120 : dir === 'prev' ? -120 : 0,
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (dir: 'next' | 'prev' | null) => ({
    x: dir === 'next' ? -120 : dir === 'prev' ? 120 : 0,
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
  }),
};

export const CardDetailSidebar: React.FC<CardDetailSidebarProps> = ({
  currentCard,
  isFlipped,
  setIsFlipped,
  visualMode,
  setVisualMode,
  slideDirection,
  traditionalInfo,
  onPrev,
  onNext,
  onOpenLightbox,
}) => {
  return (
    <div className="lg:col-span-5 flex flex-col items-center space-y-5 lg:sticky lg:top-24">
      {/* Card Portrait Container with Outer Edge Navigation & Full Border Motion Slide */}
      <div className="w-full max-w-[320px] sm:max-w-[360px] aspect-[1/1.62] perspective-1000 relative group flex items-center justify-center">
        {/* Outer Edge Left Navigation Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev(e);
          }}
          className="absolute -left-5 sm:-left-12 lg:-left-14 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#09090d]/90 hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/70 shadow-2xl transition duration-200 cursor-pointer hover:scale-110 active:scale-95"
          title="Previous Card"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Outer Edge Right Navigation Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext(e);
          }}
          className="absolute -right-5 sm:-right-12 lg:-right-14 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#09090d]/90 hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/70 shadow-2xl transition duration-200 cursor-pointer hover:scale-110 active:scale-95"
          title="Next Card"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Animated Sliding Card */}
        <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
          <motion.div
            key={`${currentCard.id}-${visualMode}`}
            custom={slideDirection}
            variants={cardSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onPanEnd={(e, info) => {
              if (info.offset.x < -40 || info.velocity.x < -200) {
                onNext();
              } else if (info.offset.x > 40 || info.velocity.x > 200) {
                onPrev();
              }
            }}
            className="w-full h-full relative cursor-pointer touch-pan-y"
          >
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-full relative transition-transform duration-700 rounded-lg border-2 border-[#c5a059]/80 shadow-2xl bg-[#050505] group cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Fullscreen Zoom Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLightbox(e);
                }}
                className="absolute top-2.5 right-2.5 z-30 p-2 bg-black/80 hover:bg-[#c5a059] hover:text-stone-950 backdrop-blur-md rounded-full border border-[#c5a059]/80 text-[#c5a059] shadow-xl transition hover:scale-110 cursor-pointer"
                title="Open Fullscreen Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* FRONT FACE */}
              <div
                className="absolute inset-0 w-full h-full flex flex-col bg-[#050505] rounded-md overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {visualMode === 'sigil' ? (
                  <ThothAwesomeSigilCard card={currentCard} showDetails={true} />
                ) : visualMode === 'renaissance' ? (
                  <div className="relative w-full h-full flex flex-col justify-between bg-[#08080c]">
                    {getClassicCardImageUrl(currentCard) ? (
                      <img
                        src={getClassicCardImageUrl(currentCard) || ''}
                        alt={traditionalInfo.traditionalName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center space-y-3">
                        <ImageIcon className="w-12 h-12 text-[#c5a059]" />
                        <div className="text-sm font-mono font-bold text-[#c5a059]">
                          {traditionalInfo.traditionalName}
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/85 to-transparent text-center">
                      <div className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wide">
                        Classic Renaissance Deck
                      </div>
                      <div className="atu-font text-base font-bold text-stone-100">
                        {traditionalInfo.traditionalName}
                      </div>
                      <div className="text-xs text-stone-400 italic">
                        Book of Thoth Equivalent: {currentCard.name}
                      </div>
                    </div>
                  </div>
                ) : (
                  <BookOfThothCardVisual card={currentCard} showDetailsOverlay={true} />
                )}
              </div>

              {/* BACK FACE */}
              <div
                className="absolute inset-0 w-full h-full bg-[#0a0806] flex flex-col justify-between rounded-md overflow-hidden border border-[#c5a059]/40"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#0e0a06]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#18120c] via-[#0d0905] to-[#18120c] pointer-events-none">
                    <div className="w-20 h-20 rounded-full border-2 border-[#c5a059]/70 flex items-center justify-center p-3 mb-3 bg-black/50 shadow-[0_0_25px_rgba(197,160,89,0.35)]">
                      <Flame className="w-10 h-10 text-[#c5a059]" />
                    </div>
                    <div className="atu-font text-base font-bold text-[#c5a059] tracking-widest">ROSICRUCIAN ROSE CROSS</div>
                    <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mt-1">Book of Thoth Deck Back</div>
                  </div>
                  <img
                    src={THOTH_CARD_BACK_IMAGE}
                    alt="Book of Thoth Rosicrucian Rose Cross Card Back"
                    className="w-full h-full object-cover z-10 relative"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 border-2 border-[#c5a059]/50 rounded-md pointer-events-none z-20" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* LARGE, TOUCH-FRIENDLY LEGIBLE CONTROL BUTTONS */}
      <div className="w-full max-w-[360px] space-y-3">
        {/* Flip Card Button */}
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full h-13 min-h-[52px] px-4 bg-[#0e0e11] hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/60 rounded-md font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md transition cursor-pointer active:scale-98"
        >
          <RotateCw className="w-5 h-5 shrink-0" />
          <span>{isFlipped ? 'Show Front Visual' : 'Flip Rosicrucian Back'}</span>
        </button>

        {/* Deck Visual Mode Switcher */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setVisualMode('thoth');
              setIsFlipped(false);
            }}
            className={`h-13 min-h-[52px] p-2 rounded-md border font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition cursor-pointer ${
              visualMode === 'thoth' && !isFlipped
                ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] shadow-lg scale-[1.02]'
                : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5 shrink-0" />
            <span className="truncate">Thoth</span>
          </button>
          <button
            onClick={() => {
              setVisualMode('renaissance');
              setIsFlipped(false);
            }}
            className={`h-13 min-h-[52px] p-2 rounded-md border font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition cursor-pointer ${
              visualMode === 'renaissance' && !isFlipped
                ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] shadow-lg scale-[1.02]'
                : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'
            }`}
          >
            <Layers className="w-4 h-4 mb-0.5 shrink-0" />
            <span className="truncate">Classic</span>
          </button>
          <button
            onClick={() => {
              setVisualMode('sigil');
              setIsFlipped(false);
            }}
            className={`h-13 min-h-[52px] p-2 rounded-md border font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition cursor-pointer ${
              visualMode === 'sigil' && !isFlipped
                ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] shadow-lg scale-[1.02]'
                : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5 shrink-0" />
            <span className="truncate">Sigil</span>
          </button>
        </div>

        {/* Step Count Banner */}
        <div className="bg-[#0e0e11] border border-[#c5a059]/40 rounded-md p-3.5 flex items-center justify-between text-stone-200">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#c5a059]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wide">
              Numerology Count
            </span>
          </div>
          <span className="text-lg font-mono font-bold text-[#c5a059]">
            +{currentCard.numerologyCount} Steps
          </span>
        </div>
      </div>
    </div>
  );
};
