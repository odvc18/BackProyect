// ============================================================================
// TIPOS PRINCIPALES DEL SISTEMA
// ============================================================================

// ============================================================================
// TIPOS DE AUTENTICACIÓN (ws-identity)
// ============================================================================

export interface User {
  id: string
  email: string
  passwordHash?: string
  role: UserRole
  firstName?: string
  lastName?: string
  phone?: string
  institution?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type UserRole = 'Admin' | 'Judge' | 'Participant' | 'Viewer'

export interface UserCreateDto {
  email: string
  password: string
  role: UserRole
  firstName?: string
  lastName?: string
  phone?: string
  institution?: string
}

export interface UserUpdateDto {
  id: string
  firstName?: string
  lastName?: string
  phone?: string
  institution?: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresIn: number
}

// ============================================================================
// TIPOS DE CONCURSOS (ws-contest)
// ============================================================================

export interface Contest {
  id: string
  title: string
  description?: string
  rules?: string
  status: ContestStatus
  startDate: string
  endDate: string
  judgingDate?: string
  maxSubmissionsPerParticipant: number
  createdByUserId: string
  createdAt: string
  updatedAt: string
  categories?: Category[]
}

export type ContestStatus = 'Draft' | 'Published' | 'Closed' | 'Judging' | 'Completed'

export interface ContestCreateDto {
  title: string
  description?: string
  rules?: string
  status: ContestStatus
  startDate: string
  endDate: string
  judgingDate?: string
  maxSubmissionsPerParticipant: number
  createdByUserId: string
}

export interface ContestUpdateDto {
  id: string
  title?: string
  description?: string
  rules?: string
  status?: ContestStatus
  endDate?: string
  judgingDate?: string
}

export interface Category {
  id: string
  contestId: string
  name: string
  description?: string
  maxSubmissions?: number
  allowedFileTypes?: string
  maxFileSizeMb: number
  createdAt: string
  updatedAt: string
}

export interface CategoryCreateDto {
  contestId: string
  name: string
  description?: string
  maxSubmissions?: number
  allowedFileTypes?: string
  maxFileSizeMb: number
}

// ============================================================================
// TIPOS DE SUBMISSIONS (ws-submission)
// ============================================================================

export interface Submission {
  id: string
  contestId: string
  categoryId: string
  participantId: string
  title?: string
  description?: string
  status: SubmissionStatus
  submittedAt?: string
  createdAt: string
  updatedAt: string
  files?: SubmissionFile[]
}

export type SubmissionStatus = 'Draft' | 'Submitted' | 'UnderReview' | 'Evaluated' | 'Rejected'

export interface SubmissionCreateDto {
  contestId: string
  categoryId: string
  participantId: string
  title?: string
  description?: string
}

export interface SubmissionFile {
  id: string
  submissionId: string
  fileName: string
  originalName: string
  storedPath: string
  fileSize: number
  mimeType: string
  uploadedAt: string
}

export interface SubmissionFileCreateDto {
  submissionId: string
  fileName: string
  originalName: string
  storedPath: string
  fileSize: number
  mimeType: string
}

// ============================================================================
// TIPOS DE EVALUACIÓN (ws-evaluation)
// ============================================================================

export interface JudgeAssignment {
  id: string
  contestId: string
  submissionId: string
  judgeId: string
  status: AssignmentStatus
  assignedAt: string
  completedAt?: string
}

export type AssignmentStatus = 'Assigned' | 'InProgress' | 'Completed' | 'Overdue'

export interface JudgeAssignmentCreateDto {
  contestId: string
  submissionId: string
  judgeId: string
}

export interface Score {
  id: string
  judgeAssignmentId: string
  rubricCriterionId: string
  score: number
  comments?: string
  createdAt: string
}

export interface ScoreCreateDto {
  judgeAssignmentId: string
  rubricCriterionId: string
  score: number
  comments?: string
}

export interface Rubric {
  id: string
  contestId: string
  criterionName: string
  description?: string
  maxScore: number
  weight: number
  criteriaOrder: number
  createdAt: string
}

export interface RubricCreateDto {
  contestId: string
  criterionName: string
  description?: string
  maxScore: number
  weight: number
  criteriaOrder: number
}

// ============================================================================
// TIPOS DE ANÁLISIS IA (ws-ai_analysis)
// ============================================================================

export interface AnalysisRequest {
  id: string
  submissionFileId: string
  filePath: string
  analysisType: AnalysisType
  status: AnalysisStatus
  requestedAt: string
  startedAt?: string
  completedAt?: string
  errorMessage?: string
}

export type AnalysisType = 'Plagiarism' | 'CodeQuality' | 'ContentAnalysis' | 'SentimentAnalysis'
export type AnalysisStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed'

export interface AnalysisRequestCreateDto {
  submissionFileId: string
  filePath: string
  analysisType: AnalysisType
}

export interface AnalysisResult {
  id: string
  analysisRequestId: string
  resultType: string
  resultData: string
  confidenceScore?: number
  metadata?: string
  createdAt: string
}

export interface AnalysisResultCreateDto {
  analysisRequestId: string
  resultType: string
  resultData: string
  confidenceScore?: number
  metadata?: string
}

// ============================================================================
// TIPOS DE API RESPONSE
// ============================================================================

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

// ============================================================================
// TIPOS DE ESTADO GLOBAL (REDUX)
// ============================================================================

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface ContestState {
  contests: Contest[]
  currentContest: Contest | null
  categories: Category[]
  isLoading: boolean
  error: string | null
}

export interface SubmissionState {
  submissions: Submission[]
  currentSubmission: Submission | null
  files: SubmissionFile[]
  isLoading: boolean
  error: string | null
}

export interface EvaluationState {
  assignments: JudgeAssignment[]
  scores: Score[]
  rubrics: Rubric[]
  isLoading: boolean
  error: string | null
}

export interface AiAnalysisState {
  requests: AnalysisRequest[]
  results: AnalysisResult[]
  isLoading: boolean
  error: string | null
}

export interface UiState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  loading: boolean
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
}

// ============================================================================
// TIPOS DE FORMULARIOS
// ============================================================================

export interface FormErrors {
  [key: string]: string | undefined
}

export interface FormState<T> {
  values: T
  errors: FormErrors
  touched: { [key: string]: boolean }
  isSubmitting: boolean
  isValid: boolean
}

// ============================================================================
// TIPOS DE NAVEGACIÓN
// ============================================================================

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon: string
  children?: NavigationItem[]
  roles?: UserRole[]
}

// ============================================================================
// TIPOS DE DASHBOARD
// ============================================================================

export interface DashboardStats {
  totalContests: number
  activeContests: number
  totalSubmissions: number
  pendingEvaluations: number
  completedEvaluations: number
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

// ============================================================================
// TIPOS DE UTILIDADES
// ============================================================================

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface TableColumn<T> {
  id: keyof T
  label: string
  minWidth?: number
  align?: 'left' | 'right' | 'center'
  format?: (value: any) => string
  sortable?: boolean
}

export interface FilterOption {
  field: string
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan'
  value: any
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

export interface PaginationOptions {
  page: number
  pageSize: number
  totalCount: number
}

// ============================================================================
// TIPOS DE EVENTOS
// ============================================================================

export interface FileUploadEvent {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

export interface DragDropEvent {
  files: File[]
  position: { x: number; y: number }
}

// ============================================================================
// TIPOS DE CONFIGURACIÓN
// ============================================================================

export interface AppConfig {
  apiBaseUrl: string
  appName: string
  appVersion: string
  environment: 'development' | 'staging' | 'production'
  features: {
    aiAnalysis: boolean
    fileUpload: boolean
    realTimeNotifications: boolean
  }
}

export default {}
