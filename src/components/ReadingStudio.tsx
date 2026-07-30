import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THOTH_DECK } from '../data/thothCards';
import { ThothCard, ThothReading, SpreadStep } from '../types';
import { calculateThothCountingSpread, shuffleDeck, cutDeckIntoFourPiles, FourPilesCut } from '../utils/thothSpread';
import { TarotCardView } from './TarotCardView';
import { FourElementalPilesView } from './FourElementalPilesView';
import { SignificatorSelectionView } from './SignificatorSelectionView';
import { FullScreenManualPunchModal } from './FullScreenManualPunchModal';
import { SynchronicityAnalysisView } from './SynchronicityAnalysisView';
import { DeckShuffleVisual } from './DeckShuffleVisual';
import { WizardStepper } from './WizardStepper';
import {
  Sparkles,
  Shuffle,
  Play,
  RotateCcw,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Flame,
  Search,
  BookOpen,
  Maximize2,
  Layers,
  Trash2,
  Feather,
  Compass,
  Check,
  Zap,
  Eye,
  PenLine,
  Quote,
} from 'lucide-react';

interface ReadingStudioProps {
  onReadingCreated: (reading: ThothReading) => void;
}

export const ReadingStudio: React.FC<ReadingStudioProps> = ({ onReadingCreated }) => {
  // Wizard Step State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(1);

  const goToStep = (stepNumber: number) => {
    setWizardStep(stepNumber);
    setMaxVisitedStep((prev) => Math.max(prev, stepNumber));
  };

  // Inquiry & Config State
  const [question, setQuestion] = useState('');
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
  const [manualCardSearch, setManualCardSearch] = useState('');
  const [isFullScreenPunchOpen, setIsFullScreenPunchOpen] = useState(false);

  // AI Transmutation Processing State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiProcessingPhase, setAiProcessingPhase] = useState<number>(0);
  const [aiError, setAiError] = useState<string | null>(null);

  // Quick Prompt Chips
  const promptSuggestions = [
    'What alchemical transformation is required for my career path right now?',
    'What guidance does the Book of Thoth hold for my spiritual awakening?',
    'How can I integrate my shadow aspect in my personal relationships?',
    'What hidden forces are at play in my current life direction?',
  ];

  // Handle Shuffle
  const handleShuffle = () => {
    const newDeck = shuffleDeck(THOTH_DECK);
    setDeck(newDeck);
    setShuffleCount((prev) => prev + 1);
    setStartCardId(newDeck[0].id);
    setCurrentSpread(null);
    setFourPilesCut(null);
    setSelectedPileId(null);
    setSelectedSignificatorId(null);
  };

  const handleResetDeck = () => {
    setDeck(THOTH_DECK);
    setShuffleCount(0);
    setStartCardId('atu-00');
    setCurrentSpread(null);
    setFourPilesCut(null);
    setSelectedPileId(null);
    setSelectedSignificatorId(null);
  };

  // Perform Tetragrammaton 4-Pile Cut
  const handlePerformFourPilesCut = () => {
    const cutResult = cutDeckIntoFourPiles(deck);
    setFourPilesCut(cutResult);
    setSelectedPileId(cutResult.piles[0].id);
    const firstCardInPile = cutResult.piles[0].cards[0];
    if (firstCardInPile) {
      setSelectedSignificatorId(firstCardInPile.id);
    }
  };

  // Run Auto Counting Loop from selected start card / significator
  const handleRunAutoSpread = (overrideCardId?: string) => {
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
  };

  // Manual Card Punch-in handlers
  const handleAddManualCard = (card: ThothCard) => {
    if (manualPulledCards.some((c) => c.id === card.id)) return;
    setManualPulledCards((prev) => [...prev, card]);
  };

  const handleRemoveManualCard = (index: number) => {
    setManualPulledCards((prev) => prev.filter((_, i) => i !== index));
  };

  // Compute active cards for reading creation
  const activePulledCards = spreadMode === 'auto' ? currentSpread?.pulledCards || [] : manualPulledCards;
  const activeSteps = currentSpread?.steps || [];

  // Execute AI Reading Synthesis
  const executeAISynthesis = async () => {
    if (activePulledCards.length === 0) {
      alert('Please select or punch in at least 1 card for the reading sequence first.');
      return;
    }

    const aiStepNum = spreadMode === 'auto' ? 7 : 5;
    goToStep(aiStepNum);
    setIsGeneratingAI(true);
    setAiError(null);
    setAiProcessingPhase(1);

    // Simulate animated loading progress steps
    const timer1 = setTimeout(() => setAiProcessingPhase(2), 800);
    const timer2 = setTimeout(() => setAiProcessingPhase(3), 1600);
    const timer3 = setTimeout(() => setAiProcessingPhase(4), 2400);

    try {
      const response = await fetch('/api/reading/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim() || 'What guidance does the Book of Thoth hold for the querent?',
          pulledCards: activePulledCards,
          countingLog: activeSteps,
          deckNote,
          aiStyle,
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        if (responseText.includes('<!doctype') || responseText.includes('<html')) {
          throw new Error('Server returned an invalid HTML response instead of JSON. Please check server connection.');
        }
        throw new Error(`Invalid server response (${response.status}): ${responseText.slice(0, 100)}`);
      }

      if (!response.ok || !data.success || !data.interpretation) {
        throw new Error(data.error || `Failed to generate AI interpretation (HTTP ${response.status}).`);
      }

      setAiProcessingPhase(5);

      const newReading: ThothReading = {
        id: 'reading-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toISOString(),
        question: question.trim() || 'Thoth Numerological Reading',
        pulledCards: activePulledCards,
        countingLog: activeSteps,
        aiInterpretation: data.interpretation,
        deckNote,
      };

      // Store in backend server
      fetch('/api/readings/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newReading.id, readingData: newReading }),
      }).catch((e) => console.warn('Could not store reading in backend server:', e));

      setTimeout(() => {
        setIsGeneratingAI(false);
        onReadingCreated(newReading);
      }, 1000);
    } catch (err: any) {
      console.error('Reading interpretation error:', err);
      setAiError(err.message || 'An error occurred while generating the reading interpretation.');
      setIsGeneratingAI(false);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    }
  };

  // Manual search filtered list
  const filteredManualCards = useMemo(() => {
    if (!manualCardSearch) return THOTH_DECK;
    return THOTH_DECK.filter(
      (c) =>
        c.name.toLowerCase().includes(manualCardSearch.toLowerCase()) ||
        c.thothTitle.toLowerCase().includes(manualCardSearch.toLowerCase())
    );
  }, [manualCardSearch]);

  // Active pile helper for 4-pile cut
  const activePile = fourPilesCut?.piles.find((p) => p.id === selectedPileId) || fourPilesCut?.piles[0];

  // Step indicator steps definition based on spread mode
  const wizardStepsInfo =
    spreadMode === 'auto'
      ? [
          { number: 1, title: 'Inquiry Intention', icon: HelpCircle },
          { number: 2, title: 'Spread Method', icon: Zap },
          { number: 3, title: 'Shuffle Deck', icon: Shuffle },
          { number: 4, title: 'Cut 4 Piles', icon: Flame },
          { number: 5, title: 'Pick Significator', icon: Compass },
          { number: 6, title: 'Review & AI Style', icon: Layers },
          { number: 7, title: 'AI Transmutation', icon: Sparkles },
        ]
      : [
          { number: 1, title: 'Inquiry Intention', icon: HelpCircle },
          { number: 2, title: 'Spread Method', icon: Zap },
          { number: 3, title: 'Punch Cards', icon: Layers },
          { number: 4, title: 'Review & AI Style', icon: Layers },
          { number: 5, title: 'AI Transmutation', icon: Sparkles },
        ];

  const totalSteps = wizardStepsInfo.length;

  return (
    <div className="space-y-6">
      {/* WIZARD PROGRESS STEPPER COMPONENT */}
      <WizardStepper
        steps={wizardStepsInfo}
        currentStep={wizardStep}
        maxVisitedStep={maxVisitedStep}
        onStepClick={(stepNum) => goToStep(stepNum)}
        isGeneratingAI={isGeneratingAI}
      />

      {/* WIZARD STEP ANIMATED CONTAINER */}
      <AnimatePresence mode="wait">
        {/* STEP 1: INQUIRY INTENTION */}
        {wizardStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#0a0a0e]/95 backdrop-blur-2xl border border-[#c5a059]/20 rounded-2xl p-7 sm:p-10 shadow-[0_16px_60px_rgba(0,0,0,0.9),_0_0_0_1px_rgba(197,160,89,0.08)] overflow-hidden corner-ornament"
          >
            {/* ── Ambient Background Layers ── */}
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none animate-ambient-pulse" style={{ background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.12) 0%, rgba(197,160,89,0.03) 50%, transparent 70%)' }} />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-[80px] pointer-events-none animate-ambient-pulse" style={{ background: 'radial-gradient(ellipse at center, rgba(147,110,45,0.08) 0%, transparent 70%)', animationDelay: '3s' }} />

            {/* ── Decorative Sigil Cross ── */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.025] animate-gentle-float">
              <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="150" cy="150" r="140" stroke="#c5a059" strokeWidth="0.5" />
                <circle cx="150" cy="150" r="100" stroke="#c5a059" strokeWidth="0.3" />
                <line x1="150" y1="10" x2="150" y2="290" stroke="#c5a059" strokeWidth="0.3" />
                <line x1="10" y1="150" x2="290" y2="150" stroke="#c5a059" strokeWidth="0.3" />
                <line x1="44" y1="44" x2="256" y2="256" stroke="#c5a059" strokeWidth="0.2" />
                <line x1="256" y1="44" x2="44" y2="256" stroke="#c5a059" strokeWidth="0.2" />
              </svg>
            </div>

            {/* ── Content Stack with Staggered Entrance ── */}
            <div className="relative z-10 stagger-fade-up space-y-8">

              {/* HEADER SECTION */}
              <div className="space-y-4">
                {/* Step Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/12 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/25 shadow-[0_0_16px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Step 1 of {totalSteps}</span>
                  <span className="w-1 h-1 rounded-full bg-[#c5a059]/60" />
                  <span>Set Your Narrative Intention</span>
                </motion.div>

                {/* Main Title */}
                <h2 className="atu-font text-2xl sm:text-[2rem] font-extrabold tracking-wide leading-[1.15]">
                  <span className="bg-gradient-to-br from-[#f5ecd4] via-[#c5a059] to-[#8a6520] bg-clip-text text-transparent animate-shimmer" style={{ backgroundImage: 'linear-gradient(105deg, #f5ecd4 0%, #c5a059 30%, #d6b77b 50%, #c5a059 70%, #8a6520 100%)' }}>
                    Write Your Chapter:
                  </span>
                  <br />
                  <span className="text-stone-100/90 text-xl sm:text-2xl font-bold">
                    What Question Do You Bring to the Book?
                  </span>
                </h2>

                {/* Lore Subtitle */}
                <p className="text-[13px] sm:text-sm text-stone-400 font-serif leading-[1.7] max-w-2xl">
                  The Book of Thoth speaks in timeless parables, unfolding a narrative through archetypes, symbols, and trials. The cards you pull weave the narrative arc of your query. By bringing your question into this symbolic journey, you can view your situation as a personal parable, illuminated by profound self-insight.
                </p>

                {/* Animated Divider */}
                <div className="animate-line-reveal h-px bg-gradient-to-r from-[#c5a059]/40 via-[#c5a059]/15 to-transparent" />
              </div>

              {/* ── QUESTION INPUT SECTION ── */}
              <div className="space-y-4">
                {/* Label Row */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 text-xs font-mono text-stone-200/90 uppercase tracking-[0.12em] font-semibold">
                    <div className="w-6 h-6 rounded-md bg-[#c5a059]/10 border border-[#c5a059]/25 flex items-center justify-center">
                      <PenLine className="w-3.5 h-3.5 text-[#c5a059]" />
                    </div>
                    <span>Querent's Question / Focus Intention</span>
                  </label>
                  {question && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setQuestion('')}
                      className="text-[10px] font-mono text-stone-500 hover:text-[#c5a059] transition-all duration-200 flex items-center gap-1.5 bg-white/[0.03] hover:bg-[#c5a059]/10 px-2.5 py-1 rounded-md border border-white/8 hover:border-[#c5a059]/30"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </motion.button>
                  )}
                </div>

                {/* Textarea with Ambient Glow */}
                <div className="relative group/input">
                  {/* Outer glow halo on focus */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#c5a059]/20 via-[#d6b77b]/15 to-[#936e2d]/20 rounded-2xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="wizard-textarea-glow relative bg-[#050508]/95 border border-white/10 group-focus-within/input:border-[#c5a059]/60 rounded-xl transition-all duration-300 overflow-hidden">
                    <div className="flex items-start">
                      <div className="pl-4 pt-4 shrink-0 transition-colors duration-200 text-stone-600 group-focus-within/input:text-[#c5a059]">
                        <Eye className="w-5 h-5" />
                      </div>
                      <textarea
                        rows={3}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., What alchemical transformation is required for my creative path right now?"
                        className="w-full bg-transparent pl-3 pr-5 py-4 text-stone-100 placeholder-stone-600 text-sm outline-none font-sans italic resize-none leading-relaxed"
                      />
                    </div>
                    {/* Bottom accent bar */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Character indicator */}
                  {question.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-2 right-3 text-[10px] font-mono text-stone-600"
                    >
                      {question.length} chars
                    </motion.div>
                  )}
                </div>

                {/* ── QUICK INQUIRY SUGGESTIONS ── */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 uppercase tracking-[0.12em]">
                    <Quote className="w-3.5 h-3.5 text-[#c5a059]/60" />
                    <span>Quick Inquiry Suggestions</span>
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-stone-600 normal-case tracking-normal text-[10px]">Click to set</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {promptSuggestions.map((prompt, idx) => {
                      const isSelected = question === prompt;
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.01, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setQuestion(prompt)}
                          className={`group/chip text-left text-[12.5px] p-3.5 rounded-xl border transition-all duration-250 flex items-start gap-3 ${
                            isSelected
                              ? 'bg-[#c5a059]/10 border-[#c5a059]/60 text-stone-100 shadow-[0_0_20px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-[#c5a059]/30'
                              : 'bg-[#08080c]/80 hover:bg-[#0e0e14] text-stone-400 hover:text-stone-200 border-white/[0.06] hover:border-[#c5a059]/30'
                          }`}
                        >
                          {/* Selection Indicator */}
                          <div
                            className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                              isSelected
                                ? 'bg-[#c5a059] text-stone-950 shadow-[0_0_8px_rgba(197,160,89,0.4)]'
                                : 'bg-white/[0.04] text-stone-500 border border-white/10 group-hover/chip:text-[#c5a059] group-hover/chip:border-[#c5a059]/30 group-hover/chip:bg-[#c5a059]/10'
                            }`}
                          >
                            {isSelected
                              ? <Check className="w-3 h-3 stroke-[3]" />
                              : <Compass className="w-3 h-3" />
                            }
                          </div>

                          <span className="italic font-sans leading-snug">
                            "{prompt}"
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── STEP 1 NAVIGATION FOOTER ── */}
              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between gap-4">
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-stone-500">
                  <Feather className="w-3.5 h-3.5 text-[#c5a059]/50" />
                  <span className="italic">Formulate your question to guide the cards</span>
                </div>

                <button
                  onClick={() => goToStep(2)}
                  className="ml-auto group relative px-7 py-4 bg-gradient-to-r from-[#c5a059] via-[#b89845] to-[#a37d35] hover:from-[#d6b77b] hover:via-[#c5a059] hover:to-[#b08940] text-stone-950 font-bold text-[11px] font-mono uppercase tracking-[0.15em] rounded-xl shadow-[0_4px_24px_rgba(197,160,89,0.2),_inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_32px_rgba(197,160,89,0.35)] flex items-center gap-3 transition-all duration-300 active:scale-[0.97] overflow-hidden animate-ring-pulse"
                >
                  {/* Shimmer sweep overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />

                  <span className="relative z-10">Next: Choose Spread Method</span>
                  <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: CHOOSE SPREAD METHOD */}
        {wizardStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#0a0a0e]/95 backdrop-blur-2xl border border-[#c5a059]/20 rounded-2xl p-7 sm:p-10 shadow-[0_16px_60px_rgba(0,0,0,0.9),_0_0_0_1px_rgba(197,160,89,0.08)] overflow-hidden corner-ornament"
          >
            {/* ── Ambient Background Layers ── */}
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none animate-ambient-pulse" style={{ background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.1) 0%, rgba(197,160,89,0.02) 50%, transparent 70%)' }} />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[80px] pointer-events-none animate-ambient-pulse" style={{ background: 'radial-gradient(ellipse at center, rgba(147,110,45,0.07) 0%, transparent 70%)', animationDelay: '3s' }} />

            {/* ── Decorative Sigil ── */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] animate-gentle-float">
              <svg width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="130" cy="130" r="120" stroke="#c5a059" strokeWidth="0.5" />
                <circle cx="130" cy="130" r="80" stroke="#c5a059" strokeWidth="0.3" />
                <circle cx="130" cy="130" r="40" stroke="#c5a059" strokeWidth="0.2" />
                <line x1="130" y1="10" x2="130" y2="250" stroke="#c5a059" strokeWidth="0.3" />
                <line x1="10" y1="130" x2="250" y2="130" stroke="#c5a059" strokeWidth="0.3" />
              </svg>
            </div>

            {/* ── Content Stack ── */}
            <div className="relative z-10 stagger-fade-up space-y-8">

              {/* HEADER SECTION */}
              <div className="space-y-4">
                {/* Step Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/12 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/25 shadow-[0_0_16px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Step 2 of {totalSteps}</span>
                  <span className="w-1 h-1 rounded-full bg-[#c5a059]/60" />
                  <span>Select Execution Method</span>
                </motion.div>

                {/* Main Title */}
                <h2 className="atu-font text-2xl sm:text-[2rem] font-extrabold tracking-wide leading-[1.15]">
                  <span className="bg-gradient-to-br from-[#f5ecd4] via-[#c5a059] to-[#8a6520] bg-clip-text text-transparent animate-shimmer" style={{ backgroundImage: 'linear-gradient(105deg, #f5ecd4 0%, #c5a059 30%, #d6b77b 50%, #c5a059 70%, #8a6520 100%)' }}>
                    How Will You Consult
                  </span>
                  <br />
                  <span className="text-stone-100/90 text-xl sm:text-2xl font-bold">
                    the Book of Thoth?
                  </span>
                </h2>

                {/* Subtitle */}
                <p className="text-[13px] sm:text-sm text-stone-400 font-serif leading-[1.7] max-w-2xl">
                  Choose between the automated Golden Dawn counting loop ritual or manually entering cards drawn from your physical deck.
                </p>

                {/* Animated Divider */}
                <div className="animate-line-reveal h-px bg-gradient-to-r from-[#c5a059]/40 via-[#c5a059]/15 to-transparent" />
              </div>

              {/* ── SPREAD METHOD SELECTOR CARDS ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Method A: Automatic Thoth Counting Spread */}
                <motion.div
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSpreadMode('auto')}
                  className={`group/card relative p-6 sm:p-7 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden ${
                    spreadMode === 'auto'
                      ? 'bg-[#0e0e14]/90 border-[#c5a059]/60 ring-1 ring-[#c5a059]/30 shadow-[0_0_30px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.04)]'
                      : 'bg-[#08080c]/80 border-white/[0.06] hover:border-[#c5a059]/25 hover:bg-[#0c0c12]'
                  }`}
                >
                  {/* Card ambient glow when selected */}
                  {spreadMode === 'auto' && (
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] pointer-events-none bg-[#c5a059]/8 animate-ambient-pulse" />
                  )}

                  <div className="relative flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      spreadMode === 'auto'
                        ? 'bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.2)]'
                        : 'bg-white/[0.03] border border-white/10 text-stone-500 group-hover/card:text-[#c5a059] group-hover/card:border-[#c5a059]/25'
                    }`}>
                      <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold tracking-wider transition-all duration-200 ${
                      spreadMode === 'auto'
                        ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_8px_rgba(197,160,89,0.15)]'
                        : 'bg-white/[0.04] text-stone-500 border border-white/[0.06]'
                    }`}>
                      RECOMMENDED
                    </span>
                  </div>

                  <div className="relative">
                    <h3 className={`atu-font text-lg font-bold transition-colors duration-200 ${
                      spreadMode === 'auto' ? 'text-stone-50' : 'text-stone-200 group-hover/card:text-stone-100'
                    }`}>
                      Automatic Thoth Counting Loop
                    </h3>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                      Shuffle the 78 cards, cut into 4 elemental piles (YHVH), pick a Significator, and let Crowley's Golden Dawn jump count (+3, +4, +7, +12 steps) generate the sequence.
                    </p>
                  </div>

                  <div className={`text-[11px] font-mono font-bold flex items-center gap-2 pt-1 transition-colors duration-200 ${
                    spreadMode === 'auto' ? 'text-[#c5a059]' : 'text-stone-500 group-hover/card:text-[#c5a059]/70'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Golden Dawn Mathematical Engine</span>
                  </div>
                </motion.div>

                {/* Method B: Manual Physical Deck Punch-In */}
                <motion.div
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSpreadMode('manual')}
                  className={`group/card relative p-6 sm:p-7 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden ${
                    spreadMode === 'manual'
                      ? 'bg-[#0e0e14]/90 border-[#c5a059]/60 ring-1 ring-[#c5a059]/30 shadow-[0_0_30px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.04)]'
                      : 'bg-[#08080c]/80 border-white/[0.06] hover:border-[#c5a059]/25 hover:bg-[#0c0c12]'
                  }`}
                >
                  {/* Card ambient glow when selected */}
                  {spreadMode === 'manual' && (
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] pointer-events-none bg-[#c5a059]/8 animate-ambient-pulse" />
                  )}

                  <div className="relative flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      spreadMode === 'manual'
                        ? 'bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.2)]'
                        : 'bg-white/[0.03] border border-white/10 text-stone-500 group-hover/card:text-[#c5a059] group-hover/card:border-[#c5a059]/25'
                    }`}>
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold tracking-wider transition-all duration-200 ${
                      spreadMode === 'manual'
                        ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_8px_rgba(197,160,89,0.15)]'
                        : 'bg-white/[0.04] text-stone-500 border border-white/[0.06]'
                    }`}>
                      PHYSICAL DECK
                    </span>
                  </div>

                  <div className="relative">
                    <h3 className={`atu-font text-lg font-bold transition-colors duration-200 ${
                      spreadMode === 'manual' ? 'text-stone-50' : 'text-stone-200 group-hover/card:text-stone-100'
                    }`}>
                      Manual Physical Deck Punch-In
                    </h3>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                      Select cards drawn from your physical real-world Thoth deck in exact sequence using our interactive search & 78-card matrix punch studio.
                    </p>
                  </div>

                  <div className={`text-[11px] font-mono font-bold flex items-center gap-2 pt-1 transition-colors duration-200 ${
                    spreadMode === 'manual' ? 'text-[#c5a059]' : 'text-stone-500 group-hover/card:text-[#c5a059]/70'
                  }`}>
                    <Maximize2 className="w-4 h-4" />
                    <span>Fullscreen 78-Card Punch Studio</span>
                  </div>
                </motion.div>
              </div>

              {/* ── STEP 2 NAVIGATION FOOTER ── */}
              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between gap-4">
                <button
                  onClick={() => goToStep(1)}
                  className="group relative px-5 py-3 bg-transparent hover:bg-white/[0.03] text-stone-400 hover:text-stone-200 border border-white/10 hover:border-white/20 text-xs font-mono uppercase tracking-[0.12em] rounded-xl flex items-center gap-2 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                  <span>Back to Intention</span>
                </button>

                <button
                  onClick={() => goToStep(3)}
                  className="group relative px-7 py-4 bg-gradient-to-r from-[#c5a059] via-[#b89845] to-[#a37d35] hover:from-[#d6b77b] hover:via-[#c5a059] hover:to-[#b08940] text-stone-950 font-bold text-[11px] font-mono uppercase tracking-[0.15em] rounded-xl shadow-[0_4px_24px_rgba(197,160,89,0.2),_inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_32px_rgba(197,160,89,0.35)] flex items-center gap-3 transition-all duration-300 active:scale-[0.97] overflow-hidden animate-ring-pulse"
                >
                  {/* Shimmer sweep overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />

                  <span className="relative z-10">
                    {spreadMode === 'auto' ? 'Next: Shuffle the Deck' : 'Next: Punch In Cards'}
                  </span>
                  <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: SHUFFLE DECK (AUTO MODE) OR PUNCH CARDS (MANUAL MODE) */}
        {wizardStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {spreadMode === 'auto' ? (
              /* AUTO MODE: SHUFFLE DECK RITUAL VISUAL */
              <div className="space-y-4">
                <DeckShuffleVisual
                  deck={deck}
                  shuffleCount={shuffleCount}
                  onShuffle={handleShuffle}
                  onReset={handleResetDeck}
                  onNextStep={() => {
                    // Auto cut piles if not yet performed
                    if (!fourPilesCut) {
                      handlePerformFourPilesCut();
                    }
                    goToStep(4);
                  }}
                  onSetDeck={(newDeck) => {
                    setDeck(newDeck);
                    setStartCardId(newDeck[0].id);
                  }}
                />

                <div className="flex justify-start">
                  <button
                    onClick={() => goToStep(2)}
                    className="px-4 py-2.5 bg-[#050505] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Method
                  </button>
                </div>
              </div>
            ) : (
              /* MANUAL MODE: PUNCH IN CARDS */
              <div className="bg-[#0e0e11] border border-white/10 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#c5a059] uppercase tracking-widest block mb-1">
                    Step 3 of {totalSteps} • Punch Physical Deck Sequence
                  </span>
                  <h2 className="atu-font text-2xl font-bold text-[#c5a059] tracking-wide">
                    Select Cards Pulled From Physical Deck
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <p className="text-xs text-stone-400">
                    Search cards below or launch the 78-card matrix studio.
                  </p>

                  <button
                    onClick={() => setIsFullScreenPunchOpen(true)}
                    className="px-4 py-2.5 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs font-mono uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition"
                  >
                    <Maximize2 className="w-4 h-4" /> Fullscreen Matrix (78 Cards)
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search card by name to punch in..."
                    value={manualCardSearch}
                    onChange={(e) => setManualCardSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#050505] border border-white/15 focus:border-[#c5a059] rounded-sm text-stone-200 text-sm outline-none font-mono"
                  />
                </div>

                {/* Quick Cards Grid */}
                <div className="max-h-56 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-2 bg-[#050505] rounded-sm border border-white/10">
                  {filteredManualCards.map((card) => {
                    const isAlreadySelected = manualPulledCards.some((c) => c.id === card.id);
                    return (
                      <button
                        key={card.id}
                        disabled={isAlreadySelected}
                        onClick={() => handleAddManualCard(card)}
                        className={`p-2 rounded-sm text-left text-xs transition border flex flex-col justify-between ${
                          isAlreadySelected
                            ? 'opacity-30 bg-[#050505] border-white/5 cursor-not-allowed'
                            : 'bg-[#0e0e11] hover:bg-black border-white/10 hover:border-[#c5a059]/50 text-stone-200'
                        }`}
                      >
                        <span className="atu-font font-bold truncate">{card.name}</span>
                        <span className="text-[10px] text-[#c5a059] font-mono mt-1">
                          +{card.numerologyCount} Count
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Sequence List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest font-bold">
                      Punched Sequence ({manualPulledCards.length} Cards)
                    </span>
                    {manualPulledCards.length > 0 && (
                      <button
                        onClick={() => setManualPulledCards([])}
                        className="text-[10px] font-mono text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear All
                      </button>
                    )}
                  </div>

                  {manualPulledCards.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500 bg-[#050505] rounded-sm border border-dashed border-white/10">
                      No cards punched in yet. Select cards above or open the Fullscreen Matrix.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {manualPulledCards.map((card, idx) => (
                        <div
                          key={`${card.id}-${idx}`}
                          className="bg-[#050505] border border-[#c5a059]/40 px-3 py-2 rounded-sm flex items-center gap-2 text-xs text-stone-100"
                        >
                          <span className="w-5 h-5 rounded-sm bg-[#c5a059] text-stone-950 font-mono text-[10px] font-bold flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="atu-font font-bold">{card.name}</span>
                          <button
                            onClick={() => handleRemoveManualCard(idx)}
                            className="ml-1 text-stone-500 hover:text-rose-400 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* STEP 3 MANUAL NAVIGATION BAR */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => goToStep(2)}
                    className="px-4 py-2.5 bg-[#050505] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Method
                  </button>

                  <button
                    disabled={manualPulledCards.length === 0}
                    onClick={() => goToStep(4)}
                    className="px-6 py-3.5 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-sm shadow-xl flex items-center gap-2 transition transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Next: Review Spread ({manualPulledCards.length} Cards)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 4: CUT DECK INTO 4 PILES (AUTO MODE ONLY) */}
        {wizardStep === 4 && spreadMode === 'auto' && (
          <motion.div
            key="step4-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {fourPilesCut ? (
              <FourElementalPilesView
                fourPilesCut={fourPilesCut}
                selectedPileId={selectedPileId}
                deck={deck}
                onCustomCutPiles={(customCut) => {
                  setFourPilesCut(customCut);
                  if (customCut.piles.length > 0) {
                    setSelectedPileId(customCut.piles[0].id);
                    if (customCut.piles[0].cards.length > 0) {
                      setSelectedSignificatorId(customCut.piles[0].cards[0].id);
                    }
                  }
                }}
                onSelectPile={(pileId) => {
                  setSelectedPileId(pileId);
                  const pile = fourPilesCut.piles.find((p) => p.id === pileId);
                  if (pile && pile.cards.length > 0) {
                    setSelectedSignificatorId(pile.cards[0].id);
                  }
                }}
                onNextStep={() => goToStep(5)}
                onBackToShuffle={() => goToStep(3)}
                onPerformCutAgain={handlePerformFourPilesCut}
              />
            ) : (
              <div className="bg-[#0e0e11] p-12 text-center rounded-sm border border-white/10 space-y-4">
                <Sparkles className="w-10 h-10 text-[#c5a059] mx-auto animate-pulse" />
                <h3 className="atu-font text-xl font-bold text-[#c5a059]">
                  Ready to Cut the Deck into 4 Piles
                </h3>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  Click the button below to cut the 78-card deck into the 4 sacred Tetragrammaton elemental Books (Yod, Heh, Vau, Heh Final).
                </p>
                <button
                  onClick={handlePerformFourPilesCut}
                  className="px-6 py-3 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-sm shadow-xl"
                >
                  Cut Deck into 4 Piles Now
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 5: PICK SIGNIFICATOR CARD IN SELECTED STACK (AUTO MODE ONLY) */}
        {wizardStep === 5 && spreadMode === 'auto' && (
          <motion.div
            key="step5-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {fourPilesCut && activePile ? (
              <SignificatorSelectionView
                selectedPile={activePile}
                selectedSignificatorId={selectedSignificatorId}
                onSelectSignificator={(cardId) => setSelectedSignificatorId(cardId)}
                onRunSpread={(significatorId) => handleRunAutoSpread(significatorId)}
                onChangePileStep={() => goToStep(4)}
              />
            ) : (
              <div className="bg-[#0e0e11] p-8 text-center rounded-sm border border-white/10 space-y-4">
                <p className="text-stone-300 text-xs">No Book selected. Please return to Step 4 to cut the deck.</p>
                <button
                  onClick={() => goToStep(4)}
                  className="px-4 py-2 bg-[#c5a059] text-stone-950 font-bold text-xs font-mono uppercase rounded-sm"
                >
                  Return to Step 4
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP REVIEW SPREAD & SELECT AI VOICE STYLE (STEP 6 for Auto, STEP 4 for Manual) */}
        {((wizardStep === 6 && spreadMode === 'auto') || (wizardStep === 4 && spreadMode === 'manual')) && (
          <motion.div
            key="step-review"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0e0e11] border border-white/10 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div>
              <span className="text-xs font-mono text-[#c5a059] uppercase tracking-widest block mb-1">
                Step {wizardStep} of {totalSteps} • Review Spread & Configure AI Oracle Persona
              </span>
              <h2 className="atu-font text-2xl font-bold text-[#c5a059] tracking-wide">
                Review Your Thoth Card Sequence & Select AI Voice Style
              </h2>
            </div>

            {/* Drawn Cards Preview */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-stone-300 uppercase tracking-wider font-bold">
                Pulled Cards in Spread Sequence ({activePulledCards.length} Cards)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 justify-items-center bg-[#050505] p-4 rounded-sm border border-white/10">
                {activePulledCards.map((card, idx) => (
                  <TarotCardView
                    key={`${card.id}-${idx}`}
                    card={card}
                    stepNumber={idx + 1}
                    size="sm"
                    showDetailsOnClick={true}
                  />
                ))}
              </div>
            </div>

            {/* Live Non-Random Synchronicity & Combination Matrix */}
            <SynchronicityAnalysisView pulledCards={activePulledCards} />

            {/* AI STYLE SELECTION */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <label className="block text-xs font-mono text-[#c5a059] uppercase tracking-wider font-bold">
                Select Gemini AI Esoteric Interpretation Voice
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Style 1: Crowleyan Liber AL */}
                <div
                  onClick={() => setAiStyle('crowleyan')}
                  className={`p-4 rounded-sm border cursor-pointer transition flex items-start gap-3 ${
                    aiStyle === 'crowleyan'
                      ? 'bg-[#121218] border-[#c5a059] ring-1 ring-[#c5a059]/50 shadow-lg'
                      : 'bg-[#050505] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-sm bg-[#0e0e11] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0">
                    <Feather className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="atu-font text-sm font-bold text-stone-100">
                      Crowleyan Liber AL Style
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Fierce, majestic Liber AL vel Legis style weaving Nuit, Hadit, and ceremonial Thelemic cadence.
                    </p>
                  </div>
                </div>

                {/* Style 2: Hermetic Alchemical */}
                <div
                  onClick={() => setAiStyle('alchemical')}
                  className={`p-4 rounded-sm border cursor-pointer transition flex items-start gap-3 ${
                    aiStyle === 'alchemical'
                      ? 'bg-[#121218] border-[#c5a059] ring-1 ring-[#c5a059]/50 shadow-lg'
                      : 'bg-[#050505] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-sm bg-[#0e0e11] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="atu-font text-sm font-bold text-stone-100">
                      Hermetic Alchemical Transmutation
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Focuses on soul alchemy, tracing Nigredo (dissolution) to Rubedo (gold perfection).
                    </p>
                  </div>
                </div>

                {/* Style 3: Orphic Hymnic */}
                <div
                  onClick={() => setAiStyle('orphic')}
                  className={`p-4 rounded-sm border cursor-pointer transition flex items-start gap-3 ${
                    aiStyle === 'orphic'
                      ? 'bg-[#121218] border-[#c5a059] ring-1 ring-[#c5a059]/50 shadow-lg'
                      : 'bg-[#050505] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-sm bg-[#0e0e11] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="atu-font text-sm font-bold text-stone-100">
                      Orphic & Eleusinian Hymns
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Devotional Eleusinian poetry invoking the elemental gods and cosmic night.
                    </p>
                  </div>
                </div>

                {/* Style 4: Enochian Angelic */}
                <div
                  onClick={() => setAiStyle('enochian')}
                  className={`p-4 rounded-sm border cursor-pointer transition flex items-start gap-3 ${
                    aiStyle === 'enochian'
                      ? 'bg-[#121218] border-[#c5a059] ring-1 ring-[#c5a059]/50 shadow-lg'
                      : 'bg-[#050505] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-sm bg-[#0e0e11] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="atu-font text-sm font-bold text-stone-100">
                      Enochian Watchtowers & Qabalah
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Apocalyptic Enochian calls filled with angelic geometry and fiery heavenly seals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Deck Note */}
            <div>
              <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider font-bold mb-1">
                Optional Practitioner Notes
              </label>
              <input
                type="text"
                value={deckNote}
                onChange={(e) => setDeckNote(e.target.value)}
                placeholder="e.g. Performed during Waxing Crescent Moon in Scorpio..."
                className="w-full px-3 py-2.5 bg-[#050505] border border-white/15 focus:border-[#c5a059] rounded-sm text-stone-200 text-xs font-mono outline-none"
              />
            </div>

            {/* ACTION NAVIGATION BAR */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => goToStep(spreadMode === 'auto' ? 5 : 3)}
                className="px-4 py-2.5 bg-[#050505] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to {spreadMode === 'auto' ? 'Pick Significator' : 'Card Selection'}
              </button>

              <button
                onClick={executeAISynthesis}
                className="px-8 py-3.5 bg-gradient-to-r from-[#c5a059] via-amber-400 to-[#c5a059] hover:brightness-110 text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-sm shadow-2xl flex items-center gap-2 transition transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Synthesize Thoth Oracle AI Reading</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP: LIVE AI TRANSMUTATION PROCESSING SCREEN */}
        {((wizardStep === 7 && spreadMode === 'auto') || (wizardStep === 5 && spreadMode === 'manual')) && (
          <motion.div
            key="step-ai-processing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0e0e11] border border-[#c5a059]/60 rounded-sm p-8 sm:p-12 shadow-2xl text-center space-y-8 relative overflow-hidden"
          >
            {/* Glowing Rosicrucian Sigil Pulse */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#c5a059]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-[#c5a059]/60 animate-spin" />
              <div className="w-20 h-20 rounded-full bg-[#050505] border-2 border-[#c5a059] flex items-center justify-center shadow-2xl z-10 text-[#c5a059]">
                <Sparkles className="w-10 h-10 animate-pulse fill-current" />
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.2em] block mb-2 font-bold">
                Gemini 3.6 Flash AI Hermetic Synthesis Engine
              </span>
              <h2 className="atu-font text-2xl sm:text-3xl font-bold text-[#c5a059]">
                Transmuting Thoth Oracle Reading...
              </h2>
              <p className="text-xs text-stone-400 max-w-lg mx-auto mt-2 font-sans">
                Transmitting card sequence correspondences to Gemini AI to generate complete Qabalistic, Alchemical, and Astrological Oracle interpretation.
              </p>
            </div>

            {/* ANIMATED PROCESSING PHASES CHECKLIST */}
            <div className="max-w-md mx-auto space-y-2.5 text-left bg-[#050505] p-5 rounded-sm border border-white/10 font-mono text-xs">
              <div className={`flex items-center gap-3 transition ${aiProcessingPhase >= 1 ? 'text-[#c5a059]' : 'text-stone-600'}`}>
                {aiProcessingPhase > 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin text-[#c5a059] shrink-0" />
                )}
                <span>1. Transmitting Card Sequence to Gemini 3.6 Flash...</span>
              </div>

              <div className={`flex items-center gap-3 transition ${aiProcessingPhase >= 2 ? 'text-[#c5a059]' : 'text-stone-600'}`}>
                {aiProcessingPhase > 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : aiProcessingPhase === 2 ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#c5a059] shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-700 shrink-0" />
                )}
                <span>2. Mapping Hebrew Letters & Astrological Decans...</span>
              </div>

              <div className={`flex items-center gap-3 transition ${aiProcessingPhase >= 3 ? 'text-[#c5a059]' : 'text-stone-600'}`}>
                {aiProcessingPhase > 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : aiProcessingPhase === 3 ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#c5a059] shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-700 shrink-0" />
                )}
                <span>3. Calculating Qabalistic Tree of Life Paths...</span>
              </div>

              <div className={`flex items-center gap-3 transition ${aiProcessingPhase >= 4 ? 'text-[#c5a059]' : 'text-stone-600'}`}>
                {aiProcessingPhase > 4 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : aiProcessingPhase === 4 ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#c5a059] shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-700 shrink-0" />
                )}
                <span>4. Synthesizing {aiStyle.toUpperCase()} Persona Counsel...</span>
              </div>

              <div className={`flex items-center gap-3 transition ${aiProcessingPhase >= 5 ? 'text-emerald-400 font-bold' : 'text-stone-600'}`}>
                {aiProcessingPhase >= 5 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-700 shrink-0" />
                )}
                <span>5. Building Mobile Share QR Codex Report...</span>
              </div>
            </div>

            {/* Error Message */}
            {aiError && (
              <div className="p-4 bg-rose-950/80 border border-rose-500 text-rose-200 text-xs rounded-sm max-w-md mx-auto space-y-2">
                <div><strong>Synthesis Error:</strong> {aiError}</div>
                <button
                  onClick={() => goToStep(spreadMode === 'auto' ? 6 : 4)}
                  className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white font-bold rounded-sm text-xs font-mono uppercase"
                >
                  Return to Review & Retry
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN MANUAL PUNCH MODAL */}
      <FullScreenManualPunchModal
        isOpen={isFullScreenPunchOpen}
        onClose={() => setIsFullScreenPunchOpen(false)}
        allCards={THOTH_DECK}
        pulledCards={manualPulledCards}
        onAddCard={(card) => handleAddManualCard(card)}
        onRemoveCard={(idx) => handleRemoveManualCard(idx)}
        onClearSequence={() => setManualPulledCards([])}
        onFinishAndInterpret={() => {
          setIsFullScreenPunchOpen(false);
          goToStep(4);
        }}
      />
    </div>
  );
};
