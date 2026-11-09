import { describe, expect, it } from 'vitest';
import {
  calculateRadarSkills,
  calculateStyleBonus,
  calculateTotalScore,
  formatDuration,
  generateAnalysis,
  getRank,
} from './scoring';
import type { RoundProgress } from '../store/gameTypes';

const makeRound = (score: number, maxScore: number, hintsUsed = 0): RoundProgress => ({
  status: 'CLEARED',
  score,
  maxScore,
  timeUsed: 120,
  hintsUsed,
  attempts: 1,
});

describe('scoring engine', () => {
  it('correctly maps rank boundaries', () => {
    expect(getRank(1000).tier).toBe('S');
    expect(getRank(900).tier).toBe('S');
    expect(getRank(899).tier).toBe('A');
    expect(getRank(750).tier).toBe('A');
    expect(getRank(749).tier).toBe('B');
    expect(getRank(600).tier).toBe('B');
    expect(getRank(599).tier).toBe('C');
    expect(getRank(400).tier).toBe('C');
    expect(getRank(399).tier).toBe('D');
    expect(getRank(0).tier).toBe('D');
  });

  it('calculates style bonus and total score correctly with bounds', () => {
    const rounds = {
      aptitude: makeRound(300, 300, 0),
      coding: makeRound(350, 350, 0),
      interview: makeRound(300, 300, 0),
    };
    const { total, styleBonus } = calculateTotalScore(rounds, 100);
    expect(styleBonus).toBeGreaterThanOrEqual(0);
    expect(styleBonus).toBeLessThanOrEqual(50);
    expect(total).toBe(1000); // capped at totalMax
  });

  it('penalizes hints in style bonus', () => {
    const roundsZeroHints = {
      aptitude: makeRound(200, 300, 0),
      coding: makeRound(250, 350, 0),
      interview: makeRound(200, 300, 0),
    };
    const roundsWithHints = {
      aptitude: makeRound(200, 300, 3),
      coding: makeRound(250, 350, 2),
      interview: makeRound(200, 300, 1),
    };
    const bonusZero = calculateStyleBonus(roundsZeroHints, 100);
    const bonusHints = calculateStyleBonus(roundsWithHints, 100);
    expect(bonusHints).toBeLessThan(bonusZero);
  });

  it('computes radar skills within 0..100 range', () => {
    const rounds = {
      aptitude: makeRound(240, 300),
      coding: makeRound(310, 350),
      interview: makeRound(270, 300),
    };
    const skills = calculateRadarSkills(rounds, 85);
    for (const val of Object.values(skills)) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(100);
    }
    expect(skills.coding).toBeGreaterThan(60);
    expect(skills.communication).toBeGreaterThan(60);
  });

  it('generates report strengths and improvements reliably', () => {
    const rounds = {
      aptitude: makeRound(280, 300),
      coding: makeRound(340, 350),
      interview: makeRound(290, 300),
    };
    const skills = calculateRadarSkills(rounds, 90);
    const analysis = generateAnalysis(rounds, skills);
    expect(analysis.strengths.length).toBe(3);
    expect(analysis.improvements.length).toBe(3);
    expect(analysis.actionPlan.length).toBeGreaterThanOrEqual(3);
  });

  it('formats duration correctly', () => {
    expect(formatDuration(0)).toBe('0m 00s');
    expect(formatDuration(65000)).toBe('1m 05s');
    expect(formatDuration(1254000)).toBe('20m 54s');
  });
});
