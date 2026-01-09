// Project Types
export interface BookMetadata {
  title: string;
  pitch: string;
  genre: string;
  targetAudience: string;
  tone: string;
  pov: string;
  targetLength: number;
  inspirations?: string;
}

export interface Chapter {
  chapter_index: number;
  title: string;
  summary: string;
  cliffhanger?: string;
  content?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'validated';
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
  data: BookMetadata | { raw_text: string };
}

export interface GenerateChapterRequest {
  projectId: string;
  chapterId: string;
  userInstructions?: string;
}

export interface AuditChapterRequest {
  projectId: string;
  chapterText: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
