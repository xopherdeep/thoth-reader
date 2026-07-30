import React from 'react';
import { Sparkles, Crown, Shield, Layers, Flame, Droplets, Wind, Globe, ArrowUpDown, LayoutGrid, Hash } from 'lucide-react';
import { SortOption, GroupOption, NumberFilterOption } from '../../hooks/useThothCardSearch';

export interface CategoryOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterBarProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedNumber?: NumberFilterOption;
  onSelectNumber?: (num: NumberFilterOption) => void;
  sortBy?: SortOption;
  onSelectSort?: (sort: SortOption) => void;
  groupBy?: GroupOption;
  onSelectGroup?: (group: GroupOption) => void;
  className?: string;
}

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'all':
      return <Sparkles className="w-3.5 h-3.5" />;
    case 'major':
      return <Crown className="w-3.5 h-3.5" />;
    case 'court':
      return <Shield className="w-3.5 h-3.5" />;
    case 'minor':
      return <Layers className="w-3.5 h-3.5" />;
    case 'Wands':
      return <Flame className="w-3.5 h-3.5 text-amber-400" />;
    case 'Cups':
      return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
    case 'Swords':
      return <Wind className="w-3.5 h-3.5 text-indigo-300" />;
    case 'Disks':
      return <Globe className="w-3.5 h-3.5 text-emerald-400" />;
    default:
      return null;
  }
};

const getActiveStyle = (id: string) => {
  switch (id) {
    case 'Wands':
      return 'bg-amber-500/20 text-amber-200 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
    case 'Cups':
      return 'bg-cyan-500/20 text-cyan-200 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
    case 'Swords':
      return 'bg-indigo-500/20 text-indigo-200 border-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]';
    case 'Disks':
      return 'bg-emerald-500/20 text-emerald-200 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
    default:
      return 'bg-[#c5a059]/20 text-[#f0d8a4] border-[#c5a059]/60 shadow-[0_0_12px_rgba(197,160,89,0.25)]';
  }
};

const SUIT_IDS = ['Wands', 'Cups', 'Swords', 'Disks'];

const NUMBER_PILLS: { id: NumberFilterOption; label: string }[] = [
  { id: 'all', label: 'All #' },
  { id: '1', label: '1 / Ace' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
  { id: '4', label: '4' },
  { id: '5', label: '5' },
  { id: '6', label: '6' },
  { id: '7', label: '7' },
  { id: '8', label: '8' },
  { id: '9', label: '9' },
  { id: '10', label: '10' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedNumber = 'all',
  onSelectNumber,
  sortBy = 'deck',
  onSelectSort,
  groupBy = 'none',
  onSelectGroup,
  className = '',
}) => {
  const arcanaCategories = categories.filter((c) => !SUIT_IDS.includes(c.id));
  const suitCategories = categories.filter((c) => SUIT_IDS.includes(c.id));

  const renderChip = (cat: CategoryOption) => {
    const isSelected = selectedCategory === cat.id;
    const icon = getCategoryIcon(cat.id);
    const activeStyle = getActiveStyle(cat.id);

    return (
      <button
        key={cat.id}
        type="button"
        onClick={() => onSelectCategory(cat.id)}
        className={`w-full sm:w-[calc(20%-0.5rem)] px-2.5 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all duration-200 flex items-center justify-center gap-2 border backdrop-blur-md cursor-pointer ${
          isSelected
            ? `${activeStyle} font-semibold`
            : 'bg-[#0a0a0e]/80 text-stone-300 border-white/10 hover:border-[#c5a059]/40 hover:bg-white/5 hover:text-stone-100'
        }`}
      >
        {icon}
        <span className="truncate">{cat.label}</span>
        {cat.count !== undefined && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono transition-colors shrink-0 ${
              isSelected
                ? 'bg-white/15 text-stone-100 font-bold'
                : 'bg-black/50 text-stone-400 border border-white/5'
            }`}
          >
            {cat.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={`space-y-3 w-full ${className}`}>
      {/* Row 1: Arcana Categories */}
      <div className="flex flex-wrap items-center justify-evenly gap-2 w-full">
        {arcanaCategories.map(renderChip)}
      </div>

      {/* Row 2: Elemental Suits */}
      {suitCategories.length > 0 && (
        <div className="flex flex-wrap items-center justify-evenly gap-2 w-full pt-2.5 border-t border-white/10">
          {suitCategories.map(renderChip)}
        </div>
      )}

      {/* Row 3: Number / Tens Filtering & Ordering Controls */}
      <div className="pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        {/* Number / Tens Pills */}
        {onSelectNumber && (
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-hide py-1">
            <span className="text-[10px] text-[#c5a059] uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0 font-bold">
              <Hash className="w-3 h-3 text-[#c5a059]" /> Number:
            </span>
            {NUMBER_PILLS.map((num) => {
              const isSelected = selectedNumber === num.id;
              return (
                <button
                  key={num.id}
                  type="button"
                  onClick={() => onSelectNumber(num.id)}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#c5a059] text-black font-bold shadow-[0_0_8px_rgba(197,160,89,0.4)]'
                      : 'bg-[#0a0a0e]/80 text-stone-400 border border-white/10 hover:text-stone-100 hover:bg-white/5'
                  }`}
                >
                  {num.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Sorting & Grouping Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Sort By */}
          {onSelectSort && (
            <div className="flex items-center gap-1.5 bg-[#0a0a0e]/80 p-1 rounded-lg border border-white/10">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#c5a059] ml-1" />
              <span className="text-[10px] text-stone-400 uppercase tracking-wider hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSelectSort(e.target.value as SortOption)}
                className="bg-transparent text-stone-200 text-xs font-mono focus:outline-none cursor-pointer pr-1"
              >
                <option value="deck" className="bg-[#0e0e11] text-stone-200">Deck Order</option>
                <option value="number" className="bg-[#0e0e11] text-stone-200">Numerology (1-10)</option>
                <option value="name" className="bg-[#0e0e11] text-stone-200">Alphabetical (A-Z)</option>
                <option value="atu" className="bg-[#0e0e11] text-stone-200">Major Atu (0-XXI)</option>
              </select>
            </div>
          )}

          {/* Group By */}
          {onSelectGroup && (
            <div className="flex items-center gap-1.5 bg-[#0a0a0e]/80 p-1 rounded-lg border border-white/10">
              <LayoutGrid className="w-3.5 h-3.5 text-[#c5a059] ml-1" />
              <span className="text-[10px] text-stone-400 uppercase tracking-wider hidden md:inline">Group:</span>
              <select
                value={groupBy}
                onChange={(e) => onSelectGroup(e.target.value as GroupOption)}
                className="bg-transparent text-stone-200 text-xs font-mono focus:outline-none cursor-pointer pr-1"
              >
                <option value="none" className="bg-[#0e0e11] text-stone-200">No Grouping</option>
                <option value="number" className="bg-[#0e0e11] text-stone-200">By Tens & Numbers</option>
                <option value="suit" className="bg-[#0e0e11] text-stone-200">By Elemental Suits</option>
                <option value="type" className="bg-[#0e0e11] text-stone-200">By Arcana Type</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};







