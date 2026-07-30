<script lang="ts">
  import { Compass, Flame } from 'lucide-svelte';
  import type { ThothCard } from '../../types';

  interface Props {
    currentCard: ThothCard;
  }

  let { currentCard }: Props = $props();
</script>

<div class="space-y-6">
  {#if currentCard.hebrewLetter}
    <div class="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-4">
      <h3 class="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
        <span class="text-lg">א</span> Hebrew Letter & Kabbalistic Path
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#050505] p-4 rounded-md border border-white/10">
        <div>
          <div class="text-xs font-mono text-stone-400 uppercase">Glyph & Name</div>
          <div class="text-xl font-bold text-[#c5a059] font-serif">
            {currentCard.hebrewLetter.letter} ({currentCard.hebrewLetter.name})
          </div>
        </div>
        <div>
          <div class="text-xs font-mono text-stone-400 uppercase">Literal Translation</div>
          <div class="text-base font-bold text-stone-200 font-serif">
            "{currentCard.hebrewLetter.meaning}"
          </div>
        </div>
        <div>
          <div class="text-xs font-mono text-stone-400 uppercase">Gematria Value</div>
          <div class="text-xl font-mono font-bold text-stone-100">
            {currentCard.hebrewLetter.value}
          </div>
        </div>
      </div>
    </div>
  {/if}

  <div class="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-4">
    <h3 class="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
      <Compass class="w-4 h-4" /> Astrological & Astronomical Correspondences
    </h3>
    <div class="space-y-3 bg-[#050505] p-5 rounded-md border border-white/10 text-sm">
      <div class="flex justify-between border-b border-white/10 pb-2">
        <span class="text-stone-400 font-mono">Attribution Type:</span>
        <span class="font-bold text-stone-200">{currentCard.astrology?.type || 'Cosmic'}</span>
      </div>
      <div class="flex justify-between border-b border-white/10 pb-2">
        <span class="text-stone-400 font-mono">Astrological Name:</span>
        <span class="font-bold text-[#c5a059] font-serif">
          {currentCard.astrology?.name} {currentCard.astrology?.symbol}
        </span>
      </div>
      {#if currentCard.astrology?.decanDetails}
        <div class="pt-1">
          <span class="text-stone-400 font-mono text-xs uppercase block mb-1">
            Golden Dawn Decan Rulership & Dates:
          </span>
          <p class="text-stone-200 font-serif leading-relaxed">
            {currentCard.astrology.decanDetails}
          </p>
        </div>
      {/if}
    </div>
  </div>

  <div class="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-4">
    <h3 class="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
      <Flame class="w-4 h-4 text-amber-500" /> Hermetic Alchemical Operation
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#050505] p-5 rounded-md border border-white/10 text-sm">
      <div>
        <span class="text-xs font-mono text-stone-400 uppercase block">Operation:</span>
        <strong class="text-base text-[#c5a059] font-serif">{currentCard.alchemy.process}</strong>
      </div>
      <div>
        <span class="text-xs font-mono text-stone-400 uppercase block">Element & Symbol:</span>
        <strong class="text-base text-stone-200">
          {currentCard.alchemy.element} ({currentCard.alchemy.symbol})
        </strong>
      </div>
      {#if currentCard.alchemy.metalOrQuality}
        <div class="sm:col-span-2 border-t border-white/10 pt-2">
          <span class="text-xs font-mono text-stone-400 uppercase block">Alchemical Quality / Metal:</span>
          <span class="text-stone-300 font-serif">{currentCard.alchemy.metalOrQuality}</span>
        </div>
      {/if}
    </div>
  </div>
</div>
