<script lang="ts">
  import { Compass, Sparkles, Feather, Layers } from 'lucide-svelte';

  interface Props {
    activeTab: 'overview' | 'esoteric' | 'crowley' | 'traditional';
    setActiveTab: (tab: 'overview' | 'esoteric' | 'crowley' | 'traditional') => void;
    variant?: 'inline' | 'fab';
  }

  let { activeTab, setActiveTab, variant = 'inline' }: Props = $props();
</script>

{#if variant === 'fab'}
  <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl bg-[#09090d]/95 backdrop-blur-xl border border-[#c5a059]/60 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-1.5 sm:p-2 flex items-center justify-between gap-1 sm:gap-2">
    <button
      onclick={() => setActiveTab('overview')}
      class="flex-1 h-11 sm:h-12 px-2 sm:px-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer {activeTab === 'overview'
        ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 shadow-[0_0_12px_rgba(197,160,89,0.5)] scale-105'
        : 'text-stone-300 hover:text-[#c5a059] hover:bg-white/5'}"
    >
      <Compass class="w-4 h-4 shrink-0" />
      <span class="truncate">Overview</span>
    </button>

    <button
      onclick={() => setActiveTab('esoteric')}
      class="flex-1 h-11 sm:h-12 px-2 sm:px-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer {activeTab === 'esoteric'
        ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 shadow-[0_0_12px_rgba(197,160,89,0.5)] scale-105'
        : 'text-stone-300 hover:text-[#c5a059] hover:bg-white/5'}"
    >
      <Sparkles class="w-4 h-4 shrink-0" />
      <span class="truncate">Attributions</span>
    </button>

    <button
      onclick={() => setActiveTab('crowley')}
      class="flex-1 h-11 sm:h-12 px-2 sm:px-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer {activeTab === 'crowley'
        ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 shadow-[0_0_12px_rgba(197,160,89,0.5)] scale-105'
        : 'text-stone-300 hover:text-[#c5a059] hover:bg-white/5'}"
    >
      <Feather class="w-4 h-4 shrink-0" />
      <span class="truncate">Meaning</span>
    </button>

    <button
      onclick={() => setActiveTab('traditional')}
      class="flex-1 h-11 sm:h-12 px-2 sm:px-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer {activeTab === 'traditional'
        ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 shadow-[0_0_12px_rgba(197,160,89,0.5)] scale-105'
        : 'text-stone-300 hover:text-[#c5a059] hover:bg-white/5'}"
    >
      <Layers class="w-4 h-4 shrink-0" />
      <span class="truncate">Bridge</span>
    </button>
  </nav>
{:else}
  <div class="hidden sm:grid grid-cols-4 gap-2.5">
    <button
      onclick={() => setActiveTab('overview')}
      class="h-12 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer {activeTab === 'overview'
        ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-[1.02]'
        : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'}"
    >
      <Compass class="w-4 h-4 shrink-0" />
      <span>Overview</span>
    </button>
    <button
      onclick={() => setActiveTab('esoteric')}
      class="h-12 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer {activeTab === 'esoteric'
        ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-[1.02]'
        : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'}"
    >
      <Sparkles class="w-4 h-4 shrink-0" />
      <span>Attributions</span>
    </button>
    <button
      onclick={() => setActiveTab('crowley')}
      class="h-12 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer {activeTab === 'crowley'
        ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-[1.02]'
        : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'}"
    >
      <Feather class="w-4 h-4 shrink-0" />
      <span>Meaning</span>
    </button>
    <button
      onclick={() => setActiveTab('traditional')}
      class="h-12 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer {activeTab === 'traditional'
        ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b775] text-stone-950 border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-[1.02]'
        : 'bg-[#0e0e11] text-stone-300 border-white/15 hover:border-[#c5a059] hover:text-[#c5a059]'}"
    >
      <Layers class="w-4 h-4 shrink-0" />
      <span>Bridge</span>
    </button>
  </div>
{/if}
