<script lang="ts">
  import type { ThothCard } from '../types';

  interface Props {
    card: ThothCard;
    class?: string;
    showDetails?: boolean;
  }

  let { card, class: className = '', showDetails = true }: Props = $props();

  function getElementalPalette() {
    const suitOrElement = card.suit || card.alchemy?.element || 'Air';
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
  }

  let palette = $derived(getElementalPalette());
</script>

<div
  class="relative w-full h-full bg-gradient-to-b {palette.bg} rounded-sm p-3.5 flex flex-col justify-between overflow-hidden border border-[#c5a059]/50 shadow-2xl select-none {className}"
>
  <svg
    class="absolute inset-0 w-full h-full pointer-events-none opacity-40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id={`sigil-rad-${card.id}`} cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color={palette.gold} stop-opacity="0.5" />
        <stop offset="50%" stop-color="#c5a059" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.9" />
      </radialGradient>
    </defs>

    <rect width="100%" height="100%" fill={`url(#sigil-rad-${card.id})`} />
    <rect x="3%" y="2%" width="94%" height="96%" fill="none" stroke="#c5a059" stroke-width="0.5" opacity="0.4" />
    <rect x="5%" y="3.5%" width="90%" height="93%" fill="none" stroke={palette.gold} stroke-width="0.5" opacity="0.3" stroke-dasharray="2 2" />

    <line x1="0" y1="0" x2="100%" y2="100%" stroke={palette.gold} stroke-width="0.5" opacity="0.25" />
    <line x1="100%" y1="0" x2="0" y2="100%" stroke={palette.gold} stroke-width="0.5" opacity="0.25" />

    <circle cx="50%" cy="42%" r="42%" fill="none" stroke="#c5a059" stroke-width="0.5" opacity="0.35" />
    <circle cx="50%" cy="42%" r="35%" fill="none" stroke={palette.gold} stroke-width="0.75" opacity="0.5" stroke-dasharray="4 2" />
    <circle cx="50%" cy="42%" r="24%" fill="none" stroke="#c5a059" stroke-width="1" opacity="0.6" />
    <circle cx="50%" cy="42%" r="14%" fill="none" stroke={palette.gold} stroke-width="0.5" opacity="0.4" />
  </svg>

  <div class="relative z-10 flex items-center justify-between border-b border-[#c5a059]/40 pb-1.5 font-mono text-[10px]">
    <span class="text-[#c5a059] font-bold tracking-widest uppercase">
      {card.atuNumber !== null ? `ATU ${card.atuNumber}` : card.suit || 'DECAN'}
    </span>
    <span class="text-stone-300 font-serif italic text-xs">{palette.elementSymbol}</span>
  </div>

  <div class="relative z-10 flex flex-col items-center justify-center my-auto py-2 text-center">
    <div class="text-4xl font-serif text-[#c5a059] drop-shadow-[0_0_12px_rgba(197,160,89,0.5)] mb-1">
      {card.hebrewLetter?.letter || card.astrology?.symbol || '🜂'}
    </div>
    <div class="atu-font text-base font-bold text-stone-100 tracking-wide">
      {card.name}
    </div>
    <div class="text-[11px] font-mono text-[#c5a059] italic mt-0.5">
      "{card.thothTitle}"
    </div>
  </div>

  {#if showDetails}
    <div class="relative z-10 pt-1.5 border-t border-[#c5a059]/40 flex items-center justify-between text-[9px] font-mono text-stone-400">
      <span>{card.astrology?.name || card.alchemy?.element || 'Hermetic'}</span>
      <span class="text-[#c5a059]">{card.treeOfLife?.sephiraOrPath}</span>
    </div>
  {/if}
</div>
