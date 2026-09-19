'use client';

import { use, useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Brain, Play, Send, Lightbulb, BookOpen, Bug, RotateCcw, ChevronDown, ChevronUp, Loader2, CheckCircle2, XCircle, AlertTriangle, Clock, MessageSquare, Sparkles, ArrowLeft } from 'lucide-react';
import { SEED_PROBLEMS, getTestCases } from '@/lib/data/seed-problems';
import type { Problem, ExecutionResult, ConversationMessage } from '@/types';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false, loading: () => <div className="h-full flex items-center justify-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading editor...</div> });

interface WorkspaceProps {
  params: Promise<{ id: string }>;
}

export default function WorkspacePage({ params }: WorkspaceProps) {
  const { id } = use(params);
  const problem = SEED_PROBLEMS.find(p => p.id === id);

  if (!problem) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Problem not found. <Link href="/problems" className="text-primary ml-2 hover:underline">Back to problems</Link></div>;
  }

  return <WorkspaceContent problem={problem} />;
}

function WorkspaceContent({ problem }: { problem: Problem }) {
  const [code, setCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`cm_code_${problem.id}`) || problem.starterCode.python || '';
    }
    return problem.starterCode.python || '';
  });
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [showExecution, setShowExecution] = useState(false);
  const [activeTab, setActiveTab] = useState<'tutor' | 'trace'>('tutor');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Autosave code
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cm_code_${problem.id}`, code);
    }
  }, [code, problem.id]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string, type?: ConversationMessage['type']) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role, content, timestamp: Date.now(), type }]);
  }, []);

  // Run code
  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setShowExecution(true);
    try {
      const res = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, problemId: problem.id, mode: 'sample' }),
      });
      const data = await res.json();
      if (data.error) {
        setExecution({ status: 'internal_error', stdout: '', stderr: data.error.message, compileOutput: '', exitCode: 1, executionTime: null, memory: null, passed: 0, failed: 0, totalTests: 0, testResults: [] });
      } else {
        setExecution(data);
      }
    } catch (err) {
      setExecution({ status: 'internal_error', stdout: '', stderr: String(err), compileOutput: '', exitCode: 1, executionTime: null, memory: null, passed: 0, failed: 0, totalTests: 0, testResults: [] });
    }
    setIsRunning(false);
  }, [code, problem.id]);

  // Submit (all tests)
  const handleSubmit = useCallback(async () => {
    setIsRunning(true);
    setShowExecution(true);
    try {
      const res = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, problemId: problem.id, mode: 'submit' }),
      });
      const data = await res.json();
      setExecution(data.error ? { status: 'internal_error', stdout: '', stderr: data.error.message, compileOutput: '', exitCode: 1, executionTime: null, memory: null, passed: 0, failed: 0, totalTests: 0, testResults: [] } : data);

      // Save submission
      if (!data.error && typeof window !== 'undefined') {
        const submissions = JSON.parse(localStorage.getItem('cm_submissions') || '[]');
        submissions.push({ id: Date.now().toString(), userId: 'demo', problemId: problem.id, language: 'python', code, result: data, hintsUsed: hintLevel, timestamp: Date.now() });
        localStorage.setItem('cm_submissions', JSON.stringify(submissions));
      }
    } catch (err) {
      setExecution({ status: 'internal_error', stdout: '', stderr: String(err), compileOutput: '', exitCode: 1, executionTime: null, memory: null, passed: 0, failed: 0, totalTests: 0, testResults: [] });
    }
    setIsRunning(false);
  }, [code, problem.id, hintLevel]);

  // AI actions
  const callAI = useCallback(async (endpoint: string, extra: Record<string, unknown> = {}) => {
    setIsAiLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          problemId: problem.id,
          language: 'python',
          execution: execution ? JSON.stringify(execution) : null,
          previousHints: messages.filter(m => m.type === 'hint').map(m => m.content),
          ...extra,
        }),
      });
      const data = await res.json();
      return data;
    } catch {
      return { error: { message: 'AI service unavailable' } };
    } finally {
      setIsAiLoading(false);
    }
  }, [code, problem.id, execution, messages]);

  const handleHint = useCallback(async () => {
    const newLevel = Math.min(hintLevel + 1, 5);
    addMessage('user', `Give me a hint (level ${newLevel})`, 'hint');
    const data = await callAI('/api/ai/hint', { hintLevel: newLevel });
    if (data.error) {
      addMessage('assistant', data.error.message || 'AI unavailable right now.', 'general');
    } else {
      addMessage('assistant', `**Hint Level ${data.hintLevel || newLevel}:**\n\n${data.hint || data.message || 'Think about the problem constraints.'}`, 'hint');
      setHintLevel(newLevel);
    }
  }, [hintLevel, addMessage, callAI]);

  const handleExplain = useCallback(async () => {
    addMessage('user', 'Explain my code', 'general');
    const data = await callAI('/api/ai/explain');
    if (data.error) {
      addMessage('assistant', data.error.message || 'AI unavailable.', 'general');
    } else {
      const explanation = data.overview || data.message || JSON.stringify(data);
      const parts = [explanation];
      if (data.timeComplexity) parts.push(`\n**Time Complexity:** ${data.timeComplexity}`);
      if (data.spaceComplexity) parts.push(`**Space Complexity:** ${data.spaceComplexity}`);
      if (data.potentialIssues?.length) parts.push(`\n**Potential Issues:**\n${data.potentialIssues.map((i: string) => `- ${i}`).join('\n')}`);
      addMessage('assistant', parts.join('\n'), 'explanation');
    }
  }, [addMessage, callAI]);

  const handleDebug = useCallback(async () => {
    if (!execution) {
      addMessage('assistant', 'Run your code first so I can analyze the results!', 'general');
      return;
    }
    addMessage('user', 'Debug my code', 'general');
    const data = await callAI('/api/ai/debug');
    if (data.error) {
      addMessage('assistant', data.error.message || 'AI unavailable.', 'general');
    } else {
      const parts = [`**${data.status || 'Analysis'}:** ${data.summary || ''}`];
      if (data.likelyCause) parts.push(`\n**Likely Cause:** ${data.likelyCause}`);
      if (data.suggestion) parts.push(`\n**Suggestion:** ${data.suggestion}`);
      if (data.lineReferences?.length) parts.push(`\n*Check lines: ${data.lineReferences.join(', ')}*`);
      addMessage('assistant', parts.join('\n'), 'feedback');
    }
  }, [execution, addMessage, callAI]);

  const handleChat = useCallback(async () => {
    if (!userInput.trim()) return;
    const msg = userInput.trim();
    setUserInput('');
    addMessage('user', msg, 'general');
    const data = await callAI('/api/ai/tutor', { message: msg, conversation: messages.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n') });
    if (data.error) {
      addMessage('assistant', data.error.message || 'AI unavailable.', 'general');
    } else {
      addMessage('assistant', data.hint || data.summary || data.message || JSON.stringify(data), 'general');
    }
  }, [userInput, addMessage, callAI, messages]);

  const handleReset = useCallback(() => {
    setCode(problem.starterCode.python || '');
    setExecution(null);
    setHintLevel(0);
  }, [problem]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(); }
  };

  const sampleTests = getTestCases(problem.id, false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-card/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/problems" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Brain className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm truncate max-w-[200px]">{problem.title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${problem.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' : problem.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRun} disabled={isRunning} className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Run
          </button>
          <button onClick={handleSubmit} disabled={isRunning} className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Submit
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button onClick={handleHint} disabled={isAiLoading} className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 disabled:opacity-50 text-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-border">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" /> Hint {hintLevel > 0 && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1 rounded">{hintLevel}/5</span>}
          </button>
          <button onClick={handleExplain} disabled={isAiLoading} className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 disabled:opacity-50 text-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-border">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Explain
          </button>
          <button onClick={handleDebug} disabled={isAiLoading} className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 disabled:opacity-50 text-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-border">
            <Bug className="w-3.5 h-3.5 text-red-400" /> Debug
          </button>
          <button onClick={handleReset} className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-border">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT — Problem Panel */}
        <div className="w-[360px] border-r border-border/50 overflow-y-auto flex-shrink-0 bg-card/30">
          <div className="p-5">
            <h2 className="text-lg font-bold mb-3">{problem.title}</h2>
            <div className="flex gap-2 mb-4">
              <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded">{problem.topic}</span>
              {problem.concepts.map(c => <span key={c} className="text-xs text-muted-foreground">#{c}</span>)}
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap mb-4">{problem.description}</div>

              <h3 className="text-sm font-semibold text-foreground mt-5 mb-2">Examples</h3>
              {problem.examples.map((ex, i) => (
                <div key={i} className="bg-background/50 border border-border/50 rounded-lg p-3 mb-3 text-sm">
                  <div className="mb-1"><span className="text-muted-foreground">Input:</span> <code className="text-primary/90">{ex.input}</code></div>
                  <div className="mb-1"><span className="text-muted-foreground">Output:</span> <code className="text-green-400/90">{ex.output}</code></div>
                  {ex.explanation && <div className="text-muted-foreground text-xs mt-1">{ex.explanation}</div>}
                </div>
              ))}

              <h3 className="text-sm font-semibold text-foreground mt-5 mb-2">Constraints</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {problem.constraints.map((c, i) => <li key={i} className="text-xs font-mono">{c}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* CENTER — Code Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                fontFamily: 'var(--font-geist-mono), monospace',
                minimap: { enabled: false },
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                bracketPairColorization: { enabled: true },
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Execution Panel */}
          <div className={`border-t border-border/50 bg-card/50 transition-all ${showExecution ? 'h-[200px]' : 'h-9'}`}>
            <button onClick={() => setShowExecution(!showExecution)} className="w-full h-9 px-4 flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              <div className="flex items-center gap-2">
                {execution ? (
                  execution.status === 'accepted' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> :
                  execution.status === 'runtime_error' || execution.status === 'compilation_error' ? <XCircle className="w-3.5 h-3.5 text-red-400" /> :
                  execution.status === 'time_limit_exceeded' ? <Clock className="w-3.5 h-3.5 text-yellow-400" /> :
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                ) : null}
                <span>Test Results {execution ? `— ${execution.passed}/${execution.totalTests} passed` : ''}</span>
                {execution?.status === 'accepted' && <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] font-semibold">ACCEPTED</span>}
              </div>
              {showExecution ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            {showExecution && execution && (
              <div className="px-4 pb-3 overflow-y-auto h-[calc(200px-36px)]">
                {execution.stderr && (
                  <pre className="text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded p-2 mb-2 whitespace-pre-wrap font-mono">{execution.stderr.slice(0, 1000)}</pre>
                )}
                {execution.stdout && (
                  <pre className="text-xs text-muted-foreground bg-background/50 rounded p-2 mb-2 whitespace-pre-wrap font-mono">{execution.stdout.slice(0, 500)}</pre>
                )}
                {execution.testResults.length > 0 && (
                  <div className="space-y-1">
                    {execution.testResults.filter(t => !t.isHidden).map((t, i) => (
                      <div key={i} className={`flex items-center gap-3 px-3 py-1.5 rounded text-xs ${t.passed ? 'bg-green-500/5 text-green-400' : 'bg-red-500/5 text-red-400'}`}>
                        {t.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span className="font-medium">Test {i + 1}</span>
                        <span className="text-muted-foreground font-mono">{t.input.slice(0, 40)}</span>
                        {!t.passed && <span className="ml-auto font-mono">got: {t.actualOutput.slice(0, 30)} | expected: {t.expectedOutput.slice(0, 30)}</span>}
                        {t.passed && <span className="ml-auto font-semibold">PASS</span>}
                      </div>
                    ))}
                    {execution.testResults.some(t => t.isHidden) && (
                      <div className="text-xs text-muted-foreground px-3 py-1">
                        + {execution.testResults.filter(t => t.isHidden).length} hidden tests: {execution.testResults.filter(t => t.isHidden && t.passed).length} passed
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — AI Tutor Panel */}
        <div className="w-[380px] border-l border-border/50 flex flex-col flex-shrink-0 bg-card/30">
          <div className="h-10 border-b border-border/50 flex items-center px-4 gap-1">
            <button onClick={() => setActiveTab('tutor')} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeTab === 'tutor' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <MessageSquare className="w-3.5 h-3.5 inline mr-1" />AI Tutor
            </button>
            <button onClick={() => setActiveTab('trace')} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeTab === 'trace' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />Trace
            </button>
          </div>

          {activeTab === 'tutor' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <Brain className="w-10 h-10 mx-auto mb-3 text-primary/40" />
                    <p className="text-sm font-medium mb-1">I&apos;m your AI tutor</p>
                    <p className="text-xs">Ask questions, request hints, or let me explain your code. I&apos;ll guide you — not just give answers.</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {['What approach should I use?', 'Why is my code wrong?', 'Explain this concept'].map(q => (
                        <button key={q} onClick={() => { setUserInput(q); }} className="text-xs bg-secondary/50 hover:bg-secondary border border-border/50 px-3 py-1.5 rounded-full transition-colors">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary/10 text-foreground border border-primary/20' : 'bg-secondary/50 text-foreground border border-border/50'}`}>
                      <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-border/50 p-3">
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask your tutor..."
                    rows={1}
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                  <button onClick={handleChat} disabled={isAiLoading || !userInput.trim()} className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-3 rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'trace' && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center text-muted-foreground py-12">
                <Sparkles className="w-10 h-10 mx-auto mb-3 text-primary/40" />
                <p className="text-sm font-medium mb-1">Execution Trace</p>
                <p className="text-xs mb-4">Run your code first, then I&apos;ll trace through it step by step.</p>
                {execution && (
                  <button onClick={async () => {
                    setIsAiLoading(true);
                    const data = await callAI('/api/ai/trace', { testInput: sampleTests[0]?.input });
                    setIsAiLoading(false);
                    if (data.steps) {
                      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `**Execution Trace:**\n\n${data.steps.map((s: { iteration: number; description: string; variables: Record<string, unknown> }) => `Step ${s.iteration}: ${s.description}\nVariables: ${JSON.stringify(s.variables)}`).join('\n\n')}`, timestamp: Date.now(), type: 'explanation' }]);
                      setActiveTab('tutor');
                    }
                  }} className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/20 transition-colors">
                    Generate Trace
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
