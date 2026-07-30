import React, { useState, useEffect } from 'react';
import { ThothCard } from '../types';
import { ThothAwesomeSigilCard } from './ThothAwesomeSigilCard';
import { BookOfThothCardVisual } from './BookOfThothCardVisual';
import { TarotCardDetailView } from './TarotCardDetailView';
import { getTraditionalTarotInfo } from '../utils/tarotNameBridge';
import { getClassicCardImageUrl } from '../utils/cardImageUrls';

interface TarotCardViewProps {
  card: ThothCard;
  displayMode?: 'renaissance' | 'thoth' | 'sigil' | 'art';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDetailsOnClick?: boolean;
  stepNumber?: number;
  highlight?: boolean;
  onSelect?: (card: ThothCard) => void;
}

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  card,
  displayMode = 'thoth',
  size = 'md',
  showDetailsOnClick = true,
  stepNumber,
  highlight = false,
  onSelect,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Map legacy 'art' to 'thoth' by default
  const initialMode = displayMode === 'art' ? 'thoth' : displayMode;
  const [activeVisualMode, setActiveVisualMode] = useState<'renaissance' | 'thoth' | 'sigil'>(initialMode);

  useEffect(() => {
    const targetMode = displayMode === 'art' ? 'thoth' : displayMode;
    setActiveVisualMode(targetMode);
  }, [displayMode]);

  const classicImgUrl = getClassicCardImageUrl(card);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [card.id, activeVisualMode]);

  const traditionalInfo = getTraditionalTarotInfo(card);

  const handleClick = () => {
    if (onSelect) {
      onSelect(card);
    }
    if (showDetailsOnClick) {
      setIsModalOpen(true);
    }
  };

  // Dimensions based on size prop (natural tarot portrait aspect ratio 1:1.62)
  const sizeClasses = {
    sm: 'w-full max-w-[110px] aspect-[1/1.62] text-xs',
    md: 'w-full max-w-[140px] aspect-[1/1.62] text-xs',
    lg: 'w-full max-w-[170px] sm:max-w-[200px] aspect-[1/1.62] text-xs sm:text-sm',
    xl: 'w-full max-w-[220px] sm:max-w-[260px] aspect-[1/1.62] text-sm sm:text-base',
  }[size];

  // Active titles based on visual mode
  const displayTitle =
    activeVisualMode === 'renaissance'
      ? traditionalInfo.traditionalName
      : card.name;

  const displaySubtitle =
    activeVisualMode === 'renaissance'
      ? `Thoth: ${card.name}`
      : card.thothTitle;

  return (
    <>
      <div
        onClick={handleClick}
        className={`group relative rounded-sm border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between shadow-xl ${sizeClasses} ${
          highlight
            ? 'border-[#c5a059] ring-2 ring-[#c5a059]/40 shadow-2xl scale-[1.02]'
            : 'border-white/15 hover:border-[#c5a059]/80 hover:-translate-y-1'
        } bg-[#0b0b0e]`}
      >
        {/* Step Badge Overlay */}
        {stepNumber !== undefined && (
          <div className="absolute top-1.5 left-1.5 z-20 px-2 py-0.5 rounded-sm bg-[#050505]/90 border border-[#c5a059]/60 text-[#c5a059] font-mono text-[10px] font-bold shadow-md">
            Step {stepNumber}
          </div>
        )}

        {/* Numerology Count Badge Overlay */}
        <div className="absolute top-1.5 right-1.5 z-20 px-1.5 py-0.5 rounded-sm bg-[#050505]/90 border border-[#c5a059]/40 text-[#c5a059] font-mono text-[10px] font-bold shadow-md">
          +{card.numerologyCount}
        </div>

        {/* MAIN CARD IMAGE DISPLAY (BOOK OF THOTH vs CLASSIC DECK vs SIGIL) */}
        {activeVisualMode === 'sigil' ? (
          <ThothAwesomeSigilCard card={card} showDetails={false} />
        ) : activeVisualMode === 'thoth' ? (
          <BookOfThothCardVisual card={card} size={size} showDetailsOverlay={true} />
        ) : (
          <div className="relative w-full h-full overflow-hidden bg-[#050505] flex flex-col justify-between">
            {classicImgUrl && !imageError ? (
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={classicImgUrl}
                  alt={traditionalInfo.traditionalName}
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />
              </div>
            ) : (
              /* Fallback Classic Renaissance Card Canvas */
              <div className="w-full h-full p-3 bg-gradient-to-b from-[#121217] to-[#08080a] flex flex-col justify-between items-center text-center border border-[#c5a059]/30">
                <div className="text-[10px] font-mono text-[#c5a059] font-bold">
                  {card.atuNumber !== null ? `ATU ${card.atuNumber}` : card.suit}
                </div>
                <div className="text-3xl font-sans text-[#c5a059]">
                  {card.hebrewLetter?.letter || card.astrology?.symbol || '🜂'}
                </div>
                <div className="text-[9px] font-mono text-stone-400 italic">
                  {traditionalInfo.traditionalName}
                </div>
              </div>
            )}
            <div className="relative z-20 p-2 bg-[#050505]/95 border-t border-white/10 backdrop-blur-sm">
              <div className="atu-font font-bold text-stone-100 truncate text-[11px] tracking-wide group-hover:text-[#c5a059] transition">
                {displayTitle}
              </div>
              <div className="text-[9px] text-[#c5a059]/80 font-sans italic truncate -mt-0.5">
                {displaySubtitle}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* REIMAGINED FULL-SCREEN CARD DETAIL VIEW */}
      {isModalOpen && (
        <TarotCardDetailView
          card={card}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
