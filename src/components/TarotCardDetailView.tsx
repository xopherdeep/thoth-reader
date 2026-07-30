import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ThothCard } from '../types';
import { THOTH_DECK } from '../data/thothCards';
import { getTraditionalTarotInfo } from '../utils/tarotNameBridge';

import { CardDetailHeader } from './organisms/CardDetailHeader';
import { CardDetailTabs } from './organisms/CardDetailTabs';
import { CardDetailOverview } from './organisms/CardDetailOverview';
import { CardDetailAttributions } from './organisms/CardDetailAttributions';
import { CardDetailMeaning } from './organisms/CardDetailMeaning';
import { CardDetailTraditionalBridge } from './organisms/CardDetailTraditionalBridge';
import { CardLightbox } from './organisms/CardLightbox';
import { CardDetailSidebar } from './organisms/CardDetailSidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TarotCardDetailViewProps {
  card: ThothCard;
  cardList?: ThothCard[];
  onClose: () => void;
  onSelectCard?: (newCard: ThothCard) => void;
}

export const TarotCardDetailView: React.FC<TarotCardDetailViewProps> = ({
  card: initialCard,
  cardList,
  onClose,
  onSelectCard,
}) => {
  const [currentCard, setCurrentCard] = useState<ThothCard>(initialCard);
  const [isFlipped, setIsFlipped] = useState(false);
  const [visualMode, setVisualMode] = useState<'thoth' | 'renaissance' | 'sigil'>('thoth');
  const [activeTab, setActiveTab] = useState<'overview' | 'esoteric' | 'crowley' | 'traditional'>('overview');
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);
  const [isDetailMenuOpen, setIsDetailMenuOpen] = useState(false);
  const [isFullscreenImageOpen, setIsFullscreenImageOpen] = useState(false);

  useEffect(() => {
    setCurrentCard(initialCard);
  }, [initialCard]);

  const deckToUse = useMemo(() => {
    return cardList && cardList.length > 0 ? cardList : THOTH_DECK;
  }, [cardList]);

  const currentIndex = useMemo(() => {
    const idx = deckToUse.findIndex((c) => c.id === currentCard.id);
    return idx >= 0 ? idx : 0;
  }, [deckToUse, currentCard]);

  const totalCards = deckToUse.length;

  const handlePrev = useCallback(() => {
    if (totalCards === 0) return;
    const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
    const nextCardObj = deckToUse[prevIndex];
    setSlideDirection('prev');
    setCurrentCard(nextCardObj);
    setIsFlipped(false);
    if (onSelectCard) onSelectCard(nextCardObj);
  }, [currentIndex, totalCards, deckToUse, onSelectCard]);

  const handleNext = useCallback(() => {
    if (totalCards === 0) return;
    const nextIndex = (currentIndex + 1) % totalCards;
    const nextCardObj = deckToUse[nextIndex];
    setSlideDirection('next');
    setCurrentCard(nextCardObj);
    setIsFlipped(false);
    if (onSelectCard) onSelectCard(nextCardObj);
  }, [currentIndex, totalCards, deckToUse, onSelectCard]);

  // Touch Swipe Gesture Handlers
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [touchEndPos, setTouchEndPos] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndPos(null);
    setTouchStartPos({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndPos({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStartPos || !touchEndPos) return;
    const diffX = touchStartPos.x - touchEndPos.x;
    const diffY = touchStartPos.y - touchEndPos.y;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.25) {
      if (diffX > 0) handleNext();
      else handlePrev();
    }
    setTouchStartPos(null);
    setTouchEndPos(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isFullscreenImageOpen) setIsFullscreenImageOpen(false);
        else onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, onClose, isFullscreenImageOpen]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const traditionalInfo = getTraditionalTarotInfo(currentCard);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-[#050505] text-[#e5e5e5] w-full h-full font-sans flex flex-col selection:bg-[#c5a059]/30 selection:text-[#c5a059] animate-fade-in"
    >
      <CardDetailHeader
        currentCard={currentCard}
        currentIndex={currentIndex}
        totalCards={totalCards}
        isDetailMenuOpen={isDetailMenuOpen}
        setIsDetailMenuOpen={setIsDetailMenuOpen}
        visualMode={visualMode}
        setVisualMode={setVisualMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={onClose}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-10 pb-36 flex-1 overflow-y-auto min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <CardDetailSidebar
          currentCard={currentCard}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          visualMode={visualMode}
          setVisualMode={setVisualMode}
          slideDirection={slideDirection}
          traditionalInfo={traditionalInfo}
          onPrev={handlePrev}
          onNext={handleNext}
          onOpenLightbox={() => setIsFullscreenImageOpen(true)}
        />

        <div className="lg:col-span-7 space-y-8">
          <div className="bg-[#0e0e11] p-6 rounded-lg border border-[#c5a059]/50 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 rounded-md text-xs font-mono font-bold uppercase tracking-wider">
                  {currentCard.category}
                </span>
                <span className="px-3 py-1 bg-white/10 text-stone-300 border border-white/15 rounded-md text-xs font-mono font-bold uppercase tracking-wider">
                  {currentCard.type.toUpperCase()}
                </span>
                {currentCard.suit && (
                  <span className="px-3 py-1 bg-white/10 text-stone-300 border border-white/15 rounded-md text-xs font-mono font-bold uppercase tracking-wider">
                    {currentCard.suit}
                  </span>
                )}
              </div>
              <div className="text-xs font-mono text-stone-400">
                Golden Dawn ATU Code: <strong className="text-[#c5a059]">{currentCard.atuNumber !== null ? `ATU ${currentCard.atuNumber}` : currentCard.id}</strong>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="atu-font text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider text-[#c5a059]">
                {currentCard.name}
              </h2>
              <p className="text-lg sm:text-xl font-serif italic text-stone-300">
                "{currentCard.thothTitle}"
              </p>
            </div>

            {currentCard.hebrewLetter && (
              <div className="bg-[#050505] p-5 rounded-md border border-[#c5a059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0e0e11] rounded-md border-2 border-[#c5a059] flex items-center justify-center text-4xl sm:text-5xl font-serif text-[#c5a059] shadow-inner shrink-0">
                    {currentCard.hebrewLetter.letter}
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-[#c5a059] tracking-widest font-bold">Hebrew Letter Attribution</div>
                    <div className="text-xl font-bold text-stone-100 font-serif">
                      {currentCard.hebrewLetter.name} ({currentCard.hebrewLetter.meaning})
                    </div>
                    <div className="text-xs text-stone-400 font-mono mt-0.5">
                      Gematria Value: <strong className="text-stone-200">{currentCard.hebrewLetter.value}</strong>
                    </div>
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 w-full sm:w-auto">
                  <div className="text-xs font-mono text-stone-400 uppercase">Tree of Life Path</div>
                  <div className="text-sm font-bold text-[#c5a059] font-mono">
                    {currentCard.treeOfLife.sephiraOrPath}
                  </div>
                </div>
              </div>
            )}
          </div>

          <CardDetailTabs activeTab={activeTab} setActiveTab={setActiveTab} variant="inline" />

          {activeTab === 'overview' && <CardDetailOverview currentCard={currentCard} />}
          {activeTab === 'esoteric' && <CardDetailAttributions currentCard={currentCard} />}
          {activeTab === 'crowley' && <CardDetailMeaning currentCard={currentCard} />}
          {activeTab === 'traditional' && <CardDetailTraditionalBridge traditionalInfo={traditionalInfo} />}

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              className="w-full sm:w-auto h-14 min-h-[52px] px-6 bg-[#0e0e11] hover:bg-[#1a1a22] text-stone-200 hover:text-[#c5a059] border border-white/20 hover:border-[#c5a059] rounded-md font-bold text-base flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Card</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto h-14 min-h-[52px] px-8 bg-[#c5a059] text-stone-950 hover:bg-[#d6b77b] rounded-md font-bold text-base uppercase font-mono tracking-wider shadow-lg transition cursor-pointer active:scale-98"
            >
              Return to Gallery
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto h-14 min-h-[52px] px-6 bg-[#0e0e11] hover:bg-[#1a1a22] text-stone-200 hover:text-[#c5a059] border border-white/20 hover:border-[#c5a059] rounded-md font-bold text-base flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <span>Next Card</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      <CardDetailTabs activeTab={activeTab} setActiveTab={setActiveTab} variant="fab" />

      <CardLightbox
        isOpen={isFullscreenImageOpen}
        onClose={() => setIsFullscreenImageOpen(false)}
        currentCard={currentCard}
        currentIndex={currentIndex}
        totalCards={totalCards}
        traditionalInfo={traditionalInfo}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        visualMode={visualMode}
        setVisualMode={setVisualMode}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
};
