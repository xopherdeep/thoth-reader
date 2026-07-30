export type CardType = 'major' | 'minor' | 'court';
export type SuitType = 'Wands' | 'Cups' | 'Swords' | 'Disks';
export type MajorCategory = 'Elemental' | 'Planetary' | 'Zodiac' | 'Pip' | 'Court';

export interface HebrewLetter {
  letter: string;
  name: string;
  meaning: string;
  value: number;
}

export interface AstrologyAttribution {
  type: 'Zodiac' | 'Planet' | 'Element' | 'Decan';
  name: string;
  symbol: string;
  decanDetails?: string;
}

export interface AlchemyAttribution {
  symbol: string;
  element: 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit' | string;
  process: string;
  metalOrQuality?: string;
}

export interface TreeOfLifeAttribution {
  sephiraOrPath: string;
  title: string;
}

export interface ThothCard {
  id: string;
  name: string;
  atuNumber: number | null; // 0-21 for Major
  type: CardType;
  suit: SuitType | null;
  rank: string | null;
  numerologyCount: number; // 1-10 for pips, 4/7 for courts, 3/9/12 for majors
  category: MajorCategory;
  thothTitle: string;
  hebrewLetter: HebrewLetter | null;
  astrology: AstrologyAttribution | null;
  alchemy: AlchemyAttribution;
  treeOfLife: TreeOfLifeAttribution;
  keyThemes: string[];
  occultMeaning: string;
  lightInterpretation: string;
  shadowInterpretation: string;
  cardColor: string;
  imageUrl?: string;
  bookOfThothImageUrl?: string;
  classicImageUrl?: string;
}

export interface SpreadStep {
  stepNumber: number;
  fromCard: ThothCard;
  fromIndex: number;
  count: number;
  toCard: ThothCard;
  toIndex: number;
  isLoopTerminal: boolean;
}

export interface CardByCardAnalysis {
  cardId: string;
  title: string;
  esotericSignificance: string;
  alchemicalInsight: string;
  relevanceToQuestion: string;
}

export interface BookChapter {
  chapterNumber: number;
  chapterTitle: string;
  parableQuote?: string;
  narrativeContent: string;
  characterArchetypes?: string[];
}

export interface PoeticNarrative {
  title: string;
  stanzas: string[];
  proseSynthesis: string;
  keyMotto?: string;
  bookHook?: string;
  bookChapters?: BookChapter[];
  style?: 'crowleyan' | 'orphic' | 'enochian' | 'alchemical' | string;
}

export interface AIInterpretation {
  title: string;
  overview: string;
  numerologicalJourney: string;
  cardByCardAnalysis: CardByCardAnalysis[];
  deepAnswer: string;
  actionableCounsel: string[];
  alchemicalFormula: string;
  bookChapters?: BookChapter[];
  bookHook?: string;
  poeticNarrative?: PoeticNarrative;
}

export interface ThothReading {
  id: string;
  timestamp: number | string;
  question: string;
  pulledCards: ThothCard[];
  steps?: SpreadStep[];
  countingLog?: SpreadStep[];
  aiInterpretation?: AIInterpretation;
  poeticNarrative?: PoeticNarrative;
  deckNote?: string;
  aiStyle?: string;
  spreadMode?: string;
  significatorCardId?: string;
  startCardId?: string;
}
