<script lang="ts">
  import type { ThothCard } from '../../types';
  import Badge from '../atoms/Badge.svelte';
  import { getThothCardImageUrl } from '../../utils/cardImageUrls';

  interface Props {
    card: ThothCard;
    onClick?: () => void;
    isSelected?: boolean;
    showDetails?: boolean;
  }

  let {
    card,
    onClick,
    isSelected = false,
    showDetails = true,
  }: Props = $props();

  let imageUrl = $derived(getThothCardImageUrl(card));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={onClick}
  class="group relative bg-[#0e0e11] p-3 rounded-sm border transition cursor-pointer flex flex-col justify-between {isSelected
    ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-lg ring-1 ring-[#c5a059]'
    : 'border-white/10 hover:border-[#c5a059]/60 hover:bg-[#121218]'}"
>
  <div>
    <div class="flex items-center justify-between gap-1 mb-2">
      <Badge variant={card.type === 'major' ? 'major' : card.type === 'court' ? 'court' : 'minor'}>
        {card.type === 'major' ? `ATU ${card.atuNumber ?? 0}` : card.suit || card.category}
      </Badge>
      {#if card.hebrewLetter}
        <span class="text-xs font-serif font-bold text-[#c5a059] bg-[#050505] px-1.5 py-0.5 rounded border border-[#c5a059]/30">
          {card.hebrewLetter.letter}
        </span>
      {/if}
    </div>

    <div class="aspect-[3/4] rounded-sm bg-[#050505] border border-white/5 overflow-hidden relative mb-2 flex items-center justify-center">
      {#if imageUrl}
        <img
          src={imageUrl}
          alt={card.name}
          referrerpolicy="no-referrer"
          class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      {:else}
        <div class="text-center p-2">
          <span class="atu-font text-stone-400 text-xs">{card.name}</span>
        </div>
      {/if}
    </div>

    <h4 class="atu-font text-sm font-bold text-stone-100 group-hover:text-[#c5a059] transition line-clamp-1">
      {card.name}
    </h4>
    <div class="text-[11px] font-mono text-[#c5a059] italic line-clamp-1">
      "{card.thothTitle}"
    </div>
  </div>

  {#if showDetails}
    <div class="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-stone-400">
      <span>{card.astrology?.name || card.alchemy.element}</span>
      <span class="text-stone-300">{card.treeOfLife.sephiraOrPath}</span>
    </div>
  {/if}
</div>
