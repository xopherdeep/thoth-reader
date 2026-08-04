<script lang="ts">
  import { Sparkles, Crown, Flame, Droplets, Wind, Mountain, RotateCcw, ChevronRight } from 'lucide-svelte';
  import type { FourPilesCut } from '../../utils/thothSpread';
  import { THOTH_CARD_BACK_IMAGE, getThothCardImageUrl } from '../../utils/cardImageUrls';
  import { THOTH_DECK } from '../../data/thothCards';

  interface Props {
    fourPilesCut: FourPilesCut;
    selectedPileId: string | null;
    onSelectPile: (pileId: string) => void;
    onNextStep: () => void;
    onBackToShuffle: () => void;
    onPerformCutAgain: () => void;
    selectedSignificatorId?: string | null;
  }

  let {
    fourPilesCut,
    selectedPileId,
    onSelectPile,
    onNextStep,
    onBackToShuffle,
    onPerformCutAgain,
    selectedSignificatorId,
  }: Props = $props();

  let significatorCard = $derived(
    selectedSignificatorId ? THOTH_DECK.find((c) => c.id === selectedSignificatorId) : null
  );

  let pileWithSignificator = $derived(
    selectedSignificatorId
      ? fourPilesCut.piles.find((p) => p.cards.some((c) => c.id === selectedSignificatorId))
      : null
  );

  function getPileVisualConfig(pileId: string) {
    switch (pileId) {
      case 'fire':
        return {
          hebrewLabel: 'Yod (י)',
          glow: 'border-rose-500/70 shadow-[0_0_30px_rgba(244,63,94,0.3)]',
          bottomGradient: 'from-rose-950/60 to-transparent',
        };
      case 'water':
        return {
          hebrewLabel: 'Heh (ה)',
          glow: 'border-sky-500/70 shadow-[0_0_30px_rgba(56,189,248,0.3)]',
          bottomGradient: 'from-sky-950/60 to-transparent',
        };
      case 'air':
        return {
          hebrewLabel: 'Vau (ו)',
          glow: 'border-amber-500/70 shadow-[0_0_30px_rgba(245,158,11,0.3)]',
          bottomGradient: 'from-amber-950/60 to-transparent',
        };
      case 'earth':
      default:
        return {
          hebrewLabel: 'Heh Final (ה)',
          glow: 'border-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.3)]',
          bottomGradient: 'from-emerald-950/60 to-transparent',
        };
    }
  }
</script>

<div class="space-y-7">
  <!-- LIBER T SIGNIFICATOR ALIGNMENT REVEAL BANNER -->
  {#if significatorCard && pileWithSignificator}
    <div class="bg-gradient-to-r from-[#0c0a06] via-[#1a1409] to-[#0c0a06] border border-[#c5a059]/50 rounded-2xl p-4 sm:p-5 shadow-[0_0_40px_rgba(197,160,89,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-14 h-20 rounded-lg border border-[#c5a059] overflow-hidden shrink-0 shadow-[0_0_15px_rgba(197,160,89,0.4)]">
          <img
            src={getThothCardImageUrl(significatorCard)}
            alt={significatorCard.name}
            class="w-full h-full object-cover"
          />
        </div>
        <div class="space-y-1 text-left">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-[#c5a059] animate-pulse" />
            <span class="text-xs font-mono text-[#c5a059] font-bold uppercase tracking-[0.15em]">
              Significator Card Discovered!
            </span>
          </div>
          <h4 class="atu-font text-base sm:text-lg font-bold text-stone-100">
            Significator <span class="text-[#c5a059]">{significatorCard.name}</span> in <span class="text-[#c5a059]">Book of {pileWithSignificator.element.toUpperCase()}</span>!
          </h4>
          <p class="text-xs text-stone-400 font-sans">
            Liber T Alignment Confirmed: Your bookmark card landed in stack {pileWithSignificator.letter} ({pileWithSignificator.hebrewName}).
          </p>
        </div>
      </div>

      <button
        onclick={() => onSelectPile(pileWithSignificator!.id)}
        class="px-4 py-2.5 bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#c5a059] border border-[#c5a059]/60 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-2 cursor-pointer"
      >
        <Crown class="w-4 h-4" />
        <span>Select Aligned Book</span>
      </button>
    </div>
  {/if}

  <!-- 4 COLUMNS GRID OF 4 PHYSICAL DECK STACKS -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
    {#each fourPilesCut.piles as pile (pile.id)}
      {@const visual = getPileVisualConfig(pile.id)}
      {@const isSelected = selectedPileId === pile.id}
      {@const hasSignificator = Boolean(selectedSignificatorId && pile.cards.some((c) => c.id === selectedSignificatorId))}

      <div class="relative group text-left">
        <!-- Main Card Container -->
        <button
          type="button"
          onclick={() => onSelectPile(pile.id)}
          class="relative w-full z-10 aspect-[1/1.62] p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none overflow-hidden shadow-2xl text-left {isSelected
            ? `${visual.glow} ring-2 ring-[#c5a059] shadow-[0_0_45px_rgba(197,160,89,0.35)]`
            : hasSignificator
              ? 'border-[#c5a059]/70 ring-1 ring-[#c5a059]/40 opacity-100 shadow-[0_0_25px_rgba(197,160,89,0.2)]'
              : 'border-white/20 hover:border-white/45 opacity-95 hover:opacity-100'}"
        >
          <!-- Full Card Back Background -->
          <img
            src={THOTH_CARD_BACK_IMAGE}
            alt="Thoth Card Back Background"
            class="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none"
          />

          <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/95 pointer-events-none" />
          <div class="absolute inset-0 bg-gradient-to-t {visual.bottomGradient} pointer-events-none" />

          <!-- HEADER ROW -->
          <div class="relative z-10 flex items-start justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-black/70 border border-[#c5a059]/40 flex items-center justify-center shadow-inner backdrop-blur-md">
                <span class="text-base font-serif font-bold text-[#c5a059]">
                  {pile.letter}
                </span>
              </div>
              <span class="atu-font text-xs font-bold text-stone-200 tracking-wider">
                {visual.hebrewLabel}
              </span>
            </div>
          </div>

          <!-- SIGNIFICATOR BADGE -->
          {#if hasSignificator}
            <div class="relative z-10 my-1 px-2.5 py-1 bg-[#c5a059] text-stone-950 text-[10px] font-mono font-bold uppercase rounded-full flex items-center justify-between shadow-[0_0_12px_rgba(197,160,89,0.6)]">
              <span class="flex items-center gap-1 truncate">
                <Sparkles class="w-3 h-3 shrink-0" /> Significator Inside
              </span>
              <Crown class="w-3 h-3 shrink-0" />
            </div>
          {/if}

          <!-- CENTER ELEMENTAL TITLE -->
          <div class="relative z-10 py-4 my-auto flex flex-col items-center justify-center text-center space-y-1.5 select-none">
            <div class="p-2">
              {#if pile.id === 'fire'}
                <Flame class="w-8 h-8 text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
              {:else if pile.id === 'water'}
                <Droplets class="w-8 h-8 text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
              {:else if pile.id === 'air'}
                <Wind class="w-8 h-8 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
              {:else}
                <Mountain class="w-8 h-8 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              {/if}
            </div>
            <h3 class="atu-font text-xl sm:text-2xl font-extrabold tracking-[0.15em] uppercase text-stone-100 drop-shadow-md">
              BOOK OF {pile.element.toUpperCase()}
            </h3>
          </div>

          <p class="relative z-10 text-[11px] text-stone-200 leading-relaxed font-sans text-center line-clamp-2 px-1 mb-2 drop-shadow">
            {pile.description}
          </p>

          <!-- BOTTOM CARD COUNT -->
          <div class="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] font-mono">
            <span class="text-stone-300">Book of {pile.element}</span>
            <strong class="text-[#c5a059]">{pile.cards.length} Cards</strong>
          </div>
        </button>
      </div>
    {/each}
  </div>

  <!-- BOTTOM CONTROL BAR -->
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
    <div class="flex items-center gap-3">
      <button
        onclick={onBackToShuffle}
        class="px-4 py-2.5 bg-[#050505] hover:bg-black text-stone-400 hover:text-stone-200 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-xl transition cursor-pointer"
      >
        Back to Shuffle
      </button>

      <button
        onclick={onPerformCutAgain}
        class="px-4 py-2.5 bg-[#050505] hover:bg-black text-[#c5a059] border border-[#c5a059]/30 hover:border-[#c5a059]/60 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition cursor-pointer"
      >
        <RotateCcw class="w-3.5 h-3.5" /> Re-Cut Deck
      </button>
    </div>

    {#if selectedPileId}
      <button
        onclick={onNextStep}
        class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-stone-950 font-mono font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Proceed with Selected Book</span>
        <ChevronRight class="w-4 h-4" />
      </button>
    {/if}
  </div>
</div>
