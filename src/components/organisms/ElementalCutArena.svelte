<script lang="ts">
  import { Scissors, Crosshair, Sparkles, FastForward } from 'lucide-svelte';
  import { THOTH_CARD_BACK_IMAGE } from '../../utils/cardImageUrls';

  interface Props {
    cutStage: 1 | 2 | 3 | 'done';
    markerPos: number;
    isCutMoving: boolean;
    isSlicingAnimation: boolean;
    accuracyScore?: number;
    accuracyBadge?: { label: string; color: string };
    onExecuteCut: () => void;
    onRestart?: () => void;
    onAutoBypass?: () => void;
  }

  let {
    cutStage,
    markerPos,
    isCutMoving,
    isSlicingAnimation,
    accuracyScore = 85,
    accuracyBadge = { label: 'BALANCED SACRED CUT', color: 'text-emerald-400' },
    onExecuteCut,
    onRestart,
    onAutoBypass,
  }: Props = $props();

  let pileAPercent = $derived(Math.round(markerPos));
  let pileBPercent = $derived(100 - Math.round(markerPos));
  let stackACount = $derived(Math.round(78 * (markerPos / 100)));
  let stackBCount = $derived(78 - stackACount);
</script>

<div class="bg-[#050509]/90 border border-[#c5a059]/30 rounded-xl p-5 space-y-6 shadow-xl relative overflow-hidden">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <div>
      <h3 class="atu-font text-base font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
        <Scissors class="w-4 h-4 text-[#c5a059]" />
        {cutStage === 1
          ? 'Step 1: First Cut (Fire/Air vs Water/Earth)'
          : cutStage === 2
            ? 'Step 2: Second Cut (Fire vs Air Book)'
            : 'Step 3: Third Cut (Water vs Earth Book)'}
      </h3>
      <p class="text-xs text-stone-400 font-serif">
        Timing precision cut: aim near center target (50%) to achieve balanced elemental ratios.
      </p>
    </div>

    {#if onAutoBypass}
      <button
        onclick={onAutoBypass}
        class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-stone-400 hover:text-stone-200 border border-white/10 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1 transition cursor-pointer"
      >
        <FastForward class="w-3.5 h-3.5" /> Auto-Cut
      </button>
    {/if}
  </div>

  <!-- DECK STACK CUT VISUAL ARENA -->
  <div class="relative h-64 sm:h-72 flex items-center justify-center py-4">
    <div class="relative w-44 sm:w-52 h-64 sm:h-72">
      <!-- BOTTOM DECK STACK -->
      <div
        class="relative w-44 sm:w-52 h-64 sm:h-72 rounded-xl border border-[#c5a059]/70 bg-[#0e0e11] shadow-2xl transition-all duration-300"
        class:translate-x-12={isSlicingAnimation}
        class:translate-y-3={isSlicingAnimation}
        class:rotate-3={isSlicingAnimation}
      >
        <img
          src={THOTH_CARD_BACK_IMAGE}
          alt="Bottom Deck Stack"
          class="w-full h-full object-cover opacity-95 rounded-xl relative z-10"
        />
        <div class="absolute inset-0 bg-gradient-to-tr from-[#0a0a0e]/70 via-transparent to-transparent pointer-events-none z-10" />

        <div class="absolute bottom-3 right-3 text-[10px] font-mono text-[#c5a059] font-bold bg-black/90 px-3 py-1 rounded-md border border-[#c5a059]/40 shadow-xl z-20 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
          <span>
            {cutStage === 1 ? 'Water & Earth' : cutStage === 2 ? 'Air Book' : 'Earth Book'}
          </span>
          <span class="text-white/60">({stackBCount} Cards)</span>
        </div>
      </div>

      <!-- TOP DECK STACK -->
      <div
        class="absolute inset-0 w-44 sm:w-52 h-64 sm:h-72 rounded-xl border border-[#c5a059]/90 bg-[#0e0e11] shadow-2xl z-30 transition-all duration-300"
        class:-translate-x-16={isSlicingAnimation}
        class:-translate-y-6={isSlicingAnimation}
        class:-rotate-6={isSlicingAnimation}
      >
        <img
          src={THOTH_CARD_BACK_IMAGE}
          alt="Top Deck Stack"
          class="w-full h-full object-cover opacity-95 rounded-xl relative z-10"
        />
        <div class="absolute inset-0 bg-gradient-to-tl from-[#0a0a0e]/70 via-transparent to-transparent pointer-events-none z-10" />

        <div class="absolute top-3 left-3 text-[10px] font-mono text-amber-300 font-bold bg-black/90 px-3 py-1 rounded-md border border-amber-400/50 shadow-xl z-20 flex items-center gap-1.5">
          <Sparkles class="w-3 h-3 text-amber-400" />
          <span>{cutStage === 1 ? 'Fire & Air' : cutStage === 2 ? 'Fire Book' : 'Water Book'}</span>
          <span class="text-white/60">({stackACount} Cards)</span>
        </div>
      </div>
    </div>
  </div>

  <!-- LIVE RATIO READOUT -->
  <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono text-stone-300">
    <span class="bg-black/60 px-3 py-1 rounded-md border border-white/10">
      Stack A: <strong class="text-amber-400">{stackACount} Cards ({pileAPercent}%)</strong>
    </span>
    <span class="text-stone-600">•</span>
    <span class="bg-black/60 px-3 py-1 rounded-md border border-white/10">
      Stack B: <strong class="text-[#c5a059]">{stackBCount} Cards ({pileBPercent}%)</strong>
    </span>
  </div>

  <!-- PENDULUM TRACK BAR -->
  <div class="space-y-2">
    <div class="flex items-center justify-between text-[11px] font-mono text-stone-400">
      <span class="flex items-center gap-1.5">
        <Crosshair class="w-3.5 h-3.5 text-[#c5a059]" /> 30% Threshold
      </span>
      <span class="text-amber-400 font-bold">50% Center Target</span>
      <span class="flex items-center gap-1.5">
        70% Threshold <Crosshair class="w-3.5 h-3.5 text-[#c5a059]" />
      </span>
    </div>

    <button
      type="button"
      onclick={onExecuteCut}
      class="relative h-6 w-full bg-[#030305] border border-white/15 rounded-full overflow-hidden cursor-pointer shadow-inner block text-left"
    >
      <div class="absolute top-0 bottom-0 left-[48%] right-[48%] bg-[#c5a059]/30 border-x border-[#c5a059]/60" />
      <div class="absolute top-0 bottom-0 left-[30%] right-[30%] bg-gradient-to-r from-[#c5a059]/10 via-[#c5a059]/20 to-[#c5a059]/10 pointer-events-none" />
      <div
        class="absolute top-0 bottom-0 w-4 -ml-2 bg-gradient-to-r from-[#d6b77b] via-[#c5a059] to-[#936e2d] rounded-full shadow-[0_0_15px_#c5a059] transition-all duration-75"
        style="left: {markerPos}%;"
      />
    </button>
  </div>

  <!-- ACTION BUTTON -->
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <button
      onclick={onExecuteCut}
      disabled={!isCutMoving}
      class="w-full relative group px-8 py-4 bg-gradient-to-r from-[#c5a059] via-[#b89845] to-[#a37d35] hover:from-[#d6b77b] hover:via-[#c5a059] hover:to-[#b08940] text-stone-950 font-bold text-xs font-mono uppercase tracking-[0.15em] rounded-xl shadow-[0_4px_24px_rgba(197,160,89,0.25)] flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
    >
      <Scissors class="w-4 h-4" />
      <span>
        {cutStage === 1
          ? 'TAP TO CUT DECK'
          : cutStage === 2
            ? 'TAP TO CUT FIRE & AIR BOOKS'
            : 'TAP TO CUT WATER & EARTH BOOKS'}
      </span>
    </button>
  </div>
</div>
