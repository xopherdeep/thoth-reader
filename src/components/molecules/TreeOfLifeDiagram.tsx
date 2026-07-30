import React from 'react';
import { SEPHIROT_DATA, SephiraEntry } from '../../data/thothEncyclopediaData';
import { Flame } from 'lucide-react';

export interface TreeOfLifeDiagramProps {
  selectedSephiraNumber: number | null;
  onSelectSephira: (sephira: SephiraEntry) => void;
  className?: string;
}

export const TreeOfLifeDiagram: React.FC<TreeOfLifeDiagramProps> = ({
  selectedSephiraNumber,
  onSelectSephira,
  className = '',
}) => {
  // Coordinates for the 10 Sephirot + Da'ath on a 300x500 canvas
  const nodePositions: Record<number, { x: number; y: number; label: string }> = {
    1: { x: 150, y: 35, label: 'Kether' }, // 1 Crown
    2: { x: 230, y: 90, label: 'Chokmah' }, // 2 Wisdom
    3: { x: 70, y: 90, label: 'Binah' }, // 3 Understanding
    0: { x: 150, y: 130, label: "Da'ath" }, // 0 Abyss
    4: { x: 230, y: 180, label: 'Chesed' }, // 4 Mercy
    5: { x: 70, y: 180, label: 'Geburah' }, // 5 Severity
    6: { x: 150, y: 240, label: 'Tiphareth' }, // 6 Beauty
    7: { x: 230, y: 320, label: 'Netzach' }, // 7 Victory
    8: { x: 70, y: 320, label: 'Hod' }, // 8 Splendor
    9: { x: 150, y: 390, label: 'Yesod' }, // 9 Foundation
    10: { x: 150, y: 460, label: 'Malkuth' }, // 10 Kingdom
  };

  // The 22 traditional Paths connecting Sephirot
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

  return (
    <div className={`relative bg-[#08080a] p-4 rounded-sm border border-[#c5a059]/40 flex flex-col items-center justify-center ${className}`}>
      <div className="w-full flex items-center justify-between mb-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5 text-[#c5a059] font-mono text-xs uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5" /> Interactive Tree of Life (Otzech Chiim)
        </div>
        <div className="text-[10px] font-mono text-stone-400">Click any sphere to inspect</div>
      </div>

      <svg
        viewBox="0 0 300 500"
        className="w-full max-w-[320px] h-auto drop-shadow-2xl select-none"
      >
        <defs>
          <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8a6d28" />
          </linearGradient>
          <radialGradient id="sunCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="100%" stopColor="#c5a059" />
          </radialGradient>
        </defs>

        {/* Render 22 Connecting Paths */}
        {paths.map(([from, to], idx) => {
          const p1 = nodePositions[from];
          const p2 = nodePositions[to];
          if (!p1 || !p2) return null;
          return (
            <line
              key={`path-${idx}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#c5a059"
              strokeWidth="1.5"
              strokeOpacity="0.35"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Render Sephirot Nodes */}
        {SEPHIROT_DATA.map((sephira) => {
          const pos = nodePositions[sephira.number];
          if (!pos) return null;
          const isSelected = selectedSephiraNumber === sephira.number;
          const isDaath = sephira.number === 0;

          return (
            <g
              key={sephira.number}
              onClick={() => onSelectSephira(sephira)}
              className="cursor-pointer group"
            >
              {/* Pulse ring for selected node */}
              {isSelected && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="22"
                  fill="none"
                  stroke="#c5a059"
                  strokeWidth="2"
                  className="animate-ping opacity-75"
                />
              )}

              {/* Node Circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="18"
                fill={isDaath ? '#181225' : isSelected ? 'url(#sunCenter)' : '#0e0e11'}
                stroke={isSelected ? '#ffffff' : isDaath ? '#9333ea' : '#c5a059'}
                strokeWidth={isSelected ? '2.5' : '1.5'}
                className="group-hover:scale-110 transition duration-200"
              />

              {/* Sephira Number or Symbol */}
              <text
                x={pos.x}
                y={pos.y - 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="bold"
                fill={isSelected ? '#000000' : isDaath ? '#c084fc' : '#c5a059'}
                fontFamily="monospace"
                className="pointer-events-none"
              >
                {sephira.number === 0 ? 'D' : sephira.number}
              </text>

              {/* Sephira Name Label */}
              <text
                x={pos.x}
                y={pos.y + 11}
                textAnchor="middle"
                fontSize="8"
                fill={isSelected ? '#ffffff' : '#d6d3d1'}
                fontFamily="sans-serif"
                fontWeight="600"
                className="pointer-events-none tracking-tight"
              >
                {pos.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="w-full mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-stone-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#c5a059]" /> 3 Pillars
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500" /> Da'ath Abyss
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full stroke-white border border-white" /> 22 Paths
        </span>
      </div>
    </div>
  );
};
