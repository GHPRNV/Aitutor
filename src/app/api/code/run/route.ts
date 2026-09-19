import { NextRequest, NextResponse } from 'next/server';
import { SEED_PROBLEMS, getTestCases } from '@/lib/data/seed-problems';
import { generateTestHarness, parseExecutionOutput } from '@/lib/code-execution/provider';
import { executeCodeFlow } from '@/lib/ai/flows';

export async function POST(req: NextRequest) {
  try {
    const { code, problemId, mode } = await req.json();

    if (!code || !problemId) {
      return NextResponse.json({ error: { code: 'INVALID_INPUT', message: 'Code and problemId are required' } }, { status: 400 });
    }

    if (code.length > 50000) {
      return NextResponse.json({ error: { code: 'CODE_TOO_LARGE', message: 'Code exceeds maximum size' } }, { status: 400 });
    }

    const problem = SEED_PROBLEMS.find(p => p.id === problemId);
    if (!problem) {
      return NextResponse.json({ error: { code: 'PROBLEM_NOT_FOUND', message: 'Problem not found' } }, { status: 404 });
    }

    const includeHidden = mode === 'submit';
    const testCases = getTestCases(problemId, includeHidden);

    if (testCases.length === 0) {
      return NextResponse.json({ error: { code: 'NO_TESTS', message: 'No test cases available' } }, { status: 500 });
    }

    // Generate test harness
    const testHarness = generateTestHarness(code, testCases, problemId);

    // Execute via Gemini code execution
    try {
      const execResult = await executeCodeFlow({ code: testHarness, testCode: '' });
      const result = parseExecutionOutput(execResult.stdout);
      return NextResponse.json(result);
    } catch (aiError: unknown) {
      const errorMessage = aiError instanceof Error ? aiError.message : 'Unknown AI error';

      if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        return NextResponse.json({
          error: { code: 'AI_QUOTA_EXCEEDED', message: 'AI service quota exceeded. Please try again later.', retryable: true }
        }, { status: 429 });
      }

      return NextResponse.json({
        status: 'internal_error',
        stdout: '',
        stderr: `Code execution service error: ${errorMessage}`,
        compileOutput: '',
        exitCode: 1,
        executionTime: null,
        memory: null,
        passed: 0,
        failed: 0,
        totalTests: testCases.length,
        testResults: [],
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message } }, { status: 500 });
  }
}
