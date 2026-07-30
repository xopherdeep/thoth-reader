<script lang="ts">
  import type { ThothCard } from '../types';
  import { THOTH_DECK } from '../data/thothCards';
  import { getTraditionalTarotInfo } from '../utils/tarotNameBridge';

  import CardDetailHeader from './organisms/CardDetailHeader.svelte';
  import CardDetailTabs from './organisms/CardDetailTabs.svelte';
  import CardDetailOverview from './organisms/CardDetailOverview.svelte';
  import CardDetailAttributions from './organisms/CardDetailAttributions.svelte';
  import CardDetailMeaning from './organisms/CardDetailMeaning.svelte';
  import CardDetailTraditionalBridge from './organisms/CardDetailTraditionalBridge.svelte';
  import CardLightbox from './organisms/CardLightbox.svelte';
  import CardDetailSidebar from './organisms/CardDetailSidebar.svelte';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  interface Props {
    card: ThothCard;
    cardList?: ThothCard[];
    onClose: () => void;
    onSelectCard?: (newCard: ThothCard) => void;
  }

  let {
    card: initialCard,
    cardList,
    onClose,
    onSelectCard,
  }: Props = $props();

  let currentCard = $state<ThothCard>(initialCard);
  let isFlipped = $state(false);
  let visualMode = $state<'thoth' | 'renaissance' | 'sigil'>('thoth');
  let activeTab = $state<'overview' | 'esoteric' | 'crowley' | 'traditional'>('overview');
  let slideDirection = $state<'next' | 'prev' | null>(null);
  let isDetailMenuOpen = $state(false);
  let isFullscreenImageOpen = $state(false);

  let deckToUse = $derived(cardList && cardList.length > 0 ? cardList : THOTH_DECK);
  let currentIndex = $derived(
    deckToUse.findIndex((c) => c.id === currentCard.id) >= 0
      ? deckToUse.findIndex((c) => c.id === currentCard.id)
      : 0
  );
  let totalCards = $derived(deckToUse.length);
  let traditionalInfo = $derived(getTraditionalTarotInfo(currentCard));

  function handlePrev() {
    if (totalCards === 0) return;
    const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
    const nextCardObj = deckToUse[prevIndex];
    slideDirection = 'prev';
    currentCard = nextCardObj;
    isFlipped = false;
    if (onSelectCard) onSelectCard(nextCardObj);
  }

  function handleNext() {
    if (totalCards === 0) return;
    const nextIndex = (currentIndex + 1) % totalCards;
    const nextCardObj = deckToUse[nextIndex];
    slideDirection = 'next';
    currentCard = nextCardObj;
    isFlipped = false;
    if (onSelectCard) onSelectCard(nextCardObj);
  }
</script>

<div
  class="fixed inset-0 z-50 bg-[#050505] text-[#e5e5e5] w-full h-full font-sans flex flex-col selection:bg-[#c5a059]/30 selection:text-[#c5a059]"
>
  <CardDetailHeader
    {currentCard}
    {currentIndex}
    {totalCards}
    {isDetailMenuOpen}
    setIsDetailMenuOpen={(open) => (isDetailMenuOpen = open)}
    {visualMode}
    setVisualMode={(mode) => (visualMode = mode)}
    {activeTab}
    setActiveTab={(tab) => (activeTab = tab)}
    onPrev={handlePrev}
    onNext={handleNext}
    {onClose}
  />

  <main class="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-10 pb-36 flex-1 overflow-y-auto min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <CardDetailSidebar
      {currentCard}
      {isFlipped}
      setIsFlipped={(flipped) => (isFlipped = flipped)}
      {visualMode}
      setVisualMode={(mode) => (visualMode = mode)}
      {slideDirection}
      {traditionalInfo}
      onPrev={handlePrev}
      onNext={handleNext}
      onOpenLightbox={() => (isFullscreenImageOpen = true)}
    />

    <div class="lg:col-span-7 space-y-8">
      <div class="bg-[#0e0e11] p-6 rounded-lg border border-[#c5a059]/50 shadow-2xl space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 rounded-md text-xs font-mono font-bold uppercase tracking-wider">
              {currentCard.category}
            </span>
            <span class="px-3 py-1 bg-white/10 text-stone-300 border border-white/15 rounded-md text-xs font-mono font-bold uppercase tracking-wider">
              {currentCard.type.toUpperCase()}
            </span>
            {#if currentCard.suit}
              <span class="px-3 py-1 bg-white/10 text-stone-300 border border-white/15 rounded-md text-xs font-mono font-bold uppercase tracking-wider">
                {currentCard.suit}
              </span>
            {/if}
          </div>
          <div class="text-xs font-mono text-stone-400">
            Golden Dawn ATU Code: <strong class="text-[#c5a059]">{currentCard.atuNumber !== null ? `ATU ${currentCard.atuNumber}` : currentCard.id}</strong>
          </div>
        </div>

        <div class="space-y-1">
          <h2 class="atu-font text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider text-[#c5a059]">
            {currentCard.name}
          </h2>
          <p class="text-lg sm:text-xl font-serif italic text-stone-300">
            "{currentCard.thothTitle}"
          </p>
        </div>

        {#if currentCard.hebrewLetter}
          <div class="bg-[#050505] p-5 rounded-md border border-[#c5a059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#0e0e11] rounded-md border-2 border-[#c5a059] flex items-center justify-center text-4xl sm:text-5xl font-serif text-[#c5a059] shadow-inner shrink-0">
                {currentCard.hebrewLetter.letter}
              </div>
              <div>
                <div class="text-xs font-mono uppercase text-[#c5a059] tracking-widest font-bold">Hebrew Letter Attribution</div>
                <div class="text-xl font-bold text-stone-100 font-serif">
                  {currentCard.hebrewLetter.name} ({currentCard.hebrewLetter.meaning})
                </div>
                <div class="text-xs text-stone-400 font-mono mt-0.5">
                  Gematria Value: <strong class="text-stone-200">{currentCard.hebrewLetter.value}</strong>
                </div>
              </div>
            </div>
            <div class="text-right sm:border-l sm:border-white/10 sm:pl-6 w-full sm:w-auto">
              <div class="text-xs font-mono text-stone-400 uppercase">Tree of Life Path</div>
              <div class="text-sm font-bold text-[#c5a059] font-mono">
                {currentCard.treeOfLife.sephiraOrPath}
              </div>
            </div>
          </div>
        {/if}
      </div>

      <CardDetailTabs {activeTab} setActiveTab={(tab) => (activeTab = tab)} variant="inline" />

      {#if activeTab === 'overview'}
        <CardDetailOverview {currentCard} />
      {:else if activeTab === 'esoteric'}
        <CardDetailAttributions {currentCard} />
      {:else if activeTab === 'crowley'}
        <CardDetailMeaning {currentCard} />
      {:else if activeTab === 'traditional'}
        <CardDetailTraditionalBridge {traditionalInfo} />
      {/if}

      <div class="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onclick={handlePrev}
          class="w-full sm:w-auto h-14 min-h-[52px] px-6 bg-[#0e0e11] hover:bg-[#1a1a22] text-stone-200 hover:text-[#c5a059] border border-white/20 hover:border-[#c5a059] rounded-md font-bold text-base flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
        >
          <ChevronLeft class="w-5 h-5" />
          <span>Previous Card</span>
        </button>
        <button
          onclick={onClose}
          class="w-full sm:w-auto h-14 min-h-[52px] px-8 bg-[#c5a059] text-stone-950 hover:bg-[#d6b77b] rounded-md font-bold text-base uppercase font-mono tracking-wider shadow-lg transition cursor-pointer active:scale-98"
        >
          Return to Gallery
        </button>
        <button
          onclick={handleNext}
          class="w-full sm:w-auto h-14 min-h-[52px] px-6 bg-[#0e0e11] hover:bg-[#1a1a22] text-stone-200 hover:text-[#c5a059] border border-white/20 hover:border-[#c5a059] rounded-md font-bold text-base flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
        >
          <span>Next Card</span>
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </div>
  </main>

  <CardDetailTabs {activeTab} setActiveTab={(tab) => (activeTab = tab)} variant="fab" />

  <CardLightbox
    isOpen={isFullscreenImageOpen}
    onClose={() => (isFullscreenImageOpen = false)}
    {currentCard}
    {currentIndex}
    {totalCards}
    {traditionalInfo}
    {isFlipped}
    setIsFlipped={(flipped) => (isFlipped = flipped)}
    {visualMode}
    setVisualMode={(mode) => (visualMode = mode)}
    onPrev={handlePrev}
    onNext={handleNext}
  />
</div>
