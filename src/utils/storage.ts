import type { AppState, ImportExportData } from '../types';

const STORAGE_KEY = 'kudos-class-app-state';

export const defaultAppState: AppState = {
  mode: 'setup',
  className: '',
  students: []
};

export function loadAppState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultAppState, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load app state from localStorage:', error);
  }
  return defaultAppState;
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save app state to localStorage:', error);
  }
}

export function exportAppData(state: AppState): ImportExportData {
  return {
    className: state.className,
    students: state.students,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
}

export function validateImportData(data: any): ImportExportData | null {
  try {
    if (
      typeof data === 'object' &&
      data !== null &&
      typeof data.className === 'string' &&
      Array.isArray(data.students) &&
      typeof data.exportDate === 'string' &&
      typeof data.version === 'string'
    ) {
      // Validate student structure
      const validStudents = data.students.every((student: any) =>
        typeof student === 'object' &&
        student !== null &&
        typeof student.id === 'string' &&
        typeof student.name === 'string' &&
        typeof student.stars === 'number' &&
        student.stars >= 0 &&
        student.stars <= 4
      );

      if (validStudents) {
        return data as ImportExportData;
      }
    }
  } catch (error) {
    console.error('Import data validation failed:', error);
  }
  return null;
}

export function downloadJSON(data: ImportExportData, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}