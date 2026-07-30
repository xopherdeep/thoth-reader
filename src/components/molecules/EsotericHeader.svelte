<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    badge?: Snippet;
    titleTop: string;
    titleBottom?: string;
    subtitle?: string;
    class?: string;
  }

  let { badge, titleTop, titleBottom, subtitle, class: className = '' }: Props = $props();
</script>

<div class="space-y-4 {className}">
  {#if badge}
    <div class="transition-opacity duration-300">
      {@render badge()}
    </div>
  {/if}

  <h2 class="atu-font text-2xl sm:text-[2rem] font-extrabold tracking-wide leading-[1.15]">
    <span
      class="bg-gradient-to-br from-[#f5ecd4] via-[#c5a059] to-[#8a6520] bg-clip-text text-transparent animate-shimmer"
      style="background-image: linear-gradient(105deg, #f5ecd4 0%, #c5a059 30%, #d6b77b 50%, #c5a059 70%, #8a6520 100%);"
    >
      {titleTop}
    </span>
    {#if titleBottom}
      <br />
      <span class="text-stone-100/90 text-xl sm:text-2xl font-bold">
        {titleBottom}
      </span>
    {/if}
  </h2>

  {#if subtitle}
    <p class="text-[13px] sm:text-sm text-stone-400 font-serif leading-[1.7] max-w-2xl">
      {subtitle}
    </p>
  {/if}

  <div class="animate-line-reveal h-px bg-gradient-to-r from-[#c5a059]/40 via-[#c5a059]/15 to-transparent"></div>
</div>
