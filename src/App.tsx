import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThothReading } from './types';
import { useSavedReadings } from './hooks/useSavedReadings';
import { MainLayout } from './components/templates/MainLayout';
import { Compendium } from './components/Compendium';
import { ReadingStudio } from './components/ReadingStudio';
import { ReadingReport } from './components/ReadingReport';
import { SavedReadings } from './components/SavedReadings';
import { GlossaryAndIndex } from './components/GlossaryAndIndex';
import { PlusCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'compendium' | 'saved' | 'report' | 'glossary'>('studio');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activeReading, setActiveReading] = useState<ThothReading | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { savedReadings, saveReading, deleteReading, exportReadingsJSON, importReadingsJSON } =
    useSavedReadings();

  // Sync route with window.location.hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#/card/') || hash.startsWith('#card-')) {
        const cardId = hash.startsWith('#/card/')
          ? hash.replace('#/card/', '')
          : hash.replace('#card-', '');
        setActiveTab('compendium');
        setSelectedCardId(cardId);
      } else if (hash.startsWith('#/compendium') || hash === '#compendium') {
        setActiveTab('compendium');
        setSelectedCardId(null);
      } else if (hash.startsWith('#/saved') || hash === '#saved' || hash === '#archives') {
        setActiveTab('saved');
        setSelectedCardId(null);
      } else if (hash.startsWith('#/glossary') || hash === '#glossary' || hash === '#index') {
        setActiveTab('glossary');
        setSelectedCardId(null);
      } else if (hash.startsWith('#/report') || hash === '#report') {
        setActiveTab('report');
        setSelectedCardId(null);
      } else {
        // Default studio route
        setActiveTab('studio');
        setSelectedCardId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route;
    setIsMobileMenuOpen(false);
  };

  // Check URL parameters for shared QR code readings (?readingId=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const readingId = params.get('readingId');

    if (readingId) {
      const localMatch = savedReadings.find((r) => r.id === readingId);
      if (localMatch) {
        setActiveReading(localMatch);
        setActiveTab('report');
      } else {
        fetch(`/api/readings/${readingId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.reading) {
              setActiveReading(data.reading);
              setActiveTab('report');
            }
          })
          .catch((err) => console.warn('Could not load shared reading from server:', err));
      }
    }
  }, [savedReadings]);

  const handleReadingCreated = (newReading: ThothReading) => {
    saveReading(newReading);
    setActiveReading(newReading);
    setActiveTab('report');
  };

  const handleDeleteReading = (id: string) => {
    deleteReading(id);
    if (activeReading?.id === id) {
      setActiveReading(null);
      setActiveTab('studio');
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onNavigate={navigateTo}
      savedReadingsCount={savedReadings.length}
      activeReading={activeReading}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <AnimatePresence mode="wait">
        {activeTab === 'studio' && (
          <motion.div
            key="studio-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            <ReadingStudio onReadingCreated={handleReadingCreated} />
          </motion.div>
        )}

        {activeTab === 'compendium' && (
          <motion.div
            key="compendium-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            <Compendium initialCardId={selectedCardId} />
          </motion.div>
        )}

        {activeTab === 'saved' && (
          <motion.div
            key="saved-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            <SavedReadings
              readings={savedReadings}
              onSelectReading={(reading) => {
                setActiveReading(reading);
                setActiveTab('report');
              }}
              onDeleteReading={handleDeleteReading}
              onNewReading={() => navigateTo('#/studio')}
            />
          </motion.div>
        )}

        {activeTab === 'glossary' && (
          <motion.div
            key="glossary-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            <GlossaryAndIndex />
          </motion.div>
        )}

        {activeTab === 'report' && activeReading && (
          <motion.div
            key="report-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            <ReadingReport
              reading={activeReading}
              onNewReading={() => navigateTo('#/studio')}
            />
          </motion.div>
        )}

        {activeTab === 'report' && !activeReading && (
          <div className="text-center py-20 bg-[#0e0e11] rounded-sm border border-white/10 p-8 space-y-4">
            <h3 className="atu-font text-2xl text-[#c5a059] font-bold">No Active Reading Selected</h3>
            <p className="text-stone-300 text-sm max-w-md mx-auto">
              Cast a new spread inquiry in the Studio or select a saved reading from the Archives to view the full alchemical report.
            </p>
            <button
              onClick={() => navigateTo('#/studio')}
              className="px-6 py-3 bg-[#c5a059] text-black font-bold font-mono text-sm rounded-sm hover:brightness-110 transition inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cast New Reading Inquiry</span>
            </button>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
