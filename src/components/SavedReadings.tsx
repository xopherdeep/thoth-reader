import React from 'react';
import { ThothReading } from '../types';
import { History, Calendar, Trash2, Eye, QrCode, Sparkles } from 'lucide-react';

interface SavedReadingsProps {
  readings: ThothReading[];
  onSelectReading: (reading: ThothReading) => void;
  onDeleteReading: (id: string) => void;
  onNewReading: () => void;
}

export const SavedReadings: React.FC<SavedReadingsProps> = ({
  readings,
  onSelectReading,
  onDeleteReading,
  onNewReading,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#0e0e11] p-6 rounded-sm border border-[#c5a059]/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#c5a059] font-mono text-xs uppercase tracking-[0.2em] mb-1">
            <History className="w-4 h-4 text-[#c5a059]" /> Reading Archives
          </div>
          <h2 className="atu-font text-2xl text-[#c5a059] font-bold tracking-wider">SAVED THOTH ORACLE READINGS</h2>
          <p className="text-stone-300 text-sm mt-0.5 font-serif">
            History of past numerological counting spreads and generated QR codes.
          </p>
        </div>

        <button
          onClick={onNewReading}
          className="px-4 py-2 bg-[#c5a059] hover:bg-[#d6b77b] text-stone-950 font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-1.5 shadow-md transition"
        >
          <Sparkles className="w-4 h-4 fill-current" /> Perform New Reading
        </button>
      </div>

      {readings.length === 0 ? (
        <div className="text-center py-16 bg-[#0e0e11] rounded-sm border border-white/10 space-y-3">
          <History className="w-10 h-10 text-stone-600 mx-auto" />
          <p className="text-stone-300 text-sm font-medium">No saved readings in your session history yet.</p>
          <button
            onClick={onNewReading}
            className="px-4 py-2 bg-[#c5a059]/20 text-[#c5a059] hover:bg-[#c5a059]/30 border border-[#c5a059]/40 text-xs font-mono uppercase tracking-widest rounded-sm transition"
          >
            Create Your First Thoth Reading
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {readings.map((r) => (
            <div
              key={r.id}
              className="bg-[#0e0e11] border border-white/10 hover:border-[#c5a059]/50 rounded-sm p-5 shadow-lg transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                  <span className="flex items-center gap-1 text-[#c5a059]">
                    <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                    {new Date(r.timestamp).toLocaleDateString(undefined, {
                      dateStyle: 'medium',
                    })}
                  </span>
                  <span>{r.pulledCards.length} Cards</span>
                </div>

                <h3 className="atu-font text-base font-bold text-[#c5a059] group-hover:text-[#d6b77b] transition line-clamp-1 tracking-wide">
                  "{r.question}"
                </h3>

                {r.aiInterpretation && (
                  <p className="text-xs text-stone-300 line-clamp-2 bg-[#050505] p-2.5 rounded-sm border border-white/5 font-serif">
                    {r.aiInterpretation.overview}
                  </p>
                )}

                {/* Pulled cards badges preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {r.pulledCards.slice(0, 4).map((c, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#050505] border border-white/10 text-stone-300"
                    >
                      {c.name}
                    </span>
                  ))}
                  {r.pulledCards.length > 4 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30">
                      +{r.pulledCards.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  onClick={() => onSelectReading(r)}
                  className="px-3.5 py-1.5 bg-[#050505] hover:bg-[#c5a059] hover:text-stone-950 text-[#c5a059] border border-[#c5a059]/40 text-xs font-mono uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> View Report & QR
                </button>

                <button
                  onClick={() => onDeleteReading(r.id)}
                  className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-sm transition"
                  title="Delete Reading"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
