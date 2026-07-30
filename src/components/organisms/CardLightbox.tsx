import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { ThothCard } from '../../types';
import { getThothCardImageUrl, getClassicCardImageUrl, THOTH_CARD_BACK_IMAGE } from '../../utils/cardImageUrls';
import { ThothAwesomeSigilCard } from '../ThothAwesomeSigilCard';

interface CardLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  currentCard: ThothCard;
  currentIndex: number;
  totalCards: number;
  traditionalInfo: { traditionalName: string; comparisonNote: string };
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  visualMode: 'thoth' | 'renaissance' | 'sigil';
  setVisualMode: (mode: 'thoth' | 'renaissance' | 'sigil') => void;
  onPrev: () => void;
  onNext: () => void;
}

export const CardLightbox: React.FC<CardLightboxProps> = ({
  isOpen,
  onClose,
  currentCard,
  currentIndex,
  totalCards,
  traditionalInfo,
  isFlipped,
  setIsFlipped,
  visualMode,
  setVisualMode,
  onPrev,
  onNext,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-2 sm:p-5 text-stone-100 select-none overflow-hidden"
          onClick={onClose}
        >
          {/* Lightbox Top Header */}
          <div
            className="flex items-center justify-between gap-3 px-2 pt-1 z-10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col min-w-0">
              <div className="text-[10px] sm:text-xs font-mono text-[#c5a059] uppercase tracking-widest font-semibold truncate">
                {currentCard.category} • Card {currentIndex + 1} of {totalCards}
              </div>
              <h2 className="atu-font text-lg sm:text-2xl font-bold text-stone-100 truncate">
                {currentCard.name}
              </h2>
              <p className="text-xs sm:text-sm italic font-serif text-stone-400 truncate">
                "{currentCard.thothTitle}"
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0e0e11] hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/60 rounded-md font-mono font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-lg shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Close</span>
            </button>
          </div>

          {/* Lightbox Center Image with Navigation Arrows */}
          <div
            className="relative flex-1 w-full h-full flex flex-col items-center justify-center my-1 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Arrow */}
            <button
              onClick={onPrev}
              className="absolute left-1 sm:left-4 z-30 p-2.5 sm:p-4 rounded-full bg-[#09090d]/85 hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/70 shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
              title="Previous Card"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* High-Res Artwork Display (Click/Tap to Flip Card) */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative max-h-[85vh] max-w-[96vw] h-full flex flex-col items-center justify-center p-1 cursor-pointer group select-none"
              style={{ perspective: '1200px' }}
              title="Tap image to flip card"
            >
              {visualMode === 'sigil' ? (
                <div className="max-h-[80vh] sm:max-h-[84vh] aspect-[1/1.6] w-auto h-full max-w-md">
                  <ThothAwesomeSigilCard card={currentCard} showDetails={true} />
                </div>
              ) : visualMode === 'renaissance' ? (
                <div className="relative max-h-[82vh] sm:max-h-[85vh] h-full flex flex-col items-center justify-center">
                  {getClassicCardImageUrl(currentCard) ? (
                    <img
                      src={getClassicCardImageUrl(currentCard) || ''}
                      alt={traditionalInfo.traditionalName}
                      referrerPolicy="no-referrer"
                      className="max-h-[78vh] sm:max-h-[82vh] max-w-[92vw] sm:max-w-[85vw] h-auto w-auto object-contain rounded-lg border-2 border-[#c5a059]/80 shadow-[0_0_60px_rgba(197,160,89,0.35)] transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                  ) : (
                    <div className="p-8 sm:p-12 bg-[#08080c] border border-[#c5a059]/50 rounded-lg text-center space-y-3">
                      <ImageIcon className="w-12 h-12 text-[#c5a059] mx-auto" />
                      <div className="text-sm font-mono font-bold text-[#c5a059]">
                        {traditionalInfo.traditionalName}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* THOTH CARD 3D FLIP CONTAINER IN LIGHTBOX */
                <div
                  className="relative max-h-[80vh] sm:max-h-[84vh] aspect-[1/1.66] h-full w-auto transition-transform duration-700 rounded-lg border-2 border-[#c5a059]/80 shadow-[0_0_70px_rgba(197,160,89,0.4)] bg-[#050505]"
                  style={{
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* FRONT FACE */}
                  <div
                    className="absolute inset-0 w-full h-full bg-[#050505] rounded-md overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <img
                      src={getThothCardImageUrl(currentCard) || ''}
                      alt={currentCard.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* BACK FACE */}
                  <div
                    className="absolute inset-0 w-full h-full bg-[#08080c] rounded-md overflow-hidden border border-[#c5a059]/50 flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <img
                      src={THOTH_CARD_BACK_IMAGE}
                      alt="Rosicrucian Rose Cross Card Back"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </div>
              )}

              {/* Tap to Flip Banner */}
              <div className="mt-2.5 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full border border-[#c5a059]/40 text-[10px] sm:text-xs font-mono font-medium text-[#c5a059] opacity-80 group-hover:opacity-100 transition shadow-md">
                ✨ Tap image to flip • Click arrows to navigate
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={onNext}
              className="absolute right-1 sm:right-4 z-30 p-2.5 sm:p-4 rounded-full bg-[#09090d]/85 hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/70 shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
              title="Next Card"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>

          {/* Lightbox Bottom Controls */}
          <div
            className="flex items-center justify-center z-10 shrink-0 pb-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0e0e11]/90 backdrop-blur-md border border-[#c5a059]/40 rounded-lg p-1.5 flex items-center gap-1.5 max-w-full overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  setVisualMode('thoth');
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-[11px] sm:text-xs font-bold font-mono transition cursor-pointer whitespace-nowrap ${
                  visualMode === 'thoth' && !isFlipped
                    ? 'bg-[#c5a059] text-stone-950'
                    : 'text-stone-300 hover:text-[#c5a059]'
                }`}
              >
                Thoth
              </button>
              <button
                onClick={() => {
                  setVisualMode('renaissance');
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-[11px] sm:text-xs font-bold font-mono transition cursor-pointer whitespace-nowrap ${
                  visualMode === 'renaissance' && !isFlipped
                    ? 'bg-[#c5a059] text-stone-950'
                    : 'text-stone-300 hover:text-[#c5a059]'
                }`}
              >
                Classic
              </button>
              <button
                onClick={() => {
                  setVisualMode('sigil');
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-[11px] sm:text-xs font-bold font-mono transition cursor-pointer whitespace-nowrap ${
                  visualMode === 'sigil' && !isFlipped
                    ? 'bg-[#c5a059] text-stone-950'
                    : 'text-stone-300 hover:text-[#c5a059]'
                }`}
              >
                Sigil Wheel
              </button>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-[11px] sm:text-xs font-bold font-mono transition cursor-pointer whitespace-nowrap ${
                  isFlipped
                    ? 'bg-[#c5a059] text-stone-950'
                    : 'text-stone-300 hover:text-[#c5a059]'
                }`}
              >
                Rose Cross Back
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
