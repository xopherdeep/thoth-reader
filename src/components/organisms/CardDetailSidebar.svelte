<script lang="ts">
  import { ChevronLeft, ChevronRight, Maximize2, RotateCw, BookOpen, Layers, Sparkles, ImageIcon } from 'lucide-svelte';
  import type { ThothCard } from '../../types';
  import { getClassicCardImageUrl, getThothCardImageUrl, THOTH_CARD_BACK_IMAGE } from '../../utils/cardImageUrls';
  import BookOfThothCardVisual from '../BookOfThothCardVisual.svelte';
  import ThothAwesomeSigilCard from '../ThothAwesomeSigilCard.svelte';

  interface Props {
    currentCard: ThothCard;
    isFlipped: boolean;
    setIsFlipped: (flipped: boolean) => void;
    visualMode: 'thoth' | 'renaissance' | 'sigil';
    setVisualMode: (mode: 'thoth' | 'renaissance' | 'sigil') => void;
    slideDirection: 'next' | 'prev' | null;
    traditionalInfo: { traditionalName: string; comparisonNote: string };
    onPrev: (e?: MouseEvent) => void;
    onNext: (e?: MouseEvent) => void;
    onOpenLightbox: (e?: MouseEvent) => void;
  }

  let {
    currentCard,
    isFlipped,
    setIsFlipped,
    visualMode,
    setVisualMode,
    slideDirection,
    traditionalInfo,
    onPrev,
    onNext,
    onOpenLightbox,
  }: Props = $props();

  let thothImgUrl = $derived(getThothCardImageUrl(currentCard));
  let classicImgUrl = $derived(getClassicCardImageUrl(currentCard));
</script>

<div class="lg:col-span-5 flex flex-col items-center space-y-5 lg:sticky lg:top-24">
  <div class="w-full max-w-[320px] sm:max-w-[360px] aspect-[1/1.62] relative group flex items-center justify-center">
    <button
      onclick={(e) => {
        e.stopPropagation();
        onPrev(e);
      }}
      class="absolute -left-5 sm:-left-12 lg:-left-14 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#09090d]/90 hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/70 shadow-2xl transition duration-200 cursor-pointer hover:scale-110 active:scale-95"
      title="Previous Card"
    >
      <ChevronLeft class="w-5 h-5 sm:w-6 sm:h-6" />
    </button>

    <button
      onclick={(e) => {
        e.stopPropagation();
        onNext(e);
      }}
      class="absolute -right-5 sm:-right-12 lg:-right-14 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#09090d]/90 hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/70 shadow-2xl transition duration-200 cursor-pointer hover:scale-110 active:scale-95"
      title="Next Card"
    >
      <ChevronRight class="w-5 h-5 sm:w-6 sm:h-6" />
    </button>

    <div class="w-full h-full relative cursor-pointer touch-pan-y">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        onclick={() => setIsFlipped(!isFlipped)}
        class="w-full h-full relative transition-transform duration-700 transform-style-3d {isFlipped ? 'rotate-y-180' : ''}"
      >
        <!-- FRONT FACE -->
        <div class="absolute inset-0 backface-hidden rounded-md border-2 border-[#c5a059] shadow-[0_0_35px_rgba(197,160,89,0.3)] overflow-hidden bg-[#050505] flex flex-col justify-between">
          {#if visualMode === 'sigil'}
            <ThothAwesomeSigilCard card={currentCard} showDetails={true} />
          {:else if visualMode === 'thoth'}
            <BookOfThothCardVisual card={currentCard} size="xl" showDetailsOverlay={true} />
          {:else}
            <div class="relative w-full h-full overflow-hidden bg-[#050505] flex flex-col justify-between">
              {#if classicImgUrl}
                <div class="relative w-full h-full overflow-hidden">
                  <img
                    src={classicImgUrl}
                    alt={traditionalInfo.traditionalName}
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none"></div>
                </div>
              {:else}
                <div class="w-full h-full p-6 bg-[#09090d] flex flex-col justify-between items-center text-center border border-[#c5a059]/40">
                  <div class="text-xs font-mono text-[#c5a059]">CLASSIC RENAISSANCE</div>
                  <div class="text-5xl font-serif text-[#c5a059]">
                    {currentCard.hebrewLetter?.letter || '🜂'}
                  </div>
                  <div class="text-sm font-mono text-stone-300">
                    {traditionalInfo.traditionalName}
                  </div>
                </div>
              {/if}
              <div class="p-3 bg-[#050505]/95 border-t border-white/10 text-center">
                <div class="atu-font font-bold text-stone-100 text-sm truncate">
                  {traditionalInfo.traditionalName}
                </div>
                <div class="text-[11px] text-[#c5a059] font-serif italic truncate">
                  Thoth Equivalent: {currentCard.name}
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- BACK FACE -->
        <div class="absolute inset-0 backface-hidden rotate-y-180 rounded-md border-2 border-[#c5a059] shadow-2xl overflow-hidden bg-[#050505]">
          <img
            src={THOTH_CARD_BACK_IMAGE}
            alt="Thoth Card Back"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Action buttons below portrait -->
  <div class="flex items-center justify-center gap-3 w-full max-w-[320px] sm:max-w-[360px]">
    <button
      onclick={() => setIsFlipped(!isFlipped)}
      class="flex-1 py-2.5 px-3 bg-[#0e0e11] hover:bg-[#1a1a22] text-[#c5a059] border border-[#c5a059]/60 rounded-md font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
    >
      <RotateCw class="w-4 h-4 shrink-0" />
      <span>{isFlipped ? 'Show Front' : 'Flip Back'}</span>
    </button>
    <button
      onclick={(e) => onOpenLightbox(e)}
      class="flex-1 py-2.5 px-3 bg-[#0e0e11] hover:bg-[#1a1a22] text-[#c5a059] border border-[#c5a059]/60 rounded-md font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
    >
      <Maximize2 class="w-4 h-4 shrink-0" />
      <span>Full View</span>
    </button>
  </div>

  <!-- Visual Mode Toggle Segmented Pills -->
  <div class="bg-[#0e0e11] p-1.5 rounded-lg border border-white/10 flex items-center gap-1 w-full max-w-[320px] sm:max-w-[360px]">
    <button
      onclick={() => setVisualMode('thoth')}
      class="flex-1 py-1.5 px-2 rounded font-mono text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer {visualMode === 'thoth'
        ? 'bg-[#c5a059] text-stone-950 shadow-md'
        : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'}"
    >
      <BookOpen class="w-3.5 h-3.5" /> Thoth
    </button>
    <button
      onclick={() => setVisualMode('renaissance')}
      class="flex-1 py-1.5 px-2 rounded font-mono text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer {visualMode === 'renaissance'
        ? 'bg-[#c5a059] text-stone-950 shadow-md'
        : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'}"
    >
      <ImageIcon class="w-3.5 h-3.5" /> Classic
    </button>
    <button
      onclick={() => setVisualMode('sigil')}
      class="flex-1 py-1.5 px-2 rounded font-mono text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer {visualMode === 'sigil'
        ? 'bg-[#c5a059] text-stone-950 shadow-md'
        : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'}"
    >
      <Sparkles class="w-3.5 h-3.5" /> Sigil
    </button>
  </div>
</div>
