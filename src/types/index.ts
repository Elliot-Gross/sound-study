export interface User {
  id: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  name?: string
  email: string
  birthYear?: number
  locale: string
  createdAt: Date
  profile?: Profile
}

export interface Profile {
  id: string
  userId: string
  interests: string[]
  preferredGenres: string[]
  privacyDefaults: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Notes {
  id: string
  userId: string
  subject: string
  rawRef?: string
  cleanedText: string
  topicTags: string[]
  complexity: 'SIMPLE' | 'INTERMEDIATE' | 'ADVANCED'
  createdAt: Date
  facts: Fact[]
}

export interface Fact {
  id: string
  notesId: string
  text: string
  importance: number
  entities: string[]
  mustInclude: boolean
  createdAt: Date
}

export interface Song {
  id: string
  notesId: string
  createdBy: string
  provider: 'SUNO' | 'FALLBACK'
  styleGenre: string
  bpm: number
  lyricDensity: 'LOW' | 'MEDIUM' | 'HIGH'
  lengthSec: number
  mode: 'SONG' | 'NARRATION'
  audioUrl?: string
  lyricsUrl?: string
  captionsUrl?: string
  remixOf?: string
  isPublic: boolean
  visibilityScope: 'PRIVATE' | 'FRIENDS' | 'PUBLIC'
  createdAt: Date
  stats?: SongStats
}

export interface SongStats {
  id: string
  songId: string
  plays: number
  uniqueListeners: number
  completionPct: number
  dailyReplays: number
  likes: number
  shares: number
  quizLiftDelta: number
  createdAt: Date
  updatedAt: Date
}

export interface Quiz {
  id: string
  songId: string
  userId: string
  scheduledAt: Date
  deliveredVia: 'EMAIL' | 'PUSH' | 'WEB'
  completedAt?: Date
  scorePct?: number
  confidenceAvg?: number
  createdAt: Date
  items: QuizItem[]
}

export interface QuizItem {
  id: string
  quizId: string
  type: 'RECALL' | 'MCQ' | 'CLOZE'
  promptText: string
  correctAnswer: string
  distractors: string[]
  result?: 'CORRECT' | 'INCORRECT' | 'SKIPPED'
  latencyMs?: number
  createdAt: Date
}

export interface ProviderJob {
  id: string
  provider: 'SUNO' | 'FALLBACK'
  requestPayloadRef: string
  state: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RETRYING'
  attempts: number
  lastError?: string
  outputRef?: string
  costEstimate?: number
  createdAt: Date
  updatedAt: Date
}

export interface Moderation {
  id: string
  targetType: 'SONG' | 'USER' | 'COMMENT'
  targetId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED'
  reason?: string
  decisionBy?: string
  decidedAt?: Date
  notes?: string
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface CreateSongForm {
  title: string
  subject: string
  content: string
  lengthCategory: 'short' | 'medium' | 'long'
  genre: string
  bpm: number
  lyricDensity: 'LOW' | 'MEDIUM' | 'HIGH'
  complexity: 'SIMPLE' | 'INTERMEDIATE' | 'ADVANCED'
}

export interface UploadFile {
  file: File
  type: 'text' | 'pdf' | 'docx' | 'image'
  preview?: string
}

// LLM Response Types
export interface FactExtractionResponse {
  topics: string[]
  facts: Array<{
    text: string
    must_include: boolean
    importance: 1 | 2 | 3
    entities: string[]
  }>
  glossary: Array<{
    term: string
    definition: string
  }>
  complexity: 'simple' | 'complex'
}

export interface LyricPlannerResponse {
  lyrics: string
  structure: string
  hook_line: string
  key_concepts: string[]
  timing_hints: Array<{
    section: string
    start_time: number
    end_time: number
  }>
}

export interface NewsGateResponse {
  mode: 'song' | 'narration'
  reasons: string[]
}

// Suno API Types
export interface SunoGenerateRequest {
  topic?: string
  prompt?: string
  tags: string
  negative_tags?: string
  make_instrumental?: boolean
}

export interface SunoGenerateResponse {
  id: string
  status: 'queued' | 'streaming' | 'complete' | 'failed'
  audio_url?: string
  metadata?: {
    duration?: number
    error_message?: string
  }
}

export interface SunoClipResponse {
  id: string
  status: 'queued' | 'streaming' | 'complete' | 'failed'
  audio_url?: string
  metadata?: {
    duration?: number
    error_message?: string
  }
}

// Dashboard Types
export interface DashboardStats {
  totalSongs: number
  completedQuizzes: number
  averageScore: number
  totalPlays: number
  currentStreak: number
  totalStudyTime: number
}

export interface StudyProgress {
  quiz: number
  score: number
  date: string
}

export interface SubjectDistribution {
  subject: string
  count: number
}

export interface GenrePerformance {
  genre: string
  score: number
  songs: number
}

// Search Types
export interface SearchFilters {
  subject?: string
  genre?: string
  lengthCategory?: string
  complexity?: string
  isPublic?: boolean
}

export interface SearchResult {
  songs: Song[]
  total: number
  filters: SearchFilters
}

// Recommendation Types
export interface Recommendation {
  songId: string
  score: number
  reason: string
  type: 'for_you' | 'trending' | 'same_topic' | 'popular'
}

export interface RecommendationsCache {
  userId: string
  candidateIds: string[]
  computedAt: Date
  featuresSnapshot: Record<string, any>
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
}

// Navigation Types
export interface NavigationItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

// Player Types
export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
  loopMode: 'none' | 'song' | 'hook'
}

export interface Caption {
  start: number
  end: number
  text: string
}

// File Upload Types
export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  error?: string
}

export interface ProcessedFile {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  extractedText: string
  topicTags: string[]
  complexity: 'SIMPLE' | 'INTERMEDIATE' | 'ADVANCED'
  ocrConfidence?: number
  createdAt: Date
}
