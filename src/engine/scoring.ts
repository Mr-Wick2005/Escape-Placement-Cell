import { BALANCE } from '../config/balance';
import type { RoundProgress } from '../store/gameTypes';

export type RankTier = 'S' | 'A' | 'B' | 'C' | 'D';

export interface RankInfo {
  tier: RankTier;
  title: string;
  tagline: string;
  badgeColor: string;
  minScore: number;
}

export const RANKS: Record<RankTier, RankInfo> = {
  S: {
    tier: 'S',
    title: 'Offer in Hand',
    tagline: 'Candidate 404 stands above the 99th percentile. System access fully granted.',
    badgeColor: 'var(--gold)',
    minScore: 900,
  },
  A: {
    tier: 'A',
    title: 'Shortlisted',
    tagline: 'High technical aptitude and sharp interview delivery. Cleared for accelerated onboarding.',
    badgeColor: 'var(--green)',
    minScore: 750,
  },
  B: {
    tier: 'B',
    title: 'Waitlisted',
    tagline: 'Core competencies cleared the benchmark threshold. Added to priority requisition pool.',
    badgeColor: 'var(--cyan)',
    minScore: 600,
  },
  C: {
    tier: 'C',
    title: 'Needs Another Drive',
    tagline: 'Good foundation identified, but edge-case debugging and timed logic need refinement.',
    badgeColor: 'var(--violet)',
    minScore: 400,
  },
  D: {
    tier: 'D',
    title: 'Back to Practice',
    tagline: 'The facility doors open to release you to practice. Return stronger on the next cycle.',
    badgeColor: 'var(--danger)',
    minScore: 0,
  },
};

export function calculateStyleBonus(
  rounds: Record<'aptitude' | 'coding' | 'interview', RoundProgress>,
  integrity: number
): number {
  const totalHints = rounds.aptitude.hintsUsed + rounds.coding.hintsUsed + rounds.interview.hintsUsed;
  const hintDeductions = totalHints * BALANCE.penalties.hint;
  const integrityFactor = Math.floor((integrity / BALANCE.integrity.max) * 20);
  const baseBonus = 30 + integrityFactor;
  const finalBonus = Math.max(0, Math.min(BALANCE.scoring.styleMax, baseBonus - hintDeductions));
  return finalBonus;
}

export function calculateTotalScore(
  rounds: Record<'aptitude' | 'coding' | 'interview', RoundProgress>,
  integrity: number
): { total: number; styleBonus: number } {
  const roundSum = rounds.aptitude.score + rounds.coding.score + rounds.interview.score;
  const styleBonus = calculateStyleBonus(rounds, integrity);
  const total = Math.min(BALANCE.scoring.totalMax, Math.max(0, roundSum + styleBonus));
  return { total, styleBonus };
}

export function getRank(score: number): RankInfo {
  if (score >= RANKS.S.minScore) return RANKS.S;
  if (score >= RANKS.A.minScore) return RANKS.A;
  if (score >= RANKS.B.minScore) return RANKS.B;
  if (score >= RANKS.C.minScore) return RANKS.C;
  return RANKS.D;
}

export interface RadarSkills {
  quant: number;
  logic: number;
  verbal: number;
  debugging: number;
  coding: number;
  communication: number;
  confidence: number;
}

export function calculateRadarSkills(
  rounds: Record<'aptitude' | 'coding' | 'interview', RoundProgress>,
  integrity: number
): RadarSkills {
  const aptPct = rounds.aptitude.maxScore > 0 ? rounds.aptitude.score / rounds.aptitude.maxScore : 0;
  const codePct = rounds.coding.maxScore > 0 ? rounds.coding.score / rounds.coding.maxScore : 0;
  const intPct = rounds.interview.maxScore > 0 ? rounds.interview.score / rounds.interview.maxScore : 0;
  const intgPct = Math.max(0, Math.min(1, integrity / 100));

  const quant = Math.round(Math.min(100, Math.max(25, aptPct * 90 + 10)));
  const logic = Math.round(Math.min(100, Math.max(30, (aptPct * 0.6 + codePct * 0.4) * 85 + 15)));
  const verbal = Math.round(Math.min(100, Math.max(20, (aptPct * 0.3 + intPct * 0.7) * 88 + 12)));
  const debugging = Math.round(Math.min(100, Math.max(25, codePct * 92 + 8)));
  const coding = Math.round(Math.min(100, Math.max(20, (codePct * 0.85 + aptPct * 0.15) * 95 + 5)));
  const communication = Math.round(Math.min(100, Math.max(25, intPct * 90 + 10)));
  const confidence = Math.round(Math.min(100, Math.max(30, intgPct * 60 + intPct * 40)));

  return { quant, logic, verbal, debugging, coding, communication, confidence };
}

export interface ReportAnalysis {
  strengths: string[];
  improvements: string[];
  actionPlan: string[];
}

export function generateAnalysis(
  _rounds: Record<'aptitude' | 'coding' | 'interview', RoundProgress>,
  skills: RadarSkills
): ReportAnalysis {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const actionPlan: string[] = [];

  // Evaluate Aptitude
  if (skills.quant >= 75) {
    strengths.push('Rapid quantitative intuition and mathematical deduction under pressure.');
  } else {
    improvements.push('Speed and consistency on quantitative ratios and multi-variable word problems.');
    actionPlan.push('Practice 15 timed quantitative aptitude problems daily focusing on speed shortcuts.');
  }

  // Evaluate Logic & Patterns
  if (skills.logic >= 75) {
    strengths.push('Exceptional pattern recognition across complex symbolic sequences.');
  } else {
    improvements.push('Systematic breakdown of deductive ciphers and logical premise chains.');
    actionPlan.push('Work on formal syllogisms and pattern matrices to eliminate guesswork.');
  }

  // Evaluate Coding & Debugging
  if (skills.coding >= 80 && skills.debugging >= 80) {
    strengths.push('High-precision debugging, off-by-one spot checks, and clean algorithmic synthesis.');
  } else if (skills.coding >= 70) {
    strengths.push('Sound core programming syntax and deterministic test verification.');
  } else {
    improvements.push('Edge-case handling (empty inputs, zero values, recursion boundaries).');
    actionPlan.push('Revise classic array, string manipulation, and recursive boundary conditions.');
  }

  // Evaluate Communication & STAR
  if (skills.communication >= 75) {
    strengths.push('Structured articulation utilizing STAR storytelling and verifiable team outcomes.');
  } else {
    improvements.push('Answer conciseness and quantifiable impact metrics during behavioral questions.');
    actionPlan.push('Structure project answers with Situation, Task, Action, and quantifiable Result.');
  }

  // Evaluate Confidence & Integrity
  if (skills.confidence >= 80) {
    strengths.push('High composure under scrutiny, avoiding hesitation markers and filler language.');
  } else {
    improvements.push('Vocal assertiveness and elimination of hedging phrases ("I guess", "kind of").');
    actionPlan.push('Practice mock speaking prompts with a 60-second timer to build concise delivery.');
  }

  // Ensure minimum counts
  const defaultStrengths = [
    'Consistent persistence through multi-wing testing protocols.',
    'Adaptable problem-solving across disparate technical domains.',
    'Quick recovery and calm composure during high-pressure evaluation.',
  ];
  for (const s of defaultStrengths) {
    if (strengths.length < 3 && !strengths.includes(s)) {
      strengths.push(s);
    }
  }

  const defaultImprovements = [
    'Time-budgeting across complex multi-step evaluations.',
    'Active verification of return signatures before final submission.',
    'Stress-testing edge cases and recursion limits under tight constraints.',
  ];
  for (const imp of defaultImprovements) {
    if (improvements.length < 3 && !improvements.includes(imp)) {
      improvements.push(imp);
    }
  }

  const defaultActions = [
    'Simulate end-to-end 20-minute timed mock tests to build sustained exam stamina.',
    'Create a cheat-sheet of your top 3 engineering project milestones for interviews.',
    'Practice vocal clarity exercises using the 60-second elevator pitch framework.',
  ];
  for (const act of defaultActions) {
    if (actionPlan.length < 3 && !actionPlan.includes(act)) {
      actionPlan.push(act);
    }
  }

  return {
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    actionPlan: actionPlan.slice(0, 4),
  };
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}
