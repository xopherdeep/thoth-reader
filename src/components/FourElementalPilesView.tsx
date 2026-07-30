import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FourPilesCut, TetragrammatonPile, cutDeckWithCustomRatios } from "../utils/thothSpread";
import { THOTH_CARD_BACK_IMAGE, getThothCardImageUrl } from "../utils/cardImageUrls";
import { ThothCard } from "../types";
import { THOTH_DECK } from "../data/thothCards";
import {
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Layers,
  Scissors,
  Zap,
  Crosshair,
  Compass,
  Eye,
  Crown
} from "lucide-react";

interface FourElementalPilesViewProps {
  fourPilesCut: FourPilesCut;
  selectedPileId: string | null;
  onSelectPile: (pileId: string) => void;
  onNextStep: () => void;
  onBackToShuffle: () => void;
  onPerformCutAgain: () => void;
  deck?: ThothCard[];
  onCustomCutPiles?: (result: FourPilesCut) => void;
  selectedSignificatorId?: string | null;
}

export const FourElementalPilesView: React.FC<FourElementalPilesViewProps> = ({
  fourPilesCut,
  selectedPileId,
  onSelectPile,
  onNextStep,
  onBackToShuffle,
  onPerformCutAgain,
  deck = THOTH_DECK,
  onCustomCutPiles,
  selectedSignificatorId
}) => {
  // Minigame Cut Stages: 1 = Main Cut (2 Stacks), 2 = Cut Stack A (Yod/Vau), 3 = Cut Stack B (Heh/Heh Final), 'done' = Final Piles
  const [cutStage, setCutStage] = useState<1 | 2 | 3 | "done">(1);
  const [markerPos, setMarkerPos] = useState<number>(50);
  const [isCutMoving, setIsCutMoving] = useState<boolean>(true);
  const [isSlicingAnimation, setIsSlicingAnimation] = useState<boolean>(false);

  // Stored cut ratios (bounded 0.30 - 0.70)
  const [ratio1, setRatio1] = useState<number>(0.5);
  const [ratio2, setRatio2] = useState<number>(0.5);
  const [ratio3, setRatio3] = useState<number>(0.5);

  const speedRef = useRef<number>(1.4);
  const dirRef = useRef<number>(1);

  // Haptic feedback helper
  const triggerHaptic = (pattern: number | number[] = 15) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe fallback
      }
    }
  };

  // Oscillating pendulum timing loop for video-game marker
  useEffect(() => {
    if (!isCutMoving || cutStage === "done") return;
    let animId: number;
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const delta = (now - lastTime) / 16.66;
      lastTime = now;

      setMarkerPos((prev) => {
        let next = prev + dirRef.current * speedRef.current * delta;
        if (next >= 100) {
          next = 100;
          dirRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          dirRef.current = 1;
        }
        return next;
      });

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [isCutMoving, cutStage]);

  // Handle Spacebar / Enter keypress for cutting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "Enter") && isCutMoving && cutStage !== "done") {
        e.preventDefault();
        handleExecuteCut();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCutMoving, cutStage, markerPos, ratio1, ratio2]);

  // Execute the cut tap action
  const handleExecuteCut = () => {
    if (!isCutMoving || cutStage === "done") return;

    triggerHaptic([30, 50, 30]);
    setIsCutMoving(false);
    setIsSlicingAnimation(true);

    // Map marker 0..100 to 0.30..0.70 ratio
    const currentRatio = 0.3 + (markerPos / 100) * 0.4;

    setTimeout(() => {
      setIsSlicingAnimation(false);

      if (cutStage === 1) {
        setRatio1(currentRatio);
        setCutStage(2);
        setMarkerPos(50);
        setIsCutMoving(true);
      } else if (cutStage === 2) {
        setRatio2(currentRatio);
        setCutStage(3);
        setMarkerPos(50);
        setIsCutMoving(true);
      } else if (cutStage === 3) {
        setRatio3(currentRatio);
        const finalResult = cutDeckWithCustomRatios(deck, ratio1, ratio2, currentRatio);
        if (onCustomCutPiles) {
          onCustomCutPiles(finalResult);
        }
        setCutStage("done");
      }
    }, 600);
  };

  // Reset interactive minigame
  const handleRestartMinigame = () => {
    setCutStage(1);
    setMarkerPos(50);
    setRatio1(0.5);
    setRatio2(0.5);
    setRatio3(0.5);
    setIsCutMoving(true);
    setIsSlicingAnimation(false);
  };

  // Math helper for real-time cut accuracy & pile card calculations
  const totalDeckCount = deck.length || 78;
  const currentRatio = 0.3 + (markerPos / 100) * 0.4;
  const pileAPercent = Math.round(currentRatio * 100);
  const pileBPercent = 100 - pileAPercent;
  const deviationFromCenter = Math.abs(markerPos - 50);
  const accuracyScore = Math.max(0, Math.round(100 - deviationFromCenter * 2));

  // Dynamic stack counts calculation for Left-side tracker
  const stackACount = Math.round(totalDeckCount * (cutStage > 1 ? ratio1 : currentRatio));
  const stackBCount = totalDeckCount - stackACount;

  const yodCount =
    cutStage > 2
      ? Math.round(stackACount * ratio2)
      : Math.round(stackACount * (cutStage === 2 ? currentRatio : 0.5));
  const vauCount = stackACount - yodCount;

  const hehCount =
    cutStage === 3 ? Math.round(stackBCount * currentRatio) : Math.round(stackBCount * 0.5);
  const hehFinalCount = stackBCount - hehCount;

  const getAccuracyBadge = () => {
    if (accuracyScore >= 95) {
      return {
        label: "PERFECT CENTER CUT!",
        color:
          "text-amber-400 border-amber-500/50 bg-amber-950/80 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
      };
    } else if (accuracyScore >= 80) {
      return {
        label: "BALANCED SACRED CUT",
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/60"
      };
    } else {
      return {
        label: "ASYMMETRIC HERMETIC CUT",
        color: "text-[#c5a059] border-[#c5a059]/40 bg-[#c5a059]/10"
      };
    }
  };

  const accuracyBadge = getAccuracyBadge();

  const getPileVisualConfig = (id: string) => {
    switch (id) {
      case "yod":
        return {
          icon: <Flame className="w-5 h-5 text-rose-400" />,
          glow: "shadow-[0_0_30px_rgba(244,63,94,0.35)] border-rose-500/70 ring-1 ring-rose-500/40",
          accentColor: "#f43f5e",
          bgBadge: "bg-rose-950/90 text-rose-300 border-rose-500/40",
          bottomGradient: "from-rose-600/30 via-rose-950/15 to-transparent",
          symbol: "Fire",
          letterSymbol: "F",
          hebrewLabel: "Yod (Hand)",
          answersText: "Passion, Will & Creative Energy"
        };
      case "heh":
        return {
          icon: <Droplets className="w-5 h-5 text-sky-400" />,
          glow: "shadow-[0_0_30px_rgba(56,189,248,0.35)] border-sky-500/70 ring-1 ring-sky-500/40",
          accentColor: "#38bdf8",
          bgBadge: "bg-sky-950/90 text-sky-300 border-sky-500/40",
          bottomGradient: "from-sky-600/30 via-sky-950/15 to-transparent",
          symbol: "Water",
          letterSymbol: "W",
          hebrewLabel: "Heh (Window)",
          answersText: "Relationships, Emotion & Intuition"
        };
      case "vau":
        return {
          icon: <Wind className="w-5 h-5 text-amber-300" />,
          glow: "shadow-[0_0_30px_rgba(252,211,77,0.35)] border-amber-400/70 ring-1 ring-amber-400/40",
          accentColor: "#fcd34d",
          bgBadge: "bg-amber-950/90 text-amber-300 border-amber-400/40",
          bottomGradient: "from-amber-500/30 via-amber-950/15 to-transparent",
          symbol: "Air",
          letterSymbol: "A",
          hebrewLabel: "Vau (Nail)",
          answersText: "Education, Career, Strategy & Intellect"
        };
      case "heh_final":
        return {
          icon: <Mountain className="w-5 h-5 text-emerald-400" />,
          glow: "shadow-[0_0_30px_rgba(52,211,153,0.35)] border-emerald-500/70 ring-1 ring-emerald-500/40",
          accentColor: "#34d399",
          bgBadge: "bg-emerald-950/90 text-emerald-300 border-emerald-500/40",
          bottomGradient: "from-emerald-600/30 via-emerald-950/15 to-transparent",
          symbol: "Earth",
          letterSymbol: "E",
          hebrewLabel: "Heh Final (Window)",
          answersText: "Physical, Material & Monetary Realities"
        };
      default:
        return {
          icon: <Layers className="w-5 h-5 text-[#c5a059]" />,
          glow: "border-[#c5a059]/40",
          accentColor: "#c5a059",
          bgBadge: "bg-black/60 text-[#c5a059] border-white/10",
          bottomGradient: "from-[#c5a059]/20 via-[#c5a059]/5 to-transparent",
          symbol: "Elemental",
          letterSymbol: "B",
          hebrewLabel: "Tetragrammaton Book",
          answersText: "General Inquiry"
        };
    }
  };

  const selectedPile =
    fourPilesCut.piles.find((p) => p.id === selectedPileId) || fourPilesCut.piles[0];

  return (
    <div className="relative bg-[#0a0a0e]/95 backdrop-blur-2xl border border-[#c5a059]/25 rounded-2xl p-6 sm:p-9 shadow-[0_16px_60px_rgba(0,0,0,0.9)] space-y-7 overflow-hidden corner-ornament">
      {/* Background Ambient Glow */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none animate-ambient-pulse"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(197,160,89,0.12) 0%, transparent 70%)"
        }}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_12px_rgba(197,160,89,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Step 4 • Elemental Interactive
              4-Pile Cut
            </span>
          </div>
          <h3 className="atu-font text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#f3e7c4] via-[#c5a059] to-[#a37d35] bg-clip-text text-transparent tracking-wide">
            {cutStage === "done"
              ? "Choose Your Elemental Book of Inquiry"
              : cutStage === 1
                ? "First Cut: Slice 78-Card Deck into Fire/Air & Water/Earth Books"
                : cutStage === 2
                  ? "Second Cut: Split Fire & Air Books"
                  : "Third Cut: Split Water & Earth Books"}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300/90 font-serif leading-relaxed max-w-2xl mt-1">
            {cutStage === "done"
              ? "The 78 cards are cut into four elemental books representing Will (Fire), Emotion (Water), Intellect (Air), and Material Reality (Earth)."
              : "Time your cut! Tap the button or press Spacebar when the marker aligns with your intended elemental cut ratio."}
          </p>
        </div>

        <div className="bg-[#050508]/90 px-4 py-2.5 rounded-xl border border-[#c5a059]/30 flex items-center gap-3 shrink-0 shadow-inner">
          <span className="text-[10px] text-stone-400 font-mono uppercase block">Sacred Name:</span>
          <span className="text-sm sm:text-base font-serif text-[#c5a059] font-bold tracking-[0.25em] drop-shadow">
            י • ה • ו • ה
          </span>
        </div>
      </div>

      {/* INTERACTIVE TIMING MINIGAME (STAGES 1, 2, 3) */}
      {cutStage !== "done" && (
        <motion.div
          key={`cut-stage-${cutStage}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Stage Progress Indicator & Precision Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                Cut Sequence Progress:
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${cutStage === 1 ? "bg-[#c5a059] text-stone-950 border-[#c5a059]" : "bg-white/5 text-stone-400 border-white/10"}`}
                >
                  1. Deck
                </span>
                <span className="text-stone-600">→</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${cutStage === 2 ? "bg-[#c5a059] text-stone-950 border-[#c5a059]" : "bg-white/5 text-stone-400 border-white/10"}`}
                >
                  2. Fire / Air
                </span>
                <span className="text-stone-600">→</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${cutStage === 3 ? "bg-[#c5a059] text-stone-950 border-[#c5a059]" : "bg-white/5 text-stone-400 border-white/10"}`}
                >
                  3. Water / Earth
                </span>
              </div>
            </div>

            <span
              className={`text-[10px] font-mono px-3 py-1 rounded-full border font-bold uppercase ${accuracyBadge.color}`}
            >
              {accuracyBadge.label}
            </span>
          </div>

          {/* 2-COLUMN MINIGAME LAYOUT: LEFT SIDE (STACK TRACKER) & RIGHT SIDE (ARENA) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT SIDE: DYNAMIC DECK STACK TRACKER & CARD COUNTS */}
            <div className="lg:col-span-4 bg-[#050509]/90 border border-[#c5a059]/30 rounded-xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Layers className="w-4 h-4 text-[#c5a059]" />
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-200 font-bold">
                  Elemental Books & Card Counts
                </h4>
              </div>

              <div className="space-y-3">
                {/* Stage 1 Main Deck Tracker */}
                <div
                  className={`p-3 rounded-lg border transition-all ${cutStage === 1 ? "bg-[#c5a059]/15 border-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.15)]" : "bg-white/[0.03] border-white/10 opacity-70"}`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-stone-200">Main Thoth Deck</span>
                    <span className="px-2 py-0.5 rounded bg-black/60 text-[#c5a059] font-bold border border-white/10">
                      78 CARDS
                    </span>
                  </div>
                  <p className="text-[10px] font-serif text-stone-400 mt-1">
                    {cutStage === 1
                      ? "Ready to cut into Fire/Air & Water/Earth Books"
                      : "Cut into Fire/Air & Water/Earth Books"}
                  </p>
                </div>

                {/* Fire & Air Books */}
                <div
                  className={`p-3 rounded-lg border transition-all ${cutStage === 2 ? "bg-rose-950/40 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.15)]" : "bg-white/[0.03] border-white/10"}`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-rose-300 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Fire & Air Books
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-500/30">
                      {stackACount} CARDS
                    </span>
                  </div>
                  {cutStage >= 2 && (
                    <div className="mt-2 text-[10px] font-mono text-stone-400 space-y-1 pl-2 border-l border-rose-500/30">
                      <div>
                        Fire Book (Will):{" "}
                        <strong className="text-rose-300">{yodCount} cards</strong>
                      </div>
                      <div>
                        Air Book (Intellect):{" "}
                        <strong className="text-amber-300">{vauCount} cards</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Water & Earth Books */}
                <div
                  className={`p-3 rounded-lg border transition-all ${cutStage === 3 ? "bg-sky-950/40 border-sky-500/60 shadow-[0_0_12px_rgba(56,189,248,0.15)]" : "bg-white/[0.03] border-white/10"}`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-sky-300 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5" /> Water & Earth Books
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-500/30">
                      {stackBCount} CARDS
                    </span>
                  </div>
                  {cutStage === 3 && (
                    <div className="mt-2 text-[10px] font-mono text-stone-400 space-y-1 pl-2 border-l border-sky-500/30">
                      <div>
                        Water Book (Emotion):{" "}
                        <strong className="text-sky-300">{hehCount} cards</strong>
                      </div>
                      <div>
                        Earth Book (Material):{" "}
                        <strong className="text-emerald-300">{hehFinalCount} cards</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: 3D CARD DECK LIFTING ARENA & TIMING PENDULUM SLIDER */}
            <div className="lg:col-span-8 bg-[#050509]/90 border border-[#c5a059]/30 rounded-xl p-6 space-y-6 shadow-2xl overflow-hidden">
              {/* CARD DECK VISUAL SLICING ARENA (3D SIDE PROFILE PERSPECTIVE) */}
              <div
                className="relative py-8 px-4 flex flex-col items-center justify-center select-none overflow-hidden bg-black/50 rounded-xl border border-white/10"
                style={{ perspective: "1200px", perspectiveOrigin: "50% 35%" }}
              >
                {/* 3D Stack Stage Container */}
                <div
                  className="relative flex items-center justify-center h-72 sm:h-80 w-full max-w-xs my-2 transition-transform duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateX(44deg) rotateZ(-12deg)"
                  }}
                >
                  <div className="absolute w-44 sm:w-52 h-64 sm:h-72 bg-black/95 rounded-xl blur-2xl translate-y-8" />

                  {/* Laser Slice Beam Line */}
                  <AnimatePresence>
                    {isSlicingAnimation && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent shadow-[0_0_20px_#c5a059] z-50 pointer-events-none"
                        style={{ top: `${100 - pileAPercent}%` }}
                      />
                    )}
                  </AnimatePresence>

                  {/* BOTTOM DECK STACK (Remaining Stack B) */}
                  <motion.div
                    animate={{
                      x: isSlicingAnimation ? 70 : 0,
                      y: isSlicingAnimation ? 12 : 0,
                      rotateZ: isSlicingAnimation ? 4 : 0
                    }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    className="relative w-44 sm:w-52 h-64 sm:h-72 rounded-xl border border-[#c5a059]/70 bg-[#0e0e11] shadow-2xl"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Layered Card Edge Rims for Realistic 78-Card Deck Thickness */}
                    {Array.from({ length: Math.max(3, Math.min(12, Math.round((stackBCount / 78) * 12))) }).map((_, idx) => (
                      <div
                        key={`bottom-rim-${idx}`}
                        className="absolute inset-0 rounded-xl border-b border-r border-[#c5a059]/40 bg-[#0c0c10] pointer-events-none"
                        style={{
                          transform: `translate3d(0px, ${(idx + 1) * 2.2}px, -${(idx + 1) * 2.2}px)`,
                          background: 'linear-gradient(135deg, #14121a 0%, #070709 100%)',
                        }}
                      />
                    ))}

                    <img
                      src={THOTH_CARD_BACK_IMAGE}
                      alt="Bottom Deck Stack"
                      className="w-full h-full object-cover opacity-95 rounded-xl relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0e]/70 via-transparent to-transparent pointer-events-none z-10" />
                    
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#c5a059] font-bold bg-black/90 px-3 py-1 rounded-md border border-[#c5a059]/40 shadow-xl z-20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
                      <span>
                        {cutStage === 1
                          ? "Water & Earth"
                          : cutStage === 2
                            ? "Air Book"
                            : "Earth Book"}
                      </span>
                      <span className="text-white/60">({stackBCount} Cards)</span>
                    </div>
                  </motion.div>

                  {/* TOP DECK STACK (Lifting Cut Stack A) */}
                  <motion.div
                    animate={{
                      x: isSlicingAnimation ? -90 : 0,
                      y: isSlicingAnimation ? -35 : 0,
                      z: isSlicingAnimation ? 90 : Math.round((stackBCount / 78) * 28) + 6,
                      rotateX: isSlicingAnimation ? -12 : 0,
                      rotateY: isSlicingAnimation ? -16 : 0
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute w-44 sm:w-52 h-64 sm:h-72 rounded-xl border border-[#c5a059]/90 bg-[#0e0e11] shadow-2xl z-30"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Layered Card Edge Rims for Top Cut Stack */}
                    {Array.from({ length: Math.max(3, Math.min(12, Math.round((stackACount / 78) * 12))) }).map((_, idx) => (
                      <div
                        key={`top-rim-${idx}`}
                        className="absolute inset-0 rounded-xl border-b border-r border-[#c5a059]/50 bg-[#0e0e12] pointer-events-none"
                        style={{
                          transform: `translate3d(0px, ${(idx + 1) * 2.2}px, -${(idx + 1) * 2.2}px)`,
                          background: 'linear-gradient(135deg, #181622 0%, #09090d 100%)',
                        }}
                      />
                    ))}

                    <img
                      src={THOTH_CARD_BACK_IMAGE}
                      alt="Top Deck Stack"
                      className="w-full h-full object-cover opacity-95 rounded-xl relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-[#0a0a0e]/70 via-transparent to-transparent pointer-events-none z-10" />
                    
                    <div className="absolute top-3 left-3 text-[10px] font-mono text-amber-300 font-bold bg-black/90 px-3 py-1 rounded-md border border-amber-400/50 shadow-xl z-20 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{cutStage === 1 ? "Fire & Air" : cutStage === 2 ? "Fire Book" : "Water Book"}</span>
                      <span className="text-white/60">({stackACount} Cards)</span>
                    </div>
                  </motion.div>
                </div>

                {/* Live Cut Ratio & Card Count Readout */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono text-stone-300 relative z-20">
                  <span className="bg-black/60 px-3 py-1 rounded-md border border-white/10">
                    Stack A: <strong className="text-amber-400">{stackACount} Cards ({pileAPercent}%)</strong>
                  </span>
                  <span className="text-stone-600">•</span>
                  <span className="bg-black/60 px-3 py-1 rounded-md border border-white/10">
                    Stack B: <strong className="text-[#c5a059]">{stackBCount} Cards ({pileBPercent}%)</strong>
                  </span>
                  <span className="text-stone-600">•</span>
                  <span>
                    Accuracy: <strong className="text-amber-400">{accuracyScore}%</strong>
                  </span>
                </div>
              </div>

              {/* INTERACTIVE PENDULUM SLIDER TIMING TRACK BAR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-[#c5a059]" /> 30% Threshold
                  </span>
                  <span className="text-amber-400 font-bold">50% Center Target</span>
                  <span className="flex items-center gap-1.5">
                    70% Threshold <Crosshair className="w-3.5 h-3.5 text-[#c5a059]" />
                  </span>
                </div>

                {/* Pendulum Track Bar */}
                <div
                  onClick={handleExecuteCut}
                  className="relative h-6 bg-[#030305] border border-white/15 rounded-full overflow-hidden cursor-pointer shadow-inner group/track"
                >
                  {/* Center Target Indicator Bar */}
                  <div className="absolute top-0 bottom-0 left-[48%] right-[48%] bg-[#c5a059]/30 border-x border-[#c5a059]/60" />

                  {/* Threshold Zone (30% to 70%) */}
                  <div className="absolute top-0 bottom-0 left-[30%] right-[30%] bg-gradient-to-r from-[#c5a059]/10 via-[#c5a059]/20 to-[#c5a059]/10 pointer-events-none" />

                  {/* Oscillation Marker Indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-4 -ml-2 bg-gradient-to-r from-[#d6b77b] via-[#c5a059] to-[#936e2d] rounded-full shadow-[0_0_15px_#c5a059] transition-transform duration-75"
                    style={{ left: `${markerPos}%` }}
                  />
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  onClick={onBackToShuffle}
                  className="px-4 py-2.5 bg-[#050505] hover:bg-black text-stone-400 hover:text-stone-200 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Cancel & Back
                </button>

                <button
                  onClick={handleExecuteCut}
                  disabled={!isCutMoving}
                  className="w-full sm:w-auto relative group px-8 py-4 bg-gradient-to-r from-[#c5a059] via-[#b89845] to-[#a37d35] hover:from-[#d6b77b] hover:via-[#c5a059] hover:to-[#b08940] text-stone-950 font-bold text-xs font-mono uppercase tracking-[0.15em] rounded-xl shadow-[0_4px_24px_rgba(197,160,89,0.25)] flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 animate-ring-pulse disabled:opacity-50"
                >
                  <Scissors className="w-4 h-4" />
                  <span>
                    {cutStage === 1
                      ? "TAP TO CUT DECK (SPACE)"
                      : cutStage === 2
                        ? "TAP TO CUT FIRE & AIR BOOKS (SPACE)"
                        : "TAP TO CUT WATER & EARTH BOOKS (SPACE)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* FINAL 4 ELEMENTAL PILES SELECTION VIEW (STAGE 'DONE') */}
      {cutStage === "done" && (() => {
        const significatorCard = deck.find((c) => c.id === selectedSignificatorId);
        const pileWithSignificator = fourPilesCut.piles.find((p) =>
          p.cards.some((c) => c.id === selectedSignificatorId)
        );

        return (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-7"
          >
            {/* LIBER T SIGNIFICATOR ALIGNMENT REVEAL BANNER */}
            {significatorCard && pileWithSignificator && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-[#0c0a06] via-[#1a1409] to-[#0c0a06] border border-[#c5a059]/50 rounded-2xl p-4 sm:p-5 shadow-[0_0_40px_rgba(197,160,89,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-20 rounded-lg border border-[#c5a059] overflow-hidden shrink-0 shadow-[0_0_15px_rgba(197,160,89,0.4)]">
                    <img
                      src={getThothCardImageUrl(significatorCard)}
                      alt={significatorCard.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#c5a059] animate-pulse" />
                      <span className="text-xs font-mono text-[#c5a059] font-bold uppercase tracking-[0.15em]">
                        Is this your card? Is this your pile?
                      </span>
                    </div>
                    <h4 className="atu-font text-base sm:text-lg font-bold text-stone-100">
                      Significator <span className="text-[#c5a059]">{significatorCard.name}</span> Discovered in <span className="text-[#c5a059]">Book of {pileWithSignificator.element.toUpperCase()}</span>!
                    </h4>
                    <p className="text-xs text-stone-400 font-sans">
                      Liber T Alignment Confirmed: Your bookmark card landed in stack {pileWithSignificator.letter} ({pileWithSignificator.hebrewName}), attuning your inquiry directly with Divine Source.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPile(pileWithSignificator.id)}
                  className="px-4 py-2.5 bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#c5a059] border border-[#c5a059]/60 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Select Aligned Book</span>
                </button>
              </motion.div>
            )}

            {/* 4 COLUMNS ACROSS GRID OF 4 STYLIZED PHYSICAL DECK STACKS */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full"
              dir="rtl"
            >
              {fourPilesCut.piles.map((pile) => {
                const visual = getPileVisualConfig(pile.id);
                const isSelected = selectedPileId === pile.id;
                const cardCount = pile.cards.length;
                const hasSignificator = Boolean(
                  selectedSignificatorId &&
                    pile.cards.some((c) => c.id === selectedSignificatorId)
                );

                // Stack offset depth layers based on actual card count
                const stackDepthLayers = Math.min(5, Math.max(2, Math.floor(cardCount / 4)));

                return (
                  <div
                    key={pile.id}
                    className="relative group text-left"
                    dir="ltr"
                  >
                    {/* Physical 3D Stack Offset Edge Layers representing exact card pile height */}
                    {Array.from({ length: stackDepthLayers }).map((_, idx) => (
                      <div
                        key={`stack-depth-${idx}`}
                        className="absolute inset-0 rounded-2xl border border-white/10 bg-[#08080c] pointer-events-none shadow-md transition-transform duration-300"
                        style={{
                          transform: `translate(${(idx + 1) * 2.5}px, ${(idx + 1) * 2.5}px)`,
                          zIndex: 5 - idx
                        }}
                      />
                    ))}

                    {/* Main Full-Size Tarot Card Container */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        triggerHaptic([15, 25, 15]);
                        onSelectPile(pile.id);
                      }}
                      className={`relative z-10 aspect-[1/1.62] p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none overflow-hidden shadow-2xl ${
                        isSelected
                          ? `${visual.glow} ring-2 ring-[#c5a059] shadow-[0_0_45px_rgba(197,160,89,0.35)]`
                          : hasSignificator
                          ? "border-[#c5a059]/70 ring-1 ring-[#c5a059]/40 opacity-100 shadow-[0_0_25px_rgba(197,160,89,0.2)]"
                          : "border-white/20 hover:border-white/45 opacity-95 hover:opacity-100"
                      }`}
                    >
                      {/* Full-Color Thoth Card Back Background Image (STATIC, NON-MOVING) */}
                      <img
                        src={THOTH_CARD_BACK_IMAGE}
                        alt="Thoth Card Back Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none"
                      />

                      {/* Gradient Shadow Wash for Crisp Text Contrast */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/95 pointer-events-none" />

                      {/* Bottom-Up Elemental Color Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${visual.bottomGradient} pointer-events-none`}
                      />

                      {/* TOP HEADER ROW */}
                      <div className="relative z-10 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-black/70 border border-[#c5a059]/40 flex items-center justify-center shadow-inner backdrop-blur-md">
                            <span className="text-base font-serif font-bold text-[#c5a059]">
                              {pile.letter}
                            </span>
                          </div>
                          <span className="atu-font text-xs font-bold text-stone-200 tracking-wider">
                            {visual.hebrewLabel}
                          </span>
                        </div>
                      </div>

                      {/* SIGNIFICATOR BADGE IF CARDS CONTAINS SIGNIFICATOR */}
                      {hasSignificator && (
                        <div className="relative z-10 my-1 px-2.5 py-1 bg-[#c5a059] text-stone-950 text-[10px] font-mono font-bold uppercase rounded-full flex items-center justify-between shadow-[0_0_12px_rgba(197,160,89,0.6)]">
                          <span className="flex items-center gap-1 truncate">
                            <Sparkles className="w-3 h-3 shrink-0" /> Significator Inside
                          </span>
                          <Crown className="w-3 h-3 shrink-0" />
                        </div>
                      )}

                      {/* CENTER NAKED ELEMENTAL ICON & SPACIOUS TITLE LAYOUT (NO CONTAINER BOX) */}
                      <div className="relative z-10 py-4 my-auto flex flex-col items-center justify-center text-center space-y-1.5 select-none">
                        {/* Naked Icon glowing directly against card back background */}
                        <div className="p-2 transition-transform duration-300 group-hover:scale-110">
                          <div className="scale-[1.85] filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                            {visual.icon}
                          </div>
                        </div>

                        {/* Element Archetype Name */}
                        <h3 className="atu-font text-xl sm:text-2xl font-extrabold tracking-[0.15em] uppercase text-stone-100 drop-shadow-md">
                          BOOK OF {pile.element.toUpperCase()}
                        </h3>
                      </div>

                      {/* QUESTION TYPES DESCRIPTION */}
                      <p className="relative z-10 text-[11px] text-stone-200 leading-relaxed font-sans text-center line-clamp-2 px-1 mb-2 drop-shadow">
                        {pile.description}
                      </p>

                      {/* BOTTOM CARD COUNT & SELECTION INDICATOR BAR */}
                      <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] font-mono">
                        <span
                          className={`text-[9px] font-mono px-2.5 py-1 rounded-full border ${visual.bgBadge} font-bold shadow-md backdrop-blur-md`}
                        >
                          {cardCount} CARDS
                        </span>
                        {isSelected ? (
                          <div className="flex items-center gap-1 text-[#c5a059] font-bold shrink-0 bg-black/75 px-2.5 py-1 rounded-full border border-[#c5a059]/50 shadow-md">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-[#c5a059]/20 text-[#c5a059]" />{" "}
                            Selected
                          </div>
                        ) : (
                          <span className="text-stone-300 group-hover:text-stone-100 transition-colors shrink-0 text-[10px]">
                            Select →
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

          {/* BOTTOM ACTION BAR */}
          <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onBackToShuffle}
                className="px-4 py-3 bg-[#050508] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Shuffle
              </button>

              <button
                onClick={handleRestartMinigame}
                className="px-4 py-3 bg-[#050508] hover:bg-black text-stone-300 border border-white/10 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#c5a059]" /> Re-Cut Books
              </button>
            </div>

            <button
              onClick={() => {
                triggerHaptic(20);
                onNextStep();
              }}
              className="w-full sm:w-auto relative group px-8 py-4 bg-gradient-to-r from-[#c5a059] via-[#b89845] to-[#a37d35] hover:from-[#d6b77b] hover:via-[#c5a059] text-stone-950 font-bold text-xs font-mono uppercase tracking-[0.15em] rounded-xl shadow-[0_4px_24px_rgba(197,160,89,0.25)] flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 animate-ring-pulse overflow-hidden"
            >
              <span>
                Next: Pick Significator in {selectedPile ? selectedPile.name : "Selected Book"}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      );
    })()}
  </div>
);
};
