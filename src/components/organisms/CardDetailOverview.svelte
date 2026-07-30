<script lang="ts">
  import { Sparkles, Flame, Droplets, Wind, Mountain } from 'lucide-svelte';
  import type { ThothCard } from '../../types';

  interface Props {
    currentCard: ThothCard;
  }

  let { currentCard }: Props = $props();
</script>

<div class="space-y-6">
  <div class="bg-[#0e0e11] p-5 rounded-lg border border-white/10 space-y-3">
    <h3 class="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
      <Sparkles class="w-4 h-4" /> Core Esoteric Themes & Archetypes
    </h3>
    <div class="flex flex-wrap gap-2 pt-1">
      {#each currentCard.keyThemes as theme, idx (idx)}
        <span
          class="px-3.5 py-1.5 bg-[#050505] text-stone-200 border border-[#c5a059]/40 rounded-md text-xs sm:text-sm font-medium font-serif shadow-sm"
        >
          {theme}
        </span>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="bg-[#0e0e11] p-5 rounded-lg border border-white/10 space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono uppercase text-[#c5a059] font-bold">
          Astrology / Decan
        </span>
        <span class="text-2xl text-[#c5a059]">
          {currentCard.astrology?.symbol || '✨'}
        </span>
      </div>
      <div class="text-base font-bold text-stone-100 font-serif">
        {currentCard.astrology?.name || 'Cosmic Synthesis'}
      </div>
      {#if currentCard.astrology?.decanDetails}
        <p class="text-xs text-stone-400 font-sans leading-relaxed">
          {currentCard.astrology.decanDetails}
        </p>
      {/if}
    </div>

    <div class="bg-[#0e0e11] p-5 rounded-lg border border-white/10 space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono uppercase text-[#c5a059] font-bold">
          Alchemical Operation
        </span>
        <div class="flex items-center gap-1">
          {#if currentCard.alchemy.element === 'Fire'}<Flame class="w-5 h-5 text-amber-500" />{/if}
          {#if currentCard.alchemy.element === 'Water'}<Droplets class="w-5 h-5 text-cyan-400" />{/if}
          {#if currentCard.alchemy.element === 'Air'}<Wind class="w-5 h-5 text-indigo-300" />{/if}
          {#if currentCard.alchemy.element === 'Earth'}<Mountain class="w-5 h-5 text-emerald-500" />{/if}
          <span class="text-xl text-[#c5a059]">{currentCard.alchemy.symbol}</span>
        </div>
      </div>
      <div class="text-base font-bold text-stone-100 font-serif">
        {currentCard.alchemy.process}
      </div>
      <p class="text-xs text-stone-400 font-sans">
        Element: <strong class="text-stone-200">{currentCard.alchemy.element}</strong>
        {#if currentCard.alchemy.metalOrQuality}
          • Quality: {currentCard.alchemy.metalOrQuality}
        {/if}
      </p>
    </div>

    <div class="bg-[#0e0e11] p-5 rounded-lg border border-white/10 space-y-2">
      <div class="text-xs font-mono uppercase text-[#c5a059] font-bold">
        Tree of Life Sephira / Path
      </div>
      <div class="text-base font-bold text-stone-100 font-serif">
        {currentCard.treeOfLife.sephiraOrPath}
      </div>
      <p class="text-xs text-stone-400 font-sans italic">
        "{currentCard.treeOfLife.title}"
      </p>
    </div>

    <div class="bg-[#0e0e11] p-5 rounded-lg border border-white/10 space-y-2">
      <div class="text-xs font-mono uppercase text-[#c5a059] font-bold">
        Golden Dawn Numerology
      </div>
      <div class="text-base font-bold text-stone-100 font-serif">
        Step {currentCard.numerologyCount}
      </div>
      <p class="text-xs text-stone-400 font-sans">
        Atziluthic emanational counting position.
      </p>
    </div>
  </div>
</div>
