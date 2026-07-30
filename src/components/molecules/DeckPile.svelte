<script lang="ts">
  import CardBack from '../atoms/CardBack.svelte';

  interface Props {
    id: string;
    name: string;
    tetragrammaton: string;
    element: string;
    cardCount: number;
    isSelected?: boolean;
    onClick?: () => void;
  }

  let {
    id,
    name,
    tetragrammaton,
    element,
    cardCount,
    isSelected = false,
    onClick,
  }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={onClick}
  class="group relative bg-[#0e0e11] p-4 rounded-sm border transition cursor-pointer flex flex-col items-center justify-between text-center space-y-3 {isSelected
    ? 'border-[#c5a059] bg-[#c5a059]/15 shadow-xl ring-2 ring-[#c5a059]'
    : 'border-white/10 hover:border-[#c5a059]/60 hover:bg-[#121218]'}"
>
  <div class="w-full flex items-center justify-between font-mono text-[10px]">
    <span class="text-[#c5a059] font-bold uppercase bg-[#050505] px-2 py-0.5 rounded border border-[#c5a059]/30">
      {tetragrammaton}
    </span>
    <span class="text-stone-400">{element}</span>
  </div>

  <div class="relative my-2">
    <div class="absolute top-1 left-1 w-20 h-32 bg-[#050505] border border-white/10 rounded-sm"></div>
    <div class="absolute top-0.5 left-0.5 w-20 h-32 bg-[#08080c] border border-white/20 rounded-sm"></div>
    <CardBack size="sm" class="w-20 h-32 relative z-10" />
  </div>

  <div>
    <h4 class="atu-font text-sm font-bold text-stone-100 group-hover:text-[#c5a059]">
      {name}
    </h4>
    <div class="text-[11px] font-mono text-stone-400">{cardCount} Cards</div>
  </div>
</div>
