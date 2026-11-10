import { describe, expect, it, beforeEach } from 'vitest';
import { useGameStore, createNewGame } from '../store/gameStore';
import { calculateTotalScore } from '../engine/scoring';

describe('Lockdown Flow & Integrity Recovery (Part 4.4, 4.5, 16.4)', () => {
  beforeEach(() => {
    useGameStore.setState(createNewGame());
  });

  it('triggers lockdown when integrity drops to 0 and tracks lockdown count', () => {
    const store = useGameStore.getState();
    expect(store.integrity).toBe(100);
    expect(store.isLockdown).toBe(false);

    // Damage integrity completely
    store.damageIntegrity(100);

    const updated = useGameStore.getState();
    expect(updated.integrity).toBe(0);
    expect(updated.isLockdown).toBe(true);
    expect(updated.lockdowns).toBe(1);
  });

  it('clears lockdown, restoring integrity to 40 for instant retry', () => {
    const store = useGameStore.getState();
    store.damageIntegrity(100);

    expect(useGameStore.getState().isLockdown).toBe(true);

    // Player or timer triggers clearLockdown
    useGameStore.getState().clearLockdown();

    const restored = useGameStore.getState();
    expect(restored.integrity).toBe(40);
    expect(restored.isLockdown).toBe(false);
  });

  it('penalizes Style bonus by 25 points per lockdown in final score', () => {
    const state = useGameStore.getState();
    const rounds = state.rounds;

    // Normal score with 0 lockdowns
    const scoreZero = calculateTotalScore(rounds, 100, 0);

    // Score with 1 lockdown
    const scoreOne = calculateTotalScore(rounds, 100, 1);

    expect(scoreZero.styleBonus - scoreOne.styleBonus).toBe(25);
  });
});
