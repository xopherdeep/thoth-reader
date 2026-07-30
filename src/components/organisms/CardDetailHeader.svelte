<script lang="ts">
  import { ArrowLeft, ChevronLeft, ChevronRight, Menu, X, BookOpen, ImageIcon, Sparkles, Compass, Feather, Layers } from 'lucide-svelte';
  import type { ThothCard } from '../../types';

  interface Props {
    currentCard: ThothCard;
    currentIndex: number;
    totalCards: number;
    isDetailMenuOpen: boolean;
    setIsDetailMenuOpen: (open: boolean) => void;
    visualMode: 'thoth' | 'renaissance' | 'sigil';
    setVisualMode: (mode: 'thoth' | 'renaissance' | 'sigil') => void;
    activeTab: 'overview' | 'esoteric' | 'crowley' | 'traditional';
    setActiveTab: (tab: 'overview' | 'esoteric' | 'crowley' | 'traditional') => void;
    onPrev: () => void;
    onNext: () => void;
    onClose: () => void;
  }

  let {
    currentCard,
    currentIndex,
    totalCards,
    isDetailMenuOpen,
    setIsDetailMenuOpen,
    visualMode,
    setVisualMode,
    activeTab,
    setActiveTab,
    onPrev,
    onNext,
    onClose,
  }: Props = $props();
</script>

<header class="shrink-0 z-40 bg-[#09090d]/95 backdrop-blur-md border-b border-[#c5a059]/40 shadow-2xl px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 relative">
  <button
    onclick={onClose}
    class="h-10 sm:h-12 px-3 sm:px-5 bg-[#0e0e11] hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/60 rounded-md font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95 shrink-0 cursor-pointer"
  >
    <ArrowLeft class="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
    <span class="tracking-wide uppercase font-mono hidden xs:inline">Back</span>
  </button>

  <div class="flex flex-col items-center text-center mx-1 overflow-hidden">
    <div class="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#c5a059] font-semibold truncate">
      Card {currentIndex + 1} of {totalCards} • {currentCard.category}
    </div>
    <h1 class="atu-font text-base sm:text-xl md:text-2xl font-bold tracking-wider text-stone-100 truncate">
      {currentCard.name}
    </h1>
    <p class="text-[11px] sm:text-xs font-serif italic text-stone-400 truncate hidden md:block">
      "{currentCard.thothTitle}"
    </p>
  </div>

  <div class="flex items-center gap-2 shrink-0">
    <div class="hidden sm:flex items-center gap-2">
      <button
        onclick={onPrev}
        title="Previous Card"
        class="h-10 sm:h-12 px-3 sm:px-4 bg-[#0e0e11] hover:bg-[#1c1c24] text-stone-200 hover:text-[#c5a059] border border-white/20 hover:border-[#c5a059] rounded-md font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
      >
        <ChevronLeft class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="font-mono uppercase">Prev</span>
      </button>
      <button
        onclick={onNext}
        title="Next Card"
        class="h-10 sm:h-12 px-3 sm:px-4 bg-[#0e0e11] hover:bg-[#1c1c24] text-stone-200 hover:text-[#c5a059] border border-white/20 hover:border-[#c5a059] rounded-md font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
      >
        <span class="font-mono uppercase">Next</span>
        <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
    <button
      onclick={() => setIsDetailMenuOpen(!isDetailMenuOpen)}
      class="h-10 sm:h-12 px-2.5 sm:px-3 bg-[#0e0e11] hover:bg-[#c5a059] text-[#c5a059] hover:text-stone-950 border border-[#c5a059]/60 rounded-md flex items-center gap-1.5 font-bold text-xs transition active:scale-95 cursor-pointer shadow-md"
      aria-label="Toggle Card Menu"
    >
      {#if isDetailMenuOpen}<X class="w-5 h-5 shrink-0" />{:else}<Menu class="w-5 h-5 shrink-0" />{/if}
      <span class="hidden xs:inline font-mono uppercase text-[11px]">Menu</span>
    </button>
  </div>

  {#if isDetailMenuOpen}
    <div
      class="absolute top-full left-0 right-0 z-50 bg-[#09090d]/98 backdrop-blur-xl border-b border-[#c5a059]/40 shadow-2xl overflow-hidden p-4 space-y-4 transition-all duration-200"
    >
      <div class="flex items-center justify-between text-xs font-mono text-[#c5a059] uppercase tracking-widest pb-2 border-b border-white/10">
        <span>Artwork Visual Deck Mode</span>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <button
          onclick={() => {
            setVisualMode('thoth');
            setIsDetailMenuOpen(false);
          }}
          class="p-2.5 rounded-md border text-center transition cursor-pointer {visualMode === 'thoth'
            ? 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]'
            : 'bg-[#0e0e11] text-stone-300 border-white/10 hover:border-white/20'}"
        >
          <BookOpen class="w-4 h-4 mx-auto mb-1" />
          <span class="text-xs font-bold block">Thoth</span>
        </button>
        <button
          onclick={() => {
            setVisualMode('renaissance');
            setIsDetailMenuOpen(false);
          }}
          class="p-2.5 rounded-md border text-center transition cursor-pointer {visualMode === 'renaissance'
            ? 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]'
            : 'bg-[#0e0e11] text-stone-300 border-white/10 hover:border-white/20'}"
        >
          <ImageIcon class="w-4 h-4 mx-auto mb-1" />
          <span class="text-xs font-bold block">Classic</span>
        </button>
        <button
          onclick={() => {
            setVisualMode('sigil');
            setIsDetailMenuOpen(false);
          }}
          class="p-2.5 rounded-md border text-center transition cursor-pointer {visualMode === 'sigil'
            ? 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]'
            : 'bg-[#0e0e11] text-stone-300 border-white/10 hover:border-white/20'}"
        >
          <Sparkles class="w-4 h-4 mx-auto mb-1" />
          <span class="text-xs font-bold block">Sigil</span>
        </button>
      </div>

      <div class="flex items-center justify-between text-xs font-mono text-[#c5a059] uppercase tracking-widest pt-2 pb-1 border-b border-white/10">
        <span>Information Tab Navigation</span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs font-bold">
        <button
          onclick={() => {
            setActiveTab('overview');
            setIsDetailMenuOpen(false);
          }}
          class="p-3 rounded-md border flex items-center gap-2 transition cursor-pointer {activeTab === 'overview'
            ? 'bg-[#c5a059] text-stone-950 border-[#c5a059]'
            : 'bg-[#0e0e11] text-stone-300 border-white/10'}"
        >
          <Compass class="w-4 h-4 shrink-0" /> Overview
        </button>
        <button
          onclick={() => {
            setActiveTab('esoteric');
            setIsDetailMenuOpen(false);
          }}
          class="p-3 rounded-md border flex items-center gap-2 transition cursor-pointer {activeTab === 'esoteric'
            ? 'bg-[#c5a059] text-stone-950 border-[#c5a059]'
            : 'bg-[#0e0e11] text-stone-300 border-white/10'}"
        >
          <Sparkles class="w-4 h-4 shrink-0" /> Attributions
        </button>
        <button
          onclick={() => {
            setActiveTab('crowley');
            setIsDetailMenuOpen(false);
          }}
          class="p-3 rounded-md border flex items-center gap-2 transition cursor-pointer {activeTab === 'crowley'
            ? 'bg-[#c5a059] text-stone-950 border-[#c5a059]'
            : 'bg-[#0e0e11] text-stone-300 border-white/10'}"
        >
          <Feather class="w-4 h-4 shrink-0" /> Meaning
        </button>
        <button
          onclick={() => {
            setActiveTab('traditional');
            setIsDetailMenuOpen(false);
          }}
          class="p-3 rounded-md border flex items-center gap-2 transition cursor-pointer {activeTab === 'traditional'
            ? 'bg-[#c5a059] text-stone-950 border-[#c5a059]'
            : 'bg-[#0e0e11] text-stone-300 border-white/10'}"
        >
          <Layers class="w-4 h-4 shrink-0" /> Traditional Bridge
        </button>
      </div>
    </div>
  {/if}
</header>
