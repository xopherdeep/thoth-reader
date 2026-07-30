<script lang="ts">
  import { THOTH_DECK } from '../data/thothCards';
  import type { ThothCard } from '../types';
  import { ThothCardSearchState } from '../state/searchState.svelte';
  import SearchInput from './atoms/SearchInput.svelte';
  import FilterBar from './molecules/FilterBar.svelte';
  import TarotCardView from './TarotCardView.svelte';
  import TarotCardDetailView from './TarotCardDetailView.svelte';
  import { BookOpen, Sparkles, Layers } from 'lucide-svelte';

  interface Props {
    selectedCardId?: string | null;
    onSelectCard?: (card: ThothCard | null) => void;
  }

  let { selectedCardId, onSelectCard }: Props = $props();

  const searchState = new ThothCardSearchState();

  let internalSelectedCard = $state<ThothCard | null>(null);

  let selectedCard = $derived.by(() => {
    if (selectedCardId) {
      return THOTH_DECK.find((c) => c.id === selectedCardId) || null;
    }
    return internalSelectedCard;
  });

  function handleCardClick(card: ThothCard | null) {
    if (onSelectCard) {
      onSelectCard(card);
    } else {
      internalSelectedCard = card;
    }
  }
</script>

<div class="space-y-6">
  <div class="relative overflow-hidden bg-gradient-to-b from-[#141419] via-[#0d0d12] to-[#08080c] p-6 sm:p-8 rounded-xl border border-[#c5a059]/35 shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_15px_rgba(197,160,89,0.12)] backdrop-blur-md">
    <div class="absolute -top-24 -right-24 w-72 h-72 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-900/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

    <div class="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/60 to-transparent"></div>

    <div class="relative z-10 space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] font-mono text-[11px] uppercase tracking-widest backdrop-blur-sm">
            <BookOpen class="w-3.5 h-3.5 text-[#c5a059]" />
            <span>The Book of Thoth Compendium</span>
            <span class="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
          </div>
          <h2 class="atu-font text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#f5e4bc] via-[#c5a059] to-[#936e2d] bg-clip-text text-transparent">
            Esoteric Database & Attributions
          </h2>
          <p class="text-stone-300/90 text-xs sm:text-sm max-w-3xl leading-relaxed font-sans">
            Complete catalog of all <span class="text-[#c5a059] font-semibold">78 Thoth Tarot cards</span> with Crowley’s Golden Dawn numerology counts, Hebrew letters, alchemical processes, astrological decans, and Tree of Life paths.
          </p>
        </div>

        <div class="relative group shrink-0 self-start lg:self-auto">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-[#c5a059]/30 to-amber-600/30 rounded-xl blur opacity-50 group-hover:opacity-80 transition duration-300"></div>
          <div class="relative flex items-center gap-4 bg-[#0a0a0e]/90 px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl border border-[#c5a059]/40 backdrop-blur-md">
            <div class="p-2.5 rounded-lg bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#c5a059]">
              <Sparkles class="w-5 h-5" />
            </div>
            <div>
              <div class="text-[10px] text-stone-400 font-mono uppercase tracking-widest">Total Catalog</div>
              <div class="text-xl sm:text-2xl font-bold text-[#f0d8a4] font-mono tracking-tight flex items-baseline gap-1">
                <span>{searchState.filteredCards.length}</span>
                <span class="text-xs text-[#c5a059] font-normal">/ {THOTH_DECK.length} Cards</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/25 to-transparent"></div>

      <div class="space-y-4">
        <SearchInput
          value={searchState.query}
          onChange={(val) => (searchState.query = val)}
          placeholder="Search by title, Hebrew letter, Zodiac sign, Alchemy..."
        />
        <FilterBar
          categories={searchState.categories}
          selectedCategory={searchState.selectedCategory}
          onSelectCategory={(id) => (searchState.selectedCategory = id)}
          selectedNumber={searchState.selectedNumber}
          onSelectNumber={(num) => (searchState.selectedNumber = num)}
          sortBy={searchState.sortBy}
          onSelectSort={(sort) => (searchState.sortBy = sort)}
          groupBy={searchState.groupBy}
          onSelectGroup={(group) => (searchState.groupBy = group)}
        />
      </div>
    </div>
  </div>

  <div class="space-y-8 w-full max-w-6xl mx-auto">
    {#each searchState.groupedCards as group (group.id)}
      <div class="space-y-3">
        {#if searchState.groupBy !== 'none'}
          <div class="flex items-center gap-3 px-2">
            <div class="p-1.5 rounded-md bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#c5a059]">
              <Layers class="w-4 h-4" />
            </div>
            <h3 class="atu-font text-lg font-bold text-[#f0d8a4] tracking-wide flex items-center gap-2">
              <span>{group.title}</span>
              <span class="text-xs font-mono text-stone-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                {group.count}
              </span>
            </h3>
            <div class="h-[1px] flex-1 bg-gradient-to-r from-[#c5a059]/30 to-transparent ml-2"></div>
          </div>
        {/if}

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5 justify-items-center">
          {#each group.cards as card (card.id)}
            <div class="transition-all duration-200">
              <TarotCardView
                {card}
                displayMode="thoth"
                size="lg"
                showDetailsOnClick={true}
                onSelect={(c) => handleCardClick(c)}
              />
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  {#if searchState.filteredCards.length === 0}
    <div class="text-center py-12 bg-[#0e0e11] rounded-sm border border-white/10 space-y-3">
      <BookOpen class="w-8 h-8 text-stone-500 mx-auto" />
      <p class="text-stone-300 font-medium text-sm">No Thoth cards matched your search or filter criteria.</p>
      <button
        onclick={() => {
          searchState.query = '';
          searchState.selectedCategory = 'all';
          searchState.selectedNumber = 'all';
          searchState.sortBy = 'deck';
          searchState.groupBy = 'none';
        }}
        class="px-3 py-1.5 bg-[#c5a059]/20 text-[#c5a059] hover:bg-[#c5a059]/30 border border-[#c5a059]/40 text-xs font-mono uppercase tracking-widest rounded-sm transition cursor-pointer"
      >
        Clear Search & Filters
      </button>
    </div>
  {/if}

  {#if selectedCard}
    <TarotCardDetailView
      card={selectedCard}
      cardList={searchState.filteredCards}
      onClose={() => handleCardClick(null)}
      onSelectCard={(newCard) => handleCardClick(newCard)}
    />
  {/if}
</div>
