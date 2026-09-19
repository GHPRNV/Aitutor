import { ExecutionResult, TestCase, TestResult } from '@/types';

// Generate Python test harness code that wraps user code + test cases
export function generateTestHarness(
  userCode: string,
  testCases: TestCase[],
  problemId: string
): string {
  const functionName = getFunctionName(problemId);
  const testRunner = buildTestRunner(functionName, testCases);

  return `
import json
import sys
import traceback

# ─── User's Code ─────────────────────────────────
${userCode}

# ─── Test Runner ─────────────────────────────────
def run_tests():
    results = []
    ${testRunner}
    return results

if __name__ == "__main__":
    try:
        test_results = run_tests()
        passed = sum(1 for r in test_results if r["passed"])
        failed = len(test_results) - passed
        output = {
            "status": "accepted" if failed == 0 else "wrong_answer",
            "passed": passed,
            "failed": failed,
            "totalTests": len(test_results),
            "testResults": test_results
        }
        print("__TEST_RESULTS__")
        print(json.dumps(output))
    except Exception as e:
        print("__TEST_RESULTS__")
        print(json.dumps({
            "status": "runtime_error",
            "passed": 0,
            "failed": 0,
            "totalTests": ${testCases.length},
            "error": str(e),
            "traceback": traceback.format_exc(),
            "testResults": []
        }))
`.trim();
}

function getFunctionName(problemId: string): string {
  const map: Record<string, string> = {
    'find-largest-element': 'find_largest',
    'two-sum': 'two_sum',
    'valid-parentheses': 'is_valid',
    'reverse-string': 'reverse_string',
    'binary-search': 'binary_search',
    'maximum-subarray': 'max_subarray',
    'longest-substring-no-repeat': 'length_of_longest_substring',
    'reverse-linked-list': 'reverse_list',
    'valid-palindrome': 'is_palindrome',
    'fibonacci': 'fibonacci',
    'climbing-stairs': 'climb_stairs',
    'merge-sorted-array': 'merge_sorted',
  };
  return map[problemId] || 'solution';
}

function buildTestRunner(fnName: string, testCases: TestCase[]): string {
  const tests = testCases.map((tc, i) => {
    const inputs = tc.input.split('\n');
    const args = inputs.map(inp => inp.trim()).join(', ');
    return `
    # Test ${i + 1}
    try:
        _input_args = [${args}]
        _result = ${fnName}(*_input_args)
        _expected = ${tc.expectedOutput}
        _actual_str = str(_result)
        _expected_str = str(_expected)
        # Handle list comparison where order might matter
        _passed = (_result == _expected)
        if not _passed and isinstance(_result, list) and isinstance(_expected, list):
            _passed = sorted(map(str, _result)) == sorted(map(str, _expected))
        results.append({
            "testId": "${tc.id}",
            "passed": _passed,
            "input": ${JSON.stringify(tc.input)},
            "expectedOutput": _expected_str,
            "actualOutput": _actual_str,
            "isHidden": ${tc.isHidden},
            "error": None
        })
    except Exception as _e:
        results.append({
            "testId": "${tc.id}",
            "passed": False,
            "input": ${JSON.stringify(tc.input)},
            "expectedOutput": ${JSON.stringify(tc.expectedOutput)},
            "actualOutput": "",
            "isHidden": ${tc.isHidden},
            "error": str(_e)
        })`;
  });

  return tests.join('\n');
}

// Parse structured results from execution output
export function parseExecutionOutput(rawOutput: string): ExecutionResult {
  const marker = '__TEST_RESULTS__';
  const markerIdx = rawOutput.indexOf(marker);

  if (markerIdx === -1) {
    // No structured output — likely a compilation/syntax error
    return {
      status: rawOutput.includes('SyntaxError') ? 'compilation_error' : 'runtime_error',
      stdout: rawOutput,
      stderr: rawOutput,
      compileOutput: '',
      exitCode: 1,
      executionTime: null,
      memory: null,
      passed: 0,
      failed: 0,
      totalTests: 0,
      testResults: [],
    };
  }

  const jsonStr = rawOutput.substring(markerIdx + marker.length).trim();
  try {
    const parsed = JSON.parse(jsonStr);
    return {
      status: parsed.status || 'internal_error',
      stdout: rawOutput.substring(0, markerIdx).trim(),
      stderr: parsed.error || parsed.traceback || '',
      compileOutput: '',
      exitCode: parsed.status === 'accepted' ? 0 : 1,
      executionTime: null,
      memory: null,
      passed: parsed.passed || 0,
      failed: parsed.failed || 0,
      totalTests: parsed.totalTests || 0,
      testResults: (parsed.testResults || []).map((tr: TestResult) => ({
        testId: tr.testId,
        passed: tr.passed,
        input: tr.input,
        expectedOutput: tr.expectedOutput,
        actualOutput: tr.actualOutput,
        isHidden: tr.isHidden,
        error: tr.error || undefined,
      })),
    };
  } catch {
    return {
      status: 'internal_error',
      stdout: rawOutput,
      stderr: 'Failed to parse test results',
      compileOutput: '',
      exitCode: 1,
      executionTime: null,
      memory: null,
      passed: 0,
      failed: 0,
      totalTests: 0,
      testResults: [],
    };
  }
}
