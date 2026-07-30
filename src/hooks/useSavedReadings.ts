import { useState, useEffect, useCallback } from 'react';
import { ThothReading } from '../types';

const STORAGE_KEY = 'thoth_saved_readings_v1';

/**
 * Portable TypeScript Hook for local persistence of Thoth Readings.
 */
export function useSavedReadings() {
  const [savedReadings, setSavedReadings] = useState<ThothReading[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to parse saved readings from localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedReadings));
    } catch (e) {
      console.error('Failed to persist saved readings to localStorage:', e);
    }
  }, [savedReadings]);

  const saveReading = useCallback((reading: ThothReading) => {
    setSavedReadings((prev) => {
      const exists = prev.some((r) => r.id === reading.id);
      if (exists) {
        return prev.map((r) => (r.id === reading.id ? reading : r));
      }
      return [reading, ...prev];
    });
  }, []);

  const deleteReading = useCallback((id: string) => {
    setSavedReadings((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearAllReadings = useCallback(() => {
    setSavedReadings([]);
  }, []);

  const exportReadingsJSON = useCallback(() => {
    const jsonStr = JSON.stringify(savedReadings, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thoth_readings_archive_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [savedReadings]);

  const importReadingsJSON = useCallback((importedJson: string) => {
    try {
      const parsed = JSON.parse(importedJson);
      if (Array.isArray(parsed)) {
        setSavedReadings((prev) => {
          const map = new Map<string, ThothReading>();
          prev.forEach((r) => map.set(r.id, r));
          parsed.forEach((r) => {
            if (r.id && r.timestamp && r.pulledCards) {
              map.set(r.id, r);
            }
          });
          return Array.from(map.values()).sort(
            (a, b) => Number(b.timestamp) - Number(a.timestamp)
          );
        });
        return true;
      }
    } catch (e) {
      console.error('Failed to import readings JSON:', e);
    }
    return false;
  }, []);

  return {
    savedReadings,
    saveReading,
    deleteReading,
    clearAllReadings,
    exportReadingsJSON,
    importReadingsJSON,
  };
}
