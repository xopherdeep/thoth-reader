<script lang="ts">
  import type { ThothReading } from './types';
  import { savedReadingsState } from './state/savedReadingsState.svelte';
  import MainLayout from './components/templates/MainLayout.svelte';
  import Compendium from './components/Compendium.svelte';
  import ReadingStudio from './components/ReadingStudio.svelte';
  import ReadingReport from './components/ReadingReport.svelte';
  import SavedReadings from './components/SavedReadings.svelte';
  import GlossaryAndIndex from './components/GlossaryAndIndex.svelte';
  import { PlusCircle } from 'lucide-svelte';

  let activeTab = $state<'studio' | 'compendium' | 'saved' | 'report' | 'glossary'>('studio');
  let selectedCardId = $state<string | null>(null);
  let activeReading = $state<ThothReading | null>(null);
  let isMobileMenuOpen = $state(false);

  $effect(() => {
    function handleHashChange() {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#/card/') || hash.startsWith('#card-')) {
        const cardId = hash.startsWith('#/card/')
          ? hash.replace('#/card/', '')
          : hash.replace('#card-', '');
        activeTab = 'compendium';
        selectedCardId = cardId;
      } else if (hash.startsWith('#/compendium') || hash === '#compendium') {
        activeTab = 'compendium';
        selectedCardId = null;
      } else if (hash.startsWith('#/saved') || hash === '#saved' || hash === '#archives') {
        activeTab = 'saved';
        selectedCardId = null;
      } else if (hash.startsWith('#/glossary') || hash === '#glossary' || hash === '#index') {
        activeTab = 'glossary';
        selectedCardId = null;
      } else if (hash.startsWith('#/report') || hash === '#report') {
        activeTab = 'report';
        selectedCardId = null;
      } else {
        activeTab = 'studio';
        selectedCardId = null;
      }
    }

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  });

  function navigateTo(route: string) {
    window.location.hash = route;
    isMobileMenuOpen = false;
  }

  function handleReadingCreated(newReading: ThothReading) {
    savedReadingsState.saveReading(newReading);
    activeReading = newReading;
    activeTab = 'report';
  }

  function handleDeleteReading(id: string) {
    savedReadingsState.deleteReading(id);
    if (activeReading?.id === id) {
      activeReading = null;
      activeTab = 'studio';
    }
  }
</script>

<MainLayout
  {activeTab}
  onNavigate={navigateTo}
  savedReadingsCount={savedReadingsState.savedReadings.length}
  {activeReading}
  {isMobileMenuOpen}
  setIsMobileMenuOpen={(open) => (isMobileMenuOpen = open)}
>
  {#if activeTab === 'studio'}
    <ReadingStudio onReadingCreated={handleReadingCreated} />
  {:else if activeTab === 'compendium'}
    <Compendium {selectedCardId} />
  {:else if activeTab === 'saved'}
    <SavedReadings
      readings={savedReadingsState.savedReadings}
      onSelectReading={(reading) => {
        activeReading = reading;
        activeTab = 'report';
      }}
      onDeleteReading={handleDeleteReading}
      onNewReading={() => navigateTo('#/studio')}
    />
  {:else if activeTab === 'glossary'}
    <GlossaryAndIndex />
  {:else if activeTab === 'report' && activeReading}
    <ReadingReport
      reading={activeReading}
      onBackToStudio={() => navigateTo('#/studio')}
    />
  {:else if activeTab === 'report' && !activeReading}
    <div class="text-center py-20 bg-[#0e0e11] rounded-sm border border-white/10 p-8 space-y-4">
      <h3 class="atu-font text-2xl text-[#c5a059] font-bold">No Active Reading Selected</h3>
      <p class="text-stone-300 text-sm max-w-md mx-auto font-serif">
        Cast a new spread inquiry in the Studio or select a saved reading from the Archives to view the full alchemical report.
      </p>
      <button
        onclick={() => navigateTo('#/studio')}
        class="px-6 py-3 bg-[#c5a059] text-black font-bold font-mono text-sm rounded-sm hover:brightness-110 transition inline-flex items-center gap-2 cursor-pointer"
      >
        <PlusCircle class="w-4 h-4" />
        <span>Cast New Reading Inquiry</span>
      </button>
    </div>
  {/if}
</MainLayout>
