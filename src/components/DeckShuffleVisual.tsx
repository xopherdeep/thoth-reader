import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { ThothCard } from '../types';
import { THOTH_CARD_BACK_IMAGE } from '../utils/cardImageUrls';
import {
  Shuffle,
  Sparkles,
  Check,
  RotateCcw,
  ArrowRight,
  Flame,
  Layers,
  Droplets,
} from 'lucide-react';

interface DeckShuffleVisualProps {
  deck: ThothCard[];
  shuffleCount: number;
  onShuffle: () => void;
  onReset: () => void;
  onNextStep: () => void;
  onSetDeck?: (newDeck: ThothCard[]) => void;
}

type ShuffleStyle = 'riffle' | 'overhand' | 'wash';
type ShufflePhase = 'idle' | 'split' | 'riffle' | 'bridge' | 'waterfall' | 'square';

const CARD_COUNT = 32;
const CARD_WIDTH = 2.2;
const CARD_HEIGHT = 3.4;
const SEGMENTS = 24;

interface CardMeshRecord {
  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
  originalPositions: Float32Array;
  currentX: number;
  currentY: number;
  currentZ: number;
  currentRotX: number;
  currentRotY: number;
  currentRotZ: number;
  currentBend: number;
}

export const DeckShuffleVisual: React.FC<DeckShuffleVisualProps> = ({
  shuffleCount,
  onShuffle,
  onReset,
  onNextStep,
}) => {
  const [shufflePhase, setShufflePhase] = useState<ShufflePhase>('idle');
  const [shuffleStyle, setShuffleStyle] = useState<ShuffleStyle>('riffle');
  const [waterfallProgress, setWaterfallProgress] = useState(0);

  const [shuffleState, setShuffleState] = useState<{
    stack: number[];
    leftPile: number[];
    rightPile: number[];
    reversedCards: Record<number, boolean>;
  }>({
    stack: Array.from({ length: CARD_COUNT }, (_, i) => i),
    leftPile: Array.from({ length: CARD_COUNT / 2 }, (_, i) => i),
    rightPile: Array.from({ length: CARD_COUNT / 2 }, (_, i) => i + CARD_COUNT / 2),
    reversedCards: {},
  });

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const cardMeshesRef = useRef<CardMeshRecord[]>([]);
  const animPhaseRef = useRef<ShufflePhase>('idle');
  const animStyleRef = useRef<ShuffleStyle>('riffle');
  const shuffleStateRef = useRef(shuffleState);
  const waterfallProgressRef = useRef(0);

  useEffect(() => {
    animPhaseRef.current = shufflePhase;
  }, [shufflePhase]);

  useEffect(() => {
    animStyleRef.current = shuffleStyle;
  }, [shuffleStyle]);

  useEffect(() => {
    shuffleStateRef.current = shuffleState;
  }, [shuffleState]);

  useEffect(() => {
    waterfallProgressRef.current = waterfallProgress;
  }, [waterfallProgress]);

  const triggerHaptic = (pattern: number | number[] = 15) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe fallback
      }
    }
  };

  const isAnimating = shufflePhase !== 'idle';

  const generatePokerRiffleHaptics = () => {
    return Array.from({ length: 38 }, () => [5, 8]).flat();
  };

  const generateBridgeWaterfallHaptics = () => {
    return Array.from({ length: 16 }, () => [10, 15]).flat();
  };

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 6.2, 9.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xc5a059, 2.5, 20);
    goldPointLight.position.set(0, 5, 2);
    scene.add(goldPointLight);

    const keyLight = new THREE.DirectionalLight(0xfffaee, 1.0);
    keyLight.position.set(4, 8, 5);
    scene.add(keyLight);

    const textureLoader = new THREE.TextureLoader();
    const cardTexture = textureLoader.load(THOTH_CARD_BACK_IMAGE);
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    cardTexture.minFilter = THREE.LinearFilter;
    cardTexture.magFilter = THREE.LinearFilter;
    cardTexture.generateMipmaps = true;

    const records: CardMeshRecord[] = [];

    for (let i = 0; i < CARD_COUNT; i++) {
      const geometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT, SEGMENTS, SEGMENTS);
      const originalPositions = new Float32Array(geometry.attributes.position.array);

      const material = new THREE.MeshStandardMaterial({
        map: cardTexture,
        roughness: 0.35,
        metalness: 0.15,
        side: THREE.DoubleSide,
        shadowSide: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const initialZ = i * 0.04;
      mesh.position.set(0, 0, initialZ);
      scene.add(mesh);

      records.push({
        mesh,
        geometry,
        originalPositions,
        currentX: 0,
        currentY: 0,
        currentZ: initialZ,
        currentRotX: 0,
        currentRotY: 0,
        currentRotZ: 0,
        currentBend: 0,
      });
    }

    cardMeshesRef.current = records;

    let animFrameId: number;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const phase = animPhaseRef.current;
      const style = animStyleRef.current;
      const state = shuffleStateRef.current;
      const progress = waterfallProgressRef.current;

      records.forEach((record, id) => {
        const isLeft = state.leftPile.includes(id);
        const targetIndex = state.stack.indexOf(id);
        const pileIndex = isLeft
          ? state.leftPile.indexOf(id)
          : state.rightPile.indexOf(id);

        const isReversed = !!state.reversedCards[id];
        const reversalAngle = isReversed ? Math.PI : 0;

        let targetX = 0;
        let targetY = 0;
        let targetZ = targetIndex * 0.04;
        let targetRotX = 0;
        let targetRotY = 0;
        let targetRotZ = reversalAngle;
        let targetBend = 0;

        if (phase === 'split') {
          if (style === 'riffle') {
            targetX = isLeft ? -2.6 : 2.6;
            targetY = 0;
            targetZ = pileIndex * 0.04 + 0.15;
            targetRotX = 0.2;
            targetRotY = isLeft ? -0.22 : 0.22;
            targetRotZ = (isLeft ? Math.PI / 2 : -Math.PI / 2) + reversalAngle;
            targetBend = 0;
          } else if (style === 'overhand') {
            targetX = isLeft ? -1.8 : 1.8;
            targetY = isLeft ? -0.3 : 0.3;
            targetZ = pileIndex * 0.05 + 0.15;
            targetRotY = isLeft ? -0.25 : 0.25;
            targetRotZ = (isLeft ? Math.PI / 2 : -Math.PI / 2) + reversalAngle;
            targetBend = 0;
          } else {
            const washAngle = (id / CARD_COUNT) * Math.PI * 2;
            targetX = Math.cos(washAngle) * 2.4;
            targetY = Math.sin(washAngle) * 1.0;
            targetZ = id * 0.03;
            targetRotZ = (id * 0.26) % (Math.PI * 2);
            targetBend = 0;
          }
        } else if (phase === 'riffle') {
          if (style === 'riffle') {
            targetX = (isLeft ? -1 : 1) * (1.25 + (targetIndex % 3) * 0.03);
            targetY = (targetIndex % 2 === 0 ? -0.06 : 0.06);
            targetZ = targetIndex * 0.045;
            targetRotX = 0.15;
            targetRotY = (isLeft ? -1 : 1) * Math.max(0, 0.2 - targetIndex * 0.006);
            targetRotZ = (isLeft ? Math.PI / 2 : -Math.PI / 2) + reversalAngle;
            targetBend = 0;
          } else if (style === 'overhand') {
            targetX = isLeft ? -0.8 : 0.8;
            targetY = -targetIndex * 0.02;
            targetZ = targetIndex * 0.04;
            targetRotY = isLeft ? -0.08 : 0.08;
            targetRotZ = (isLeft ? Math.PI / 2 : -Math.PI / 2) + reversalAngle;
            targetBend = 0;
          } else {
            targetX = Math.sin(id) * 0.6;
            targetY = Math.cos(id) * 0.35;
            targetZ = targetIndex * 0.04;
            targetRotZ = Math.cos(id) * 0.2;
            targetBend = 0;
          }
        } else if (phase === 'bridge') {
          if (style === 'riffle') {
            const archNorm = Math.sin((targetIndex / (CARD_COUNT - 1)) * Math.PI);
            const archZ = archNorm * 1.6;
            targetX = (isLeft ? -1 : 1) * Math.max(0.12, 0.35 - (CARD_COUNT - 1 - targetIndex) * 0.008);
            targetY = 0;
            targetZ = 0.8 + archZ + targetIndex * 0.025;
            targetRotX = archNorm * -0.45;
            targetRotY = (isLeft ? -1 : 1) * (0.15 - targetIndex * 0.004);
            targetRotZ = (isLeft ? Math.PI / 2 : -Math.PI / 2) + reversalAngle;
            targetBend = 0.95;
          } else {
            targetX = 0;
            targetY = 0;
            targetZ = targetIndex * 0.04;
            targetBend = 0;
          }
        } else if (phase === 'waterfall') {
          if (style === 'riffle') {
            const releasedThreshold = progress * CARD_COUNT;
            const hasReleased = targetIndex <= releasedThreshold;

            if (hasReleased) {
              targetX = 0;
              targetY = 0;
              targetZ = targetIndex * 0.04;
              targetRotX = 0;
              targetRotY = 0;
              targetRotZ = (isLeft ? Math.PI / 2 : -Math.PI / 2) + reversalAngle;
              targetBend = 0;
            } else {
              const archNorm = Math.sin((targetIndex / (CARD_COUNT - 1)) * Math.PI);
              const archZ = archNorm * 1.6;
              targetX = (isLeft ? -1 : 1) * Math.max(0.12, 0.35 - (CARD_COUNT - 1 - targetIndex) * 0.008);
              targetY = 0;
              targetZ = 0.8 + archZ + targetIndex * 0.025;
              targetRotX = archNorm * -0.45;
              targetRotY = (isLeft ? -1 : 1) * (0.15 - targetIndex * 0.004);
              targetRotZ = (isLeft ? Math.PI / 2 : -Math.PI / 2) + reversalAngle;
              targetBend = 0.95;
            }
          } else {
            targetX = 0;
            targetY = 0;
            targetZ = targetIndex * 0.04;
            targetBend = 0;
          }
        } else if (phase === 'square' || phase === 'idle') {
          targetX = 0;
          targetY = 0;
          targetZ = targetIndex * 0.04;
          targetRotX = 0;
          targetRotY = 0;
          targetRotZ = reversalAngle;
          targetBend = 0;
        }

        record.currentX += (targetX - record.currentX) * 0.14;
        record.currentY += (targetY - record.currentY) * 0.14;
        record.currentZ += (targetZ - record.currentZ) * 0.14;
        record.currentRotX += (targetRotX - record.currentRotX) * 0.14;
        record.currentRotY += (targetRotY - record.currentRotY) * 0.14;
        record.currentRotZ += (targetRotZ - record.currentRotZ) * 0.14;
        record.currentBend += (targetBend - record.currentBend) * 0.14;

        record.mesh.position.set(record.currentX, record.currentY, record.currentZ);
        record.mesh.rotation.set(record.currentRotX, record.currentRotY, record.currentRotZ);

        const posAttr = record.geometry.attributes.position;
        const origPos = record.originalPositions;
        const absBend = Math.abs(record.currentBend);

        if (absBend > 0.01) {
          for (let v = 0; v < posAttr.count; v++) {
            const origY = origPos[v * 3 + 1];
            const normY = (origY + CARD_HEIGHT / 2) / CARD_HEIGHT;
            const archSin = Math.sin(normY * Math.PI);
            const archCos = Math.cos(normY * Math.PI);

            const bendZ = archSin * record.currentBend * 0.75;
            const bendY = -archCos * record.currentBend * 0.35;

            posAttr.setZ(v, origPos[v * 3 + 2] + bendZ);
            posAttr.setY(v, origY + bendY);
          }
          posAttr.needsUpdate = true;
          record.geometry.computeVertexNormals();
        } else {
          for (let v = 0; v < posAttr.count; v++) {
            posAttr.setZ(v, origPos[v * 3 + 2]);
            posAttr.setY(v, origPos[v * 3 + 1]);
          }
          posAttr.needsUpdate = true;
          record.geometry.computeVertexNormals();
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      records.forEach((r) => {
        r.geometry.dispose();
        (r.mesh.material as THREE.Material).dispose();
      });
      cardTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleShuffleClick = (styleOverride?: ShuffleStyle) => {
    if (isAnimating) return;

    const activeStyle = styleOverride || shuffleStyle;
    if (styleOverride) setShuffleStyle(styleOverride);

    onShuffle();

    const currentStack = shuffleState.stack;
    let leftPile: number[] = [];
    let rightPile: number[] = [];
    let nextStack: number[] = [];

    if (activeStyle === 'riffle') {
      const splitPoint = Math.floor(currentStack.length / 2) + (Math.random() > 0.5 ? 1 : -1);
      leftPile = currentStack.slice(0, splitPoint);
      rightPile = currentStack.slice(splitPoint);

      let l = [...leftPile];
      let r = [...rightPile];

      while (l.length > 0 || r.length > 0) {
        if (l.length > 0 && r.length > 0) {
          if (Math.random() > 0.5) nextStack.push(l.shift()!);
          else nextStack.push(r.shift()!);
        } else if (l.length > 0) {
          nextStack.push(l.shift()!);
        } else {
          nextStack.push(r.shift()!);
        }
      }
    } else if (activeStyle === 'overhand') {
      leftPile = currentStack.filter((_, i) => i % 2 === 0);
      rightPile = currentStack.filter((_, i) => i % 2 !== 0);

      let remaining = [...currentStack];
      while (remaining.length > 0) {
        const chunkSize = Math.min(remaining.length, Math.floor(Math.random() * 3) + 2);
        const chunk = remaining.splice(0, chunkSize);
        nextStack.unshift(...chunk);
      }
    } else {
      leftPile = currentStack.filter(() => Math.random() > 0.5);
      rightPile = currentStack.filter((x) => !leftPile.includes(x));
      nextStack = [...currentStack].sort(() => Math.random() - 0.5);
    }

    const newReversedCards = { ...shuffleState.reversedCards };
    const flipRightPile = Math.random() > 0.45;
    if (flipRightPile) {
      rightPile.forEach((cardId) => {
        newReversedCards[cardId] = !newReversedCards[cardId];
      });
    } else {
      leftPile.forEach((cardId) => {
        if (Math.random() > 0.35) {
          newReversedCards[cardId] = !newReversedCards[cardId];
        }
      });
    }

    setShuffleState({
      stack: nextStack,
      leftPile,
      rightPile,
      reversedCards: newReversedCards,
    });
    setWaterfallProgress(0);

    triggerHaptic(activeStyle === 'riffle' ? [20, 25, 15, 30] : [35, 40, 30]);
    setShufflePhase('split');

    setTimeout(() => {
      setShufflePhase('riffle');
      if (activeStyle === 'riffle') {
        triggerHaptic(generatePokerRiffleHaptics());
      } else {
        triggerHaptic([12, 18, 12, 18, 12]);
      }
    }, 550);

    setTimeout(() => {
      if (activeStyle === 'riffle') {
        setShufflePhase('bridge');
        triggerHaptic([25, 30, 20]);
      } else {
        setShufflePhase('square');
        triggerHaptic([25, 35, 25]);
      }
    }, 1250);

    setTimeout(() => {
      if (activeStyle === 'riffle') {
        setShufflePhase('waterfall');
        triggerHaptic(generateBridgeWaterfallHaptics());

        const startTime = Date.now();
        const waterfallInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const p = Math.min(1, elapsed / 750);
          setWaterfallProgress(p);
          if (p >= 1) clearInterval(waterfallInterval);
        }, 16);
      }
    }, 1750);

    setTimeout(() => {
      setShufflePhase('square');
      triggerHaptic([30, 20, 45]);
    }, 2650);

    setTimeout(() => {
      triggerHaptic(25);
      setShufflePhase('idle');
    }, 3100);
  };

  const getPhaseDescription = () => {
    switch (shufflePhase) {
      case 'split':
        return 'Dealer Split (Fire & Air / Water & Earth)';
      case 'riffle':
        return 'Card-by-Card 15% Tip Interlace';
      case 'bridge':
        return 'Pressing Halves into 3D Bridge Arch';
      case 'waterfall':
        return 'Waterfall Cascade Release (Cards Dropping Underneath Arch)';
      case 'square':
        return 'Squaring Deck Edges';
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#050505] border border-[#c5a059]/40 p-5 sm:p-8 rounded-sm text-center space-y-6 relative shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-[#c5a059]/10 via-transparent to-transparent pointer-events-none" />

      <div className="space-y-2 relative z-10">
        <span className="text-[10px] sm:text-xs font-mono text-[#c5a059] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Ritual Stage I: Randomize & Charge
        </span>
        <h3 className="atu-font text-2xl sm:text-3xl font-bold text-[#c5a059] tracking-wide">
          Shuffle the 78-Card Thoth Deck
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto font-serif">
          Select your preferred shuffling style below to randomize the deck with tactile haptic energy before moving into the 4-elemental pile cut.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 relative z-10">
        <button
          onClick={() => {
            triggerHaptic(12);
            setShuffleStyle('riffle');
          }}
          disabled={isAnimating}
          className={`px-4 py-2 rounded-sm border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            shuffleStyle === 'riffle'
              ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] shadow-lg scale-105'
              : 'bg-[#0e0e11] hover:bg-black text-stone-300 border-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Classic Poker Riffle & Bridge</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic(12);
            setShuffleStyle('overhand');
          }}
          disabled={isAnimating}
          className={`px-4 py-2 rounded-sm border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            shuffleStyle === 'overhand'
              ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] shadow-lg scale-105'
              : 'bg-[#0e0e11] hover:bg-black text-stone-300 border-white/10'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Overhand Cascade</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic(12);
            setShuffleStyle('wash');
          }}
          disabled={isAnimating}
          className={`px-4 py-2 rounded-sm border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            shuffleStyle === 'wash'
              ? 'bg-[#c5a059] text-stone-950 border-[#c5a059] shadow-lg scale-105'
              : 'bg-[#0e0e11] hover:bg-black text-stone-300 border-white/10'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Alchemical Chaos Wash</span>
        </button>
      </div>

      <div className="relative h-[440px] sm:h-[500px] my-2 rounded-sm bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#14121a] via-[#09090c] to-[#030304] border border-[#c5a059]/30 shadow-2xl overflow-hidden">
        <AnimatePresence>
          {isAnimating && getPhaseDescription() && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[#c5a059] bg-[#0e0e11]/95 border border-[#c5a059]/50 px-4 py-1.5 rounded-sm shadow-2xl z-50 tracking-wider uppercase font-semibold flex items-center gap-2"
            >
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              <span>{getPhaseDescription()}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={canvasContainerRef} className="w-full h-full relative" />
      </div>

      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#0e0e11] border border-[#c5a059]/40 px-3.5 py-2 rounded-sm flex items-center gap-2 text-xs font-mono text-[#c5a059]">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>
              {shuffleCount === 0
                ? 'Deck Ready'
                : `Shuffled ${shuffleCount} ${shuffleCount === 1 ? 'time' : 'times'}`}
            </span>
          </div>

          <button
            onClick={() => {
              triggerHaptic(15);
              setShuffleState((prev) => ({ ...prev, reversedCards: {} }));
              onReset();
            }}
            disabled={isAnimating}
            className="px-3 py-2 bg-[#0e0e11] hover:bg-black text-stone-400 border border-white/10 text-xs font-mono rounded-sm transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Deck
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleShuffleClick()}
            disabled={isAnimating}
            className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-[#c5a059] via-amber-400 to-[#c5a059] text-stone-950 font-bold text-xs font-mono uppercase tracking-widest rounded-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 hover:brightness-110"
          >
            <Shuffle className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
            <span>{shuffleCount === 0 ? 'Shuffle Cards Now' : 'Shuffle Again'}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic(15);
              onNextStep();
            }}
            disabled={isAnimating}
            className="flex-1 sm:flex-initial px-6 py-3 bg-[#0e0e11] hover:bg-black text-stone-100 border border-[#c5a059]/60 font-mono text-xs font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition hover:bg-[#181612]"
          >
            <span>Proceed to 4-Pile Cut</span>
            <ArrowRight className="w-4 h-4 text-[#c5a059]" />
          </button>
        </div>
      </div>
    </div>
  );
};
