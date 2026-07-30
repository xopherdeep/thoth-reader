<script lang="ts">
  import type { TetragrammatonPile } from '../utils/thothSpread';
  import SearchInput from './atoms/SearchInput.svelte';
  import TarotCardView from './TarotCardView.svelte';
  import { Flame, Droplets, Wind, Mountain, Layers, Play, CheckCircle2 } from 'lucide-react';

  interface Props {
    selectedPile: TetragrammatonPile;
    selectedSignificatorId: string | null;
    onSelectSignificator: (cardId: string) => void;
    onRunSpread: (significatorId: string) => void;
    onChangePileStep: () => void;
  }

  let {
    selectedPile,
    selectedSignificatorId,
    onSelectSignificator,
    onRunSpread,
    onChangePileStep,
  }: Props = $props();

  let searchQuery = $state('');

  let filteredCards = $derived(
    selectedPile.cards.filter(
      (card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.thothTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  let chosenCard = $derived(
    selectedPile.cards.find((c) => c.id === selectedSignificatorId) || selectedPile.cards[0]
  );
</script>

<div class="bg-[#0e0e11] border border-[#c5a059]/40 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
    <div>
      <span class="text-xs font-mono text-[#c5a059] uppercase tracking-widest block mb-1">
        Step 5 • Select Significator Anchor Card
      </span>
      <h2 class="atu-font text-2xl font-bold text-stone-100 tracking-wide">
        Select Significator in {selectedPile.name} ({selectedPile.tetragrammaton})
      </h2>
    </div>

    <button
      onclick={onChangePileStep}
      class="px-4 py-2 bg-[#050505] hover:bg-white/10 text-stone-300 border border-white/15 text-xs font-mono uppercase tracking-wider rounded-sm transition cursor-pointer"
    >
      Change Cut Pile
    </button>
  </div>

  <div class="w-full max-w-md">
    <SearchInput
      value={searchQuery}
      onChange={(val) => (searchQuery = val)}
      placeholder="Search cards in this pile..."
    />
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2 bg-[#050505] rounded-sm border border-white/10">
    {#each filteredCards as card (card.id)}
      {@const isSelected = selectedSignificatorId === card.id}
      <div class="relative">
        <TarotCardView
          {card}
          displayMode="thoth"
          size="sm"
          highlight={isSelected}
          onSelect={(c) => onSelectSignificator(c.id)}
        />
      </div>
    {/each}
  </div>

  {#if chosenCard}
    <div class="bg-[#050505] p-5 rounded-sm border border-[#c5a059]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <div class="text-xs font-mono text-[#c5a059] uppercase font-bold">Selected Significator Start Anchor</div>
        <div class="atu-font text-xl font-bold text-stone-100">{chosenCard.name}</div>
        <div class="text-xs font-serif italic text-stone-400">"{chosenCard.thothTitle}"</div>
      </div>

      <button
        onclick={() => onRunSpread(chosenCard.id)}
        class="px-6 py-3 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold font-mono text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
      >
        <Play class="w-4 h-4 fill-current" />
        <span>Run Counting Loop Spread</span>
      </button>
    </div>
  {/if}
</div>
