import { describe, expect, it, beforeEach } from 'vitest';
import { useGameStore, createNewGame } from '../store/gameStore';
import { saveGame, loadGame } from '../store/persist';

describe('Mid-round State Persistence & Hydration (Part 16.4)', () => {
  beforeEach(() => {
    localStorage.clear();
    useGameStore.setState(createNewGame());
  });

  it('correctly persists and resumes an in-progress round after reload', () => {
    const store = useGameStore.getState();
    store.beginGame();
    store.startRound('aptitude');

    const midRoundState = useGameStore.getState();
    expect(midRoundState.screen).toBe('APTITUDE');
    expect(midRoundState.rounds.aptitude.status).toBe('IN_PROGRESS');
    expect(midRoundState.rounds.aptitude.attempts).toBe(1);

    // Save state as would happen on transition
    saveGame(midRoundState);

    // Simulate page reload: fresh store loading from localStorage
    const reloaded = loadGame();
    expect(reloaded).not.toBeNull();
    expect(reloaded?.screen).toBe('APTITUDE');
    expect(reloaded?.rounds.aptitude.status).toBe('IN_PROGRESS');
    expect(reloaded?.rounds.aptitude.attempts).toBe(1);
    expect(reloaded?.startedAt).toBe(midRoundState.startedAt);
  });

  it('retains earned fragments across reloads', () => {
    const store = useGameStore.getState();
    store.beginGame();
    store.completeAptitude(300, '7319');

    const saved = useGameStore.getState();
    expect(saved.fragments.A).toBe('7319');

    saveGame(saved);

    const reloaded = loadGame();
    expect(reloaded?.fragments.A).toBe('7319');
    expect(reloaded?.rounds.aptitude.status).toBe('CLEARED');
    expect(reloaded?.rounds.coding.status).toBe('AVAILABLE');
  });
});
