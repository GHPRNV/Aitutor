// Core problem types
export interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  tags: string[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  starterCode: Record<string, string>;
  supportedLanguages: string[];
  concepts: string[];
  hints: string[];
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description?: string;
}

// Execution types
export type ExecutionStatus =
  | 'accepted'
  | 'wrong_answer'
  | 'compilation_error'
  | 'runtime_error'
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded'
  | 'internal_error'
  | 'pending'
  | 'running';

export interface TestResult {
  testId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  isHidden: boolean;
  error?: string;
}

export interface ExecutionResult {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  compileOutput: string;
  exitCode: number | null;
  executionTime: number | null;
  memory: number | null;
  passed: number;
  failed: number;
  totalTests: number;
  testResults: TestResult[];
}

// AI response types
export type AIAnalysisStatus =
  | 'correct'
  | 'syntax_error'
  | 'runtime_error'
  | 'logic_error'
  | 'partial_solution'
  | 'inefficient'
  | 'needs_review';

export interface AITutorResponse {
  status: AIAnalysisStatus;
  summary: string;
  likelyCause: string;
  concept: string;
  lineReferences: number[];
  hintLevel: number;
  hint: string;
  nextQuestion: string;
  confidence: number;
}

export interface AIHintResponse {
  hintLevel: number;
  hint: string;
  concept: string;
  nextQuestion: string;
}

export interface AIDebugResponse {
  status: AIAnalysisStatus;
  summary: string;
  likelyCause: string;
  lineReferences: number[];
  suggestion: string;
  concept: string;
}

export interface AIExplainResponse {
  overview: string;
  lineExplanations: LineExplanation[];
  timeComplexity: string;
  spaceComplexity: string;
  keyVariables: VariableExplanation[];
  potentialIssues: string[];
}

export interface LineExplanation {
  line: number;
  code: string;
  meaning: string;
  whyItExists: string;
  whatCouldGoWrong: string;
}

export interface VariableExplanation {
  name: string;
  purpose: string;
  type: string;
}

export interface AITeachResponse {
  message: string;
  isQuestion: boolean;
  concept: string;
  followUp: string;
}

export interface AICodeQualityResponse {
  correctness: 'pass' | 'fail' | 'partial';
  timeComplexity: string;
  spaceComplexity: string;
  readability: 'excellent' | 'good' | 'fair' | 'poor';
  codeQuality: 'excellent' | 'good' | 'fair' | 'poor';
  improvements: CodeImprovement[];
  alternativeApproaches: string[];
}

export interface CodeImprovement {
  type: 'naming' | 'redundancy' | 'edge_case' | 'efficiency' | 'readability';
  description: string;
  lineReference?: number;
}

// Learning types
export interface LearningContext {
  userId: string;
  problemId: string;
  language: string;
  code: string;
  selectedCode?: string;
  execution: ExecutionResult | null;
  previousHints: AIHintResponse[];
  conversation: ConversationMessage[];
  misconceptions: Misconception[];
  mastery: ConceptMastery[];
  mode: 'tutor' | 'teach' | 'debug' | 'interview' | 'explain';
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'hint' | 'explanation' | 'question' | 'feedback' | 'general';
}

export interface Misconception {
  id: string;
  concept: string;
  confidence: number;
  evidence: string[];
  detectedAt: number;
  resolved: boolean;
}

export interface ConceptMastery {
  concept: string;
  score: number; // 0-100
  attempts: number;
  successes: number;
  lastAttempt: number;
  hintsUsed: number;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  code: string;
  result: ExecutionResult;
  hintsUsed: number;
  timestamp: number;
}

export interface UserProgress {
  userId: string;
  problemsSolved: number;
  currentStreak: number;
  totalAttempts: number;
  accuracy: number;
  conceptMastery: ConceptMastery[];
  recentSubmissions: Submission[];
  misconceptions: Misconception[];
  weakConcepts: string[];
}

export interface ProblemRecommendation {
  problemId: string;
  title: string;
  difficulty: string;
  concept: string;
  reason: string;
}

// Interview types
export interface InterviewSession {
  id: string;
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  problemId: string;
  status: 'in_progress' | 'completed';
  messages: ConversationMessage[];
  feedback?: InterviewFeedback;
  startedAt: number;
  completedAt?: number;
}

export interface InterviewFeedback {
  problemUnderstanding: FeedbackScore;
  problemSolving: FeedbackScore;
  codeCorrectness: FeedbackScore;
  complexityAnalysis: FeedbackScore;
  communication: FeedbackScore;
  debugging: FeedbackScore;
  overallScore: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
}

export interface FeedbackScore {
  score: number; // 1-5
  evidence: string;
}

// Execution trace types
export interface ExecutionTrace {
  steps: TraceStep[];
  totalIterations: number;
  finalState: Record<string, unknown>;
}

export interface TraceStep {
  iteration: number;
  line: number;
  variables: Record<string, unknown>;
  expression?: string;
  description: string;
}

// Voice types
export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  timestamp: number;
}
