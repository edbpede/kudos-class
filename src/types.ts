export interface Student {
  id: string;
  name: string;
  stars: number; // 0-4 stars
}

export interface Rule {
  id: string;
  description: string;
  type: 'positive' | 'negative'; // positive = award star, negative = subtract star
  order: number; // for display ordering
}

export interface AppState {
  mode: 'setup' | 'awarding';
  className: string;
  students: Student[];
  rules: Rule[];
}

export interface ImportExportData {
  className: string;
  students: Student[];
  rules: Rule[];
  exportDate: string;
  version: string;
}