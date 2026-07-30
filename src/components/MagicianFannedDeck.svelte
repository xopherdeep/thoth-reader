<script lang="ts">
  import type { ThothCard } from '../types';
  import { THOTH_DECK } from '../data/thothCards';
  import { THOTH_CARD_BACK_IMAGE, getThothCardImageUrl } from '../utils/cardImageUrls';
  import { Sparkles, Check, Shuffle, Eye, ArrowLeft, ArrowRight } from 'lucide-svelte';

  interface Props {
    selectedSignificatorId: string | null;
    onSelectSignificator?: (cardId: string) => void;
    onSelectCard?: (cardId: string) => void;
    onConfirm?: () => void;
    onBackToQuestion?: () => void;
    deck?: ThothCard[];
  }

  let {
    selectedSignificatorId,
    onSelectSignificator,
    onSelectCard,
    onConfirm,
    onBackToQuestion,
    deck = THOTH_DECK,
  }: Props = $props();

  let hoveredCardId = $state<string | null>(null);

  let selectedCard = $derived(deck.find((c) => c.id === selectedSignificatorId) || null);
  let totalFanCards = $derived(deck.length);

  function handleSelect(cardId: string) {
    if (onSelectSignificator) onSelectSignificator(cardId);
    if (onSelectCard) onSelectCard(cardId);
  }

  function handleRandomPick() {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const chosen = deck[randomIndex];
    handleSelect(chosen.id);
  }
</script>

<div class="space-y-6 w-full">
  <div class="text-center space-y-1.5 max-w-3xl mx-auto">
    <div class="inline-flex items-center gap-2 px-4 py-1 rounded-full text-[10px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/20 via-[#c5a059]/10 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_20px_rgba(197,160,89,0.15)]">
      <Sparkles class="w-3.5 h-3.5 text-[#c5a059] animate-pulse" />
      <span>The Magician's Opening Ritual • Liber T Protocol</span>
    </div>

    <h2 class="atu-font text-2xl sm:text-3xl font-extrabold tracking-wide text-stone-100">
      <span class="bg-gradient-to-r from-[#f5ecd4] via-[#c5a059] to-[#d6b77b] bg-clip-text text-transparent">
        Pick Your Significator Bookmark
      </span>
    </h2>
  </div>

  <div class="flex items-center justify-between gap-3 bg-[#08080c]/90 border border-white/10 rounded-2xl p-2.5 px-4 backdrop-blur-xl">
    <span class="text-[11px] font-mono text-[#c5a059] uppercase tracking-[0.15em] flex items-center gap-2">
      <Eye class="w-3.5 h-3.5 text-[#c5a059]" />
      <span>Blind Draw • Hover across the fan to feel your card, click to draw</span>
    </span>

    <button
      onclick={handleRandomPick}
      class="ml-auto px-4 py-2 bg-[#c5a059]/15 hover:bg-[#c5a059]/25 text-[#c5a059] border border-[#c5a059]/40 hover:border-[#c5a059] rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 flex items-center gap-2 shadow-[0_0_15px_rgba(197,160,89,0.1)] active:scale-95 shrink-0 cursor-pointer"
    >
      <Shuffle class="w-3.5 h-3.5" />
      <span>Let Fate Choose</span>
    </button>
  </div>

  <div class="relative w-full h-[300px] sm:h-[360px] bg-[#050508]/95 border border-[#c5a059]/30 rounded-2xl overflow-hidden shadow-[inset_0_0_90px_rgba(0,0,0,0.95)]">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[120px] pointer-events-none bg-[#c5a059]/10"></div>

    <div class="relative w-full h-full pt-8 pb-4">
      {#each deck as card, idx (card.id)}
        {@const isSelected = selectedSignificatorId === card.id}
        {@const isHovered = hoveredCardId === card.id}
        {@const ratio = idx / (totalFanCards - 1)}
        {@const leftPercent = 8 + ratio * 84}
        {@const archPeakHeight = 100}
        {@const yOffset = Math.sin(ratio * Math.PI) * archPeakHeight}
        {@const angle = (ratio - 0.5) * 84}

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          onclick={() => handleSelect(card.id)}
          onmouseenter={() => (hoveredCardId = card.id)}
          onmouseleave={() => (hoveredCardId = null)}
          class="absolute top-12 left-0 w-16 sm:w-20 md:w-24 aspect-[1/1.65] rounded-lg cursor-pointer transition-all duration-300 transform -translate-x-1/2 origin-bottom shadow-2xl {isSelected
            ? 'z-50 -translate-y-16 scale-125 border-2 border-amber-400 ring-4 ring-amber-400/50 shadow-[0_0_40px_rgba(245,158,11,0.6)]'
            : isHovered
            ? 'z-40 -translate-y-12 scale-110 border-2 border-[#c5a059] shadow-[0_0_25px_rgba(197,160,89,0.5)]'
            : 'border border-[#c5a059]/50 hover:border-[#c5a059]'}"
          style="left: {leftPercent}%; top: calc(3rem - {yOffset}px); transform: translate(-50%, 0) rotate({angle}deg);"
        >
          {#if isSelected}
            <div class="w-full h-full rounded-md overflow-hidden bg-[#050505] flex flex-col justify-between border border-[#c5a059]">
              {#if getThothCardImageUrl(card)}
                <img
                  src={getThothCardImageUrl(card)}
                  alt={card.name}
                  class="w-full h-full object-cover"
                />
              {:else}
                <div class="p-2 text-center my-auto">
                  <span class="atu-font text-xs font-bold text-[#c5a059]">{card.name}</span>
                </div>
              {/if}
            </div>
          {:else}
            <img
              src={THOTH_CARD_BACK_IMAGE}
              alt="Thoth Card Back"
              class="w-full h-full object-cover rounded-md"
            />
          {/if}
        </div>
      {/each}
    </div>
  </div>

  {#if selectedCard}
    <div class="bg-[#0e0e14]/90 p-5 rounded-2xl border border-[#c5a059]/40 flex items-center justify-between gap-4">
      <div>
        <div class="text-[10px] font-mono uppercase text-[#c5a059] font-bold">Selected Significator</div>
        <h4 class="atu-font text-xl font-bold text-stone-100">{selectedCard.name}</h4>
        <p class="text-xs text-stone-400 italic">"{selectedCard.thothTitle}"</p>
      </div>

      {#if onConfirm}
        <button
          onclick={onConfirm}
          class="px-6 py-3 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-stone-950 font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
        >
          <span>Confirm Selection</span>
          <Check class="w-4 h-4" />
        </button>
      {/if}
    </div>
  {/if}
</div>
