<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    text: string;
    subText?: string;
    class?: string;
    icon?: Snippet;
  }

  let { text, subText, class: className = '', icon }: Props = $props();
</script>

<div
  class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/12 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/25 shadow-[0_0_16px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.05)] {className}"
>
  {#if icon}
    <span class="shrink-0">
      {@render icon()}
    </span>
  {/if}
  <span>{text}</span>
  {#if subText}
    <span class="w-1 h-1 rounded-full bg-[#c5a059]/60 shrink-0"></span>
    <span>{subText}</span>
  {/if}
</div>
