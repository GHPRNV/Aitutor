import { ai, MODELS } from './genkit';
import { z } from 'genkit';
import {
  TUTOR_SYSTEM_PROMPT,
  HINT_SYSTEM_PROMPT,
  DEBUG_SYSTEM_PROMPT,
  EXPLAIN_SYSTEM_PROMPT,
  TEACH_SYSTEM_PROMPT,
  INTERVIEW_SYSTEM_PROMPT,
  MISCONCEPTION_SYSTEM_PROMPT,
  CODE_QUALITY_SYSTEM_PROMPT,
  TRACE_SYSTEM_PROMPT,
} from '@/lib/prompts';

// ─── Schemas ────────────────────────────────────────────────────────────────

const TutorResponseSchema = z.object({
  status: z.enum(['correct', 'syntax_error', 'runtime_error', 'logic_error', 'partial_solution', 'inefficient', 'needs_review']),
  summary: z.string(),
  likelyCause: z.string(),
  concept: z.string(),
  lineReferences: z.array(z.number()),
  hintLevel: z.number(),
  hint: z.string(),
  nextQuestion: z.string(),
  confidence: z.number(),
});

const HintResponseSchema = z.object({
  hintLevel: z.number(),
  hint: z.string(),
  concept: z.string(),
  nextQuestion: z.string(),
});

const DebugResponseSchema = z.object({
  status: z.enum(['syntax_error', 'runtime_error', 'logic_error', 'partial_solution', 'inefficient', 'needs_review']),
  summary: z.string(),
  likelyCause: z.string(),
  lineReferences: z.array(z.number()),
  suggestion: z.string(),
  concept: z.string(),
});

const ExplainResponseSchema = z.object({
  overview: z.string(),
  lineExplanations: z.array(z.object({
    line: z.number(),
    code: z.string(),
    meaning: z.string(),
    whyItExists: z.string(),
    whatCouldGoWrong: z.string(),
  })),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  keyVariables: z.array(z.object({
    name: z.string(),
    purpose: z.string(),
    type: z.string(),
  })),
  potentialIssues: z.array(z.string()),
});

const TeachResponseSchema = z.object({
  message: z.string(),
  isQuestion: z.boolean(),
  concept: z.string(),
  followUp: z.string(),
});

const MisconceptionSchema = z.object({
  misconceptions: z.array(z.object({
    concept: z.string(),
    confidence: z.number(),
    evidence: z.array(z.string()),
  })),
});

const CodeQualitySchema = z.object({
  correctness: z.enum(['pass', 'fail', 'partial']),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  readability: z.enum(['excellent', 'good', 'fair', 'poor']),
  codeQuality: z.enum(['excellent', 'good', 'fair', 'poor']),
  improvements: z.array(z.object({
    type: z.enum(['naming', 'redundancy', 'edge_case', 'efficiency', 'readability']),
    description: z.string(),
  })),
  alternativeApproaches: z.array(z.string()),
});

const TraceSchema = z.object({
  steps: z.array(z.object({
    iteration: z.number(),
    line: z.number(),
    variables: z.record(z.string(), z.any()),
    description: z.string(),
  })),
  totalIterations: z.number(),
});

const InterviewResponseSchema = z.object({
  message: z.string(),
  phase: z.enum(['introduction', 'approach', 'coding', 'review', 'followup', 'completed']),
  feedback: z.object({
    problemUnderstanding: z.object({ score: z.number(), evidence: z.string() }).optional(),
    problemSolving: z.object({ score: z.number(), evidence: z.string() }).optional(),
    codeCorrectness: z.object({ score: z.number(), evidence: z.string() }).optional(),
    complexityAnalysis: z.object({ score: z.number(), evidence: z.string() }).optional(),
    communication: z.object({ score: z.number(), evidence: z.string() }).optional(),
    debugging: z.object({ score: z.number(), evidence: z.string() }).optional(),
    overallScore: z.number().optional(),
    summary: z.string().optional(),
    strengths: z.array(z.string()).optional(),
    areasForImprovement: z.array(z.string()).optional(),
  }).optional(),
});

// ─── Helper to build context string ─────────────────────────────────────────

function buildContext(params: {
  problem?: string;
  code?: string;
  language?: string;
  execution?: string;
  previousHints?: string;
  conversation?: string;
  selectedCode?: string;
  mastery?: string;
}): string {
  const parts: string[] = [];
  if (params.problem) parts.push(`## Problem\n${params.problem}`);
  if (params.language) parts.push(`## Language\n${params.language}`);
  if (params.code) parts.push(`## Student's Code\n\`\`\`${params.language || 'python'}\n${params.code}\n\`\`\``);
  if (params.selectedCode) parts.push(`## Selected Code\n\`\`\`\n${params.selectedCode}\n\`\`\``);
  if (params.execution) parts.push(`## Execution Result\n${params.execution}`);
  if (params.previousHints) parts.push(`## Previous Hints Given\n${params.previousHints}`);
  if (params.conversation) parts.push(`## Conversation History\n${params.conversation}`);
  if (params.mastery) parts.push(`## Student's Concept Mastery\n${params.mastery}`);
  return parts.join('\n\n');
}

// ─── Genkit Flows ───────────────────────────────────────────────────────────

export const tutorFlow = ai.defineFlow(
  { name: 'tutorFlow', inputSchema: z.object({ context: z.string(), userMessage: z.string() }), outputSchema: TutorResponseSchema },
  async ({ context, userMessage }) => {
    const { output } = await ai.generate({
      model: MODELS.primary,
      system: TUTOR_SYSTEM_PROMPT,
      prompt: `${context}\n\n## Student's Message\n${userMessage}`,
      output: { schema: TutorResponseSchema },
    });
    return output!;
  }
);

export const hintFlow = ai.defineFlow(
  { name: 'hintFlow', inputSchema: z.object({ context: z.string(), currentLevel: z.number() }), outputSchema: HintResponseSchema },
  async ({ context, currentLevel }) => {
    const { output } = await ai.generate({
      model: MODELS.primary,
      system: HINT_SYSTEM_PROMPT,
      prompt: `${context}\n\n## Requested Hint Level: ${currentLevel}\nProvide a hint at level ${currentLevel}. Remember the progression rules.`,
      output: { schema: HintResponseSchema },
    });
    return output!;
  }
);

export const debugFlow = ai.defineFlow(
  { name: 'debugFlow', inputSchema: z.object({ context: z.string() }), outputSchema: DebugResponseSchema },
  async ({ context }) => {
    const { output } = await ai.generate({
      model: MODELS.primary,
      system: DEBUG_SYSTEM_PROMPT,
      prompt: context,
      output: { schema: DebugResponseSchema },
    });
    return output!;
  }
);

export const explainFlow = ai.defineFlow(
  { name: 'explainFlow', inputSchema: z.object({ context: z.string() }), outputSchema: ExplainResponseSchema },
  async ({ context }) => {
    const { output } = await ai.generate({
      model: MODELS.primary,
      system: EXPLAIN_SYSTEM_PROMPT,
      prompt: context,
      output: { schema: ExplainResponseSchema },
    });
    return output!;
  }
);

export const teachFlow = ai.defineFlow(
  { name: 'teachFlow', inputSchema: z.object({ context: z.string(), studentMessage: z.string() }), outputSchema: TeachResponseSchema },
  async ({ context, studentMessage }) => {
    const { output } = await ai.generate({
      model: MODELS.primary,
      system: TEACH_SYSTEM_PROMPT,
      prompt: `${context}\n\n## Student says: "${studentMessage}"`,
      output: { schema: TeachResponseSchema },
    });
    return output!;
  }
);

export const misconceptionFlow = ai.defineFlow(
  { name: 'misconceptionFlow', inputSchema: z.object({ context: z.string() }), outputSchema: MisconceptionSchema },
  async ({ context }) => {
    const { output } = await ai.generate({
      model: MODELS.lite,
      system: MISCONCEPTION_SYSTEM_PROMPT,
      prompt: context,
      output: { schema: MisconceptionSchema },
    });
    return output!;
  }
);

export const codeQualityFlow = ai.defineFlow(
  { name: 'codeQualityFlow', inputSchema: z.object({ context: z.string() }), outputSchema: CodeQualitySchema },
  async ({ context }) => {
    const { output } = await ai.generate({
      model: MODELS.primary,
      system: CODE_QUALITY_SYSTEM_PROMPT,
      prompt: context,
      output: { schema: CodeQualitySchema },
    });
    return output!;
  }
);

export const traceFlow = ai.defineFlow(
  { name: 'traceFlow', inputSchema: z.object({ code: z.string(), input: z.string() }), outputSchema: TraceSchema },
  async ({ code, input }) => {
    const { output } = await ai.generate({
      model: MODELS.primary,
      system: TRACE_SYSTEM_PROMPT,
      prompt: `## Code\n\`\`\`python\n${code}\n\`\`\`\n\n## Input\n${input}\n\nGenerate a step-by-step execution trace.`,
      output: { schema: TraceSchema },
    });
    return output!;
  }
);

export const interviewFlow = ai.defineFlow(
  { name: 'interviewFlow', inputSchema: z.object({ context: z.string(), message: z.string() }), outputSchema: InterviewResponseSchema },
  async ({ context, message }) => {
    const { output } = await ai.generate({
      model: MODELS.primary,
      system: INTERVIEW_SYSTEM_PROMPT,
      prompt: `${context}\n\n## Candidate says: "${message}"`,
      output: { schema: InterviewResponseSchema },
    });
    return output!;
  }
);

// ─── Code Execution via Gemini ──────────────────────────────────────────────

export const executeCodeFlow = ai.defineFlow(
  { name: 'executeCodeFlow', inputSchema: z.object({ code: z.string(), testCode: z.string() }), outputSchema: z.object({ stdout: z.string(), stderr: z.string(), success: z.boolean() }) },
  async ({ code, testCode }) => {
    const fullCode = `${code}\n\n${testCode}`;
    const response = await ai.generate({
      model: MODELS.primary,
      tools: ['codeExecution'],
      prompt: `Execute this Python code and return the exact output. Do not modify the code. Just run it.\n\n\`\`\`python\n${fullCode}\n\`\`\``,
    });

    const text = response.text || '';
    // Parse execution results from the response
    const hasError = text.toLowerCase().includes('error') || text.toLowerCase().includes('traceback');
    return {
      stdout: text,
      stderr: hasError ? text : '',
      success: !hasError,
    };
  }
);

// Export the context builder for use in API routes
export { buildContext };
