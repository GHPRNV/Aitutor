'use client';

import Link from 'next/link';
import { Brain, Search, Filter, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { SEED_PROBLEMS } from '@/lib/data/seed-problems';
import { useState, useMemo } from 'react';

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-400 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const topics = useMemo(() => {
    const t = new Set(SEED_PROBLEMS.map(p => p.topic));
    return ['all', ...Array.from(t).sort()];
  }, []);

  const filtered = useMemo(() => {
    return SEED_PROBLEMS.filter(p => {
      const matchSearch = search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase());
      const matchTopic = topicFilter === 'all' || p.topic === topicFilter;
      const matchDiff = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
      return matchSearch && matchTopic && matchDiff;
    });
  }, [search, topicFilter, difficultyFilter]);

  // Check localStorage for solved problems
  const getSolved = () => {
    if (typeof window === 'undefined') return new Set<string>();
    try {
      const data = JSON.parse(localStorage.getItem('cm_submissions') || '[]');
      return new Set(data.filter((s: { result: { status: string } }) => s.result?.status === 'accepted').map((s: { problemId: string }) => s.problemId));
    } catch { return new Set<string>(); }
  };

  const [solved] = useState(getSolved);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">CodeMentor<span className="text-primary">AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Problem Library</h1>
          <p className="text-muted-foreground">Choose a problem and start learning. Each problem comes with AI-powered tutoring.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={topicFilter}
                onChange={e => setTopicFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
              >
                {topics.map(t => <option key={t} value={t}>{t === 'all' ? 'All Topics' : t}</option>)}
              </select>
            </div>
            <select
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value)}
              className="px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Problem Cards */}
        <div className="grid gap-3">
          {filtered.map((problem, i) => (
            <Link
              key={problem.id}
              href={`/workspace/${problem.id}`}
              className="group bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all hover:bg-card/80 animate-fade-in flex items-center gap-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex-shrink-0">
                {solved.has(problem.id) ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{problem.title}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="bg-secondary/50 px-2 py-0.5 rounded text-xs">{problem.topic}</span>
                  {problem.concepts.slice(0, 3).map(c => (
                    <span key={c} className="text-xs text-muted-foreground/70">#{c}</span>
                  ))}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No problems match your filters.</p>
            <button onClick={() => { setSearch(''); setTopicFilter('all'); setDifficultyFilter('all'); }} className="text-primary mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
