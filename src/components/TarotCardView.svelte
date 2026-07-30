<script lang="ts">
  import type { ThothCard } from '../types';
  import ThothAwesomeSigilCard from './ThothAwesomeSigilCard.svelte';
  import BookOfThothCardVisual from './BookOfThothCardVisual.svelte';
  import TarotCardDetailView from './TarotCardDetailView.svelte';
  import { getTraditionalTarotInfo } from '../utils/tarotNameBridge';
  import { getClassicCardImageUrl } from '../utils/cardImageUrls';

  interface Props {
    card: ThothCard;
    displayMode?: 'renaissance' | 'thoth' | 'sigil' | 'art';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showDetailsOnClick?: boolean;
    stepNumber?: number;
    highlight?: boolean;
    onSelect?: (card: ThothCard) => void;
  }

  let {
    card,
    displayMode = 'thoth',
    size = 'md',
    showDetailsOnClick = true,
    stepNumber,
    highlight = false,
    onSelect,
  }: Props = $props();

  let imageLoaded = $state(false);
  let imageError = $state(false);
  let isModalOpen = $state(false);

  let activeVisualMode = $derived(displayMode === 'art' ? 'thoth' : displayMode);
  let classicImgUrl = $derived(getClassicCardImageUrl(card));
  let traditionalInfo = $derived(getTraditionalTarotInfo(card));

  function handleClick() {
    if (onSelect) {
      onSelect(card);
    }
    if (showDetailsOnClick) {
      isModalOpen = true;
    }
  }

  const sizeClasses = {
    sm: 'w-full max-w-[110px] aspect-[1/1.62] text-xs',
    md: 'w-full max-w-[140px] aspect-[1/1.62] text-xs',
    lg: 'w-full max-w-[170px] sm:max-w-[200px] aspect-[1/1.62] text-xs sm:text-sm',
    xl: 'w-full max-w-[220px] sm:max-w-[260px] aspect-[1/1.62] text-sm sm:text-base',
  };

  let displayTitle = $derived(
    activeVisualMode === 'renaissance' ? traditionalInfo.traditionalName : card.name
  );

  let displaySubtitle = $derived(
    activeVisualMode === 'renaissance' ? `Thoth: ${card.name}` : card.thothTitle
  );
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={handleClick}
  class="group relative rounded-sm border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between shadow-xl {sizeClasses[size]} {highlight
    ? 'border-[#c5a059] ring-2 ring-[#c5a059]/40 shadow-2xl scale-[1.02]'
    : 'border-white/15 hover:border-[#c5a059]/80 hover:-translate-y-1'} bg-[#0b0b0e]"
>
  {#if stepNumber !== undefined}
    <div class="absolute top-1.5 left-1.5 z-20 px-2 py-0.5 rounded-sm bg-[#050505]/90 border border-[#c5a059]/60 text-[#c5a059] font-mono text-[10px] font-bold shadow-md">
      Step {stepNumber}
    </div>
  {/if}

  <div class="absolute top-1.5 right-1.5 z-20 px-1.5 py-0.5 rounded-sm bg-[#050505]/90 border border-[#c5a059]/40 text-[#c5a059] font-mono text-[10px] font-bold shadow-md">
    +{card.numerologyCount}
  </div>

  {#if activeVisualMode === 'sigil'}
    <ThothAwesomeSigilCard {card} showDetails={false} />
  {:else if activeVisualMode === 'thoth'}
    <BookOfThothCardVisual {card} {size} showDetailsOverlay={true} />
  {:else}
    <div class="relative w-full h-full overflow-hidden bg-[#050505] flex flex-col justify-between">
      {#if classicImgUrl && !imageError}
        <div class="relative w-full h-full overflow-hidden">
          <img
            src={classicImgUrl}
            alt={traditionalInfo.traditionalName}
            referrerpolicy="no-referrer"
            onload={() => (imageLoaded = true)}
            onerror={() => (imageError = true)}
            class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none"></div>
        </div>
      {:else}
        <div class="w-full h-full p-3 bg-gradient-to-b from-[#121217] to-[#08080a] flex flex-col justify-between items-center text-center border border-[#c5a059]/30">
          <div class="text-[10px] font-mono text-[#c5a059] font-bold">
            {card.atuNumber !== null ? `ATU ${card.atuNumber}` : card.suit}
          </div>
          <div class="text-3xl font-sans text-[#c5a059]">
            {card.hebrewLetter?.letter || card.astrology?.symbol || '🜂'}
          </div>
          <div class="text-[9px] font-mono text-stone-400 italic">
            {traditionalInfo.traditionalName}
          </div>
        </div>
      {/if}
      <div class="relative z-20 p-2 bg-[#050505]/95 border-t border-white/10 backdrop-blur-sm">
        <div class="atu-font font-bold text-stone-100 truncate text-[11px] tracking-wide group-hover:text-[#c5a059] transition">
          {displayTitle}
        </div>
        <div class="text-[9px] text-[#c5a059]/80 font-sans italic truncate -mt-0.5">
          {displaySubtitle}
        </div>
      </div>
    </div>
  {/if}
</div>

{#if isModalOpen}
  <TarotCardDetailView
    {card}
    onClose={() => (isModalOpen = false)}
  />
{/if}
