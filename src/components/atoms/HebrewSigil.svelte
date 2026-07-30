<script lang="ts">
  import type { HebrewLetter } from '../../types';

  interface Props {
    hebrew: HebrewLetter | null;
    size?: 'sm' | 'md' | 'lg';
  }

  let { hebrew, size = 'md' }: Props = $props();

  const sizeMap = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
  };
</script>

{#if hebrew}
  <div class="inline-flex items-center gap-1.5 bg-[#050505] px-2 py-0.5 rounded border border-[#c5a059]/40 font-mono">
    <span class="font-serif font-bold text-[#c5a059] {sizeMap[size]}">
      {hebrew.letter}
    </span>
    <span class="text-[10px] text-stone-300">
      {hebrew.name} ({hebrew.value})
    </span>
  </div>
{/if}
