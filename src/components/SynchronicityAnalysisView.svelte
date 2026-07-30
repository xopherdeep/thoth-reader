<script lang="ts">
  import type { ThothCard } from '../types';
  import { analyzeSynchronicity } from '../utils/synchronicityAnalysis';
  import { Trophy, Activity, Sparkles, Zap, ChevronDown, ChevronUp, Flame, Droplets, Wind, Mountain } from 'lucide-svelte';

  interface Props {
    pulledCards: ThothCard[];
    compact?: boolean;
  }

  let { pulledCards, compact = false }: Props = $props();

  let expanded = $state(!compact);

  let analysis = $derived(analyzeSynchronicity(pulledCards));
</script>

{#if pulledCards && pulledCards.length > 0}
  <div class="bg-[#0e0e11] border border-[#c5a059]/40 rounded-sm p-5 sm:p-6 shadow-2xl space-y-5 relative overflow-hidden">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
      <div class="space-y-1.5 flex-1">
        <div class="flex items-center gap-2 text-[#c5a059] text-xs font-mono uppercase tracking-[0.2em] font-bold">
          <Trophy class="w-4 h-4 text-[#c5a059] animate-pulse" /> 
          <span>{analysis.patterns.length} Synchronicity Badges Unlocked</span>
        </div>
        <h2 class="atu-font text-2xl font-bold text-stone-100 tracking-wider">
          Esoteric Achievement Board
        </h2>
        <p class="text-xs text-stone-400 font-mono flex items-center gap-2">
          <Activity class="w-3.5 h-3.5" /> Transmuting Randomness into Mathematical Order
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-end gap-3">
        {#if analysis.highestRarity}
          <div class="bg-[#050505] border border-fuchsia-500/50 px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.15)]">
            <Sparkles class="w-4 h-4 text-fuchsia-400" />
            <div class="flex flex-col text-right">
              <span class="text-[9px] font-mono text-stone-400 uppercase block tracking-widest leading-none">
                Highest Rarity
              </span>
              <span class="text-sm font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-400">
                {analysis.highestRarity}
              </span>
            </div>
          </div>
        {/if}

        <div class="bg-[#050505] border border-[#c5a059]/50 px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-inner">
          <Zap class="w-4 h-4 text-[#c5a059]" />
          <div class="flex flex-col text-right">
            <span class="text-[9px] font-mono text-stone-400 uppercase block tracking-widest leading-none">
              Resonance Score
            </span>
            <span class="text-sm font-mono font-bold text-[#c5a059]">
              {analysis.resonanceScore}%
            </span>
          </div>
        </div>

        <button
          onclick={() => (expanded = !expanded)}
          class="p-2.5 bg-[#050505] hover:bg-black border border-white/10 text-stone-300 rounded-sm text-xs transition cursor-pointer"
          title={expanded ? 'Collapse Achievements' : 'Expand Achievements'}
        >
          {#if expanded}<ChevronUp class="w-4 h-4" />{:else}<ChevronDown class="w-4 h-4" />{/if}
        </button>
      </div>
    </div>

    <div class="bg-[#050505] border-l-3 border-[#c5a059] p-3.5 rounded-r-sm text-sm text-stone-200 font-serif italic shadow-inner">
      "{analysis.summaryQuote}"
    </div>

    {#if expanded}
      <div class="space-y-3 pt-2">
        <h4 class="text-xs font-mono uppercase text-[#c5a059] font-bold">Unlocked Synchronicity Badges</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {#each analysis.patterns as pattern (pattern.id)}
            <div class="bg-[#050505] p-4 rounded-sm border border-white/10 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="atu-font text-sm font-bold text-[#c5a059]">{pattern.title}</span>
                <span class="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-stone-400">
                  {pattern.rarity}
                </span>
              </div>
              <p class="text-xs text-stone-300 font-serif">{pattern.description}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}
