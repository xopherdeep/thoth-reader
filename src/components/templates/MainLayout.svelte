<script lang="ts">
  import { Sparkles, BookOpen, History, Flame, Menu, X, ChevronRight, FileText, BookMarked } from 'lucide-svelte';
  import type { ThothReading } from '../../types';
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
    activeTab: 'studio' | 'compendium' | 'saved' | 'report' | 'glossary';
    onNavigate: (hash: string) => void;
    savedReadingsCount: number;
    activeReading: ThothReading | null;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
  }

  let {
    children,
    activeTab,
    onNavigate,
    savedReadingsCount,
    activeReading,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  }: Props = $props();
</script>

<div class="min-h-screen w-full max-w-full overflow-x-hidden bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#c5a059]/30 selection:text-[#c5a059]">
  <header class="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#c5a059]/30 shadow-2xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        onclick={() => onNavigate('#/studio')}
        class="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
      >
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-sm bg-[#0e0e11] border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] shadow-inner group-hover:border-[#c5a059] transition shrink-0">
          <Flame class="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        </div>
        <div>
          <h1 class="atu-font text-lg sm:text-2xl font-bold tracking-wide text-[#c5a059] group-hover:text-[#d6b77b] transition leading-tight">
            Book of Thoth
          </h1>
          <p class="text-[10px] sm:text-xs font-sans text-stone-300 tracking-wide -mt-0.5 hidden xs:block">
            Hermetic Tarot Synthesis & Spread Engine
          </p>
        </div>
      </div>

      <div class="hidden md:flex items-center gap-4">
        <div class="text-right border-r border-white/10 pr-4">
          <div class="text-[10px] font-mono text-white/40 uppercase tracking-widest">Current Cycle</div>
          <div class="text-xs font-mono text-[#c5a059]">v1.0.4-AEON</div>
        </div>

        <nav class="flex items-center gap-1.5 bg-[#0e0e11] p-1.5 rounded-sm border border-white/10 text-xs">
          <button
            onclick={() => onNavigate('#/studio')}
            class="px-3.5 py-1.5 rounded-sm font-medium transition flex items-center gap-1.5 cursor-pointer {activeTab === 'studio'
              ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/60 font-semibold shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-transparent'}"
          >
            <Sparkles class="w-3.5 h-3.5 shrink-0" />
            <span>Studio</span>
          </button>

          <button
            onclick={() => onNavigate('#/compendium')}
            class="px-3.5 py-1.5 rounded-sm font-medium transition flex items-center gap-1.5 cursor-pointer {activeTab === 'compendium'
              ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/60 font-semibold shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-transparent'}"
          >
            <BookOpen class="w-3.5 h-3.5 shrink-0" />
            <span>Compendium</span>
          </button>

          <button
            onclick={() => onNavigate('#/saved')}
            class="px-3.5 py-1.5 rounded-sm font-medium transition flex items-center gap-1.5 relative cursor-pointer {activeTab === 'saved'
              ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/60 font-semibold shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-transparent'}"
          >
            <History class="w-3.5 h-3.5 shrink-0" />
            <span>Archives</span>
            {#if savedReadingsCount > 0}
              <span class="w-4 h-4 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#c5a059] text-[10px] font-mono font-bold flex items-center justify-center ml-0.5 shrink-0">
                {savedReadingsCount}
              </span>
            {/if}
          </button>

          <button
            onclick={() => onNavigate('#/glossary')}
            class="px-3.5 py-1.5 rounded-sm font-medium transition flex items-center gap-1.5 cursor-pointer {activeTab === 'glossary'
              ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/60 font-semibold shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-transparent'}"
          >
            <BookMarked class="w-3.5 h-3.5 shrink-0" />
            <span>Glossary & Index</span>
          </button>
        </nav>
      </div>

      <div class="md:hidden flex items-center gap-2">
        <button
          onclick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          class="h-10 px-3 bg-[#0e0e11] hover:bg-[#1a1a22] text-[#c5a059] border border-[#c5a059]/50 rounded-md flex items-center gap-2 font-bold text-xs shadow-lg transition cursor-pointer active:scale-95"
          aria-label="Toggle App Menu"
        >
          {#if isMobileMenuOpen}
            <X class="w-5 h-5 shrink-0" />
            <span class="font-mono uppercase tracking-wider text-[11px]">Close</span>
          {:else}
            <Menu class="w-5 h-5 shrink-0" />
            <span class="font-mono uppercase tracking-wider text-[11px]">Menu</span>
            {#if savedReadingsCount > 0}
              <span class="w-2 h-2 rounded-full bg-[#c5a059] animate-ping"></span>
            {/if}
          {/if}
        </button>
      </div>
    </div>
  </header>

  {#if isMobileMenuOpen}
    <div class="md:hidden bg-[#0a0a0d] border-b border-[#c5a059]/40 z-30 overflow-hidden shadow-2xl">
      <div class="p-4 space-y-2">
        <div class="text-[10px] font-mono text-stone-400 uppercase tracking-widest px-2 mb-1">
          Navigation & Modes
        </div>

        <button
          onclick={() => onNavigate('#/studio')}
          class="w-full p-3 rounded-lg text-left transition flex items-center justify-between cursor-pointer border {activeTab === 'studio'
            ? 'bg-gradient-to-r from-[#c5a059]/20 to-transparent text-[#c5a059] border-[#c5a059]/60 font-bold'
            : 'bg-[#0e0e11]/80 text-stone-300 border-white/10 hover:border-[#c5a059]/40'}"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-md bg-[#050505] text-[#c5a059] border border-[#c5a059]/40">
              <Sparkles class="w-4 h-4" />
            </div>
            <div>
              <div class="text-sm font-semibold">Reading Studio</div>
              <div class="text-[11px] text-stone-400 font-normal">Cast a new Thoth spread inquiry</div>
            </div>
          </div>
          <ChevronRight class="w-4 h-4 text-stone-500" />
        </button>

        <button
          onclick={() => onNavigate('#/compendium')}
          class="w-full p-3 rounded-lg text-left transition flex items-center justify-between cursor-pointer border {activeTab === 'compendium'
            ? 'bg-gradient-to-r from-[#c5a059]/20 to-transparent text-[#c5a059] border-[#c5a059]/60 font-bold'
            : 'bg-[#0e0e11]/80 text-stone-300 border-white/10 hover:border-[#c5a059]/40'}"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-md bg-[#050505] text-[#c5a059] border border-[#c5a059]/40">
              <BookOpen class="w-4 h-4" />
            </div>
            <div>
              <div class="text-sm font-semibold">Thoth Compendium</div>
              <div class="text-[11px] text-stone-400 font-normal">Explore all 78 esoteric cards & keys</div>
            </div>
          </div>
          <ChevronRight class="w-4 h-4 text-stone-500" />
        </button>

        <button
          onclick={() => onNavigate('#/saved')}
          class="w-full p-3 rounded-lg text-left transition flex items-center justify-between cursor-pointer border {activeTab === 'saved'
            ? 'bg-gradient-to-r from-[#c5a059]/20 to-transparent text-[#c5a059] border-[#c5a059]/60 font-bold'
            : 'bg-[#0e0e11]/80 text-stone-300 border-white/10 hover:border-[#c5a059]/40'}"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-md bg-[#050505] text-[#c5a059] border border-[#c5a059]/40 relative">
              <History class="w-4 h-4" />
              {#if savedReadingsCount > 0}
                <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#c5a059]"></span>
              {/if}
            </div>
            <div>
              <div class="text-sm font-semibold flex items-center gap-2">
                <span>Saved Archives</span>
                {#if savedReadingsCount > 0}
                  <span class="text-[10px] px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#c5a059] font-mono">
                    {savedReadingsCount}
                  </span>
                {/if}
              </div>
              <div class="text-[11px] text-stone-400 font-normal">Review past inquiries & reports</div>
            </div>
          </div>
          <ChevronRight class="w-4 h-4 text-stone-500" />
        </button>

        <button
          onclick={() => onNavigate('#/glossary')}
          class="w-full p-3 rounded-lg text-left transition flex items-center justify-between cursor-pointer border {activeTab === 'glossary'
            ? 'bg-gradient-to-r from-[#c5a059]/20 to-transparent text-[#c5a059] border-[#c5a059]/60 font-bold'
            : 'bg-[#0e0e11]/80 text-stone-300 border-white/10 hover:border-[#c5a059]/40'}"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-md bg-[#050505] text-[#c5a059] border border-[#c5a059]/40">
              <BookMarked class="w-4 h-4" />
            </div>
            <div>
              <div class="text-sm font-semibold">Glossary & Index</div>
              <div class="text-[11px] text-stone-400 font-normal">Map of Consciousness, terms & 78-card index</div>
            </div>
          </div>
          <ChevronRight class="w-4 h-4 text-stone-500" />
        </button>

        {#if activeReading}
          <button
            onclick={() => onNavigate('#/report')}
            class="w-full p-3 rounded-lg text-left transition flex items-center justify-between cursor-pointer border {activeTab === 'report'
              ? 'bg-gradient-to-r from-[#c5a059]/20 to-transparent text-[#c5a059] border-[#c5a059]/60 font-bold'
              : 'bg-[#0e0e11]/80 text-stone-300 border-white/10 hover:border-[#c5a059]/40'}"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-md bg-[#050505] text-[#c5a059] border border-[#c5a059]/40">
                <FileText class="w-4 h-4" />
              </div>
              <div>
                <div class="text-sm font-semibold text-[#c5a059]">Active Alchemical Report</div>
                <div class="text-[11px] text-stone-400 font-normal line-clamp-1">
                  "{activeReading.question}"
                </div>
              </div>
            </div>
            <ChevronRight class="w-4 h-4 text-[#c5a059]" />
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
    {#if children}
      {@render children()}
    {/if}
  </main>

  <footer class="border-t border-white/10 py-8 bg-[#020203] text-stone-300 text-xs font-mono">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <Flame class="w-4 h-4 text-[#c5a059]" />
        <span class="font-bold text-[#c5a059] atu-font text-sm">BOOK OF THOTH</span>
        <span class="text-stone-400">• Aleister Crowley & Lady Frieda Harris Hermetic System</span>
      </div>

      <div class="text-center md:text-right text-[11px] text-stone-300 space-y-1">
        <div>Love is the law, love under will.</div>
        <div class="text-[#c5a059]/80">Universal Portable Svelte 5 Architecture</div>
      </div>
    </div>
  </footer>
</div>
