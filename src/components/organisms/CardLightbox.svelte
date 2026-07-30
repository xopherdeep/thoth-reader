<script lang="ts">
  import { X, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import type { ThothCard } from '../../types';
  import { getThothCardImageUrl, getClassicCardImageUrl, THOTH_CARD_BACK_IMAGE } from '../../utils/cardImageUrls';
  import ThothAwesomeSigilCard from '../ThothAwesomeSigilCard.svelte';

  interface Props {
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

  let {
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
  }: Props = $props();

  let thothImgUrl = $derived(getThothCardImageUrl(currentCard));
  let classicImgUrl = $derived(getClassicCardImageUrl(currentCard));
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick={onClose}
    class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-2 sm:p-5 text-stone-100 select-none overflow-hidden"
  >
    <div
      onclick={(e) => e.stopPropagation()}
      class="flex items-center justify-between gap-3 px-2 pt-1 z-10 shrink-0"
    >
      <div class="flex flex-col min-w-0">
        <div class="text-[10px] sm:text-xs font-mono text-[#c5a059] uppercase tracking-widest font-semibold truncate">
          {currentCard.category} • Card {currentIndex + 1} of {totalCards}
        </div>
        <h2 class="atu-font text-lg sm:text-2xl font-bold text-stone-100 truncate">
          {currentCard.name}
        </h2>
        <p class="text-xs sm:text-sm italic font-serif text-stone-400 truncate">
          "{currentCard.thothTitle}"
        </p>
      </div>

      <button
        onclick={onClose}
        class="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0e0e11] hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/60 rounded-md font-mono font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-lg shrink-0"
      >
        <X class="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Close</span>
      </button>
    </div>

    <div
      onclick={(e) => e.stopPropagation()}
      class="relative flex-1 w-full h-full flex flex-col items-center justify-center my-1 overflow-hidden"
    >
      <button
        onclick={onPrev}
        class="absolute left-1 sm:left-4 z-30 p-2.5 sm:p-4 rounded-full bg-[#09090d]/85 hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/70 shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        title="Previous Card"
      >
        <ChevronLeft class="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      <div
        onclick={() => setIsFlipped(!isFlipped)}
        class="relative max-h-[85vh] max-w-[96vw] h-full flex flex-col items-center justify-center p-1 cursor-pointer group select-none"
        title="Tap image to flip card"
      >
        {#if visualMode === 'sigil'}
          <div class="max-h-[80vh] sm:max-h-[84vh] aspect-[1/1.6] w-auto h-full max-w-md">
            <ThothAwesomeSigilCard card={currentCard} showDetails={true} />
          </div>
        {:else if visualMode === 'renaissance'}
          <div class="relative max-h-[82vh] sm:max-h-[85vh] h-full flex flex-col items-center justify-center">
            {#if classicImgUrl}
              <img
                src={isFlipped ? THOTH_CARD_BACK_IMAGE : classicImgUrl}
                alt={currentCard.name}
                class="max-h-[78vh] sm:max-h-[82vh] w-auto h-auto object-contain rounded-md border-2 border-[#c5a059] shadow-2xl transition duration-300"
              />
            {:else}
              <div class="w-72 h-[450px] p-6 bg-[#09090d] rounded-md border-2 border-[#c5a059] flex flex-col justify-between items-center text-center">
                <div class="text-xs font-mono text-[#c5a059]">RENAISSANCE CLASSIC</div>
                <div class="text-6xl font-serif text-[#c5a059]">
                  {currentCard.hebrewLetter?.letter || '🜂'}
                </div>
                <div class="text-base font-mono text-stone-200">
                  {traditionalInfo.traditionalName}
                </div>
              </div>
            {/if}
          </div>
        {:else}
          <div class="relative max-h-[82vh] sm:max-h-[85vh] h-full flex flex-col items-center justify-center">
            {#if thothImgUrl}
              <img
                src={isFlipped ? THOTH_CARD_BACK_IMAGE : thothImgUrl}
                alt={currentCard.name}
                class="max-h-[78vh] sm:max-h-[82vh] w-auto h-auto object-contain rounded-md border-2 border-[#c5a059] shadow-[0_0_50px_rgba(197,160,89,0.35)] transition duration-300"
              />
            {/if}
          </div>
        {/if}
      </div>

      <button
        onclick={onNext}
        class="absolute right-1 sm:right-4 z-30 p-2.5 sm:p-4 rounded-full bg-[#09090d]/85 hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/70 shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        title="Next Card"
      >
        <ChevronRight class="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
    </div>
  </div>
{/if}
