import { useState, useCallback } from 'react';
import { ThothCard, ThothReading, SpreadStep } from '../types';
import { THOTH_DECK } from '../data/thothCards';
import { shuffleDeck, cutDeckIntoFourPiles, FourPilesCut, calculateThothCountingSpread } from '../utils/thothSpread';

export const useReadingStudioWizard = () => {
  // Wizard Step State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(1);

  const goToStep = useCallback((stepNumber: number) => {
    setWizardStep(stepNumber);
    setMaxVisitedStep((prev) => Math.max(prev, stepNumber));
  }, []);

  // Inquiry & Config State
  const [question, setQuestion] = useState('');
  const [step1Phase, setStep1Phase] = useState<'question' | 'significator'>('question');
  const [deckNote, setDeckNote] = useState('');
  const [aiStyle, setAiStyle] = useState<'crowleyan' | 'alchemical' | 'orphic' | 'enochian'>('crowleyan');

  const [deck, setDeck] = useState<ThothCard[]>(THOTH_DECK);
  const [shuffleCount, setShuffleCount] = useState<number>(0);

  // Spread Mode: 'auto' | 'manual'
  const [spreadMode, setSpreadMode] = useState<'auto' | 'manual'>('auto');

  // Auto Spread State
  const [startCardId, setStartCardId] = useState<string>('atu-00');
  const [fourPilesCut, setFourPilesCut] = useState<FourPilesCut | null>(null);
  const [selectedPileId, setSelectedPileId] = useState<string | null>(null);
  const [selectedSignificatorId, setSelectedSignificatorId] = useState<string | null>(null);

  const [currentSpread, setCurrentSpread] = useState<{
    pulledCards: ThothCard[];
    steps: SpreadStep[];
    terminalCard: ThothCard;
  } | null>(null);

  // Manual Punch-in card stack
  const [manualPulledCards, setManualPulledCards] = useState<ThothCard[]>([]);

  // AI Transmutation Processing State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiProcessingPhase, setAiProcessingPhase] = useState<number>(0);
  const [aiError, setAiError] = useState<string | null>(null);

  // Handle Shuffle
  const handleShuffle = useCallback(() => {
    const newDeck = shuffleDeck(THOTH_DECK);
    setDeck(newDeck);
    setShuffleCount((prev) => prev + 1);
    setStartCardId(newDeck[0].id);
    setCurrentSpread(null);
    setFourPilesCut(null);
    setSelectedPileId(null);
  }, []);

  const handleResetDeck = useCallback(() => {
    setDeck(THOTH_DECK);
    setShuffleCount(0);
    setStartCardId('atu-00');
    setCurrentSpread(null);
    setFourPilesCut(null);
    setSelectedPileId(null);
    setSelectedSignificatorId(null);
  }, []);

  // Perform Tetragrammaton 4-Pile Cut
  const handlePerformFourPilesCut = useCallback(() => {
    const cutResult = cutDeckIntoFourPiles(deck);
    setFourPilesCut(cutResult);
    setSelectedPileId(cutResult.piles[0].id);
    if (!selectedSignificatorId && cutResult.piles[0].cards.length > 0) {
      setSelectedSignificatorId(cutResult.piles[0].cards[0].id);
    }
  }, [deck, selectedSignificatorId]);

  // Run Auto Counting Loop from selected start card / significator
  const handleRunAutoSpread = useCallback((overrideCardId?: string) => {
    const chosenPile = fourPilesCut?.piles.find((p) => p.id === selectedPileId);
    const targetCards = chosenPile && chosenPile.cards.length > 0 ? chosenPile.cards : deck;
    const targetId = overrideCardId || selectedSignificatorId || startCardId;

    let startIndex = targetCards.findIndex((c) => c.id === targetId);
    if (startIndex === -1) startIndex = 0;

    const result = calculateThothCountingSpread(startIndex, deck, chosenPile);

    setCurrentSpread({
      pulledCards: result.pulledCards,
      steps: result.steps,
      terminalCard: result.terminalCard,
    });

    // Advance to Review Spread Step!
    const reviewStepNum = spreadMode === 'auto' ? 6 : 4;
    goToStep(reviewStepNum);
  }, [deck, fourPilesCut, selectedPileId, selectedSignificatorId, startCardId, spreadMode, goToStep]);

  return {
    wizardStep,
    maxVisitedStep,
    goToStep,
    question,
    setQuestion,
    step1Phase,
    setStep1Phase,
    deckNote,
    setDeckNote,
    aiStyle,
    setAiStyle,
    deck,
    setDeck,
    shuffleCount,
    spreadMode,
    setSpreadMode,
    startCardId,
    setStartCardId,
    fourPilesCut,
    setFourPilesCut,
    selectedPileId,
    setSelectedPileId,
    selectedSignificatorId,
    setSelectedSignificatorId,
    currentSpread,
    setCurrentSpread,
    manualPulledCards,
    setManualPulledCards,
    isGeneratingAI,
    setIsGeneratingAI,
    aiProcessingPhase,
    setAiProcessingPhase,
    aiError,
    setAiError,
    handleShuffle,
    handleResetDeck,
    handlePerformFourPilesCut,
    handleRunAutoSpread,
  };
};
