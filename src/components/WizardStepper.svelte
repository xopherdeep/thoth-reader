<script lang="ts">
  import type { Component } from 'svelte';
  import { Check, Sparkles } from 'lucide-svelte';

  export interface WizardStepInfo {
    number: number;
    title: string;
    subtitle?: string;
    icon: Component<any>;
  }

  interface Props {
    steps: WizardStepInfo[];
    currentStep: number;
    maxVisitedStep: number;
    onStepClick: (stepNumber: number) => void;
    isGeneratingAI?: boolean;
  }

  let {
    steps,
    currentStep,
    maxVisitedStep,
    onStepClick,
    isGeneratingAI = false,
  }: Props = $props();

  let totalSteps = $derived(steps.length);
  let progressPercent = $derived(Math.min(100, Math.round((currentStep / totalSteps) * 100)));
</script>

<div class="bg-[#050505] border border-white/5 rounded-xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
  <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c5a059]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

  <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 relative z-10">
    <div>
      <div class="flex items-center gap-2 mb-2">
        <Sparkles class="w-4 h-4 text-[#c5a059]" />
        <span class="text-xs font-mono text-[#c5a059] uppercase tracking-[0.2em] font-medium">
          Thoth Oracle Wizard
        </span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-serif text-stone-100 tracking-wide">
        {steps.find((s) => s.number === currentStep)?.title || 'Ritual Progression'}
      </h2>
    </div>
    <div class="flex items-center gap-4">
      <div class="text-right">
        <div class="text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-1">Progress</div>
        <div class="text-[#c5a059] font-mono font-medium">{progressPercent}%</div>
      </div>
      <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-stone-100 font-serif text-lg bg-black shadow-inner">
        {currentStep}
      </div>
    </div>
  </div>

  <div class="relative w-full z-10 pt-2 pb-2">
    <div class="absolute top-8 left-[24px] right-[24px] md:left-[32px] md:right-[32px] h-[1px] bg-white/10 z-0"></div>

    <div class="flex justify-between items-start w-full">
      {#each steps as step (step.number)}
        {@const Icon = step.icon}
        {@const isCurrent = currentStep === step.number}
        {@const isCompleted = currentStep > step.number}

        <button
          onclick={() => onStepClick(step.number)}
          class="flex flex-col items-center group cursor-pointer border-none bg-transparent"
        >
          <div class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 z-10 {isCurrent
            ? 'bg-[#c5a059] text-black shadow-lg scale-110'
            : isCompleted
            ? 'bg-[#050505] text-[#c5a059] border border-[#c5a059]/40'
            : 'bg-[#050505] text-stone-600 border border-white/10'}"
          >
            {#if isCompleted}
              <Check class="w-5 h-5" />
            {:else}
              <Icon class="w-5 h-5" />
            {/if}
          </div>
          <span class="text-xs font-mono mt-2 transition-colors {isCurrent ? 'text-[#c5a059] font-bold' : 'text-stone-400'}">
            Step {step.number}
          </span>
        </button>
      {/each}
    </div>
  </div>
</div>
