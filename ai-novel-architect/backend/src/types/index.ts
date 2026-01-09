// Project Types
export interface BookMetadata {
  title: string;
  pitch: string;
  genre: string;
  targetAudience: string;
  tone: string;
  pov: string;
  targetLength: number;
  language: string; // NEW: Langue d'écriture (fr, en, es, etc.)
  inspirations?: string;
}

export interface WritingSettings {
  wordCount: number; // Nombre de mots cible par sous-chapitre
  style: string; // Style d'écriture (descriptif, dialogues, action, etc.)
  detailLevel: 'concise' | 'balanced' | 'detailed'; // Niveau de détail
  paragraphLength: 'short' | 'medium' | 'long'; // Longueur des paragraphes
}

export interface Subchapter {
  subchapter_index: number;
  title: string;
  ghostwriter_instructions: string; // Instructions spécifiques pour le Ghostwriter
  content?: string;
  wordCount?: number;
  status: 'draft' | 'in_progress' | 'completed' | 'validated';
}

export interface Chapter {
  chapter_index: number;
  title: string;
  summary: string;
  cliffhanger?: string;
  ghostwriter_instructions?: string; // Instructions globales pour le chapitre
  subchapters: Subchapter[]; // NEW: Sous-chapitres
  content?: string; // Contenu complet (concaténation des sous-chapitres)
  status: 'draft' | 'in_progress' | 'completed' | 'validated';
  writingSettings?: WritingSettings; // Paramètres d'écriture spécifiques
}

export interface CharacterState {
  [key: string]: any;
}

export interface Character {
  name: string;
  role: string;
  initial_state: CharacterState;
  current_state?: CharacterState;
  description?: string;
}

export interface ProjectData {
  book_metadata: BookMetadata;
  outline: Chapter[];
  characters: Character[];
  defaultWritingSettings?: WritingSettings; // Paramètres par défaut pour tout le livre
}

// AI Agent Response Types
export interface ArchitectResponse {
  book_metadata: BookMetadata;
  outline: Chapter[];
  characters: Character[];
}

export interface AuditorScore {
  continuity: number;
  outline_respect: number;
  style: number;
}

export interface AuditorIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditorResponse {
  scores: AuditorScore;
  issues: AuditorIssue[];
  regeneration_hint?: string;
}

export interface CharacterPatch {
  character_name: string;
  field: string;
  old_value: any;
  new_value: any;
}

// API Request/Response Types
export interface CreateProjectRequest {
  method: 'wizard' | 'raw';
  data: BookMetadata | { raw_text: string; targetChapterCount?: number };
}

export interface GenerateSubchapterRequest {
  projectId: string;
  chapterId: string;
  subchapterId: string;
  userInstructions?: string;
}

export interface GenerateChapterRequest {
  projectId: string;
  chapterId: string;
  userInstructions?: string;
}

export interface AuditChapterRequest {
  projectId: string;
  chapterId: string;
  chapterText: string;
}

export interface AddChapterRequest {
  projectId: string;
  insertAfter?: number; // Si spécifié, insère après ce chapitre
  chapterData: Partial<Chapter>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
