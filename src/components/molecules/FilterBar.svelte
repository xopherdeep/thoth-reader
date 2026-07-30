<script lang="ts">
  import {
    Sparkles,
    Crown,
    Shield,
    Layers,
    Flame,
    Droplets,
    Wind,
    Globe,
    ArrowUpDown,
    LayoutGrid,
    Hash,
  } from 'lucide-svelte';
  import type { SortOption, GroupOption, NumberFilterOption } from '../../state/searchState.svelte';

  export interface CategoryOption {
    id: string;
    label: string;
    count?: number;
  }

  interface Props {
    categories: CategoryOption[];
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
    selectedNumber?: NumberFilterOption;
    onSelectNumber?: (num: NumberFilterOption) => void;
    sortBy?: SortOption;
    onSelectSort?: (sort: SortOption) => void;
    groupBy?: GroupOption;
    onSelectGroup?: (group: GroupOption) => void;
    class?: string;
  }

  let {
    categories,
    selectedCategory,
    onSelectCategory,
    selectedNumber = 'all',
    onSelectNumber,
    sortBy = 'deck',
    onSelectSort,
    groupBy = 'none',
    onSelectGroup,
    class: className = '',
  }: Props = $props();

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

  let arcanaCategories = $derived(categories.filter((c) => !SUIT_IDS.includes(c.id)));
  let suitCategories = $derived(categories.filter((c) => SUIT_IDS.includes(c.id)));

  function getActiveStyle(id: string) {
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
  }
</script>

<div class="space-y-3 bg-[#08080b]/90 p-4 rounded-xl border border-[#c5a059]/20 shadow-xl backdrop-blur-md {className}">
  <!-- Category Bar -->
  <div class="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/5">
    <div class="flex flex-wrap items-center gap-1.5">
      {#each arcanaCategories as cat (cat.id)}
        <button
          onclick={() => onSelectCategory(cat.id)}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition border cursor-pointer {selectedCategory === cat.id
            ? getActiveStyle(cat.id)
            : 'bg-white/5 text-stone-400 border-white/10 hover:border-white/20 hover:text-stone-200'}"
        >
          {#if cat.id === 'all'}<Sparkles class="w-3.5 h-3.5" />{/if}
          {#if cat.id === 'major'}<Crown class="w-3.5 h-3.5" />{/if}
          {#if cat.id === 'court'}<Shield class="w-3.5 h-3.5" />{/if}
          {#if cat.id === 'minor'}<Layers class="w-3.5 h-3.5" />{/if}
          <span>{cat.label}</span>
          {#if cat.count !== undefined}
            <span class="text-[10px] opacity-70">({cat.count})</span>
          {/if}
        </button>
      {/each}
    </div>

    <div class="flex items-center gap-1.5">
      {#each suitCategories as cat (cat.id)}
        <button
          onclick={() => onSelectCategory(cat.id)}
          class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono tracking-wide transition border cursor-pointer {selectedCategory === cat.id
            ? getActiveStyle(cat.id)
            : 'bg-white/5 text-stone-400 border-white/10 hover:border-white/20 hover:text-stone-200'}"
        >
          {#if cat.id === 'Wands'}<Flame class="w-3.5 h-3.5 text-amber-400" />{/if}
          {#if cat.id === 'Cups'}<Droplets class="w-3.5 h-3.5 text-cyan-400" />{/if}
          {#if cat.id === 'Swords'}<Wind class="w-3.5 h-3.5 text-indigo-300" />{/if}
          {#if cat.id === 'Disks'}<Globe class="w-3.5 h-3.5 text-emerald-400" />{/if}
          <span>{cat.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Secondary Controls (Sort & Group) -->
  <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
    {#if onSelectNumber}
      <div class="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        <Hash class="w-3.5 h-3.5 text-stone-500 shrink-0" />
        {#each NUMBER_PILLS as pill (pill.id)}
          <button
            onclick={() => onSelectNumber(pill.id)}
            class="px-2 py-1 rounded text-[11px] transition border cursor-pointer shrink-0 {selectedNumber === pill.id
              ? 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/50'
              : 'bg-white/5 text-stone-400 border-transparent hover:bg-white/10'}"
          >
            {pill.label}
          </button>
        {/each}
      </div>
    {/if}

    <div class="flex items-center gap-3 ml-auto">
      {#if onSelectSort}
        <div class="flex items-center gap-1.5">
          <ArrowUpDown class="w-3.5 h-3.5 text-stone-400" />
          <span class="text-stone-400">Sort:</span>
          <select
            value={sortBy}
            onchange={(e) => onSelectSort(e.currentTarget.value as SortOption)}
            class="bg-[#0e0e12] text-stone-200 border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#c5a059]/50"
          >
            <option value="deck">Canonical Order</option>
            <option value="number">Numerology</option>
            <option value="name">Alphabetical</option>
            <option value="atu">ATU Sequence</option>
          </select>
        </div>
      {/if}

      {#if onSelectGroup}
        <div class="flex items-center gap-1.5">
          <LayoutGrid class="w-3.5 h-3.5 text-stone-400" />
          <span class="text-stone-400">Group:</span>
          <select
            value={groupBy}
            onchange={(e) => onSelectGroup(e.currentTarget.value as GroupOption)}
            class="bg-[#0e0e12] text-stone-200 border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#c5a059]/50"
          >
            <option value="none">Flat Grid</option>
            <option value="suit">By Suit / Arcana</option>
            <option value="number">By Numerology</option>
            <option value="type">By Card Type</option>
          </select>
        </div>
      {/if}
    </div>
  </div>
</div>
