import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THOTH_DECK } from '../data/thothCards';
import {
  SEPHIROT_DATA,
  TREE_OF_LIFE_PATHS,
  QABALISTIC_WORLDS_DATA,
  ESOTERIC_FORMULAS_DATA,
  CROWLEY_ESSAY_SECTIONS,
  NUMEROLOGY_ESSAY_DATA,
  ASTROLOGY_DECANS_DATA,
  ALCHEMY_FORMULAS_DATA,
  SephiraEntry,
  PathEntry,
  QabalisticWorldEntry,
  EsotericFormulaEntry,
} from '../data/thothEncyclopediaData';
import { TreeOfLifeDiagram } from './molecules/TreeOfLifeDiagram';
import { SearchInput } from './atoms/SearchInput';
import { Badge } from './atoms/Badge';
import { Button } from './atoms/Button';
import { SectionTitle } from './atoms/SectionTitle';
import {
  BookOpen,
  Brain,
  Sparkles,
  Layers,
  Compass,
  Key,
  Flame,
  Sun,
  BookText,
  Info,
  ChevronRight,
  ExternalLink,
  Table,
  Cpu,
  Feather,
  Quote,
  Zap,
} from 'lucide-react';

export interface GlossaryTerm {
  id: string;
  term: string;
  pronunciation?: string;
  category: 'Philosophy & Consciousness' | 'Esoteric & Occult' | 'Thoth Mechanics' | 'Kabbalah & Tree' | 'Astrology & Alchemy';
  shortDef: string;
  fullDescription: string;
  keyInsights: string[];
  tags: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'map-of-consciousness',
    term: 'Map of Human Consciousness',
    category: 'Philosophy & Consciousness',
    shortDef: 'The Tarot viewed as a universal blueprint mapping all states, archetypes, and stages of human awareness.',
    fullDescription:
      'You can think of the Tarot as a map of the human consciousness as studied, observed, and codified across millennia. Just like a standardized psychological test evaluates cognitive processing across a population, the Tarot functions as a reflective mirror for the psyche. Its 78 archetypal keys reflect the spectrum of human internal experience, external manifestations, emotional states, and spiritual evolution.',
    keyInsights: [
      'Functions as a mirror testing our perception and internal capability.',
      'Translates intangible archetypal states into visual, numerical, and symbolic keys.',
      'Connects individual personal experience to universal collective consciousness.',
    ],
    tags: ['Philosophy', 'Consciousness', 'Archetype', 'Psychology'],
  },
  {
    id: '78-piece-puzzle',
    term: 'The 78-Piece Puzzle',
    category: 'Philosophy & Consciousness',
    shortDef: 'The complete Tarot deck structure designed to humanize and synthesize consciousness into a cohesive whole.',
    fullDescription:
      'In the Tarot we have a 78-piece puzzle engineered to humanize consciousness. Comprising 22 Major Arcana (Atu / keys of universal law), 16 Court Cards (facets of personality and elemental agency), and 40 Minor Arcana (spheres of daily life and decanic forces), each piece represents an irreplaceable quadrant of existence.',
    keyInsights: [
      '22 Major Arcana represent macrocosmic universal laws & paths of wisdom.',
      '16 Court Cards represent human character types, elemental temperaments, and agencies.',
      '40 Minor Arcana map the daily play of light and shadow across the four elements.',
    ],
    tags: ['Structure', '78 Cards', 'Arcana', 'Synthesis'],
  },
  {
    id: 'occult-and-veil-of-court',
    term: 'The Occult & Veil of Court',
    category: 'Philosophy & Consciousness',
    shortDef: 'The historical concealment of esoteric wisdom behind symbolic secrecy, court imagery, and hidden knowledge.',
    fullDescription:
      'The word "occult" simply means "hidden or veiled." Historically, because these cosmic truths were kept secret to preserve their sanctity and protect practitioners from persecution, they were veiled behind the guise of court cards, card games, and symbolic allegories. This "veil of court" preserves a deeply important spiritual framework that describes subtle aspects of reality.',
    keyInsights: [
      'Occult refers to that which is veiled or obscured from surface perception.',
      'The Court cards act as a veil masking elemental and psychological laws.',
      'Preserves ancient wisdom intact through periods of cultural and religious suppression.',
    ],
    tags: ['Occult', 'Veil of Court', 'Mystery', 'Secrecy'],
  },
  {
    id: 'tree-of-life-qabalah',
    term: 'Tree of Life (Otzech Chiim)',
    category: 'Kabbalah & Tree',
    shortDef: 'The Qabalistic glyph of 10 Sephirot and 22 Paths mapping divine creation and spiritual ascent.',
    fullDescription:
      'The Tree of Life is the central diagram of Western Hermetic Kabbalah. It maps the emanation of divine consciousness from the unmanifest Ain Soph Aur (Limitless Light) down through 10 distinct spheres (Sephirot) into physical matter (Malkuth). The 22 Major Arcana cards correspond directly to the 22 Paths connecting these spheres.',
    keyInsights: [
      '10 Sephirot map stages of divine consciousness from Crown (Kether) to Kingdom (Malkuth).',
      '22 Paths map the soul\'s journey and correspond to the 22 Major Arcana and Hebrew letters.',
      'Includes 3 Pillars: Middle (Balance), Right (Mercy/Force), and Left (Severity/Form).',
    ],
    tags: ['Kabbalah', 'Tree of Life', 'Sephirot', 'Paths'],
  },
  {
    id: 'formula-0-equals-2',
    term: 'Formula of Zero (0 = 2)',
    category: 'Thoth Mechanics',
    shortDef: 'The mathematical equation 0 = (+1) + (-1) = 2, representing creation from the unmanifest void.',
    fullDescription:
      'In Crowley\'s Qabalistic mathematics, Zero is not empty nothingness, but the unconditioned Void containing all potential in perfect equilibrium. When Zero divides into duality (+1 masculine force and -1 feminine form), the universe of experience is born.',
    keyInsights: [
      'Zero is the unmanifest Ain Soph contained in Atu 0 - The Fool.',
      'Duality arises when the Monad projects force and form.',
      'The ultimate spiritual goal is returning duality into zero equilibrium.',
    ],
    tags: ['Zero', '0=2', 'Mathematics', 'Creation'],
  },
];

type ActiveTab = 'tree' | 'paths' | 'essays' | 'formulas' | 'decans' | 'index' | 'glossary';

export const GlossaryAndIndex: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tree');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedSephira, setSelectedSephira] = useState<SephiraEntry>(SEPHIROT_DATA[0]); // Kether default
  const [selectedPath, setSelectedPath] = useState<PathEntry | null>(null);

  // Filtered 78-Card Master Index
  const filteredIndexCards = useMemo(() => {
    if (!globalSearch.trim()) return THOTH_DECK;
    const q = globalSearch.toLowerCase().trim();
    return THOTH_DECK.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.thothTitle.toLowerCase().includes(q) ||
        c.hebrewLetter?.name.toLowerCase().includes(q) ||
        c.astrology?.name.toLowerCase().includes(q) ||
        c.alchemy.element.toLowerCase().includes(q) ||
        c.treeOfLife.sephiraOrPath.toLowerCase().includes(q)
    );
  }, [globalSearch]);

  // Filtered Glossary Terms
  const filteredGlossary = useMemo(() => {
    if (!globalSearch.trim()) return GLOSSARY_TERMS;
    const q = globalSearch.toLowerCase().trim();
    return GLOSSARY_TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.shortDef.toLowerCase().includes(q) ||
        t.fullDescription.toLowerCase().includes(q) ||
        t.tags.some((tg) => tg.toLowerCase().includes(q))
    );
  }, [globalSearch]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="bg-[#0e0e11] p-6 rounded-sm border border-[#c5a059]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#c5a059] font-mono text-xs tracking-wide mb-1 uppercase">
              <BookOpen className="w-4 h-4 text-[#c5a059]" /> Hermetic Encyclopedia & Master Index
            </div>
            <h2 className="atu-font text-2xl md:text-3xl text-[#c5a059] font-bold tracking-wide">
              The Architecture of Consciousness
            </h2>
            <p className="text-stone-300 text-sm mt-1.5 max-w-3xl font-sans">
              Comprehensive reference guide mapping Crowley & Lady Frieda Harris’s Book of Thoth to the Tree of Life, 10 Sephirot, 22 Paths, 36 Decans, Four Qabalistic Worlds, and sacred alchemical formulas.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <div className="bg-[#050505] p-3 rounded-sm border border-white/10 text-center font-mono">
              <div className="text-[10px] text-stone-400">HERMETIC SYSTEM</div>
              <div className="text-sm font-bold text-[#c5a059]">Golden Dawn & Thelema</div>
            </div>
          </div>
        </div>

        {/* UNIVERSAL SEARCH BAR */}
        <div className="mt-6">
          <SearchInput
            value={globalSearch}
            onChange={setGlobalSearch}
            placeholder="Search encyclopedia across Sephirot, Paths, Decans, Essays, Terms, or 78 Cards..."
          />
        </div>

        {/* NAVIGATION TABS */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-3.5 py-2 rounded-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'tree'
                ? 'bg-[#c5a059] text-black font-bold shadow-md'
                : 'bg-[#050505] text-stone-300 hover:text-stone-100 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tree of Life & 10 Sephirot</span>
          </button>

          <button
            onClick={() => setActiveTab('paths')}
            className={`px-3.5 py-2 rounded-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'paths'
                ? 'bg-[#c5a059] text-black font-bold shadow-md'
                : 'bg-[#050505] text-stone-300 hover:text-stone-100 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>22 Paths & Major Arcana</span>
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3.5 py-2 rounded-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'formulas'
                ? 'bg-[#c5a059] text-black font-bold shadow-md'
                : 'bg-[#050505] text-stone-300 hover:text-stone-100 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>4 Worlds & Magical Formulas</span>
          </button>

          <button
            onClick={() => setActiveTab('essays')}
            className={`px-3.5 py-2 rounded-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'essays'
                ? 'bg-[#c5a059] text-black font-bold shadow-md'
                : 'bg-[#050505] text-stone-300 hover:text-stone-100 hover:bg-white/5 border border-white/10'
            }`}
          >
            <BookText className="w-3.5 h-3.5" />
            <span>Crowley Essay Chapters</span>
          </button>

          <button
            onClick={() => setActiveTab('decans')}
            className={`px-3.5 py-2 rounded-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'decans'
                ? 'bg-[#c5a059] text-black font-bold shadow-md'
                : 'bg-[#050505] text-stone-300 hover:text-stone-100 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>36 Astrological Decans</span>
          </button>

          <button
            onClick={() => setActiveTab('index')}
            className={`px-3.5 py-2 rounded-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'index'
                ? 'bg-[#c5a059] text-black font-bold shadow-md'
                : 'bg-[#050505] text-stone-300 hover:text-stone-100 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>78-Card Master Index</span>
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3.5 py-2 rounded-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'glossary'
                ? 'bg-[#c5a059] text-black font-bold shadow-md'
                : 'bg-[#050505] text-stone-300 hover:text-stone-100 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Key Term Glossary</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TREE OF LIFE & 10 SEPHIROT */}
      {activeTab === 'tree' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Visual Schematic */}
          <div className="lg:col-span-5">
            <TreeOfLifeDiagram
              selectedSephiraNumber={selectedSephira.number}
              onSelectSephira={(sephira) => setSelectedSephira(sephira)}
            />

            {/* Sephirot Selector List */}
            <div className="mt-4 bg-[#0e0e11] p-3 rounded-sm border border-white/10 space-y-1">
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest px-1 mb-1">
                Select Sephira by Number:
              </div>
              <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                {SEPHIROT_DATA.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => setSelectedSephira(s)}
                    className={`p-1.5 rounded-xs text-center border cursor-pointer transition ${
                      selectedSephira.number === s.number
                        ? 'bg-[#c5a059] text-black font-bold border-[#c5a059]'
                        : 'bg-[#050505] text-stone-300 border-white/10 hover:border-[#c5a059]/40'
                    }`}
                  >
                    {s.number === 0 ? "0 Da'ath" : `${s.number}. ${s.name}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Sephira Deep Dive Panel */}
          <div className="lg:col-span-7 bg-[#0e0e11] p-6 rounded-sm border border-[#c5a059]/40 shadow-xl space-y-5">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-serif font-bold text-[#c5a059] bg-[#050505] px-2.5 py-0.5 rounded border border-[#c5a059]/40">
                    {selectedSephira.hebrewName}
                  </span>
                  <Badge variant="gold">
                    {selectedSephira.number === 0 ? "Hidden Sephira" : `Sphere ${selectedSephira.number}`}
                  </Badge>
                  <span className="text-xs font-mono text-stone-400">{selectedSephira.pillar} Pillar</span>
                </div>
                <h3 className="atu-font text-2xl font-bold text-stone-100 mt-2">
                  {selectedSephira.name} ({selectedSephira.englishTranslation})
                </h3>
              </div>
              <div className="text-right font-mono text-xs text-[#c5a059]">
                <div>{selectedSephira.world}</div>
              </div>
            </div>

            <p className="text-sm text-stone-200 leading-relaxed font-sans">
              {selectedSephira.description}
            </p>

            {/* Qabalistic Attributions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-[#050505] p-4 rounded-sm border border-white/10">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Divine Name (God Name)</span>
                <span className="text-[#c5a059] font-bold">{selectedSephira.divineName}</span>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Archangel Governor</span>
                <span className="text-stone-200">{selectedSephira.archangel}</span>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Planetary Sphere</span>
                <span className="text-stone-200">{selectedSephira.planetarySphere}</span>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Color Scale</span>
                <span className="text-stone-200">{selectedSephira.colorScale}</span>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-white/5">
                <span className="text-stone-400 block text-[10px] uppercase">Spiritual Experience</span>
                <span className="text-emerald-400 font-semibold">{selectedSephira.spiritualExperience}</span>
              </div>
            </div>

            {/* Crowley's Specific Thoth Insight */}
            <div className="bg-[#121218] p-4 rounded-sm border border-[#c5a059]/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#c5a059] font-mono text-xs font-bold uppercase">
                <Feather className="w-3.5 h-3.5" /> Aleister Crowley’s Thoth Note
              </div>
              <p className="text-xs text-stone-300 italic font-sans leading-relaxed">
                "{selectedSephira.crowleyNote}"
              </p>
            </div>

            {/* Corresponding Tarot Cards */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#c5a059]" /> Tarot Arcana Assigned to {selectedSephira.name}:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSephira.tarotCards.map((cardLabel, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#050505] text-[#c5a059] border border-[#c5a059]/40 rounded-sm text-xs font-mono font-semibold"
                  >
                    {cardLabel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 22 PATHS & MAJOR ARCANA */}
      {activeTab === 'paths' && (
        <div className="space-y-6">
          <div className="bg-[#0e0e11] p-5 rounded-sm border border-[#c5a059]/40 space-y-2">
            <h3 className="atu-font text-xl text-[#c5a059] font-bold">
              The 22 Paths of Wisdom & The Major Arcana (Atu)
            </h3>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              The 22 Major Arcana correspond directly to the 22 paths connecting the Sephirot on the Tree of Life. Each path carries a sacred Hebrew letter, letter meaning, numerical value, element/planet, and Crowleyan magical insight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TREE_OF_LIFE_PATHS.map((path) => (
              <div
                key={path.pathNumber}
                onClick={() => setSelectedPath(path)}
                className={`p-4 rounded-sm border transition cursor-pointer space-y-2 ${
                  selectedPath?.pathNumber === path.pathNumber
                    ? 'bg-[#c5a059]/15 border-[#c5a059] shadow-lg ring-1 ring-[#c5a059]'
                    : 'bg-[#0e0e11] border-white/10 hover:border-[#c5a059]/60 hover:bg-[#121218]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-serif font-bold text-[#c5a059] bg-[#050505] px-2 py-0.5 rounded border border-[#c5a059]/40">
                      {path.hebrewLetter}
                    </span>
                    <div>
                      <h4 className="atu-font text-sm font-bold text-stone-100">{path.cardName}</h4>
                      <div className="text-[11px] font-mono text-stone-400">
                        Path {path.pathNumber} • {path.hebrewName} ({path.letterMeaning}) = {path.numericalValue}
                      </div>
                    </div>
                  </div>
                  <Badge variant="element">{path.astrologyOrElement}</Badge>
                </div>

                <div className="text-xs font-mono text-[#c5a059] bg-[#050505] p-2 rounded-xs border border-white/5">
                  Connections: {path.connectedSephirot}
                </div>

                <p className="text-xs text-stone-300 font-sans leading-relaxed line-clamp-2">
                  "{path.crowleyKeyInsight}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 4 WORLDS & SACRED FORMULAS */}
      {activeTab === 'formulas' && (
        <div className="space-y-8">
          {/* Qabalistic Worlds */}
          <div className="space-y-4">
            <SectionTitle
              title="The Four Qabalistic Worlds (YHVH)"
              subtitle="The fourfold ladder of creation cascading from pure archetypal flame to physical Earth."
              badge="Cosmology"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {QABALISTIC_WORLDS_DATA.map((w, idx) => (
                <div key={idx} className="bg-[#0e0e11] p-4 rounded-sm border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-serif font-bold text-[#c5a059]">{w.hebrewName}</span>
                    <Badge variant="gold">{w.tetragrammatonLetter}</Badge>
                  </div>

                  <h4 className="atu-font text-base font-bold text-stone-100">{w.name}</h4>
                  <div className="text-[11px] font-mono text-stone-400">{w.translation}</div>

                  <div className="pt-2 border-t border-white/10 space-y-1 text-xs font-mono">
                    <div className="text-[#c5a059]">Element: {w.element}</div>
                    <div className="text-stone-300">Court: {w.courtAgency}</div>
                    <div className="text-stone-300">Suit: {w.tarotSuit}</div>
                  </div>

                  <p className="text-xs text-stone-300 font-sans pt-1 leading-relaxed">
                    {w.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sacred Formulas */}
          <div className="space-y-4">
            <SectionTitle
              title="Esoteric & Alchemical Formulas"
              subtitle="The magical words, equations, and keys animating Crowley’s Thoth system."
              badge="Magick"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ESOTERIC_FORMULAS_DATA.map((f, idx) => (
                <div key={idx} className="bg-[#0e0e11] p-5 rounded-sm border border-[#c5a059]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="atu-font text-lg font-bold text-[#c5a059]">{f.formula}</h4>
                    <span className="text-[10px] font-mono bg-[#050505] text-stone-400 px-2 py-0.5 rounded border border-white/10">
                      {f.origin}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-stone-200 bg-[#050505] p-2 rounded-xs border border-white/5">
                    {f.meaning}
                  </div>

                  <p className="text-xs text-stone-300 font-sans leading-relaxed">
                    {f.symbolism}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-400">Function:</span>
                    <span className="text-emerald-400 font-semibold">{f.magicalFunction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CROWLEY ESSAY CHAPTERS */}
      {activeTab === 'essays' && (
        <div className="space-y-6">
          {CROWLEY_ESSAY_SECTIONS.map((essay) => (
            <div
              key={essay.id}
              className="bg-[#0e0e11] p-6 rounded-sm border border-[#c5a059]/40 space-y-4 shadow-xl"
            >
              <div className="border-b border-white/10 pb-3">
                <span className="text-xs font-mono text-[#c5a059] uppercase tracking-wider block">
                  {essay.subtitle}
                </span>
                <h3 className="atu-font text-2xl font-bold text-stone-100 mt-1">{essay.title}</h3>
              </div>

              <p className="text-sm text-stone-200 leading-relaxed font-sans">
                {essay.summary}
              </p>

              <div className="space-y-2 bg-[#050505] p-4 rounded-sm border border-white/10">
                <span className="text-xs font-mono text-[#c5a059] font-bold uppercase flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5" /> Key Crowley Passages:
                </span>
                {essay.keyPassages.map((passage, pIdx) => (
                  <p key={pIdx} className="text-xs text-stone-300 italic font-serif leading-relaxed">
                    {passage}
                  </p>
                ))}
              </div>

              <div className="text-xs font-sans text-stone-300 bg-[#121218] p-3 rounded-sm border border-[#c5a059]/20">
                <span className="font-mono text-[#c5a059] font-bold block mb-1">Philosophical Depth:</span>
                {essay.philosophicalDepth}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: 36 ASTROLOGICAL DECANS */}
      {activeTab === 'decans' && (
        <div className="space-y-4">
          <SectionTitle
            title="The 36 Astrological Decans of the Minor Arcana"
            subtitle="The 36 ten-degree segments of the Zodiac mapped directly to the 2 to 10 of each suit."
            badge="Astrology"
          />

          <div className="overflow-x-auto bg-[#0e0e11] rounded-sm border border-white/10">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#050505] text-[#c5a059] border-b border-white/10 uppercase">
                <tr>
                  <th className="p-3">Decan & Dates</th>
                  <th className="p-3">Ruling Planet</th>
                  <th className="p-3">Minor Arcana Card</th>
                  <th className="p-3">Thoth Title</th>
                  <th className="p-3">Esoteric Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {ASTROLOGY_DECANS_DATA.map((d, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="p-3 font-semibold text-stone-100">
                      <div>{d.decan}</div>
                      <div className="text-[10px] text-stone-400 font-sans">{d.dates}</div>
                    </td>
                    <td className="p-3 text-purple-300">{d.rulingPlanet}</td>
                    <td className="p-3 font-bold text-[#c5a059]">{d.cardName}</td>
                    <td className="p-3 italic">"{d.thothTitle}"</td>
                    <td className="p-3 font-sans text-stone-300 max-w-xs">{d.esotericMeaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: 78-CARD MASTER CROSS-INDEX */}
      {activeTab === 'index' && (
        <div className="space-y-4">
          <SectionTitle
            title="Master 78-Card Cross-Index"
            subtitle="Complete tabular reference connecting every card to its Atu, Sephira, Hebrew letter, Zodiac, Element, and Thoth Title."
            badge="Database"
          />

          <div className="overflow-x-auto bg-[#0e0e11] rounded-sm border border-white/10">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#050505] text-[#c5a059] border-b border-white/10 uppercase">
                <tr>
                  <th className="p-3">Card Name</th>
                  <th className="p-3">Thoth Title</th>
                  <th className="p-3">Type / Suit</th>
                  <th className="p-3">Hebrew Letter</th>
                  <th className="p-3">Astrology / Element</th>
                  <th className="p-3">Tree of Life</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {filteredIndexCards.map((card) => (
                  <tr key={card.id} className="hover:bg-[#121218] transition">
                    <td className="p-3 font-bold text-stone-100">
                      <a href={`#/card/${card.id}`} className="hover:text-[#c5a059] transition">
                        {card.name}
                      </a>
                    </td>
                    <td className="p-3 text-[#c5a059] italic">"{card.thothTitle}"</td>
                    <td className="p-3">
                      <Badge variant={card.type === 'major' ? 'major' : card.type === 'court' ? 'court' : 'minor'}>
                        {card.type === 'major' ? `ATU ${card.atuNumber ?? 0}` : card.suit || card.category}
                      </Badge>
                    </td>
                    <td className="p-3 font-serif font-bold text-[#c5a059]">
                      {card.hebrewLetter ? `${card.hebrewLetter.letter} (${card.hebrewLetter.name})` : 'N/A'}
                    </td>
                    <td className="p-3 text-purple-300">
                      {card.astrology?.name || card.alchemy.element}
                    </td>
                    <td className="p-3 text-stone-400">{card.treeOfLife.sephiraOrPath}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: GLOSSARY */}
      {activeTab === 'glossary' && (
        <div className="space-y-4">
          <SectionTitle
            title="Key Term Glossary"
            subtitle="Definitions of essential Hermetic, Qabalistic, and Thoth concepts."
            badge="Glossary"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((term) => (
              <div key={term.id} className="bg-[#0e0e11] p-5 rounded-sm border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="atu-font text-lg font-bold text-[#c5a059]">{term.term}</h4>
                  <Badge variant="outline">{term.category}</Badge>
                </div>

                <p className="text-xs font-mono text-stone-300 bg-[#050505] p-2.5 rounded-xs border border-white/5">
                  {term.shortDef}
                </p>

                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  {term.fullDescription}
                </p>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Key Insights:</span>
                  <ul className="list-disc list-inside text-xs text-stone-300 font-sans space-y-1">
                    {term.keyInsights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap gap-1">
                  {term.tags.map((tag, idx) => (
                    <span key={idx} className="text-[9px] font-mono bg-black/40 text-stone-400 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
