import { NextRequest, NextResponse } from 'next/server';
import { tutorFlow, buildContext } from '@/lib/ai/flows';
import { SEED_PROBLEMS } from '@/lib/data/seed-problems';

export async function POST(req: NextRequest) {
  try {
    const { code, problemId, language, execution, message, conversation } = await req.json();

    const problem = SEED_PROBLEMS.find(p => p.id === problemId);
    if (!problem) {
      return NextResponse.json({ error: { code: 'PROBLEM_NOT_FOUND', message: 'Problem not found' } }, { status: 404 });
    }

    const context = buildContext({
      problem: `${problem.title}\n${problem.description}`,
      code,
      language,
      execution,
      conversation,
    });

    const output = await tutorFlow({ context, userMessage: message || 'Help me with this problem' });
    return NextResponse.json(output);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI service error';
    if (message.includes('quota') || message.includes('429')) {
      return NextResponse.json({ error: { code: 'AI_QUOTA_EXCEEDED', message: 'AI quota exceeded', retryable: true } }, { status: 429 });
    }
    return NextResponse.json({ error: { code: 'AI_ERROR', message } }, { status: 500 });
  }
}
