import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';

export interface WizardStepInfo {
  number: number;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
}

interface WizardStepperProps {
  steps: WizardStepInfo[];
  currentStep: number;
  maxVisitedStep: number;
  onStepClick: (stepNumber: number) => void;
  isGeneratingAI?: boolean;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  currentStep,
  maxVisitedStep,
  onStepClick,
  isGeneratingAI = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to active step on mobile
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentStep]);

  const totalSteps = steps.length;
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  const triggerHaptic = (pattern: number | number[] = 15) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe fallback if unsupported or blocked
      }
    }
  };

  return (
    <div className="bg-[#050505] border border-white/5 rounded-xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c5a059]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <span className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.2em] font-medium">
              Thoth Oracle Wizard
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-100 tracking-wide">
            {steps.find((s) => s.number === currentStep)?.title || 'Ritual Progression'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-1">Progress</div>
            <div className="text-[#c5a059] font-mono font-medium">{progressPercent}%</div>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-stone-100 font-serif text-lg bg-black shadow-inner">
            {currentStep}
          </div>
        </div>
      </div>

      {/* Stepper Container */}
      <div className="relative w-full z-10 pt-2 pb-2">
        {/* Background Track Line */}
        <div className="absolute top-8 left-[24px] right-[24px] md:left-[32px] md:right-[32px] h-[1px] bg-white/10 z-0" />
        
        {/* Active Progress Line */}
        <div className="absolute top-8 left-[24px] right-[24px] md:left-[32px] md:right-[32px] h-[1px] z-0 overflow-hidden flex">
          <motion.div
            className="h-full bg-[#c5a059]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // smooth ease out
          />
        </div>

        <div className="flex justify-between items-start w-full">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isNavigable = step.number <= maxVisitedStep && !isGeneratingAI;

            return (
              <div 
                key={step.number}
                className="relative z-10 flex flex-col items-center flex-1"
                data-active={isCurrent}
              >
                <button
                  type="button"
                  disabled={!isNavigable}
                  onClick={() => {
                    if (isNavigable) {
                      triggerHaptic();
                      onStepClick(step.number);
                    }
                  }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 outline-none relative z-10 ${
                    isCurrent
                      ? 'bg-[#0a0a0c] border-2 border-[#c5a059] text-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.2)]'
                      : isCompleted
                      ? 'bg-black border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059]/10 cursor-pointer'
                      : isNavigable
                      ? 'bg-black border border-stone-800 text-stone-400 hover:border-stone-500 hover:text-stone-300 cursor-pointer'
                      : 'bg-black border border-stone-900 text-stone-700 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4 md:w-5 md:h-5 stroke-[1.5]" />}
                </button>
                
                <div className="mt-3 text-center w-full max-w-[80px] md:max-w-[100px]">
                  <div className={`text-[10px] md:text-xs font-serif italic tracking-wider transition-colors duration-300 ${
                    isCurrent ? 'text-stone-100' : isCompleted ? 'text-[#c5a059]' : 'text-stone-500'
                  }`}>
                    Step {step.number}
                  </div>
                  <div className={`hidden md:block text-[9px] md:text-[10px] uppercase font-mono tracking-widest mt-1 md:mt-1.5 transition-colors duration-300 leading-tight ${
                    isCurrent ? 'text-[#c5a059]' : 'text-stone-600'
                  }`}>
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
