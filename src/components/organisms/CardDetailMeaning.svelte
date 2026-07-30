<script lang="ts">
  import { CheckCircle2, AlertTriangle } from 'lucide-svelte';
  import type { ThothCard } from '../../types';

  interface Props {
    currentCard: ThothCard;
  }

  let { currentCard }: Props = $props();
</script>

<div class="space-y-6">
  <div class="bg-emerald-950/30 border-2 border-emerald-500/50 p-6 rounded-lg space-y-3">
    <div class="flex items-center gap-2.5 text-emerald-400 font-mono text-sm font-bold uppercase tracking-wider">
      <CheckCircle2 class="w-5 h-5 shrink-0" />
      <span>Harmonious Dignity (Light / Upright Position)</span>
    </div>
    <p class="text-stone-100 text-sm sm:text-base leading-relaxed font-serif bg-[#050505]/80 p-5 rounded-md border border-emerald-500/30">
      {currentCard.lightInterpretation}
    </p>
  </div>

  <div class="bg-rose-950/30 border-2 border-rose-500/50 p-6 rounded-lg space-y-3">
    <div class="flex items-center gap-2.5 text-rose-400 font-mono text-sm font-bold uppercase tracking-wider">
      <AlertTriangle class="w-5 h-5 shrink-0" />
      <span>Ill-Dignified (Shadow / Warning / Reversed Position)</span>
    </div>
    <p class="text-stone-100 text-sm sm:text-base leading-relaxed font-serif bg-[#050505]/80 p-5 rounded-md border border-rose-500/30">
      {currentCard.shadowInterpretation}
    </p>
  </div>
</div>
