import { THOTH_DECK } from '../data/thothCards';
import type { ThothCard, ThothReading, SpreadStep } from '../types';
import { calculateThothCountingSpread, shuffleDeck, cutDeckIntoFourPiles, type FourPilesCut } from '../utils/thothSpread';

export type AIStyle = 'crowleyan' | 'alchemical' | 'orphic' | 'enochian';
export type SpreadMode = 'auto' | 'manual';

export class ReadingStudioState {
  wizardStep = $state<number>(1);
  maxVisitedStep = $state<number>(1);
  question = $state<string>('');
  deckNote = $state<string>('');
  aiStyle = $state<AIStyle>('crowleyan');

  deck = $state<ThothCard[]>(THOTH_DECK);
  shuffleCount = $state<number>(0);
  spreadMode = $state<SpreadMode>('auto');

  startCardId = $state<string>('atu-00');
  fourPilesCut = $state<FourPilesCut | null>(null);
  selectedPileId = $state<string | null>(null);
  selectedSignificatorId = $state<string | null>(null);

  currentSpread = $state<{
    pulledCards: ThothCard[];
    steps: SpreadStep[];
    terminalCard: ThothCard;
  } | null>(null);

  manualPulledCards = $state<ThothCard[]>([]);
  manualCardSearch = $state<string>('');
  isFullScreenPunchOpen = $state<boolean>(false);

  isGeneratingAI = $state<boolean>(false);
  aiProcessingPhase = $state<number>(0);
  aiError = $state<string | null>(null);

  goToStep(stepNumber: number) {
    this.wizardStep = stepNumber;
    this.maxVisitedStep = Math.max(this.maxVisitedStep, stepNumber);
  }

  handleShuffle() {
    const newDeck = shuffleDeck(THOTH_DECK);
    this.deck = newDeck;
    this.shuffleCount += 1;
    this.startCardId = newDeck[0].id;
    this.currentSpread = null;
    this.fourPilesCut = null;
    this.selectedPileId = null;
  }

  handleCutDeckIntoPiles() {
    const cutResult = cutDeckIntoFourPiles(this.deck);
    this.fourPilesCut = cutResult;
    this.selectedPileId = null;
  }

  handleSelectPile(pileId: string) {
    if (!this.fourPilesCut) return;
    this.selectedPileId = pileId;
    const chosenPile = this.fourPilesCut.piles.find((p) => p.id === pileId);
    if (chosenPile && chosenPile.cards.length > 0) {
      this.startCardId = chosenPile.cards[0].id;
    }
  }

  handleCalculateAutoSpread(customStartCardId?: string) {
    const startId = customStartCardId || this.startCardId;
    const spreadResult = calculateThothCountingSpread(this.deck, startId);
    this.currentSpread = spreadResult;
  }

  addManualCard(card: ThothCard) {
    if (!this.manualPulledCards.some((c) => c.id === card.id)) {
      this.manualPulledCards = [...this.manualPulledCards, card];
    }
  }

  removeManualCard(cardId: string) {
    this.manualPulledCards = this.manualPulledCards.filter((c) => c.id !== cardId);
  }

  clearManualCards() {
    this.manualPulledCards = [];
  }

  handleResetStudio() {
    this.question = '';
    this.deckNote = '';
    this.wizardStep = 1;
    this.maxVisitedStep = 1;
    this.deck = THOTH_DECK;
    this.shuffleCount = 0;
    this.fourPilesCut = null;
    this.selectedPileId = null;
    this.selectedSignificatorId = null;
    this.currentSpread = null;
    this.manualPulledCards = [];
    this.aiError = null;
  }

  async handleGenerateReading(onReadingCreated?: (reading: ThothReading) => void) {
    const activeCards =
      this.spreadMode === 'manual'
        ? this.manualPulledCards
        : this.currentSpread
        ? this.currentSpread.pulledCards
        : [];

    if (activeCards.length === 0) {
      this.aiError = 'Please select or pull cards before generating the reading report.';
      return;
    }

    this.isGeneratingAI = true;
    this.aiError = null;
    this.aiProcessingPhase = 1;

    const phaseTimer1 = setTimeout(() => (this.aiProcessingPhase = 2), 1200);
    const phaseTimer2 = setTimeout(() => (this.aiProcessingPhase = 3), 2800);

    try {
      const response = await fetch('/api/transmute-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: this.question || 'General Esoteric & Alchemical Life Path Reading',
          deckNote: this.deckNote,
          aiStyle: this.aiStyle,
          spreadMode: this.spreadMode,
          selectedSignificatorId: this.selectedSignificatorId,
          startCardId: this.startCardId,
          pulledCards: activeCards,
          spreadSteps: this.currentSpread ? this.currentSpread.steps : [],
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned error status ${response.status}`);
      }

      const data = await response.json();

      const newReading: ThothReading = {
        id: `reading-${Date.now()}`,
        timestamp: Date.now(),
        question: this.question || 'General Esoteric & Alchemical Life Path Reading',
        deckNote: this.deckNote || undefined,
        aiStyle: this.aiStyle,
        spreadMode: this.spreadMode,
        significatorCardId: this.selectedSignificatorId || undefined,
        startCardId: this.startCardId,
        pulledCards: activeCards,
        steps: this.currentSpread ? this.currentSpread.steps : [],
        aiInterpretation: data.interpretation,
        poeticNarrative: data.narrative,
      };

      if (onReadingCreated) {
        onReadingCreated(newReading);
      }

      return newReading;
    } catch (err: any) {
      console.error('Reading generation failed:', err);
      this.aiError = err.message || 'Failed to complete alchemical transmutation. Please check your connection.';
    } finally {
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      this.isGeneratingAI = false;
      this.aiProcessingPhase = 0;
    }
  }
}
