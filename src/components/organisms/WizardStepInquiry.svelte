<script lang="ts">
  import { BookOpen, PenLine, Trash2, Check, ArrowRight } from 'lucide-svelte';
  import type { ThothCard } from '../../types';
  import MagicianFannedDeck from '../MagicianFannedDeck.svelte';

  interface Props {
    totalSteps: number;
    question: string;
    setQuestion: (q: string) => void;
    step1Phase: 'question' | 'significator';
    setStep1Phase: (phase: 'question' | 'significator') => void;
    deck: ThothCard[];
    selectedSignificatorId: string | null;
    setSelectedSignificatorId: (id: string | null) => void;
    onNextStep: () => void;
  }

  let {
    totalSteps,
    question,
    setQuestion,
    step1Phase,
    setStep1Phase,
    deck,
    selectedSignificatorId,
    setSelectedSignificatorId,
    onNextStep,
  }: Props = $props();

  const promptSuggestions = [
    'What alchemical transformation is required for my career path right now?',
    'What guidance does the Book of Thoth hold for my spiritual awakening?',
    'How can I integrate my shadow aspect in my personal relationships?',
    'What hidden forces are at play in my current life direction?',
  ];
</script>

<div class="space-y-8">
  {#if step1Phase === 'question'}
    <div class="space-y-6 relative z-10">
      <div class="space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.15em] uppercase bg-gradient-to-r from-[#c5a059]/12 to-[#c5a059]/5 text-[#c5a059] border border-[#c5a059]/25 shadow-[0_0_16px_rgba(197,160,89,0.1),_inset_0_1px_0_rgba(255,255,255,0.05)]">
          <BookOpen class="w-3.5 h-3.5" />
          <span>Step 1 of {totalSteps}</span>
          <span class="w-1 h-1 rounded-full bg-[#c5a059]/60"></span>
          <span>Set Your Narrative Intention</span>
        </div>

        <h2 class="atu-font text-2xl sm:text-[2rem] font-extrabold tracking-wide leading-[1.15]">
          <span class="bg-gradient-to-br from-[#f5ecd4] via-[#c5a059] to-[#8a6520] bg-clip-text text-transparent animate-shimmer" style="background-image: linear-gradient(105deg, #f5ecd4 0%, #c5a059 30%, #d6b77b 50%, #c5a059 70%, #8a6520 100%);">
            Write Your Chapter:
          </span>
          <br />
          <span class="text-stone-100/90 text-xl sm:text-2xl font-bold">
            What Question Do You Bring to the Book?
          </span>
        </h2>

        <p class="text-[13px] sm:text-sm text-stone-400 font-serif leading-[1.7] max-w-2xl">
          The Book of Thoth speaks in timeless parables, unfolding a narrative through archetypes, symbols, and trials. The cards you pull weave the narrative arc of your query.
        </p>

        <div class="animate-line-reveal h-px bg-gradient-to-r from-[#c5a059]/40 via-[#c5a059]/15 to-transparent"></div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2.5 text-xs font-mono text-stone-200/90 uppercase tracking-[0.12em] font-semibold">
            <div class="w-6 h-6 rounded-md bg-[#c5a059]/10 border border-[#c5a059]/25 flex items-center justify-center">
              <PenLine class="w-3.5 h-3.5 text-[#c5a059]" />
            </div>
            <span>Querent's Question / Focus Intention</span>
          </label>
          {#if question}
            <button
              onclick={() => setQuestion('')}
              class="text-[10px] font-mono text-stone-500 hover:text-[#c5a059] transition-all duration-200 flex items-center gap-1.5 bg-white/[0.03] hover:bg-[#c5a059]/10 px-2.5 py-1 rounded-md border border-white/8 hover:border-[#c5a059]/30 cursor-pointer"
            >
              <Trash2 class="w-3 h-3" /> Clear
            </button>
          {/if}
        </div>

        <div class="relative group">
          <textarea
            value={question}
            oninput={(e) => setQuestion(e.currentTarget.value)}
            placeholder="Focus your mind and enter your question or situation..."
            rows={3}
            class="w-full p-4 sm:p-5 bg-[#0a0a0e]/90 text-stone-100 placeholder-stone-500 rounded-xl border border-[#c5a059]/25 hover:border-[#c5a059]/50 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/40 text-sm sm:text-base font-serif tracking-wide shadow-inner focus:outline-none transition-all duration-200 backdrop-blur-md resize-none"
          ></textarea>
        </div>
      </div>

      <div class="space-y-2">
        <span class="text-[11px] font-mono text-stone-500 uppercase tracking-widest block">Sample Prompt Inquiries:</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {#each promptSuggestions as prompt (prompt)}
            <button
              onclick={() => setQuestion(prompt)}
              class="p-3 text-left text-xs font-serif text-stone-300 hover:text-[#c5a059] bg-[#0e0e11] hover:bg-[#121218] border border-white/5 hover:border-[#c5a059]/40 rounded-lg transition cursor-pointer"
            >
              "{prompt}"
            </button>
          {/each}
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <button
          onclick={() => setStep1Phase('significator')}
          class="px-6 py-3 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-black font-bold font-mono text-sm uppercase tracking-wider rounded-lg shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
        >
          <span>Choose Significator Card</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  {:else}
    <div class="space-y-6 relative z-10">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-mono text-[#c5a059] uppercase tracking-widest block">Step 1 (Part 2): Select Significator</span>
          <h3 class="atu-font text-xl font-bold text-stone-100">Fanned Magician Deck Selection</h3>
        </div>
        <button
          onclick={() => setStep1Phase('question')}
          class="text-xs font-mono text-stone-400 hover:text-[#c5a059] underline cursor-pointer"
        >
          Edit Question
        </button>
      </div>

      <MagicianFannedDeck
        {deck}
        {selectedSignificatorId}
        onSelectCard={(id) => setSelectedSignificatorId(id)}
      />

      <div class="flex justify-end pt-4">
        <button
          onclick={onNextStep}
          class="px-6 py-3 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-black font-bold font-mono text-sm uppercase tracking-wider rounded-lg shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
        >
          <span>Confirm & Proceed</span>
          <Check class="w-4 h-4" />
        </button>
      </div>
    </div>
  {/if}
</div>
