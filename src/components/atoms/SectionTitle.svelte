<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle?: string;
    icon?: Snippet;
    badge?: string;
    class?: string;
  }

  let {
    title,
    subtitle,
    icon,
    badge,
    class: className = '',
  }: Props = $props();
</script>

<div class="space-y-1 {className}">
  <div class="flex items-center gap-2">
    {#if icon}
      <span class="text-[#c5a059] shrink-0">
        {@render icon()}
      </span>
    {/if}
    {#if badge}
      <span class="text-[10px] font-mono uppercase bg-[#050505] text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/40">
        {badge}
      </span>
    {/if}
  </div>
  <h3 class="atu-font text-xl sm:text-2xl font-bold text-stone-100 tracking-wide">
    {title}
  </h3>
  {#if subtitle}
    <p class="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
      {subtitle}
    </p>
  {/if}
</div>
