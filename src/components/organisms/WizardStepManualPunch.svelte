<script lang="ts">
  import { Search, Maximize2, Trash2, ArrowLeft, ArrowRight } from 'lucide-svelte';
  import type { ThothCard } from '../../types';
  import { THOTH_DECK } from '../../data/thothCards';

  interface Props {
    totalSteps: number;
    manualPulledCards: ThothCard[];
    manualCardSearch: string;
    setManualCardSearch: (query: string) => void;
    onAddManualCard: (card: ThothCard) => void;
    onRemoveManualCard: (index: number) => void;
    onClearSequence: () => void;
    onOpenFullScreenPunch: () => void;
    onBack: () => void;
    onNext: () => void;
  }

  let {
    totalSteps,
    manualPulledCards,
    manualCardSearch,
    setManualCardSearch,
    onAddManualCard,
    onRemoveManualCard,
    onClearSequence,
    onOpenFullScreenPunch,
    onBack,
    onNext,
  }: Props = $props();

  let filteredManualCards = $derived.by(() => {
    if (!manualCardSearch) return THOTH_DECK;
    return THOTH_DECK.filter(
      (c) =>
        c.name.toLowerCase().includes(manualCardSearch.toLowerCase()) ||
        c.thothTitle.toLowerCase().includes(manualCardSearch.toLowerCase())
    );
  });
</script>

<div class="bg-[#0e0e11] border border-white/10 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
  <div>
    <span class="text-xs font-mono text-[#c5a059] uppercase tracking-widest block mb-1">
      Step 3 of {totalSteps} • Punch Physical Deck Sequence
    </span>
    <h2 class="atu-font text-2xl font-bold text-[#c5a059] tracking-wide">
      Select Cards Pulled From Physical Deck
    </h2>
  </div>

  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
    <p class="text-xs text-stone-400">
      Search cards below or launch the 78-card matrix studio.
    </p>

    <button
      onclick={onOpenFullScreenPunch}
      class="px-4 py-2.5 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs font-mono uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition cursor-pointer"
    >
      <Maximize2 class="w-4 h-4" /> Fullscreen Matrix (78 Cards)
    </button>
  </div>

  <div class="relative">
    <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
    <input
      type="text"
      placeholder="Search card by name to punch in..."
      value={manualCardSearch}
      oninput={(e) => setManualCardSearch(e.currentTarget.value)}
      class="w-full pl-9 pr-3 py-2.5 bg-[#050505] border border-white/15 focus:border-[#c5a059] rounded-sm text-stone-200 text-sm outline-none font-mono"
    />
  </div>

  <div class="max-h-56 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-2 bg-[#050505] rounded-sm border border-white/10">
    {#each filteredManualCards as card (card.id)}
      {@const isAlreadySelected = manualPulledCards.some((c) => c.id === card.id)}
      <button
        disabled={isAlreadySelected}
        onclick={() => onAddManualCard(card)}
        class="p-2 rounded-sm text-left text-xs transition border flex flex-col justify-between cursor-pointer {isAlreadySelected
          ? 'opacity-30 bg-[#050505] border-white/5 cursor-not-allowed'
          : 'bg-[#0e0e11] hover:bg-black border-white/10 hover:border-[#c5a059]/50 text-stone-200'}"
      >
        <span class="atu-font font-bold truncate">{card.name}</span>
        <span class="text-[10px] text-[#c5a059] font-mono mt-1">
          +{card.numerologyCount} Count
        </span>
      </button>
    {/each}
  </div>

  <div class="space-y-3 pt-3 border-t border-white/10">
    <div class="flex items-center justify-between">
      <span class="text-xs font-mono uppercase text-[#c5a059] font-bold">
        Selected Sequence ({manualPulledCards.length} Cards)
      </span>
      {#if manualPulledCards.length > 0}
        <button
          onclick={onClearSequence}
          class="text-xs text-stone-400 hover:text-rose-400 font-mono uppercase flex items-center gap-1 cursor-pointer"
        >
          <Trash2 class="w-3.5 h-3.5" /> Clear All
        </button>
      {/if}
    </div>

    {#if manualPulledCards.length === 0}
      <div class="p-6 text-center text-xs font-mono text-stone-500 bg-[#050505] rounded-sm border border-dashed border-white/10">
        No cards selected yet. Click cards above or use Fullscreen Matrix.
      </div>
    {:else}
      <div class="flex flex-wrap gap-2 p-3 bg-[#050505] rounded-sm border border-white/10">
        {#each manualPulledCards as card, idx (idx)}
          <div class="px-3 py-1.5 bg-[#0e0e11] text-stone-200 border border-[#c5a059]/40 rounded-sm text-xs font-mono flex items-center gap-2">
            <span class="text-[#c5a059] font-bold">#{idx + 1}</span>
            <span>{card.name}</span>
            <button
              onclick={() => onRemoveManualCard(idx)}
              class="text-stone-400 hover:text-rose-400 ml-1 cursor-pointer"
            >
              ×
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="flex items-center justify-between pt-4 border-t border-white/10">
    <button
      onclick={onBack}
      class="px-5 py-2.5 bg-[#050505] hover:bg-white/10 text-stone-300 border border-white/20 text-xs font-mono uppercase font-bold rounded-sm flex items-center gap-2 transition cursor-pointer"
    >
      <ArrowLeft class="w-4 h-4" /> Back
    </button>

    <button
      disabled={manualPulledCards.length === 0}
      onclick={onNext}
      class="px-6 py-2.5 bg-[#c5a059] hover:bg-[#d6b77b] disabled:opacity-50 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-2 transition cursor-pointer"
    >
      <span>Review Reading Spread</span>
      <ArrowRight class="w-4 h-4" />
    </button>
  </div>
</div>
