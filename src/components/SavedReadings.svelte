<script lang="ts">
  import type { ThothReading } from '../types';
  import { History, Calendar, Trash2, Eye, Sparkles } from 'lucide-svelte';

  interface Props {
    readings: ThothReading[];
    onSelectReading: (reading: ThothReading) => void;
    onDeleteReading: (id: string) => void;
    onNewReading: () => void;
  }

  let { readings, onSelectReading, onDeleteReading, onNewReading }: Props = $props();
</script>

<div class="space-y-6">
  <div class="bg-[#0e0e11] p-6 rounded-sm border border-[#c5a059]/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2 text-[#c5a059] font-mono text-xs uppercase tracking-[0.2em] mb-1">
        <History class="w-4 h-4 text-[#c5a059]" /> Reading Archives
      </div>
      <h2 class="atu-font text-2xl text-[#c5a059] font-bold tracking-wider">SAVED THOTH ORACLE READINGS</h2>
      <p class="text-stone-300 text-sm mt-0.5 font-serif">
        History of past numerological counting spreads and generated QR codes.
      </p>
    </div>

    <button
      onclick={onNewReading}
      class="px-4 py-2 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
    >
      <Sparkles class="w-4 h-4 fill-current" /> Perform New Reading
    </button>
  </div>

  {#if readings.length === 0}
    <div class="text-center py-16 bg-[#0e0e11] rounded-sm border border-white/10 space-y-3">
      <History class="w-10 h-10 text-stone-600 mx-auto" />
      <p class="text-stone-300 text-sm font-medium">No saved readings in your session history yet.</p>
      <button
        onclick={onNewReading}
        class="px-4 py-2 bg-[#c5a059]/20 text-[#c5a059] hover:bg-[#c5a059]/30 border border-[#c5a059]/40 text-xs font-mono uppercase tracking-widest rounded-sm transition cursor-pointer"
      >
        Create Your First Thoth Reading
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each readings as r (r.id)}
        <div
          class="bg-[#0e0e11] border border-white/10 hover:border-[#c5a059]/50 rounded-sm p-5 shadow-lg transition flex flex-col justify-between space-y-4 group"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-stone-400 font-mono">
              <span class="flex items-center gap-1 text-[#c5a059]">
                <Calendar class="w-3.5 h-3.5 text-[#c5a059]" />
                {new Date(r.timestamp).toLocaleDateString(undefined, {
                  dateStyle: 'medium',
                })}
              </span>
              <span>{r.pulledCards.length} Cards</span>
            </div>

            <h3 class="atu-font text-base font-bold text-[#c5a059] group-hover:text-[#d6b77b] transition line-clamp-1 tracking-wide">
              "{r.question}"
            </h3>

            {#if r.aiInterpretation}
              <p class="text-xs text-stone-300 line-clamp-2 bg-[#050505] p-2.5 rounded-sm border border-white/5 font-serif">
                {r.aiInterpretation.overview}
              </p>
            {/if}

            <div class="flex flex-wrap gap-1.5 pt-1">
              {#each r.pulledCards.slice(0, 4) as c, i (i)}
                <span
                  class="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#050505] border border-white/10 text-stone-300"
                >
                  {c.name}
                </span>
              {/each}
              {#if r.pulledCards.length > 4}
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30">
                  +{r.pulledCards.length - 4} more
                </span>
              {/if}
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-white/10">
            <button
              onclick={() => onSelectReading(r)}
              class="px-3.5 py-1.5 bg-[#050505] hover:bg-[#c5a059] hover:text-stone-950 text-[#c5a059] border border-[#c5a059]/40 text-xs font-mono uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye class="w-3.5 h-3.5" /> View Report & QR
            </button>

            <button
              onclick={() => onDeleteReading(r.id)}
              class="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-sm transition cursor-pointer"
              title="Delete Reading"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
