import React from 'react';
import { Layers } from 'lucide-react';

interface CardDetailTraditionalBridgeProps {
  traditionalInfo: {
    traditionalName: string;
    comparisonNote: string;
  };
}

export const CardDetailTraditionalBridge: React.FC<CardDetailTraditionalBridgeProps> = ({ traditionalInfo }) => {
  return (
    <div className="bg-[#0e0e11] p-6 rounded-lg border border-white/10 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Layers className="w-6 h-6 text-[#c5a059]" />
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold">
            Traditional Tarot Bridge & Historical Comparison
          </h3>
          <p className="text-xs text-stone-400 font-sans">
            Connecting Crowley's 1944 Book of Thoth to traditional Renaissance & Rider-Waite-Smith decks.
          </p>
        </div>
      </div>

      <div className="bg-[#050505] p-5 rounded-md border border-white/10 space-y-4">
        <div>
          <span className="text-xs font-mono text-stone-400 uppercase block">Traditional Equivalent Name:</span>
          <div className="text-xl font-bold text-[#c5a059] font-serif mt-1">
            {traditionalInfo.traditionalName}
          </div>
        </div>

        <div>
          <span className="text-xs font-mono text-stone-400 uppercase block">Crowley's Thoth System Variation:</span>
          <p className="text-sm text-stone-200 font-serif leading-relaxed mt-1 bg-[#0e0e11] p-4 rounded border border-white/10">
            {traditionalInfo.comparisonNote}
          </p>
        </div>
      </div>
    </div>
  );
};
