<script lang="ts">
  import { SEPHIROT_DATA, type SephiraEntry } from '../../data/thothEncyclopediaData';
  import { Flame } from 'lucide-svelte';

  interface Props {
    selectedSephiraNumber: number | null;
    onSelectSephira: (sephira: SephiraEntry) => void;
    class?: string;
  }

  let { selectedSephiraNumber, onSelectSephira, class: className = '' }: Props = $props();

  const nodePositions: Record<number, { x: number; y: number; label: string }> = {
    1: { x: 150, y: 35, label: 'Kether' },
    2: { x: 230, y: 90, label: 'Chokmah' },
    3: { x: 70, y: 90, label: 'Binah' },
    0: { x: 150, y: 130, label: "Da'ath" },
    4: { x: 230, y: 180, label: 'Chesed' },
    5: { x: 70, y: 180, label: 'Geburah' },
    6: { x: 150, y: 240, label: 'Tiphareth' },
    7: { x: 230, y: 320, label: 'Netzach' },
    8: { x: 70, y: 320, label: 'Hod' },
    9: { x: 150, y: 390, label: 'Yesod' },
    10: { x: 150, y: 460, label: 'Malkuth' },
  };

  const paths = [
    [1, 2], [1, 3], [1, 6],
    [2, 3], [2, 6], [2, 4],
    [3, 6], [3, 5],
    [4, 5], [4, 6], [4, 7],
    [5, 6], [5, 8],
    [6, 7], [6, 8], [6, 9],
    [7, 8], [7, 9], [7, 10],
    [8, 9], [8, 10],
    [9, 10]
  ];
</script>

<div class="relative bg-[#08080a] p-4 rounded-sm border border-[#c5a059]/40 flex flex-col items-center justify-center {className}">
  <div class="w-full flex items-center justify-between mb-2 border-b border-white/10 pb-2">
    <div class="flex items-center gap-1.5 text-[#c5a059] font-mono text-xs uppercase tracking-wider">
      <Flame class="w-3.5 h-3.5" /> Interactive Tree of Life (Otzech Chiim)
    </div>
    <div class="text-[10px] font-mono text-stone-400">Click any sphere to inspect</div>
  </div>

  <svg
    viewBox="0 0 300 500"
    class="w-full max-w-[320px] h-auto drop-shadow-2xl select-none"
  >
    <defs>
      <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d4af37" />
        <stop offset="100%" stop-color="#8a6d28" />
      </linearGradient>
      <radialGradient id="sunCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff8db" />
        <stop offset="100%" stop-color="#c5a059" />
      </radialGradient>
    </defs>

    {#each paths as [from, to], idx (`path-${idx}`)}
      {#if nodePositions[from] && nodePositions[to]}
        <line
          x1={nodePositions[from].x}
          y1={nodePositions[from].y}
          x2={nodePositions[to].x}
          y2={nodePositions[to].y}
          stroke="#c5a059"
          stroke-width="1.5"
          stroke-opacity="0.35"
          stroke-dasharray="3 3"
        />
      {/if}
    {/each}

    {#each SEPHIROT_DATA as sephira (sephira.number)}
      {#if nodePositions[sephira.number]}
        {@const pos = nodePositions[sephira.number]}
        {@const isSelected = selectedSephiraNumber === sephira.number}
        {@const isDaath = sephira.number === 0}

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <g
          onclick={() => onSelectSephira(sephira)}
          class="cursor-pointer group"
        >
          {#if isSelected}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="24"
              fill="none"
              stroke="#c5a059"
              stroke-width="1"
              stroke-dasharray="2 2"
              class="animate-spin-slow"
            />
          {/if}

          <circle
            cx={pos.x}
            cy={pos.y}
            r="18"
            fill={isSelected ? 'url(#goldGlow)' : isDaath ? '#151520' : '#0a0a0d'}
            stroke={isSelected ? '#fff' : isDaath ? '#6366f1' : '#c5a059'}
            stroke-width={isSelected ? '2.5' : '1.5'}
            stroke-opacity={isSelected ? '1' : '0.8'}
            class="transition duration-200 group-hover:stroke-[#f5ecd4] group-hover:scale-110"
          />

          <text
            x={pos.x}
            y={pos.y + 4}
            text-anchor="middle"
            fill={isSelected ? '#000' : isDaath ? '#a5b4fc' : '#c5a059'}
            font-size="11"
            font-weight="bold"
            font-family="monospace"
            class="pointer-events-none"
          >
            {isDaath ? 'D' : sephira.number}
          </text>

          <text
            x={pos.x}
            y={pos.y + 32}
            text-anchor="middle"
            fill={isSelected ? '#f5ecd4' : '#a8a29e'}
            font-size="10"
            font-weight="500"
            font-family="serif"
            class="pointer-events-none transition group-hover:fill-[#c5a059]"
          >
            {pos.label}
          </text>
        </g>
      {/if}
    {/each}
  </svg>
</div>
