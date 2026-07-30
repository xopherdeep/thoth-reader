import { useState, useCallback } from 'react';
import { THOTH_DECK } from '../data/thothCards';
import { ThothCard, ThothReading, SpreadStep } from '../types';
import { calculateThothCountingSpread, shuffleDeck, cutDeckIntoFourPiles, FourPilesCut } from '../utils/thothSpread';

export type AIStyle = 'crowleyan' | 'alchemical' | 'orphic' | 'enochian';
export type SpreadMode = 'auto' | 'manual';

export interface UseThothReadingStudioOptions {
  onReadingCreated?: (reading: ThothReading) => void;
}

/**
 * Universal TypeScript Hook for managing the Thoth Reading lifecycle.
 * Framework-agnostic logic layer adaptable to any JS framework (React, Vue, Svelte, etc.).
 */
export function useThothReadingStudio(options: UseThothReadingStudioOptions = {}) {
  // Wizard Navigation
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(1);

  const goToStep = useCallback((stepNumber: number) => {
    setWizardStep(stepNumber);
    setMaxVisitedStep((prev) => Math.max(prev, stepNumber));
  }, []);

  // Inquiry Settings
  const [question, setQuestion] = useState<string>('');
  const [deckNote, setDeckNote] = useState<string>('');
  const [aiStyle, setAiStyle] = useState<AIStyle>('crowleyan');

  // Deck State
  const [deck, setDeck] = useState<ThothCard[]>(THOTH_DECK);
  const [shuffleCount, setShuffleCount] = useState<number>(0);
  const [spreadMode, setSpreadMode] = useState<SpreadMode>('auto');

  // Auto Spread Cut & Selection
  const [startCardId, setStartCardId] = useState<string>('atu-00');
  const [fourPilesCut, setFourPilesCut] = useState<FourPilesCut | null>(null);
  const [selectedPileId, setSelectedPileId] = useState<string | null>(null);
  const [selectedSignificatorId, setSelectedSignificatorId] = useState<string | null>(null);

  const [currentSpread, setCurrentSpread] = useState<{
    pulledCards: ThothCard[];
    steps: SpreadStep[];
    terminalCard: ThothCard;
  } | null>(null);

  // Manual Punch-In
  const [manualPulledCards, setManualPulledCards] = useState<ThothCard[]>([]);
  const [manualCardSearch, setManualCardSearch] = useState<string>('');
  const [isFullScreenPunchOpen, setIsFullScreenPunchOpen] = useState<boolean>(false);

  // AI Generation State
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiProcessingPhase, setAiProcessingPhase] = useState<number>(0);
  const [aiError, setAiError] = useState<string | null>(null);

  // Shuffle Deck
  const handleShuffle = useCallback(() => {
    const newDeck = shuffleDeck(THOTH_DECK);
    setDeck(newDeck);
    setShuffleCount((prev) => prev + 1);
    setStartCardId(newDeck[0].id);
    setCurrentSpread(null);
    setFourPilesCut(null);
    setSelectedPileId(null);
    setSelectedSignificatorId(null);
  }, []);

  // Perform Four Piles Cut
  const handleCutDeckIntoPiles = useCallback(() => {
    const cutResult = cutDeckIntoFourPiles(deck);
    setFourPilesCut(cutResult);
    setSelectedPileId(null);
  }, [deck]);

  // Select Cut Pile
  const handleSelectPile = useCallback(
    (pileId: string) => {
      if (!fourPilesCut) return;
      setSelectedPileId(pileId);
      const chosenPile = fourPilesCut.piles.find((p) => p.id === pileId);
      if (chosenPile && chosenPile.cards.length > 0) {
        setStartCardId(chosenPile.cards[0].id);
      }
    },
    [fourPilesCut]
  );

  // Calculate Auto Spread
  const handleCalculateAutoSpread = useCallback(
    (customStartCardId?: string) => {
      const startId = customStartCardId || startCardId;
      const spreadResult = calculateThothCountingSpread(deck, startId);
      setCurrentSpread(spreadResult);
    },
    [deck, startCardId]
  );

  // Manual Card Selection
  const addManualCard = useCallback((card: ThothCard) => {
    setManualPulledCards((prev) => {
      if (prev.some((c) => c.id === card.id)) return prev;
      return [...prev, card];
    });
  }, []);

  const removeManualCard = useCallback((cardId: string) => {
    setManualPulledCards((prev) => prev.filter((c) => c.id !== cardId));
  }, []);

  const clearManualCards = useCallback(() => {
    setManualPulledCards([]);
  }, []);

  // Reset Studio
  const handleResetStudio = useCallback(() => {
    setQuestion('');
    setDeckNote('');
    setWizardStep(1);
    setMaxVisitedStep(1);
    setDeck(THOTH_DECK);
    setShuffleCount(0);
    setFourPilesCut(null);
    setSelectedPileId(null);
    setSelectedSignificatorId(null);
    setCurrentSpread(null);
    setManualPulledCards([]);
    setAiError(null);
  }, []);

  // Generate Reading via API
  const handleGenerateReading = useCallback(async () => {
    const activeCards =
      spreadMode === 'manual'
        ? manualPulledCards
        : currentSpread
        ? currentSpread.pulledCards
        : [];

    if (activeCards.length === 0) {
      setAiError('Please select or pull cards before generating the reading report.');
      return;
    }

    setIsGeneratingAI(true);
    setAiError(null);
    setAiProcessingPhase(1);

    const phaseTimer1 = setTimeout(() => setAiProcessingPhase(2), 1200);
    const phaseTimer2 = setTimeout(() => setAiProcessingPhase(3), 2800);

    try {
      const response = await fetch('/api/transmute-reading', {
        method: 'POST',
        headers: { 'Content-[#Type]': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question || 'General Esoteric & Alchemical Life Path Reading',
          deckNote,
          aiStyle,
          spreadMode,
          selectedSignificatorId,
          startCardId,
          pulledCards: activeCards,
          spreadSteps: currentSpread ? currentSpread.steps : [],
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
        question: question || 'General Esoteric & Alchemical Life Path Reading',
        deckNote: deckNote || undefined,
        aiStyle,
        spreadMode,
        significatorCardId: selectedSignificatorId || undefined,
        startCardId,
        pulledCards: activeCards,
        steps: currentSpread ? currentSpread.steps : [],
        aiInterpretation: data.interpretation,
        poeticNarrative: data.narrative,
      };

      if (options.onReadingCreated) {
        options.onReadingCreated(newReading);
      }

      return newReading;
    } catch (err: any) {
      console.error('Reading generation failed:', err);
      setAiError(err.message || 'Failed to complete alchemical transmutation. Please check your connection.');
    } finally {
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      setIsGeneratingAI(false);
      setAiProcessingPhase(0);
    }
  }, [
    spreadMode,
    manualPulledCards,
    currentSpread,
    question,
    deckNote,
    aiStyle,
    selectedSignificatorId,
    startCardId,
    options,
  ]);

  return {
    wizardStep,
    maxVisitedStep,
    goToStep,
    question,
    setQuestion,
    deckNote,
    setDeckNote,
    aiStyle,
    setAiStyle,
    deck,
    shuffleCount,
    handleShuffle,
    spreadMode,
    setSpreadMode,
    startCardId,
    setStartCardId,
    fourPilesCut,
    handleCutDeckIntoPiles,
    selectedPileId,
    handleSelectPile,
    selectedSignificatorId,
    setSelectedSignificatorId,
    currentSpread,
    handleCalculateAutoSpread,
    manualPulledCards,
    addManualCard,
    removeManualCard,
    clearManualCards,
    manualCardSearch,
    setManualCardSearch,
    isFullScreenPunchOpen,
    setIsFullScreenPunchOpen,
    isGeneratingAI,
    aiProcessingPhase,
    aiError,
    handleGenerateReading,
    handleResetStudio,
  };
}
