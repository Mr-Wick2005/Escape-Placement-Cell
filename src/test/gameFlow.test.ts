import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from '../store/gameStore';
import { getRank, calculateRadarSkills, generateAnalysis } from '../engine/scoring';

describe('full game progression integration', () => {
  beforeEach(() => {
    localStorage.clear();
    useGameStore.getState().reset();
  });

  it('progresses seamlessly from Title through all wings to Report', () => {
    const store = useGameStore;

    // 1. Initial State
    expect(store.getState().screen).toBe('TITLE');
    expect(store.getState().fragments.A).toBeNull();
    expect(store.getState().fragments.B).toBeNull();
    expect(store.getState().fragments.C).toBeNull();

    // 2. Begin Game -> Intro -> Hub
    store.getState().beginGame();
    expect(store.getState().screen).toBe('INTRO');
    store.getState().transition('HUB');
    expect(store.getState().screen).toBe('HUB');

    // Wing states in Hub
    expect(store.getState().rounds.aptitude.status).toBe('AVAILABLE');
    expect(store.getState().rounds.coding.status).toBe('LOCKED');
    expect(store.getState().rounds.interview.status).toBe('LOCKED');

    // 3. Complete Aptitude Vault (Score 270/300, Fragment A "7319")
    store.getState().completeAptitude(270, '7319');
    expect(store.getState().fragments.A).toBe('7319');
    expect(store.getState().rounds.aptitude.status).toBe('CLEARED');
    expect(store.getState().rounds.coding.status).toBe('AVAILABLE');

    // 4. Complete Code Core (Score 350/350, Fragment B "CODE")
    store.getState().completeCoding(350, 'CODE');
    expect(store.getState().fragments.B).toBe('CODE');
    expect(store.getState().rounds.coding.status).toBe('CLEARED');
    expect(store.getState().rounds.interview.status).toBe('AVAILABLE');

    // 5. Complete Interview Chamber (Score 280/300, Fragment C "△○◇")
    store.getState().completeInterview(280, '△○◇');
    expect(store.getState().fragments.C).toBe('△○◇');
    expect(store.getState().rounds.interview.status).toBe('CLEARED');

    // Verify all 3 fragments are held
    const { fragments } = store.getState();
    expect(fragments.A).toBe('7319');
    expect(fragments.B).toBe('CODE');
    expect(fragments.C).toBe('△○◇');

    // 6. Transition to Final Gate
    store.getState().transition('FINAL');
    expect(store.getState().screen).toBe('FINAL');

    // Test damage integrity on incorrect attempts
    const initialIntegrity = store.getState().integrity;
    store.getState().damageIntegrity(10);
    expect(store.getState().integrity).toBe(initialIntegrity - 10);

    // 7. Complete Final Gate with chosen riddle
    store.getState().completeFinalGate('analytical');
    expect(store.getState().screen).toBe('ENDING');
    expect(store.getState().riddleChoice).toBe('analytical');

    // Verify Rank and Scoring
    const totalScore = store.getState().totalScore;
    expect(totalScore).toBeGreaterThanOrEqual(900);
    const rank = getRank(totalScore);
    expect(rank.tier).toBe('S');

    // 8. Transition to Report
    store.getState().transition('REPORT');
    expect(store.getState().screen).toBe('REPORT');

    // Report metrics generation
    const skills = calculateRadarSkills(store.getState().rounds, store.getState().integrity);
    expect(skills.quant).toBeGreaterThan(70);
    expect(skills.coding).toBeGreaterThan(75);

    const analysis = generateAnalysis(store.getState().rounds, skills);
    expect(analysis.strengths.length).toBe(3);
    expect(analysis.improvements.length).toBe(3);
    expect(analysis.actionPlan.length).toBeGreaterThanOrEqual(3);

    // 9. Reset and Play Again
    store.getState().reset();
    expect(store.getState().screen).toBe('TITLE');
    expect(store.getState().totalScore).toBe(0);
    expect(store.getState().fragments.A).toBeNull();
  });
});
