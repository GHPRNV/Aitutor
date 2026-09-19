'use client';

import Link from 'next/link';
import { Brain, Trophy, Flame, Target, TrendingUp, BookOpen, ArrowRight, BarChart3, AlertCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SEED_PROBLEMS } from '@/lib/data/seed-problems';
import { calculateProgress, generateRecommendations } from '@/lib/scoring';
import type { Submission, UserProgress, ProblemRecommendation } from '@/types';

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [recommendations, setRecommendations] = useState<ProblemRecommendation[]>([]);

  useEffect(() => {
    const submissions: Submission[] = JSON.parse(localStorage.getItem('cm_submissions') || '[]');
    const prog = calculateProgress('demo', submissions, []);
    setProgress(prog);
    setRecommendations(generateRecommendations(prog));
  }, []);

  const solvedCount = progress?.problemsSolved || 0;
  const streak = progress?.currentStreak || 0;
  const accuracy = progress?.accuracy || 0;
  const totalProblems = SEED_PROBLEMS.length;

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
            <Link href="/problems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Problems</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Track your progress and continue learning.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border/50 rounded-xl p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <span className="text-xs text-muted-foreground">{solvedCount}/{totalProblems}</span>
            </div>
            <div className="text-2xl font-bold">{solvedCount}</div>
            <div className="text-sm text-muted-foreground">Problems Solved</div>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-8 h-8 text-orange-400" />
              <span className="text-xs text-muted-foreground">days</span>
            </div>
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-5 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-green-400" />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
            <div className="text-2xl font-bold">{accuracy}</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-5 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <span className="text-xs text-muted-foreground">concepts</span>
            </div>
            <div className="text-2xl font-bold">{progress?.conceptMastery.length || 0}</div>
            <div className="text-sm text-muted-foreground">Concepts Practiced</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Concept Mastery */}
          <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Concept Mastery
            </h2>
            {progress?.conceptMastery && progress.conceptMastery.length > 0 ? (
              <div className="space-y-3">
                {progress.conceptMastery.sort((a, b) => b.score - a.score).map(cm => (
                  <div key={cm.concept} className="flex items-center gap-3">
                    <span className="text-sm w-32 truncate capitalize">{cm.concept}</span>
                    <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cm.score >= 70 ? 'bg-green-500' : cm.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${cm.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono w-10 text-right text-muted-foreground">{cm.score}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Start solving problems to track your mastery!</p>
                <Link href="/problems" className="inline-flex items-center gap-1 text-primary text-sm mt-2 hover:underline">
                  Browse Problems <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Weak Areas + Recommendations */}
          <div className="space-y-6">
            {/* Weak Areas */}
            {progress?.weakConcepts && progress.weakConcepts.length > 0 && (
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" /> Weak Areas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {progress.weakConcepts.map(c => (
                    <span key={c} className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-full capitalize">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Problem */}
            {recommendations.length > 0 && (
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Recommended
                </h2>
                {recommendations.slice(0, 2).map(rec => (
                  <Link key={rec.problemId} href={`/workspace/${rec.problemId}`} className="block mb-3 last:mb-0 bg-background/50 border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm group-hover:text-primary transition-colors">{rec.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${rec.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{rec.difficulty}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.reason}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* Recent Activity */}
            {progress?.recentSubmissions && progress.recentSubmissions.length > 0 && (
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" /> Recent
                </h2>
                <div className="space-y-2">
                  {progress.recentSubmissions.slice(0, 5).map((s, i) => {
                    const problem = SEED_PROBLEMS.find(p => p.id === s.problemId);
                    return (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full ${s.result.status === 'accepted' ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="truncate flex-1">{problem?.title || s.problemId}</span>
                        <span className="text-xs text-muted-foreground">{s.result.passed}/{s.result.totalTests}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link href="/problems" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]">
            Continue Learning <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275z"/></svg>;
}
