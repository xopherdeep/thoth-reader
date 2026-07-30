import { ThothCard, SuitType } from '../types';

export type RarityTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY' | 'MYTHIC';

export interface SynchronicityPattern {
  id: string;
  title: string;
  category: 'court' | 'suits' | 'arcana' | 'ranks' | 'numerology';
  badgeLabel: string;
  icon: string; // Emoji or symbol
  color: string;
  description: string;
  esotericMeaning: string;
  nonRandomProof: string;
  rarity: RarityTier;
  rarityLabel: string;
  probabilityOdds: string;
  rarityColor: string;
}

export interface SynchronicityAnalysis {
  resonanceScore: number; // 0 - 100%
  patterns: SynchronicityPattern[];
  suitCounts: Record<SuitType, number>;
  courtCount: number;
  majorCount: number;
  minorCount: number;
  hasAllFourSuits: boolean;
  dominantElement: { name: string; symbol: string; suit: SuitType; count: number } | null;
  summaryQuote: string;
  synchronicityInsight: string;
  highestRarity: RarityTier | null;
  cumulativeOddsText: string;
}

const RARITY_COLORS: Record<RarityTier, string> = {
  COMMON: 'from-slate-500 to-stone-500 text-stone-200 border-stone-500/50 shadow-[0_0_12px_rgba(120,113,108,0.2)]',
  UNCOMMON: 'from-cyan-500 to-blue-600 text-cyan-200 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
  RARE: 'from-violet-500 to-purple-700 text-violet-200 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]',
  LEGENDARY: 'from-amber-400 to-[#c5a059] text-amber-100 border-[#c5a059]/70 shadow-[0_0_25px_rgba(197,160,89,0.4)]',
  MYTHIC: 'from-rose-400 via-fuchsia-500 to-indigo-500 text-rose-100 border-fuchsia-500/80 shadow-[0_0_30px_rgba(217,70,239,0.5)]',
};

const RARITY_WEIGHTS: Record<RarityTier, number> = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  LEGENDARY: 4,
  MYTHIC: 5,
};

/**
 * Analyzes a sequence of pulled cards for non-random mathematical and esoteric synchronicity patterns.
 */
export function analyzeSynchronicity(pulledCards: ThothCard[]): SynchronicityAnalysis {
  if (!pulledCards || pulledCards.length === 0) {
    return {
      resonanceScore: 50,
      patterns: [],
      suitCounts: { Wands: 0, Cups: 0, Swords: 0, Disks: 0 },
      courtCount: 0,
      majorCount: 0,
      minorCount: 0,
      hasAllFourSuits: false,
      dominantElement: null,
      summaryQuote: 'The deck awaits your intention.',
      synchronicityInsight: 'Shuffle and initiate the counting loop to reveal the synchronicity of the Arcana.',
      highestRarity: null,
      cumulativeOddsText: '1 in 1',
    };
  }

  const suitCounts: Record<SuitType, number> = {
    Wands: 0,
    Cups: 0,
    Swords: 0,
    Disks: 0,
  };

  let courtCount = 0;
  let majorCount = 0;
  let minorCount = 0;
  const rankMap: Record<string, number> = {};

  pulledCards.forEach((card) => {
    if (card.type === 'major') {
      majorCount++;
    } else if (card.type === 'court') {
      courtCount++;
      if (card.suit) suitCounts[card.suit]++;
    } else {
      minorCount++;
      if (card.suit) suitCounts[card.suit]++;
    }

    if (card.rank) {
      rankMap[card.rank] = (rankMap[card.rank] || 0) + 1;
    }
  });

  const patterns: SynchronicityPattern[] = [];
  let addedScore = 0;

  // Helper to push patterns
  const addPattern = (pat: Omit<SynchronicityPattern, 'rarityColor'>) => {
    patterns.push({
      ...pat,
      rarityColor: RARITY_COLORS[pat.rarity],
    });
  };

  // 1. Check Quad-Suit / Tetragrammaton Balance
  const suitsPresent = (Object.keys(suitCounts) as SuitType[]).filter((s) => suitCounts[s] > 0);
  const hasAllFourSuits = suitsPresent.length === 4;

  if (hasAllFourSuits) {
    addedScore += 25;
    addPattern({
      id: 'tetragrammaton-yhvh',
      title: 'Tetragrammaton Elemental Quad (Y-H-V-H)',
      category: 'suits',
      badgeLabel: 'All 4 Suits Present',
      icon: '🔥🌊🌬️🪨',
      color: 'from-amber-500 via-blue-500 to-emerald-500',
      description: 'Your pull contains representation from all 4 suits: Wands, Cups, Swords, and Disks.',
      esotericMeaning: 'This manifests the complete sacred formula of Tetragrammaton (י-ה-ו-ה), balancing Will (Fire), Emotion (Water), Intellect (Air), and Material Manifestation (Earth).',
      nonRandomProof: `Pulling all 4 suits in a ${pulledCards.length}-card sequence has a low mathematical probability. This proves holistic macrocosmic alignment across every plane of your inquiry.`,
      rarity: 'LEGENDARY',
      rarityLabel: 'LEGENDARY',
      probabilityOdds: '1 in 100 Draws (1.0%)',
    });
  }

  // 2. Check Royal Court Assembly / Court Card Conjunction
  if (courtCount >= 2) {
    addedScore += courtCount * 12;
    const courtNames = pulledCards.filter((c) => c.type === 'court').map((c) => c.name).join(', ');
    const rarity: RarityTier = courtCount >= 4 ? 'MYTHIC' : courtCount === 3 ? 'LEGENDARY' : 'UNCOMMON';
    const oddsStr = courtCount >= 4 ? '1 in 800 Draws (0.12%)' : courtCount === 3 ? '1 in 120 Draws (0.8%)' : '1 in 8 Draws (12.5%)';

    addPattern({
      id: 'royal-court-assembly',
      title: `Royal Court Conjunction (${courtCount} Royal Figures)`,
      category: 'court',
      badgeLabel: `${courtCount} Royal Court Figures`,
      icon: '👑',
      color: 'from-amber-400 to-[#c5a059]',
      description: `High concentration of Royal Court Archetypes: ${courtNames}.`,
      esotericMeaning: 'Royal Court cards (Knights, Queens, Princes, Princesses) represent living personalities, masters, and active personal power guiding or challenging your situation.',
      nonRandomProof: `Court cards make up only 20.5% (16/78) of the deck. Drawing ${courtCount} court cards indicates that your inquiry is governed by actual personal mastery and conscious relationships rather than blind chance.`,
      rarity,
      rarityLabel: rarity,
      probabilityOdds: oddsStr,
    });
  }

  // 3. Check Major Arcana High Destiny (Atu Density)
  if (majorCount >= 2) {
    addedScore += majorCount * 10;
    const atuNames = pulledCards.filter((c) => c.type === 'major').map((c) => c.name).join(', ');
    const rarity: RarityTier = majorCount >= 4 ? 'MYTHIC' : majorCount === 3 ? 'RARE' : 'UNCOMMON';
    const oddsStr = majorCount >= 4 ? '1 in 450 Draws (0.22%)' : majorCount === 3 ? '1 in 50 Draws (2.0%)' : '1 in 10 Draws (10.0%)';

    addPattern({
      id: 'atu-cosmic-density',
      title: `Macrocosmic Atu Conjunction (${majorCount} Major Arcana)`,
      category: 'arcana',
      badgeLabel: `${majorCount} Major Arcana Atu`,
      icon: '✨',
      color: 'from-purple-500 to-amber-400',
      description: `Major Arcana cards drawn: ${atuNames}.`,
      esotericMeaning: 'The Major Arcana (Atu) embody universal archetype principles and cosmic destiny that override temporary everyday circumstances.',
      nonRandomProof: `With 22 Major Arcana out of 78 cards, pulling ${majorCount} Atu cards signals that cosmic spiritual laws are directly shaping the resolution of your question.`,
      rarity,
      rarityLabel: rarity,
      probabilityOdds: oddsStr,
    });
  }

  // 4. Check Dominant Element / Suit Concentration
  let dominantSuit: SuitType | null = null;
  let maxSuitCount = 0;
  (Object.keys(suitCounts) as SuitType[]).forEach((s) => {
    if (suitCounts[s] > maxSuitCount) {
      maxSuitCount = suitCounts[s];
      dominantSuit = s;
    }
  });

  let dominantElementInfo: SynchronicityAnalysis['dominantElement'] = null;

  if (dominantSuit && maxSuitCount >= 2) {
    addedScore += maxSuitCount * 6;
    const elementDetails: Record<SuitType, { name: string; symbol: string; desc: string }> = {
      Wands: { name: 'Fire / Atziluth (Will & Creative Drive)', symbol: '🜂', desc: 'Focus on passion, spiritual vitality, and decisive action.' },
      Cups: { name: 'Water / Briah (Emotion & intuition)', symbol: '🜄', desc: 'Focus on deep feeling, love, psychic receptivity, and relationships.' },
      Swords: { name: 'Air / Yetzirah (Intellect & Mind)', symbol: '🜁', desc: 'Focus on mental clarity, truth, discernment, and cutting through illusion.' },
      Disks: { name: 'Earth / Assiah (Physical Manifestation)', symbol: '🜃', desc: 'Focus on health, wealth, tangible results, and long-term stability.' },
    };

    const details = elementDetails[dominantSuit];
    dominantElementInfo = {
      name: details.name,
      symbol: details.symbol,
      suit: dominantSuit,
      count: maxSuitCount,
    };

    if (maxSuitCount >= 3 || maxSuitCount / pulledCards.length >= 0.4) {
      const rarity: RarityTier = maxSuitCount >= 5 ? 'MYTHIC' : maxSuitCount === 4 ? 'LEGENDARY' : maxSuitCount === 3 ? 'RARE' : 'COMMON';
      const oddsStr = maxSuitCount >= 5 ? '1 in 600 Draws (0.16%)' : maxSuitCount === 4 ? '1 in 150 Draws (0.66%)' : maxSuitCount === 3 ? '1 in 30 Draws (3.3%)' : '1 in 3 Draws (33%)';

      addPattern({
        id: `dominant-suit-${dominantSuit.toLowerCase()}`,
        title: `Elemental Dominance: ${dominantSuit} (${maxSuitCount} Cards)`,
        category: 'suits',
        badgeLabel: `${details.symbol} ${dominantSuit} Dominance`,
        icon: details.symbol,
        color: dominantSuit === 'Wands' ? 'from-amber-600 to-red-600' : dominantSuit === 'Cups' ? 'from-blue-600 to-cyan-400' : dominantSuit === 'Swords' ? 'from-amber-300 to-yellow-600' : 'from-emerald-600 to-green-800',
        description: `Strong concentration of ${dominantSuit} cards (${maxSuitCount} of ${pulledCards.length} cards).`,
        esotericMeaning: `Your intention is heavily charged with the energy of ${details.name}. ${details.desc}`,
        nonRandomProof: `Having ${maxSuitCount} out of ${pulledCards.length} cards belong to ${dominantSuit} shows an intentional psychic focus on this specific elemental plane.`,
        rarity,
        rarityLabel: rarity,
        probabilityOdds: oddsStr,
      });
    }
  }

  // 5. Check Rank Harmonies (Matching ranks or numeric counts)
  const matchingRanks = Object.entries(rankMap).filter(([_, count]) => count >= 2);
  if (matchingRanks.length > 0) {
    addedScore += matchingRanks.length * 8;
    matchingRanks.forEach(([rankName, count]) => {
      const rarity: RarityTier = count >= 4 ? 'MYTHIC' : count === 3 ? 'LEGENDARY' : 'UNCOMMON';
      const oddsStr = count >= 4 ? '1 in 5000 Draws (0.02%)' : count === 3 ? '1 in 200 Draws (0.5%)' : '1 in 15 Draws (6.6%)';

      addPattern({
        id: `matching-rank-${rankName}`,
        title: `Rank Harmonic Pair: Dual ${rankName}s`,
        category: 'ranks',
        badgeLabel: `Matching ${rankName}s (${count}x)`,
        icon: '☯️',
        color: 'from-[#c5a059] to-amber-300',
        description: `Multiple cards sharing the rank of ${rankName} were drawn simultaneously.`,
        esotericMeaning: `In Tarot numerology, repeating ranks (like two Aces or two Tens) mirror a doubled octave resonance on that Sephira of the Tree of Life.`,
        nonRandomProof: `Drawing matching ranks in a small pulled sequence highlights a synchronized harmonic frequency in your current life chapter.`,
        rarity,
        rarityLabel: rarity,
        probabilityOdds: oddsStr,
      });
    });
  }

  // Calculate highest rarity
  let highestRarity: RarityTier | null = null;
  let highestWeight = 0;
  patterns.forEach(p => {
    if (RARITY_WEIGHTS[p.rarity] > highestWeight) {
      highestWeight = RARITY_WEIGHTS[p.rarity];
      highestRarity = p.rarity;
    }
  });

  // Calculate overall Synchronicity Resonance Score
  const baseScore = 60 + Math.min(38, addedScore);
  const resonanceScore = Math.min(99, Math.max(65, baseScore));

  const summaryQuote = hasAllFourSuits
    ? "All four elements have responded to your call: a complete Tetragrammaton alignment proving non-random cosmic resonance."
    : courtCount >= 2
    ? "A congregation of Royal Masters governs your inquiry; your pull reflects living character archetypes."
    : dominantSuit
    ? `Your sequence is heavily magnetized by ${dominantSuit}, focusing your spiritual energy onto a clear elemental vector.`
    : "The mathematical chain reaction of your counting loop mirrors the exact energetic structure of your question.";

  const synchronicityInsight = `Tarot operates through the Law of Synchronicity (Carl Jung / Aleister Crowley), where physical card selection mirrors the internal state of the querent. With ${patterns.length} distinct mathematical alignments detected in your ${pulledCards.length}-card pull, this combination is statistically non-random and carries targeted personal insight.`;

  // Mock cumulative odds calculator for display
  const totalImprobability = patterns.reduce((acc, p) => {
    const mult = p.rarity === 'MYTHIC' ? 500 : p.rarity === 'LEGENDARY' ? 100 : p.rarity === 'RARE' ? 40 : p.rarity === 'UNCOMMON' ? 12 : 3;
    return acc * (mult / 2.5); // Compounding modifier
  }, 1);
  const finalOdds = Math.max(1, Math.round(totalImprobability));
  const cumulativeOddsText = `1 in ${finalOdds.toLocaleString()} Draws`;

  return {
    resonanceScore,
    patterns,
    suitCounts,
    courtCount,
    majorCount,
    minorCount,
    hasAllFourSuits,
    dominantElement: dominantElementInfo,
    summaryQuote,
    synchronicityInsight,
    highestRarity,
    cumulativeOddsText,
  };
}
