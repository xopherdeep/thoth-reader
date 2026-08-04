import type { ThothReading } from '../types';

const STORAGE_KEY = 'thoth_saved_readings_v1';

function loadInitialReadings(): ThothReading[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved readings:', e);
  }
  return [];
}

export class SavedReadingsState {
  savedReadings = $state<ThothReading[]>(loadInitialReadings());

  constructor() {
    $effect.root(() => {
      $effect(() => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.savedReadings));
          } catch (e) {
            console.error('Failed to persist saved readings:', e);
          }
        }
      });
    });
  }

  saveReading(reading: ThothReading) {
    const exists = this.savedReadings.some((r) => r.id === reading.id);
    if (exists) {
      this.savedReadings = this.savedReadings.map((r) => (r.id === reading.id ? reading : r));
    } else {
      this.savedReadings = [reading, ...this.savedReadings];
    }
  }

  deleteReading(id: string) {
    this.savedReadings = this.savedReadings.filter((r) => r.id !== id);
  }

  clearAllReadings() {
    this.savedReadings = [];
  }

  exportReadingsJSON() {
    const jsonStr = JSON.stringify(this.savedReadings, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thoth_readings_archive_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  importReadingsJSON(importedJson: string): boolean {
    try {
      const parsed = JSON.parse(importedJson);
      if (Array.isArray(parsed)) {
        const map = new Map<string, ThothReading>();
        this.savedReadings.forEach((r) => map.set(r.id, r));
        parsed.forEach((r) => {
          if (r.id && r.timestamp && r.pulledCards) {
            map.set(r.id, r);
          }
        });
        this.savedReadings = Array.from(map.values()).sort(
          (a, b) => Number(b.timestamp) - Number(a.timestamp)
        );
        return true;
      }
    } catch (e) {
      console.error('Failed to import readings JSON:', e);
    }
    return false;
  }
}

export const savedReadingsState = new SavedReadingsState();
