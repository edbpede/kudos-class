export interface Student {
  id: string;
  name: string;
  stars: number; // 0-4 stars
}

export interface AppState {
  mode: 'setup' | 'awarding';
  className: string;
  students: Student[];
}

export interface ImportExportData {
  className: string;
  students: Student[];
  exportDate: string;
  version: string;
}