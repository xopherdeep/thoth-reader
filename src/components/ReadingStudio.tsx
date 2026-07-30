import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THOTH_DECK } from '../data/thothCards';
import { ThothCard, ThothReading, SpreadStep } from '../types';
import { useReadingStudioWizard } from '../hooks/useReadingStudioWizard';
import { TarotCardView } from './TarotCardView';
import { FourElementalPilesView } from './FourElementalPilesView';
import { SignificatorSelectionView } from './SignificatorSelectionView';
import { FullScreenManualPunchModal } from './FullScreenManualPunchModal';
import { SynchronicityAnalysisView } from './SynchronicityAnalysisView';
import { DeckShuffleVisual } from './DeckShuffleVisual';
import { WizardStepper } from './WizardStepper';
import { WizardStepInquiry } from './organisms/WizardStepInquiry';
import { WizardStepSpreadMethod } from './organisms/WizardStepSpreadMethod';
import { WizardStepManualPunch } from './organisms/WizardStepManualPunch';
import { GlassContainer } from './atoms/GlassContainer';

import {
  Sparkles,
  Shuffle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Flame,
  BookOpen,
  Layers,
  Feather,
  Compass,
  Zap,
} from 'lucide-react';

interface ReadingStudioProps {
  onReadingCreated: (reading: ThothReading) => void;
}

export const ReadingStudio: React.FC<ReadingStudioProps> = ({ onReadingCreated }) => {
  const wizard = useReadingStudioWizard();
  const [manualCardSearch, setManualCardSearch] = React.useState('');
  const [isFullScreenPunchOpen, setIsFullScreenPunchOpen] = React.useState(false);

  // Compute active cards for reading creation
  const activePulledCards = wizard.spreadMode === 'auto' ? wizard.currentSpread?.pulledCards || [] : wizard.manualPulledCards;
  const activeSteps = wizard.currentSpread?.steps || [];

  // Execute AI Reading Synthesis
  const executeAISynthesis = async () => {
    if (activePulledCards.length === 0) {
      alert('Please select or punch in at least 1 card for the reading sequence first.');
      return;
    }

    const aiStepNum = wizard.spreadMode === 'auto' ? 7 : 5;
    wizard.goToStep(aiStepNum);
    wizard.setIsGeneratingAI(true);
    wizard.setAiError(null);
    wizard.setAiProcessingPhase(1);

    // Simulate animated loading progress steps
    const timer1 = setTimeout(() => wizard.setAiProcessingPhase(2), 800);
    const timer2 = setTimeout(() => wizard.setAiProcessingPhase(3), 1600);
    const timer3 = setTimeout(() => wizard.setAiProcessingPhase(4), 2400);

    try {
      const response = await fetch('/api/reading/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: wizard.question.trim() || 'What guidance does the Book of Thoth hold for the querent?',
          pulledCards: activePulledCards,
          countingLog: activeSteps,
          deckNote: wizard.deckNote,
          aiStyle: wizard.aiStyle,
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

      wizard.setAiProcessingPhase(5);

      const newReading: ThothReading = {
        id: 'reading-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toISOString(),
        question: wizard.question.trim() || 'Thoth Numerological Reading',
        pulledCards: activePulledCards,
        countingLog: activeSteps,
        aiInterpretation: data.interpretation,
        deckNote: wizard.deckNote,
      };

      // Store in backend server
      fetch('/api/readings/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newReading.id, readingData: newReading }),
      }).catch((e) => console.warn('Could not store reading in backend server:', e));

      setTimeout(() => {
        wizard.setIsGeneratingAI(false);
        onReadingCreated(newReading);
      }, 1000);
    } catch (err: any) {
      console.error('Reading interpretation error:', err);
      wizard.setAiError(err.message || 'An error occurred while generating the reading interpretation.');
      wizard.setIsGeneratingAI(false);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    }
  };

  const handleAddManualCard = (card: ThothCard) => {
    if (wizard.manualPulledCards.some((c) => c.id === card.id)) return;
    wizard.setManualPulledCards((prev) => [...prev, card]);
  };

  const handleRemoveManualCard = (index: number) => {
    wizard.setManualPulledCards((prev) => prev.filter((_, i) => i !== index));
  };

  const activePile = wizard.fourPilesCut?.piles.find((p) => p.id === wizard.selectedPileId) || wizard.fourPilesCut?.piles[0];

  const wizardStepsInfo =
    wizard.spreadMode === 'auto'
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
    <div className="space-y-6 w-full max-w-full">
      <WizardStepper
        steps={wizardStepsInfo}
        currentStep={wizard.wizardStep}
        maxVisitedStep={wizard.maxVisitedStep}
        onStepClick={(stepNum) => wizard.goToStep(stepNum)}
        isGeneratingAI={wizard.isGeneratingAI}
      />

      <AnimatePresence mode="wait">
        {/* STEP 1: INQUIRY INTENTION */}
        {wizard.wizardStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassContainer withOrnament>
              {/* ── Ambient Background Layers ── */}
              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none animate-ambient-pulse" style={{ background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.12) 0%, rgba(197,160,89,0.03) 50%, transparent 70%)' }} />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-[80px] pointer-events-none animate-ambient-pulse" style={{ background: 'radial-gradient(ellipse at center, rgba(147,110,45,0.08) 0%, transparent 70%)', animationDelay: '3s' }} />

              {/* Decorative Sigil Cross */}
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

              <WizardStepInquiry
                totalSteps={totalSteps}
                question={wizard.question}
                setQuestion={wizard.setQuestion}
                step1Phase={wizard.step1Phase}
                setStep1Phase={wizard.setStep1Phase}
                deck={wizard.deck}
                selectedSignificatorId={wizard.selectedSignificatorId}
                setSelectedSignificatorId={wizard.setSelectedSignificatorId}
                onNextStep={() => wizard.goToStep(2)}
              />
            </GlassContainer>
          </motion.div>
        )}

        {/* STEP 2: CHOOSE SPREAD METHOD */}
        {wizard.wizardStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassContainer withOrnament>
              {/* ── Ambient Background Layers ── */}
              <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none animate-ambient-pulse" style={{ background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.1) 0%, rgba(197,160,89,0.02) 50%, transparent 70%)' }} />
              <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[80px] pointer-events-none animate-ambient-pulse" style={{ background: 'radial-gradient(ellipse at center, rgba(147,110,45,0.07) 0%, transparent 70%)', animationDelay: '3s' }} />

              <WizardStepSpreadMethod
                totalSteps={totalSteps}
                spreadMode={wizard.spreadMode}
                setSpreadMode={wizard.setSpreadMode}
                onBack={() => wizard.goToStep(1)}
                onNext={() => wizard.goToStep(3)}
              />
            </GlassContainer>
          </motion.div>
        )}

        {/* STEP 3: SHUFFLE DECK (AUTO MODE) OR PUNCH CARDS (MANUAL MODE) */}
        {wizard.wizardStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {wizard.spreadMode === 'auto' ? (
              <div className="space-y-4">
                <DeckShuffleVisual
                  deck={wizard.deck}
                  shuffleCount={wizard.shuffleCount}
                  onShuffle={wizard.handleShuffle}
                  onReset={wizard.handleResetDeck}
                  onNextStep={() => {
                    if (!wizard.fourPilesCut) wizard.handlePerformFourPilesCut();
                    wizard.goToStep(4);
                  }}
                  onSetDeck={(newDeck) => {
                    wizard.setDeck(newDeck);
                    wizard.setStartCardId(newDeck[0].id);
                  }}
                />
                <div className="flex justify-start">
                  <button onClick={() => wizard.goToStep(2)} className="px-4 py-2.5 bg-[#050505] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition">
                    <ArrowLeft className="w-4 h-4" /> Back to Method
                  </button>
                </div>
              </div>
            ) : (
              <WizardStepManualPunch
                totalSteps={totalSteps}
                manualPulledCards={wizard.manualPulledCards}
                manualCardSearch={manualCardSearch}
                setManualCardSearch={setManualCardSearch}
                onAddManualCard={handleAddManualCard}
                onRemoveManualCard={handleRemoveManualCard}
                onClearSequence={() => wizard.setManualPulledCards([])}
                onOpenFullScreenPunch={() => setIsFullScreenPunchOpen(true)}
                onBack={() => wizard.goToStep(2)}
                onNext={() => wizard.goToStep(4)}
              />
            )}
          </motion.div>
        )}

        {/* STEP 4: CUT DECK INTO 4 PILES (AUTO MODE ONLY) */}
        {wizard.wizardStep === 4 && wizard.spreadMode === 'auto' && (
          <motion.div
            key="step4-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {wizard.fourPilesCut ? (
              <FourElementalPilesView
                fourPilesCut={wizard.fourPilesCut}
                selectedPileId={wizard.selectedPileId}
                selectedSignificatorId={wizard.selectedSignificatorId}
                deck={wizard.deck}
                onCustomCutPiles={(customCut) => {
                  wizard.setFourPilesCut(customCut);
                  if (customCut.piles.length > 0) {
                    wizard.setSelectedPileId(customCut.piles[0].id);
                  }
                }}
                onSelectPile={(pileId) => {
                  wizard.setSelectedPileId(pileId);
                  const pile = wizard.fourPilesCut?.piles.find((p) => p.id === pileId);
                  if (pile && pile.cards.length > 0) {
                    const sigInPile = pile.cards.find((c) => c.id === wizard.selectedSignificatorId);
                    wizard.setStartCardId(sigInPile ? sigInPile.id : pile.cards[0].id);
                  }
                }}
                onNextStep={() => wizard.goToStep(5)}
                onBackToShuffle={() => wizard.goToStep(3)}
                onPerformCutAgain={wizard.handlePerformFourPilesCut}
              />
            ) : (
              <div className="bg-[#0e0e11] p-12 text-center rounded-sm border border-white/10 space-y-4">
                <Sparkles className="w-10 h-10 text-[#c5a059] mx-auto animate-pulse" />
                <h3 className="atu-font text-xl font-bold text-[#c5a059]">Ready to Cut the Deck into 4 Piles</h3>
                <p className="text-xs text-stone-400 max-w-md mx-auto">Click the button below to cut the 78-card deck into the 4 sacred Tetragrammaton elemental Books.</p>
                <button onClick={wizard.handlePerformFourPilesCut} className="px-6 py-3 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-sm shadow-xl">
                  Cut Deck into 4 Piles Now
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 5: PICK SIGNIFICATOR CARD IN SELECTED STACK (AUTO MODE ONLY) */}
        {wizard.wizardStep === 5 && wizard.spreadMode === 'auto' && (
          <motion.div
            key="step5-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {wizard.fourPilesCut && activePile ? (
              <SignificatorSelectionView
                selectedPile={activePile}
                selectedSignificatorId={wizard.selectedSignificatorId}
                onSelectSignificator={(cardId) => wizard.setSelectedSignificatorId(cardId)}
                onRunSpread={(significatorId) => wizard.handleRunAutoSpread(significatorId)}
                onChangePileStep={() => wizard.goToStep(4)}
              />
            ) : (
              <div className="bg-[#0e0e11] p-8 text-center rounded-sm border border-white/10 space-y-4">
                <p className="text-stone-300 text-xs">No Book selected. Please return to Step 4 to cut the deck.</p>
                <button onClick={() => wizard.goToStep(4)} className="px-4 py-2 bg-[#c5a059] text-stone-950 font-bold text-xs font-mono uppercase rounded-sm">
                  Return to Step 4
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP REVIEW SPREAD & SELECT AI VOICE STYLE (STEP 6 for Auto, STEP 4 for Manual) */}
        {((wizard.wizardStep === 6 && wizard.spreadMode === 'auto') || (wizard.wizardStep === 4 && wizard.spreadMode === 'manual')) && (
          <motion.div
            key="step-review"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <GlassContainer withOrnament className="space-y-6">
              <div>
                <span className="text-xs font-mono text-[#c5a059]/80 uppercase tracking-[0.2em] block mb-1">
                  Step {wizard.wizardStep} of {totalSteps} • Review Spread & Configure AI Oracle Persona
                </span>
                <h2 className="atu-font text-2xl font-bold text-[#c5a059] tracking-wide">
                  Review Your Thoth Card Sequence & Select AI Voice Style
                </h2>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono text-stone-300 uppercase tracking-wider font-bold">
                  Pulled Cards in Spread Sequence ({activePulledCards.length} Cards)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 justify-items-center bg-white/[0.03] p-4 rounded-2xl border border-white/10">
                  {activePulledCards.map((card, idx) => (
                    <TarotCardView key={`${card.id}-${idx}`} card={card} stepNumber={idx + 1} size="sm" showDetailsOnClick={true} />
                  ))}
                </div>
              </div>

              <SynchronicityAnalysisView pulledCards={activePulledCards} />

              {/* AI STYLE SELECTION */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <label className="block text-xs font-mono text-[#c5a059] uppercase tracking-wider font-bold">
                  Select Gemini AI Esoteric Interpretation Voice
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'crowleyan', icon: Feather, title: 'Crowleyan Liber AL Style', desc: 'Fierce, majestic Liber AL vel Legis style weaving Nuit, Hadit, and ceremonial Thelemic cadence.' },
                    { id: 'alchemical', icon: Flame, title: 'Hermetic Alchemical Transmutation', desc: 'Focuses on soul alchemy, tracing Nigredo (dissolution) to Rubedo (gold perfection).' },
                    { id: 'orphic', icon: BookOpen, title: 'Orphic & Eleusinian Hymns', desc: 'Devotional Eleusinian poetry invoking the elemental gods and cosmic night.' },
                    { id: 'enochian', icon: Compass, title: 'Enochian Watchtowers & Qabalah', desc: 'Apocalyptic Enochian calls filled with angelic geometry and fiery heavenly seals.' },
                  ].map(({ id, icon: Icon, title, desc }) => (
                    <div
                      key={id}
                      onClick={() => wizard.setAiStyle(id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                        wizard.aiStyle === id
                          ? 'bg-[#c5a059]/10 border-[#c5a059]/70 ring-1 ring-[#c5a059]/30 shadow-[0_0_24px_rgba(197,160,89,0.15)]'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="atu-font text-sm font-bold text-stone-100">{title}</div>
                        <p className="text-[11px] text-stone-400 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider font-bold mb-1">Optional Practitioner Notes</label>
                <input
                  type="text"
                  value={wizard.deckNote}
                  onChange={(e) => wizard.setDeckNote(e.target.value)}
                  placeholder="e.g. Performed during Waxing Crescent Moon in Scorpio..."
                  className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/15 focus:border-[#c5a059] rounded-xl text-stone-200 text-xs font-mono outline-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => wizard.goToStep(wizard.spreadMode === 'auto' ? 5 : 3)}
                  className="px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to {wizard.spreadMode === 'auto' ? 'Pick Significator' : 'Card Selection'}
                </button>
                <button
                  onClick={executeAISynthesis}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#c5a059] via-amber-400 to-[#c5a059] hover:brightness-110 text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-xl shadow-[0_0_32px_rgba(197,160,89,0.4)] flex items-center gap-2 transition transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Synthesize Thoth Oracle AI Reading</span>
                </button>
              </div>
            </GlassContainer>
          </motion.div>
        )}

        {/* STEP: LIVE AI TRANSMUTATION PROCESSING SCREEN */}
        {((wizard.wizardStep === 7 && wizard.spreadMode === 'auto') || (wizard.wizardStep === 5 && wizard.spreadMode === 'manual')) && (
          <motion.div
            key="step-ai-processing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <GlassContainer className="text-center space-y-8">
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
                <h2 className="atu-font text-2xl sm:text-3xl font-bold text-[#c5a059]">Transmuting Thoth Oracle Reading...</h2>
                <p className="text-xs text-stone-400 max-w-lg mx-auto mt-2 font-sans">
                  Transmitting card sequence correspondences to Gemini AI to generate complete Qabalistic, Alchemical, and Astrological Oracle interpretation.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-2.5 text-left bg-white/[0.04] p-5 rounded-2xl border border-white/10 font-mono text-xs">
                {[
                  "1. Transmitting Card Sequence to Gemini 3.6 Flash...",
                  "2. Mapping Hebrew Letters & Astrological Decans...",
                  "3. Calculating Qabalistic Tree of Life Paths...",
                  `4. Synthesizing ${wizard.aiStyle.toUpperCase()} Persona Counsel...`,
                  "5. Building Mobile Share QR Codex Report...",
                ].map((text, idx) => {
                  const stepNum = idx + 1;
                  const isActive = wizard.aiProcessingPhase === stepNum;
                  const isDone = wizard.aiProcessingPhase > stepNum;
                  return (
                    <div key={idx} className={`flex items-center gap-3 transition ${wizard.aiProcessingPhase >= stepNum ? (isDone ? 'text-emerald-400 font-bold' : 'text-[#c5a059]') : 'text-stone-600'}`}>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#c5a059] shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-stone-700 shrink-0" />
                      )}
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>

              {wizard.aiError && (
                <div className="p-4 bg-rose-950/80 border border-rose-500 text-rose-200 text-xs rounded-sm max-w-md mx-auto space-y-2">
                  <div><strong>Synthesis Error:</strong> {wizard.aiError}</div>
                  <button
                    onClick={() => wizard.goToStep(wizard.spreadMode === 'auto' ? 6 : 4)}
                    className="px-4 py-2 bg-rose-900/50 hover:bg-rose-800/60 text-white font-bold rounded-xl text-xs font-mono uppercase border border-rose-500/40"
                  >
                    Return to Review & Retry
                  </button>
                </div>
              )}
            </GlassContainer>
          </motion.div>
        )}
      </AnimatePresence>

      <FullScreenManualPunchModal
        isOpen={isFullScreenPunchOpen}
        onClose={() => setIsFullScreenPunchOpen(false)}
        allCards={THOTH_DECK}
        pulledCards={wizard.manualPulledCards}
        onAddCard={handleAddManualCard}
        onRemoveCard={handleRemoveManualCard}
        onClearSequence={() => wizard.setManualPulledCards([])}
        onFinishAndInterpret={() => {
          setIsFullScreenPunchOpen(false);
          wizard.goToStep(4);
        }}
      />
    </div>
  );
};
