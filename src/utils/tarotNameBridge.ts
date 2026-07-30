import { ThothCard } from '../types';

export interface TraditionalTarotInfo {
  traditionalName: string;
  traditionalSuit?: string;
  traditionalRank?: string;
  comparisonNote: string;
}

/**
 * Maps Crowley's Book of Thoth Tarot card attributions and names
 * to traditional Renaissance / Rider-Waite equivalents.
 */
export function getTraditionalTarotInfo(card: ThothCard): TraditionalTarotInfo {
  // Major Arcana (Atus 0 - XXI)
  if (card.atuNumber !== null) {
    switch (card.atuNumber) {
      case 0:
        return {
          traditionalName: '0. The Fool',
          comparisonNote: 'Identical ATU 0 placement across Renaissance & Thoth traditions.',
        };
      case 1:
        return {
          traditionalName: 'I. The Magician',
          comparisonNote: 'Crowley renamed "The Magician" to "The Magus" (Tahuti / Mercury).',
        };
      case 2:
        return {
          traditionalName: 'II. The High Priestess',
          comparisonNote: 'Crowley titled this "The Priestess of the Silver Star".',
        };
      case 3:
        return {
          traditionalName: 'III. The Empress',
          comparisonNote: 'Identical Venusian Queen of Nature attribution.',
        };
      case 4:
        return {
          traditionalName: 'IV. The Emperor',
          comparisonNote: 'Crowley exchanged the Hebrew Letter assignment (Tzaddi instead of He).',
        };
      case 5:
        return {
          traditionalName: 'V. The Hierophant (The Pope)',
          comparisonNote: 'Traditional Renaissance decks title this card "The Pope" or "Hierophant".',
        };
      case 6:
        return {
          traditionalName: 'VI. The Lovers',
          comparisonNote: 'Crowley depicted the Alchemical Royal Marriage (Sol & Luna).',
        };
      case 7:
        return {
          traditionalName: 'VII. The Chariot',
          comparisonNote: 'Identical Holy Grail / Chariot of Cancer attribution.',
        };
      case 8:
        return {
          traditionalName: 'XI. Justice',
          comparisonNote: 'Crowley renamed ATU VIII to "Adjustment" & restored it to position VIII (Libra). Traditional decks place Justice at position XI.',
        };
      case 9:
        return {
          traditionalName: 'IX. The Hermit',
          comparisonNote: 'Identical Virgo / Lamp of Hermetic Truth attribution.',
        };
      case 10:
        return {
          traditionalName: 'X. Wheel of Fortune',
          comparisonNote: 'Crowley titled it "Fortune" featuring the Sphinx, Hermanubis, & Typhon.',
        };
      case 11:
        return {
          traditionalName: 'VIII. Strength (Fortitude)',
          comparisonNote: 'Crowley renamed ATU XI to "Lust" (Babalon & The Beast) & restored it to position XI (Leo). Traditional decks place Strength at position VIII.',
        };
      case 12:
        return {
          traditionalName: 'XII. The Hanged Man',
          comparisonNote: 'Identical Water element sacrifice & spiritual suspension theme.',
        };
      case 13:
        return {
          traditionalName: 'XIII. Death',
          comparisonNote: 'Identical Scorpio alchemical transformation card.',
        };
      case 14:
        return {
          traditionalName: 'XIV. Temperance',
          comparisonNote: 'Crowley renamed "Temperance" to "Art" (Alchemical Solve et Coagula).',
        };
      case 15:
        return {
          traditionalName: 'XV. The Devil',
          comparisonNote: 'Crowley interpreted Pan / Baphomet as primal creative humor & material energy.',
        };
      case 16:
        return {
          traditionalName: 'XVI. The Tower',
          comparisonNote: 'Identical shattered fortress of false ego structures.',
        };
      case 17:
        return {
          traditionalName: 'XVII. The Star',
          comparisonNote: 'Crowley exchanged Hebrew Letter assignment (He instead of Tzaddi).',
        };
      case 18:
        return {
          traditionalName: 'XVIII. The Moon',
          comparisonNote: 'Identical Pisces illusions & twilight threshold motif.',
        };
      case 19:
        return {
          traditionalName: 'XIX. The Sun',
          comparisonNote: 'Identical Solar illumination & pure divine joy.',
        };
      case 20:
        return {
          traditionalName: 'XX. Judgement (Last Judgment)',
          comparisonNote: 'Crowley renamed "Judgement" to "The Aeon" (Inauguration of the New Aeon of Horus).',
        };
      case 21:
        return {
          traditionalName: 'XXI. The World',
          comparisonNote: 'Crowley renamed "The World" to "The Universe" (Saturn / Assiah manifestation).',
        };
      default:
        return {
          traditionalName: card.name,
          comparisonNote: 'Major Arcana Card',
        };
    }
  }

  // Minor Arcana
  const traditionalSuit = card.suit === 'Disks' ? 'Pentacles' : card.suit || '';

  if (card.type === 'court') {
    let traditionalRank = card.rank || '';
    if (card.rank === 'Knight') traditionalRank = 'King';
    else if (card.rank === 'Prince') traditionalRank = 'Knight';
    else if (card.rank === 'Princess') traditionalRank = 'Page';

    const traditionalName = `${traditionalRank} of ${traditionalSuit}`;
    return {
      traditionalName,
      traditionalSuit,
      traditionalRank,
      comparisonNote: `Thoth ${card.rank} corresponds to Traditional ${traditionalRank} of ${traditionalSuit}.`,
    };
  }

  // Pips
  if (card.suit === 'Disks') {
    const traditionalName = card.name.replace('Disks', 'Pentacles');
    return {
      traditionalName,
      traditionalSuit: 'Pentacles',
      comparisonNote: 'Crowley renamed the traditional suit of Pentacles/Coins to Disks.',
    };
  }

  return {
    traditionalName: card.name,
    traditionalSuit: card.suit || undefined,
    comparisonNote: 'Direct equivalent in traditional Renaissance Tarot.',
  };
}
