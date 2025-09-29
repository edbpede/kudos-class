import type { AppState, ImportExportData, Student, Rule } from '../types';

const STORAGE_KEY = 'kudos-class-app-state';

export const defaultAppState: AppState = {
  mode: 'setup',
  className: '',
  students: [],
  rules: []
};

export function loadAppState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure backward compatibility by adding missing fields
      return {
        ...defaultAppState,
        ...parsed,
        rules: parsed.rules || [] // Ensure rules array exists
      };
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
    students: sortStudentsAlphabetically(state.students),
    rules: sortRulesByOrder(state.rules),
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
      Array.isArray(data.rules || []) && // rules are optional for backward compatibility
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

      // Validate rules structure (if rules exist)
      const validRules = !data.rules || data.rules.every((rule: any) =>
        typeof rule === 'object' &&
        rule !== null &&
        typeof rule.id === 'string' &&
        typeof rule.description === 'string' &&
        (rule.type === 'positive' || rule.type === 'negative') &&
        typeof rule.order === 'number'
      );

      if (validStudents && validRules) {
        // Ensure rules array exists for backward compatibility
        return {
          ...data,
          rules: data.rules || []
        } as ImportExportData;
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

export function sortStudentsAlphabetically(students: Student[]): Student[] {
  // Create a collator specifically for Danish alphabet order
  // In Danish: A-Z, then Æ, Ø, Å at the end
  const collator = new Intl.Collator('da-DK', {
    sensitivity: 'accent', // Case-insensitive but respects accents for proper Danish ordering
    numeric: false,
    ignorePunctuation: false,
    caseFirst: 'lower'
  });

  // Create a copy of the array to avoid mutating the original
  return [...students].sort((a, b) => collator.compare(a.name, b.name));
}

export function sortRulesByOrder(rules: Rule[]): Rule[] {
  // Create a copy of the array to avoid mutating the original
  // Sort by order field, then by type (positive first), then by description
  return [...rules].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    if (a.type !== b.type) {
      return a.type === 'positive' ? -1 : 1;
    }
    return a.description.localeCompare(b.description);
  });
}