import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize Genkit with Google AI plugin
export const ai = genkit({
  plugins: [googleAI()],
});

// Model references
export const MODELS = {
  primary: process.env.GEMINI_TEXT_MODEL || 'googleai/gemini-3.5-flash-lite',
  lite: process.env.GEMINI_LITE_MODEL || 'googleai/gemini-3.5-flash-lite',
  live: process.env.GEMINI_LIVE_MODEL || 'googleai/gemini-3.5-flash-lite',
} as const;

// Model router — picks the right model for the task
export type TaskComplexity = 'simple' | 'moderate' | 'complex';

export function getModelForTask(complexity: TaskComplexity) {
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
