<script lang="ts">
  import type { ThothCard } from '../../types';
  import TarotCardView from '../TarotCardView.svelte';

  interface Props {
    cards: ThothCard[];
    onSelectCard?: (card: ThothCard) => void;
    class?: string;
    gridClass?: string;
  }

  let {
    cards,
    onSelectCard,
    class: className = '',
    gridClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5',
  }: Props = $props();
</script>

<div class="grid justify-items-center {gridClass} {className}">
  {#each cards as card (card.id)}
    <div class="transition-all duration-200 ease-out">
      <TarotCardView
        {card}
        displayMode="thoth"
        size="lg"
        showDetailsOnClick={true}
        onSelect={onSelectCard ? () => onSelectCard(card) : undefined}
      />
    </div>
  {/each}
</div>
