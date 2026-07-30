<script lang="ts">
  import type { ThothCard } from '../types';
  import TarotCardView from './TarotCardView.svelte';
  import SearchInput from './atoms/SearchInput.svelte';
  import { X, Play, Trash2, CheckCircle2 } from 'lucide-svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    allCards: ThothCard[];
    pulledCards: ThothCard[];
    onAddCard: (card: ThothCard) => void;
    onRemoveCard: (index: number) => void;
    onClearSequence: () => void;
    onFinishAndInterpret: () => void;
  }

  let {
    isOpen,
    onClose,
    allCards,
    pulledCards,
    onAddCard,
    onRemoveCard,
    onClearSequence,
    onFinishAndInterpret,
  }: Props = $props();

  let searchQuery = $state('');
  let categoryFilter = $state<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'disks'>('all');

  let filteredCards = $derived.by(() => {
    return allCards.filter((card) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        card.name.toLowerCase().includes(q) ||
        card.thothTitle.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      switch (categoryFilter) {
        case 'major':
          return card.type === 'major';
        case 'wands':
          return card.suit === 'Wands';
        case 'cups':
          return card.suit === 'Cups';
        case 'swords':
          return card.suit === 'Swords';
        case 'disks':
          return card.suit === 'Disks';
        default:
          return true;
      }
    });
  });
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 bg-[#050505]/98 text-stone-100 flex flex-col backdrop-blur-xl overflow-hidden">
    <div class="bg-[#0e0e11] border-b border-[#c5a059]/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-2xl">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-lg bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/50">
          <Play class="w-5 h-5" />
        </div>
        <div>
          <h2 class="atu-font text-xl font-bold text-[#c5a059]">Fullscreen Thoth Matrix Studio</h2>
          <p class="text-xs text-stone-400 font-mono">Tap cards to punch into physical spread sequence</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          disabled={pulledCards.length === 0}
          onclick={onFinishAndInterpret}
          class="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d6b77b] disabled:opacity-50 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider rounded-md flex items-center gap-2 transition cursor-pointer shadow-lg"
        >
          <CheckCircle2 class="w-4 h-4" /> Finish & Review ({pulledCards.length} Cards)
        </button>

        <button
          onclick={onClose}
          class="p-2.5 bg-[#050505] hover:bg-white/10 text-stone-400 hover:text-stone-200 border border-white/15 rounded-md transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="p-4 bg-[#0a0a0d] border-b border-white/10 shrink-0 space-y-3">
      <div class="max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={(val) => (searchQuery = val)}
          placeholder="Filter 78 cards by name..."
        />
      </div>

      <div class="flex flex-wrap gap-2 text-xs font-mono">
        <button
          onclick={() => (categoryFilter = 'all')}
          class="px-3 py-1.5 rounded border transition cursor-pointer {categoryFilter === 'all'
            ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] font-bold'
            : 'bg-[#0e0e11] text-stone-400 border-white/10'}"
        >
          All 78 Cards
        </button>
        <button
          onclick={() => (categoryFilter = 'major')}
          class="px-3 py-1.5 rounded border transition cursor-pointer {categoryFilter === 'major'
            ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] font-bold'
            : 'bg-[#0e0e11] text-stone-400 border-white/10'}"
        >
          22 Major Atu
        </button>
        <button
          onclick={() => (categoryFilter = 'wands')}
          class="px-3 py-1.5 rounded border transition cursor-pointer {categoryFilter === 'wands'
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
            : 'bg-[#0e0e11] text-stone-400 border-white/10'}"
        >
          Fire / Wands
        </button>
        <button
          onclick={() => (categoryFilter = 'cups')}
          class="px-3 py-1.5 rounded border transition cursor-pointer {categoryFilter === 'cups'
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
            : 'bg-[#0e0e11] text-stone-400 border-white/10'}"
        >
          Water / Cups
        </button>
        <button
          onclick={() => (categoryFilter = 'swords')}
          class="px-3 py-1.5 rounded border transition cursor-pointer {categoryFilter === 'swords'
            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 font-bold'
            : 'bg-[#0e0e11] text-stone-400 border-white/10'}"
        >
          Air / Swords
        </button>
        <button
          onclick={() => (categoryFilter = 'disks')}
          class="px-3 py-1.5 rounded border transition cursor-pointer {categoryFilter === 'disks'
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
            : 'bg-[#0e0e11] text-stone-400 border-white/10'}"
        >
          Earth / Disks
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 justify-items-center">
      {#each filteredCards as card (card.id)}
        {@const isSelected = pulledCards.some((c) => c.id === card.id)}
        <div class="relative">
          <TarotCardView
            {card}
            displayMode="thoth"
            size="sm"
            highlight={isSelected}
            onSelect={() => onAddCard(card)}
          />
        </div>
      {/each}
    </div>
  </div>
{/if}
