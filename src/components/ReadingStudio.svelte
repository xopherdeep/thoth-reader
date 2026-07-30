<script lang="ts">
  import type { ThothReading } from '../types';
  import { ReadingStudioState } from '../state/readingStudioState.svelte';
  import WizardStepper, { type WizardStepInfo } from './WizardStepper.svelte';
  import WizardStepInquiry from './organisms/WizardStepInquiry.svelte';
  import WizardStepSpreadMethod from './organisms/WizardStepSpreadMethod.svelte';
  import WizardStepManualPunch from './organisms/WizardStepManualPunch.svelte';
  import DeckShuffleVisual from './DeckShuffleVisual.svelte';
  import FourElementalPilesView from './FourElementalPilesView.svelte';
  import SignificatorSelectionView from './SignificatorSelectionView.svelte';
  import TarotCardView from './TarotCardView.svelte';
  import FullScreenManualPunchModal from './FullScreenManualPunchModal.svelte';
  import {
    BookOpen,
    Zap,
    Shuffle,
    Layers,
    Compass,
    CheckCircle2,
    Loader2,
    ArrowRight,
    ArrowLeft,
  } from 'lucide-react';

  interface Props {
    onReadingCreated: (reading: ThothReading) => void;
  }

  let { onReadingCreated }: Props = $props();

  const studio = new ReadingStudioState();
  let step1Phase = $state<'question' | 'significator'>('question');

  const wizardSteps: WizardStepInfo[] = [
    { number: 1, title: 'Inquiry & Intention', icon: BookOpen },
    { number: 2, title: 'Spread Mode', icon: Zap },
    { number: 3, title: 'Deck Shuffle', icon: Shuffle },
    { number: 4, title: 'Elemental Cut', icon: Layers },
    { number: 5, title: 'Significator Anchor', icon: Compass },
    { number: 6, title: 'Spread Review', icon: CheckCircle2 },
    { number: 7, title: 'Oracle Report', icon: Loader2 },
  ];

  let activePulledCards = $derived(
    studio.spreadMode === 'auto'
      ? studio.currentSpread?.pulledCards || []
      : studio.manualPulledCards
  );

  async function handleCreateReading() {
    const reading = await studio.handleGenerateReading(onReadingCreated);
  }
</script>

<div class="space-y-8">
  <WizardStepper
    steps={wizardSteps}
    currentStep={studio.wizardStep}
    maxVisitedStep={studio.maxVisitedStep}
    onStepClick={(step) => studio.goToStep(step)}
    isGeneratingAI={studio.isGeneratingAI}
  />

  {#if studio.wizardStep === 1}
    <WizardStepInquiry
      totalSteps={7}
      question={studio.question}
      setQuestion={(q) => (studio.question = q)}
      {step1Phase}
      setStep1Phase={(p) => (step1Phase = p)}
      deck={studio.deck}
      selectedSignificatorId={studio.selectedSignificatorId}
      setSelectedSignificatorId={(id) => (studio.selectedSignificatorId = id)}
      onNextStep={() => studio.goToStep(2)}
    />
  {:else if studio.wizardStep === 2}
    <WizardStepSpreadMethod
      totalSteps={7}
      spreadMode={studio.spreadMode}
      setSpreadMode={(m) => (studio.spreadMode = m)}
      onBack={() => studio.goToStep(1)}
      onNext={() => studio.goToStep(studio.spreadMode === 'auto' ? 3 : 3)}
    />
  {:else if studio.wizardStep === 3 && studio.spreadMode === 'auto'}
    <DeckShuffleVisual
      deck={studio.deck}
      shuffleCount={studio.shuffleCount}
      onShuffle={() => studio.handleShuffle()}
      onReset={() => studio.handleResetStudio()}
      onNextStep={() => {
        studio.handleCutDeckIntoPiles();
        studio.goToStep(4);
      }}
    />
  {:else if studio.wizardStep === 3 && studio.spreadMode === 'manual'}
    <WizardStepManualPunch
      totalSteps={5}
      manualPulledCards={studio.manualPulledCards}
      manualCardSearch={studio.manualCardSearch}
      setManualCardSearch={(q) => (studio.manualCardSearch = q)}
      onAddManualCard={(c) => studio.addManualCard(c)}
      onRemoveManualCard={(idx) => {
        const c = studio.manualPulledCards[idx];
        if (c) studio.removeManualCard(c.id);
      }}
      onClearSequence={() => studio.clearManualCards()}
      onOpenFullScreenPunch={() => (studio.isFullScreenPunchOpen = true)}
      onBack={() => studio.goToStep(2)}
      onNext={() => studio.goToStep(4)}
    />
  {:else if studio.wizardStep === 4 && studio.spreadMode === 'auto'}
    {#if studio.fourPilesCut}
      <FourElementalPilesView
        fourPilesCut={studio.fourPilesCut}
        selectedPileId={studio.selectedPileId}
        onSelectPile={(id) => studio.handleSelectPile(id)}
        onNextStep={() => studio.goToStep(5)}
        onBackToShuffle={() => studio.goToStep(3)}
        onPerformCutAgain={() => studio.handleCutDeckIntoPiles()}
        deck={studio.deck}
      />
    {/if}
  {:else if studio.wizardStep === 5 && studio.spreadMode === 'auto'}
    {#if studio.fourPilesCut}
      {@const pile = studio.fourPilesCut.piles.find((p) => p.id === studio.selectedPileId) || studio.fourPilesCut.piles[0]}
      <SignificatorSelectionView
        selectedPile={pile}
        selectedSignificatorId={studio.selectedSignificatorId}
        onSelectSignificator={(id) => (studio.selectedSignificatorId = id)}
        onRunSpread={(id) => {
          studio.handleCalculateAutoSpread(id);
          studio.goToStep(6);
        }}
        onChangePileStep={() => studio.goToStep(4)}
      />
    {/if}
  {:else if (studio.wizardStep === 6 && studio.spreadMode === 'auto') || (studio.wizardStep === 4 && studio.spreadMode === 'manual')}
    <div class="bg-[#0e0e11] border border-[#c5a059]/40 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span class="text-xs font-mono text-[#c5a059] uppercase tracking-widest block mb-1">
            Spread Review ({activePulledCards.length} Cards)
          </span>
          <h2 class="atu-font text-2xl font-bold text-stone-100 tracking-wide">
            Review Generated Thoth Spread
          </h2>
        </div>

        <button
          onclick={handleCreateReading}
          disabled={studio.isGeneratingAI}
          class="px-6 py-3 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-stone-950 font-mono font-bold text-xs uppercase tracking-widest rounded-sm shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {#if studio.isGeneratingAI}
            <Loader2 class="w-4 h-4 animate-spin" />
            <span>Transmuting Reading...</span>
          {:else}
            <Sparkles class="w-4 h-4" />
            <span>Generate Alchemical Oracle Report</span>
          {/if}
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
        {#each activePulledCards as card, idx (card.id)}
          <TarotCardView {card} displayMode="thoth" size="md" stepNumber={idx + 1} />
        {/each}
      </div>
    </div>
  {/if}

  <FullScreenManualPunchModal
    isOpen={studio.isFullScreenPunchOpen}
    onClose={() => (studio.isFullScreenPunchOpen = false)}
    allCards={studio.deck}
    pulledCards={studio.manualPulledCards}
    onAddCard={(c) => studio.addManualCard(c)}
    onRemoveCard={(idx) => {
      const c = studio.manualPulledCards[idx];
      if (c) studio.removeManualCard(c.id);
    }}
    onClearSequence={() => studio.clearManualCards()}
    onFinishAndInterpret={() => {
      studio.isFullScreenPunchOpen = false;
      studio.goToStep(4);
    }}
  />
</div>
