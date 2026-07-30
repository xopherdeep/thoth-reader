import { ThothCard, SpreadStep } from "../types";
import { THOTH_DECK } from "../data/thothCards";

export interface TetragrammatonPile {
  id: "yod" | "heh" | "vau" | "heh_final";
  letter: string; // י, ה, ו, ה
  element: "Fire" | "Water" | "Air" | "Earth";
  name: string;
  description: string;
  cards: ThothCard[];
}

export interface FourPilesCut {
  piles: TetragrammatonPile[];
  assembledDeck: ThothCard[];
}

export interface CountingSpreadResult {
  initialCard: ThothCard;
  pulledCards: ThothCard[];
  steps: SpreadStep[];
  terminalCard: ThothCard;
  deckOrder: ThothCard[];
  selectedPile?: TetragrammatonPile;
}

/**
 * Cuts a 78-card deck twice into 4 distinct elemental/Tetragrammaton piles:
 * 1. Yod (י) - Fire (Will, Energy, Ambition)
 * 2. Heh (ה) - Water (Emotion, Intuition, Love)
 * 3. Vau (ו) - Air (Mind, Thought, Intellect)
 * 4. Heh Final (ה) - Earth (Physical, Wealth, Reality)
 */
export function cutDeckIntoFourPiles(deck: ThothCard[] = THOTH_DECK): FourPilesCut {
  const total = deck.length;
  // Guarantee a minimum of 15 cards per pile (4 x 15 = 60 minimum cards allocated)
  const minCards = Math.min(15, Math.floor(total / 4));

  // Pile 1 size: [15, total - 3 * 15] -> [15, 33]
  const size1 = minCards + Math.floor(Math.random() * (total - 4 * minCards + 1));
  const c1 = size1;

  // Pile 2 size: [15, total - c1 - 2 * 15]
  const rem2 = total - c1 - 2 * minCards;
  const size2 = minCards + Math.floor(Math.random() * (rem2 - minCards + 1));
  const c2 = c1 + size2;

  // Pile 3 size: [15, total - c2 - 15]
  const rem3 = total - c2 - minCards;
  const size3 = minCards + Math.floor(Math.random() * (rem3 - minCards + 1));
  const c3 = c2 + size3;

  const pile1Cards = deck.slice(0, c1);
  const pile2Cards = deck.slice(c1, c2);
  const pile3Cards = deck.slice(c2, c3);
  const pile4Cards = deck.slice(c3);

  const piles: TetragrammatonPile[] = [
    {
      id: "yod",
      letter: "י",
      element: "Fire",
      name: "Book of Fire (Will)",
      description: "Passion, Spirit, Conflict.",
      cards: pile1Cards
    },
    {
      id: "heh",
      letter: "ה",
      element: "Water",
      name: "Book of Water (Feeling)",
      description: "Emotions, Relationships, Intuition.",
      cards: pile2Cards
    },
    {
      id: "vau",
      letter: "ו",
      element: "Air",
      name: "Book of Air (Intellect)",
      description: "Intellect, Career, Mentality.",
      cards: pile3Cards
    },
    {
      id: "heh_final",
      letter: "ה",
      element: "Earth",
      name: "Book of Earth (Material)",
      description: "Physical, Material, Monetary.",
      cards: pile4Cards
    }
  ];

  return {
    piles,
    assembledDeck: deck
  };
}

/**
 * Cuts a 78-card deck into 4 piles based on 3 interactive cut ratios (each bounded between 0.30 and 0.70):
 * 1. Ratio 1: Cuts the main deck into Stack A (Yod+Vau) and Stack B (Heh+Heh Final).
 * 2. Ratio 2: Cuts Stack A into Yod (Fire) and Vau (Air).
 * 3. Ratio 3: Cuts Stack B into Heh (Water) and Heh Final (Earth).
 */
export function cutDeckWithCustomRatios(
  deck: ThothCard[] = THOTH_DECK,
  ratio1: number = 0.5,
  ratio2: number = 0.5,
  ratio3: number = 0.5
): FourPilesCut {
  const total = deck.length;

  // Clamp ratio to guaranteed 30% to 70% threshold
  const clamp = (val: number) => Math.max(0.3, Math.min(0.7, val));
  const r1 = clamp(ratio1);
  const r2 = clamp(ratio2);
  const r3 = clamp(ratio3);

  // First cut: Main deck -> Stack A & Stack B
  const c1 = Math.max(15, Math.min(total - 30, Math.round(total * r1)));
  const stackA = deck.slice(0, c1);
  const stackB = deck.slice(c1);

  // Second cut: Stack A -> Yod (Fire) & Vau (Air)
  const cA = Math.max(6, Math.min(stackA.length - 6, Math.round(stackA.length * r2)));
  const pileYodCards = stackA.slice(0, cA);
  const pileVauCards = stackA.slice(cA);

  // Third cut: Stack B -> Heh (Water) & Heh Final (Earth)
  const cB = Math.max(6, Math.min(stackB.length - 6, Math.round(stackB.length * r3)));
  const pileHehCards = stackB.slice(0, cB);
  const pileHehFinalCards = stackB.slice(cB);

  const piles: TetragrammatonPile[] = [
    {
      id: "yod",
      letter: "י",
      element: "Fire",
      name: "Book of Fire (Will)",
      description: "Passion, Spirit, Conflict.",
      cards: pileYodCards
    },
    {
      id: "heh",
      letter: "ה",
      element: "Water",
      name: "Book of Water (Feeling)",
      description: "Emotions, Relationships, Intuition.",
      cards: pileHehCards
    },
    {
      id: "vau",
      letter: "ו",
      element: "Air",
      name: "Book of Air (Intellect)",
      description: "Intellect, Career, Mentality.",
      cards: pileVauCards
    },
    {
      id: "heh_final",
      letter: "ה",
      element: "Earth",
      name: "Book of Earth (Material)",
      description: "Physical, Material, Monetary.",
      cards: pileHehFinalCards
    }
  ];

  return {
    piles,
    assembledDeck: deck
  };
}

/**
 * Executes the Golden Dawn Thoth Numerological Counting Spread loop.
 * @param startCardIndex Index in deck array to start from
 * @param deck The 78-card deck array
 * @param selectedPile Optional pile selected during the 4-pile cut ritual
 */
export function calculateThothCountingSpread(
  startCardIndex: number,
  deck: ThothCard[] = THOTH_DECK,
  selectedPile?: TetragrammatonPile
): CountingSpreadResult {
  // If a specific pile was selected during the 4-pile cut, loop strictly within that pile
  const workingDeck = selectedPile && selectedPile.cards.length > 0 ? selectedPile.cards : deck;

  if (!workingDeck || workingDeck.length === 0) {
    throw new Error("Working pile or deck must contain at least 1 card");
  }

  const validStartIndex =
    ((startCardIndex % workingDeck.length) + workingDeck.length) % workingDeck.length;
  const initialCard = workingDeck[validStartIndex];

  const pulledCards: ThothCard[] = [initialCard];
  const visitedIndices = new Set<number>([validStartIndex]);
  const steps: SpreadStep[] = [];

  let currentIndex = validStartIndex;
  let stepNumber = 1;
  let isComplete = false;
  let terminalCard = initialCard;

  // Loop front-to-back around the bounded pile until landing on an already-flipped card
  while (!isComplete && stepNumber <= workingDeck.length + 1) {
    const currentCard = workingDeck[currentIndex];
    const count = currentCard.numerologyCount;

    // Advance count steps forward in the pile array with continuous wraparound
    // Golden Dawn Rule: Card 1 is the card itself, Card 2 is +1 step ahead, Card N is +(N-1) steps ahead
    const stepOffset = Math.max(0, count - 1);
    const nextIndex = (currentIndex + stepOffset) % workingDeck.length;
    const nextCard = workingDeck[nextIndex];

    const isTerminal = visitedIndices.has(nextIndex);

    const stepInfo: SpreadStep = {
      stepNumber,
      fromCard: currentCard,
      fromIndex: currentIndex,
      count,
      toCard: nextCard,
      toIndex: nextIndex,
      isLoopTerminal: isTerminal
    };

    steps.push(stepInfo);

    if (isTerminal) {
      terminalCard = nextCard;
      isComplete = true;
    } else {
      pulledCards.push(nextCard);
      visitedIndices.add(nextIndex);
      currentIndex = nextIndex;
      stepNumber++;
    }
  }

  return {
    initialCard,
    pulledCards,
    steps,
    terminalCard,
    deckOrder: workingDeck,
    selectedPile
  };
}

/**
 * Shuffles a copy of the Thoth deck using Fisher-Yates shuffle algorithm.
 */
export function shuffleDeck(deck: ThothCard[] = THOTH_DECK): ThothCard[] {
  const array = [...deck];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
