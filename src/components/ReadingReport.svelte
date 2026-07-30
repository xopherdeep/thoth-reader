<script lang="ts">
  import QRCode from 'qrcode';
  import type { ThothReading, PoeticNarrative } from '../types';
  import TarotCardView from './TarotCardView.svelte';
  import NarrativeSynthesizer from './NarrativeSynthesizer.svelte';
  import SynchronicityAnalysisView from './SynchronicityAnalysisView.svelte';
  import FullScreenStorybook from './FullScreenStorybook.svelte';
  import {
    QrCode,
    Share2,
    Download,
    Copy,
    Check,
    Sparkles,
    BookOpen,
    Compass,
    Flame,
    Feather,
    ArrowLeft,
    Calendar,
    Play,
  } from 'lucide-svelte';

  interface Props {
    reading: ThothReading;
    onBackToStudio?: () => void;
    isSharedView?: boolean;
  }

  let { reading, onBackToStudio, isSharedView = false }: Props = $props();

  let activeReading = $state<ThothReading>(reading);
  let qrDataUrl = $state<string>('');
  let copiedLink = $state(false);
  let isStorybookOpen = $state(false);

  let shareableUrl = $derived(`${window.location.origin}${window.location.pathname}?readingId=${reading.id}`);

  $effect(() => {
    QRCode.toDataURL(shareableUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => (qrDataUrl = url))
      .catch((err) => console.error('QR Code error:', err));
  });

  function handleNarrativeUpdated(narrative: PoeticNarrative) {
    activeReading = {
      ...activeReading,
      poeticNarrative: narrative,
      aiInterpretation: activeReading.aiInterpretation
        ? { ...activeReading.aiInterpretation, poeticNarrative: narrative }
        : activeReading.aiInterpretation,
    };
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareableUrl);
    copiedLink = true;
    setTimeout(() => (copiedLink = false), 3000);
  }

  function handleDownloadQR() {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `thoth-reading-qr-${reading.id}.png`;
    a.click();
  }

  let interpretation = $derived(activeReading.aiInterpretation);
</script>

<div class="max-w-4xl mx-auto space-y-6">
  {#if isStorybookOpen}
    <FullScreenStorybook
      reading={activeReading}
      onClose={() => (isStorybookOpen = false)}
      onNarrativeUpdated={handleNarrativeUpdated}
    />
  {/if}

  {#if onBackToStudio}
    <div class="flex items-center justify-between">
      <button
        onclick={onBackToStudio}
        class="inline-flex items-center gap-2 text-stone-400 hover:text-[#c5a059] text-xs font-mono uppercase tracking-wider transition cursor-pointer"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Return to Reading Studio</span>
      </button>

      <button
        onclick={() => (isStorybookOpen = true)}
        class="px-4 py-2 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-stone-950 font-mono font-bold text-xs uppercase tracking-widest rounded-sm shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
      >
        <Play class="w-4 h-4 fill-current" /> Launch Visual Storybook
      </button>
    </div>
  {/if}

  <div class="bg-[#0e0e11] p-6 sm:p-8 rounded-sm border border-[#c5a059]/40 shadow-2xl space-y-4">
    <div class="flex items-center justify-between border-b border-white/10 pb-3">
      <div class="flex items-center gap-2 text-[#c5a059] font-mono text-xs uppercase tracking-widest">
        <Flame class="w-4 h-4 text-[#c5a059]" /> Alchemical Transmutation Report
      </div>
      <div class="text-xs font-mono text-stone-400 flex items-center gap-1">
        <Calendar class="w-3.5 h-3.5" />
        {new Date(activeReading.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' })}
      </div>
    </div>

    <div class="space-y-1">
      <div class="text-xs font-mono text-stone-400 uppercase">Primary Inquiry Question</div>
      <h1 class="atu-font text-2xl sm:text-3xl font-bold text-[#c5a059]">
        "{activeReading.question}"
      </h1>
    </div>

    {#if activeReading.deckNote}
      <div class="text-xs text-stone-400 font-serif italic bg-[#050505] p-3 rounded-sm border border-white/5">
        Notes: {activeReading.deckNote}
      </div>
    {/if}
  </div>

  <div class="space-y-4">
    <div class="flex items-center justify-between px-1">
      <h3 class="atu-font text-lg font-bold text-[#c5a059] flex items-center gap-2">
        <Compass class="w-5 h-5" /> Pulled Card Sequence ({activeReading.pulledCards.length} Cards)
      </h3>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
      {#each activeReading.pulledCards as card, idx (card.id)}
        <TarotCardView {card} displayMode="thoth" size="md" stepNumber={idx + 1} />
      {/each}
    </div>
  </div>

  {#if interpretation}
    <div class="bg-[#0e0e11] p-6 sm:p-8 rounded-sm border border-[#c5a059]/40 shadow-2xl space-y-6">
      <h2 class="atu-font text-xl text-[#c5a059] font-bold border-b border-white/10 pb-3 flex items-center gap-2">
        <Feather class="w-5 h-5" /> Crowleyan Oracle Interpretation
      </h2>

      <div class="space-y-2">
        <h4 class="text-xs font-mono uppercase text-stone-400 font-bold">Synthesized Overview</h4>
        <p class="text-stone-100 text-base leading-relaxed font-serif bg-[#050505] p-5 rounded-sm border border-white/5">
          {interpretation.overview}
        </p>
      </div>

      {#if interpretation.elementalBalancing}
        <div class="space-y-2">
          <h4 class="text-xs font-mono uppercase text-stone-400 font-bold">Elemental Dignity & Alchemy</h4>
          <p class="text-stone-300 text-sm leading-relaxed font-serif bg-[#050505] p-4 rounded-sm border border-white/5">
            {interpretation.elementalBalancing}
          </p>
        </div>
      {/if}

      {#if interpretation.actionableAdvice}
        <div class="space-y-2">
          <h4 class="text-xs font-mono uppercase text-stone-400 font-bold">Practical Work / Will Alignment</h4>
          <p class="text-stone-300 text-sm leading-relaxed font-serif bg-[#050505] p-4 rounded-sm border border-white/5">
            {interpretation.actionableAdvice}
          </p>
        </div>
      {/if}
    </div>
  {/if}

  <SynchronicityAnalysisView pulledCards={activeReading.pulledCards} />

  <!-- QR Code Share Card -->
  <div class="bg-[#0e0e11] p-6 sm:p-8 rounded-sm border border-[#c5a059]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="space-y-3 max-w-md">
      <div class="flex items-center gap-2 text-[#c5a059] font-mono text-xs uppercase tracking-wider">
        <QrCode class="w-4 h-4" /> Share & Archive QR Code
      </div>
      <h3 class="atu-font text-xl text-stone-100 font-bold">Scan to Share Reading</h3>
      <p class="text-xs text-stone-400 font-serif leading-relaxed">
        Scan this QR code with your mobile phone or share the permanent URL to load this reading report anywhere.
      </p>

      <div class="flex flex-wrap items-center gap-3 pt-2">
        <button
          onclick={handleCopyLink}
          class="px-4 py-2 bg-[#050505] hover:bg-white/10 text-stone-200 border border-white/20 text-xs font-mono uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition cursor-pointer"
        >
          {#if copiedLink}<Check class="w-4 h-4 text-emerald-400" />{:else}<Copy class="w-4 h-4" />{/if}
          <span>{copiedLink ? 'Copied Link!' : 'Copy Share URL'}</span>
        </button>

        {#if qrDataUrl}
          <button
            onclick={handleDownloadQR}
            class="px-4 py-2 bg-[#c5a059]/20 text-[#c5a059] hover:bg-[#c5a059]/30 border border-[#c5a059]/40 text-xs font-mono uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download class="w-4 h-4" /> Download QR
          </button>
        {/if}
      </div>
    </div>

    {#if qrDataUrl}
      <div class="p-3 bg-white rounded-sm shadow-xl shrink-0">
        <img src={qrDataUrl} alt="Reading QR Code" class="w-40 h-40 object-contain" />
      </div>
    {/if}
  </div>
</div>
