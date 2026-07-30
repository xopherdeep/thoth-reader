<script lang="ts">
  import type { ThothCard } from '../types';
  import { THOTH_DECK } from '../data/thothCards';
  import { Shuffle, Sparkles, Check, RotateCcw, ArrowRight } from 'lucide-svelte';

  interface Props {
    deck: ThothCard[];
    shuffleCount: number;
    onShuffle: () => void;
    onReset: () => void;
    onNextStep: () => void;
    onSetDeck?: (newDeck: ThothCard[]) => void;
  }

  let {
    deck = THOTH_DECK,
    shuffleCount,
    onShuffle,
    onReset,
    onNextStep,
  }: Props = $props();

  let isShuffling = $state(false);

  function handleShuffleClick() {
    isShuffling = true;
    onShuffle();
    setTimeout(() => (isShuffling = false), 600);
  }
</script>

<div class="bg-[#0e0e11] border border-[#c5a059]/40 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
    <div>
      <span class="text-xs font-mono text-[#c5a059] uppercase tracking-widest block mb-1">
        Step 3 • Consecrate & Shuffle 78-Card Deck
      </span>
      <h2 class="atu-font text-2xl font-bold text-stone-100 tracking-wide">
        Ritual Deck Shuffling ({shuffleCount} Times Shuffled)
      </h2>
    </div>

    <div class="flex items-center gap-3">
      <button
        onclick={onReset}
        class="px-3.5 py-2 bg-[#050505] hover:bg-white/10 text-stone-400 hover:text-stone-200 border border-white/15 text-xs font-mono uppercase tracking-wider rounded-sm transition flex items-center gap-1.5 cursor-pointer"
      >
        <RotateCcw class="w-3.5 h-3.5" /> Reset
      </button>

      <button
        onclick={handleShuffleClick}
        class="px-5 py-2.5 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-stone-950 font-bold font-mono text-xs uppercase tracking-widest rounded-sm shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
      >
        <Shuffle class="w-4 h-4 {isShuffling ? 'animate-spin' : ''}" />
        <span>Shuffle Deck</span>
      </button>
    </div>
  </div>

  <div class="relative h-64 bg-[#050505] rounded-sm border border-white/10 overflow-hidden flex items-center justify-center">
    <div class="text-center space-y-3 z-10">
      <div class="w-20 h-32 mx-auto bg-[#0a0a0d] border-2 border-[#c5a059] rounded-sm shadow-2xl flex items-center justify-center {isShuffling ? 'animate-bounce' : ''}">
        <Sparkles class="w-8 h-8 text-[#c5a059]" />
      </div>
      <div class="text-xs font-mono text-[#c5a059] uppercase">
        {shuffleCount === 0 ? 'Ready to Shuffle' : `Deck Consecrated (${shuffleCount} Shuffles)`}
      </div>
    </div>
  </div>

  <div class="flex justify-end pt-2">
    <button
      onclick={onNextStep}
      class="px-6 py-3 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold font-mono text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
    >
      <span>Proceed to Tetragrammaton Cut</span>
      <ArrowRight class="w-4 h-4" />
    </button>
  </div>
</div>
