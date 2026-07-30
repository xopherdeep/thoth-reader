import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { AnimatePresence } from 'motion/react';
import { ThothReading, PoeticNarrative } from '../types';
import { TarotCardView } from './TarotCardView';
import { NarrativeSynthesizer } from './NarrativeSynthesizer';
import { SynchronicityAnalysisView } from './SynchronicityAnalysisView';
import { FullScreenStorybook } from './FullScreenStorybook';
import {
  QrCode,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Compass,
  Flame,
  Feather,
  ArrowLeft,
  Calendar,
  Play,
} from 'lucide-react';

interface ReadingReportProps {
  reading: ThothReading;
  onBackToStudio?: () => void;
  isSharedView?: boolean;
}

export const ReadingReport: React.FC<ReadingReportProps> = ({
  reading,
  onBackToStudio,
  isSharedView = false,
}) => {
  const [activeReading, setActiveReading] = useState<ThothReading>(reading);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isStorybookOpen, setIsStorybookOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setActiveReading(reading);
  }, [reading]);

  const handleNarrativeUpdated = (narrative: PoeticNarrative) => {
    setActiveReading((prev) => ({
      ...prev,
      poeticNarrative: narrative,
      aiInterpretation: prev.aiInterpretation
        ? { ...prev.aiInterpretation, poeticNarrative: narrative }
        : prev.aiInterpretation,
    }));
  };

  // Construct absolute URL for QR Code scanning
  const shareableUrl = `${window.location.origin}${window.location.pathname}?readingId=${reading.id}`;

  useEffect(() => {
    // Generate QR Code data URL
    const payload = JSON.stringify({
      id: reading.id,
      q: reading.question,
      cards: reading.pulledCards.map((c) => c.name),
    });

    // Also encode shareable URL into QR code
    QRCode.toDataURL(shareableUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR Code generation error:', err));
  }, [reading, shareableUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `thoth-reading-qr-${reading.id}.png`;
    a.click();
  };

  const interpretation = reading.aiInterpretation;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <AnimatePresence>
        {isStorybookOpen && (
          <FullScreenStorybook 
            reading={activeReading} 
            onClose={() => setIsStorybookOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        {onBackToStudio ? (
          <button
            onClick={onBackToStudio}
            className="px-3.5 py-1.5 bg-[#0e0e11] hover:bg-black border border-white/10 text-[#c5a059] text-xs font-mono uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Reading Studio
          </button>
        ) : (
          <div /> // Spacer
        )}
        
        <button
          onClick={() => setIsStorybookOpen(true)}
          className="px-4 py-2 bg-[#c5a059] hover:bg-[#d4b472] text-black text-sm font-mono uppercase tracking-widest rounded-sm flex items-center gap-2 transition font-bold shadow-[0_0_15px_rgba(197,160,89,0.3)]"
        >
          <Play className="w-4 h-4" /> Present Storybook
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-[#0e0e11] border border-[#c5a059]/40 rounded-sm p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 text-[#c5a059] font-mono text-xs uppercase tracking-[0.2em]">
              <Sparkles className="w-4 h-4 text-[#c5a059]" /> Book of Thoth Reading Report
            </div>
            <h1 className="atu-font text-2xl sm:text-3xl font-bold text-[#c5a059] tracking-wider">
              {interpretation?.title || 'Thoth Oracle Reading'}
            </h1>

            <div className="bg-[#050505] p-4 rounded-sm border border-white/10 text-stone-200 text-sm">
              <span className="text-[10px] text-[#c5a059]/80 font-mono uppercase tracking-widest block mb-1">
                Querent’s Inquiry / Intention
              </span>
              <p className="font-serif italic text-stone-100 text-base">
                "{reading.question}"
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-stone-400 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                {new Date(reading.timestamp).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
              <span>•</span>
              <span className="text-[#c5a059] font-bold">
                {reading.pulledCards.length} Cards Pulled in Loop
              </span>
            </div>
          </div>

          {/* QR CODE SHARE BOX */}
          <div className="bg-[#050505] border border-[#c5a059]/40 p-4 rounded-sm flex flex-col items-center justify-center shadow-2xl text-center shrink-0 w-full md:w-56">
            <div className="text-[10px] font-mono text-[#c5a059] uppercase tracking-widest mb-2 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5" /> Scan on Mobile Device
            </div>

            {qrDataUrl ? (
              <div className="bg-white p-2 rounded-sm shadow-md border border-stone-300 mb-3">
                <img src={qrDataUrl} alt="Reading QR Code" className="w-36 h-36" />
              </div>
            ) : (
              <div className="w-36 h-36 bg-[#0e0e11] rounded-sm flex items-center justify-center text-xs text-stone-500 mb-3 font-mono">
                Generating QR...
              </div>
            )}

            <p className="text-[10px] text-stone-400 mb-2">
              Scan with phone camera to view full reading on your mobile device.
            </p>

            <div className="flex items-center gap-1.5 w-full">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-1.5 bg-[#0e0e11] hover:bg-black text-[#c5a059] border border-[#c5a059]/30 text-[11px] font-mono uppercase tracking-wider rounded-sm flex items-center justify-center gap-1 transition"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleDownloadQR}
                className="p-1.5 bg-[#0e0e11] hover:bg-black text-[#c5a059] border border-[#c5a059]/30 text-[11px] font-medium rounded-sm transition"
                title="Download QR Image"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview & Core Alchemical Theme */}
      {interpretation && (
        <div className="bg-[#0e0e11] border border-white/10 rounded-sm p-6 shadow-xl space-y-4">
          <h2 className="atu-font text-lg font-bold text-[#c5a059] flex items-center gap-2 tracking-wider uppercase">
            <Flame className="w-5 h-5 text-[#c5a059]" /> Executive Esoteric Synthesis
          </h2>
          <p className="text-stone-200 text-sm leading-relaxed bg-[#050505] p-4 rounded-sm border border-white/10 font-serif">
            {interpretation.overview}
          </p>
        </div>
      )}

      {/* Pulled Cards Sequence Gallery */}
      <div className="bg-[#0e0e11] border border-white/10 rounded-sm p-6 shadow-xl space-y-4">
        <h2 className="atu-font text-lg font-bold text-[#c5a059] flex items-center gap-2 tracking-wider uppercase">
          <BookOpen className="w-5 h-5 text-[#c5a059]" /> The Counting Loop Card Sequence
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center">
          {activeReading.pulledCards.map((card, idx) => (
            <TarotCardView
              key={`${card.id}-${idx}`}
              card={card}
              stepNumber={idx + 1}
              size="md"
              showDetailsOnClick={true}
            />
          ))}
        </div>
      </div>

      {/* Proof of Non-Random Synchronicity & Combination Matrix */}
      <SynchronicityAnalysisView pulledCards={activeReading.pulledCards} />

      {/* AI Narrative Synthesizer Component (Complements Visual Cards) */}
      <NarrativeSynthesizer
        reading={activeReading}
        onNarrativeUpdated={handleNarrativeUpdated}
      />

      {/* Numerological & Alchemical Journey */}
      {interpretation?.numerologicalJourney && (
        <div className="bg-[#0e0e11] border border-white/10 rounded-sm p-6 shadow-xl space-y-3">
          <h2 className="atu-font text-lg font-bold text-[#c5a059] flex items-center gap-2 tracking-wider uppercase">
            <Compass className="w-5 h-5 text-[#c5a059]" /> The Numerological Path of the Spread
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed bg-[#050505] p-4 rounded-sm border border-white/10 font-serif">
            {interpretation.numerologicalJourney}
          </p>
        </div>
      )}

      {/* Deep Counsel & Alchemical Formula */}
      {interpretation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0e0e11] border border-white/10 rounded-sm p-6 shadow-xl space-y-4">
            <h2 className="atu-font text-lg font-bold text-[#c5a059] flex items-center gap-2 tracking-wider uppercase">
              <Feather className="w-5 h-5 text-[#c5a059]" /> Direct Oracle Answer
            </h2>
            <p className="text-stone-200 text-sm leading-relaxed bg-[#050505] p-4 rounded-sm border border-white/10 font-serif">
              {interpretation.deepAnswer}
            </p>
          </div>

          <div className="bg-[#0e0e11] border border-white/10 rounded-sm p-6 shadow-xl space-y-4">
            <h2 className="atu-font text-lg font-bold text-[#c5a059] flex items-center gap-2 tracking-wider uppercase">
              <Sparkles className="w-5 h-5 text-[#c5a059]" /> Actionable Directives & Hermetic Formula
            </h2>
            <ul className="space-y-2 text-sm text-stone-300">
              {interpretation.actionableCounsel.map((directive, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#050505] p-2.5 rounded-sm border border-white/10">
                  <span className="text-[#c5a059] font-mono font-bold">{idx + 1}.</span>
                  <span className="font-serif text-stone-200">{directive}</span>
                </li>
              ))}
            </ul>

            {interpretation.alchemicalFormula && (
              <div className="bg-[#050505] border border-[#c5a059]/40 p-3.5 rounded-sm text-center">
                <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-widest block mb-0.5">
                  Alchemical Hermetic Motto
                </span>
                <span className="text-base font-serif italic font-bold text-[#c5a059]">
                  "{interpretation.alchemicalFormula}"
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
