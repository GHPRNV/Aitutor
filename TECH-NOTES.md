# Tech Notes

## Model Decisions (Sept 2026)
- **Primary AI:** Gemini 3.8 Flash — latest stable Flash model, free tier available
- **Lite AI:** Gemini 3.5 Flash — for simple tasks (hints, summaries)
- **Voice AI:** Gemini 3.8 Live — for real-time audio (when integrated)
- **SDK:** `@google/genai` is deprecated in favor of `genkit` + `@genkit-ai/google-genai`

## Framework
- **Genkit 1.42.0** — Firebase's agentic AI framework. Used for:
  - `defineFlow` — typed AI workflows with Zod schemas
  - Structured output via `output.schema`
  - Code execution via `codeExecution: true` config
  - Model routing (primary vs lite)
- **Next.js 15.5 LTS** — Maintenance LTS until Oct 2026. Chose over v16 for stability.
- **Tailwind CSS v4** — via `@tailwindcss/postcss`, using `@theme inline` syntax
- **Monaco Editor** — `@monaco-editor/react` v4.7, lazy-loaded via `next/dynamic`

## Code Execution
- Uses Gemini's built-in code execution sandbox (Python only)
- No Docker or Judge0 required
- Test harness generated in `lib/code-execution/provider.ts`
- User code is wrapped with test runner, sent to Gemini with `codeExecution: true`
- Structured JSON results parsed from stdout

## Storage
- **localStorage** for prototype (submissions, progress, code autosave)
- **Firebase Firestore** optional for cloud persistence
- **Firebase Auth** optional for user accounts
- App works fully without Firebase configured

## Package Versions
| Package | Version | Notes |
|---------|---------|-------|
| genkit | 1.42.0 | AI framework |
| @genkit-ai/google-genai | 1.42.0 | Gemini plugin |
| firebase | 12.19.0 | Optional |
| @monaco-editor/react | 4.7.0 | Code editor |
| zod | 4.6.5 | Schema validation (via genkit re-export) |
| recharts | 3.10.1 | Dashboard charts |
| lucide-react | 1.47.0 | Icons |

## Zod Version Note
- Genkit re-exports its own `z` from `'genkit'` which is Zod v4 compatible
- The `zod` package installed separately is v4.6.5
- Use `import { z } from 'genkit'` in flow definitions for compatibility
