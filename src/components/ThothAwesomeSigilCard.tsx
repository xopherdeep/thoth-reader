import React from 'react';
import { ThothCard } from '../types';

interface ThothAwesomeSigilCardProps {
  card: ThothCard;
  className?: string;
  showDetails?: boolean;
}

export const ThothAwesomeSigilCard: React.FC<ThothAwesomeSigilCardProps> = ({
  card,
  className = '',
  showDetails = true,
}) => {
  // Determine elemental color scheme
  const getElementalPalette = () => {
    const suitOrElement = card.suit || card.alchemy.element || 'Air';
    switch (suitOrElement) {
      case 'Wands':
      case 'Fire':
        return {
          bg: 'from-amber-950 via-[#1c0808] to-black',
          border: 'border-orange-500/60',
          gold: '#f97316',
          glow: 'rgba(249, 115, 22, 0.4)',
          elementSymbol: '🜂',
          elementName: 'Fire / Atziluth',
        };
      case 'Cups':
      case 'Water':
        return {
          bg: 'from-blue-950 via-[#081324] to-black',
          border: 'border-cyan-500/60',
          gold: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.4)',
          elementSymbol: '🜄',
          elementName: 'Water / Briah',
        };
      case 'Swords':
      case 'Air':
        return {
          bg: 'from-yellow-950/70 via-[#1a1708] to-black',
          border: 'border-amber-400/60',
          gold: '#facc15',
          glow: 'rgba(250, 204, 21, 0.4)',
          elementSymbol: '🜁',
          elementName: 'Air / Yetzirah',
        };
      case 'Disks':
      case 'Earth':
      default:
        return {
          bg: 'from-emerald-950 via-[#071a10] to-black',
          border: 'border-emerald-500/60',
          gold: '#34d399',
          glow: 'rgba(52, 211, 153, 0.4)',
          elementSymbol: '🜃',
          elementName: 'Earth / Assiah',
        };
    }
  };

  const palette = getElementalPalette();

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-b ${palette.bg} rounded-sm p-3.5 flex flex-col justify-between overflow-hidden border border-[#c5a059]/50 shadow-2xl select-none ${className}`}
    >
      {/* ROSICRUCIAN SACRED GEOMETRY CANVAS BACKGROUND */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`sigil-rad-${card.id}`} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor={palette.gold} stopOpacity="0.5" />
            <stop offset="50%" stopColor="#c5a059" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill={`url(#sigil-rad-${card.id})`} />

        {/* Outer Corner Filigree Lines */}
        <rect x="3%" y="2%" width="94%" height="96%" fill="none" stroke="#c5a059" strokeWidth="0.5" opacity="0.4" />
        <rect x="5%" y="3.5%" width="90%" height="93%" fill="none" stroke={palette.gold} strokeWidth="0.5" opacity="0.3" strokeDasharray="2 2" />

        {/* Diagonal Ray Crosses */}
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={palette.gold} strokeWidth="0.5" opacity="0.25" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={palette.gold} strokeWidth="0.5" opacity="0.25" />

        {/* Concentric Hermetic Circles */}
        <circle cx="50%" cy="42%" r="42%" fill="none" stroke="#c5a059" strokeWidth="0.5" opacity="0.35" />
        <circle cx="50%" cy="42%" r="35%" fill="none" stroke={palette.gold} strokeWidth="0.75" opacity="0.5" strokeDasharray="4 2" />
        <circle cx="50%" cy="42%" r="24%" fill="none" stroke="#c5a059" strokeWidth="1" opacity="0.6" />
        <circle cx="50%" cy="42%" r="14%" fill="none" stroke={palette.gold} strokeWidth="0.5" opacity="0.4" />

        {/* Sacred Geometry Unicursal Hexagram Star */}
        <polygon
          points="50,15 80,65 20,65"
          transform="scale(0.8) translate(12, 10)"
          fill="none"
          stroke="#c5a059"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <polygon
          points="50,75 80,25 20,25"
          transform="scale(0.8) translate(12, 10)"
          fill="none"
          stroke="#c5a059"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>

      {/* TOP HEADER BAR: ATU / CATEGORY & ELEMENTAL BADGE */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#c5a059] border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-sm bg-[#c5a059]/20 text-[#c5a059] font-bold border border-[#c5a059]/40 text-xs">
            {card.atuNumber !== null ? `ATU ${card.atuNumber}` : card.suit || card.category}
          </span>
          <span className="text-stone-300 uppercase tracking-widest text-[11px] font-semibold hidden sm:inline">
            {card.type.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-bold" style={{ color: palette.gold }}>
          <span className="text-sm">{card.astrology?.symbol || palette.elementSymbol}</span>
          <span className="text-xs text-stone-200 font-mono">
            {card.astrology?.name || palette.elementName}
          </span>
        </div>
      </div>

      {/* CENTER SACRED SIGIL EMBLEM & ESOTERIC METADATA */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center gap-2 py-1">
        {/* Top Badges Row: Gematria & Alchemy */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono mb-1">
          {card.hebrewLetter && (
            <span className="px-2 py-0.5 rounded-sm bg-black/90 border border-[#c5a059]/70 text-[#c5a059] font-bold shadow-md">
              Gematria {card.hebrewLetter.value}
            </span>
          )}
          {card.alchemy && (
            <span className="px-2 py-0.5 rounded-sm bg-black/90 border border-white/20 text-stone-200 shadow-md">
              {card.alchemy.symbol} {card.alchemy.element}
            </span>
          )}
        </div>

        {/* Central Geometric Seal Frame (with explicit vertical margins for rotate-45 corners) */}
        <div className="relative w-22 h-22 sm:w-26 sm:h-26 flex items-center justify-center shrink-0 my-7 sm:my-8">
          <div
            className="absolute inset-0 border-2 border-[#c5a059] rotate-45 rounded-sm bg-black/90 shadow-2xl transition duration-500"
            style={{ boxShadow: `0 0 25px ${palette.glow}` }}
          />
          <div className="absolute inset-1.5 border border-[#c5a059]/40 rotate-45 rounded-sm pointer-events-none" />
          <div className="absolute inset-2.5 border border-dashed stroke-stone-500 rotate-12 rounded-full pointer-events-none opacity-40" />

          {/* Central Hebrew Glyph or Primary Esoteric Symbol */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span
              className="text-4xl sm:text-5xl font-serif text-[#c5a059] drop-shadow-[0_4px_12px_rgba(0,0,0,1)] tracking-normal"
              style={{ textShadow: `0 0 20px ${palette.gold}` }}
            >
              {card.hebrewLetter?.letter || card.astrology?.symbol || palette.elementSymbol}
            </span>
          </div>
        </div>

        {/* Hebrew Name & Meaning */}
        {card.hebrewLetter ? (
          <div className="space-y-1 mt-1">
            <div className="text-sm sm:text-base font-mono font-bold text-stone-100 uppercase tracking-widest">
              {card.hebrewLetter.name} ({card.hebrewLetter.letter})
            </div>
            <div className="text-xs text-[#c5a059] font-sans italic">
              Meaning: "{card.hebrewLetter.meaning}" • Path Value: {card.hebrewLetter.value}
            </div>
          </div>
        ) : (
          <div className="text-sm font-mono font-bold text-stone-200 uppercase tracking-widest mt-1">
            {card.astrology?.name || card.alchemy.element} ({palette.elementSymbol})
          </div>
        )}

        {/* Tree of Life Path & Alchemical Process Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono mt-1">
          <span className="px-2.5 py-1 bg-black/90 border border-[#c5a059]/50 rounded-sm text-[#c5a059] font-medium shadow">
            {card.treeOfLife.sephiraOrPath}
          </span>
          {card.alchemy.process && (
            <span className="px-2.5 py-1 bg-black/90 border border-white/20 rounded-sm text-stone-200 shadow">
              {card.alchemy.process}
            </span>
          )}
        </div>
      </div>

      {/* FOOTER SYMBOL MATRIX LEGEND */}
      {showDetails && (
        <div className="relative z-10 bg-black/90 border border-[#c5a059]/60 p-2.5 rounded-sm backdrop-blur-md space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
            <span className="font-bold text-stone-100 truncate">{card.name}</span>
            <span className="text-[#c5a059] font-bold text-xs shrink-0 ml-2">+{card.numerologyCount} Jump Steps</span>
          </div>
          <div className="text-xs text-stone-300 font-sans italic truncate">
            {card.thothTitle}
          </div>
        </div>
      )}
    </div>
  );
};
