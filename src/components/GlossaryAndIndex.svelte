<script lang="ts">
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
    type SephiraEntry,
    type PathEntry,
  } from '../data/thothEncyclopediaData';
  import TreeOfLifeDiagram from './molecules/TreeOfLifeDiagram.svelte';
  import SearchInput from './atoms/SearchInput.svelte';
  import Badge from './atoms/Badge.svelte';
  import Button from './atoms/Button.svelte';
  import SectionTitle from './atoms/SectionTitle.svelte';
  import TarotCardView from './TarotCardView.svelte';
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
    ChevronRight,
    Table,
    Feather,
    Quote,
    Zap,
  } from 'lucide-svelte';

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

  const GLOSSARY_TERMS: GlossaryTerm[] = [
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
  ];

  type ActiveTab = 'tree' | 'paths' | 'essays' | 'formulas' | 'decans' | 'index' | 'glossary';

  let activeTab = $state<ActiveTab>('tree');
  let globalSearch = $state('');
  let selectedSephira = $state<SephiraEntry>(SEPHIROT_DATA[0]);
  let selectedPath = $state<PathEntry | null>(null);

  let filteredIndexCards = $derived.by(() => {
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
  });

  let filteredGlossaryTerms = $derived.by(() => {
    if (!globalSearch.trim()) return GLOSSARY_TERMS;
    const q = globalSearch.toLowerCase().trim();
    return GLOSSARY_TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.shortDef.toLowerCase().includes(q) ||
        t.fullDescription.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });
</script>

<div class="space-y-6">
  <div class="bg-[#0e0e11] p-6 sm:p-8 rounded-sm border border-[#c5a059]/40 shadow-2xl space-y-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 text-[#c5a059] font-mono text-xs uppercase tracking-[0.2em] mb-1">
          <BookOpen class="w-4 h-4 text-[#c5a059]" /> Hermetic Encyclopedia & Master Index
        </div>
        <h1 class="atu-font text-2xl sm:text-4xl text-[#c5a059] font-bold tracking-wider">
          GLOSSARY & HERMETIC INDEX
        </h1>
        <p class="text-stone-300 text-sm mt-1 max-w-2xl font-serif">
          Interactive map of human consciousness, Tree of Life paths, Crowley's Book of Thoth essays, and 78-card master catalog.
        </p>
      </div>

      <div class="w-full md:w-80">
        <SearchInput
          value={globalSearch}
          onChange={(v) => (globalSearch = v)}
          placeholder="Search all terms, paths, symbols..."
        />
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/10 scrollbar-none">
      <button
        onclick={() => (activeTab = 'tree')}
        class="px-3.5 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition whitespace-nowrap cursor-pointer {activeTab === 'tree'
          ? 'bg-[#c5a059] text-stone-950 font-bold'
          : 'bg-[#050505] text-stone-400 border border-white/10 hover:text-stone-200'}"
      >
        <Flame class="w-3.5 h-3.5 inline mr-1" /> Tree of Life
      </button>

      <button
        onclick={() => (activeTab = 'paths')}
        class="px-3.5 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition whitespace-nowrap cursor-pointer {activeTab === 'paths'
          ? 'bg-[#c5a059] text-stone-950 font-bold'
          : 'bg-[#050505] text-stone-400 border border-white/10 hover:text-stone-200'}"
      >
        <Compass class="w-3.5 h-3.5 inline mr-1" /> 22 Paths
      </button>

      <button
        onclick={() => (activeTab = 'essays')}
        class="px-3.5 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition whitespace-nowrap cursor-pointer {activeTab === 'essays'
          ? 'bg-[#c5a059] text-stone-950 font-bold'
          : 'bg-[#050505] text-stone-400 border border-white/10 hover:text-stone-200'}"
      >
        <BookText class="w-3.5 h-3.5 inline mr-1" /> Crowley Essays
      </button>

      <button
        onclick={() => (activeTab = 'index')}
        class="px-3.5 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition whitespace-nowrap cursor-pointer {activeTab === 'index'
          ? 'bg-[#c5a059] text-stone-950 font-bold'
          : 'bg-[#050505] text-stone-400 border border-white/10 hover:text-stone-200'}"
      >
        <Table class="w-3.5 h-3.5 inline mr-1" /> 78-Card Index
      </button>

      <button
        onclick={() => (activeTab = 'glossary')}
        class="px-3.5 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition whitespace-nowrap cursor-pointer {activeTab === 'glossary'
          ? 'bg-[#c5a059] text-stone-950 font-bold'
          : 'bg-[#050505] text-stone-400 border border-white/10 hover:text-stone-200'}"
      >
        <Brain class="w-3.5 h-3.5 inline mr-1" /> Consciousness Glossary
      </button>
    </div>
  </div>

  <!-- TAB CONTENT -->
  {#if activeTab === 'tree'}
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-6">
        <TreeOfLifeDiagram
          selectedSephiraNumber={selectedSephira.number}
          onSelectSephira={(s) => (selectedSephira = s)}
        />
      </div>

      <div class="lg:col-span-6 bg-[#0e0e11] p-6 rounded-sm border border-[#c5a059]/40 space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <div class="text-xs font-mono text-[#c5a059] uppercase font-bold">
              Sephira {selectedSephira.number}
            </div>
            <h3 class="atu-font text-2xl text-stone-100 font-bold">
              {selectedSephira.name} ({selectedSephira.hebrew})
            </h3>
          </div>
          <div class="text-right font-mono text-xs text-stone-400">
            <div>"{selectedSephira.meaning}"</div>
            <div class="text-[#c5a059] font-bold">{selectedSephira.pillar} Pillar</div>
          </div>
        </div>

        <p class="text-sm text-stone-300 font-serif leading-relaxed bg-[#050505] p-4 rounded-sm border border-white/5">
          {selectedSephira.description}
        </p>

        <div class="grid grid-cols-2 gap-3 text-xs font-mono">
          <div class="bg-[#050505] p-3 rounded-sm border border-white/10">
            <span class="text-stone-500 uppercase block text-[10px]">Archangel / Divine Name</span>
            <span class="text-stone-200 font-bold">{selectedSephira.divineName}</span>
          </div>
          <div class="bg-[#050505] p-3 rounded-sm border border-white/10">
            <span class="text-stone-500 uppercase block text-[10px]">Atziluthic Color</span>
            <span class="text-[#c5a059] font-bold">{selectedSephira.color}</span>
          </div>
        </div>
      </div>
    </div>
  {:else if activeTab === 'paths'}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each TREE_OF_LIFE_PATHS as path (path.number)}
        <div class="bg-[#0e0e11] p-4 rounded-sm border border-white/10 hover:border-[#c5a059]/40 transition space-y-2">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-[#c5a059] font-bold">Path {path.number}: {path.sephirotConnected}</span>
            <span class="text-stone-400 font-serif font-bold text-sm">{path.hebrewLetter} ({path.letterName})</span>
          </div>
          <div class="atu-font font-bold text-stone-100">{path.atuTitle}</div>
          <p class="text-xs text-stone-300 font-serif line-clamp-2">{path.description}</p>
        </div>
      {/each}
    </div>
  {:else if activeTab === 'index'}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {#each filteredIndexCards as card (card.id)}
        <TarotCardView {card} displayMode="thoth" size="md" showDetailsOnClick={true} />
      {/each}
    </div>
  {:else if activeTab === 'glossary'}
    <div class="space-y-4">
      {#each filteredGlossaryTerms as term (term.id)}
        <div class="bg-[#0e0e11] p-6 rounded-sm border border-white/10 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="atu-font text-lg font-bold text-[#c5a059]">{term.term}</h3>
            <span class="text-[10px] font-mono uppercase bg-[#050505] px-2 py-0.5 rounded border border-[#c5a059]/30 text-stone-400">
              {term.category}
            </span>
          </div>
          <p class="text-sm text-stone-200 font-serif leading-relaxed">{term.fullDescription}</p>
          <div class="flex flex-wrap gap-1.5 pt-2">
            {#each term.tags as tag (tag)}
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-stone-400">#{tag}</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
