import React, { useState, useEffect } from 'react';
import { ThothReading, PoeticNarrative, ThothCard } from '../types';
import {
  Sparkles,
  Feather,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  Scroll,
  Flame,
  Compass,
  Loader2,
  Layers,
  Wand2,
} from 'lucide-react';

interface NarrativeSynthesizerProps {
  reading: ThothReading;
  onNarrativeUpdated?: (narrative: PoeticNarrative) => void;
}

export const NarrativeSynthesizer: React.FC<NarrativeSynthesizerProps> = ({
  reading,
  onNarrativeUpdated,
}) => {
  // Initialize from reading if available
  const existingNarrative = reading.poeticNarrative || reading.aiInterpretation?.poeticNarrative;

  const [narrative, setNarrative] = useState<PoeticNarrative | null>(existingNarrative || null);
  const [selectedStyle, setSelectedStyle] = useState<'crowleyan' | 'orphic' | 'enochian' | 'alchemical'>('crowleyan');
  const [viewFormat, setViewFormat] = useState<'chapters' | 'stanzas' | 'prose' | 'both'>('chapters');
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync if reading prop updates
  useEffect(() => {
    if (existingNarrative) {
      setNarrative(existingNarrative);
    }
  }, [reading]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSynthesizeNarrative = async (overrideStyle?: typeof selectedStyle) => {
    const styleToUse = overrideStyle || selectedStyle;
    setIsSynthesizing(true);
    setError(null);

    // Stop speech if playing
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const response = await fetch('/api/reading/synthesize-narrative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: reading.question,
          pulledCards: reading.pulledCards,
          style: styleToUse,
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        if (responseText.includes('<!doctype') || responseText.includes('<html')) {
          throw new Error('Server returned an invalid HTML response instead of JSON.');
        }
        throw new Error(`Invalid server response (${response.status}): ${responseText.slice(0, 100)}`);
      }

      if (!response.ok || !data.success || !data.narrative) {
        throw new Error(data.error || `Failed to synthesize poetic narrative (HTTP ${response.status}).`);
      }

      const generated: PoeticNarrative = {
        title: data.narrative.title || 'Esoteric Synthesis of the Drawn Archetypes',
        stanzas: data.narrative.stanzas || [],
        proseSynthesis: data.narrative.proseSynthesis || '',
        keyMotto: data.narrative.keyMotto || '',
        bookHook: data.narrative.bookHook || '',
        bookChapters: data.narrative.bookChapters || [],
        style: styleToUse,
      };

      setNarrative(generated);
      if (onNarrativeUpdated) {
        onNarrativeUpdated(generated);
      }
    } catch (err: any) {
      console.error('Error synthesizing narrative:', err);
      setError(err.message || 'An error occurred during narrative synthesis.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Recite narrative aloud using SpeechSynthesis
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser environment.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!narrative) return;

    const textToSpeak = [
      narrative.title,
      'A poetic esoteric synthesis of the drawn cards.',
      narrative.keyMotto ? `Hermetic motto: ${narrative.keyMotto}` : '',
      ...narrative.stanzas,
      narrative.proseSynthesis,
    ]
      .filter(Boolean)
      .join('. ');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9; // Mystical slow pace
    utterance.pitch = 0.95;

    // Try to pick a deep resonant voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Male'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleCopyText = () => {
    if (!narrative) return;

    const formatted = `=== ${narrative.title.toUpperCase()} ===\nStyle: ${narrative.style || selectedStyle}\n\n${narrative.keyMotto ? `Motto: "${narrative.keyMotto}"\n\n` : ''}${narrative.stanzas.join('\n\n')}\n\n--- PROSE SYNTHESIS ---\n${narrative.proseSynthesis}\n\nGenerated for Thoth Reading: "${reading.question}"`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const stylesList: { id: typeof selectedStyle; label: string; desc: string; icon: string }[] = [
    { id: 'crowleyan', label: 'Liber AL (Crowleyan)', desc: 'Majestic ceremonial cadence & Nuit-Hadit occult verse', icon: '⚡' },
    { id: 'orphic', label: 'Orphic Hymn', desc: 'Devotional Eleusinian invocation of primal elements', icon: '🌙' },
    { id: 'enochian', label: 'Enochian Calls', desc: 'Sublime apocalyptic geometry & angelic watchtowers', icon: '📐' },
    { id: 'alchemical', label: 'Alchemical Process', desc: 'Hermetic manuscript tracing Nigredo to Rubedo', icon: '⚗️' },
  ];

  const chapters = (narrative?.bookChapters && narrative.bookChapters.length > 0)
    ? narrative.bookChapters
    : (reading.aiInterpretation?.bookChapters && reading.aiInterpretation.bookChapters.length > 0)
    ? reading.aiInterpretation.bookChapters
    : [
        {
          chapterNumber: 1,
          chapterTitle: "Chapter I: The Hook & The Call of the Arcana",
          parableQuote: narrative?.keyMotto || "As above, so below, to accomplish the miracles of the One Thing.",
          narrativeContent: narrative?.bookHook 
            ? `${narrative.bookHook}\n\nThe cards drawn in your sequence form the beginning of your journey, setting the stage for your personal parable. Your inquiry weaves seamlessly into your own path.`
            : `The sequence of cards pulled in your reading (${reading.pulledCards.map((c) => c.name).join(' → ')}) forms the beginning of your journey. This parable weaves your inquiry "${reading.question}" together with the elemental archetypes drawn from the deck.`,
          characterArchetypes: reading.pulledCards.slice(0, 2).map((c) => c.name),
        },
        {
          chapterNumber: 2,
          chapterTitle: "Chapter II: The Trial of the Elemental Archetypes",
          parableQuote: "He who seeks the hidden light must pass through the fiery crucible of the four elements.",
          narrativeContent: narrative?.proseSynthesis
            ? narrative.proseSynthesis.split('\n\n')[0] || narrative.proseSynthesis
            : `In the second chapter of your parable, the archetypes of ${reading.pulledCards.map((c) => c.name).join(', ')} appear as living characters and forces along your path, reflecting the obstacles and awakenings in your question.`,
          characterArchetypes: reading.pulledCards.map((c) => c.name),
        },
        {
          chapterNumber: 3,
          chapterTitle: "Chapter III: The Parable of Inner Vision",
          parableQuote: "Every answer lives already inside the questioner, waiting for the veil to be lifted.",
          narrativeContent: narrative?.proseSynthesis
            ? narrative.proseSynthesis.split('\n\n')[1] || narrative.proseSynthesis
            : reading.aiInterpretation?.deepAnswer || "Through the alchemy of the cards, your narrative reveals that your own choices determine the transmutation of your path.",
          characterArchetypes: reading.pulledCards.slice(-2).map((c) => c.name),
        },
        {
          chapterNumber: 4,
          chapterTitle: "Chapter IV: The Epilogue of Synthesis & Transmutation",
          parableQuote: narrative?.keyMotto || "Solve et Coagula: Dissolve and Coagulate.",
          narrativeContent: `When you read back this personal story, you are re-reading your own narrative with full self-insight. The wisdom you seek is not outside of you, but encoded in the parable of your own mind.`,
          characterArchetypes: [reading.pulledCards[0]?.name].filter(Boolean) as string[],
        },
      ];

  return (
    <div className="bg-[#0e0e11] border border-[#c5a059]/50 rounded-sm p-6 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[#c5a059] font-mono text-xs uppercase tracking-[0.2em]">
            <Wand2 className="w-4 h-4 text-[#c5a059]" /> Gemini AI Esoteric Narrative Synthesizer
          </div>
          <h2 className="atu-font text-xl sm:text-2xl font-bold text-[#c5a059] mt-1 tracking-wider">
            {narrative?.title || 'Poetic Synthesis of Drawn Cards'}
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Complements visual card archetypes with an evocative, poetic narrative of the final cards drawn in sequence.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {narrative && (
            <>
              <button
                onClick={handleToggleSpeech}
                className={`px-3 py-2 rounded-sm border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition ${
                  isSpeaking
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                    : 'bg-[#050505] hover:bg-black text-[#c5a059] border-[#c5a059]/40'
                }`}
                title="Recite Poetic Narrative Aloud"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Pause Voice' : 'Recite Aloud'}</span>
              </button>

              <button
                onClick={handleCopyText}
                className="px-3 py-2 bg-[#050505] hover:bg-black text-[#c5a059] border border-[#c5a059]/40 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition"
                title="Copy formatted narrative"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </>
          )}

          <button
            onClick={() => handleSynthesizeNarrative()}
            disabled={isSynthesizing}
            className="px-4 py-2 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs uppercase tracking-widest rounded-sm shadow-lg flex items-center gap-2 transition transform active:scale-95 disabled:opacity-50"
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" /> {narrative ? 'Re-Synthesize' : 'Synthesize Narrative'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Style Chooser Selector */}
      <div className="bg-[#050505] p-3 rounded-sm border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#c5a059] uppercase tracking-widest">
          <span>Select Esoteric Voice & Narrative Style:</span>
          <span className="text-[10px] text-stone-500 font-sans">Powered by Gemini 3.6 Flash</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {stylesList.map((styleItem) => {
            const isSelected = selectedStyle === styleItem.id;
            return (
              <button
                key={styleItem.id}
                onClick={() => {
                  setSelectedStyle(styleItem.id);
                  if (!narrative || narrative.style !== styleItem.id) {
                    handleSynthesizeNarrative(styleItem.id);
                  }
                }}
                className={`p-2.5 rounded-sm border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#121216] border-[#c5a059] ring-1 ring-[#c5a059]/50 text-stone-100 shadow-md'
                    : 'bg-[#0e0e11] hover:bg-black border-white/10 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-[#c5a059]">
                  <span className="flex items-center gap-1">
                    <span>{styleItem.icon}</span> {styleItem.label}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />}
                </div>
                <p className="text-[10px] text-stone-400 mt-1 line-clamp-2">{styleItem.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Format Switcher */}
      {narrative && (
        <div className="flex items-center justify-between bg-[#050505] px-3 py-1.5 rounded-sm border border-white/10 text-xs font-mono flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Scroll className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="text-stone-400 uppercase tracking-wider text-[11px]">Display View:</span>
          </div>

          <div className="inline-flex bg-black/60 p-0.5 rounded-sm border border-white/10">
            <button
              onClick={() => setViewFormat('chapters')}
              className={`px-2.5 py-1 rounded-sm text-[11px] transition ${
                viewFormat === 'chapters' ? 'bg-[#c5a059] text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Book Chapters
            </button>
            <button
              onClick={() => setViewFormat('stanzas')}
              className={`px-2.5 py-1 rounded-sm text-[11px] transition ${
                viewFormat === 'stanzas' ? 'bg-[#c5a059] text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Poetic Stanzas
            </button>
            <button
              onClick={() => setViewFormat('prose')}
              className={`px-2.5 py-1 rounded-sm text-[11px] transition ${
                viewFormat === 'prose' ? 'bg-[#c5a059] text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Allegorical Prose
            </button>
            <button
              onClick={() => setViewFormat('both')}
              className={`px-2.5 py-1 rounded-sm text-[11px] transition ${
                viewFormat === 'both' ? 'bg-[#c5a059] text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Dual Vision
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs rounded-sm font-mono">
          <strong>Synthesizer Error:</strong> {error}
        </div>
      )}

      {/* Initial Empty / Prompt State if no narrative synthesized yet */}
      {!narrative && !isSynthesizing && (
        <div className="bg-[#050505] p-8 rounded-sm border border-dashed border-[#c5a059]/30 text-center space-y-4">
          <Feather className="w-10 h-10 text-[#c5a059] mx-auto opacity-70 animate-bounce" />
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="atu-font text-base font-bold text-[#c5a059] uppercase tracking-wider">
              Invoke the Esoteric Poet-Oracle
            </h3>
            <p className="text-xs text-stone-400 font-serif leading-relaxed">
              Synthesize a poetic verse and allegorical narrative of the final sequence of drawn cards (
              {reading.pulledCards.map((c) => c.name).join(' → ')}).
            </p>
          </div>
          <button
            onClick={() => handleSynthesizeNarrative()}
            className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs uppercase tracking-widest rounded-sm shadow-xl inline-flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 fill-current" /> Begin Esoteric Synthesis
          </button>
        </div>
      )}

      {/* Synthesizing Loading State */}
      {isSynthesizing && (
        <div className="bg-[#050505] p-10 rounded-sm border border-[#c5a059]/30 text-center space-y-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin mx-auto" />
          <div className="space-y-1">
            <div className="atu-font text-sm font-bold text-[#c5a059] uppercase tracking-widest">
              Weaving Alchemical Verses & Mythic Stanzas...
            </div>
            <p className="text-xs text-stone-400 font-serif italic">
              Channeling the correspondences of Hebrew letters, zodiac signs, and elementals into narrative poem.
            </p>
          </div>
        </div>
      )}

      {/* Main Narrative Content Rendering */}
      {narrative && !isSynthesizing && (
        <div className="space-y-6 animate-fade-in">
          {/* Hermetic Motto Banner */}
          {narrative.keyMotto && (
            <div className="bg-[#050505] border border-[#c5a059]/40 p-4 rounded-sm text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl font-serif text-[#c5a059]">🜂</div>
              <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-[0.2em] block mb-1">
                Hermetic Aphorism & Oracle Invocation
              </span>
              <p className="text-lg font-serif italic font-bold text-[#c5a059]">
                "{narrative.keyMotto}"
              </p>
            </div>
          )}

          {/* Drawn Cards Micro Ribbon */}
          <div className="bg-[#0e0e11] p-3 rounded-sm border border-white/10 flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
            <span className="text-[10px] text-stone-500 uppercase tracking-widest shrink-0">Synthesized Arcana Sequence:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {reading.pulledCards.map((card, idx) => (
                <div
                  key={`${card.id}-${idx}`}
                  className="bg-[#050505] px-2 py-1 rounded-sm border border-[#c5a059]/30 text-[11px] shrink-0 flex items-center gap-1"
                >
                  <span className="text-[#c5a059] font-serif font-bold">
                    {card.hebrewLetter?.letter || card.astrology?.symbol || '🜂'}
                  </span>
                  <span className="text-stone-200">{card.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Book Chapters Display */}
          {(viewFormat === 'chapters' || viewFormat === 'both') && (() => {
            const activeChapter = chapters[Math.min(activeChapterIndex, chapters.length - 1)];
            return (
              <div className="bg-[#050505] border border-[#c5a059]/40 rounded-sm p-6 space-y-6 shadow-2xl relative overflow-hidden">
                {/* Book Hook Banner */}
                <div className="bg-[#0e0e11] border-l-4 border-[#c5a059] p-4 rounded-r-sm space-y-1">
                  <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-[0.2em] font-bold block">
                    The Journey's Beginning
                  </span>
                  <p className="text-xs text-stone-300 font-serif leading-relaxed italic">
                    "{narrative.bookHook || `The sequence of cards you pulled (${reading.pulledCards.map((c) => c.name).join(' → ')}) forms the beginning of your journey. This story intertwines your question with the character archetypes facing their trials. Read your story chapter by chapter to gain full insight into your path.`}"
                  </p>
                </div>

                {/* Chapter Navigation Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10">
                  {chapters.map((chap, idx) => {
                    const isCurrent = idx === Math.min(activeChapterIndex, chapters.length - 1);
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveChapterIndex(idx)}
                        className={`px-3 py-1.5 rounded-sm border text-xs font-mono uppercase tracking-wider shrink-0 transition flex items-center gap-1.5 ${
                          isCurrent
                            ? 'bg-[#c5a059] text-stone-950 font-bold border-[#c5a059] shadow-md'
                            : 'bg-[#0e0e11] hover:bg-black text-stone-400 border-white/10'
                        }`}
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Chapter {chap.chapterNumber}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Current Active Chapter Card */}
                {activeChapter && (
                  <div className="bg-[#0e0e11] border border-white/10 p-6 rounded-sm space-y-5 animate-fade-in relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-[0.2em] block">
                          Page {activeChapterIndex + 1} of {chapters.length}
                        </span>
                        <h3 className="atu-font text-xl font-bold text-[#c5a059] tracking-wider mt-0.5">
                          {activeChapter.chapterTitle.replace(/^Chapter\s+[IVXLCDM\d]+:\s*/i, '')}
                        </h3>
                      </div>

                      {/* Featured Character Archetypes Badge List */}
                      {activeChapter.characterArchetypes && activeChapter.characterArchetypes.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mr-1">
                            Archetypes:
                          </span>
                          {activeChapter.characterArchetypes.map((charName, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2 py-0.5 bg-[#050505] border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-mono rounded-sm"
                            >
                              {charName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Parable Quote Callout */}
                    {activeChapter.parableQuote && (
                      <div className="bg-[#050505] border-l-2 border-[#c5a059] p-4 rounded-r-sm space-y-1">
                        <span className="text-[9px] font-mono text-[#c5a059]/70 uppercase tracking-widest block">
                          Book Parable Excerpt
                        </span>
                        <p className="text-sm font-serif italic text-stone-200">
                          "{activeChapter.parableQuote}"
                        </p>
                      </div>
                    )}

                    {/* Chapter Prose Narrative */}
                    <div className="font-serif text-stone-200 text-sm sm:text-base leading-relaxed space-y-4 bg-[#050505] p-5 rounded-sm border border-white/10">
                      {activeChapter.narrativeContent.split('\n\n').map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#c5a059] first-letter:font-serif first-letter:mr-1.5 first-letter:float-left"
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    {/* Chapter Page Navigation Controls */}
                    <div className="flex items-center justify-between pt-2 text-xs font-mono">
                      <button
                        onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                        disabled={activeChapterIndex === 0}
                        className="px-3 py-1.5 bg-[#050505] hover:bg-black disabled:opacity-30 border border-white/10 text-[#c5a059] rounded-sm transition flex items-center gap-1"
                      >
                        ← Previous Chapter
                      </button>

                      <span className="text-stone-500 text-[11px]">
                        Chapter {activeChapterIndex + 1} of {chapters.length}
                      </span>

                      <button
                        onClick={() => setActiveChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))}
                        disabled={activeChapterIndex === chapters.length - 1}
                        className="px-3 py-1.5 bg-[#050505] hover:bg-black disabled:opacity-30 border border-white/10 text-[#c5a059] rounded-sm transition flex items-center gap-1"
                      >
                        Next Chapter →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Stanzas Display */}
          {(viewFormat === 'stanzas' || viewFormat === 'both') && narrative.stanzas.length > 0 && (
            <div className="bg-[#050505] border border-white/10 rounded-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="atu-font text-base font-bold text-[#c5a059] flex items-center gap-2 tracking-wider uppercase">
                  <Feather className="w-4 h-4 text-[#c5a059]" /> Poetic Stanzas of the Progression
                </h3>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                  {narrative.stanzas.length} Verse Stanzas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {narrative.stanzas.map((stanzaText, sIdx) => {
                  const lines = stanzaText.split('\n').filter(Boolean);
                  return (
                    <div
                      key={sIdx}
                      className="bg-[#0e0e11] p-5 rounded-sm border border-[#c5a059]/20 relative space-y-2 shadow-inner"
                    >
                      <div className="absolute top-3 right-3 text-xs font-mono text-[#c5a059]/40 font-bold">
                        Stanza {sIdx + 1}
                      </div>
                      <div className="font-serif italic text-stone-200 text-sm leading-relaxed space-y-1 pt-1">
                        {lines.map((line, lIdx) => (
                          <p key={lIdx} className="pl-2 border-l-2 border-[#c5a059]/30 hover:border-[#c5a059] transition">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prose Allegorical Story Display */}
          {(viewFormat === 'prose' || viewFormat === 'both') && narrative.proseSynthesis && (
            <div className="bg-[#050505] border border-white/10 rounded-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="atu-font text-base font-bold text-[#c5a059] flex items-center gap-2 tracking-wider uppercase">
                  <BookOpen className="w-4 h-4 text-[#c5a059]" /> Allegorical Mythic Prose Narrative
                </h3>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                  Continuous Mythos
                </span>
              </div>

              <div className="font-serif text-stone-200 text-sm sm:text-base leading-relaxed space-y-4 bg-[#0e0e11] p-5 rounded-sm border border-white/10">
                {narrative.proseSynthesis.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#c5a059] first-letter:font-serif first-letter:mr-1">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
