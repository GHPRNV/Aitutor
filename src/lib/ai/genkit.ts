import { genkit } from 'genkit';
import { googleAI, gemini15Flash, gemini15Pro } from '@genkit-ai/google-genai';

// Initialize Genkit with Google AI plugin
export const ai = genkit({
  plugins: [googleAI()],
});

// Model references
export const MODELS = {
  primary: process.env.GEMINI_TEXT_MODEL || 'googleai/gemini-1.5-flash-latest',
  lite: process.env.GEMINI_LITE_MODEL || 'googleai/gemini-1.5-flash-8b-latest',
  live: process.env.GEMINI_LIVE_MODEL || 'googleai/gemini-1.5-pro-latest',
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
