// Project Types
export interface BookMetadata {
  title: string;
  pitch: string;
  genre: string;
  targetAudience: string;
  tone: string;
  pov: string;
  targetLength: number;
  language: string; // Langue d'écriture (fr, en, es, etc.)
  inspirations?: string;
}

export interface WritingSettings {
  wordCount: number; // Nombre de mots cible par scène/sous-chapitre
  style: string; // Style d'écriture (descriptif, dialogues, action, etc.)
  detailLevel: 'concise' | 'balanced' | 'detailed'; // Niveau de détail
  paragraphLength: 'short' | 'medium' | 'long'; // Longueur des paragraphes
}

// NEW: Scene (Scène) - Niveau le plus granulaire
export interface Scene {
  scene_index: number;
  title: string; // Nom de la scène
  beat: string; // Description courte (Beat Sheet) - ce qui se passe dans la scène
  ghostwriter_instructions: string; // Instructions détaillées pour le Ghostwriter
  content?: string; // Contenu généré
  wordCount?: number;
  status: 'draft' | 'in_progress' | 'completed' | 'validated';
}

export interface Subchapter {
  subchapter_index: number;
  title: string;
  ghostwriter_instructions?: string; // Instructions globales pour le sous-chapitre
  scenes: Scene[]; // NEW: Liste des scènes
  content?: string; // Contenu complet (concaténation des scènes)
  wordCount?: number;
  status: 'draft' | 'in_progress' | 'completed' | 'validated';
}

export interface Chapter {
  chapter_index: number;
  title: string;
  summary: string;
  cliffhanger?: string;
  ghostwriter_instructions?: string; // Instructions globales pour le chapitre
  subchapters: Subchapter[]; // Sous-chapitres
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

// Beat Sheet Generation Response
export interface BeatSheetResponse {
  scenes: Scene[]; // Liste des scènes générées
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

export interface GenerateSceneRequest {
  projectId: string;
  chapterId: string;
  subchapterId: string;
  sceneId: string;
  userInstructions?: string;
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

// NEW: Generate Beat Sheet (liste de scènes) à partir d'un résumé
export interface GenerateBeatSheetRequest {
  projectId: string;
  chapterId: string;
  subchapterId: string;
  summary: string; // Résumé du sous-chapitre
  targetSceneCount?: number; // Nombre de scènes souhaité
}

export interface AuditChapterRequest {
  projectId: string;
  chapterId: string;
  chapterText: string;
}

// Chapter Management
export interface AddChapterRequest {
  projectId: string;
  insertAfter?: number; // Si spécifié, insère après ce chapitre (sinon ajoute à la fin)
  chapterData: Partial<Chapter>;
}

export interface DeleteChapterRequest {
  projectId: string;
  chapterId: number;
}

export interface ReorderChapterRequest {
  projectId: string;
  chapterId: number;
  newPosition: number; // Nouvelle position (1-indexed)
}

// Scene Management
export interface AddSceneRequest {
  projectId: string;
  chapterId: string;
  subchapterId: string;
  insertAfter?: number; // Si spécifié, insère après cette scène
  sceneData: Partial<Scene>;
}

export interface DeleteSceneRequest {
  projectId: string;
  chapterId: string;
  subchapterId: string;
  sceneId: number;
}

export interface ReorderSceneRequest {
  projectId: string;
  chapterId: string;
  subchapterId: string;
  sceneId: number;
  newPosition: number;
}

export interface UpdateSceneRequest {
  projectId: string;
  chapterId: string;
  subchapterId: string;
  sceneId: number;
  updates: Partial<Scene>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
