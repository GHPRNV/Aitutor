import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize Genkit with Google AI plugin
export const ai = genkit({
  plugins: [googleAI()],
});

// Model references — configurable via env vars
export const MODELS = {
  primary: process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash',
  lite: process.env.GEMINI_LITE_MODEL || 'gemini-1.5-flash-8b',
  live: process.env.GEMINI_LIVE_MODEL || 'gemini-2.0-flash-exp',
} as const;

// Model router — picks the right model for the task
export type TaskComplexity = 'simple' | 'moderate' | 'complex';

export function getModelForTask(complexity: TaskComplexity): string {
  switch (complexity) {
    case 'simple':
      return MODELS.lite;
    case 'moderate':
      return MODELS.primary;
    case 'complex':
      return MODELS.primary;
    default:
      return MODELS.primary;
  }
}
