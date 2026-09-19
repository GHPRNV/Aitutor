import { NextRequest, NextResponse } from 'next/server';
import { explainFlow, buildContext } from '@/lib/ai/flows';
import { SEED_PROBLEMS } from '@/lib/data/seed-problems';

export async function POST(req: NextRequest) {
  try {
    const { code, problemId, language } = await req.json();

    const problem = SEED_PROBLEMS.find(p => p.id === problemId);

    const context = buildContext({
      problem: problem ? `${problem.title}\n${problem.description}` : undefined,
      code,
      language,
    });

    const output = await explainFlow({ context });

    return NextResponse.json(output);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI service error';
    if (message.includes('quota') || message.includes('429')) {
      return NextResponse.json({ error: { code: 'AI_QUOTA_EXCEEDED', message: 'AI quota exceeded', retryable: true } }, { status: 429 });
    }
    return NextResponse.json({ error: { code: 'AI_ERROR', message } }, { status: 500 });
  }
}
