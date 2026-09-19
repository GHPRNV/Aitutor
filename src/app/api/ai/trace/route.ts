import { NextRequest, NextResponse } from 'next/server';
import { traceFlow } from '@/lib/ai/flows';

export async function POST(req: NextRequest) {
  try {
    const { code, testInput } = await req.json();

    const output = await traceFlow({ code, input: testInput || 'No input' });
    return NextResponse.json(output);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI service error';
    return NextResponse.json({ error: { code: 'AI_ERROR', message } }, { status: 500 });
  }
}
