import { useState, useMemo } from 'react';
import { THOTH_DECK } from '../data/thothCards';
import { ThothCard } from '../types';

export type SortOption = 'deck' | 'number' | 'name' | 'atu';
export type GroupOption = 'none' | 'number' | 'suit' | 'type';
export type NumberFilterOption = 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'pips' | 'courts';

export interface CardGroup {
  id: string;
  title: string;
  count: number;
  cards: ThothCard[];
}

export interface UseThothCardSearchOptions {
  initialCategory?: string;
  initialQuery?: string;
  initialSort?: SortOption;
  initialGroup?: GroupOption;
}

/**
 * Portable TypeScript hook for searching, filtering, sorting, and grouping the 78 Thoth Cards.
 */
export function useThothCardSearch(options: UseThothCardSearchOptions = {}) {
  const [query, setQuery] = useState<string>(options.initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(options.initialCategory || 'all');
  const [selectedSuit, setSelectedSuit] = useState<string>('all');
  const [selectedNumber, setSelectedNumber] = useState<NumberFilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>(options.initialSort || 'deck');
  const [groupBy, setGroupBy] = useState<GroupOption>(options.initialGroup || 'none');

  const filteredCards = useMemo(() => {
    return THOTH_DECK.filter((card: ThothCard) => {
      // Category Filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'major' && card.type !== 'major') return false;
        if (selectedCategory === 'minor' && card.type !== 'minor') return false;
        if (selectedCategory === 'court' && card.type !== 'court') return false;
        if (selectedCategory === 'Wands' && card.suit !== 'Wands') return false;
        if (selectedCategory === 'Cups' && card.suit !== 'Cups') return false;
        if (selectedCategory === 'Swords' && card.suit !== 'Swords') return false;
        if (selectedCategory === 'Disks' && card.suit !== 'Disks') return false;
      }

      // Suit Filter
      if (selectedSuit !== 'all' && card.suit !== selectedSuit) {
        return false;
      }

      // Number / Tens Filter
      if (selectedNumber !== 'all') {
        if (selectedNumber === 'pips') {
          if (card.type !== 'minor') return false;
        } else if (selectedNumber === 'courts') {
          if (card.type !== 'court') return false;
        } else if (selectedNumber === '1') {
          const isAce = card.rank?.toLowerCase() === 'ace' || card.rank === '1' || card.atuNumber === 1;
          if (!isAce) return false;
        } else {
          const matchesRank = card.rank === selectedNumber;
          const matchesAtu = card.atuNumber === Number(selectedNumber);
          const matchesNumerology = card.type === 'minor' && card.numerologyCount === Number(selectedNumber);
          if (!matchesRank && !matchesAtu && !matchesNumerology) return false;
        }
      }

      // Query Search
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesThothTitle = card.thothTitle.toLowerCase().includes(q);
        const matchesHebrew = card.hebrewLetter?.name.toLowerCase().includes(q) || card.hebrewLetter?.letter.includes(q);
        const matchesAstro = card.astrology?.name.toLowerCase().includes(q);
        const matchesThemes = card.keyThemes.some((t) => t.toLowerCase().includes(q));
        const matchesOccult = card.occultMeaning.toLowerCase().includes(q);

        return matchesName || matchesThothTitle || matchesHebrew || matchesAstro || matchesThemes || matchesOccult;
      }

      return true;
    });
  }, [query, selectedCategory, selectedSuit, selectedNumber]);

  // Sorted Cards
  const sortedCards = useMemo(() => {
    const list = [...filteredCards];

    switch (sortBy) {
      case 'number':
        return list.sort((a, b) => {
          const numA = a.type === 'minor' ? (a.rank === 'Ace' ? 1 : Number(a.rank) || 99) : a.atuNumber !== null ? a.atuNumber : 50;
          const numB = b.type === 'minor' ? (b.rank === 'Ace' ? 1 : Number(b.rank) || 99) : b.atuNumber !== null ? b.atuNumber : 50;
          return numA - numB;
        });
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'atu':
        return list.sort((a, b) => (a.atuNumber ?? 99) - (b.atuNumber ?? 99));
      case 'deck':
      default:
        return list;
    }
  }, [filteredCards, sortBy]);

  // Grouped Cards
  const groupedCards = useMemo((): CardGroup[] => {
    if (groupBy === 'none') {
      return [{ id: 'all', title: 'Complete Catalog', count: sortedCards.length, cards: sortedCards }];
    }

    if (groupBy === 'number') {
      const numberMap: Record<string, { title: string; cards: ThothCard[] }> = {
        '1': { title: 'Aces / Ones', cards: [] },
        '2': { title: 'Twos', cards: [] },
        '3': { title: 'Threes', cards: [] },
        '4': { title: 'Fours', cards: [] },
        '5': { title: 'Fives', cards: [] },
        '6': { title: 'Sixes', cards: [] },
        '7': { title: 'Sevens', cards: [] },
        '8': { title: 'Eights', cards: [] },
        '9': { title: 'Nines', cards: [] },
        '10': { title: 'Tens', cards: [] },
        'court': { title: 'Court Agencies', cards: [] },
        'major': { title: 'Major Atu Arcana', cards: [] },
      };

      sortedCards.forEach((card) => {
        if (card.type === 'major') {
          numberMap['major'].cards.push(card);
        } else if (card.type === 'court') {
          numberMap['court'].cards.push(card);
        } else if (card.rank === 'Ace' || card.rank === '1') {
          numberMap['1'].cards.push(card);
        } else if (card.rank && numberMap[card.rank]) {
          numberMap[card.rank].cards.push(card);
        }
      });

      return Object.entries(numberMap)
        .filter(([_, group]) => group.cards.length > 0)
        .map(([key, group]) => ({
          id: key,
          title: group.title,
          count: group.cards.length,
          cards: group.cards,
        }));
    }

    if (groupBy === 'suit') {
      const suitMap: Record<string, { title: string; cards: ThothCard[] }> = {
        major: { title: 'Major Atu Arcana', cards: [] },
        Wands: { title: 'Suit of Wands (Fire)', cards: [] },
        Cups: { title: 'Suit of Cups (Water)', cards: [] },
        Swords: { title: 'Suit of Swords (Air)', cards: [] },
        Disks: { title: 'Suit of Disks (Earth)', cards: [] },
      };

      sortedCards.forEach((card) => {
        if (card.type === 'major') {
          suitMap.major.cards.push(card);
        } else if (card.suit && suitMap[card.suit]) {
          suitMap[card.suit].cards.push(card);
        }
      });

      return Object.entries(suitMap)
        .filter(([_, group]) => group.cards.length > 0)
        .map(([key, group]) => ({
          id: key,
          title: group.title,
          count: group.cards.length,
          cards: group.cards,
        }));
    }

    if (groupBy === 'type') {
      const typeMap: Record<string, { title: string; cards: ThothCard[] }> = {
        major: { title: '22 Major Atu', cards: [] },
        court: { title: '16 Court Agencies', cards: [] },
        minor: { title: '40 Minor Decans', cards: [] },
      };

      sortedCards.forEach((card) => {
        if (typeMap[card.type]) {
          typeMap[card.type].cards.push(card);
        }
      });

      return Object.entries(typeMap)
        .filter(([_, group]) => group.cards.length > 0)
        .map(([key, group]) => ({
          id: key,
          title: group.title,
          count: group.cards.length,
          cards: group.cards,
        }));
    }

    return [{ id: 'all', title: 'Complete Catalog', count: sortedCards.length, cards: sortedCards }];
  }, [sortedCards, groupBy]);

  const categories = [
    { id: 'all', label: 'All Cards', count: THOTH_DECK.length },
    { id: 'major', label: '22 Major Atu', count: THOTH_DECK.filter((c) => c.type === 'major').length },
    { id: 'court', label: '16 Court Agencies', count: THOTH_DECK.filter((c) => c.type === 'court').length },
    { id: 'minor', label: '40 Minor Decans', count: THOTH_DECK.filter((c) => c.type === 'minor').length },
    { id: 'Wands', label: 'Fire / Wands', count: THOTH_DECK.filter((c) => c.suit === 'Wands').length },
    { id: 'Cups', label: 'Water / Cups', count: THOTH_DECK.filter((c) => c.suit === 'Cups').length },
    { id: 'Swords', label: 'Air / Swords', count: THOTH_DECK.filter((c) => c.suit === 'Swords').length },
    { id: 'Disks', label: 'Earth / Disks', count: THOTH_DECK.filter((c) => c.suit === 'Disks').length },
  ];

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSuit,
    setSelectedSuit,
    selectedNumber,
    setSelectedNumber,
    sortBy,
    setSortBy,
    groupBy,
    setGroupBy,
    filteredCards: sortedCards,
    groupedCards,
    categories,
    totalCards: THOTH_DECK.length,
  };
}

