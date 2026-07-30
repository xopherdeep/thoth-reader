<script lang="ts">
  import { Layers } from 'lucide-svelte';

  interface Props {
    traditionalInfo: {
      traditionalName: string;
      comparisonNote: string;
    };
  }

  let { traditionalInfo }: Props = $props();
</script>

<div class="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-6">
  <div class="flex items-center gap-3 border-b border-white/10 pb-4">
    <Layers class="w-6 h-6 text-[#c5a059]" />
    <div>
      <h3 class="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold">
        Traditional Tarot Bridge & Historical Comparison
      </h3>
      <p class="text-xs text-stone-400 font-sans">
        Connecting Crowley's 1944 Book of Thoth to traditional Renaissance & Rider-Waite-Smith decks.
      </p>
    </div>
  </div>

  <div class="bg-[#050505] p-5 rounded-md border border-white/10 space-y-4">
    <div>
      <span class="text-xs font-mono text-stone-400 uppercase block">Traditional Equivalent Name:</span>
      <div class="text-xl font-bold text-[#c5a059] font-serif mt-1">
        {traditionalInfo.traditionalName}
      </div>
    </div>

    <div>
      <span class="text-xs font-mono text-stone-400 uppercase block">Crowley's Thoth System Variation:</span>
      <p class="text-sm text-stone-200 font-serif leading-relaxed mt-1 bg-[#0e0e11] p-4 rounded border border-white/10">
        {traditionalInfo.comparisonNote}
      </p>
    </div>
  </div>
</div>
