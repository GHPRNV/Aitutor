import { ConceptMastery, Submission, Misconception, UserProgress, ProblemRecommendation } from '@/types';
import { SEED_PROBLEMS } from '@/lib/data/seed-problems';

// ─── Mastery Scoring ────────────────────────────────────────────────────────
// Score = weighted combination of success rate, recency, hint efficiency, and attempts
// All values are deterministic and transparent

export function calculateConceptMastery(
  concept: string,
  submissions: Submission[]
): ConceptMastery {
  const relevant = submissions.filter(s => {
    const problem = SEED_PROBLEMS.find(p => p.id === s.problemId);
    return problem?.concepts.includes(concept) || problem?.topic.toLowerCase() === concept.toLowerCase();
  });

  if (relevant.length === 0) {
    return {
      concept,
      score: 0,
      attempts: 0,
      successes: 0,
      lastAttempt: 0,
      hintsUsed: 0,
    };
  }

  const attempts = relevant.length;
  const successes = relevant.filter(s => s.result.status === 'accepted').length;
  const totalHints = relevant.reduce((sum, s) => sum + s.hintsUsed, 0);
  const lastAttempt = Math.max(...relevant.map(s => s.timestamp));

  // Success rate (0-100), weighted 50%
  const successRate = attempts > 0 ? (successes / attempts) * 100 : 0;

  // Hint penalty: more hints used = less mastery, weighted 20%
  const avgHints = totalHints / attempts;
  const hintPenalty = Math.max(0, 100 - avgHints * 20);

  // Recency bonus: recent practice = higher score, weighted 15%
  const daysSinceLastAttempt = (Date.now() - lastAttempt) / (1000 * 60 * 60 * 24);
  const recencyBonus = Math.max(0, 100 - daysSinceLastAttempt * 5);

  // Volume bonus: more attempts = slightly more mastery, weighted 15%
  const volumeBonus = Math.min(100, attempts * 20);

  const score = Math.round(
    successRate * 0.5 +
    hintPenalty * 0.2 +
    recencyBonus * 0.15 +
    volumeBonus * 0.15
  );

  return {
    concept,
    score: Math.max(0, Math.min(100, score)),
    attempts,
    successes,
    lastAttempt,
    hintsUsed: totalHints,
  };
}

// ─── Progress Calculation ───────────────────────────────────────────────────

export function calculateProgress(
  userId: string,
  submissions: Submission[],
  misconceptions: Misconception[]
): UserProgress {
  const allConcepts = new Set<string>();
  SEED_PROBLEMS.forEach(p => {
    p.concepts.forEach(c => allConcepts.add(c));
    allConcepts.add(p.topic.toLowerCase());
  });

  const conceptMastery = Array.from(allConcepts).map(concept =>
    calculateConceptMastery(concept, submissions)
  ).filter(cm => cm.attempts > 0);

  const solvedProblems = new Set(
    submissions.filter(s => s.result.status === 'accepted').map(s => s.problemId)
  );

  const totalAttempts = submissions.length;
  const successfulAttempts = submissions.filter(s => s.result.status === 'accepted').length;

  // Calculate streak
  const streak = calculateStreak(submissions);

  // Weak concepts (mastery < 50%)
  const weakConcepts = conceptMastery
    .filter(cm => cm.score < 50)
    .sort((a, b) => a.score - b.score)
    .map(cm => cm.concept);

  return {
    userId,
    problemsSolved: solvedProblems.size,
    currentStreak: streak,
    totalAttempts,
    accuracy: totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 0,
    conceptMastery,
    recentSubmissions: submissions.slice(-10).reverse(),
    misconceptions: misconceptions.filter(m => !m.resolved),
    weakConcepts,
  };
}

function calculateStreak(submissions: Submission[]): number {
  if (submissions.length === 0) return 0;

  const accepted = submissions
    .filter(s => s.result.status === 'accepted')
    .sort((a, b) => b.timestamp - a.timestamp);

  if (accepted.length === 0) return 0;

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(accepted[0].timestamp);
  lastDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  for (let i = 1; i < accepted.length; i++) {
    const prev = new Date(accepted[i - 1].timestamp);
    prev.setHours(0, 0, 0, 0);
    const curr = new Date(accepted[i].timestamp);
    curr.setHours(0, 0, 0, 0);
    const diff = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ─── Recommendations ────────────────────────────────────────────────────────

export function generateRecommendations(
  progress: UserProgress
): ProblemRecommendation[] {
  const solvedIds = new Set(
    progress.recentSubmissions
      .filter(s => s.result.status === 'accepted')
      .map(s => s.problemId)
  );

  const unsolved = SEED_PROBLEMS.filter(p => !solvedIds.has(p.id));
  if (unsolved.length === 0) return [];

  const recommendations: ProblemRecommendation[] = [];

  // Priority 1: Problems targeting weak concepts
  for (const weakConcept of progress.weakConcepts) {
    const match = unsolved.find(p =>
      p.concepts.includes(weakConcept) || p.topic.toLowerCase() === weakConcept
    );
    if (match && !recommendations.find(r => r.problemId === match.id)) {
      recommendations.push({
        problemId: match.id,
        title: match.title,
        difficulty: match.difficulty,
        concept: weakConcept,
        reason: `You're still building strength in ${weakConcept}. This problem will help you practice.`,
      });
    }
  }

  // Priority 2: Easy unsolved problems for confidence
  const easyUnsolved = unsolved.filter(p => p.difficulty === 'easy');
  for (const problem of easyUnsolved) {
    if (!recommendations.find(r => r.problemId === problem.id)) {
      recommendations.push({
        problemId: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        concept: problem.topic,
        reason: `A great ${problem.difficulty} problem to build confidence with ${problem.topic}.`,
      });
    }
    if (recommendations.length >= 3) break;
  }

  // Priority 3: Medium problems for growth
  if (recommendations.length < 3) {
    const mediumUnsolved = unsolved.filter(p => p.difficulty === 'medium');
    for (const problem of mediumUnsolved) {
      if (!recommendations.find(r => r.problemId === problem.id)) {
        recommendations.push({
          problemId: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          concept: problem.topic,
          reason: `Ready for a challenge? This will push your ${problem.topic} skills further.`,
        });
      }
      if (recommendations.length >= 5) break;
    }
  }

  return recommendations.slice(0, 5);
}
