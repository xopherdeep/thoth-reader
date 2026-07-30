<script lang="ts">
  import { Zap, CheckCircle2, Layers } from 'lucide-svelte';

  interface Props {
    totalSteps: number;
    spreadMode: 'auto' | 'manual';
    setSpreadMode: (mode: 'auto' | 'manual') => void;
    onBack: () => void;
    onNext: () => void;
  }

  let { totalSteps, spreadMode, setSpreadMode, onBack, onNext }: Props = $props();
</script>

<div class="space-y-8 relative z-10">
  <div class="space-y-4">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/12 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/25 shadow-[0_0_16px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.05)]">
      <Zap class="w-3.5 h-3.5" />
      <span>Step 2 of {totalSteps}</span>
      <span class="w-1 h-1 rounded-full bg-[#c5a059]/60"></span>
      <span>Select Execution Method</span>
    </div>

    <h2 class="atu-font text-2xl sm:text-[2rem] font-extrabold tracking-wide leading-[1.15]">
      <span class="bg-gradient-to-br from-[#f5ecd4] via-[#c5a059] to-[#8a6520] bg-clip-text text-transparent animate-shimmer" style="background-image: linear-gradient(105deg, #f5ecd4 0%, #c5a059 30%, #d6b77b 50%, #c5a059 70%, #8a6520 100%);">
        How Will You Consult
      </span>
      <br />
      <span class="text-stone-100/90 text-xl sm:text-2xl font-bold">
        the Book of Thoth?
      </span>
    </h2>

    <p class="text-[13px] sm:text-sm text-stone-400 font-serif leading-[1.7] max-w-2xl">
      Choose between the automated Golden Dawn counting loop ritual or manually entering cards drawn from your physical deck.
    </p>
    <div class="animate-line-reveal h-px bg-gradient-to-r from-[#c5a059]/40 via-[#c5a059]/15 to-transparent"></div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      onclick={() => setSpreadMode('auto')}
      class="group/card relative p-6 sm:p-7 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden {spreadMode === 'auto'
        ? 'bg-[#0e0e14]/90 border-[#c5a059]/60 ring-1 ring-[#c5a059]/30 shadow-[0_0_30px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.04)]'
        : 'bg-[#08080c]/80 border-white/[0.06] hover:border-[#c5a059]/25 hover:bg-[#0c0c12]'}"
    >
      {#if spreadMode === 'auto'}
        <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] pointer-events-none bg-[#c5a059]/8 animate-ambient-pulse"></div>
      {/if}
      <div class="relative flex items-start justify-between gap-3">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 {spreadMode === 'auto'
          ? 'bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.2)]'
          : 'bg-white/[0.03] border border-white/10 text-stone-500 group-hover/card:text-[#c5a059] group-hover/card:border-[#c5a059]/25'}">
          <Zap class="w-6 h-6 fill-current" />
        </div>
        <span class="text-[10px] font-mono px-3 py-1 rounded-full font-bold tracking-wider transition-all duration-200 {spreadMode === 'auto'
          ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_8px_rgba(197,160,89,0.15)]'
          : 'bg-white/[0.04] text-stone-500 border border-white/[0.06]'}">
          RECOMMENDED
        </span>
      </div>
      <div class="relative">
        <h3 class="atu-font text-lg font-bold transition-colors duration-200 {spreadMode === 'auto' ? 'text-stone-50' : 'text-stone-200 group-hover/card:text-stone-100'}">
          Automatic Thoth Counting Loop
        </h3>
        <p class="text-xs text-stone-400 mt-2 leading-relaxed">
          Shuffle the 78 cards, cut into 4 elemental piles (YHVH), pick a Significator, and let Crowley's Golden Dawn jump count generate the sequence.
        </p>
      </div>
      <div class="text-[11px] font-mono font-bold flex items-center gap-2 pt-1 transition-colors duration-200 {spreadMode === 'auto' ? 'text-[#c5a059]' : 'text-stone-500 group-hover/card:text-[#c5a059]/70'}">
        <CheckCircle2 class="w-4 h-4" />
        <span>Golden Dawn Mathematical Engine</span>
      </div>
    </div>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      onclick={() => setSpreadMode('manual')}
      class="group/card relative p-6 sm:p-7 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden {spreadMode === 'manual'
        ? 'bg-[#0e0e14]/90 border-[#c5a059]/60 ring-1 ring-[#c5a059]/30 shadow-[0_0_30px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.04)]'
        : 'bg-[#08080c]/80 border-white/[0.06] hover:border-[#c5a059]/25 hover:bg-[#0c0c12]'}"
    >
      {#if spreadMode === 'manual'}
        <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] pointer-events-none bg-[#c5a059]/8 animate-ambient-pulse"></div>
      {/if}
      <div class="relative flex items-start justify-between gap-3">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 {spreadMode === 'manual'
          ? 'bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.2)]'
          : 'bg-white/[0.03] border border-white/10 text-stone-500 group-hover/card:text-[#c5a059] group-hover/card:border-[#c5a059]/25'}">
          <Layers class="w-6 h-6" />
        </div>
      </div>
      <div class="relative">
        <h3 class="atu-font text-lg font-bold transition-colors duration-200 {spreadMode === 'manual' ? 'text-stone-50' : 'text-stone-200 group-hover/card:text-stone-100'}">
          Manual Physical Deck Punch-In
        </h3>
        <p class="text-xs text-stone-400 mt-2 leading-relaxed">
          Use your real physical Thoth deck. Perform your own physical reading ritual, then select cards one-by-one to generate the report.
        </p>
      </div>
      <div class="text-[11px] font-mono font-bold flex items-center gap-2 pt-1 transition-colors duration-200 {spreadMode === 'manual' ? 'text-[#c5a059]' : 'text-stone-500 group-hover/card:text-[#c5a059]/70'}">
        <CheckCircle2 class="w-4 h-4" />
        <span>Physical Deck Mirroring</span>
      </div>
    </div>
  </div>
</div>
