<script lang="ts">
  import type { FourPilesCut } from '../utils/thothSpread';
  import type { ThothCard } from '../types';
  import { THOTH_DECK } from '../data/thothCards';
  import GlassContainer from './atoms/GlassContainer.svelte';
  import ElementalCutTracker from './organisms/ElementalCutTracker.svelte';
  import ElementalCutArena from './organisms/ElementalCutArena.svelte';
  import ElementalPilesResultGrid from './organisms/ElementalPilesResultGrid.svelte';
  import { ElementalCutMinigameState } from '../state/elementalCutState.svelte';

  interface Props {
    fourPilesCut: FourPilesCut;
    selectedPileId: string | null;
    onSelectPile: (pileId: string) => void;
    onNextStep: () => void;
    onBackToShuffle: () => void;
    onPerformCutAgain: () => void;
    deck?: ThothCard[];
    onCustomCutPiles?: (result: FourPilesCut) => void;
    selectedSignificatorId?: string | null;
  }

  let {
    fourPilesCut,
    selectedPileId,
    onSelectPile,
    onNextStep,
    onBackToShuffle,
    onPerformCutAgain,
    deck = THOTH_DECK,
    onCustomCutPiles,
    selectedSignificatorId,
  }: Props = $props();

  const minigame = new ElementalCutMinigameState();

  $effect(() => {
    minigame.startLoop();
    return () => minigame.stopLoop();
  });
</script>

<GlassContainer withOrnament={true} class="space-y-7">
  <div class="relative z-10 space-y-6">
    {#if minigame.cutStage !== 'done'}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-4">
          <ElementalCutTracker
            cutStage={minigame.cutStage}
            totalDeckCount={deck.length}
            stackACount={Math.round(deck.length * (minigame.cutStage > 1 ? minigame.ratio1 : 0.5))}
            stackBCount={deck.length - Math.round(deck.length * (minigame.cutStage > 1 ? minigame.ratio1 : 0.5))}
            yodCount={Math.round(deck.length * 0.25)}
            vauCount={Math.round(deck.length * 0.25)}
            hehCount={Math.round(deck.length * 0.25)}
            hehFinalCount={Math.round(deck.length * 0.25)}
          />
        </div>

        <div class="lg:col-span-8">
          <ElementalCutArena
            cutStage={minigame.cutStage}
            markerPos={minigame.markerPos}
            isCutMoving={minigame.isCutMoving}
            isSlicingAnimation={minigame.isSlicingAnimation}
            accuracyScore={85}
            accuracyBadge={{ label: 'BALANCED SACRED CUT', color: 'text-emerald-400' }}
            onExecuteCut={() => minigame.handleExecuteCut(deck, onCustomCutPiles)}
            onRestart={minigame.handleRestartMinigame}
            onAutoBypass={onPerformCutAgain}
          />
        </div>
      </div>
    {:else}
      <ElementalPilesResultGrid
        {fourPilesCut}
        {selectedPileId}
        {onSelectPile}
        {onNextStep}
        {onBackToShuffle}
        onPerformCutAgain={() => {
          minigame.handleRestartMinigame();
          onPerformCutAgain();
        }}
      />
    {/if}
  </div>
</GlassContainer>
