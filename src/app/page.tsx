'use client';

import Link from 'next/link';
import { Brain, Code2, Mic, Target, Sparkles, ArrowRight, BookOpen, Zap, MessageSquare, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">CodeMentor<span className="text-primary">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/problems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Problems
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Coding Education</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Learn to Code,<br />
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Don&apos;t Just Copy
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            An AI tutor that teaches you to think like a programmer. Progressive hints, Socratic dialogue, 
            execution tracing, and voice interaction — not just another answer generator.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/problems" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
              Start Learning <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-3.5 rounded-xl text-base font-semibold transition-colors border border-border">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: BookOpen, title: 'Progressive Hints', desc: '5 levels of guidance — from gentle nudges to full explanations. Learn at your pace.', color: 'text-blue-400' },
            { icon: MessageSquare, title: 'Socratic Teaching', desc: 'AI asks questions to build understanding instead of just giving answers.', color: 'text-green-400' },
            { icon: Mic, title: 'Voice Tutor', desc: 'Talk to your tutor naturally. Context-aware voice debugging and explanations.', color: 'text-orange-400' },
            { icon: TrendingUp, title: 'Adaptive Learning', desc: 'Tracks misconceptions, adjusts difficulty, and recommends targeted practice.', color: 'text-pink-400' },
            { icon: Code2, title: 'Live Execution', desc: 'Run code in a secure sandbox. Real test cases, real feedback.', color: 'text-cyan-400' },
            { icon: Target, title: 'Misconception Detection', desc: 'Identifies recurring errors and teaches the underlying concept.', color: 'text-yellow-400' },
            { icon: Zap, title: 'Execution Tracing', desc: 'Step through your code visually. See variables change iteration by iteration.', color: 'text-violet-400' },
            { icon: Brain, title: 'Interview Mode', desc: 'Practice coding interviews with an AI interviewer that gives real feedback.', color: 'text-rose-400' },
          ].map((feature, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all hover:bg-card/80 group">
              <feature.icon className={`w-8 h-8 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span>CodeMentor AI</span>
          </div>
          <span>Built for RVITM Hackathon 2026</span>
        </div>
      </footer>
    </div>
  );
}
