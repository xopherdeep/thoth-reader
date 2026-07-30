import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThothCard } from '../types';
import { THOTH_DECK } from '../data/thothCards';
import { BookOfThothCardVisual } from './BookOfThothCardVisual';
import { ThothAwesomeSigilCard } from './ThothAwesomeSigilCard';
import { getTraditionalTarotInfo } from '../utils/tarotNameBridge';
import { THOTH_CARD_BACK_IMAGE, getThothCardImageUrl, getClassicCardImageUrl } from '../utils/cardImageUrls';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
  BookOpen,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Layers,
  Compass,
  Feather,
  Sun,
  Moon,
  Info,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  Menu,
  X,
  ZoomIn,
  Maximize2,
} from 'lucide-react';

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

  // Sync currentCard if prop initialCard changes
  useEffect(() => {
    setCurrentCard(initialCard);
  }, [initialCard]);

  // Active deck list for navigation (custom card list or full 78 Thoth deck)
  const deckToUse = useMemo(() => {
    return cardList && cardList.length > 0 ? cardList : THOTH_DECK;
  }, [cardList]);

  // Find index in current deck/list for prev / next navigation
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

    // Minimum swipe distance threshold (40px) & horizontal dominance check
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.25) {
      if (diffX > 0) {
        // Swiped Left (right to left gesture) -> Next card
        handleNext();
      } else {
        // Swiped Right (left to right gesture) -> Previous card
        handlePrev();
      }
    }
    setTouchStartPos(null);
    setTouchEndPos(null);
  };

  // Keyboard Arrow Navigation
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
        if (isFullscreenImageOpen) {
          setIsFullscreenImageOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, onClose, isFullscreenImageOpen]);

  // Lock body scroll when full-screen detail view is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const traditionalInfo = getTraditionalTarotInfo(currentCard);

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

  // Motion variants for smooth horizontal card sliding
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

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-[#050505] text-[#e5e5e5] w-full h-full font-sans flex flex-col selection:bg-[#c5a059]/30 selection:text-[#c5a059] animate-fade-in"
    >
      {/* 1. TOP NAVIGATION BAR */}
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
              onClick={handlePrev}
              title="Previous Card"
              className="h-10 sm:h-12 px-3 sm:px-4 bg-[#0e0e11] hover:bg-[#1c1c24] text-stone-200 hover:text-[#c5a059] border border-white/20 hover:border-[#c5a059] rounded-md font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-mono uppercase">Prev</span>
            </button>

            <button
              onClick={handleNext}
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
                    handlePrev();
                    setIsDetailMenuOpen(false);
                  }}
                  className="p-2.5 bg-[#0e0e11] hover:bg-[#c5a059] text-stone-200 hover:text-stone-950 border border-white/15 rounded-md text-xs font-bold font-mono flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Card</span>
                </button>

                <button
                  onClick={() => {
                    handleNext();
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

      {/* 2. FULL-SCREEN MAIN CONTENT GRID */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-10 pb-36 flex-1 overflow-y-auto min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: HIGH-RES ARTWORK & DECK CONTROLS (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-5 lg:sticky lg:top-24">
          
          {/* Card Portrait Container with Outer Edge Navigation & Full Border Motion Slide */}
          <div className="w-full max-w-[320px] sm:max-w-[360px] aspect-[1/1.62] perspective-1000 relative group flex items-center justify-center">
            {/* Outer Edge Left Navigation Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute -left-5 sm:-left-12 lg:-left-14 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#09090d]/90 hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/70 shadow-2xl transition duration-200 cursor-pointer hover:scale-110 active:scale-95"
              title="Previous Card (← key or Swipe Right)"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Outer Edge Right Navigation Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute -right-5 sm:-right-12 lg:-right-14 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#09090d]/90 hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/70 shadow-2xl transition duration-200 cursor-pointer hover:scale-110 active:scale-95"
              title="Next Card (→ key or Swipe Left)"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Animated Sliding Card (Border & Image slide together as one piece) */}
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
                    handleNext();
                  } else if (info.offset.x > 40 || info.velocity.x > 200) {
                    handlePrev();
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
                    WebkitTransform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Fullscreen Zoom Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFullscreenImageOpen(true);
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
                      /* CLASSIC RENAISSANCE DECK VIEW */
                      <div className="relative w-full h-full flex flex-col justify-between bg-[#08080c]">
                        {getClassicCardImageUrl(currentCard) ? (
                          <img
                            src={getClassicCardImageUrl(currentCard)}
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
                      /* BOOK OF THOTH DECK VIEW */
                      <BookOfThothCardVisual card={currentCard} showDetailsOverlay={true} />
                    )}
                  </div>

                  {/* BACK FACE (PURE AUTHENTIC ROSICRUCIAN ROSE CROSS REVERSE) */}
                  <div
                    className="absolute inset-0 w-full h-full bg-[#0a0806] flex flex-col justify-between rounded-md overflow-hidden border border-[#c5a059]/40"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      WebkitTransform: 'rotateY(180deg)',
                    }}
                  >
                    {/* Full Bleed Authentic Lady Frieda Harris Rose Cross Artwork */}
                    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#0e0a06]">
                      {/* Stylized Golden Rosicrucian Emblem Background Fallback */}
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

                      {/* Subtle golden ambient vignette frame */}
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

            {/* Deck Visual Mode Switcher (Large Buttons) */}
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

        {/* RIGHT COLUMN: REIMAGINED ESOTERIC ATTRIBUTE WORKSPACE (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-8">

          {/* 1. PRIMARY TITLE & HEBREW LETTER BANNER */}
          <div className="bg-[#0e0e11] p-6 rounded-lg border border-[#c5a059]/50 shadow-2xl space-y-6">
            
            {/* Badges Header */}
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

            {/* Main Title Block */}
            <div className="space-y-1">
              <h2 className="atu-font text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider text-[#c5a059]">
                {currentCard.name}
              </h2>
              <p className="text-lg sm:text-xl font-serif italic text-stone-300">
                "{currentCard.thothTitle}"
              </p>
            </div>

            {/* Hebrew Letter Hero Card (if present) */}
            {currentCard.hebrewLetter && (
              <div className="bg-[#050505] p-5 rounded-md border border-[#c5a059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0e0e11] rounded-md border-2 border-[#c5a059] flex items-center justify-center text-4xl sm:text-5xl font-serif text-[#c5a059] shadow-inner shrink-0">
                    {currentCard.hebrewLetter.letter}
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-[#c5a059] tracking-widest font-bold">
                      Hebrew Letter Attribution
                    </div>
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

          {/* 2. NAVIGATION TABS FOR ATTRIBUTE SECTIONS (Floating Bottom Dock FAB) */}
          {/* We present active section tab inline for desktop + fixed bottom dock for effortless access */}
          <div className="hidden sm:grid grid-cols-4 gap-2.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`h-12 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-[1.02]'
                  : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('esoteric')}
              className={`h-12 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer ${
                activeTab === 'esoteric'
                  ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-[1.02]'
                  : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Attributions</span>
            </button>

            <button
              onClick={() => setActiveTab('crowley')}
              className={`h-12 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer ${
                activeTab === 'crowley'
                  ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-[1.02]'
                  : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'
              }`}
            >
              <Feather className="w-4 h-4 shrink-0" />
              <span>Meaning</span>
            </button>

            <button
              onClick={() => setActiveTab('traditional')}
              className={`h-12 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer ${
                activeTab === 'traditional'
                  ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-[1.02]'
                  : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Bridge</span>
            </button>
          </div>

          {/* 3. TAB 1: OVERVIEW & KEY BENTO METRICS */}
          {activeTab === 'overview' && (
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
          )}

          {/* 4. TAB 2: DETAILED KABBALISTIC & ESOTERIC ATTRIBUTIONS */}
          {activeTab === 'esoteric' && (
            <div className="space-y-6 animate-fade-in">
              {/* Hebrew Deep Dive */}
              {currentCard.hebrewLetter && (
                <div className="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
                    <span className="text-lg">א</span> Hebrew Letter & Kabbalistic Path
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#050505] p-4 rounded-md border border-white/10">
                    <div>
                      <div className="text-xs font-mono text-stone-400 uppercase">Glyph & Name</div>
                      <div className="text-xl font-bold text-[#c5a059] font-serif">
                        {currentCard.hebrewLetter.letter} ({currentCard.hebrewLetter.name})
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-stone-400 uppercase">Literal Translation</div>
                      <div className="text-base font-bold text-stone-200 font-serif">
                        "{currentCard.hebrewLetter.meaning}"
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-stone-400 uppercase">Gematria Value</div>
                      <div className="text-xl font-mono font-bold text-stone-100">
                        {currentCard.hebrewLetter.value}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Astrological Deep Dive */}
              <div className="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
                  <Compass className="w-4 h-4" /> Astrological & Astronomical Correspondences
                </h3>
                <div className="space-y-3 bg-[#050505] p-5 rounded-md border border-white/10 text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-stone-400 font-mono">Attribution Type:</span>
                    <span className="font-bold text-stone-200">{currentCard.astrology?.type || 'Cosmic'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-stone-400 font-mono">Astrological Name:</span>
                    <span className="font-bold text-[#c5a059] font-serif">
                      {currentCard.astrology?.name} {currentCard.astrology?.symbol}
                    </span>
                  </div>
                  {currentCard.astrology?.decanDetails && (
                    <div className="pt-1">
                      <span className="text-stone-400 font-mono text-xs uppercase block mb-1">
                        Golden Dawn Decan Rulership & Dates:
                      </span>
                      <p className="text-stone-200 font-serif leading-relaxed">
                        {currentCard.astrology.decanDetails}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Alchemical Operations */}
              <div className="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" /> Hermetic Alchemical Operation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#050505] p-5 rounded-md border border-white/10 text-sm">
                  <div>
                    <span className="text-xs font-mono text-stone-400 uppercase block">Operation:</span>
                    <strong className="text-base text-[#c5a059] font-serif">{currentCard.alchemy.process}</strong>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-stone-400 uppercase block">Element & Symbol:</span>
                    <strong className="text-base text-stone-200">
                      {currentCard.alchemy.element} ({currentCard.alchemy.symbol})
                    </strong>
                  </div>
                  {currentCard.alchemy.metalOrQuality && (
                    <div className="sm:col-span-2 border-t border-white/10 pt-2">
                      <span className="text-xs font-mono text-stone-400 uppercase block">Alchemical Quality / Metal:</span>
                      <span className="text-stone-300 font-serif">{currentCard.alchemy.metalOrQuality}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. TAB 3: DIGNITIES (LIGHT & SHADOW INTERPRETATIONS) */}
          {activeTab === 'crowley' && (
            <div className="space-y-6 animate-fade-in">
              {/* Harmonious Dignity (Light) */}
              <div className="bg-emerald-950/30 border-2 border-emerald-500/50 p-6 rounded-lg space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-400 font-mono text-sm font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Harmonious Dignity (Light / Upright Position)</span>
                </div>
                <p className="text-stone-100 text-sm sm:text-base leading-relaxed font-serif bg-[#050505]/80 p-5 rounded-md border border-emerald-500/30">
                  {currentCard.lightInterpretation}
                </p>
              </div>

              {/* Ill-Dignified (Shadow) */}
              <div className="bg-rose-950/30 border-2 border-rose-500/50 p-6 rounded-lg space-y-3">
                <div className="flex items-center gap-2.5 text-rose-400 font-mono text-sm font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Ill-Dignified (Shadow / Warning / Reversed Position)</span>
                </div>
                <p className="text-stone-100 text-sm sm:text-base leading-relaxed font-serif bg-[#050505]/80 p-5 rounded-md border border-rose-500/30">
                  {currentCard.shadowInterpretation}
                </p>
              </div>
            </div>
          )}

          {/* 6. TAB 4: TRADITIONAL RENAISSANCE BRIDGE */}
          {activeTab === 'traditional' && (
            <div className="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Layers className="w-6 h-6 text-[#c5a059]" />
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold">
                    Traditional Tarot Bridge & Historical Comparison
                  </h3>
                  <p className="text-xs text-stone-400 font-sans">
                    Connecting Crowley's 1944 Book of Thoth to traditional Renaissance & Rider-Waite-Smith decks.
                  </p>
                </div>
              </div>

              <div className="bg-[#050505] p-5 rounded-md border border-white/10 space-y-4">
                <div>
                  <span className="text-xs font-mono text-stone-400 uppercase block">Traditional Equivalent Name:</span>
                  <div className="text-xl font-bold text-[#c5a059] font-serif mt-1">
                    {traditionalInfo.traditionalName}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-stone-400 uppercase block">Crowley's Thoth System Variation:</span>
                  <p className="text-sm text-stone-200 font-serif leading-relaxed mt-1 bg-[#0e0e11] p-4 rounded border border-white/10">
                    {traditionalInfo.comparisonNote}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 7. BOTTOM LARGE NAVIGATION ACTION BUTTONS */}
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

      {/* 3. FLOATING BOTTOM ACTION & TAB DOCK (FAB) */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl bg-[#09090d]/95 backdrop-blur-xl border border-[#c5a059]/60 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-1.5 sm:p-2 flex items-center justify-between gap-1 sm:gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 h-11 sm:h-12 px-2 sm:px-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 shadow-[0_0_12px_rgba(197,160,89,0.5)] scale-105'
              : 'text-stone-300 hover:text-[#c5a059] hover:bg-white/5'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span className="truncate">Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('esoteric')}
          className={`flex-1 h-11 sm:h-12 px-2 sm:px-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'esoteric'
              ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 shadow-[0_0_12px_rgba(197,160,89,0.5)] scale-105'
              : 'text-stone-300 hover:text-[#c5a059] hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span className="truncate">Attributions</span>
        </button>

        <button
          onClick={() => setActiveTab('crowley')}
          className={`flex-1 h-11 sm:h-12 px-2 sm:px-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'crowley'
              ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 shadow-[0_0_12px_rgba(197,160,89,0.5)] scale-105'
              : 'text-stone-300 hover:text-[#c5a059] hover:bg-white/5'
          }`}
        >
          <Feather className="w-4 h-4 shrink-0" />
          <span className="truncate">Meaning</span>
        </button>

        <button
          onClick={() => setActiveTab('traditional')}
          className={`flex-1 h-11 sm:h-12 px-2 sm:px-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'traditional'
              ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 shadow-[0_0_12px_rgba(197,160,89,0.5)] scale-105'
              : 'text-stone-300 hover:text-[#c5a059] hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span className="truncate">Bridge</span>
        </button>
      </nav>

      {/* 5. FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isFullscreenImageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-2 sm:p-5 text-stone-100 select-none overflow-hidden"
            onClick={() => setIsFullscreenImageOpen(false)}
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
                onClick={() => setIsFullscreenImageOpen(false)}
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
                onClick={handlePrev}
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
                        src={getClassicCardImageUrl(currentCard)}
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
                      WebkitTransform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                        src={getThothCardImageUrl(currentCard)}
                        alt={currentCard.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    {/* BACK FACE (ROSICRUCIAN ROSE CROSS) */}
                    <div
                      className="absolute inset-0 w-full h-full bg-[#08080c] rounded-md overflow-hidden border border-[#c5a059]/50 flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        WebkitTransform: 'rotateY(180deg)',
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
                onClick={handleNext}
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
    </div>
  );
};
