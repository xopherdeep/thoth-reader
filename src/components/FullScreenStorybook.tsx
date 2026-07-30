import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ThothReading, ThothCard } from '../types';
import { getThothCardImageUrl } from '../utils/cardImageUrls';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface FullScreenStorybookProps {
  reading: ThothReading;
  onClose: () => void;
}

export const FullScreenStorybook: React.FC<FullScreenStorybookProps> = ({ reading, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const narrative = reading.poeticNarrative || reading.aiInterpretation?.poeticNarrative;
  const stanzas = narrative?.stanzas || [];
  
  const chapters = (narrative?.bookChapters && narrative.bookChapters.length > 0)
    ? narrative.bookChapters
    : (reading.aiInterpretation?.bookChapters && reading.aiInterpretation.bookChapters.length > 0)
    ? reading.aiInterpretation.bookChapters
    : [
        {
          chapterNumber: 1,
          chapterTitle: "Chapter I: The Hook & The Call of the Arcana",
          parableQuote: narrative?.keyMotto || "As above, so below, to accomplish the miracles of the One Thing.",
          narrativeContent: narrative?.bookHook 
            ? `${narrative.bookHook}\n\nThe cards drawn in your sequence form the beginning of your journey, setting the stage for your personal parable. Your inquiry weaves seamlessly into your own path.`
            : `The sequence of cards pulled in your reading (${reading.pulledCards.map((c) => c.name).join(' → ')}) forms the beginning of your journey. This parable weaves your inquiry "${reading.question}" together with the elemental archetypes drawn from the deck.`,
          characterArchetypes: reading.pulledCards.slice(0, 2).map((c) => c.name),
        },
        {
          chapterNumber: 2,
          chapterTitle: "Chapter II: The Trial of the Elemental Archetypes",
          parableQuote: "He who seeks the hidden light must pass through the fiery crucible of the four elements.",
          narrativeContent: narrative?.proseSynthesis
            ? narrative.proseSynthesis.split('\n\n')[0] || narrative.proseSynthesis
            : `In the second chapter of your parable, the archetypes of ${reading.pulledCards.map((c) => c.name).join(', ')} appear as living characters and forces along your path, reflecting the obstacles and awakenings in your question.`,
          characterArchetypes: reading.pulledCards.map((c) => c.name),
        },
        {
          chapterNumber: 3,
          chapterTitle: "Chapter III: The Parable of Inner Vision",
          parableQuote: "Every answer lives already inside the questioner, waiting for the veil to be lifted.",
          narrativeContent: narrative?.proseSynthesis
            ? narrative.proseSynthesis.split('\n\n')[1] || narrative.proseSynthesis
            : reading.aiInterpretation?.deepAnswer || "Through the alchemy of the cards, your narrative reveals that your own choices determine the transmutation of your path.",
          characterArchetypes: reading.pulledCards.slice(-2).map((c) => c.name),
        },
        {
          chapterNumber: 4,
          chapterTitle: "Chapter IV: The Epilogue of Synthesis & Transmutation",
          parableQuote: narrative?.keyMotto || "Solve et Coagula: Dissolve and Coagulate.",
          narrativeContent: `When you read back this personal story, you are re-reading your own narrative with full self-insight. The wisdom you seek is not outside of you, but encoded in the parable of your own mind.`,
          characterArchetypes: [reading.pulledCards[0]?.name].filter(Boolean) as string[],
        },
      ];

  // Construct the slides based on the available reading data
  const slides: any[] = [];
  
  // 1. Title Slide
  slides.push({
    type: 'title',
    title: reading.aiInterpretation?.title || 'Thoth Oracle Reading',
    subtitle: reading.question,
    backgroundImage: getThothCardImageUrl(reading.pulledCards[0]), // Use the first card as a faint background, or a default
  });

  // 2. Map Chapters to Slides
  chapters.forEach((chapter, idx) => {
    // Pick the corresponding card, falling back to earlier ones if there are fewer cards than chapters
    const card = reading.pulledCards[idx] || reading.pulledCards[reading.pulledCards.length - 1] || reading.pulledCards[0];
    const stanza = stanzas[idx] || '';

    slides.push({
      type: 'card_chapter',
      card: card,
      title: chapter.chapterTitle || card.name,
      chapterNumber: chapter.chapterNumber || idx + 1,
      content: chapter.narrativeContent || card.coreMeaning,
      stanza: stanza || '',
      archetypes: chapter.characterArchetypes || [],
      parable: chapter.parableQuote || '',
      imageUrl: getThothCardImageUrl(card),
    });
  });

  // 3. Final Synthesis Slide
  if (narrative?.proseSynthesis || reading.aiInterpretation?.deepAnswer) {
    slides.push({
      type: 'synthesis',
      title: 'Esoteric Synthesis',
      content: narrative?.proseSynthesis || reading.aiInterpretation?.deepAnswer,
      motto: narrative?.keyMotto || reading.aiInterpretation?.alchemicalFormula,
    });
  }

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  const slide = slides[currentPage];

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0c] text-stone-200 flex items-center justify-center overflow-hidden"
    >
      {/* Background with subtle glow/blur of the current image */}
      {slide.imageUrl || slide.backgroundImage ? (
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center blur-3xl scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${slide.imageUrl || slide.backgroundImage})` }}
        />
      ) : null}

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full border border-white/10 text-white/70 hover:text-white transition"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Controls */}
      {currentPage > 0 && (
        <button 
          onClick={handlePrev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/40 hover:bg-black/80 rounded-full border border-white/10 text-white/70 hover:text-white transition"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {currentPage < slides.length - 1 && (
        <button 
          onClick={handleNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/40 hover:bg-black/80 rounded-full border border-white/10 text-white/70 hover:text-white transition"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-[#c5a059] w-6' : 'bg-white/20'}`}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center p-8 md:p-16 gap-8 md:gap-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          >
            {slide.type === 'title' && (
              <div className="text-center space-y-8 max-w-4xl mx-auto">
                <BookOpen className="w-12 h-12 text-[#c5a059] mx-auto opacity-80" />
                <h1 className="atu-font text-4xl md:text-6xl text-[#c5a059] tracking-wider font-bold leading-tight">
                  {slide.title.includes(':') ? (
                    <>
                      <span className="block text-2xl md:text-3xl opacity-80 mb-2">{slide.title.split(':')[0]}:</span>
                      <span className="block">{slide.title.split(':')[1]}</span>
                    </>
                  ) : (
                    slide.title
                  )}
                </h1>
                {slide.subtitle && (
                  <p className="font-serif italic text-xl md:text-2xl text-stone-300">
                    "{slide.subtitle}"
                  </p>
                )}
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-stone-500 pt-8">
                  Use arrow keys to navigate the story
                </p>
              </div>
            )}

            {slide.type === 'card_chapter' && (
              <div className="w-full h-full flex flex-col justify-start max-h-[85vh] overflow-y-auto scrollbar-hide pb-12 md:pb-0 pt-4 md:pt-8">
                {/* Header (Across both pages) */}
                <div className="w-full text-center space-y-4 mb-8 md:mb-12 border-b border-white/10 pb-8">
                    <div className="flex items-center justify-center gap-3 mb-3 max-w-lg mx-auto">
                      <div className="h-px bg-[#c5a059]/30 flex-1" />
                      <h3 className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.2em]">
                        Chapter {slide.chapterNumber}
                      </h3>
                      <div className="h-px bg-[#c5a059]/30 flex-1" />
                    </div>
                    
                    <h2 className="medieval-font text-3xl md:text-4xl text-[#c5a059] tracking-wider mb-4 text-center leading-tight">
                      {slide.title.replace(/^Chapter\s+[IVXLCDM\d]+:\s*/i, '')}
                    </h2>
                    
                    <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
                      {slide.archetypes && slide.archetypes.length > 0 && (
                        <div className="flex flex-wrap justify-center items-center gap-2">
                          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mr-1">Archetypes:</span>
                          {slide.archetypes.map((arch: string, i: number) => (
                            <span key={i} className="text-[10px] font-mono border border-[#c5a059]/20 px-2 py-1 rounded-sm text-stone-400 bg-[#c5a059]/5">
                              {arch}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {slide.card && (
                        <div className="flex flex-wrap justify-center items-center gap-2 ml-4">
                          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mr-1">Attributes:</span>
                          
                          {slide.card.astrology && slide.card.astrology.name && (
                            <span className="text-[10px] font-mono border border-blue-900/30 px-2 py-1 rounded-sm text-blue-200 bg-blue-900/10">
                              {slide.card.astrology.type}: {slide.card.astrology.name} {slide.card.astrology.symbol}
                            </span>
                          )}
                          
                          {slide.card.alchemy && slide.card.alchemy.element && (
                            <span className="text-[10px] font-mono border border-red-900/30 px-2 py-1 rounded-sm text-red-200 bg-red-900/10">
                              Element: {slide.card.alchemy.element} {slide.card.alchemy.symbol}
                            </span>
                          )}

                          {slide.card.numerologyCount !== undefined && slide.card.numerologyCount !== null && (
                            <span className="text-[10px] font-mono border border-purple-900/30 px-2 py-1 rounded-sm text-purple-200 bg-purple-900/10">
                              Number: {slide.card.numerologyCount}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                </div>

                {/* Two Column Layout below header */}
                <div className="flex flex-col md:flex-row w-full gap-8 md:gap-16 justify-center items-start">
                  {/* Left Page (Card + Poem) */}
                  <div className="flex-1 flex flex-col items-center justify-center space-y-8 md:border-r md:border-white/10 md:pr-12 pb-8 md:pb-20">
                    <div className="flex-shrink-0 w-48 md:w-64 lg:w-80">
                      <div className="relative aspect-[1/1.62] rounded-sm overflow-hidden border border-[#c5a059]/40 shadow-2xl">
                        <img 
                          src={slide.imageUrl} 
                          alt={slide.title} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {slide.stanza && (
                      <div className="w-full text-center px-4">
                        <p className="font-serif italic text-stone-300 text-lg md:text-xl whitespace-pre-wrap leading-relaxed">
                          {slide.stanza}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Page (Chapter Content) */}
                  <div className="flex-1 flex flex-col justify-start md:pl-4 space-y-8 pb-20 pt-4 md:pt-0 px-4 md:px-0">
                    {slide.parable && (
                      <div className="border-l-2 border-[#c5a059]/50 pl-6 py-2">
                        <p className="font-serif italic text-stone-300 text-xl md:text-2xl leading-relaxed">"{slide.parable}"</p>
                      </div>
                    )}

                    <div className="prose prose-invert prose-stone prose-lg md:prose-xl max-w-none">
                      <p className="font-serif leading-relaxed text-stone-200 whitespace-pre-wrap medieval-first-letter">
                        {slide.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {slide.type === 'synthesis' && (
              <div className="text-center space-y-8 max-w-4xl mx-auto">
                <h2 className="atu-font text-3xl md:text-5xl text-[#c5a059] tracking-wider">
                  {slide.title}
                </h2>
                <p className="font-serif leading-relaxed text-stone-300 text-lg md:text-2xl whitespace-pre-wrap">
                  {slide.content}
                </p>
                {slide.motto && (
                  <div className="pt-8 border-t border-white/10 mt-8">
                    <span className="text-xs font-mono text-[#c5a059] uppercase tracking-widest block mb-4">
                      Alchemical Hermetic Motto
                    </span>
                    <p className="font-serif italic font-bold text-3xl md:text-4xl text-[#c5a059]">
                      "{slide.motto}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>,
    document.body
  );
};
