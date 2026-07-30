<script lang="ts">
  import type { ThothCard } from '../types';
  import { getThothCardImageUrl } from '../utils/cardImageUrls';

  interface Props {
    card: ThothCard;
    class?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showDetailsOverlay?: boolean;
  }

  let {
    card,
    class: className = '',
    size = 'md',
    showDetailsOverlay = true,
  }: Props = $props();

  let imageError = $state(false);
  let imageLoaded = $state(false);

  let imageUrl = $derived(getThothCardImageUrl(card));

  function getThothPalette() {
    const suitOrElement = card.suit || card.alchemy?.element || 'Air';
    switch (suitOrElement) {
      case 'Wands':
      case 'Fire':
        return {
          bg: 'from-[#2a0805] via-[#140404] to-[#050101]',
          border: 'border-amber-500/80',
          accent: '#f97316',
          gold: '#c5a059',
          glow: 'rgba(249, 115, 22, 0.35)',
          elementSymbol: '🜂',
        };
      case 'Cups':
      case 'Water':
        return {
          bg: 'from-[#051829] via-[#030e1a] to-[#01050a]',
          border: 'border-cyan-500/80',
          accent: '#38bdf8',
          gold: '#c5a059',
          glow: 'rgba(56, 189, 248, 0.35)',
          elementSymbol: '🜄',
        };
      case 'Swords':
      case 'Air':
        return {
          bg: 'from-[#211f08] via-[#121104] to-[#050501]',
          border: 'border-yellow-400/80',
          accent: '#eab308',
          gold: '#c5a059',
          glow: 'rgba(234, 179, 8, 0.35)',
          elementSymbol: '🜁',
        };
      case 'Disks':
      case 'Earth':
      default:
        return {
          bg: 'from-[#061d12] via-[#030f09] to-[#010503]',
          border: 'border-emerald-500/80',
          accent: '#10b981',
          gold: '#c5a059',
          glow: 'rgba(16, 185, 129, 0.35)',
          elementSymbol: '🜃',
        };
    }
  }

  let palette = $derived(getThothPalette());
</script>

<div
  class="relative w-full h-full overflow-hidden bg-[#050505] flex flex-col justify-between select-none {className}"
>
  {#if imageUrl && !imageError}
    <div class="relative w-full h-full overflow-hidden flex-1">
      <img
        src={imageUrl}
        alt={card.name}
        referrerpolicy="no-referrer"
        onload={() => (imageLoaded = true)}
        onerror={() => (imageError = true)}
        class="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none"></div>

      <div class="absolute top-1.5 left-1.5 right-1.5 z-20 flex items-center justify-between pointer-events-none">
        <div class="px-1.5 py-0.5 rounded-sm bg-[#050505]/85 border border-[#c5a059]/50 text-[#c5a059] font-mono text-[9px] font-bold shadow-md backdrop-blur-sm">
          {card.atuNumber !== null ? `ATU ${card.atuNumber}` : card.suit || 'THOTH'}
        </div>
        {#if card.hebrewLetter}
          <div class="px-1.5 py-0.5 rounded-sm bg-[#050505]/85 border border-[#c5a059]/50 text-[#c5a059] font-serif text-[10px] font-bold shadow-md backdrop-blur-sm">
            {card.hebrewLetter.letter}
          </div>
        {/if}
      </div>

      {#if showDetailsOverlay}
        <div class="absolute bottom-0 inset-x-0 z-20 p-2 bg-[#050505]/95 border-t border-white/10 backdrop-blur-sm">
          <div class="atu-font font-bold text-stone-100 truncate text-[11px] tracking-wide group-hover:text-[#c5a059] transition">
            {card.name}
          </div>
          <div class="text-[9px] text-[#c5a059]/80 font-sans italic truncate -mt-0.5">
            "{card.thothTitle}"
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="w-full h-full p-3 bg-gradient-to-b {palette.bg} flex flex-col justify-between items-center text-center border border-[#c5a059]/30">
      <div class="text-[10px] font-mono text-[#c5a059] font-bold">
        {card.atuNumber !== null ? `ATU ${card.atuNumber}` : card.suit}
      </div>
      <div class="text-3xl font-sans text-[#c5a059]">
        {card.hebrewLetter?.letter || card.astrology?.symbol || palette.elementSymbol}
      </div>
      <div class="text-[9px] font-mono text-stone-400 italic">
        {card.name}
      </div>
    </div>
  {/if}
</div>
